import { Component, OnInit } from '@angular/core';
import { AlertController, NavController } from '@ionic/angular';
import { ApiService } from 'src/app/services/api/api.service';
import { CoursService } from 'src/app/services/cours/cours.service';
import { PreviewAnyFile } from '@ionic-native/preview-any-file/ngx';

@Component({
  selector: 'app-cours',
  templateUrl: './cours.page.html',
  styleUrls: ['./cours.page.scss'],
})
export class CoursPage implements OnInit {

  public cours: any[] = [];
  constructor(private api: ApiService, public navCtrl: NavController, 
    private coursService: CoursService, public alertCtrl: AlertController, private preview: PreviewAnyFile) { }

  ngOnInit() {
  }

  ionViewDidEnter(){
    this.load();
  }
  delete(item:any){
    this.alertCtrl.create({header:"Voulez-vous vraiment supprimer ce cours ?", 
    buttons:[
      {
        text:"Oui", handler:()=>{
        this.coursService.delete(item).subscribe((data) => {
          const json = JSON.parse(data.data);
          if(json.status == "ok"){
            this.cours.splice(this.cours.indexOf(item), 1);
          }
        })
    }}, "Annuler"]}).then((a) => {
      a.present();
    })
  }

  load(){
    this.coursService.getList().then((cours) => {
      cours.subscribe((data)=>{
        
        const json = JSON.parse(data.data);
        console.log(json);
  
        if(json.status == "ok"){
          this.cours = json.data;
        }
      })
      
    })
  }

  viewFile(item){
    console.log(item)
    this.preview.preview(item.url).then((d) => {
      console.log({after_preview: d});
    }, (err) => console.error(err)).catch((err) => {
      console.error(err);
    })
  }

  download(item:any){

  }

}
