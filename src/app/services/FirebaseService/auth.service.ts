import { Injectable } from '@angular/core';
import {
  GoogleAuthProvider,
  onAuthStateChanged,
  signInAnonymously,
  signInWithCredential,
  UserInfo,
} from '@angular/fire/auth';
import {
  getDatabase,
  onDisconnect,
  onValue,
  ref,
  set,
} from '@angular/fire/database';
import {
  doc,
  Firestore,
  getDoc,
  serverTimestamp,
  setDoc,
  updateDoc,
} from '@angular/fire/firestore';
import { GoogleAuth } from '@codetrix-studio/capacitor-google-auth';
import { getAuth, signOut } from 'firebase/auth';
import { serverTimestamp as RL_serverTimestamp } from 'firebase/database';
import { BehaviorSubject } from 'rxjs';
import { environment } from 'src/environments/environment.prod';
import { AppService } from '../AppService/app.service';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private userStatusDatabaseRef: any;
  private user$ = new BehaviorSubject<UserInfo | null | undefined>(undefined);
  public user = this.user$.asObservable();

  constructor(private firestore: Firestore,private appService:AppService) {
    onAuthStateChanged(getAuth(), async (user) => {
      this.user$.next(user);

      if (user) {
        const uid = user.uid;
        // appService to handle app state
        this.appService.updateUserUid(uid)
        // get ref for relatime db to update user online status
        this.updateUserOnlineStatus(uid)
      }
    });
  }

  async loginAnonymously() {
    try {
      const auth = getAuth();
      const credential = await signInAnonymously(auth);
      const user = credential.user;
      console.log('User signed in anonymously:', user);

      // Custom displayName and email for anonymous users
      const customDisplayName = `Anonymous_${user.uid}`;
      const customEmail = 'unknown';

      // Check if user is new
      const userDocRef = doc(this.firestore, 'users', user.uid);
      const docSnapshot = await getDoc(userDocRef);

      if (!docSnapshot.exists()) {
        // User is new, create a new document in Firestore
        await setDoc(userDocRef, {
          uid: user.uid,
          displayName: customDisplayName,
          email: customEmail,
          status: 'online',
          lastLogin: serverTimestamp(),
          loginMethod: 'anonymous',
        });
      } else {
        try {
          const user = getAuth().currentUser;
          if (user) {
            await this.updateUserLogStatus(user.uid, 'login', 'online');
          } else {
            this.logout()
          }
        } catch (error) {
          console.log("Falied to current user");
        }
      }

      this.user$.next(user);
    } catch (error) {
      console.error('Error signing in anonymously:', error);
    }
  }

  async loginWithGoogle() {
    try {
      const googleUser = await GoogleAuth.signIn();
      signInWithCredential(
        getAuth(),
        GoogleAuthProvider.credential(googleUser.authentication.idToken)
      )
        .then(async (res) => {
          console.log('res data:: ', res);
          this.user$.next(res.user);
          // Check if user is new
          const userDocRef = doc(this.firestore, 'users', res.user.uid);
          const docSnapshot = await getDoc(userDocRef);

          if (!docSnapshot.exists()) {
            // User is new, create a new document in Firestore
            await setDoc(userDocRef, {
              uid: this.user$.value?.uid,
              displayName: this.user$.value?.displayName,
              email: this.user$.value?.email,
              status: 'online',
              lastLogin: serverTimestamp(),
            });
          } else {
            try {
              const user = getAuth().currentUser;
              if (user) {
                await this.updateUserLogStatus(user.uid, 'login', 'online');
              } else {
                this.logout()
              }
            } catch (error) {
              console.log("Falied to current user");
            }
          }
        })
        .catch((err) => {
          console.log('error signInWithCredential', err);
        });
    } catch (error) {
      console.log('error::', error);
    }
  }

  async logout() {
    try {
      const user = getAuth().currentUser;
      if (user) {
        await this.updateUserLogStatus(user.uid, 'logout', 'offline');
      }
      await signOut(getAuth());
      await GoogleAuth.signOut();
      this.user$.next(undefined);
      console.log('sign out');
    } catch (error) {
      console.error('Error logging out:', error);
    }
  }

  private async updateUserLogStatus(uid: string, action: 'login' | 'logout', status: 'online' | 'offline') {
    const userDocRef = doc(this.firestore, 'users', uid);
    if (action === 'login') {
      await updateDoc(userDocRef, {
        status: status,
        lastLogin: status === 'online' ? serverTimestamp() : null,
      });
    } else if (action == "logout") {
      await updateDoc(userDocRef, {
        status: status,
        lastLogout: status === 'offline' ? serverTimestamp() : null,
      });
    } else {
      console.error("ERROR:impplement updateUserLogStatus logic");
    }

  }

  private updateUserOnlineStatus(uid: string) {
    const database = getDatabase();
    this.userStatusDatabaseRef = ref(
      database,
      `/${environment.RealTimeDatabseRef.OnlineStatus}/${uid}`
    );

    const isOffline = {
      state: 'offline',
      last_changed: RL_serverTimestamp(),
    };

    const isOnline = {
      state: 'online',
      last_changed: RL_serverTimestamp(),
    };

    //get reference from database that monitors the connection status of the client.
    const connectedRef = ref(database, '.info/connected');
    onValue(connectedRef, (snapshot) => {
      if (snapshot.val() === false) {
        return;
      }

      //update the status depend on firebase client connection
      onDisconnect(this.userStatusDatabaseRef)
        .set(isOffline)
        .then(() => {
          set(this.userStatusDatabaseRef, isOnline);
        });
    });
  }
}
