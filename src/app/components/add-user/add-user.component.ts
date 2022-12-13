import { Component, OnInit, Output } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { ApiService } from 'src/app/services/api.service';

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

  constructor(private apiService: ApiService, private router: Router) {}

  ngOnInit(): void {}

  addUser() {
    const firstname = this.addUserForm.get('firstname')?.value;
    const lastname = this.addUserForm.get('lastname')?.value;
    const email = this.addUserForm.get('email')?.value;
    const password = this.addUserForm.get('password')?.value;
    this.apiService.createUser(firstname!, lastname!, email!, password!);
  }
}
