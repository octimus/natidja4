import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NavController } from '@ionic/angular';
import { Storage } from '@ionic/storage';
import { ApiService } from 'src/app/services/api/api.service';
import { UserDataService } from 'src/app/services/user-data/user-data.service';

@Component({
  selector: 'app-notes',
  templateUrl: './notes.page.html',
  styleUrls: ['./notes.page.scss'],
})
export class NotesPage implements OnInit {

  public item: any;
  public notes: any;
  public canSee: boolean;
  public ecole: any;
  constructor(private route: ActivatedRoute, private userData: UserDataService, 
    private api: ApiService, public navCtrl: NavController,
    private storage: Storage) { 
    this.route.queryParams.forEach(e => {
      this.item = e.item;
      console.log(this.item);
    })

    this.storage.get("school").then((data)=>{
      this.ecole = data;
    });
  }

  ngOnInit() {
    this.load();
  }

  load(){
    this.storage.get("canSeeNotes").then(c => {
      if(c){
        this.canSee = c;
      }
      this.storage.get(`notes${this.item.id}`).then(n => {
        this.notes = n;
      })
    })
    this.api.postData("action_mobile.php", {action:"notes_json", id_etudiant:this.item.id}).subscribe(d => {
      let json = JSON.parse(d.data);
      this.canSee = json.status != "not payed" ? true : false;
      this.storage.set("canSeeNotes", this.canSee);
      if(json.status == "ok"){
        if(JSON.stringify(this.notes) != JSON.stringify(json.data)){
          this.notes = json;
          this.storage.set(`notes${this.item.id}`, this.notes);
        }
      }
    })
  }

}
