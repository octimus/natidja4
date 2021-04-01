import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AlertController, LoadingController, NavController, Platform } from '@ionic/angular';
import { ApiService } from 'src/app/services/api/api.service';
import { CoursService } from 'src/app/services/cours/cours.service';
import { UserDataService } from 'src/app/services/user-data/user-data.service';

@Component({
  selector: 'app-cours-details',
  templateUrl: './cours-details.page.html',
  styleUrls: ['./cours-details.page.scss'],
})
export class CoursDetailsPage implements OnInit {
  public item: any = {};
  public type: string = "";
  public userProfile: any = {};
  public comment:string = "";
  public comments:any = [];
  public comment_response: any = "";
  public logedIn: boolean = false;
  public nbrCorrect: number = 0;
  public nbrIncorrect: number = 0;
  public showMore: boolean = false;

  constructor(private r: ActivatedRoute, private platform: Platform, 
    private userData: UserDataService, private alertCtrl: AlertController, private api: ApiService, 
    private coursService: CoursService, private loadingController: LoadingController, public navCtrl: NavController) { 
    this.r.queryParams.forEach(p => {
      this.item = p
      console.log({iiiiiiiiii: this.item})
      if(this.item.responses){
        this.item.responses.map(i => {
          if(i.isCorrect == 1)
            this.nbrCorrect++;
          else if(i.isCorrect == 0)
            this.nbrIncorrect++;
        })
      }
      console.log({item:this.item});
      
      if(typeof(this.item.url) != "undefined")
      {
        let a = this.item.url.split('.');
        let ext = a[a.length - 1];
  
        let extensionPhotoArray: Array<string> = ["jpg", "png", "jpeg", "gif", "bmp"];
        let extensionVideoArray: Array<string> = ["mp4", "avi", "MPEG-4", "mov"];
  
        if(extensionPhotoArray.includes(ext)){
          this.type = "photo";
        }
        else if(extensionVideoArray.includes(ext)){
          this.type = "video";
        }
        else
        {
          this.type = "autre";
        }
      }
      this.load();
    });

    this.platform.ready().then((data) => {
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
        if(reponse)
          this.logedIn = true;
        this.userProfile.userId = reponse;
      })
    })
  }
  lineCount(str: string){
    return str.split(/\r\n|\n|\r/).length;
  }
  async validerExo(){
    let l = await this.loadingController.create({
      message:"Validation..."
    });
    l.present();
    this.coursService.validerExo(this.item.id).then((data) => {
      try {
        const json = JSON.parse(data.data)
        console.log({item:this.item, data:json.data});
        if(json.status == "ok"){
          if(json.data){
            let len: number = this.item.responses.length;
            for(var i = 0; i<len; i++){
              this.item.responses.pop();
            }
            json.data.forEach(e => this.item.responses.push(e));
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
  trimString(string, length) {
    let btn = `<a class='btn-view-more'>plus</a>`;
    return string.length > length ? 
            string.substring(0, length) + '...' + btn :
            string;
  }

  public sendResponse(idComment)
  {
    if(!this.comment_response)
    {
      return false;
    }
    this.api.postData("bac/action.php",
     {action:"comment_response", content:this.comment_response, comment:idComment, sender:this.userProfile.userId, 
     cours:this.item.id}, {}).subscribe((response)=>{
      // this.loader.dismiss();  
      let resultat;
      try
      {
        // alert(response.data)
        resultat = JSON.parse((response.data).trim());
      }catch(err)
      {
        this.alertCtrl.create({header:'Erreur :'+JSON.stringify(err), message:response.data, buttons: ["OK"]}).then(a => a.present());
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
        this.alertCtrl.create({header:resultat.status, message:"Il y'a eu une erreure", buttons: ["OK"]}).then(a => a.present());
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
  public deleteComment(idComment)
  {
    this.alertCtrl.create({message:"Êtes-vous sûre de vouloir supprimer ?", buttons: [{text: "Oui", 
    handler: ()=>{
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
          this.alertCtrl.create({header:'Erreur :'+JSON.stringify(err), message:response.data, buttons: ["OK"]}).then(a => a.present());
          return false;
        }
  
        //création de la session
        if(resultat.status === "ok")
        {
          this.load();
        }
        else
        {
          this.alertCtrl.create({header:resultat.status, message:"Il y'a eu une erreure", buttons: ["OK"], cssClass:"alert-danger"}).then(a => a.present());
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
    }}, {text: "Non"}], cssClass: "alert-warning"}).then(a => a.present());

  }
  defaultImg(elt){
    elt.src = "assets/img/default-user.png";
  }
  openPage(page: string){
    return;
  }
  public load(event = null)
  {
    if(!this.item.canSeeComment){
      return;
    }

    this.api.postData("bac/action.php",
    {action:"comments_json", cours:this.item.id, userId: this.userProfile.userId, offset: this.comments?.length}, {}).subscribe((response)=>{
      if(event)
        event.target.complete();
        // this.loader.dismiss();  
        let resultat;
        response.data = (response.data).trim();
        if(response.data=="")
        return false;
        
        try
        {
          resultat = JSON.parse(response.data);
          console.log(resultat)
        if(this.comments.length == 0)
          this.comments = resultat.data;
        else
        {
          if(resultat?.data)
          {  
            this.comments = [...this.comments, ...resultat.data];
          }
        }
        // alert(JSON.stringify(this.comments))
      }catch(err)
      {
        this.alertCtrl.create({header:'Erreur :'+JSON.stringify(err), message:response.data, buttons: ["OK"]}).then(a => a.present());
        return false;
      }

     }, (err)=>{
      if(event)
        event.target.complete();
       this.alertCtrl.create({
        header: "Echec de connexion",
        subHeader: JSON.stringify(err),
        buttons: ["ok"]
      }).then(a => a.present());
      
     });
  }

  public toggleResponse(comment)
  {
    this.comments.map((c)=>{
      if(c != comment)
        c.openResponse = 0;
    })
    if(comment.openResponse == 0)
      comment.openResponse = 1;
    else
      comment.openResponse = 0;
  }
  public loadResponses(item, refresh: any = 0)
  {
    if(refresh == 0)
      item.responses = [];
    this.comments.map(elem => {
      clearTimeout(elem.responses_open);
      elem.responses_open = null;
    })

    let offset = item?.responses?.length ? item.responses?.length : 0;

    this.api.postData("bac/action.php",
      { action: "responses_comment_json", commentId:item.id, offset: offset }, {})
      .subscribe(response => {

        try {

          let dat = response.data.trim();

          let data = JSON.parse(dat);
          if(refresh == 0)
            item.responses = data.data;
          else
          {
            item.responses = [...item.responses, ...data.data];
          }

        }
        catch (error) {
          if(response.data && refresh == 0)
          {
            this.alertCtrl.create({subHeader:'Erreur', message:response.data, buttons: ["OK"]}).then(a => a.present());
          }
        }
      }, (error) => {
        if(refresh == 0)
          this.alertCtrl.create({subHeader:"Problème de connexion", message:JSON.stringify(error), buttons: ["OK"]}).then(a => a.present());
      }
    );

    item.responses_open = setTimeout(() => {
      this.loadResponses(item, 1);
    }, 10000);
  }

  public send()
  {
    if(!this.comment)
    {
      return false;
    }
    this.api.postData("bac/action.php",
     {action:"comment", content:this.comment, sender:this.userProfile.userId, 
      cours:this.item.id}, {}).subscribe((response)=>{
      // this.loader.dismiss();  
      let resultat;
      try
      {
        // alert(response.data)
        resultat = JSON.parse((response.data).trim());
        console.log({resultats: resultat})
      }catch(err)
      {
        this.alertCtrl.create({header:'Erreur :'+JSON.stringify(err), message:response.data, buttons:["OK"], cssClass:"alert-danger"}).then(a => a.present());
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
        console.error(resultat);
        this.alertCtrl.create({header:resultat.status, message:"Il y'a eu une erreure", buttons:["OK"], cssClass:"alert-danger"})
        .then(a => a.present());
      }
     }, (err)=>{
      //  this.loader.dismiss();
       this.alertCtrl.create({
        subHeader: "Echec de connexion",
        message: JSON.stringify(err),
        buttons: ["ok"],
        cssClass: "alert-danger"
      }).then(a => {
        a.present();
      });
      
     })
  }

  public isValidated(items:any[]){
    return items.filter(elt => elt.isCorrect == null).length == 0;
  }
  ngOnInit() {
  }

}
