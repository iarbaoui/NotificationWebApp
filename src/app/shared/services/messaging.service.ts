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


  public getUser(){
    var email = "ilyass.arbaoui@gmail.com";
    var password = "password";
    firebase.auth().signInWithEmailAndPassword(email, password)
    .then((data) =>{
      console.log("User " + data.user.email + " is signed in.");
    })
    .catch( (error) => {
      console.log("Error: ", error);
    });
  }

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
      this.registerServiceWorker();
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
    console.log("Awaiting notifications");
    this.messaging.onMessage((payload) => {
      console.log("Message received. ", payload);
      this.currentMessage.next(payload);
    });
  }

  public registerServiceWorker(){
    navigator.serviceWorker.register('../../../firebase-messaging-sw.js')
    .then( (registration) => {
      this.messaging.useServiceWorker(registration);
      console.log("Registration done");
    })
    .catch( (error) => {
      console.log("Not found - Error : ", error);
    });
  }
}
