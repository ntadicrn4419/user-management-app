import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';
import { Subscription, switchMap } from 'rxjs';
import { Permission, User } from 'src/app/models';
import { ApiService } from 'src/app/services/api.service';
import { MyAuthService } from 'src/app/services/my-auth.service';

@Component({
  selector: 'app-single-user',
  templateUrl: './single-user.component.html',
  styleUrls: ['./single-user.component.css']
})
export class SingleUserComponent implements OnInit, OnDestroy{
  user!: User;
  private subscription!: Subscription;

  editUserForm = new FormGroup({
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
  
  authorisedToDelete: boolean = false;
  authorisedToUpdate: boolean = false;

  constructor(private route: ActivatedRoute, private apiService: ApiService, private router: Router,  private myAuthService: MyAuthService) { }

  ngOnInit(): void {

    this.authorisedToDelete = this.myAuthService.isAuthorised(Permission.CAN_DELETE_USERS);
    this.authorisedToUpdate = this.myAuthService.isAuthorised(Permission.CAN_UPDATE_USERS);

    this.subscription = this.route.params.subscribe(params => {
      this.apiService.findUserByEmail(params['email']).subscribe((user) =>{
        this.user = user;
      })
    });
  }
  
  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  editUser() {
    const firstname = this.editUserForm.get('firstname')?.value;
    const lastname = this.editUserForm.get('lastname')?.value;
    const email = this.editUserForm.get('email')?.value;
    const password = this.editUserForm.get('password')?.value;

    const canRead = this.editUserForm.get('permissionForm')?.get('canRead')?.value;
    const canCreate = this.editUserForm.get('permissionForm')?.get('canCreate')?.value;
    const canUpdate = this.editUserForm.get('permissionForm')?.get('canUpdate')?.value;
    const canDelete = this.editUserForm.get('permissionForm')?.get('canDelete')?.value;

    const permissionList = this.createPermissionList(canRead!, canCreate!, canUpdate!, canDelete!);

    this.apiService.updateUser(firstname!, lastname!, email!, password!, permissionList)
      .subscribe((updatedUser) => {
        this.user = updatedUser;
      });
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

  deleteUser(){ 
    if(confirm('Are you sure you want to delete this user?')){
      this.apiService.deleteUser(this.user.email)
        .subscribe(() =>  {
          this.router.navigate(['/users']);
        })
    }
  }


}
