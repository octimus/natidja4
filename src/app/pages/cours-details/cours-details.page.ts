import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AlertController, IonSlides, LoadingController, NavController, Platform, PopoverController } from '@ionic/angular';
import { CoachDetailsComponent } from 'src/app/components/coach-details/coach-details.component';
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
  public sending: boolean = false;

  questionSlides = {
    initialSlide: 0,
    direction: 'horizontal',
    speed: 300,
    // spaceBetween: 8,
    // loop:true,
    slidesPerView: 1,
  };

  constructor(private r: ActivatedRoute, private platform: Platform, 
    private userData: UserDataService, private alertCtrl: AlertController, private api: ApiService, 
    private coursService: CoursService, private loadingController: LoadingController, private popoverController: PopoverController,
    public navCtrl: NavController) { 
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
    if(str)
      return str.split(/\r\n|\n|\r/).length;
    else
      return 2;
  }
  setComprehension(item, value: number){
    // item.loadingComprehension = true;
    this.coursService.setComprehension(item, value).then((data)=>{
      let json;
      
      try {
        json = JSON.parse(data.data);
      } catch (error) {
        alert(data.data)
      }
      console.log(json);
      if(json.status == "ok"){
        console.log(this.item);
        this.item = Object.assign({}, this.item)
        console.log(value);
        
        this.item.comprehension = value;
        console.log(this.item);
      }
      else{
        console.log(json.status);
      }
    }).finally(() => {
      // item.loadingComprehension = false;
    })
  }
  public async sendResponseExo(q, elt: any, last=0, item: any = {}){
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
            this.validerExo()
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
      this.alertCtrl.create({message:err.error, buttons: ["OK"]}).then(a => a.present());
    }).finally(()=>{
      q.loading = false;
    })
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
  getQuestions(resp: any[]): Array<any>{
    return resp?.filter((elt) => elt.question);
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
      let resultat;
      try
      {
        resultat = response?.data ? JSON.parse(response.data.trim()) : response;
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
      
     }, ()=>{
      this.sending = false;
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
          resultat = response?.data ? JSON.parse(response.data.trim()) : response;
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
        console.log(response);
        
        if(response === "" || response?.data == "")
          return;
        let r = response?.data ? response.data : response;

      try
      {
        resultat = typeof(r) === "string" ? JSON.parse(r.trim()) : r;
        if(this.comments?.length == 0)
        {  
          console.log({c_ici_k_il_y_a_le_soucis: resultat})
          this.comments = resultat?.data ?? resultat;

        }
        else
        {
          if(resultat?.data)
          {
            if(typeof(this.comments) == "undefined")
              this.comments = [];
            this.comments = [...this.comments, ...resultat?.data];
          }
        }
      }
      catch(err)
      {
        console.error(err);
        console.log(response);
        this.alertCtrl.create({header:'Erreur :'+JSON.stringify(err), message:response, buttons: ["OK"]}).then(a => a.present());
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
          let d = response?.data ? response.data : response;
          let data = typeof(d) == "string" ? JSON.parse(d.trim()) : d;
          console.log(data);
          
          if(refresh == 0)
            item.responses = data?.data || data;
          else
          {
            item.responses = [...item.responses, ...data?.data || data];
          }

        }
        catch (error) {
          if(response.data && refresh == 0)
          {
            this.alertCtrl.create({subHeader:typeof(error) == 'string' ? error : JSON.stringify(error), message:response.data, buttons: ["OK"]}).then(a => a.present());
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
    this.sending = true;

    this.api.postData("bac/action.php",
     {action:"comment", content:this.comment, sender:this.userProfile.userId, 
      cours:this.item.id}, {}).subscribe((response)=>{
      this.sending = false;
      // this.loader.dismiss();  
      let resultat;
      try
      {
        // alert(response.data)
        resultat = response?.data ? JSON.parse(response.data.trim()) : response;
      }catch(err)
      {
        this.alertCtrl.create({header:'Erreur :'+JSON.stringify(err), message:response.data, buttons:["OK"], cssClass:"alert-danger"}).then(a => a.present());
        return false;
      }

      //création de la session
      if(resultat.status === "ok")
      {
        this.comment = ""; 
        console.log(resultat)
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
      this.sending = false;

       this.alertCtrl.create({
        subHeader: "Echec de connexion",
        message: JSON.stringify(err),
        buttons: ["ok"],
        cssClass: "alert-danger"
      }).then(a => {
        a.present();
      });
      
     }, () => {
      this.sending = false;
     })
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

  public isValidated(){
    return this.item.responses.filter(elt => elt.isCorrect == null).length == 0;
  }
  ngOnInit() {
  }

}
