import { Component, OnInit, Output } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { Permission } from 'src/app/models';
import { ApiService } from 'src/app/services/api.service';
import { MyAuthService } from 'src/app/services/my-auth.service';

@Component({
  selector: 'app-add-user',
  templateUrl: './add-user.component.html',
  styleUrls: ['./add-user.component.css'],
})
export class AddUserComponent implements OnInit {

  addUserForm = new FormGroup({
    firstname: new FormControl(''),
    lastname: new FormControl(''),
    email: new FormControl(''),
    password: new FormControl(''),
  });

  permissionList: Permission[] = [Permission.CAN_READ_USERS]; // by default, new user can READ other users

  get firstname() {
    return this.addUserForm.get('firstname')?.value!;
  }
  get lastname() {
    return this.addUserForm.get('lastname')?.value!;
  }
  get email() {
    return this.addUserForm.get('email')?.value!;
  }
  get password() {
    return this.addUserForm.get('password')?.value!;
  }

  authorised: boolean = false;

  constructor(
    private apiService: ApiService,
    private myAuthService: MyAuthService
  ) {}

  ngOnInit(): void {
    this.authorised = this.myAuthService.isAuthorised(
      Permission.CAN_CREATE_USERS
    );
  }

  refreshPermissionList(permissions: Permission[]) {
    this.permissionList = permissions;
  }

  addUser() {
    this.apiService.createUser(
      this.firstname,
      this.lastname,
      this.email,
      this.password,
      this.permissionList,
    );
  }

  
}
