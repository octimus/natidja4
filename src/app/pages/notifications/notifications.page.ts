import { Component, OnInit } from '@angular/core';
import { NavController } from '@ionic/angular';
import { ApiService } from 'src/app/services/api/api.service';

@Component({
  selector: 'app-notifications',
  templateUrl: './notifications.page.html',
  styleUrls: ['./notifications.page.scss'],
})
export class NotificationsPage implements OnInit {

  public items: any[] = [];
  constructor(private api: ApiService, public navCtrl: NavController) { }

  getNotifications(){
    this.api.postData("bac/action.php", {action:"charger_notifications"}).subscribe((data)=>{
      let json = JSON.parse(data.data.trim());
      this.items = json.notifs;
    })
  }
  ngOnInit() {
    this.getNotifications();
  }

}
