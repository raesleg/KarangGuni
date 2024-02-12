import { Injectable } from '@angular/core';
import firebase from 'firebase';
import { Profile } from './models/profile';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private profileRef = firebase.firestore().collection('profile');
  private storageRef = firebase.storage().ref();

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

  getCurrentUser(): firebase.User | null {
    return firebase.auth().currentUser;
  }

  async getUserProfile(email: string): Promise<Profile> {
    try {
      const doc = await this.profileRef.doc(email).get();

      if (doc.exists) {
        const data = doc.data() as Profile;

        if (data['imagePath']) {
          const imageRef = this.storageRef.child(data['imagePath']);

          // Check if the image exists before trying to get its download URL
          try {
            await imageRef.getMetadata();
            const url = await imageRef.getDownloadURL();
            data['imagePath'] = url;
          } catch (err) {
            console.log('Error: Read image fail ' + err);
          }
        }

        return data;
      } else {
        console.log(`User with email ${email} not found in the "profile" collection`);
        // Returning an empty Profile object
        // return {} as Profile;
        // Alternatively, you can throw an error
        throw new Error(`Account does not exist`);
      }
    } catch (error) {
      console.error('Error getting user info:', error);
      throw error;
    }
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
  
      return userCredential;
    } catch (error) {
      console.error('Registration error:', error);
      throw error;
    }
  }

  async updateShippingAddress(email: string, newShippingAddress: string) {
    try {
      // Update the shipping address directly
      await this.profileRef.doc(email).update({
        shippingAddress: newShippingAddress
      });
    } catch (error) {
      console.error('Error updating shipping address:', error);
      throw error;
    }
  }

  async updateProfile(profile: Profile, file: File | undefined) {
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

        if (file) {
          const filePath = `${'profilePhotos/' + file.name}`;
          this.storageRef.child(filePath).put(file);
          updatedProfile.imagePath = filePath;
        }

         // Add shippingAddress to updatedProfile only if it's defined
        if (profile.shippingAddress !== undefined) {
          updatedProfile.shippingAddress = profile.shippingAddress;
        }

        // Check if currentUser.email is not null before updating the document
        if (currentUser.email) {
          await this.profileRef.doc(currentUser.email).update(updatedProfile);
          console.log(updatedProfile);
          return updatedProfile;
        } else {
          throw new Error('User email is null');
        }
      }
    throw new Error('Current user is null');
    } catch (error) {
      console.error('Profile update error:', error);
      throw error; 
    }
  }

  uploadProfilePhoto(image: File): Promise<string> {
    const storageRef = firebase.storage().ref(`profilePhotos/${image}`);
    return storageRef.put(image).then(() => storageRef.getDownloadURL());
  }
  
  getUserRoleByEmail(email: string): Promise<boolean | null> {
    //const currentUser = this.getCurrentUser();
    const usersCollection = firebase.firestore().collection('profile');

    return usersCollection.doc(email).get().then((doc) => {
      if (doc.exists) {
        const userRole = doc.get('isAdmin');
        return userRole;
      } else {
        console.log('User not found in the "users" collection');
        return null;
      }
    }).catch((error) => {
      console.error('Error getting user role:', error);
      return null;
    });
  }
  
}
