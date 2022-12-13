import { Component, OnInit, Output } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
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
    permissionForm: new FormGroup({
      canRead: new FormControl(false),
      canCreate: new FormControl(false),
      canUpdate: new FormControl(false),
      canDelete: new FormControl(false),
    }),
  });

  authorised: boolean = false;

  constructor(private apiService: ApiService, private myAuthService: MyAuthService) {}

  ngOnInit(): void {
    this.authorised = this.myAuthService.isAuthorised(Permission.CAN_CREATE_USERS);
  }

  addUser() {
    const firstname = this.addUserForm.get('firstname')?.value;
    const lastname = this.addUserForm.get('lastname')?.value;
    const email = this.addUserForm.get('email')?.value;
    const password = this.addUserForm.get('password')?.value;

    const canRead = this.addUserForm.get('permissionForm')?.get('canRead')?.value;
    const canCreate = this.addUserForm.get('permissionForm')?.get('canCreate')?.value;
    const canUpdate = this.addUserForm.get('permissionForm')?.get('canUpdate')?.value;
    const canDelete = this.addUserForm.get('permissionForm')?.get('canDelete')?.value;

    const permissionList = this.createPermissionList(canRead!, canCreate!, canUpdate!, canDelete!);

    this.apiService.createUser(firstname!, lastname!, email!, password!, permissionList);
  }

  private createPermissionList(canRead: boolean, canCreate: boolean, canUpdate: boolean, canDelete: boolean): Permission[]{
    const resultList = [];
    if(canRead) {
      resultList.push(Permission.CAN_READ_USERS);
    }
    if(canCreate) {
      resultList.push(Permission.CAN_CREATE_USERS);
    }
    if(canUpdate) {
      resultList.push(Permission.CAN_UPDATE_USERS);
    }
    if(canDelete) {
      resultList.push(Permission.CAN_DELETE_USERS);
    }
    return resultList;
  }
}
