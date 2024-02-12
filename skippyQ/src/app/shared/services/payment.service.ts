import { Injectable } from '@angular/core';
import firebase from 'firebase/app';
import { Observable } from 'rxjs';
import { Product } from './models/product';
import { AuthService } from './auth.service';
import { Cart } from './models/cart';
import { Trans } from './models/trans';

@Injectable({
  providedIn: 'root'
})
export class PaymentService {

  totalAmount = 0;
  transactionID = "";
  buyeruserid: string;
  buyeruserName: string;

  constructor() { }
}
