import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { AngularFireAuth } from '@angular/fire/auth';
import * as firebase from 'firebase';

import { BehaviorSubject, Observable } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class MessagingService {

  private messaging = firebase.messaging();
  public currentMessage = new BehaviorSubject(null);

  constructor(private db: AngularFirestore, private afAuth: AngularFireAuth) { }

  public updateToken(token){
    this.afAuth.authState.subscribe( user => {
      if (!user) {
        return;
      }

      // Update or set the token for the user
      const data = { ["token"]: token };
      this.db.collection("fcmTokens").doc(user.uid).set(data);
    })
  }

  public getPermission(){
    this.messaging.requestPermission()
    .then(() => {
      console.log('Notification permission granted.');
      return this.messaging.getToken()
    })
    .then(token => {
      console.log(token);
      this.updateToken(token);
    })
    .catch((err) => {
      console.log("Permission to notify refused.", err);
    });
  }

  public receiveMessage() {
    this.messaging.onMessage((payload) => {
      console.log("Message received. ", payload);
      this.currentMessage.next(payload);
    });
  }

  public getMessageSubject(): BehaviorSubject<string> {
    return this.currentMessage;
  }
}
