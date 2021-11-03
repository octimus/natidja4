import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from '../api/api.service';
import { UserDataService } from '../user-data/user-data.service';

@Injectable({
  providedIn: 'root'
})
export class CoursService {

  constructor(private api: ApiService, private userData: UserDataService) { }

  async getList(ecole: any, eleve:any, offset:number = 0, level: any = null): Promise<Observable<any>>{
    let telephone = await this.userData.getTelephone();
    return this.api.postData("action_mobile.php", {"action": "lecons_json", "telephone": telephone, ecole:ecole, eleve:eleve, offset:offset, level: level});
  }
  async getListCoaching(type:any="cours", offset:number = 0, filtres=null): Promise<any>{
    let level: any = await this.userData.getLevel();
    let telephone = await this.userData.getTelephone();
    let userId = await this.userData.getId();
    let params: any = 
    {
      action: "lecons_json", telephone: telephone, 
      eleve:userId, coaching:'oui', type:type, 
      offset:offset, level:level, matiere:filtres?.matiere
    };
    console.log(params)
    let o: Observable<any> = this.api.postData("action_mobile.php", params)
    o.subscribe((data) => {
      let json = JSON.parse(data.data);
      console.log(json)
    }, (err) => console.error(err))
    return o.toPromise();
  }
  async getListMatieres(type:any="cours", offset:number = 0): Promise<any>{
    let level: any = await this.userData.getLevel();
    let telephone = await this.userData.getTelephone();
    let userId = await this.userData.getId();
    let o: Observable<any> = this.api.postData("action_mobile.php", {"action": "matieres_json", 
    "telephone": telephone, eleve:userId, coaching:'oui', type:type, offset:offset, level:level})
    
    return o.toPromise();
  }
  async getListCoachingFree(type: string = "", coach: any, offset:number = 0): Promise<any>{
    let level: any = await this.userData.getLevel();
    let telephone = await this.userData.getTelephone();
    let userId = await this.userData.getId();
    let o: Observable<any> = this.api.postData("action_mobile.php", {"action": "lecons_json", acces: "all", 
    coach:coach, "telephone": telephone, eleve:userId, coaching:'oui', type:type, offset:offset, level:level});
    return o.toPromise();
  }
  async sendResponse(response:string, question:any): Promise<any>{
    let level: any = await this.userData.getLevel();
    let telephone = await this.userData.getTelephone();
    let userId = await this.userData.getId();
    return this.api.postData("action_mobile.php", {"action": "send_response", "telephone": telephone, eleve:userId, 
    content:response, question:question.question, exo:question.exo, auto_correct:question?.auto_correct, level:level}).toPromise();
  }
  async setComprehension(item:any, value:number): Promise<any>{
    let level: any = await this.userData.getLevel();
    let telephone = await this.userData.getTelephone();
    let userId = await this.userData.getId();
    return this.api.postData("action_mobile.php", {"action": "set_comprehension", "telephone": telephone, eleve:userId, 
    item:item, comprehension:value, level:level}).toPromise();
  }
  async validerExo(id:number): Promise<any>{
    let level: any = await this.userData.getLevel();
    let telephone = await this.userData.getTelephone();
    let userId = await this.userData.getId();
    return this.api.postData("action_mobile.php", {"action": "valider_exo", "telephone": telephone, eleve:userId, exo:id, level:level}).toPromise();
  }
}
