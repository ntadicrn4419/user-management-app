import { Injectable, OnDestroy } from '@angular/core';
import { HttpBackend, HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { Permission, User } from '../models';
import { BehaviorSubject } from 'rxjs';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class ApiService implements OnDestroy{
  
  private readonly apiUrl = environment.apiUrl;
  private _users = new BehaviorSubject<User[]>([]);
  users$ = this._users.asObservable();

  constructor(private httpClient: HttpClient, private router: Router) {}
  
  login(email: string, password: string) {
    return this.httpClient
      .post<any>(`${this.apiUrl}/auth/login`, { email, password })
      .subscribe((res: any) => {
        localStorage.setItem('jwt_token', res.jwt);
        this.router.navigate(['/users']);
      });
    }
    
  getAllUsers() {
    return this.httpClient
      .get<any>(`${this.apiUrl}/api/users`)
      .subscribe((response) => {
        this._users.next(response.users);
      });
  }

  createUser(
    firstname: string,
    lastname: string,
    email: string,
    password: string,
    permissionList?: Permission[]
    ) {
    return this.httpClient
      .post<any>(`${this.apiUrl}/api/users/add`, {
        firstname,
        lastname,
        email,
        password,
        permissionList,
      })
      .subscribe((response) => {
        this._users.next(response.users);
        this.router.navigate(['/users']);
      });
  }
  
  findUserByEmail(userEmail: string) {}

  updateUser() {}

  deleteUser() {}

  ngOnDestroy(): void {
    this._users.unsubscribe();
  }
}
