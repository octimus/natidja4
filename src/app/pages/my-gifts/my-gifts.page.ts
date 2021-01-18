import { Component, OnInit } from '@angular/core';
import { ApiService } from 'src/app/services/api/api.service';
import { UserDataService } from 'src/app/services/user-data/user-data.service';

@Component({
  selector: 'app-my-gifts',
  templateUrl: './my-gifts.page.html',
  styleUrls: ['./my-gifts.page.scss'],
})
export class MyGiftsPage implements OnInit {
  public cadeaux: any = {};

  constructor(private api: ApiService, private userData: UserDataService) {
    this.userData.getId().then(id=>{
      this.api.postData("bac/action.php", {uid: id, action: "cadeaux_json"}).subscribe((data)=>{
        let json = JSON.parse(data.data);
        console.log(json);
        
        this.cadeaux = json.cadeaux;
      })
    });
  }

  ngOnInit() {
  }

}
