import { Injectable } from '@angular/core';
import { Platform } from '@ionic/angular';
import { HTTP } from '@ionic-native/http/ngx';
import { Storage } from '@ionic/storage';


@Injectable({
  providedIn: 'root'
})
export class SettingsService {

  public premieum:any = false;
  public espace:any = null;
  public btnCt:any;
  public btnTelco:any;
  public servers:Array<string> = ["https://octra.io","https://123soleilcomores.com", "http://cim-comores.com"];
  public address_serveur:string = "https://natidja.octra.io/";
  public a_server:string = "https://natidja.octra.io/";
  public btns:Array<{visible:boolean, btnText:string, text:string, number:string}> = 
  [{visible:false, btnText:"Forfaits Comores Telecom", text:"vous semblez avoir des soucis de connexion.Utilisez les 👇🏾👇🏾", number:"*334#"},{visible:true, btnText:"Forfaits Telco", text:"vous semblez avoir des soucis de connexion.Utilisez les 👇🏾👇🏾", number:"#444#"}];

  constructor(public storage:Storage, public http:HTTP, public platform:Platform) {
    console.log('Hello SettingsProvider Provider');

    this.platform.ready().then(()=>{
      
    })
  }
  ionViewDidLoad(){
    
  }
  public getBtns():Promise<any>
  {
    return this.storage.get('btns').then((data)=>{
      // alert('stocked : '+JSON.stringify(data))
      return data;
    }, (err)=>{
      return this.btns
    })
  }
  public getServer():Promise<any>
  {
    let i = 0;
    return this.storage.get('server').then((data)=>{
      if(data)
        return data;
      else
        return this.servers[0];
    }, (err)=>{
      alert(err)
      return this.servers[0];
    })
  }
  public getEspace():Promise<any>
  {
    return this.storage.get('espace').then((data)=>{
      return data;
    }, (err)=>{
      // alert(err)
    })
  }
  public getPremium():Promise<any>
  {
    return this.storage.get('premium').then((data)=>{
      return data;
    }, (err)=>{
      // alert(err)
    })
  }
  public setEspace(p)
  {
    this.storage.set('espace', p).then((data)=>{
      return data;
    }, (err)=>{
      // alert(err)
    })
  }
  public setPremium(p, server="https://123soleilcomores.com")
  {
    this.storage.set('premium', p).then((data)=>{
      return data;
    }, (err)=>{
      alert(err)
    })
    this.storage.set('server', server).then((data)=>{
      return data;
    }, (err)=>{
      alert(err)
    })
  }
  public setBtns(btns)
  {
    this.storage.remove('btns').then(()=>{

      this.storage.set('btns', btns).then((data)=>{

      }, (err)=>{
        // alert(err)
      })
    })
  }
}
