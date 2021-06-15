import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { FormsModule } from '@angular/forms';
import { HomePage } from './home.page';
 
import { HomePageRoutingModule } from './home-routing.module';
import { ChartsModule } from 'ng2-charts';
import { Storage } from '@ionic/storage'
import { environment } from "../../environments/environment";

import { firebase, firebaseui, FirebaseUIModule } from 'firebaseui-angular';

const firebaseUiAuthConfig: firebaseui.auth.Config = {
  signInFlow: 'popup',
  signInOptions: [
    {
      provider: firebase.auth.EmailAuthProvider.PROVIDER_ID
    },
  ],
  tosUrl: '/terms',
  privacyPolicyUrl: '/privacy',
  credentialHelper: firebaseui.auth.CredentialHelper.NONE
};

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    HomePageRoutingModule,
    FirebaseUIModule.forRoot(firebaseUiAuthConfig),
    ChartsModule
  ],
  
  declarations: [HomePage]
})
export class HomePageModule {}
