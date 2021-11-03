import { Component, Input, OnInit } from '@angular/core';
import { AlertController } from '@ionic/angular';
import { UserDataService } from 'src/app/services/user-data/user-data.service';
import { BarcodeScanner } from '@ionic-native/barcode-scanner/ngx';

@Component({
  selector: 'app-flip-card',
  templateUrl: './flip-card.component.html',
  styleUrls: ['./flip-card.component.scss'],
})
export class FlipCardComponent implements OnInit {
  public doFlip: boolean = false;
  public doSlide: boolean = false;
  public doSuccess: boolean = false;

  @Input() item: any;
  @Input() value: any;
  code: string = "";
  public message: string = ""
  public octicoins: any;

  constructor(private userData: UserDataService, private alertCtrl: AlertController, private barcodescanner: BarcodeScanner) { 
    this.userData.getOcticoin().then((value) => {
      this.octicoins = value;
    })
  }

  flip(){
    this.doFlip = !this.doFlip;
  }
  send(code){

  }
  scan(){
    this.barcodescanner.scan().then((data) => {
      this.code = data.text;
      console.log(data)
    }).finally(() => {
    })
  }
  trimString(string, length) {
    let btn = `<a class='btn-view-more'>plus</a>`;
    return string.length > length ? 
            string.substring(0, length) + '...' + btn :
            string;
  }
  unFlip(){
    if(this.code.length < 4)
    {
      this.message = `Veuillez saisir un code correcte`;
      return;
    }
    this.message = "";
    this.doFlip = !this.doFlip;
    this.doSlide = !this.doSlide;
    this.doSuccess = !this.doSuccess;

    this.userData.rechargerOcticoin(this.code).then((reponse)=>{
      try {
        const json = JSON.parse(reponse);
        if(json.status === "ok"){
          this.value = json.octicoin;
          this.octicoins = json.octicoin;
        }
        else
        {
          this.alertCtrl.create({
            subHeader: json.status,
            message: json.message,
            buttons: ["OK"]
          }).then(a => a.present());
        }
      } catch (error) {
        console.error(error);
        this.alertCtrl.create({subHeader:"Erreur de parsing", message:reponse}).then(a => a.present());
      }
    }).finally(() => {
      this.doSlide = !this.doSlide;
      this.doSuccess = !this.doSuccess;
    })
  }

  ngOnInit() {
    
  }

}
