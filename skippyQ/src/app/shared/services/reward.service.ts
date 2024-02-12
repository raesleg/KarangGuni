import { Injectable } from '@angular/core';
import firebase from 'firebase';
import { Reward } from './models/reward';

@Injectable({
  providedIn: 'root'
})
export class RewardService {
  private rewardRef = firebase.firestore().collection('reward');

  constructor() { }

  async getUserRewards(email: string): Promise<Reward> {
    try {
      const querySnapshot = await this.rewardRef.where('userEmail', '==', email).get();
  
      if (!querySnapshot.empty) {
        const doc = querySnapshot.docs[0];
        const data = doc.data() as Reward;
  
        return data;
      } else {
        console.log(`User with email ${email} not found in the "rewards" collection`);
        // Returning an empty Profile object
        return {} as Reward;
      }
    } catch (error) {
      console.error('Error getting user rewards:', error);
      throw error;
    }
  }
  
  async createReward(reward: Reward) {
    try {
      this.rewardRef.add ( {
        userEmail: reward.userEmail,
        points: reward.points,
        voucherId: reward.voucherID
      });
    } catch (error) {
      console.error('Creating new reward error:', error);
      throw error;
    }
  }

  async addVoucher(userEmail: string, voucherId: string, pointsRequired: number) {
    try {
      const querySnapshot = await this.rewardRef.where('userEmail', '==', userEmail).get();
  
      if (!querySnapshot.empty) {
        const rewardDoc = querySnapshot.docs[0].ref;
        const currentData = (await rewardDoc.get()).data();
  
        if (currentData) {
          const currentPoints = currentData['points'] || 0;
          const currentVoucherIDs = currentData['voucherID'] || [];
  
          if (currentPoints >= pointsRequired) {
            // Update the voucherID field and subtract points
            await rewardDoc.update({
              voucherID: [...currentVoucherIDs, voucherId],
              points: currentPoints - pointsRequired
            });
  
            console.log('Voucher added successfully, points deducted');
          } else {
            console.log('Insufficient points for this voucher');
          }
        } else {
          console.log('Document data not found');
        }
      } else {
        console.log(`User with email ${userEmail} not found in the "rewards" collection`);
      }
    } catch (error) {
      console.error('Adding voucher error:', error);
      throw error;
    }
  }
  

}
