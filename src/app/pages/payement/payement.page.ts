import { Component, OnInit, ViewChild } from '@angular/core';
import { UserDataService } from 'src/app/services/user-data/user-data.service';
import { ApiService } from 'src/app/services/api/api.service';
import { NavController, NavParams, AlertController, Platform, LoadingController } from '@ionic/angular';
import { CallNumber } from '@ionic-native/call-number/ngx';
import { ActivatedRoute } from '@angular/router';
import { InAppBrowser } from '@ionic-native/in-app-browser/ngx';
import { SmsRetriever } from '@ionic-native/sms-retriever/ngx';
import { platform } from 'process';
import { build$ } from 'protractor/built/element';
// import { SMS } from '@ionic-native/sms/ngx';
import { Storage } from '@ionic/storage';

declare var SMSReceive: any;

@Component({
  selector: 'app-payement',
  templateUrl: './payement.page.html',
  styleUrls: ['./payement.page.scss'],
})
export class PayementPage implements OnInit {

  public phoneNumber:any = null;
  public mvolaAction:any = null;
  public senderPhoneNumber:any;
  public loading:any = 0;
  public ct_sms_receiver: string;
  public notPayed: any;
  public loading2:any = 0;
  private loader: HTMLIonLoadingElement;
  public a_server:any = "https://natidja.octra.io";
  public item:any = {};
  public userId:any;
  public price:{all:number, mvola: number, ct: number, card: number} = {all:null, mvola:null, ct: null, card: null};
  public paymentText:string = null;
  public reason:any = null;
  public demander_num:any = 0;
  public text:any = null;
  public ct_sms_content: string;
  public ct_sms_msg: string = "";
  public ct_sms_btn_show: string = "";
  public ct_alert: string;
  public pic:any = null;
  public codeAchat: string;
  public appHash: string;
  public mvola_self_accept: boolean;
  public appropriate_num_id: number;
  private id_ecole: number = null;

  @ViewChild('sender') senderInput: any;
  raison: string;
  user_phone: any;
  public paymentLink: string;

  startWatchingCTSMS() {
    SMSReceive.startWatch(
      () => {
        console.log('watch started');
        document.addEventListener('onSMSArrive', (e: any) => {
          console.log('onSMSArrive()');
          console.log(e);
          
          var IncomingSMS = e.data;
          let response = IncomingSMS.body;
          let wordsArray = response.split(":");
          this.codeAchat = wordsArray[1].trim();
          this.sendCode();
          console.log(IncomingSMS);
          SMSReceive.stopWatch();
          
        });
      },
      () => { console.log('watch start failed') }
    )
  }
  startWatchingMvolaSMS() {
    this.smsRetriever.startWatching().then((data)=>{
    let expectedContent = "MVOLA- Vous avez paye "+this.price.mvola+" Fc a ME4009373 le 18/08/20…018037";
    
    var IncomingSMS = data;
    if(expectedContent?.split(" le ")[0] == IncomingSMS.split(" le ")[0]){
      // if(IncomingSMS.address == "Transfert"){
        if(this.mvola_self_accept){
          // if(IncomingSMS.service_center == "+2694000110"){
            let params = {action: "appropriate_payed",reason: this.item.reason, item:this.item, ecole:this.id_ecole, 
            id_membre:this.userId, numero:this.item.numero ?? this.item.num ?? this.item.id, validity:this.item.validity,
            annee: this.item.year, ile: this.item.ile, examen:this.item.exam, telephone_membre:this.user_phone};

            const callBack = (data)=>{
              console.log({appro_payed: data});
              
              let json = JSON.parse(data.data);
              this.alertCtrl.create({subHeader: json.msgTitle, message:json.msg, buttons:["OK"]})
              .then((d)=>{
                if(json.status == "ok"){
                  d.onDidDismiss().then(()=>{
                    this.navCtrl.navigateBack("home");
                  })
                }
                d.present();
              });
            }

            if(this.reason == "coaching")
            {
              this.api.postData("action_mobile.php", params).subscribe(callBack)
            }
            else
            {
              this.api.postData2("action_mobile.php", params).subscribe(callBack)
            }
          // }
        }
        else{
          this.alertCtrl.create({subHeader: "Paiement", message: "Votre paiement est en cours.", buttons:["OK"]})
            .then((d)=>{
              d.onDidDismiss().then(()=>{
                this.navCtrl.navigateBack("home");
              })

              d.present();
            });
        }
    }
    console.log(IncomingSMS);
    SMSReceive.stopWatch();
    
  });
  }
  getReason(): string{
    let ileNum;
    let examen;
    if(this.item.ile == "Ngazidja")
      ileNum = 0;
    else if(this.item.ile=="Anjouan")
      ileNum = 1;
    else if(this.item.ile == "Moheli"){
      ileNum = 2;
    }
    if(this.item.type_examen == "BAC")
      examen = 0;
    else if(this.item.type_examen=="BEPC")
      examen = 1;
    else if(this.item.type_examen == "SIXIEME"){
      examen = 2;
    }

    let year = this.item.year?.split("-")[1];
    
    // let str: string = ileNum+year[2]+year[3]+examen+this.item.num+this.userId;
    let str: string = this.appropriate_num_id+"";
    return "0";
  }
  constructor(public navCtrl: NavController, public api:ApiService, 
    public call:CallNumber,
  public alertCtrl:AlertController, public userData:UserDataService, 
  private route: ActivatedRoute, 
  private iab: InAppBrowser,
  private platform: Platform, private loaderCtrl: LoadingController, 
  // private sms: SMS, 
  private smsRetriever: SmsRetriever, public storage: Storage) {
    
  this.storage.get("telephone").then(t => {
    this.user_phone = t;
  });
    // this.smsRetriever.getAppHash().then((r)=>{
    //   this.appHash = r;
    // })
    this.route.queryParams.forEach((p)=>{
      this.item = p.item;
      this.reason = p?.reason;
      this.id_ecole = p?.id_ecole;
      console.log(p);      

      if(typeof(this.item) == "string"){
        try {
          this.item = JSON.parse(this.item);
        } catch (error) {
          this.alertCtrl.create({
            message:error,
            buttons:["ok"]
          }).then(d=>{
            d.present();
          });

        }
      }
      this.item.num = this.item.num ?? this.item.numero;
      this.item.type_examen = this.item.type_examen ?? this.item.exam;
      console.info(this.item)

      if(p.price)
        this.price = p.price;
    })
    

    // this.smsRetriever.getAppHash()
    // .then((res: any) => console.log(res))
    // .catch((error: any) => console.error(error));
    // this.smsRetriever.startWatching()
    //   .then((res: any) => console.log(res))
    //   .catch((error: any) => console.error(error));

    this.loaderCtrl.create({message:"chargement"}).then(d=>{
      this.loader = d;
      this.userData.getId().then((data)=>{
        this.userId = data;
        console.log({data:data});
        
        this.loadPhone(data); 
      })
    })
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad PayementPage');
  }
  ionViewDidEnter(){

  }
  public loadPhone(id) {

    this.loader.present();

    this.api.postData2("action_mobile.php",
      { action: "charger_phone", reason:this.reason, numero: this.item.num, item:this.item,
      annee:this.item.year, exam:this.item.exam, ile:this.item.ile, id_membre: this.userId ?? id }, {})
      .subscribe(response => {
        this.loader.dismiss();
        try {
          let dataJSON = JSON.parse(response.data)
          this.phoneNumber = dataJSON.number;
          this.price.all = dataJSON.price;
          this.price.mvola = dataJSON.price_mvola;
          this.price.ct = dataJSON.price_ct;
          this.price.card = dataJSON.price_card;
          this.ct_sms_msg = dataJSON.ct_sms_msg;
          this.ct_sms_btn_show = dataJSON.ct_sms_btn_show;
          this.ct_sms_receiver = dataJSON.ct_sms_receiver;
          this.ct_alert = dataJSON.ct_alert;
          this.mvola_self_accept = dataJSON.mvola_self_accept;
          this.mvolaAction = dataJSON.mvola_action;
          this.text = dataJSON.text;
          this.demander_num = dataJSON.demander_num;
          this.pic = dataJSON.pic;
          this.notPayed = dataJSON.not_payed;
          this.paymentText = dataJSON.payment_text;
          this.ct_sms_content = dataJSON.ct_sms_content;
          this.appropriate_num_id = dataJSON.appropriate_num_id;
          console.log({app: this.appropriate_num_id});
          console.log(dataJSON);
          console.log(JSON.parse(dataJSON.post))
          

          if(this.senderInput)
            this.senderInput.setFocus();
        }
        catch (error) {
          alert(error)
          alert(response.data);
          this.showAlert(error, "Il y'a eu une erreur");
        }
        // this.loadPubs();
      }, (error) => {
        this.loader.dismiss();
        this.showAlert("Problème de connexion", JSON.stringify(error));
        // this.etudiants = this.etudiantsOriginal;
      });
  }
  public defaultImg(element, fallback = "assets/img/mvola.png") {
    element.src = fallback;
  }
  // async sendSMS(intent: string = "INTENT"): Promise<any>{
  //   this.sms.hasPermission().then((data)=>{
  //     console.log(data);
      
  //   })
  //   this.sms.send(this.ct_sms_receiver, 
  //     this.ct_sms_content, {
  //       replaceLineBreaks:false,
  //       android:{
  //         intent: ""
  //       }
  //     }
  //   ).catch(async (err)=>{
  //     let alrt;
  //     alrt = await this.alertCtrl.create({message:this.ct_alert ?? "Veuillez envoyer l'SMS qui va s'afficher.", buttons:[{
  //       text:"ok",
  //       handler: ()=>{
  //         this.sms.send(this.ct_sms_receiver, 
  //           this.ct_sms_content, {
  //             replaceLineBreaks:false,
  //             android:{
  //               intent: "INTENT"
  //             }
  //           }).then((data)=>{
  //             this.smsRetriever.getAppHash().then((data)=>{
  //               console.log(data);
                
  //             })
  //             this.smsRetriever.startWatching().then((response)=>{
  //               let wordsArray = response.split(":");
  //               this.codeAchat = wordsArray[1].trim();
  //               this.sendCode();
  //             })
  //           });
  //       }
  //     }]});
  //     alrt.present();
  //   })
      
  // }
  async smspay(){
    if(this.platform.is("android")){
      console.log("tasking");
    }

    // this.sendSMS('INTENT').then((data)=>{
    //   console.log(data);
    // })
    // this.sendSMS('').then((data)=>{
    //   console.log(data);
    // }).catch((error)=>{
    //   console.log(error);
    //   this.sendSMS('INTENT');
    // })
    
  }
  public transfer()
  { 
    if(!this.item)
      this.item = {};
    
    this.loading = 1;
      
    this.startWatchingMvolaSMS();
    
    this.call.callNumber("#444*1*"+this.mvolaAction+"*"+this.phoneNumber+"*"
    +(this.price.mvola ?? this.price.all)+`*${this.id_ecole ?? 0}`+this.getReason()+`${this.item.id}#`, true).then((data)=>{
      console.log(data);
    }).finally(()=>{this.loading = 0;});
      
  }
  async showAlert(titre, contenu) {
    let sup = this;
    let alert = await this.alertCtrl.create({
      header: titre,
      message: contenu,
      buttons: 
      [
        {
          text:'Fermer',
          handler:()=>{
            if(sup.senderInput)
              sup.senderInput.setFocus();            
          }
        }
      ]
    });
    if(titre || contenu)
      alert.present();
  }
  async openInAppBrowser(){
    if(!this.user_phone){
      this.user_phone = await this.storage.get("telephone");
    }
    this.paymentLink = `https://natidja.app/payment/checkout.php?numero=${this.item.num ?? this.item.id}&examen=`+this.item.exam+"&annee="+this.item.year+"&ile="
    +this.item.ile+"&id_membre="+this.userId+`&id_ecole=${this.id_ecole ?? 0}&reason=${this.reason}&telephone=${this.user_phone}`;
    const browser = this.iab.create(this.paymentLink);
    browser.show();
    // browser.executeScript()
    // browser.on("exit").subscribe(()=>{
    //   this.navCtrl.navigateBack("home");
    // })
  }

  ngOnInit() {
  }

  sendCode(){
    let load;
    this.loaderCtrl.create({message:"Veuillez patientez..."}).then((l)=>{
      load = l;
      load.present();
    })
    let params = {action:"valider_achat", code: this.codeAchat, 
    id_membre: this.userId, annee:this.item.year, numero:this.item.num, ile: this.item.ile, appropriate_num_id: this.appropriate_num_id};
    console.log(params);
    
    this.api.postData('bac/action.php', params)
    .subscribe((data)=>{
      console.log(data);
      
      load.dismiss();
      let json = JSON.parse(data.data.trim());

      if(json["status"]=="ok"){
        this.alertCtrl.create({message:"Votre paiement a correctement été effectué. Merci!", buttons:["Ok"]}).then(a=>{
          a.present().finally(()=>{
            this.navCtrl.navigateBack('home');
          })
        })
      }else{
        this.alertCtrl.create({message:json["status"], buttons:["OK"]}).then((b)=>{
          b.present();
        })
      }
    }, (error)=>{
      load.dismiss();
      console.log(error);
      
      this.alertCtrl.create({message:JSON.stringify(error), buttons:["OK"]}).then(a=>{a.present()});
    })
  }
}
