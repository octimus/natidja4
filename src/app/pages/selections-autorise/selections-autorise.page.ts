import { Component, OnInit } from '@angular/core';
import { ApiService } from 'src/app/services/api/api.service';
import { UserDataService } from 'src/app/services/user-data/user-data.service';

@Component({
  selector: 'app-selections-autorise',
  templateUrl: './selections-autorise.page.html',
  styleUrls: ['./selections-autorise.page.scss'],
})
export class SelectionsAutorisePage implements OnInit {

  public items: any = {};
  constructor(private api: ApiService, private userData: UserDataService) { 
    this.userData.getId().then((id)=>{
      this.api.postData("bac/action.php", {action:"matieres_a_refaire_json", id: id}, {}).subscribe((data)=>{
        let json = JSON.parse(data.data);
        this.items = json.data;
      })
    })
  }

  onClick(){
    
  }

  ngOnInit() {
  }

}
