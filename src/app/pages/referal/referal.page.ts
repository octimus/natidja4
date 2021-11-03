import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NavController } from '@ionic/angular';
import { UserDataService } from 'src/app/services/user-data/user-data.service';

@Component({
  selector: 'app-referal',
  templateUrl: './referal.page.html',
  styleUrls: ['./referal.page.scss'],
})
export class ReferalPage implements OnInit {
  public id: any;
  constructor(private navCtrl: NavController, private aR: ActivatedRoute, private userData: UserDataService) { 
    this.userData.getId().then(id => {
      if(id){
        this.navCtrl.navigateRoot('home');
      }else{
        this.aR.params.subscribe(params => {
          this.id = params['id'];
          
          if(this.id)
            this.navCtrl.navigateRoot(`sliders/${this.id}`);
        })
      }
    })
  }

  ngOnInit() {
  }

}
