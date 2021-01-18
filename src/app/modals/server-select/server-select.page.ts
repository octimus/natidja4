import { Component, OnInit } from '@angular/core';
import { NavController, NavParams, ModalController } from '@ionic/angular';
import { SettingsService } from 'src/app/services/settings/settings.service';

@Component({
  selector: 'app-server-select',
  templateUrl: './server-select.page.html',
  styleUrls: ['./server-select.page.scss'],
})
export class ServerSelectPage implements OnInit {

  constructor(public navCtrl: NavController, public navParams: NavParams, 
 public settings:SettingsService, private modalCtrl: ModalController) {
      
  }
  ngOnInit(): void {
    // throw new Error("Method not implemented.");
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ServerSelectPage');
  }
  ionViewDIdEnter()
  {
    this.settings.getEspace().then((data)=>{
      alert("data espace :"+data)
      if(data!=null)
      {
        this.navCtrl.pop()
      }
    })
  }
  public select(data)
  {
    if(data)
      this.modalCtrl.dismiss(data);
    else
      this.modalCtrl.dismiss();
  }

}
