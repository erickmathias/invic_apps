import { Injectable } from '@angular/core';

import { getFirebaseBackend } from '../../authUtils';

import { User } from '../models/auth.models';
import {HttpClient} from "@angular/common/http";
import { Router } from '@angular/router';
import {environment} from "../../../environments/environment";
import {UserProfile} from "../../shared/models/user-profile";
import {BehaviorSubject} from "rxjs";

@Injectable({ providedIn: 'root' })

export class AuthenticationService {

    user: User;
    authUrl: String = environment.authUrl;
  userProfile = new BehaviorSubject<UserProfile | null>(null);

  constructor(private httpClient: HttpClient, private router: Router) {
  }

    /**
     * Returns the current user
     */
    public currentUser(): User {
        return getFirebaseBackend().getAuthenticatedUser();
    }

    /**
     * Performs the auth
     * @param email email of user
     * @param password password of user
     */
    login(email: string, password: string) {
        return getFirebaseBackend().loginUser(email, password).then((response: any) => {
            const user = response;
            return user;
        });
    }

    /**
     * Performs the register
     * @param email email
     * @param password password
     */
    register(email: string, password: string) {
        return getFirebaseBackend().registerUser(email, password).then((response: any) => {
            const user = response;
            return user;
        });
    }

    /**
     * Reset password
     * @param email email
     */
    resetPassword(email: string) {
        return getFirebaseBackend().forgetPassword(email).then((response: any) => {
            const message = response.data;
            return message;
        });
    }

    /**
     * Logout the user
     */
    logout() {
        // logout the user
       // getFirebaseBackend().logout();
    }

  register2(data){
    return this.httpClient.post<any>(`${this.authUrl}/register/`, data);
    }

  login2(data) {
    return this.httpClient.post<any>(`${this.authUrl}/login/`, data);
  }

  logOut() {
    sessionStorage.clear();
    console.log(`Logged Out`);
    this.userProfile.next(null);
    this.router.navigate(['/account/login']);
  }
}

