import { Component, OnInit } from '@angular/core';
import { SocialSharing } from '@ionic-native/social-sharing/ngx';
import { Platform, IonRouterOutlet, NavController, AlertController, MenuController } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { UserDataService } from './services/user-data/user-data.service';
import { OneSignal } from "@ionic-native/onesignal/ngx";
import { SettingsService } from './services/settings/settings.service';
import { ApiService } from './services/api/api.service';


@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss']
})
export class AppComponent implements OnInit {
  public selectedIndex = 0;
  public userProfile: any = {};
  public appPages = [
    {
      title: 'Accueil',
      url: 'home',
      icon: 'home'
    },
    {
      title: 'Statistiques',
      url: 'stats',
      icon: 'pie-chart'
    },
    {
      title: 'Recherche avancée',
      url: '/search',
      icon: 'search'
    },
    {
      title: 'À propos',
      url: '/about',
      icon: 'help'
    },
    {
      title: 'Politique de confidentialité',
      url: 'policy',
      icon: 'receipt'
    }
  ];
  public logedIn: any = false;
  public bgClasse: any;
  public labels = ['Family', 'Friends', 'Notes', 'Work', 'Travel', 'Reminders'];
  public httpNative: boolean;

  constructor(
    private platform: Platform,
    private splashScreen: SplashScreen, private settings: SettingsService,
    private statusBar: StatusBar, private userData: UserDataService,
    public navCtrl: NavController, private oneSignal: OneSignal, 
    private alertController: AlertController, private menu: MenuController, 
    private socialSharing: SocialSharing, private api: ApiService
  ) {
    this.platform.backButton.subscribeWithPriority(-1, () => {
      if (window.location.pathname == "/home") {
        navigator['app'].exitApp();
      }else{
        // this.navCtrl.navigateRoot("/home");
        // alert(window.location.pathname)
      }
    });

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

    this.initializeApp();
  }

  setBg(bg){
    this.settings.setBackGround(bg).then(() => {
      window.location.reload()
    }, (error) => console.error(error));
  }
  initializeApp() {
    this.platform.ready().then(() => {
      this.settings.getBackGround().then((data => this.bgClasse = data));
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

      try {

        this.oneSignal.startInit('63a027f1-577b-413e-afb0-73556af4a679');

        this.oneSignal.inFocusDisplaying(this.oneSignal.OSInFocusDisplayOption.InAppAlert);

        this.oneSignal.handleNotificationReceived().subscribe(() => {
          // do something when notification is received
        });

        this.oneSignal.handleNotificationOpened().subscribe((donne) => {
          // do something when a notification is opened
          this.alertController.create({subHeader:donne.notification.payload.title, message:donne.notification.payload.body, buttons:["OK"]}).then(a=>{
            a.present();
          });
        });
        this.userData.getId().then(id=>{
          if(id)
          this.oneSignal.sendTag("userid", id);
        })
        this.oneSignal.endInit();
        this.statusBar.styleDefault();
      } catch (error) {
        alert("Error catched "+error);
      }
      this.oneSignal.getIds().then((data)=>{
        // alert("id onesignal : "+JSON.stringify(data));
      });
      this.oneSignal.getTags().then((data)=>{
        // alert("tag onesignal : "+JSON.stringify(data));
      })
      console.log("ready....");
      
      this.statusBar.styleDefault();
      this.splashScreen.hide();
    });
  }
  closeSideMenu(){
    this.menu.close();
  }
  logout(){
    this.userData.logout();
  }

  async share(){
    let userId = await this.userData.getId();
    this.socialSharing.share("Ameliorer votre methode de revision avec Natidja", "Natidja", null, `https://natidja.app/referal/${userId}`).then((data) =>{
      
    }, (err) => {
      alert(err)
    })
  }

  public change(val){
    console.log(val)
    this.api.setNativeHttp(val);
  }

  ngOnInit() {
    this.api.getNativeHttp().then((response) => {
      this.httpNative = response;
      console.debug(response);
    });
    const path = window.location.pathname.split('folder/')[1];
    if (path !== undefined) {
      this.selectedIndex = this.appPages.findIndex(page => page.title.toLowerCase() === path.toLowerCase());
    }
  }
}
