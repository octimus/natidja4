import { Injectable } from '@angular/core';
import { ModalController } from '@ionic/angular/providers/modal-controller';

@Injectable({
  providedIn: 'root'
})
export class ModalService {

  constructor(private modalCtrl: ModalController) { }

  show(item:any){
    this.modalCtrl.create({component:"modal", backdropDismiss: true, componentProps:{items:item}}).then(m => {
      m.present();
    })
  }
}
