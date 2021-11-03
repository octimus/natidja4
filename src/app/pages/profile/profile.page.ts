import { Component, OnInit } from '@angular/core';
import { UserDataService } from 'src/app/services/user-data/user-data.service';
import { AlertController, NavController } from '@ionic/angular';
import { ApiService } from 'src/app/services/api/api.service';
import { AffiliationService } from 'src/app/services/affiliation/affiliation.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.page.html',
  styleUrls: ['./profile.page.scss'],
})
export class ProfilePage implements OnInit {

  public nom: String = "";
  public telephone: String = "";
  public domicile: String = "";
  public httpNative: boolean;
  nbrAffiliates: number;
  public level: any;
  private updateLevel: boolean = false;

  constructor(private userData: UserDataService, private alertCtrl: AlertController, 
    private api: ApiService, private affiliate: AffiliationService, private navCtrl: NavController) {
    this.userData.getDomicile().then((data)=>{
      this.domicile = data;
    })
    this.userData.getTelephone().then((data)=>{
      this.telephone = data;
    })
    this.userData.getUsername().then((data)=>{
      this.nom = data;
    })
  }
  async changePassword() {
    let alert = await this.alertCtrl.create({
      header: 'Changer de mot de passe',
      inputs:[{
        name: 'passwordA',
        value: "",
        placeholder: 'Mot de passe actuel',
        type: "password"
      },{
        name: 'password',
        value: "",
        placeholder: 'Nouveau mot de passe',
        type: "password"
      },{
        name: 'password',
        value: "",
        placeholder: 'Repetez le nouveau mot de passe',
        type: "password"
      },],
      buttons: [
        {
          text: 'Valider',
          handler: (data: any) => {
            this.userData.setPassword(data.password, data.passwordA);
          }
        },
        'Annuler',
      ]
    });

    alert.present();
  }
  async getLevel(){
    this.level = await this.userData.getLevel();
    console.log(this.level);
    
  }
  public change(val){
    this.api.setNativeHttp(val);
  }
  slider4Level(){
    this.navCtrl.navigateForward('sliders').then(() => {
      this.updateLevel = true;
    });
  }

  ngOnInit() {
    this.api.getNativeHttp().then((response) => {
      this.httpNative = response;
      this.getLevel();
    });

    this.affiliate.countAffiliations().then((response) => {
      this.nbrAffiliates = JSON.parse(response.data).nbr;
    })
  }

}
