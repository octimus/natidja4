import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { AlertController, IonSlides, NavController, Platform } from '@ionic/angular';
import { ApiService } from 'src/app/services/api/api.service';
import { UserDataService } from 'src/app/services/user-data/user-data.service';
import { Storage } from '@ionic/storage';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-sliders',
  templateUrl: './sliders.page.html',
  styleUrls: ['./sliders.page.scss'],
})

export class SlidersPage implements OnInit {
  @ViewChild('slides') slides: IonSlides;

  public loading: boolean = false;
  public subscribed: any;
  public logedIn: boolean;
  public kids: any;
  public telephone: string = "";
  public classes: [] = [];
  public level: any;
  public school:any;
  public nom_prenom: any;
  public domicile: any;
  public password: any;
  public passwordConfirm: any;
  public user: any;
  public wsp: string = "https://wa.me/+2694312222";
  public referal: any;
  public isApp: boolean=true;

  formGroup: FormGroup;
  public slideOpts = {
    on: {
      beforeInit() {
        const swiper = this;
        swiper.classNames.push(`${swiper.params.containerModifierClass}fade`);
        const overwriteParams = {
          slidesPerView: 1,
          slidesPerColumn: 1,
          slidesPerGroup: 1,
          watchSlidesProgress: true,
          spaceBetween: 0,
          virtualTranslate: true,
        };
        swiper.params = Object.assign(swiper.params, overwriteParams);
        swiper.params = Object.assign(swiper.originalParams, overwriteParams);
      },
      setTranslate() {
        const swiper = this;
        const { slides } = swiper;
        for (let i = 0; i < slides.length; i += 1) {
          const $slideEl = swiper.slides.eq(i);
          const offset$$1 = $slideEl[0].swiperSlideOffset;
          let tx = -offset$$1;
          if (!swiper.params.virtualTranslate) tx -= swiper.translate;
          let ty = 0;
          if (!swiper.isHorizontal()) {
            ty = tx;
            tx = 0;
          }
          const slideOpacity = swiper.params.fadeEffect.crossFade
            ? Math.max(1 - Math.abs($slideEl[0].progress), 0)
            : 1 + Math.min(Math.max($slideEl[0].progress, -1), 0);
          $slideEl
            .css({
              opacity: slideOpacity,
            })
            .transform(`translate3d(${tx}px, ${ty}px, 0px)`);
        }
      },
      setTransition(duration) {
        const swiper = this;
        const { slides, $wrapperEl } = swiper;
        slides.transition(duration);
        if (swiper.params.virtualTranslate && duration !== 0) {
          let eventTriggered = false;
          slides.transitionEnd(() => {
            if (eventTriggered) return;
            if (!swiper || swiper.destroyed) return;
            eventTriggered = true;
            swiper.animating = false;
            const triggerEvents = ['webkitTransitionEnd', 'transitionend'];
            for (let i = 0; i < triggerEvents.length; i += 1) {
              $wrapperEl.trigger(triggerEvents[i]);
            }
          });
        }
      },
    }
  }
  schools: any[];
  constructor(private formBuilder: FormBuilder, private userData: UserDataService, private api: ApiService, private platform: Platform, private storage: Storage, 
    public navCtrl: NavController, private alertCtrl: AlertController, private activateRoute: ActivatedRoute) { 
    this.formGroup = this.formBuilder.group({
      login:null, nom_prenom:null, ville: null, password: null, passwordConfirm: null, referal: null
    });
    this.userData.getTelephone().then((tel) => {
      this.telephone = tel;
      if(tel && tel.length > 0){
        this.getKids(tel);
      }
      this.getClasses();
    })

    this.storage.get(this.userData.HAS_LOGGED_IN).then(login => this.logedIn = login);
    this.userData.getLevel().then((level) => this.level = level);
  }

  login(){
    console.log(this.formGroup.value);
    
    this.userData.login(this.formGroup.value).then((data) => {
      console.log(data);
      let json;
      try {
        json = data?.data ? JSON.parse(data.data) : data;

        if(json.status === "ok"){
          // this.navCtrl.pop();
          this.slides.slideNext().finally(() => {
            this.logedIn = true;
          })
          this.getKids();

        }
        else
        {
          this.logedIn = false;
        }
      } catch (error) {
        console.error(error);
      }
    });
  }

  setLevel(level: any) {
    this.userData.setLevel(level);
    this.navCtrl.navigateRoot('home');
    this.userData.setHasSeenTutorial(true);
  }
  getClasses(){
    this.api.postData("action_mobile.php", {action: "classes_coach_json"}).subscribe((data) =>{
      let json;
      try {
        console.log(data);
        
        json = typeof(data?.data) === "string" ? JSON.parse(data.data) : data;
        console.log(json);
        
        if(json.status == "ok"){
          this.classes = json.data;
        }
      } catch (error) {
        alert(data)
      }
    }, (error) => {
      console.error(error)
    })
  }

  getKids(tel: any = this.formGroup.value["login"]){
    this.loading = true;
    let params = {action:"json_mykids", telephone:tel};
    
    this.api.postData("action_mobile.php", params).subscribe((d)=>{
      this.loading = false;
      let k: Object;
      if(d)
        k = d?.data ? JSON.parse(d.data.trim()) : d;
      else
        k = [];

      if(JSON.stringify(k) != JSON.stringify(this.kids)){
        this.kids = k;
        if(this.kids.length > 0)
        {
          let id_ecole = this.kids[0].ecole;
          this.storage.set("kids"+id_ecole, this.kids);

          this.api.postData("bac/action.php",
          { action: "charger_ecole_examen_non_scolaire" }, {})
          .subscribe(response => {
            this.loading = false;
            try {
              let donnees = response?.data ? JSON.parse(response.data.trim()) : response;

              if(JSON.stringify(this.schools) != JSON.stringify(donnees.schools)){
                this.schools = donnees.schools;
                this.schools.filter(s => s.id == id_ecole).forEach((a) => {
                  this.storage.set("school", a).finally(() =>{
                    this.school = a;
                  })
                })
                this.storage.set("schools", this.schools);
              }
            }
            catch (error) {
              alert(error);
              alert(response.data)
            }
          }, (error) => {
            this.loading = false;
            console.log({erreur: JSON.stringify(error)});
          });
        }
      }
    }, (err) => {
      this.loading = false;
      // alert(JSON.stringify(err))
      console.log(err);
      
    });
  }
  signup(){
    if(this.formGroup.value['password'] != this.formGroup.value['passwordConfirm']){
      this.alertCtrl.create({message:"Les mots de passes saisies ne sont pas identiques", buttons: ["OK"]}).then(a => a.present());
      return;
    }
    this.loading = true;
    let pp = {
      action: "inscription", nom: this.formGroup.value['nom_prenom'], ville: this.formGroup.value["ville"], platform:"natidja.apk", 
      password: this.formGroup.value["password"], passwordConfirm: this.formGroup.value["passwordConfirm"], 
      telephone: this.formGroup.value["login"], type_compte: "particulier", email: "", referal: this.formGroup.value["referal"]
    };
    console.log(pp)
    this.api.postDataAlt("octram/action_mobile.php", pp, {}).subscribe((response) => {
      let u;
      console.log(response);
      
      // alert(response.data)
      try {
        u = response?.data ? JSON.parse(response.data) : response;
        if (u.status == "ok") {
          this.userData.signup(u);

          this.slides.slideNext().finally(() => {
            this.logedIn = true;
          })
          this.getKids();
        }
        else
        {
          this.logedIn = false;
        }
          
      } catch (error) {
        alert(error + " : " + JSON.stringify(response.data));
        alert(JSON.stringify(response));
      }
    }, (err)=>{
      console.error(err.error);
    }, () => {
      this.loading = false;
    });
  }
  ngOnInit() {
    this.activateRoute.params.subscribe(params =>{
        if(params.id){
          this.referal = params.id;
          this.formGroup.patchValue({referal: this.referal});
          console.log(params.id)
        }
    })

    // alert(JSON.stringify(this.platform.platforms()))
    // if(this.platform.is('mobileweb') || this.platform.is("pwa") || this.platform.is("desktop")) {
    //   this.isApp = false;
    // } else {
    //   this.isApp = true;
    // }
  }

  async back(){
    if(await this.slides.getActiveIndex() > 0){
      this.slides.slidePrev();
    }
    else
    {
      this.navCtrl.back();
    }
  }
  async next(){
    if(await this.slides.isEnd())
    {
      this.navCtrl.navigateRoot('home', {queryParams:{changeSchool:true, exam: "AUTRES", ecole: this.school}});
      this.userData.setHasSeenTutorial(true);
    }
    else
      this.slides.slideNext(1000);
  }
  getIndex(){
    return this.slides.getActiveIndex();
  }

  checkAccount(){
    this.loading = true;
    this.userData.checkAccount(this.formGroup.value["login"]).then((data) => {
      let json;
      try {
        json = typeof(data.data) === "string" ? JSON.parse(data.data) : data;
        console.log(json)
        if(json.status === "ok"){
          setTimeout(() => {
            this.subscribed = true;
          })
          this.user = json.data;
          this.wsp = json.support_wsp;
          console.log({user: this.user})
          console.log(json.data)
        }
        else
        {
          setTimeout(() => {

            this.subscribed = false;
          })
          console.log(data.data)
        }
        this.slides.slideNext(1000).finally(() => {
          // this.telephone = this.formGroup.value["login"];
        });
      } catch (error) {
        console.log(data.data);
      }
      
    }).finally(() => {
      this.loading = false;
    })
  }

}
