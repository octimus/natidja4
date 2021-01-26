import { Injectable } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HTTP } from '@ionic-native/http/ngx';
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
  constructor(public userData : UserDataService, public http: HTTP, private api: ApiService, private route: ActivatedRoute) 
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

  getMsgList(personId: any, correspondantPersonId: any, offset:number=0) {
    return this.api.postData("action_mobile_gestion.php", {action: "json_msgs", personId:personId, inter: correspondantPersonId, offset: offset});
  }

  getCount(tel: any): Observable<any> {
    return this.api.postData("action_mobile_gestion.php", {action: "all_count", telephone:tel});
  }
  getDiscussionsList(userId: any, offset = 0): Observable<any> {
    return this.api.postData("action_mobile_gestion.php", {action: "json_discussions", userId:userId, offset:offset});
  }

  sendMsg(msg: ChatMessage) {
    return this.api.postData("action_mobile_gestion.php", {action: "send_msg", msg: msg});
  }

  getUserInfo(): Promise<UserInfo> {
    let userInfo: UserInfo = this.userData.getUserChat();
    return new Promise(resolve => resolve(userInfo));
  }

}
