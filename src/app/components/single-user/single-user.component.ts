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
export class SingleUserComponent implements OnInit, OnDestroy {
  private subscription!: Subscription;
  user!: User;
  permissionList: Permission[] = [];
  
  editUserForm = new FormGroup({
    firstname: new FormControl(''),
    lastname: new FormControl(''),
    email: new FormControl(''),
    password: new FormControl('')
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
        this.permissionList = user.permissionList;
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

    this.apiService.updateUser(firstname!, lastname!, email!, password!, this.permissionList)
      .subscribe((updatedUser) => {
        this.user = updatedUser;
      });
  }

  refreshPermissionList(permissions: Permission[]) {
    this.permissionList = permissions;
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
