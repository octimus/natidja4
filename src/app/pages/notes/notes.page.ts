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

  async load(){
    this.storage.get("canSeeNotes").then(c => {
      if(c){
        this.canSee = c;
      }
      this.storage.get(`notes${this.item.id}`).then(n => {
        this.notes = n;
      })
    });
    let ecole = await this.storage.get("school");
    let telephone = await this.storage.get("telephone");
    this.api.postData("action_mobile.php", {action:"notes_json", id_etudiant:this.item.id, ecole: ecole.id, parent: telephone}).subscribe(d => {
      try {
        let json = typeof(d.data) == "string" ? JSON.parse(d.data) : d?.data ? d.data : d;
        this.canSee = json.status != "not payed" ? true : false;
        this.storage.set("canSeeNotes", this.canSee);
        if(json.status == "ok"){
          if(JSON.stringify(this.notes) != JSON.stringify(json.data)){
            this.notes = json;
            console.log({json:json})
            this.storage.set(`notes${this.item.id}`, this.notes);
          }
        }
      } catch (error) {
        alert(d.data)
      }
    })
  }

}
