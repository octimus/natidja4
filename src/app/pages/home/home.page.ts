import { Network } from '@ionic-native/network/ngx';
import { Component, NgZone, ViewChild, OnInit } from '@angular/core';
import { CallNumber } from '@ionic-native/call-number/ngx';
import { UserDataService } from '../../services/user-data/user-data.service';
import { GoogleAnalytics } from '@ionic-native/google-analytics/ngx';
import { EventLoggerService } from '../../services/event-logger/event-logger.service';
import { SettingsService } from '../../services/settings/settings.service';
import { Platform, AlertController, NavController, ModalController, IonSelect, IonSlides, LoadingController } from '@ionic/angular';
import { ServerSelectPage } from '../../modals/server-select/server-select.page';
import { ExamSelectPage } from '../../modals/exam-select/exam-select.page';
import { ClassSelectPage } from '../../modals/class-select/class-select.page';
import { ApiService } from 'src/app/services/api/api.service';
import { Storage } from '@ionic/storage';
import { ChatService } from 'src/app/services/chat/chat.service';
import { CoursService } from 'src/app/services/cours/cours.service';
import { CoachService } from 'src/app/services/coach/coach.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
})
export class HomePage implements OnInit {
  @ViewChild(IonSelect) selectYear: IonSelect;
  @ViewChild('slider') slider: IonSlides;
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
  public coachs:any[] = [];
  public courses: any[] = [];

  public slidesOpt: any = {
    slidesPerView: 2.5,
    spaceBetween: -20,
    loop:true,
    coverflowEffect: {
      rotate: 50,
      stretch: 0,
      depth: 100,
      modifier: 1,
      slideShadows: true,
    },
    on: {
      beforeInit() {
        const swiper = this;

        swiper.classNames.push(`${swiper.params.containerModifierClass}coverflow`);
        swiper.classNames.push(`${swiper.params.containerModifierClass}3d`);

        swiper.params.watchSlidesProgress = true;
        swiper.originalParams.watchSlidesProgress = true;
      },
      setTranslate() {
        const swiper = this;
        const {
          width: swiperWidth, height: swiperHeight, slides, $wrapperEl, slidesSizesGrid, $
        } = swiper;
        const params = swiper.params.coverflowEffect;
        const isHorizontal = swiper.isHorizontal();
        const transform$$1 = swiper.translate;
        const center = isHorizontal ? -transform$$1 + (swiperWidth / 2) : -transform$$1 + (swiperHeight / 2);
        const rotate = isHorizontal ? params.rotate : -params.rotate;
        const translate = params.depth;
        // Each slide offset from center
        for (let i = 0, length = slides.length; i < length; i += 1) {
          const $slideEl = slides.eq(i);
          const slideSize = slidesSizesGrid[i];
          const slideOffset = $slideEl[0].swiperSlideOffset;
          const offsetMultiplier = ((center - slideOffset - (slideSize / 2)) / slideSize) * params.modifier;

          let rotateY = isHorizontal ? rotate * offsetMultiplier : 0;
          let rotateX = isHorizontal ? 0 : rotate * offsetMultiplier;
          // var rotateZ = 0
          let translateZ = -translate * Math.abs(offsetMultiplier);

          let translateY = isHorizontal ? 0 : params.stretch * (offsetMultiplier);
          let translateX = isHorizontal ? params.stretch * (offsetMultiplier) : 0;

          // Fix for ultra small values
          if (Math.abs(translateX) < 0.001) translateX = 0;
          if (Math.abs(translateY) < 0.001) translateY = 0;
          if (Math.abs(translateZ) < 0.001) translateZ = 0;
          if (Math.abs(rotateY) < 0.001) rotateY = 0;
          if (Math.abs(rotateX) < 0.001) rotateX = 0;

          const slideTransform = `translate3d(${translateX}px,${translateY}px,${translateZ}px)  rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;

          $slideEl.transform(slideTransform);
          $slideEl[0].style.zIndex = -Math.abs(Math.round(offsetMultiplier)) + 1;
          if (params.slideShadows) {
            // Set shadows
            let $shadowBeforeEl = isHorizontal ? $slideEl.find('.swiper-slide-shadow-left') : $slideEl.find('.swiper-slide-shadow-top');
            let $shadowAfterEl = isHorizontal ? $slideEl.find('.swiper-slide-shadow-right') : $slideEl.find('.swiper-slide-shadow-bottom');
            if ($shadowBeforeEl.length === 0) {
              $shadowBeforeEl = swiper.$(`<div class="swiper-slide-shadow-${isHorizontal ? 'left' : 'top'}"></div>`);
              $slideEl.append($shadowBeforeEl);
            }
            if ($shadowAfterEl.length === 0) {
              $shadowAfterEl = swiper.$(`<div class="swiper-slide-shadow-${isHorizontal ? 'right' : 'bottom'}"></div>`);
              $slideEl.append($shadowAfterEl);
            }
            if ($shadowBeforeEl.length) $shadowBeforeEl[0].style.opacity = offsetMultiplier > 0 ? offsetMultiplier : 0;
            if ($shadowAfterEl.length) $shadowAfterEl[0].style.opacity = (-offsetMultiplier) > 0 ? -offsetMultiplier : 0;
          }
        }

        // Set correct perspective for IE10
        if (swiper.support.pointerEvents || swiper.support.prefixedPointerEvents) {
          const ws = $wrapperEl[0].style;
          ws.perspectiveOrigin = `${center}px 50%`;
        }
      },
      setTransition(duration) {
        const swiper = this;
        swiper.slides
          .transition(duration)
          .find('.swiper-slide-shadow-top, .swiper-slide-shadow-right, .swiper-slide-shadow-bottom, .swiper-slide-shadow-left')
          .transition(duration);
      }
    },
    // freeMode: true,
  };
  questionSlides = {
    initialSlide: 0,
    direction: 'horizontal',
    speed: 300,
    spaceBetween: 8,
    // loop:true,
    slidesPerView: 1,
  };

  logScrollStart(){
    console.log("scroll start");
    
  }
  logScrolling(event){
    // console.log(event);
    this.slider.slideNext()
  }
  logScrollEnd(){
    console.log("scroll end");
  }
  public btns:any = [{visible:false, btnText:"Forfaits Comores Telecom", text:"Vous semblez avoir des soucis de connexion.Utilisez les 👇🏾👇🏾", number:"*334#"},{visible:true, btnText:"Forfaits Telma", text:"Ou les 👇🏾👇🏾", number:"#444#"},{visible:true, btnText:"Résultat GSA"}];

  public userProfile: { displayName: string, telephone: string, userId: any, photo: string, domicile: string, email: string }={displayName:"said maoulida", telephone:null, userId:3, photo:"default.png", domicile:"vvni", email:"said@octra.io"};
  public btnsRecherche: any = [{btnText:"TB"}];
  slideOpts = {
    initialSlide: 1,
    speed: 500,
    loop: true,
  };
  kids: any = [];
  msgCountTimer: NodeJS.Timeout;
  public msgAccueil: any;
  autreContent: any;

  constructor(private platform: Platform, private alertCtrl: AlertController, 
    private ngZone: NgZone, private conection: Network, 
    private api: ApiService, private apiSchool: ApiService, public navCtrl: NavController, 
    private modalCtrl:ModalController, private loadingCtrl: LoadingController,
    public call:CallNumber, public userData:UserDataService, 
    public logger:EventLoggerService, public settings:SettingsService, 
    private storage: Storage, private chatService: ChatService, private coursService: CoursService, private coachService: CoachService) {

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
      // this.storage.clear()
      let sSchool = this.storage.get('school').then((d)=>{
        this.ecole = d;
        if(!this.ecole)
        {  
          // this.openModalExam(0);
          this.examen = "BAC";
        }
        else
        {  
          this.examen = "AUTRES";
          if(this.ecole?.url)
            this.apiSchool.setServer(this.ecole?.url+"/");
          this.userData.getTelephone().then(tel=>{
            this.loadKids(tel);
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

  async loadKids(tel:any){
    let ecole = this.ecole;
    if(!ecole)
      return;
    console.log(`loading kids for ${ecole.id}`);
    
    if(!ecole?.id){
      console.error({ecole: ecole})
      return;
    }
    this.kids = [];

    this.storage.get(`kids${this.ecole?.id}`).then(k=>{
      this.kids = k ?? [];
    })
    this.api.postData("action_mobile.php", {action:"json_mykids", telephone:tel, ecole:ecole.id}).subscribe((d)=>{
      console.log({kids_:d.data});
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
        if(t){
          if(this.ecole?.url)
          this.apiSchool.setServer(this.ecole?.url+"/")
          this.loadKids(t);
        }
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
          this.loadKids(this.userProfile.telephone)
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
    { action: "charger_autres", ile: this.ile, recherche: this.recherche, examen: this.examen, 
    ecole:this.ecole?.id, classe:this.classe?.id }, {})
    .subscribe(response => {
      this.connexionError = 0;
        try {
          let container = document.querySelector("#autre");
          if(container && this.autreContent != response.data)
          {
            container.innerHTML = response.data;
            this.autreContent = response.data;
          }
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
    
    this.chatService.getCount(tel).then((data) => {
      try {
        let json = JSON.parse(data.data);
        console.log(json)
        this.msgCount = json.data.nbr_msg;
        this.notifCount = json.data.nbr_notifs;
        this.coursCount = json.data.nbr_cours;
        this.msgAccueil = json.data?.msg_accueil;
      } catch (error) {
        console.log(data.data)
      }      
      
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
  
  openCours(item:any){
    this.navCtrl.navigateForward("cours-details", {
      queryParams:item
    })
  }
  ngOnInit(event: any = null) {
    this.getListCoursExos(null, true);
    this.coachService.getList(this.coachs.length).then((data)=>{
      try {
        const json = JSON.parse(data.data);
        if(json.status == "ok"){
          this.coachs = json.data;
        }
      } catch (error) {
        console.error(error)
        console.log({coachs:data.data})
      }
    }).finally(()=>{
      if(event)
        event.target.complete();
    })
  }
  public getListCoursExos(event, vider: boolean = false){
    // this.coursService.getListCoaching("cours", this.courses.length/2).then((data)=>{
    //   try {
    //     const json = JSON.parse(data.data);
    //     if(json.status == "ok"){
    //       this.courses = json.data;
    //     }
    //   } catch (error) {
    //     console.error(error);
    //     console.log({cours:data.data});
    //   }
    // });
    let offset: number = event != null ? this.courses.length : 0
    this.coursService.getListCoaching("", offset).then((data)=>{
      try {
        const json = JSON.parse(data.data);
        console.log({exo:json});
        
        if(json.status == "ok"){
          if(vider)
            this.courses = [];
          this.courses = [...this.courses,...json.data];
        }
      } catch (error) {
        console.error(error);
        console.log({cours:data.data});
      }
    }).finally(()=>{
      if(event != null)
      event.target.complete()
    });
  }
  async validerExo(item){
    console.log({iiittteeeeeeeeem:item});
    let l = await this.loadingCtrl.create({
      message:"Validation..."
    });
    l.present();
    this.coursService.validerExo(item.id).then((data) => {
      try {
        const json = JSON.parse(data.data)
        console.log({response_validation: json})

        if(json.status == "ok"){
          if(json.data){
            let len: number = item.responses.length;
            for(var i = 0; i<len; i++){
              item.responses.pop();
            }
            json.data.forEach(e => item.responses.push(e));
          }
        }
      } catch (error) {
        console.error(error);
        console.log(data.data)
      }
    }, (err)=>{
      console.error(err)
    }).finally(()=>{
      l.dismiss();
    })
  }
  public async sendResponse(q, elt: any, last=0, item: any = {}){
    // console.log(slide);
    if(q?.isCorrect != null && last == 0){
      let slides: IonSlides = elt.parentNode.parentNode.parentNode.parentNode.parentNode;
      slides.getActiveIndex().then(async index=>{
        let slidesLength: number = await slides.length()

        if(slidesLength - 1 == index)
          slides.slideTo(0);
        else
        {
          console.log(index)
          slides.slideNext().then(()=>{
    
          }, (err) => {
            console.error(err)
            // slides.slideTo(0)
          })
        }
      })
      return;
    }
    q.loading = true;
    let rep = elt.parentNode.querySelector('ion-textarea').value;
    console.log({reponse: rep});
    this.coursService.sendResponse(rep, q).then((data)=>{
      const json = JSON.parse(data.data);
      q.content = rep;
      if(json.status == "ok"){
        if(last == 1){
          this.validerExo(item)
        }
        elt.parentNode.parentNode.parentNode.parentNode.parentNode.slideNext();
      }
    }, (err)=>{
      this.alertCtrl.create({message:err.error, buttons: ["OK"]}).then(a => a.present());
    }).finally(()=>{
      q.loading = false;
    })
  }
  isValidated(items:any[]){
    return items.filter(elt => elt.isCorrect == null).length == 0;
  }
  doRefresh(event){
    this.ngOnInit(event)
  }
  isLast(questions: any[], q): boolean{
    if(questions.length == 1) return true;
    let rep: boolean = true;
    if(q?.isCorrect != null){
      return false;
    }
    questions.forEach((elt) => {
      if(elt.id != q.id){
        if(elt.content == null || elt.content == ""){
          rep = false;
        }
      }
    });
    return rep;
  }
  trimString(string, length) {
    let btn = `<a class='btn-view-more'>plus</a>`;
    return string.length > length ? 
            string.substring(0, length) + '...' + btn :
            string;
  }
}
