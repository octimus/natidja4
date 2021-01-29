import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HTTP } from '@ionic-native/http/ngx';
import { NavParams, NavController, ActionSheetController } from '@ionic/angular';
import { ChatMessage, ChatService, UserInfo } from 'src/app/services/chat/chat.service';
import { UserDataService } from 'src/app/services/user-data/user-data.service';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.page.html',
  styleUrls: ['./chat.page.scss'],
})
export class ChatPage implements OnInit {

  @ViewChild("content") content: any;
    @ViewChild('chat_input') messageInput: any;
    msgList: ChatMessage[] = [];
    user: UserInfo;
    toUser: UserInfo;
    editorMsg = '';
    showEmojiPicker = false;
    userProfile: any;
    item: any;
    public logedIn: boolean;
    public lastMsg: any;
    public page: number = 1;
    toolbarColor: any = "light";    
    selectedTheme:string;
    public address_serveur:string = "https://octra.io/octram";
    nbrMsgLimit: number = 8;
    public respondTo:any = undefined;
    private timeout: any;

    constructor(public http:HTTP,   public navParams: NavParams,
        public chatService: ChatService, public navCtrl: NavController, 
        public userData: UserDataService, public actionSheet:ActionSheetController, 
        private router: ActivatedRoute) 
    {
        this.router.queryParamMap.forEach((i)=>{
            console.debug(i);
            const r = JSON.parse(JSON.stringify(i.get("item")));
            this.item = r;
            
            this.toUser = {
                name: r.nom,
                id: r.inter ?? r.id_person,
            }
        })
        
    }

    public respond(msg)
    {
        // alert("respond : "+JSON.stringify(msg))
        this.respondTo = msg;
    }
    public deleteAllMsgs(msg)
    {
        //experimentation
        if(confirm("Êtes-vous sûre de vouloir supprimer cette discussion ?"))
        {
            let reference: string = "msg/ochat-" + this.user.id + "/inter-" + this.toUser.id;
            let referenceNew: string = "new-msg/" + this.user.id;
            
            // const msgNew = this.afdb.list(''+referenceNew, {preserveSnapshot:true,
            //     query:{
            //         orderByChild:"userId",
            //         equalTo:this.toUser.id
            //     }
            // });
            // const msgs = this.afdb.list(''+referenceNew, {preserveSnapshot:true,
            //     query:{
            //         orderByChild:"toUserId",
            //         equalTo:this.toUser.id
            //     }
            // });
            // msgNew.subscribe(snapshots => {
            //     snapshots.forEach(snapshot =>{
            //         let jsonString = JSON.stringify(snapshot);
            //         let j = JSON.parse(jsonString)
            //         // alert(jsonString)

            //         if((j.userId == this.user.id && j.toUserId == this.toUser.id) || (j.userId == this.toUser.id  && j.toUserId == this.user.id))
            //         {
            //             if(confirm(jsonString))
            //             msgNew.remove(snapshot)
            //         }
            //     })
            // })
            // msgs.subscribe(snapshots => {
            //     snapshots.forEach(snapshot =>{
            //         let jsonString = JSON.stringify(snapshot);
            //         let j = JSON.parse(jsonString)
            //         // alert(jsonString)

            //         if((j.userId == this.user.id && j.toUserId == this.toUser.id) || (j.userId == this.toUser.id  && j.toUserId == this.user.id))
            //         {
            //             if(confirm(jsonString))
            //             msgs.remove(snapshot)
            //         }
            //     })
            // })
            // this.afdb.database.ref(''+referenceNew).remove(((err)=>{
            //     alert(JSON.stringify(err))
            // }));
            // this.afdb.database.ref(''+reference).remove(((err)=>{
            //     alert(JSON.stringify(err))
            // }));
        }
        // alert("delete : "+JSON.stringify(msg))
        // this.afdb.database.refFromURL()
    }
    public deleteMsg(msg)
    {
        if(confirm("Vous êtes sûre de vouloir supprimer ce message ?"))
        {
            let reference: string = "msg/ochat-" + this.user.id + "/inter-" + this.toUser.id;
            let referenceNew: string = "new-msg/" + this.user.id;

            // const msgList = this.afdb.list(''+reference, {
            //     preserveSnapshot: true,
            //     query:{
            //         orderByChild:"messageId",
            //         equalTo:msg.messageId
            //     }
            // });
            // const msgNewList = this.afdb.list(''+referenceNew, {
            //     preserveSnapshot: true,
            //     query:{
            //         orderByChild:"messageId",
            //         equalTo:msg.messageId
            //     }
            // });
            let time = null;
            // msgList.subscribe(snapshots => {
            //     snapshots.forEach(snapshot => {
            //         // snapshots.filter(!vu)
            //         let jsonString = JSON.stringify(snapshot);
            //         let j = JSON.parse(jsonString)
            //         time = j.time
            //         if(j.messageId == msg.messageId)
            //         {    
            //             if("Êtes-vous sûr de vouloir supprimer ce message ?")
            //                 msgList.remove(snapshot)
            //         }
            //             // msgList.update(snapshot, { vu: new Date() })
            //     });
            // })
            // msgNewList.subscribe(snapshots => {
            //     snapshots.forEach(snap => {
            //         // snapshots.filter(!vu)
            //         let jsonString = JSON.stringify(snap);
            //         let j = JSON.parse(jsonString)

            //         if(j.messageId == msg.messageId)
            //         {    
            //             msgNewList.remove(snap)
            //         }
            //             // msgList.update(snapshot, { vu: new Date() })
            //     });
            // })
        }
    }
    public async pressEvent(msg:any)
    {
        const ac = await this.actionSheet.create({header:"actions", buttons:[
            {text:"Répondre", handler: ()=>{
                this.respond(msg);
            }},
            {
                text:"Supprimer ce message",
                handler:()=>{
                    this.deleteMsg(msg)
                }
            },
            // {
            //     text:"Supprimer la conversation",
            //     handler:()=>{
            //         this.deleteAllMsgs(msg)
            //     }
            // }
        ]});
        ac.present();
    }
    // deleteNewMsg() {
    //     const msgList = this.afdb.list('new-msg/' + this.user.id, {
    //         preserveSnapshot: true,
    //         query: {
    //             orderByChild: 'userId',
    //             equalTo: this.toUser.id
    //         }
    //     });
    //     const msgList2 = this.afdb.list('msg/ochat-' + this.toUser.id+'/inter-'+this.user.id, {
    //         preserveSnapshot: true,
    //         query: {
    //             orderByChild: 'toUserId',
    //             equalTo: this.user.id,
    //         }
    //     });
        
    //     msgList2.subscribe(snapshots => {
    //         snapshots.forEach(snapshot => {
    //             let jsonString = JSON.stringify(snapshot);
    //             let j = JSON.parse(jsonString)
    //             // alert((snapshot))
    //             if(j.vu == 0)   
    //                 msgList2.update(snapshot, { vu: new Date() })
    //         });
    //     })
    //     msgList.subscribe(snapshots => {
    //         snapshots.forEach(snapshot => {
    //             // snapshots.filter(!vu)
    //             let jsonString = JSON.stringify(snapshot);
    //             let j = JSON.parse(jsonString)

    //             if(j.vu == 0)
    //                 msgList.update(snapshot, { vu: new Date() })
    //         });
    //     })
    // }
    public defaultImg(element, fallback = "assets/img/default-user.png") {
        element.src = fallback;
    }

    ionViewDidEnter() {
        //get message list
        let chatClass = this;
        if(this.user.id)
            this.getMsg()
        else
            this.recupererUser(function(){chatClass.getMsg()});
        // .then(() => {
        //     this.scrollToBottom();
        // });
        if(this.selectedTheme=="dark-theme" || this.selectedTheme=="fond-theme")
            this.toolbarColor = "transparent";
        else
            this.toolbarColor = "light";
    }

    onFocus() {
        this.showEmojiPicker = false;
        this.content.resize();
        this.scrollToBottom();
    }

    switchEmojiPicker() {
        this.showEmojiPicker = !this.showEmojiPicker;
        if (!this.showEmojiPicker) {
            this.messageInput.setFocus();
        }
        this.content.resize();
        this.scrollToBottom();
    }

    /**
     * @name getMsg
     * @returns {Promise<ChatMessage[]>}
     */
    getMsg() {
        // Get mock message list
        // this.afdb.list('msg/ochat-' + this.user.id + "/inter-" + this.toUser.id, {
        //     query: {
        //         limitToLast: 8
        //     }
        // })
        // .subscribe(data => {
        //     this.msgList = [];
        //     // this.page++;
        //     data.map(elem => {
        //         console.log(elem)
        //         try {
        //             this.msgList.push(elem);
        //         } catch (error) {
        //             alert(JSON.stringify(error))
        //         }
        //     })
        //     this.scrollToBottom();
        // })
        this.chatService.getMsgList(this.user.id, this.toUser.id, this.msgList.length).then((data)=>{

            let initial = this.msgList.length == 0;
            
            let json = JSON.parse(data.data);
            if(json.status == "ok"){
                json.data = json.data.reverse();
                let msgs: ChatMessage[];
                msgs = this.msgList;
                
                json.data.forEach(item => {
                    if(!this.msgList.some(e => e.messageId == item.id)){
                        msgs.push({
                            messageId: item.id,
                            userId: item.sender,
                            userName: item.senderName,
                            userAvatar: item.photo,
                            toUserId: item.toUser,
                            time: item.date,
                            message: item.msg,
                            status: item.status,
                            productId:0,
                            vu:item.vu
                        })
                    }
                });
                if(this.msgList.length != msgs.length)
                    this.msgList = msgs;
                this.scrollToBottom();
            }
        });
        this.timeout = setTimeout(() => {this.getMsg()}, 3000);
    }
    doInfinite(infiniteScroll) {
        // Get mock message list
        // this.afdb.list('msg/ochat-' + this.user.id + "/inter-" + this.toUser.id, {
        //     query: {
        //         orderByChild: "time",
        //         limitToLast: this.nbrMsgLimit * this.page
        //     }
        // })
        // .subscribe(data => {
        //     this.msgList = [];
        //     data.map(elem => {
        //         console.log(elem)
        //         try {
        //             this.msgList.push(elem);
        //             // this.page++;
        //         } catch (error) {
        //             alert(JSON.stringify(error))
        //         }
        //     })
        //     infiniteScroll.complete();
        // })

    }
    recupererUser(callbackFunction=function(){})
    {
        try {
            this.chatService.getUserInfo()
                .then((res) => {
                    if (res) {
                        this.user = res
                        this.userData.getPersonId().then((id) => {
                            this.user.id = id;
                        });
                        // this.deleteNewMsg();
                        callbackFunction();
                    }
                });
        } catch (error) {
            this.user = { id: "octimustest", name: "octimus prime", avatar: "avatar" };
        }
    };
    /**
     * @name sendMsg
     */
    sendMsg() 
    {
        // alert(this.item.id)
        try {
            if (!this.editorMsg.trim()) return;
            
            // Mock message
            const id = Date.now().toString();
            let newMsg: ChatMessage = {
                messageId: Date.now().toString(),
                userId: this.user.id,
                userName: this.user.name,
                userAvatar: this.user.avatar,
                toUserId: this.toUser.id,
                time: Date.now(),
                message: this.editorMsg,
                status: 'pending',
                productId: this.item?.id_eleve,
                productName: this.item?.nom,
                vu: 0,
            };
            if(this.respondTo)
            {
                newMsg.msgToText = this.respondTo.message;
                newMsg.msgToId = this.respondTo.messageId;
            }
            this.pushNewMsg(newMsg)
            this.editorMsg = '';

            if (!this.showEmojiPicker) {
                this.messageInput.setFocus();
            }

            this.respondTo = undefined;
            // newMsg.status = 'success';          
            // let refSent = this.afdb.list("msg/ochat-" + this.user.id + "/inter-" + this.toUser.id).push(newMsg)
            //     .then((data) => {
            //         this.afdb.database.refFromURL(''+data).update({status:"success"}).then((data)=>{
            //             // alert("error "+data)
            //         }, (error)=>{
            //             alert("error "+error)
            //         });

            //         try {
            //             let index = this.getMsgIndexById(id);
            //             if (index !== -1) {
            //                 this.msgList[index].status = 'success';
            //             }
            //         } catch (error) {
            //             console.log((error))
            //         }

            //     });
            // this.afdb.list("msg/ochat-" + newMsg.toUserId + "/inter-" + this.user.id).push(newMsg)
            //     .then(() => {
            //         console.log("octimus, you are the best");
            //     });

            //     this.afdb.list("new-msg/" + newMsg.toUserId).push(newMsg)
            //     .then(() => {
            //         console.log("cool")
            //     });
            //     let nouveau = newMsg;

            //     nouveau.userName = this.toUser.name;
            //     nouveau.userAvatar = this.toUser.avatar;
            //     nouveau.userId = this.toUser.id;

            //     this.afdb.list("new-msg/" + this.user.id).push(nouveau)
            //         .then(() => {
            //             console.log("cool")
            //         });
            this.http.post(this.address_serveur + "/action_mobile.php", {action:"notification", userId:newMsg.toUserId, title:this.user.name, senderId:this.user.id, avatar:this.user.avatar, msg:newMsg.message}, {}).then((data)=>{

            }, (err)=>{
                console.log(err);
            })
                
        } catch (error) {
            console.log(error);
        }

        // this.chatService.sendMsg(newMsg)
        // .then(() => {
        //     let index = this.getMsgIndexById(id);
        //     if (index !== -1) {
        //         this.msgList[index].status = 'success';
        //     }
        // })
    }

    /**
     * @name pushNewMsg
     * @param msg
     */
    pushNewMsg(msg: ChatMessage) {
        let index;
        console.clear()
        console.log({msg:msg})
        console.log({it:this.item})

        this.chatService.sendMsg(msg).subscribe((d)=>{
            try {
                
                let json = JSON.parse(d.data)
                this.msgList[index].status = json.status == "ok" ? "success" : "";
                this.msgList[index].messageId = json.id;
            } catch (error) {
                console.log(d.data);
                
            }
        });
        try {
            const userId = this.user.id,
                toUserId = this.toUser.id;
            // Verify user relationships
            if (msg.userId === userId && msg.toUserId === toUserId) {
                index = this.msgList.push(msg) - 1;
            } else if (msg.toUserId === userId && msg.userId === toUserId) {
                index = this.msgList.push(msg) - 1;
            }
            this.scrollToBottom();
        } catch (error) {
            alert(JSON.stringify(error))
        }

    }

    getMsgIndexById(id: string) {
        return this.msgList.findIndex(e => e.messageId === id)
    }

    scrollToBottom() {
        setTimeout(() => {
            if (this.content.scrollToBottom) {
                this.content.scrollToBottom();
            }
        }, 400)
    }

    ngOnInit(){
        this.userData.hasLoggedIn().then((l) => {
            this.logedIn = l;
        })
        this.userData.getPersonId().then(id => {
            this.user = {id: id};
        })
    }

    ionViewWillLeave() {
        clearTimeout(this.timeout);
    }

}
