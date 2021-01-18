import { Component, OnInit } from '@angular/core';
import { NavController, NavParams } from '@ionic/angular';
import { ApiService } from 'src/app/services/api/api.service';

@Component({
  selector: 'app-about',
  templateUrl: './about.page.html',
  styleUrls: ['./about.page.scss'],
})
export class AboutPage implements OnInit {
  public sponsors;

  constructor(public navCtrl: NavController, public navParams: NavParams, private api: ApiService) {
    this.api.postData2("action_mobile.php", {action: "sponsors_json"}).subscribe((data)=>{
      try {
        let json = JSON.parse(data.data);
        this.sponsors = json.sponsors;
      } catch (error) {
        alert(data.data)
      }
    })
  }
  public openUrl(url)
  {
    // browser.executeScript();
    // window.open(url, '_system');
  }
  ionViewDidLoad() {
    console.log('ionViewDidLoad AboutPage');
  }

  ngOnInit() {
  }

}
