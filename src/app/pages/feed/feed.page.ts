import { Component, NgZone, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CallNumber } from '@ionic-native/call-number/ngx';
import { Network } from '@ionic-native/network/ngx';
import { AlertController, IonSelect, IonSlides, LoadingController, ModalController, NavController, Platform, PopoverController } from '@ionic/angular';
import { CoachDetailsComponent } from 'src/app/components/coach-details/coach-details.component';
import { ClassSelectPage } from 'src/app/modals/class-select/class-select.page';
import { ExamSelectPage } from 'src/app/modals/exam-select/exam-select.page';
import { ServerSelectPage } from 'src/app/modals/server-select/server-select.page';
import { Storage } from '@ionic/storage';
import { ApiService } from 'src/app/services/api/api.service';
import { ChatService } from 'src/app/services/chat/chat.service';
import { CoachService } from 'src/app/services/coach/coach.service';
import { CoursService } from 'src/app/services/cours/cours.service';
import { EventLoggerService } from 'src/app/services/event-logger/event-logger.service';
import { SettingsService } from 'src/app/services/settings/settings.service';
import { UserDataService } from 'src/app/services/user-data/user-data.service';

@Component({
  selector: 'app-feed',
  templateUrl: './feed.page.html',
  styleUrls: ['./feed.page.scss'],
})
export class FeedPage implements OnInit {

  @ViewChild(IonSelect) selectYear: IonSelect;
  @ViewChild('slider') slider: IonSlides;

  public coursCount: number = 0;
  public etudiantsOriginal;
  public recherche = "";
  public loading;
  public loaded;
  public classe:any;
  public logedIn: boolean = false;
  public url:any = {url:"", btn:""};
  public connexionError = 0;
  public nbrResultat: any;
  public coachs:any[] = [];
  public myCoachs:any[] = [];
  public courses: any[] = [];
  public bgClasse = "bg-img";
  public level: any;

  public coursesType: "cours"|"exos"|""|"exams" = "";
  public slidesOpt: any = {
    slidesPerView: 3.5,
    spaceBetween: -15,
    loop:true,
    coverflowEffect: {
      rotate: 50,
      stretch: 0,
      depth: 100,
      modifier: 1,
      slideShadows: false,
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
    // spaceBetween: 8,
    // loop:true,
    slidesPerView: 1,
  };
  scrollTopValue: any;
  supportWsp: any;
  cadeau_money: any;
  cadeau_money_limit: any;
  cadeaux: [] = [];
  updateLevel: boolean = false;
  queryParams: any;

  logScrollStart(event){
    
  }
  logScrolling(event){
    // console.log(event.detail);
    if(this.slider){
      if(this.scrollTopValue < event.detail.scrollTop)
      {
        this.slider.slideNext()
      }
      else{
        this.slider.slidePrev()
      }
    }
    this.scrollTopValue = event.detail.scrollTop;
  }
  segmentChanged(event: any){
    this.coursesType = event.target.value;
    this.getListCoursExos(null, true);
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
    loop: false,
  };
  kids: any = [];
  msgCountTimer: NodeJS.Timeout;
  public msgAccueil: any;
  autreContent: any;
  public filtres: any = {};

  constructor(private popoverController: PopoverController,private platform: Platform, private alertCtrl: AlertController, 
    private ngZone: NgZone, private conection: Network, 
    private api: ApiService, private apiSchool: ApiService, public navCtrl: NavController, 
    private modalCtrl:ModalController, private loadingCtrl: LoadingController,
    public call:CallNumber, public userData:UserDataService, 
    public logger:EventLoggerService, public settings:SettingsService, 
    private storage: Storage, private chatService: ChatService, private coursService: CoursService, 
    private coachService: CoachService, private route: ActivatedRoute) {

      // this.coachs.push({nom: "testeur", prix_tarzan: 250, prix_technicien: 500, id: 2, slogan:"lorem ipsumm dolor sumet", });
    this.platform.ready().then(() => {
      //récuperation du background
      // this.storage.clear()
      this.settings.getBackGround().then(bg => this.bgClasse = bg);
      this.route.queryParams.forEach((params)=>{
        this.queryParams = params;
        this.filtres.matiere = params.matiere.id;
        console.log({filtres:this.filtres});
        
      })

      this.settings.getServer().then((data)=>{
        this.userData.getTelephone().then(tel => {
          this.userProfile.telephone = tel;
        });
      })

      this.userData.checkHasSeenTutorial().then((val)=>{
        if(!val){
          this.navCtrl.navigateForward('sliders');
        }
      })
      // this.ga.startTrackerWithId('UA-102358517-3')
      // .then(() => {
      //   console.log('Google analytics is ready now');
      //     this.ga.trackView('HomePage');
      //   // Tracker is ready
      //   // You can now track pages or set additional information such as AppVersion or UserId
      // })
      // .catch(e => console.log('Error starting GoogleAnalytics', e));
      
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
          console.log(d);
        }
      })

      try {

        this.conection.onChange().subscribe((data) => {
          this.ngZone.run(() => {
            setTimeout(() => {
            }, 3000);
          })

        }, (error) => {
          alert("erreur " + JSON.stringify(error));
        });
      } catch (error) {
        console.error(error);
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
        this.getListCoursExos(null, true);
      })
      this.userData.getTelephone().then((reponse)=>{
        this.userProfile.telephone = reponse;
      })
    })

    this.loading = false;
    this.loaded = false;

    this.etudiantsOriginal = [];
    this.classe = {};

  }
  slider4Level(){
    this.navCtrl.navigateForward('sliders').then(() => {
      this.updateLevel = true;
    });
  }
  async presentPopover(ev: any, obj: any) {
    const popover = await this.popoverController.create({
      component: CoachDetailsComponent,
      cssClass: 'coach-details',
      event: ev,
      translucent: true,
      componentProps: obj,
    });
    return await popover.present();
  }
  public defaultImg(element, fallback = "assets/img/default-user.png") {
    element.src = fallback;
  }

  async getLevel(){
    this.level = await this.userData.getLevel();
  }
  ionViewDidEnter(){
    if(this.updateLevel){
      this.getLevel();
      this.getListCoursExos(null, true);
      this.updateLevel = !this.updateLevel;
    }
   
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

          setTimeout(function(){leParent.clickBtn(document.getElementById("trimestreSelect"));}, 500);
        }
      }
    });
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
  logClick() {
      this.logger.logButton('homeButton',{ pram: "paramValue" })
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

  public filtrer(emptyIt?: boolean, event?:any) {
    
  }

  openLogin(page='login') {
    // this.ga.trackEvent('Bouton Login de l accueil', 'Tapped Action', 'Item Tapped is '+item, 0);
    this.navCtrl.navigateForward(page)
  }
  lineCount(str: string){
    return str?.split(/\r\n|\n|\r/).length;
  }
  openCours(item:any){
    this.navCtrl.navigateForward("cours-details", {
      queryParams:item
    })
  }
  async ngOnInit(event: any = null) {
    this.myCoachs = await this.coachService.getLocalListSubscribed() ?? [];
    this.userData.getLevel().then((level) => {
      console.log(level);
      this.level = level;
      
      this.userData.getId().then((id) => {
        this.coachService.getList(this.coachs.length, {subscriber: id}).then((data)=>{
          console.log({d: data})
          if(data){
            try {
              const json = typeof(data.data) === "string" ? JSON.parse(data.data) : data;
              console.log(json)
              if(json.status == "ok"){
                this.myCoachs = json.data;
                this.coachService.setLocalListSubsribed(this.myCoachs);
              }
            } catch (error) {
              console.error(error)
              // alert(data.data)
              console.log({coachs:data})
            }
          }
        }).finally(()=>{
          if(event)
            event.target.complete();
        })
      })
    })
  }
  setComprehension(item, value: number){
    item.loadingComprehension = true;
    this.coursService.setComprehension(item, value).then((data)=>{
      let json;
      try {
        json = JSON.parse(data.data);
      } catch (error) {
        alert(data.data)
      }
      if(json.status == "ok"){
        item.comprehension = value;
      }
    }).finally(() => {
      item.loadingComprehension = false;
    })
  }
  getListTemplate(){
    return this.courses.filter(c => c.type == this.coursesType || this.coursesType == '');
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
    if(this.coursesType == "exams")
    return;
      
    let offset: number = event != null ? this.courses.length : 0
    if(offset == 0){
      this.storage.get("leconsExos").then((data) => {
        if(data)
        this.courses = [...this.courses,...data];
      })
    }
    this.coursService.getListCoaching(this.coursesType, offset, this.filtres).then((data)=>{
      if(data){
        try {
          const json = typeof(data.data) == "string" ? JSON.parse(data.data) : data;
          this.storage.set("leconsExos", json.data);
          
          if(json.status == "ok"){
            if(vider)
              this.courses = [];
            this.courses = [...this.courses,...json.data];
          }
        } catch (error) {
          console.error(error);
          console.log(data);
        }
      }
    }, (error) => {
      console.error(error);
    }).finally(()=>{
      if(event != null)
      event.target.complete()
    });
  }

  async validerExo(item){
    let l = await this.loadingCtrl.create({
      message:"Validation..."
    });
    l.present();
    this.coursService.validerExo(item.id).then((data) => {
      try {
        const json = typeof(data?.data) === "string" ? JSON.parse(data.data) : data;
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
  co(i){
    console.log(i);
  }
  getQuestions(resp: any[]): Array<any>{
    return resp?.filter((elt) => elt.question);
  }
  public async sendResponse(q, elt: any, last=0, item: any = {}){
    // console.log(slide);
    if(q?.validated_time != null){
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
    let rep = elt.parentNode.querySelector('ion-textarea, ion-radio-group').value;
    if(rep?.length < 1){
      return;
    }
    q.loading = true;
    console.log({q: q});
    this.coursService.sendResponse(rep, q).then((data)=>{
      let  json;
      try {
        console.log(data)
        json = typeof(data?.data) == "string" ? JSON.parse(data.data) : data;
        q.content = rep;
        if(json.status == "ok"){
          if(last == 1){
            this.validerExo(item)
          }
          elt.parentNode.parentNode.parentNode.parentNode.parentNode.slideNext();
        }
        else{
          this.alertCtrl.create({message: json.status, buttons: ["ok"]}).then(a => a.present());
        }
      } catch (error) {
        this.alertCtrl.create({message: data.data, buttons: ["ok"], cssClass:"alert-danger"}).then(a => a.present());
      }
    }, (err)=>{
      console.error(err)
      let e = err.error
      this.alertCtrl.create({header:e.error,message:e.text, buttons: ["OK"]}).then(a => a.present());
    }).finally(()=>{
      q.loading = false;
    })
  }
  isValidated(items:any[]){
    let c = items.filter(elt => elt.validated_time == null).length == 0;
    return c;
  }
  doRefresh(event){
    this.ngOnInit(event);
    this.getListCoursExos(null, true);
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
