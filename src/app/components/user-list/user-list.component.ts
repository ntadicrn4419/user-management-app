import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { User } from 'src/app/models';
import { ApiService } from 'src/app/services/api.service';

@Component({
  selector: 'app-user-list',
  templateUrl: './user-list.component.html',
  styleUrls: ['./user-list.component.css']
})
export class UserListComponent implements OnInit {

  users: User[] = [];

  constructor(private apiService: ApiService, private router: Router) { }

  ngOnInit(): void {
    this.apiService.users$.subscribe( users => this.users = users);
    this.apiService.getAllUsers();
  }

  goToAddNewUserPage() {
    this.router.navigate(['/add-user']);
  }

}
