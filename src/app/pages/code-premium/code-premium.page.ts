import { Component, OnInit } from '@angular/core';
import { ApiService } from 'src/app/services/api/api.service';
import { SettingsService } from 'src/app/services/settings/settings.service';
import { NavController, NavParams, AlertController, LoadingController } from '@ionic/angular';

@Component({
  selector: 'app-code-premium',
  templateUrl: './code-premium.page.html',
  styleUrls: ['./code-premium.page.scss'],
})
export class CodePremiumPage implements OnInit {
  public a_server:any = "https://123soleilcomores.com";
  public code:string = "";

  constructor(public navCtrl: NavController, public navParams: NavParams, public alertCtrl:AlertController,
    public api:ApiService, public settings:SettingsService, public loadCtrl:LoadingController) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad CodePremiumPage');
    this.settings.getEspace().then((data)=>{
      if(data!=null)
        this.navCtrl.pop();
    })
  }
  async showAlert(titre, contenu) {
    let alert = await this.alertCtrl.create({
      header: titre,
      message: contenu,
      buttons: ['Fermer']
    });
    if(titre || contenu)
      alert.present();
  }
  public async next()
  {
    let load = await this.loadCtrl.create({
      message:"Chargement...",
    });
    load.present();

    this.api.postData("bac/action.php",
      { action: "verifie_code_premium", code:this.code }, {})
      .subscribe(response => {
        load.dismiss();
        try {
          let donnees = JSON.parse(response.data.trim());
          if(donnees.status == "ok")
          {
            this.settings.setPremium(this.code);
            this.settings.setEspace("Premium");
            this.settings.getEspace().then((data)=>{
              if(data!=null)
              {
                this.navCtrl.pop();
                this.navCtrl.pop();
              }
            })
            // window.location.reload();
          }
          else
          {
            this.showAlert(donnees.title, donnees.body);
          }
        }
        catch (error) {
          // alert(error);
          load.dismiss();
          this.showAlert('Desolé', response.data);
        }
      }, (error) => {
        this.showAlert("Problème de connexion", "");
        // this.etudiants = this.etudiantsOriginal;
      });
  }

  ngOnInit() {
  }

}
