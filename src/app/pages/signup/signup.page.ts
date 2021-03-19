import { Component, OnInit } from '@angular/core';
import { NavController, NavParams, LoadingController, AlertController } from '@ionic/angular';
import { ApiService } from 'src/app/services/api/api.service';
import { UserDataService } from 'src/app/services/user-data/user-data.service';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.page.html',
  styleUrls: ['./signup.page.scss'],
})
export class SignupPage implements OnInit {

  public nom_prenom: string = "";
  public ville: string = "";
  public password: string;
  public confirm_password: string;
  public email: string = "";
  public telephone: string = "";
  public address_serveur: string = "https://octra.io/octram";
  public loader: any;
  public amIHome: any = false;
  public typeCompte: any = 'particulier';



  constructor(public api: ApiService, public navCtrl: NavController, public navParams: NavParams, 
    public loadingCtrl: LoadingController,
    public userData: UserDataService, public alertCtrl:AlertController) {
    this.loadingCtrl.create
      (
      {
        message: "Chargement..."
      }
      ).then((loader)=>{
        this.loader = loader;
      })
    // this.events.subscribe('user:login', () => {
    //   // user and time are the same arguments passed in `events.publish(user, time)`
    //   // if (this.navCtrl.getActive().name == "SigninPage" || this.navCtrl.getActive().name=="LoginPage")
    //     this.navCtrl.pop();
    // });
  }

  verifieConnexion() {
    this.userData.hasLoggedIn().then((response) => {
      if (response) {
        this.userData.getUsername().then((reponse) => {
          alert("Vous êtes déjà connecté.");
          this.navCtrl.pop();
        })
      }
    })
  }
  public inscrire() {
    if(this.nom_prenom.length<7)
    {
      this.alertCtrl.create({
        header: "",
        message: "Veuillez fournir votre nom complet SVP.",
        buttons: ["compris"]
      }).then(a => {
        a.present();
      });
      return false;
    }
    if(this.ville.length<3)
    {
      this.alertCtrl.create({
        header: "",
        message: "Veuillez fournir le nom de la ville où vous habitez.",
        buttons: ["compris"]
      }).then(a=>{
        a.present();
      });
      return false;
    }
    if(this.telephone.length<7)
    {
      this.alertCtrl.create({
        subHeader: "",
        message: "Veuillez fournir votre vrai numero de telephone svp.",
        buttons: ["compris"]
      }).then(a => {
        a.present();
      });
      return false;
    }

    if (this.password == this.confirm_password) {
      this.loader.present();
      this.api.postDataAlt("octram/action_mobile.php",
        {
          action: "inscription", nom: this.nom_prenom, ville: this.ville, password: this.password,
          email: this.email, telephone: this.telephone, type_compte: this.typeCompte
        }, {}).subscribe((response) => {
          this.loader.dismiss();
          let u;
          console.log(response);
          
          // alert(response.data)
          try {
            u = JSON.parse(response.data);
            if (u.status == "ok") {
              this.userData.signup(u);
            }

              if(u.msg)
              {
                this.alertCtrl.create({
                  header:u.titre,
                  message:u.msg,
                  buttons:["compris"]
                }).then(a => {
                  a.present();
                });
              }
          } catch (error) {
            alert(error + " : " + JSON.stringify(response.data));
            alert(JSON.stringify(response));
          }
        }, (err)=>{
          console.error(err.error);
          console.error(err.url)
          this.alertCtrl.create({
            header: "Echec de connexion",
            message: "Veuillez verifier votre connexion à internet SVP.",
            buttons: ["ok"]
          }).then(a => {
            a.present();
          });
          this.loader.dismiss();
          // this.userData.signup({username:"octi map", photo:"default.png", telephone:"009", user_id:32, email:"mao@gmail.com", domicile:"vouvouni",octicoin:1000});
        })
    }
    else {
      alert("Les mots de passes ne correspondent pas.");
    }
  }
  ionViewDidLoad() {
    console.log('ionViewDidLoad SigninPage');
  }
  ionViewDidEnter()
  {
    this.verifieConnexion();
  }

  ngOnInit() {
  }

}
