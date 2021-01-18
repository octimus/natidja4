import { Component, OnInit } from '@angular/core';
import { UserDataService } from 'src/app/services/user-data/user-data.service';
import { AlertController } from '@ionic/angular';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.page.html',
  styleUrls: ['./profile.page.scss'],
})
export class ProfilePage implements OnInit {

  public nom: String = "";
  public telephone: String = "";
  public domicile: String = "";

  constructor(private userData: UserDataService, private alertCtrl: AlertController) {
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

  ngOnInit() {
  }

}
