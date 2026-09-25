import { Injectable, signal, computed, inject } from '@angular/core';
import { Auth, user, signInWithEmailAndPassword, createUserWithEmailAndPassword, signOut, updateProfile } from '@angular/fire/auth';
import { Firestore, doc, setDoc, getDoc } from '@angular/fire/firestore';
import { Observable } from 'rxjs';

export interface UserProfile {
  uid: string;
  email: string;
  displayName: string | null;
  role: 'admin' | 'user';
}

@Injectable({ providedIn: 'root' })
export class AuthService {
  private auth = inject(Auth);
  private firestore = inject(Firestore);

  user$ = user(this.auth);

  private _profile = signal<UserProfile | null>(null);
  readonly profile = this._profile.asReadonly();

  readonly isAdmin = computed(() => this._profile()?.role === 'admin');
  readonly isAuthenticated = computed(() => this._profile() !== null);

  constructor() {
    this.user$.subscribe(async (firebaseUser) => {
      if (firebaseUser) {
        // Fetch profile from Firestore
        const docRef = doc(this.firestore, `users/${firebaseUser.uid}`);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          this._profile.set(docSnap.data() as UserProfile);
        } else {
          // Fallback if no profile exists yet
          this._profile.set({
            uid: firebaseUser.uid,
            email: firebaseUser.email || '',
            displayName: firebaseUser.displayName,
            role: 'user'
          });
        }
      } else {
        this._profile.set(null);
      }
    });
  }

  async login(email: string, pass: string) {
    await signInWithEmailAndPassword(this.auth, email, pass);
  }

  async register(email: string, pass: string, name: string) {
    const cred = await createUserWithEmailAndPassword(this.auth, email, pass);
    await updateProfile(cred.user, { displayName: name });

    // Default new users to 'user' role
    const profile: UserProfile = {
      uid: cred.user.uid,
      email: email,
      displayName: name,
      role: 'user'
    };
    await setDoc(doc(this.firestore, `users/${cred.user.uid}`), profile);
    this._profile.set(profile);
  }

  async logout() {
    await signOut(this.auth);
  }
}
