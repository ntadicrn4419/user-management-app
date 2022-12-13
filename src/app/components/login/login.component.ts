import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { ApiService } from 'src/app/services/api.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  loginFormGroup = new FormGroup({
    email: new FormControl(''),
    password: new FormControl(''),
  });

  constructor(private apiService: ApiService) { }
  
  ngOnInit(): void {
  }

  login(){
    const email = this.loginFormGroup.get('email')?.value;
    const password = this.loginFormGroup.get('password')?.value;

    this.apiService.login(email!, password!);
  }

  
}
