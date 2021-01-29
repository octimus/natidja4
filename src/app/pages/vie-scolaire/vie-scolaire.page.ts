import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NavController } from '@ionic/angular';
import { Storage } from '@ionic/storage';
import { ApiService } from 'src/app/services/api/api.service';
import { UserDataService } from 'src/app/services/user-data/user-data.service';

@Component({
  selector: 'app-vie-scolaire',
  templateUrl: './vie-scolaire.page.html',
  styleUrls: ['./vie-scolaire.page.scss'],
})
export class VieScolairePage implements OnInit {
  public item: any = {};
  public ecole: any = {};
  public vieScolaire: any = {};
  public today: any;

  constructor(private route: ActivatedRoute, private apiSchool: ApiService, 
    private storage: Storage, private userData: UserDataService, public navCtrl: NavController) {
    this.storage.get("school").then((data)=>{
      this.ecole = data;
      console.log({ecole:this.ecole});
      
      this.apiSchool.setServer(this.ecole.url+"/"); 
      this.route.queryParams.forEach((p)=>{
        this.item = p.item;
        this.load();
      });
    })
    let date = new Date();
    this.today = date.getFullYear()+"-"+date.getMonth()+"-"+date.getDate();
  }

  ngOnInit() {
  }
  private load(){
    this.storage.get(`vieScolaire${this.item.id}`).then(v => {
      if(v)
      {        
        this.vieScolaire = v;
      }
      else
        this.userData.loader.present();
    }, (err) => {
      console.error(err)
      this.userData.loader.present();
    })
    this.userData.getTelephone().then(t=>{
      this.apiSchool.postData("action_mobile.php", {action:"json_vie_scolaire", eleve:this.item.id, parent: t}).subscribe((data)=>{
        this.userData.loader.dismiss();
        console.log({vie_s:data.data});
        
        if(JSON.stringify(this.vieScolaire) != data.data)
        {
          this.vieScolaire = JSON.parse(data.data);
          this.storage.set(`vieScolaire${this.item.id}`, this.vieScolaire);
        }
      }, (err)=>{
        // this.userData.alerter("Veuillez verifier votre connexion à internet", err.error)
        this.userData.loader.dismiss();
      })
    }, (err)=>{
      alert(err)
      console.error(err);
      this.userData.loader.dismiss();
    })
  }
  openNotes(){
    this.navCtrl.navigateForward('notes', {queryParams:{item:this.item}});
  }
  openCours(){
    this.navCtrl.navigateForward('cours', {queryParams:{item:this.item}});
  }

}
