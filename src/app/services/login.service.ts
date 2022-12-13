import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class LoginService {
  constructor() {}

  isAuthenticated(): boolean {
    let token = localStorage.getItem('jwt_token');
    return token !== null ? true : false;
  }
}
