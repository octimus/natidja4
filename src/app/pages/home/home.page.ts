import { Network } from '@ionic-native/network/ngx';
import { Component, NgZone, ViewChild, OnInit } from '@angular/core';
import { CallNumber } from '@ionic-native/call-number/ngx';
import { UserDataService } from '../../services/user-data/user-data.service';
import { GoogleAnalytics } from '@ionic-native/google-analytics/ngx';
import { EventLoggerService } from '../../services/event-logger/event-logger.service';
import { SettingsService } from '../../services/settings/settings.service';
import { Platform, AlertController, NavController, ModalController, IonSelect } from '@ionic/angular';
import { ServerSelectPage } from '../../modals/server-select/server-select.page';
import { ExamSelectPage } from '../../modals/exam-select/exam-select.page';
import { ClassSelectPage } from '../../modals/class-select/class-select.page';
import { ApiService } from 'src/app/services/api/api.service';
import { Storage } from '@ionic/storage';
import { ChatService } from 'src/app/services/chat/chat.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
})
export class HomePage implements OnInit {
  @ViewChild(IonSelect) selectYear: IonSelect;
  public examen: string;
 
  public premium:any = false;
  public notifCount:number = 0;
  public msgCount: number = 0;
  public coursCount: number = 0;
  public etudiantsOriginal;
  public etudiants: any;
  public recherche = "";
  public indexLecture: any;
  public loading;
  public loaded;
  public codePushState;
  public ile;
  public ecole:any = {};
  public classe:any;
  public trimestre:any;
  public iles;
  public years:any = [];
  public slidesPub:any = [];
  public annee:any = null;
  public logedIn: boolean = false;
  public url:any = {url:"", btn:""};
  public demander_don:any = 0;
  public connexionError = 0;
  public canActivateNotes: boolean = false;
  public nbrResultat: any;
  public disponibility:any = {};

  public btns:any = [{visible:false, btnText:"Forfaits Comores Telecom", text:"Vous semblez avoir des soucis de connexion.Utilisez les 👇🏾👇🏾", number:"*334#"},{visible:true, btnText:"Forfaits Telma", text:"Ou les 👇🏾👇🏾", number:"#444#"},{visible:true, btnText:"Résultat GSA"}];

  public userProfile: { displayName: string, telephone: string, userId: any, photo: string, domicile: string, email: string }={displayName:"said maoulida", telephone:null, userId:3, photo:"default.png", domicile:"vvni", email:"said@octra.io"};
  public btnsRecherche: any = [{btnText:"TB"}];
  slideOpts = {
    initialSlide: 1,
    speed: 500,
    loop: true,
    auotoplay: true,
  };
  kids: any = [];
  msgCountTimer: NodeJS.Timeout;

  constructor(private platform: Platform, private alertCtrl: AlertController, 
    private ngZone: NgZone, private conection: Network, 
    private api: ApiService, private apiSchool: ApiService, public navCtrl: NavController, 
    private modalCtrl:ModalController, 
    public call:CallNumber, public userData:UserDataService, 
    public logger:EventLoggerService, public settings:SettingsService, 
    private storage: Storage, private chatService: ChatService) {

    this.platform.ready().then(() => {
      this.settings.getPremium().then((data)=>{
        this.premium = data;
      })

      this.settings.getServer().then((data)=>{
        this.charger();
        // this.chargerUrl();          
        this.chargerAutre();
        this.loadBtns();
        this.userData.getTelephone().then(tel => {
          this.getCount(tel);
        });
      })
      // this.ga.startTrackerWithId('UA-102358517-3')
      // .then(() => {
      //   console.log('Google analytics is ready now');
      //     this.ga.trackView('HomePage');
      //   // Tracker is ready
      //   // You can now track pages or set additional information such as AppVersion or UserId
      // })
      // .catch(e => console.log('Error starting GoogleAnalytics', e));

     
      // watch network for a connection
      // alert("ça marche");
      this.codePushState = false;
      this.launchCodePush();
      
      this.userData.loginState.subscribe(d=>{
        
        if(d == 1){
          this.logedIn = true;
          this.userData.hasLoggedIn().then((response) => {
            this.logedIn = true;
          });
  
          this.userData.getDomicile().then((reponse)=>{
            this.userProfile.domicile = reponse;
          })
          this.userData.getUsername().then((reponse)=>{
            this.userProfile.displayName = reponse;
          })
  
          this.userData.getPhoto().then((reponse)=>{
            this.userProfile.photo = reponse;
          })
          this.userData.getId().then((reponse)=>{
            this.userProfile.userId = reponse;
            console.log(this.userProfile, reponse)
          })
        }else{
          console.log({d: d});
          
        }
      })

      
      
      try {

        this.conection.onChange().subscribe((data) => {
          this.ngZone.run(() => {
            setTimeout(() => {

              this.launchCodePush();
            }, 3000);
          })

        }, (error) => {
          // alert("erreur " + JSON.stringify(error));
        });
      } catch (error) {
        console.log(error);
      }
      
      // stop connect watch
      // connectSubscription.unsubscribe();
      this.userData.hasLoggedIn().then((response) => {
        this.logedIn = response;
      });

      this.userData.getDomicile().then((reponse)=>{
        this.userProfile.domicile = reponse;
      })
      this.userData.getUsername().then((reponse)=>{
        this.userProfile.displayName = reponse;
      })

      this.userData.getPhoto().then((reponse)=>{
        this.userProfile.photo = reponse;
      })
      this.userData.getId().then((reponse)=>{
        this.userProfile.userId = reponse;
      })
      this.userData.getTelephone().then((reponse)=>{
        this.userProfile.telephone = reponse;
      })
    })
    this.loading = false;
    this.loaded = false;
    this.indexLecture = 0;
    this.examen = null;
    this.etudiants = [];
    this.iles = ["Ngazidja", "Anjouan", "Moheli"];
    this.ile = this.iles[0];
    this.etudiantsOriginal = [];
    this.classe = {};
    this.trimestre = 1;

    if(this.examen == null)
    {
      let sSchool = this.storage.get('school').then((d)=>{
        this.ecole = d;
        if(!this.ecole)
          this.openModalExam(0);
        else
        {  
          this.examen = "AUTRES";
          this.apiSchool.setServer(this.ecole?.url+"/");
          this.userData.getTelephone().then(tel=>{
            this.loadKids(tel, this.ecole);
          })
        }
      });

      
      // this.settings.getEspace().then((data)=>{
      //   if(!data)
      //   {
      //     this.openModalServer(0);
      //   }
      //   else
      //   {
      //     this.openModalExam(0);
      //   }
      // })
    }
    // this.settings.getBtns().then((data)=>{
    //   this.btns = data;
    // })
    // this.etudiants = JSON.parse(JSON.stringify(this.etudiantsOriginal));

    // this.lecture("Direct");
  }

  public defaultImg(element, fallback = "assets/img/default-user.png") {
    element.src = fallback;
  }
  public loadBtns2() {
    this.api.postData2("action_mobile.php",
      {action:"btnsRecherche", exam:this.examen}, {}).subscribe((response)=>{   
        let resultat;
        try
        {
          // alert("http :"+response.data)
          response.data = (response.data).trim()
          resultat = JSON.parse(response.data);

          this.btnsRecherche = resultat;

        }catch(err)
        {
          // alert(JSON.stringify(err))
          // alert(response.data);
          return false;
        }

      }, (err)=>{
        // alert((err))
        
      })
  }
  public loadBtns() {
    this.api.postData2("action_mobile.php",
      {action:"btnsTelecoms", exam:this.examen}, {}).subscribe((response)=>{   
        let resultat;
        try
        {
          // alert("http :"+response.data)
          response.data = (response.data).trim()
          resultat = JSON.parse(response.data);

          this.settings.setBtns(resultat);
          // this.btns = resultat;

        }catch(err)
        {
          // alert(JSON.stringify(err))
          // alert(response.data);
          return false;
        }

      }, (err)=>{
        // alert(JSON.stringify(err))
        
      })
  }

  async loadKids(tel:any, ecole:any, setServer = function(){}){
    
    if(!ecole){
      ecole = await this.storage.get("school");
    }
    this.kids = [];
    
    this.storage.get(`kids${this.ecole.id}`).then(k=>{
      this.kids = k ?? [];
    })
    setServer();
    this.api.postData("action_mobile.php", {action:"json_mykids", telephone:tel, ecole:ecole.id}).subscribe((d)=>{
      console.log(d.data);
      let k: Object = JSON.parse(d.data.trim());

      if(JSON.stringify(k) != JSON.stringify(this.kids)){
        this.kids = k;
        this.storage.set("kids"+ecole.id, this.kids);
      }
    }, (err) => {
      // alert(JSON.stringify(err))
      console.log(err);
      
    });
  }
  ionViewDidEnter(){
    if(this.etudiants.length > 0)
    {
      this.etudiants = [];
    }
    if(this.kids.length == 0){
      this.userData.getTelephone().then(t => {
        if(t)
          this.loadKids(t, this.ecole, () => this.apiSchool.setServer(this.ecole?.url+"/"));
      })
    }
  }
  public chargerUrl()
  {
    this.api.postData("action.php",
      { action: "charger_url", ile: this.ile, recherche: this.recherche, examen: this.examen, ecole:this.ecole?.id, classe:this.classe?.id }, {})
      .subscribe(response => {

          this.url = JSON.parse((response.data).trim());
      }, (error) => {
        // this.showAlert("Problème de connexion", "Veuillez verifier votre connexion à internet.");
        // this.etudiants = this.etudiantsOriginal;
      });
  }
  public clickBtn(btn)
  {
    let evt = document.createEvent("MouseEvents");
    evt.initMouseEvent("click", true, true, window, 0, 0, 0, 0, 0, false, false, false, false, 0, null);
    btn.dispatchEvent(evt);
  }
  public async openModalClass(retour=1, ecole)
  {
    let modal = await this.modalCtrl.create({component:ClassSelectPage, componentProps:{retour:retour, ecole:ecole}});
    modal.present();
    modal.onDidDismiss().then((data)=>{
      if(typeof(data)!='undefined')
      {
        if(data){
          let leParent = this;
          this.classe = data;
          this.etudiants = [];
          setTimeout(function(){leParent.clickBtn(document.getElementById("trimestreSelect"));}, 500);
        }
      }
    });
  }
  public async openModalServer(retour=1)
  {
    let modal = await this.modalCtrl.create({component:ServerSelectPage, componentProps:{retour:retour}});
    modal.present();
    modal.onDidDismiss().then((data)=>{
      
      if(typeof(data)!='undefined')
      {
        
      }
      this.openModalExam();
    });
  }
  public async openModalExam(retour=1)
  {
    let examsModal = await this.modalCtrl.create({component: ExamSelectPage, componentProps: {retour:retour}});
    examsModal.present();
    examsModal.onDidDismiss().then((d)=>{
      let data = d.data;
      if(typeof(data)!='undefined')
      {
        this.etudiants = [];
        this.examen = data.exam;
        if(data.exam=="AUTRES")
        {
          this.ecole = data.ecole;
          this.storage.set("school", this.ecole);
          this.loadKids(this.userProfile.telephone, this.ecole.id)
          // this.openModalClass(0, data.ecole);
        }
        this.loadBtns2();
        this.check();
      }
    })
  }
  async showAlert(titre, contenu) {
    let alert = await this.alertCtrl.create({
      subHeader: titre,
      message: contenu,
      buttons: ['Fermer']
    });
    if(titre || contenu)
      alert.present();
  }
  public openUrl(url)
  {
    return;
    try {
      // const browser = this.iab.create(url);
      // browser.show();
    } catch (error) {
      // alert(error)
    }

    // browser.executeScript();
    // window.open(url, '_system');
  }
  public callNum(num)
  {
    this.call.callNumber(num, false).then((data)=>{
      console.log(data);
    })
    .catch((error)=>{
      // this.showAlert("Erreur", error);
    });
  }
  public callMe()
  {
    this.call.callNumber('3632222', false).then((data)=>{
      console.log(data);
    })
    .catch((error)=>{
      // this.showAlert("Erreur", error);
    });
  }
  public launchCodePush() {
    if (this.conection.type === "wifi" && !this.codePushState) {

      // this.codePush.sync().subscribe((syncStatus) => console.log(syncStatus));

      const downloadProgress = (progress) => {
        document.querySelector("#progress").innerHTML = "";
        // = `Downloaded ${progress.receivedBytes} of ${progress.totalBytes}`;
      }
      // this.codePush.sync({}, downloadProgress).subscribe((syncStatus) => {
      //   if (syncStatus == SyncStatus.CHECKING_FOR_UPDATE)
      //     this.showAlert("checking...", "");
      //   if (syncStatus == SyncStatus.DOWNLOADING_PACKAGE)
      //     this.showAlert("telechargement...", "");
      //   if (syncStatus == SyncStatus.INSTALLING_UPDATE)
      //     this.showAlert("installation ...", "Veuillez patientez svp");
      //   if (syncStatus == SyncStatus.UP_TO_DATE)
      //     alert("A jour");
      //   if (syncStatus == SyncStatus.UPDATE_INSTALLED)
      //     this.showAlert("Installation réussie", "L'application a été mise à niveau.");
      //   if (syncStatus == SyncStatus.ERROR)
      //     this.showAlert("Erreur !!!", "Veuillez reessayez une autre fois");
      // });
      this.codePushState = true;
    }
    else
      return false;

  }
  logClick() {
      this.logger.logButton('homeButton',{ pram: "paramValue" })
  }
  // public lecture(filtre = "Direct") {
  //   if (this.etudiants[this.indexLecture].status == filtre) {

  //     this.lire(this.etudiants[this.indexLecture].nom + " " +
  //       this.etudiants[this.indexLecture].prenom, function () {
  //         alert(this.indexLecture);
  //         this.lecture(filtre);
  //         this.indexLecture++;
  //       });
  //   }
  //   else
  //   { this.indexLecture++; this.lecture(filtre); }

  // }

  public openVieScolaire(item) {
    console.log({kid:item});
    
    this.navCtrl.navigateForward('vie-scolaire', {queryParams:{
        item: item
      }
    })
  }
  public openItem(item) {
    this.navCtrl.navigateForward('item-details', {queryParams:{
      item: item
    }
    })
  }
  public rechercher() {
    this.filtrer();
    // let superP = this;
    // if (this.etudiants.length == 1) {
    //   superP.loading = false;
    // }
  }
  public chargerAutre() {
    this.api.postData("bac/action.php",
    { action: "charger_autres", ile: this.ile, recherche: this.recherche, examen: this.examen, ecole:this.ecole?.id, classe:this.classe?.id }, {})
    .subscribe(response => {
      this.connexionError = 0;
      try {
          let container = document.querySelector("#autre");
          console.log(container);
          
          if(container)
            container.innerHTML = response.data;
        }
        catch (error) {
          console.log(error);
          // alert("server hme2 :"+this.a_server)
          console.log([error, response.data]);
        }
      }, (error) => {
        console.log(error);
        
        // this.showAlert("Problème de connexion", "Veuillez verifier votre connexion à internet.");
        // this.etudiants = this.etudiantsOriginal;
        this.connexionError = 1;
      });
      let sup = this;
      setTimeout(function(){
        sup.chargerAutre();
      }, 60000);
  }
  loadYears(){
    this.years = [];
    let currentYear = new Date().getFullYear();
    for(let y = currentYear; y >= 2017; y--){
      this.years.push(`${y-1}-${y}`);
    }

    this.annee = this.years[0];
  }

  getCount(tel: any){
    this.chatService.getCount(tel).subscribe((data) => {
      
      let json = JSON.parse(data.data);
      
      this.msgCount = json.data.nbr_msg;
      this.notifCount = json.data.nbr_notifs;
      this.coursCount = json.data.nbr_cours;
    });
    this.msgCountTimer = setTimeout(() => this.getCount(tel), 10000);
  }

  public charger() {
    // this.etudiants = this.etudiantsOriginal.filter((etudiant) => {
    //   return etudiant.nom + " " + etudiant.prenom == this.recherche || etudiant.prenom + " " + etudiant.nom == this.recherche || etudiant.id == this.recherche
    // })
    // alert("server home 3:"+this.a_server)
    this.loadYears();
    this.api.postData("bac/action.php",
      { action: "charger_years", ecole:this.ecole, examen:this.examen, telephone:this.userProfile?.telephone }, {})
      .subscribe(response => {

        try {
          let donnees = JSON.parse(response.data.trim());
          this.canActivateNotes = donnees.can_activate_notes;
          this.notifCount = donnees.notif_count;

          this.demander_don = donnees.demander_don;
        }
        catch (error) {
          // alert(error);
          this.showAlert("echec", "Mauvais format des données");
          console.log(error, response);
        }
        this.loadPubs();
      }, (error) => {
        // this.showAlert("Problème de connexion", "Veuillez verifier votre connexion à internet.");
        // this.etudiants = this.etudiantsOriginal;
      });
  }
  public check() {
    this.api.postData("bac/action.php",
      { action: "check_if_disponible", ile: this.ile,examen: this.examen, ecole:this.ecole, classe:this.classe.id, trimestre:this.trimestre, annee:this.annee }, {})
      .subscribe(response => {
        try {
          // var objet;
          // alert(response.data)
          let dat = response.data.trim();

          this.disponibility = JSON.parse(dat);
          
        }
        catch (error) {
          if(response.data)
          {
            // alert(error);
            // this.showAlert('Erreur', response.data);
          }
        }
      }, (error) => {
        console.log(error);
        
        this.showAlert("Problème de connexion", "");
      });
  }
  public filtrer(emptyIt?: boolean, event?:any) {
    console.log(this.userProfile)
    if(typeof(emptyIt) == "undefined")
      emptyIt = true;
    this.loading = true;

    if(emptyIt)
      this.etudiants = [];

    if(this.annee == null)
    { 
      this.charger();
      this.loading = false;
      try {
         
        this.selectYear.open();
      } catch (error) {
        alert(error)
      }
      return;
    }

    // this.etudiants = this.etudiantsOriginal.filter((etudiant) => {
    //   return etudiant.nom + " " + etudiant.prenom == this.recherche || etudiant.prenom + " " + etudiant.nom == this.recherche || etudiant.id == this.recherche
    // })
    this.api.postData("bac/action.php",
      { action: "search_etudiant", ile: this.ile, recherche: this.recherche, 
      examen: this.examen, ecole:this.ecole, classe:this.classe.id, 
      trimestre:this.trimestre, annee:this.annee, 
      id_membre: this.userProfile.userId, offset: this.etudiants.length }, {})
      .subscribe(response => {
        if(event){
          event.target.complete();
        }
        this.loading = false;
        this.loaded = true;
        try {
          // var objet;
          let dat = response.data.trim();
          let jsonData = JSON.parse(dat);
          this.nbrResultat = jsonData.nbr_resultat;

          if(this.etudiants.length == 0)
            this.etudiants = jsonData.data;
          else
            this.etudiants = [...this.etudiants, ...jsonData.data];

          if (this.etudiants.length == 1)
          {
            this.openItem(this.etudiants[0]);
          }
        }
        catch (error) {
          if(response.data)
          {
            // alert(error);
            this.showAlert("", response.data);
          }
        }
      }, (error) => {
        if(event){
          event.target.complete();
        }
        this.loading = false;
        this.showAlert("Problème de connexion", JSON.stringify(error));
        this.connexionError = 1;
        if(this.examen == "AUTRES")
        {
          // this.etudiants = 
          // [
          //   { rang:'1er', nom: "Iahaya Said Hachim", decision: "Admis", serie: "C",trimestre:3, mension: "bien", moyenne:'18.5',  classe:"Seconde", code_secret:"1234" },
          //   { rang:'2ème', nom: "Maoulida Said M'namdji", decision: "Admis",trimestre:1, serie: "C", moyenne:'16.5',  classe:"Seconde", code_secret:"1234" },
          //   { rang:'3ème', nom: "Touroutou toutou", decision: "Admis", trimestre:2, moyenne:'15.5', classe:"Seconde", code_secret:"1234" },
          //   { rang:'4ème', nom: "Saduk matous", decision: "Ajourné", trimestre:2, moyenne:'08.5',  classe:"Seconde", code_secret:"1234" },
          // ];
        }
        else
        {
          // this.etudiants = 
          // [
          //   { numero: 1, nom: "Iahaya Said Hachim", decision: "Admis", serie: "C", mension: "Bien", etablissement:"Ecole Ibn Khaldoun"},
          //   { numero: 2, nom: "Maoulida Said M'namdji Vouou", decision: "Admis", serie: "C",mension: "Assez Bien", etablissement:"Ecole Ibn Khaldoun", notes:[{matiere:"wahou", valeur:'18'}, {matiere:"malou", valeur:'15'}] },
          //   { numero: 3, nom: "Touroutou toutou", decision: "Admis", etablissement:"Ecole Ibn Khaldoun",mension: "Très Bien", },
          //   { numero: 4, nom: "Saduk matous", decision: "Ajourné", etablissement:"Ecole Ibn Khaldoun", mension: "Passable", },
          // ];
        }
        
        // alert("locale")
        // this.etudiants = this.etudiantsOriginal;
      });
  }
  public loadPubs() {
    return;
    // this.loading = true;
    this.slidesPub = [];
    
    this.api.postData("bac/action.php",
      { action: "pubs_json", ile: this.ile, recherche: this.recherche, examen: this.examen, ecole:this.ecole, classe:this.classe.id, trimestre:this.trimestre, annee:this.annee, page:"home" }, {})
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
        this.loading = false;
        this.connexionError = 1;
        this.showAlert("Problème de connexion", "vdeuillez verifier votre connexion");
      });
  }
  public lire(texte: string, callback) {
    // this.tts.speak(texte)
    //   .then(() => { alert('Success'); callback(); })
    //   .catch((reason: any) => { alert("erreur : " + JSON.stringify(reason)); });
  }
  openLogin(page='login') {
    // this.ga.trackEvent('Bouton Login de l accueil', 'Tapped Action', 'Item Tapped is '+item, 0);
    this.navCtrl.navigateForward(page)
  }

  ngOnInit() {
  }

}
