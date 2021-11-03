import { Component, OnInit } from '@angular/core';
import { NavController } from '@ionic/angular';
import { CoachService } from 'src/app/services/coach/coach.service';
import { UserDataService } from 'src/app/services/user-data/user-data.service';

@Component({
  selector: 'app-coach-search',
  templateUrl: './coach-search.page.html',
  styleUrls: ['./coach-search.page.scss'],
})
export class CoachSearchPage implements OnInit {

  public coachs: any [] = [];
  constructor(private coachService: CoachService, public navCtrl: NavController, private userData: UserDataService) { }

  async ngOnInit() {
    this.coachs = await this.coachService.getLocalList() ?? [];
    this.load();
  }

  async load(elt: any = null){
    let search: any = elt?.target.value;
    let userId = await this.userData.getId();
    this.coachService.getList(this.coachs.length, {search: search, userId:userId}).then((data) => {
      let j = data?.data ? (data.data) : data;
      let json = typeof(j) === "string" ? JSON.parse(j) : j;
      console.log(json)
      this.coachs = json?.data ?? json ?? [];
      this.coachService.setLocalList(this.coachs);
    }, (error) => console.error(error))
  }

}
