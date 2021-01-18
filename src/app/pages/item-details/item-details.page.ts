import { Component, OnInit } from '@angular/core';
import { NavController, NavParams, AlertController, LoadingController } from '@ionic/angular';
import { UserDataService } from 'src/app/services/user-data/user-data.service';
import { ApiService } from 'src/app/services/api/api.service';
import { ActivatedRoute } from '@angular/router';
import { InAppBrowser } from '@ionic-native/in-app-browser/ngx';

@Component({
  selector: 'app-item-details',
  templateUrl: './item-details.page.html',
  styleUrls: ['./item-details.page.scss'],
})
export class ItemDetailsPage implements OnInit {

  public item:any = {};
  public options;
  logedIn: boolean;
  mine: boolean = false;
  public comment:string = "";
  public comments:any = [];
  public slidesPub:any = [];

  public userProfile: { displayName: string, telephone: string, userId: any, photo: string, domicile: string, email: string }={displayName:"said maou", telephone:"3632222", userId:3, photo:"default.png", domicile:"vvni", email:"said@octra.io"};
  public comment_response: any = "";


  constructor(public navCtrl: NavController, private loadCtrl: LoadingController,
    public alertCtrl:AlertController, public    userData:UserDataService, 
    public api:ApiService, private route: ActivatedRoute, private iab: InAppBrowser) {

    this.userProfile = { displayName: "octimus", telephone: "3632222", userId: 0, photo: "default.png", domicile: "vvni", email: "said@octra.io" };

    // events.subscribe('user:submit', (user, time) => {
    //     // user and time are the same arguments passed in `events.publish(user, time)`
    //     this.logedIn = true;
    //     this.userData.hasLoggedIn().then((response) => {
    //       this.logedIn = response;
    //     });

    //     this.userData.getDomicile().then((reponse)=>{
    //       this.userProfile.domicile = reponse;
    //     })
    //     this.userData.getUsername().then((reponse)=>{
    //       this.userProfile.displayName = reponse;
    //     })

    //     this.userData.getPhoto().then((reponse)=>{
    //       this.userProfile.photo = reponse;
    //     })
    //     this.userData.getId().then((reponse)=>{
    //       this.userProfile.userId = reponse;
    //     })
    //     if (this.navCtrl.getActive().name == "LoginPage" || this.navCtrl.getActive().name=="SigninPage")
    //       this.navCtrl.pop();
    //   });
    // events.subscribe('user:login', (user, time) => {
    //   // user and time are the same arguments passed in `events.publish(user, time)`
    //   this.logedIn = true;
    //   this.userData.hasLoggedIn().then((response) => {
    //     this.logedIn = response;
    //   });

    //   this.userData.getDomicile().then((reponse)=>{
    //     this.userProfile.domicile = reponse;
    //   })
    //   this.userData.getUsername().then((reponse)=>{
    //     this.userProfile.displayName = reponse;
    //   })

    //   this.userData.getPhoto().then((reponse)=>{
    //     this.userProfile.photo = reponse;
    //   })
    //   this.userData.getId().then((reponse)=>{
    //     this.userProfile.userId = reponse;
    //   })
    //   if (this.navCtrl.getActive().name == "LoginPage" || this.navCtrl.getActive().name=="SigninPage")
    //     this.navCtrl.pop();
    // });

    // this.item = navParams.get('item');
    this.route.queryParams.forEach((p)=>{
      this.item = p.item;
      this.load();
    });
    

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
      this.checkIfMine(reponse)
    })

    // this.showAlert("infos", JSON.stringify(this.item));
  }

  public defaultImg(element, fallback = "assets/img/default-user.png") {
    element.src = fallback;
  }
  public personalizer(item)
  {
    this.navCtrl.navigateForward("candidat-edit", {queryParams: {item:item}});
  }
  public checkIfMine(id) {
    this.api.postData("bac/action.php",
      { action: "check_if_mine", page:"details", userId:id, numero:this.item.numero, annee:this.item.year, exam:this.item.exam }, {})
      .subscribe(response => {

        try {

          let resp = JSON.parse(response.data.trim());
          this.mine = resp.mine;
        }
        catch (error) {
          if(response.data)
          {
            this.showAlert('Erreur', response.data);
          }
        }
      }, (error) => {

        this.showAlert("Problème de connexion", JSON.stringify(error));
      });
  }
  public loadPubs() {

    this.slidesPub = [];
    
    this.api.postData("bac/action.php",
      { action: "pubs_json", page:"details" }, {})
      .subscribe(response => {

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

        this.showAlert("Problème de connexion", JSON.stringify(error));
      });
  }
  ionViewDidLoad() {
    console.log('ionViewDidLoad ItemDetailPage');
    this.loadPubs();
  }
  ionViewWillLeave() {

    this.options = {
       direction: 'up',
       duration: 500,
       slowdownfactor: 3,
       slidePixels: 20,
       iosdelay: 100,
       androiddelay: 150,
       fixedPixelsTop: 0,
       fixedPixelsBottom: 60
      };
   
   }
   
  async showAlert(titre, contenu) {
    let alert = await this.alertCtrl.create({
      subHeader: titre,
      message: contenu,
      buttons: ['OK']
    });
    alert.present();
  }
  // example of adding a transition when pushing a new page
  openLogin(page="login", item: any) {
    this.navCtrl.navigateForward(page, {queryParams:{item:item}})
  }
  openPage(page, item: any) {
    this.alertCtrl.create({
    subHeader: item.code_secret_type,
    message:"",
    buttons: [{
      text: "Valider",
      handler: (data) => {
        let loader;
        this.loadCtrl.create({message: "verification..."}).then((load)=>{
          loader = load;
          loader.present();
        })
        console.log(this.item);
        console.log(data)
        
        this.api.postData("bac/action.php", 
          {action:"check_notes_secret_code", code: data.code_secret, id_etudiant: this.item.id}).subscribe((data)=>{
            let json;
            loader.dismiss();
            try {
              
              json = JSON.parse(data.data.trim());
            } catch (error) {
              this.showAlert('', data.data);
            }

            if(json.success){
              this.navCtrl.navigateForward(page, {queryParams:{
                item: item,
                code_secret:data.code_secret
              }
              });
            }else if(json.success == false)
              this.showAlert("Code incorrect", json.msg);
          }, (error)=>{
            loader.dismiss();
            this.showAlert("", error);
          })
      }
    }, {
      text: "Annuler"
    }],
    inputs: [{
      name: "code_secret",
      type: "password",
      placeholder: "Taper "+item.code_secret_type,
    }]
    }).then(a =>{
      a.present();
    });
  }
  public load()
  {
    this.api.postData("bac/action.php",
     {action:"comments_json", candidate:this.item.numero, 
     annee:this.item.year, exam:this.item.exam}, {}).subscribe((response)=>{
      // this.loader.dismiss();  
      let resultat;
      response.data = (response.data).trim();
      if(response.data=="")
        return false;
        
      try
      {
        resultat = JSON.parse(response.data);
        this.comments = resultat.data;
        // alert(JSON.stringify(this.comments))
      }catch(err)
      {
        alert(err)
        this.showAlert('Erreur :'+JSON.stringify(err), response.data);
        return false;
      }

     }, (err)=>{
      //  this.loader.dismiss();
      //  this.alertCtrl.create({
      //   title: "Echec de connexion",
      //   subTitle: "Veuillez verifier votre connexion à internet SVP.",
      //   buttons: ["ok"]
      // }).present();
      
     })
  }
  public openInAppBrowser(link:string){
    const browser = this.iab.create(link);
    // browser.executeScript()
    browser.on("exit").subscribe(()=>{
      this.navCtrl.navigateBack("home");
    })
  }
  public sendResponse(idComment)
  {
    if(!this.comment_response)
    {
      this.showAlert("Erreur", "Votre réponse ne peut pas être vide.");
      return false;
    }
    this.api.postData("bac/action.php",
     {action:"comment_response", content:this.comment_response, comment:idComment, sender:this.userProfile.userId, 
     candidate:this.item.numero, year:this.item.year, exam:this.item.exam}, {}).subscribe((response)=>{
      // this.loader.dismiss();  
      let resultat;
      try
      {
        // alert(response.data)
        resultat = JSON.parse((response.data).trim());
      }catch(err)
      {
        this.showAlert('Erreur :'+JSON.stringify(err), response.data);
        return false;
      }

      //création de la session
      if(resultat.status === "ok")
      {
        this.comment_response = ""; 
        this.load();
      }
      else
      {
        this.showAlert(resultat.status, "Il y'a eu une erreure");
      }
     }, (err)=>{
      //  this.loader.dismiss();
       this.alertCtrl.create({
        header: "Echec de connexion",
        message: "Veuillez verifier votre connexion à internet SVP.",
        buttons: ["ok"]
      }).then(a => {
        a.present();
      });
      
     })
  }
  public send()
  {
    if(!this.comment)
    {
      this.showAlert("Erreur", "Votre commentaire ne peut pas être vide.");
      return false;
    }
    this.api.postData("bac/action.php",
     {action:"comment", content:this.comment, sender:this.userProfile.userId, candidate:this.item.numero, 
     year:this.item.year, exam:this.item.exam}, {}).subscribe((response)=>{
      // this.loader.dismiss();  
      let resultat;
      try
      {
        // alert(response.data)
        resultat = JSON.parse((response.data).trim());
      }catch(err)
      {
        this.showAlert('Erreur :'+JSON.stringify(err), response.data);
        return false;
      }

      //création de la session
      if(resultat.status === "ok")
      {
        this.comment = ""; 
        this.load();
      }
      else
      {
        this.showAlert(resultat.status, "Il y'a eu une erreure");
      }
     }, (err)=>{
      //  this.loader.dismiss();
       this.alertCtrl.create({
        subHeader: "Echec de connexion",
        message: "Veuillez verifier votre connexion à internet SVP.",
        buttons: ["ok"]
      }).then(a => {
        a.present();
      });
      
     })
  }
  public deleteComment(idComment)
  {
    if(!confirm("Êtes-vous sûre de vouloir supprimer ?"))
      return false;

    this.api.postData("bac/action.php",
     {action:"delete_comment", idComment}, {}).subscribe((response)=>{
      // this.loader.dismiss();  
      let resultat;
      try
      {
        // alert(response.data)
        resultat = JSON.parse((response.data).trim());
      }catch(err)
      {
        this.showAlert('Erreur :'+JSON.stringify(err), response.data);
        return false;
      }

      //création de la session
      if(resultat.status === "ok")
      {
        this.load();
      }
      else
      {
        this.showAlert(resultat.status, "Il y'a eu une erreure");
      }
     }, (err)=>{
      //  this.loader.dismiss();
       this.alertCtrl.create({
        subHeader: "Echec de connexion",
        message: "Veuillez verifier votre connexion à internet SVP.",
        buttons: ["ok"]
      }).then(a => {
        a.present();
      });
      
     })
  }

  public toggleResponse(comment)
  {
    if(comment.openResponse == 0)
      comment.openResponse = 1;
    else
      comment.openResponse = 0;
  }
  public loadResponses(item)
  {
    item.responses = [];

    this.api.postData("bac/action.php",
      { action: "responses_comment_json", commentId:item.id }, {})
      .subscribe(response => {

        try {

          let dat = response.data.trim();

          let data = JSON.parse(dat);
          item.responses = data.data; 

        }
        catch (error) {
          if(response.data)
          {
            this.showAlert('Erreur', response.data);
          }
        }
      }, (error) => {

        this.showAlert("Problème de connexion", JSON.stringify(error));
      });
  }
  ngOnInit() {
  }

}
