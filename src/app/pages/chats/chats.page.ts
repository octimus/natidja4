import { Component, OnInit, ViewChild } from '@angular/core';
import { HTTP } from '@ionic-native/http/ngx';
import { ActionSheetController, ModalController, NavController, NavParams } from '@ionic/angular';
import { ApiService } from 'src/app/services/api/api.service';
import { ChatMessage, ChatService, UserInfo } from 'src/app/services/chat/chat.service';
import { UserDataService } from 'src/app/services/user-data/user-data.service';
import { Storage } from '@ionic/storage';


@Component({
  selector: 'app-chats',
  templateUrl: './chats.page.html',
  styleUrls: ['./chats.page.scss'],
})
export class ChatsPage implements OnInit {
  public list: any[] = [];
  timeout: any;
  public nbrEleves: number;
  public nbrElevesUpdated: number;
  public ecole;
  // private db: SQLiteObject;
  constructor(private chatService: ChatService, private userService: UserDataService, 
    public navCtrl: NavController, private modalCtrl: ModalController, 
    private api: ApiService, private storage: Storage){

  }

  ngOnInit(){
  }
  ionViewDidEnter() {
    this.loadDiscussions();

    this.storage.get("id_ecole").then(e => {
      this.ecole = e;
    })
  }

  loadDiscussions(){
    this.userService.getPersonId().then(id => {
    this.chatService.getDiscussionsList(id).subscribe((data) => {
      
      let json;
      try {
        json = JSON.parse(data.data);
      } catch (error) {
        console.log(data.data);
        console.error(error)
      }

      if(JSON.stringify(this.list) != JSON.stringify(json.data)){
        this.list = json.data;
      }
      // json.data.forEach(element => {
      //   if(!this.list.some(e => e.inter == element.inter)){
      //     this.list.push(element); 
      //   }
      // });
    })
    }, (err) => { 
      console.log(err);
      if(err.error == "The request timed out.")
      {
        this.api.alert("Veuillez verifier votre connexion à internet");
      }
    });
    this.timeout = setTimeout(() => {this.loadDiscussions()}, 10000);
  }

  openChat(item){
    this.navCtrl.navigateForward('chat', {queryParams:{item:item}});
  }

  async openParentModal(){
    console.log("will implement");
    
    // const m = await this.modalCtrl.create({component: ModalPage, componentProps:{action: "discussion"}});
    // m.present();
    // m.onWillDismiss().then(data => this.openChat(data.data))
  }

  ionViewWillLeave() {
    clearTimeout(this.timeout);
  }

}
