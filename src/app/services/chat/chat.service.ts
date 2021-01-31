import { Injectable } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HTTP } from '@ionic-native/http/ngx';
import { Storage } from '@ionic/storage';
import { Observable } from 'rxjs';
import { ApiService } from '../api/api.service';
import { UserDataService } from '../user-data/user-data.service';

@Injectable({
  providedIn: 'root'
})
export class ChatMessages {
  messageId: string;
  userId: string;
  userName: string;
  userAvatar: string;
  toUserId: string;
  time: number | string;
  message: string;
  status: string;
  productId?:any = 0;
  productName?:string = "secret";
  msgToText?:string = "secret";
  msgToId?:any = 0;
  nbr:number;
  vu:any;
}
export class ChatMessage {
  messageId: string;
  userId: string;
  userName: string;
  userAvatar: string;
  toUserId: string;
  time: number | string;
  message: string;
  status: string;
  productId?:any = 0;
  productName?:string = "secret";
  msgToText?:string = "secret";
  msgToId?:any = 0;
  vu:any;
}

export class UserInfo {
  id: string;
  name?: string;
  avatar?: string = "default.png";
}

@Injectable()
export class ChatService {

  public userInfo;
  constructor(public userData : UserDataService, public http: HTTP, 
    private api: ApiService, private route: ActivatedRoute, private storage: Storage) 
  {
    this.userInfo = this.userData.getUserChat();
  }

  mockNewMsg(msg, product) {
    const mockMsg: ChatMessage = {
        messageId: Date.now().toString(),
        userId: this.userInfo.id,
        userName: this.userInfo.name,
        userAvatar: this.userInfo.avatar,
        toUserId: msg.toUserId,
        time: Date.now(),
        message: msg.message,
        status: 'success',
        productId:product.id,
        productName:product.name,
        vu:0
    };
      
  }

  async getMsgList(personId: any, correspondantPersonId: any, offset:number=0) {
    const school = await this.storage.get("school");
    const kids: [] = await this.storage.get(`kids${school.id}`);
    return this.api.postData("action_mobile.php", {action: "json_msgs", personId:personId, 
    inter: correspondantPersonId, ecole:school, kids:kids, offset: offset}).toPromise();
  }

  async getCount(tel: any): Promise<any> {
    const school = await this.storage.get("school");
    const kids: [] = await this.storage.get(`kids${school?.id}`);
    const personId = await this.userData.getPersonId();
    
    return this.api.postData("action_mobile.php", {action: "all_count", telephone:tel, kids:JSON.stringify(kids), personId: personId, ecole:school}).toPromise();
  }
  async getDiscussionsList(userId: any, offset = 0): Promise<any> {
    const school = await this.storage.get("school");
    const kids: [] = await this.storage.get(`kids${school.id}`);
    const personId = await this.userData.getPersonId();
    return this.api.postData("action_mobile.php", {action: "json_discussions", userId:userId, offset:offset, personId:personId,
    ecole:school, kids:JSON.stringify(kids)}).toPromise();
  }

  sendMsg(msg: ChatMessage) {
    return this.api.postData("action_mobile.php", {action: "send_msg", msg: msg});
  }

  getUserInfo(): Promise<UserInfo> {
    let userInfo: UserInfo = this.userData.getUserChat();
    return new Promise(resolve => resolve(userInfo));
  }

}
