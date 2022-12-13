import { Component, Input, OnInit } from '@angular/core';
import { User } from 'src/app/models';

@Component({
  selector: 'app-single-user',
  templateUrl: './single-user.component.html',
  styleUrls: ['./single-user.component.css']
})
export class SingleUserComponent implements OnInit {

  @Input() set user (value: User){
    this.email = value.email;
    this.firstname = value.firstname;
    this.lastname = value.lastname;
  }

  firstname?: string;
  lastname?: string;
  email?: string;
  
  constructor() { }

  ngOnInit(): void {
  }

}
