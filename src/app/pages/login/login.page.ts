import { Component, OnInit } from '@angular/core';
import { AngularFireAuth } from "@angular/fire/auth";

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {

  curruser: any;


  constructor(public afAuth: AngularFireAuth,) { }

  async ngOnInit() {
    this.getUser();
  }

  async getUser(){
    this.afAuth.authState.subscribe(user=>{
      if(user)
        this.curruser = user.email;
        if(this.curruser != undefined){
          window.open('../home', "_self");
        }
    })
  }

}
