import { Injectable } from '@angular/core';
import { LoadingController, AlertController, NavController } from '@ionic/angular';
import { HTTP } from '@ionic-native/http/ngx';
import { Storage } from '@ionic/storage';
import { BehaviorSubject, Observable } from 'rxjs';
import { ApiService } from '../api/api.service';

@Injectable({
  providedIn: 'root'
})
export class UserDataService {

  userId: any;
  userProfile: any;
  chatUser: {id:string; name:string; avatar:string};
  _favorites: string[] = [];
  HAS_LOGGED_IN = 'hasLoggedIn';
  HAS_SEEN_SHOW_TUT = 'hasSeenShowTut';
  HAS_SEEN_COM_TUT = 'hasSeenShowTut';
  HAS_SEEN_ADD_TUT = 'hasSeenShowTut';
  HAS_SEEN_MYPROD_TUT = 'hasSeenMyprodTut';
  HAS_SEEN_SETTINGS_TUT = 'hasSeenSettingsTut';
  HAS_SEEN_TUTORIAL = 'hasSeenTutorial';
  address_serveur:string = "https://octra.io/octram";
  loader: HTMLIonLoadingElement;
  public loginState = new BehaviorSubject(0);
  step: any;

  constructor(public http: HTTP, public storage: Storage, 
    public alertCtrl:AlertController, private api: ApiService
  ,public loadingCtrl: LoadingController, private navCtrl: NavController)
  {
    this.getIle();    
    // events.subscribe('user:login', () => {
    //   try {
    //     this.getUsername().then((donne)=>{
    //       this.chatUser.name = donne;
    //     })
    //     this.getPhoto().then((donne)=>{
    //       this.chatUser.avatar = donne;
    //     })
    //     this.getId().then((donne)=>{
    //       this.userId = donne;
    //       this.chatUser.id = donne;
    //     })
    //   } catch (error) {
    //     alert(error)
    //   }
    // });

    this.chatUser = {id:"a", name:'st', avatar:'sh'};
    this.loadingCtrl.create({
      message: "Chargement...",
    }).then((l)=>{
      this.loader = l;
    });

    this.userProfile = {username:""}
    try {
      this.getUsername().then((donne)=>{
        this.chatUser.name = donne;
      })
      this.getPhoto().then((donne)=>{
        this.chatUser.avatar = donne;
      })
      this.getId().then((donne)=>{
        this.userId = donne;
        this.chatUser.id = donne;
      })
    } catch (error) {
      alert(error)
    }
   
  }

  setLevel(level){
    this.storage.set("level", level).catch((error)=>console.error(error));
  }
  getLevel(): Promise<any>{
    return this.storage.get("level");
  }

  checkAccount(tel: string): Promise<any>{
    let obs: Observable<any> = this.api.postDataAlt("octram/action_mobile.php", {action:"check_account", login:tel}, {});
    obs.subscribe((response) => console.log(response));
    return obs.toPromise();
  }
  setPersonId(school: any, phoneNumber: string){
    this.http.post(school.url+"/action_mobile.php",
     {action:"get_person_id", telephone:phoneNumber, ecole:school.id}, {}).then((data) => {
       try {
         const json = JSON.parse(data.data)
         console.log(json)
         this.storage.set("id_person", json.data.id);
       } catch (error) {
         console.log({in_get_person_id: data.data});
       }
     })
  }
  getPersonId(): Promise<string> {
    return this.storage.get('id_person').then((value) => {
      return value;
    }, (error)=>{
      alert(JSON.stringify(error))
    });
  };

  hasFavorite(sessionName: string): boolean {
    return (this._favorites.indexOf(sessionName) > -1);
  };

  addFavorite(sessionName: string): void {
    this._favorites.push(sessionName);
  };

  removeFavorite(sessionName: string): void {
    let index = this._favorites.indexOf(sessionName);
    if (index > -1) {
      this._favorites.splice(index, 1);
    }
  };

  login(userInfo):  Promise<any> {
    
    this.loader.present();

    let pp: Promise<any> = this.api.postDataAlt("octram/action_mobile.php",
     {action:"login", login:userInfo.login, password:userInfo.password, referal:userInfo?.referal}, {}).toPromise();

     pp.then((response)=>{
      this.loader.dismiss();      
      let resultat;
      try
      {
        // alert(response.data)
        resultat = response?.data ? JSON.parse(response.data) : response;
      }catch(err)
      {
        this.alerter(response.data);
        return false;
      }
      console.log({resultats: resultat});

      //création de la session
      if(resultat.status == "ok")
      {
        this.storage.set(this.HAS_LOGGED_IN, true)
        this.storage.set("username", resultat.username);
        this.storage.set('telephone', resultat.telephone);         
        this.storage.set('photo', resultat.photo);         
        this.storage.set('email', resultat.email);
        this.storage.get("school").then(s => {
          if(s){
            console.log({s:s});
            
            this.setPersonId(s, resultat.telephone);
          }
        })
        this.storage.set('domicile', resultat.domicile);     
        this.storage.set('octicoin', resultat.octicoin);
        this.storage.set('octicoin', resultat.octicoin);
        
        this.storage.set('user_id', resultat.id).then(()=>{
          this.loginState.next(1);
        })      
        // this.alertCtrl.create({
        //   header: "Bienvenu!",
        //   subHeader: "Vous êtes maintenant connecté.",
        //   buttons: ["ok"]
        // }).then((alert)=>{alert.present();})
        // this.events.publish('user:login');
        // window.location.reload();
        // this.oneSignal.sendTags({"user_id": resultat.id});
        
        //  return true;
      }
      else
      {
        this.alerter(resultat.status, "Problème d'authentification");
      }
     }, (err)=>{
       this.loader.dismiss();
       this.alertCtrl.create({
        header: "Echec de connexion",
        subHeader: "Veuillez verifier votre connexion à internet SVP.",
        buttons: ["ok"]
      }).then(alert => {
        alert.present();
      });
      
     })

     return pp;
  };

  signup(resultat:any): void {
    try {
      
      this.storage.set(this.HAS_LOGGED_IN, true);
    } catch (error) {
      alert(error + " : has_logged_in");
    }
    try {
      
      this.storage.set("username", resultat.username);
    } catch (error) {
      alert(error + " : username");
    }
    try {
      
      this.storage.set('telephone', resultat.telephone);         
    } catch (error) {
      alert(error + " : telephone");
      
    }
    
    try {
      
      this.storage.set('photo', resultat.photo);
    } catch (error) {
      alert(error + " : photo");
      
    }
    
    this.storage.set('user_id', resultat.id).then((data)=>{
      this.loginState.next(1);
    });     
    this.userId = resultat.id;     
    this.storage.set('email', resultat.email);         

    try {
      this.storage.set('domicile', resultat.domicile);         
      this.storage.set('octicoin', resultat.octicoin);         
    } catch (error) {
      alert("kobaaa : "+error)
    }
    try {
      // this.events.publish('user:login');
      setTimeout(function(){window.location.reload()}, 1000);
    } catch (error) {
      // alert("Désolé, il y'a eu une petite erreur.Veuillez remdemarrer l'application.Merci : "+error);
      setTimeout(function(){window.location.reload()}, 1000);
    }
    // this.events.publish('user:signup');
  };

  logout(): void {
    this.storage.clear().then(()=>{
      window.location.reload();
    });
  };
  async alerter(message, titre = "") {
    let alert = await this.alertCtrl.create({
      header: titre,
      subHeader: message,
      buttons: ['Fermer']
    });
    alert.present();
  }
  setPhoto(username: string): void {
    this.storage.set('photo', username);
  };
  
  setUsername(username: string): void {
    this.loader.present();
    
    this.http.post(this.address_serveur+"/action_mobile.php", 
    {
      action:"modification_membre", nom:username, id:this.userId}, {}).then((response)=>
      {
        this.loader.dismiss();
        try 
        {
          let rep = JSON.parse(response.data);
          if(rep.status == "ok")
            this.storage.set('username', username);
          else
            this.alerter(rep.msg);
        } catch (error) {
          this.alerter(error+" : "+response.data);
        } 
        
    }, (err)=>{
      this.alerter("Problème de connexion.");
      this.loader.dismiss();      
    })
  };
  setEmail(username: string): void {
    this.loader.present();
    this.http.post(this.address_serveur+"/action_mobile.php", 
    {
      action:"modification_membre", email:username, id:this.userId}, {}).then((response)=>
      {
        this.loader.dismiss();
        let rep = JSON.parse(response.data);
        if(rep.status == "ok")
          this.storage.set('email', username);
        else
          this.alerter(rep.msg);
      }, (err)=>{
        this.alerter("Problème de connexion.");
        this.loader.dismiss();
      }
  )
  };
  setTelephone(telephone: string): void {
    this.loader.present();
    
    this.http.post(this.address_serveur+"/action_mobile.php", 
    {
      action:"modification_membre", telephone:telephone, id:this.userId}, {}).then((response)=>
      {
        this.loader.dismiss();        
        let rep = JSON.parse(response.data);
        if(rep.status == "ok")
          this.storage.set('telephone', telephone);
        else
          this.alerter(rep.msg);
        // this.alerter(JSON.parse(response.data).msg);
      }, (err)=>{
        this.alerter("Problème de connexion.");
        this.loader.dismiss();        
      }
  )
  };
  setDomicile(username: string): void {
    this.loader.present();    
    this.http.post(this.address_serveur+"/action_mobile.php", 
    {
      action:"modification_membre", domicile:username, id:this.userId}, {}).then((response)=>{

      this.loader.dismiss();        
      let rep = JSON.parse(response.data);
      if(rep.status == "ok")
        this.storage.set('domicile', username);
      else
        this.alerter(rep.msg);

    }, (err)=>{
      this.alerter("Problème de connexion.");
      this.loader.dismiss();      
    })
  };
  setDomicileMap(latitude:any, longitude: any): void {
    this.loader.present();    
    this.http.post(this.address_serveur+"/action_mobile.php", 
    {
      action:"modification_membre", latitude:latitude, longitude:longitude, id:this.userId}, {}).then((response)=>{

      this.loader.dismiss();        
      try
      {
        let rep = JSON.parse(response.data);
        this.alerter(rep.msg, "Mission accomplie !");
      }
      catch(err)
      {
        this.alerter(response.data, "Désolé !");
      }


    }, (err)=>{
      alert("Problème de connexion.");
      this.loader.dismiss();      
    })
  };
  setPassword(username: string, passwordA:string): void {
    if(username=="" || passwordA=="")
    {
      this.alerter("Veuillez remplire les 2 champs SVP.")
    }
    else
    {
      this.loader.present();
      
      this.http.post(this.address_serveur+"/action_mobile.php", 
      {
        action:"modification_membre", password:username, passwordA:passwordA, id:this.userId}, {}).then((response)=>
        {
          this.loader.dismiss();
          try 
          {
            let rep = JSON.parse(response.data);
            this.alerter(rep.msg);
          } catch (error) {
            alert(error + " : "+response.data)  
          }   
  
      }, (err)=>{
        this.alerter("Problème de connexion.");
        this.loader.dismiss();      
      })
    }
  };
  setOcticoin(arg0: any): any {
    this.storage.set('octicoin', arg0);
  }
  setHasSeenTutorial(arg0: any): any {
    this.storage.set(this.HAS_SEEN_TUTORIAL, arg0);
  }
  setHasSeenSettingsTut(arg0: any): any {
    this.storage.set(this.HAS_SEEN_SETTINGS_TUT, arg0);
  }
  setHasSeenComTut(arg0: any): any {
    this.storage.set(this.HAS_SEEN_COM_TUT, arg0);
  }
  setHasSeenShowTut(arg0: any): any {
    this.storage.set(this.HAS_SEEN_SHOW_TUT, arg0);
  }
  setHasSeenAddTut(arg0: any): any {
    this.storage.set(this.HAS_SEEN_SHOW_TUT, arg0);
  }
  setHasSeenMyprodTut(arg0: any): any {
    this.storage.set(this.HAS_SEEN_MYPROD_TUT, arg0);
  }
  
  setAffichage(arg0: any): any {
    this.storage.set('affichage', arg0);
  }

  setIle(arg0: any): any
  {
    this.storage.set("ile", arg0);
  }

  getAffichage() {
    return this.storage.get("affichage").then((theme)=>{
      return theme;
    });
  };
  setPersonnalTheme(arg0: any): any {
    this.storage.set('theme', arg0);
  }


  getPersonnalTheme() {
    return this.storage.get("theme").then((theme)=>{
      return theme;
    });
  };

  getUserChat() {
    return this.chatUser;
  };

  rechargerOcticoin(code: string): Promise<string> {
    return this.storage.get("user_id").then((user_i)=> {
      return this.http.post(this.address_serveur+'/action_mobile.php', {action:"recharger_octicoin", id:user_i, code_recharge: code}, {}).then((value) => {
        return value.data;
      });
    })
  };
  getOcticoin(): Promise<string> {
    return this.storage.get("user_id").then((user_i)=> {
      return this.api.postDataAlt('octram/action_mobile.php', {action:"get_octicoin", user_id:user_i}, {}).toPromise().then((value) => {
        return value?.data ?? value;
      });
    })
  };
  getIle(): Promise<any> {
    return this.storage.get('ile').then((value) => {
      return value;
    });
  };
  getId(): Promise<string> {
    return this.storage.get('user_id').then((value) => {
      return value;
    }, (error)=>{
      alert(JSON.stringify(error))
    });
  };
  getEmail(): Promise<string> {
    return this.storage.get('email').then((value) => {
      return value;
    });
  };
  getDomicile(): Promise<string> {
    return this.storage.get('domicile').then((value) => {
      return value;
    });
  };
  getUsername()
  {
    return this.storage.get('username').then((value) => {
      return value;
    });
  }
  getTelephone()
  {
    return this.storage.get('telephone').then((value) => {
      return value;
    });
  }
  getPhoto()
  {
    return this.storage.get('photo').then((value) => {
      return value;
    });
  }
  hasLoggedIn(): Promise<boolean> {
    return this.storage.get(this.HAS_LOGGED_IN).then((value) => {
      return value === true;
    });
  };

  checkHasSeenTutorial(): Promise<string> {
    return this.storage.get(this.HAS_SEEN_TUTORIAL);
  }
  checkHasSeenAddTut(): Promise<string> {
    return this.storage.get(this.HAS_SEEN_ADD_TUT).then((value) => {
      return value;
    });
  };
  checkHasSeenComTut(): Promise<string> {
    return this.storage.get(this.HAS_SEEN_COM_TUT).then((value) => {
      return value;
    });
  };
  checkHasSeenShowTut(): Promise<string> {
    return this.storage.get(this.HAS_SEEN_SHOW_TUT).then((value) => {
      return value;
    });
  };
  checkHasSeenSettingsTut(): Promise<string> {
    return this.storage.get(this.HAS_SEEN_SETTINGS_TUT).then((value) => {
      return value;
    });
  };
  checkHasSeenMyprodTut(): Promise<string> {
    return this.storage.get(this.HAS_SEEN_MYPROD_TUT).then((value) => {
      return value;
    });
  };

  setPasswordWithResetCode(login:any, code: string, passwordA:string, passwordB:string): Promise<any> {
    if(passwordB=="" || passwordA=="")
    {
      this.alerter("Veuillez remplire les 2 champs SVP.")
      return new Promise((data)=>{
        return data;
      });
    }
    else
    {
      this.loader.present();

      if(passwordA != passwordB)
      {
        this.alerter("Les 2 mots de passes saisies ne sont pas identiques.")
        return new Promise(()=>{
          return {status:"not ok"};
        });
      }
      
      return this.http.post(this.address_serveur+"/action_mobile.php", 
      {
        action:"modification_membre", code:code, password:passwordA, login:login}, {}).then((response)=>
        {
          this.loader.dismiss();
          try 
          {
            let rep = JSON.parse(response.data);

            if(rep.msg)
            this.alerter(rep.msg);
            return rep;
          } catch (error) {
            alert(error + " : "+response.data) 
            return {status:"error"}
          }   
  
      }, (err)=>{
        this.alerter("Problème de connexion.");
        this.loader.dismiss();      
        return {status:"not ok"}
      })
    }
  };

  public verifyResetCode(login, code)
  {
    this.loader.present();
    return this.http.post(this.address_serveur + "/action_mobile.php",
     {action:"check_code", login:login, code:code}, {}).then((response)=>
     {
        this.loader.dismiss();      
        let resultat;
        try
        {
          resultat = JSON.parse(response.data);
        }catch(err)
        {
          this.alerter(response.data);
          return false;
        }

        //création de la session
        if(resultat.status === "ok")
        {
          this.step++;
          return resultat;
          //  return true;
        }
        else
        {
          this.alerter(resultat.status);
          return resultat;
        }
     }, (err)=>{
       this.loader.dismiss();
       this.alertCtrl.create({
        header: JSON.stringify(err),
        subHeader: "Veuillez verifier votre connexion à internet SVP.",
        buttons: ["ok"]
      }).then(a=>a.present());
      return false;
     })
  }
  public sendResetCode(login)
  {
    this.loader.present();

    return this.http.post(this.address_serveur + "/action_mobile.php",
     {action:"reset_password_code_creation", login:login}, {}).then((response)=>{
      this.loader.dismiss();      
      let resultat;
      try
      {
        resultat = JSON.parse(response.data);
      }catch(err)
      {
        this.alerter(response.data);
        return false;
      }

      //création de la session
      if(resultat.status === "ok")
      {
        console.log("good!");
        // this.alertCtrl.create({
        //   title: "",
        //   subTitle: "Nous vous avons envoyé un message contenant le code de reinitialisation.",
        //   buttons: ["ok"]
        // }).present();
        //  return true;
      }
      else
      {
        this.alerter(resultat.status, "");
      }
      return resultat;
     }, (err)=>{
       this.loader.dismiss();
       this.alertCtrl.create({
        header: JSON.stringify(err),
        subHeader: "Veuillez verifier votre connexion à internet SVP.",
        buttons: ["ok"]
      }).then((a)=> a.present());
      return false;
     })
  }

  // setCurrentLocationAsHome()
  // {
  //   this.geolocation.getCurrentPosition({ enableHighAccuracy: true }).then((posi) => {
  //     this.setDomicileMap(posi.coords.latitude, posi.coords.longitude);
  //   }, (err)=>{
  //     console.log(err);
  //   });
  // }
}
