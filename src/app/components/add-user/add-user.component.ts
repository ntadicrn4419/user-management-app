import { Component, OnInit, Output } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { startWith } from 'rxjs';
import { Permission } from 'src/app/models';
import { ApiService } from 'src/app/services/api.service';
import { MyAuthService } from 'src/app/services/my-auth.service';

@Component({
  selector: 'app-add-user',
  templateUrl: './add-user.component.html',
  styleUrls: ['./add-user.component.css'],
})
export class AddUserComponent implements OnInit {

  CAN_READ: string = 'CAN READ';
  CAN_CREATE: string = 'CAN READ & CREATE';
  CAN_UPDATE: string = 'CAN READ, CREATE & UPDATE';
  CAN_DELETE: string = 'CAN READ, CREATE, UPDATE & DELETE';

  addUserForm = new FormGroup({
    firstname: new FormControl(''),
    lastname: new FormControl(''),
    email: new FormControl(''),
    password: new FormControl(''),
    permissions: new FormControl(this.CAN_READ),
  });

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
  get permissions() {
    return this.addUserForm.get('permissions')?.value!;
  }
  get permissionsFormControl() {
    return this.addUserForm.get('permissions');
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

  addUser() {
    const permissionList = this.createPermissionList(this.permissions);
    this.apiService.createUser(
      this.firstname,
      this.lastname,
      this.email,
      this.password,
      permissionList
    );
  }

  private createPermissionList(permissions: string): Permission[] {
    const resultList = [];
    switch (permissions) {
      case this.CAN_READ:
        resultList.push(Permission.CAN_READ_USERS);
        break;
      case this.CAN_CREATE:
        resultList.push(Permission.CAN_READ_USERS, Permission.CAN_CREATE_USERS);
        break;
      case this.CAN_UPDATE:
        resultList.push(
          Permission.CAN_READ_USERS,
          Permission.CAN_CREATE_USERS,
          Permission.CAN_UPDATE_USERS
        );
        break;
      case this.CAN_DELETE:
        resultList.push(
          Permission.CAN_READ_USERS,
          Permission.CAN_CREATE_USERS,
          Permission.CAN_UPDATE_USERS,
          Permission.CAN_DELETE_USERS
        );
        break;
      default:
        resultList.push(Permission.CAN_READ_USERS);
    }
    return resultList;
  }
}
