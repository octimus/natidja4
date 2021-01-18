import { Component, OnInit } from '@angular/core';
import { UserDataService } from 'src/app/services/user-data/user-data.service';
import { NavController, AlertController, LoadingController } from '@ionic/angular';
import { CallNumber } from '@ionic-native/call-number/ngx';
import { ApiService } from 'src/app/services/api/api.service';

@Component({
  selector: 'app-params-candidat',
  templateUrl: './params-candidat.page.html',
  styleUrls: ['./params-candidat.page.scss'],
})
export class ParamsCandidatPage implements OnInit {


  public years:any = ['2018-2019','2017-2018', '2016-2017'];
  public annee:any = null;
  public numero: any;
  public exam: any;
  public ile: any;
  public step:number = 0;
  public userid:any;
  public loading: number;
  public montant:any = 250;
  public phoneTransfer:any;
  public phoneNumber:any = "";
  public appropriate_nums:any[];
  private loader: any;
  public iles = ["Ngazidja", "Anjouan", "Moheli"];


  constructor(public navCtrl: NavController, public api:ApiService, 
    public alertCtrl:AlertController, private loadingCtrl: LoadingController,
    public userData:UserDataService, public call:CallNumber) {

    this.loadingCtrl.create({message:"chargement..."}).then(d=>{
      this.loader = d;
    })

    this.userData.getId().then((data)=>{
      if(data)
      {
        this.userid = data;
        this.charger();
      }

    })
    // this.loadPhone();
  }
  public loadPhone() {
    // this.etudiants = this.etudiantsOriginal.filter((etudiant) => {
    //   return etudiant.nom + " " + etudiant.prenom == this.recherche || etudiant.prenom + " " + etudiant.nom == this.recherche || etudiant.id == this.recherche
    // })
    
    this.api.postData2("action_mobile.php",
      { action: "charger_phone" }, {}) 
      .subscribe(response => {

        try {
          this.phoneNumber = response.data;
        }
        catch (error) {
          alert(error);
          // this.showAlert(error, response.data);
        }
        // this.loadPubs();
      }, (error) => {
        // this.showAlert("Problème de connexion", "Veuillez verifier votre connexion à internet.");
        // this.etudiants = this.etudiantsOriginal;
      });
  }
  public charger() {
    // this.etudiants = this.etudiantsOriginal.filter((etudiant) => {
    //   return etudiant.nom + " " + etudiant.prenom == this.recherche || etudiant.prenom + " " + etudiant.nom == this.recherche || etudiant.id == this.recherche
    // })
    this.loader.present();
    
    this.api.postData("bac/action.php",
    { action: "charger_years_params_candidats" }, {})
    .subscribe(response => {

      try {
        let donnees = JSON.parse(response.data.trim());
        this.years = donnees.years;
        this.annee = this.years[this.years.length-1];
      }
      catch (error) {
        // alert(error);
        this.showAlert(error, response.data);
      }
      // this.loadPubs();
    }, (error) => {
      // alert(JSON.stringify(error))
      this.showAlert("Problème de connexion", error);
      // this.etudiants = this.etudiantsOriginal;
    });

  }
  async showAlert(titre, contenu) {
    let alert = await this.alertCtrl.create({
      header: titre,
      message: contenu,
      buttons: ['Fermer']
    });
    if(titre || contenu)
      return alert.present();
  }

  public delete(id)
  {
    this.alertCtrl.create({
      message: "Êtes-vous sûre de vouloir supprimer ?",
      buttons: [{
        text: "Oui",
        handler:(val)=>{
          this.loader.present();
          this.loading = 1;
          this.api.postData2("action_mobile.php",
          { action: "delete_appropriate_num", userId:this.userData.userId, id:id }, {})
          .subscribe(response => {
            this.loader.dismiss();
            this.loading = 0;
            try {
              let donnees = JSON.parse(response.data.trim());
              
              // alert(JSON.stringify(this.appropriate_nums))
              this.appropriate_nums = donnees.data;
            }
            catch (error) {
              // alert(error);
              if(response.data)
                this.showAlert(error, response.data);
            }
            // this.loadPubs();
          }, (error) => {
            // this.showAlert("Problème de connexion", "Veuillez verifier votre connexion à internet.");
            // this.etudiants = this.etudiantsOriginal;
            this.loader.dismiss();
            this.loading = 0;
          });
        }
      }, "Non"]
    }).then(d=>{
      d.present();
    })

    
  }
  openPaymentPage(item:{}){
    if(typeof(item) != "undefined")
    {
      try {
        
        this.navCtrl.navigateForward('payement', {queryParams: {item:JSON.stringify(item), reason:'appropriate_num'}});
      } catch (error) {
        alert(error)        
      }
    }
    else
      alert("item is undefined");
  }
  public next()
  {
    this.loading = 1;
    this.api.postData("bac/action.php",
      { action: "appropriate_num", annee:this.annee, num:this.numero, exam:this.exam, userid:this.userid, ile:this.ile }, {})
      .subscribe(response => {
        this.loading = 0;
        let rep = JSON.parse((response.data).trim());
        if(rep.status == "ok")
        {
          // this.step++;
          this.navCtrl.navigateForward("payement", {queryParams:{item:rep.item, reason: "appropriate_num"}});
        }
        else
          this.showAlert("", response.data)
        
        // this.loadPubs();
      }, (error) => {
        this.loading = 0;
        this.showAlert("Problème de connexion", "Veuillez verifier votre connexion à internet.");
        // this.etudiants = this.etudiantsOriginal;
      });
  }
  ionViewDidLoad() {
    console.log('ionViewDidLoad ParamsCandidatPage');
  }
  ionViewDidEnter(){
    this.loader.present();
    this.numero = "";
    this.api.postData2("action_mobile.php",
    { action: "appropriate_num_json", userId:this.userData.userId }, {})
    .subscribe(response => {
      this.loader.dismiss();
      try {
        let donnees = JSON.parse(response.data.trim());
        
        this.appropriate_nums = donnees.data;
        // alert(JSON.stringify(this.appropriate_nums))

      }
      catch (error) {
        // alert(error);
        this.showAlert(error, response.data);
      }
      // this.loadPubs();
    }, (error) => {
      // alert(JSON.stringify(error))
      this.loader.dismiss();
      this.showAlert("Problème de connexion", error);
      // this.etudiants = this.etudiantsOriginal;
    });
  }
  ngOnInit() {
  }

}
