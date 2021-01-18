import { Component, OnInit } from '@angular/core';
import { NavController, AlertController, NavParams, ModalController } from '@ionic/angular';
import { HTTP } from '@ionic-native/http/ngx';

@Component({
  selector: 'app-class-select',
  templateUrl: './class-select.page.html',
  styleUrls: ['./class-select.page.scss'],
})
export class ClassSelectPage implements OnInit {

  public classes:any;
  public ecole:any;
  public reessayer:any = false;
  public a_server = "https://octra.io/bac";
  
  constructor(public navCtrl: NavController, public navParams: NavParams, 
    public http:HTTP, public alertCtrl:AlertController, private modalCtrl: ModalController) {
    this.ecole = this.navParams.get("ecole");
    this.charger();
    this.classes = [];
  }
  select(data)
  {
    if(data)
      this.modalCtrl.dismiss(data);
    else
      this.modalCtrl.dismiss();
  }
  charger() {

    this.http.post(this.a_server + "/action.php",
      { action: "charger_classes" }, {ecole:this.ecole.id})
      .then(response => {

        try {
          let donnees = JSON.parse(response.data.trim());
          this.classes = donnees.classes;
        }
        catch (error) {
          // alert(error);
          this.showAlert('', response.data);
        }
      }, (error) => {
        this.showAlert("Problème de connexion", JSON.stringify(error));
        this.reessayer = true;
        // this.etudiants = this.etudiantsOriginal;
      });
  }
  async showAlert(titre, contenu) {
    let alert = await this.alertCtrl.create({
      header: titre,
      subHeader: contenu,
      buttons: ['OK']
    });
    alert.present();
  }
  ionViewDidLoad() {
    console.log('ionViewDidLoad ClassSelectPage');
  }
  ngOnInit(){
    
  }

}
