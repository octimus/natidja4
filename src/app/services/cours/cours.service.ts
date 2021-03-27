import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from '../api/api.service';
import { UserDataService } from '../user-data/user-data.service';

@Injectable({
  providedIn: 'root'
})
export class CoursService {

  constructor(private api: ApiService, private userData: UserDataService) { }

  async getList(ecole: any, eleve:any, offset:number = 0): Promise<Observable<any>>{
    let telephone = await this.userData.getTelephone();
    return this.api.postData("action_mobile_gestion.php", {"action": "lecons_json", "telephone": telephone, ecole:ecole, eleve:eleve, offset:offset});
  }
  async getListCoaching(type:any="cours", offset:number = 0): Promise<any>{
    let telephone = await this.userData.getTelephone();
    let userId = await this.userData.getId();
    return this.api.postData("action_mobile.php", {"action": "lecons_json", "telephone": telephone, eleve:userId, coaching:'oui', type:type, offset:offset}).toPromise();
  }
  async sendResponse(response:string, question:any): Promise<any>{
    let telephone = await this.userData.getTelephone();
    let userId = await this.userData.getId();
    return this.api.postData("action_mobile.php", {"action": "send_response", "telephone": telephone, eleve:userId, content:response, question:question.question, exo:question.exo, auto_correct:question?.auto_correct}).toPromise();
  }
  async validerExo(id:number): Promise<any>{
    let telephone = await this.userData.getTelephone();
    let userId = await this.userData.getId();
    return this.api.postData("action_mobile.php", {"action": "valider_exo", "telephone": telephone, eleve:userId, exo:id}).toPromise();
  }
}
