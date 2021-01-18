import { Component, OnInit } from '@angular/core';
import { UserDataService } from 'src/app/services/user-data/user-data.service';
import { NavController } from '@ionic/angular';

@Component({
  selector: 'app-password-reset',
  templateUrl: './password-reset.page.html',
  styleUrls: ['./password-reset.page.scss'],
})
export class PasswordResetPage implements OnInit {

  public login:any;
  public code:any;
  public resetCode:any;
  public passwordA:any;
  public passwordB:any;
  public step = 0;
  public submitted: any = false;

  constructor(private userData: UserDataService, private navCtrl: NavController) { }


  public verify():any
  {
    this.userData.verifyResetCode(this.login, this.code).then((data)=>{
      if(data.status == "ok")
      {
        this.resetCode = this.code;
        this.step++;
      }
      else
      {
        return false;
        // alert(data.status);
      }
    });
  }
  public send():any
  {
    this.userData.sendResetCode(this.login).then((data)=>{
      if(data.status == "ok")
      {
        this.step++;
      }
    });
  }
  public change():any
  {
    this.userData.setPasswordWithResetCode(this.login, this.resetCode, this.passwordA, this.passwordB).then((data)=>{
      if(data.status== "ok")
        this.navCtrl.pop();
      // alert(data.status)
    });
  }

  ngOnInit() {
  }

}
