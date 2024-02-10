import { Injectable } from '@angular/core';
import firebase from 'firebase';
import { Profile } from './models/profile';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private profileRef = firebase.firestore().collection('profile');

  constructor() {}
  observeAuthState(func: firebase.Observer<any, Error> | ((a: firebase.User | null) => any))
    {
      return firebase.auth().onAuthStateChanged(func);
    }
  
  login(email: string, password: string) {
    return firebase.auth().signInWithEmailAndPassword(email, password);
  }

  logout() {
    return firebase.auth().signOut();
  }

  setUserData(email: string){
    localStorage.setItem('email', email)
  }

  getUserData(): string | null {
    return localStorage.getItem('email')
  }

  clearUserData(){
    localStorage.removeItem('email')
  }

  getCurrentUser(): firebase.User | null {
    return firebase.auth().currentUser;
  }

  async getUserProfile(email: string): Promise<Profile> {
    const profileCollection = this.profileRef;
  
    return profileCollection.doc(email).get().then(async (doc) => {
      if (doc.exists) {
        const data = doc.data() as Profile;

        if (data['imagePath']) {
          const imageDownloadURL = await this.getImageDownloadURL(data['imagePath']);
          data.image = imageDownloadURL; // Add the imageURL to the profile data
        }
        return data;
      } else {
        console.log(`User with email ${email} not found in the "profile" collection`);
        // Returning an empty Profile object
        // return {} as Profile;
        // Alternatively, you can throw an error
        throw new Error(`Account does not exist`);
      }
    }).catch((error) => {
      console.error('Error getting user info:', error);
      // You might want to throw an error here as well
      throw error;
    });
  }
  
  

  async register(profile: Profile) {
    try {
      // Step 1: Create user in Firebase Authentication
      const userCredential = await firebase.auth().createUserWithEmailAndPassword(
        profile.email,
        profile.password
      );
  
      // Step 2: Save additional user details in Firestore
      this.profileRef.doc(profile.email).set ( {
        userID: userCredential.user?.uid,
        isAdmin: profile.isAdmin,
        phoneNumber: profile.phoneNumber,
        name: profile.name,
        ageRange: profile.ageRange,
        shippingAddress: ''
      });
      // Optionally, you can return the userCredential or user object if needed
      return userCredential;
    } catch (error) {
      console.error('Registration error:', error);
      throw error; // Rethrow the error for the caller to handle
    }
  }

  // anna's code
  async updateShippingAddress(email: string, newShippingAddress : string) {
    try {
      // Check if the document exists
      const profileDoc = await this.profileRef.doc(email).get();
  
      if (profileDoc.exists) {
        // Document exists, update the shippingAddress field
        await this.profileRef.doc(email).update({
          shippingAddress: newShippingAddress
        });
        console.log(newShippingAddress);
        console.log('Shipping address updated successfully');
      } else {
        console.log(`User with email ${email} not found in the "profile" collection`);
      }
    } catch (error) {
      console.error('Error updating shipping address:', error);
      throw error;
    }
  }
  // end

  async updateProfile(profile: Profile, photoFile?: File) {
    try {
      const currentUser = await this.getCurrentUser();
  
      if (currentUser) {
        if (profile.password !== "") {
          await currentUser.updatePassword(profile.password);
        }
  
        // Prepare the updated fields
        const updatedProfile: any = {
          name: profile.name,
          phoneNumber: profile.phoneNumber,
          ageRange: profile.ageRange
        };
        // Add bio to updatedProfile only if it's defined
        if (profile.bio !== undefined) {
          updatedProfile.bio = profile.bio;
        }
        // Add shippingAddress to updatedProfile only if it's defined
        if (profile.shippingAddress !== undefined) {
          updatedProfile.shippingAddress = profile.shippingAddress;
        }

        // Check if a photo file is provided
        if (photoFile) {
          // Upload the photo and get the download URL
          const photoURL = await this.uploadProfilePhoto(currentUser.uid, photoFile);

          // Add the photoURL to the updatedProfile
          updatedProfile.imagePath = photoURL;
        }
  
        // Check if currentUser.email is not null before updating the document
        if (currentUser.email) {
          await this.profileRef.doc(currentUser.email).update(updatedProfile);
          return updatedProfile;
        } else {
          throw new Error('User email is null');
        }
      }
    // If currentUser is null, you might want to throw an error or handle the case accordingly
    throw new Error('Current user is null');
    } catch (error) {
      console.error('Profile update error:', error);
      throw error; // Rethrow the error for the caller to handle
    }
  }
  
  // Function to get the image download URL from Firebase Storage
  private async getImageDownloadURL(imagePath: string): Promise<string> {
    const storageRef = firebase.storage().ref(imagePath);
    const downloadURL = await storageRef.getDownloadURL();
    return downloadURL;
  }

  private async uploadProfilePhoto(uid: string, photoFile: File): Promise<string> {
    try {
      console.log('Before uploading file to storage');
      const storageRef = firebase.storage().ref(`profilePhotos/${uid}`);
      const photoSnapshot = await storageRef.put(photoFile);
      console.log('File uploaded to storage');
      const photoURL = await photoSnapshot.ref.getDownloadURL();
      console.log('Download URL retrieved');
      return photoURL;
    } catch (error) {
      console.error('Error uploading profile photo:', error);
      throw error;
    }
  }
  
  
}
