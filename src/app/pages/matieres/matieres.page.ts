import { Component, NgZone, OnInit, ViewChild } from '@angular/core';
import { NavController, Platform } from '@ionic/angular';
import { CoursService } from 'src/app/services/cours/cours.service';
import { UserDataService } from 'src/app/services/user-data/user-data.service';
import { Storage } from '@ionic/storage';

@Component({
  selector: 'app-matieres',
  templateUrl: './matieres.page.html',
  styleUrls: ['./matieres.page.scss'],
})
export class MatieresPage implements OnInit {

  public matieres: any[] = []
  updateLevel: boolean = false;
  level: any;

  logScrollStart(event){
    
  }


  constructor(private platform: Platform, private userData: UserDataService, public navCtrl: NavController,
    private coursService: CoursService, private storage: Storage) {
    this.platform.ready().then(() => {
      this.storage.get("matieres").then((matieres)=>this.matieres = matieres);
      this.coursService.getListMatieres().then((m)=>{
        let data = m.data ?? m;
        let json = typeof(data) == "string" ? JSON.parse(data) : data;
        this.matieres = json.data;
        this.storage.set("matieres", this.matieres);
      })
    })
  }

  public defaultImg(element, fallback = "assets/img/default-user.png") {
    element.src = fallback;
  }

  async getLevel(){
    this.level = await this.userData.getLevel();
  }
  ionViewDidEnter(){
    if(this.updateLevel){
      this.getLevel();
      this.updateLevel = !this.updateLevel;
    }
  }
  public clickBtn(btn)
  {
    let evt = document.createEvent("MouseEvents");
    evt.initMouseEvent("click", true, true, window, 0, 0, 0, 0, 0, false, false, false, false, 0, null);
    btn.dispatchEvent(evt);
  }
  
  async ngOnInit(event: any = null) {

    this.userData.getLevel().then((level) => {
      this.level = level;
      this.userData.getId().then((id) => {
      })
    })
  }

}
