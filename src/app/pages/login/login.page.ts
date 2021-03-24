import { Component, OnInit, ViewChild } from '@angular/core';
import { Sim } from '@ionic-native/sim/ngx';
import { NavController, NavParams } from '@ionic/angular';
import { UserDataService } from 'src/app/services/user-data/user-data.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {

  public userInfo: any;
  public password: string = "";
  public submitted: Boolean;
  public userLogin: { login: string, password: string } = { login: "", password: "" };

  constructor(
    public userData: UserDataService, private navCtrl: NavController,
    public navParams: NavParams, private simData: Sim) {
    this.verifieConnexion();
    this.simData.getSimInfo().then((simInfo) => {
      this.userLogin.login = simInfo.phoneNumber;
    })

    this.submitted = false;

    this.userData.loginState.subscribe((d)=>{
      if(d == 1){
        this.navCtrl.navigateBack("home");
      }
    })
  }

  public signinPage() {
    this.navCtrl.navigateForward("signup");
  }
  public login() {
    if(this.userLogin.login == "" || this.userLogin.password == "")
    {
      this.submitted = true;
      return;
    }
    
    let suc = this.userData.login(this.userLogin);
    
    this.submitted = true;
  }
  ionViewDidLoad() {
    console.log('ionViewDidLoad LoginPage');
  }
  ionViewDidEnter()
  {
    this.verifieConnexion();
  }
  verifieConnexion() {
    this.userData.hasLoggedIn().then((response) => {
      if (response) {
        this.userData.getUsername().then((reponse) => {
          this.navCtrl.pop();
        })
      }
    })
  }
  
  facebookLogin() {
    // avec la methode native
    // this.facebook.login(["email", "public_profile", "user_friends"]).then((loginResponse) => {
    //   this.facebook.api('me?fields=id, email, name,friends, gender,age_range, first_name, picture.width(720).height(720).as(picture_large)', []).then(profile => {
        // alert(JSON.stringify(profile));
        // this.userInfo = profile;
      // })
      // let credential = firebase.auth.FacebookAuthProvider.credential(loginResponse.authResponse.accessToken);

      // firebase.auth().signInWithCredential(credential).then((info) => {
        // alert(JSON.stringify(info));
    //     this.insererMembre(JSON.stringify(info), JSON.stringify(this.userInfo));
    //   })
    // })

    //avec le navigateur
    // console.log("login...");
    // let provider = new firebase.auth.FacebookAuthProvider();
    // firebase.auth().signInWithRedirect(provider).then(() => {
    //   firebase.auth().getRedirectResult().then((result) => {

    //     alert(JSON.stringify(result));
    //   }).catch(function (error) {
    //     alert(JSON.stringify(error));
    //   });
    // })
    // this.insererMembre("{nom:'octimus prime', email:'maoulidasaid74@gmail.com'}");

  }
  ngOnInit() {
  }

}
