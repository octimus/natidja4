import { Component, OnInit } from '@angular/core';
import { CallNumber } from '@ionic-native/call-number/ngx';
import { NavController, NavParams, AlertController, ModalController } from '@ionic/angular';
import { HTTP } from '@ionic-native/http/ngx';
import { SettingsService } from 'src/app/services/settings/settings.service';
import { ApiService } from 'src/app/services/api/api.service';
import { Storage } from '@ionic/storage';

@Component({
  selector: 'app-exam-select',
  templateUrl: './exam-select.page.html',
  styleUrls: ['./exam-select.page.scss'],
})
export class ExamSelectPage implements OnInit {

  public a_server = null;
  public schools:any = [];
  public loading = false;
  public slidesPub:any = [];
  public connexionError:any = 0;
  public premium:any = false;
  public openFooter: any = false;
  public btns:any = [{visible:false, btnText:"Forfaits Comores Telecom", text:"vous semblez avoir des soucis de connexion.Utilisez les 👇🏾👇🏾", number:"*334#"},{visible:false, btnText:"Choix N°1", text:"Vous semblez avoir des soucis de connexion.Utilisez le 👇🏾👇🏾", number:"#444#"}];

  constructor(public navCtrl: NavController, public navParams: NavParams, private modalCtrl:ModalController,
   public http:HTTP, public alertCtrl:AlertController, public call:CallNumber, 
   public settings:SettingsService, private api: ApiService, private storage: Storage) {
    

    this.settings.getPremium().then((data)=>{
      this.premium = data;
    })
    
    this.charger();
    // this.loadPubs();
  }
  public loadBtns() {
    this.api.postData2("action_mobile.php",
      {action:"btnsTelecoms"}, {}).subscribe((response)=>{   
        let resultat;
        try
        {
          // alert("http :"+response.data)
          let r = response.data;
          r = (r).trim()
          resultat = JSON.parse(r);

          this.settings.setBtns(resultat);
          // this.btns = resultat;
          
        }catch(err)
        {
          alert(JSON.stringify(err))
          alert(response.data);
          return false;
        }

      }, (err)=>{
        alert(JSON.stringify(err))
        
      })
  }
  public loadPubs() {

      this.slidesPub = [];
      
      this.api.postData("bac/action.php",
        { action: "pubs_json", page:"exam-select" }, {})
        .subscribe(response => {
          this.connexionError = 0;
          try {

            let dat = response.data.trim();

            this.slidesPub = JSON.parse(dat);

          }
          catch (error) {
            if(response.data)
            {
              this.showAlert('Erreur', response.data);
            }
          }
        }, (error) => {
          this.connexionError = 1;
          this.showAlert("Problème de connexion", JSON.stringify(error));
        });
  }
  ionViewDidEnter() {
    this.settings.getServer().then((data)=>{
      this.a_server = data;
    })
    console.log('ionViewDidLoad ExamSelectPage');
  }
  select(data)
  {
    if(data)
    {  
      this.modalCtrl.dismiss(data);
    }
    else
      this.modalCtrl.dismiss();
  }
  public callNum(num)
  {
    this.call.callNumber(num, false).then((data)=>{
      console.log(data);
    })
    .catch((error)=>{
      this.showAlert("Erreur", error);
    });
  }
  charger() {
    // this.etudiants = this.etudiantsOriginal.filter((etudiant) => {
    //   return etudiant.nom + " " + etudiant.prenom == this.recherche || etudiant.prenom + " " + etudiant.nom == this.recherche || etudiant.id == this.recherche
    // })
    // alert("server  1 :"+this.a_server)
    this.storage.get("schools").then(e => {
      if(e)
        this.schools = e;
      else
        this.loading = true;
    }, (err) => {
      console.error(err);
      this.loading = true;
    })

    this.api.postData("bac/action.php",
      { action: "charger_ecole_examen_non_scolaire" }, {})
      .subscribe(response => {
        console.log(JSON.parse(response.data));
        
        this.connexionError = 0;
        this.loading = false;
        try {
          let donnees = JSON.parse(response.data.trim());

          if(JSON.stringify(this.schools) != JSON.stringify(donnees.schools)){
            this.schools = donnees.schools;
            this.storage.set("schools", this.schools);
          }
          
          this.openFooter = donnees.openFooter;
        }
        catch (error) {
          alert(error);
          if(response.data)
            this.showAlert('Erreur', response.data);
        }
      }, (error) => {
        this.loading = false;
          this.connexionError = 1;
        // this.showAlert("Problème de connexion", "Veuillez verifier votre connexion à internet.");
        console.log({erreur: JSON.stringify(error)});
        // this.etudiants = this.etudiantsOriginal;
      });
  }
  async showAlert(titre, contenu) {
    let alert = await this.alertCtrl.create({
      subHeader: titre,
      message: contenu,
      buttons: ['OK']
    });
    alert.present();
  }

  ngOnInit() {
  }

}
