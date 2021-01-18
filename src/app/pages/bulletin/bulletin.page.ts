import { Component, OnInit } from '@angular/core';
import { NavController, NavParams, LoadingController, AlertController } from '@ionic/angular';
import { ActivatedRoute } from '@angular/router';
import { ApiService } from 'src/app/services/api/api.service';
import { UserDataService } from 'src/app/services/user-data/user-data.service';

@Component({
  selector: 'app-bulletin',
  templateUrl: './bulletin.page.html',
  styleUrls: ['./bulletin.page.scss'],
})
export class BulletinPage implements OnInit {

  public item: any = {};
  public notes: Array<any> = [];
  public autorise: boolean = false;
  public msgStart: string = "";
  public msgEnd: string = "";
  public canChange: boolean = true;
  public loader: any;
  public userId:any;

  constructor(public navCtrl: NavController, public navParams: NavParams, 
    private route: ActivatedRoute, private api: ApiService, 
    private loadingCtrl: LoadingController, 
    private alertCtrl: AlertController, private userData: UserDataService) {
      this.userData.getId().then((data)=>{
        this.userId = data;
        this.route.queryParams.forEach(d=>{
    
          this.loadingCtrl.create({message: "Chargement"}).then((d)=>{
            this.loader = d;
            this.loader.present();
          })
          this.item = d.item;
          console.log(this.item);

          this.autorise = this.item.decision=='Autorise' || this.item.decision == 'Autorisé' || this.item.decision == 'autorise' || this.item.decision == 'autorisé';
          console.log(this.autorise);
          this.api.postData("bac/action.php", {action:"charger_notes", 
          id_membre: this.userId, numero:this.item.numero, 
          examen:this.item.exam, annee:this.item.year, ile:this.item.ile}).subscribe((data)=>{
            this.loader.dismiss();
            console.log(data.data);
    
            try {
              let donnees = JSON.parse(data.data.trim());
              if(donnees.status == "ok"){
                this.notes = donnees.notes;
                if(donnees.canChange == true){
                  this.canChange = true;
                }else{
                  this.canChange = false;
                }
              }else
              {
                alert(donnees.status);
                navCtrl.navigateBack('home');
              }
    
              if(donnees.msg_start)
                this.msgStart = donnees.msg_start;
              if(donnees.msg_end)
                this.msgEnd = donnees.msg_end;
    
            } catch (error) {
              this.alertCtrl.create({
                header:error,
                message: data.data
              }).then(d=>{
                d.present();
              })
            }
          }, (error)=>{
            this.loader.dismiss();
          })
        });
      })
    
  }

  save(){
    let i = 0;
    this.notes.forEach(note=>{
      if(note.isChecked)
        i++;
    });
    if(i == 0){
      this.alertCtrl.create({message:"Veuillez selectionner des matières à repasser.", buttons:["OK"]}).then(p=>p.present());
      return;
    }else{
      this.alertCtrl.create({message: "Êtes-vous sûre d'avoir bien verifié ?", buttons:[{text:"Oui", handler:()=>{this.sendSelection()}}, "Non"]}).then(p=>p.present());
    }
  }

  sendSelection(){
    this.loader.present();
    this.api.postData("bac/action.php", 
    {action:"check_repass", 
    numero:this.item.numero, exam:this.item.exam, annee:this.item.year, id_membre:this.userId,
    ile:this.item.ile, check:JSON.stringify(this.notes)}).subscribe((data)=>{
      this.loader.dismiss();

      try {
        let json = JSON.parse(data.data.trim());
  
        if(json["status"] == "ok"){
          this.canChange = json["canChange"];
        }else{
          this.alertCtrl.create({
            message: json["status"],
          }).then(d=>{
            d.present();
          })
        }
      } catch (error) {
        this.alertCtrl.create({
          subHeader: error,
          message: data.data,
        }).then(d=>{
          d.present();
        })
      }
    }, (error)=>{
      this.loader.dismiss();
    })
  }

  ngOnInit() {
  }

}
