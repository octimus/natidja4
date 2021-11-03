import { Injectable } from '@angular/core';
import { ApiService } from '../api/api.service';
import { UserDataService } from '../user-data/user-data.service';
import { Storage } from '@ionic/storage';

const COACH_LIST = "coach_list";
const COACH_LIST_SUBSCRIBED = "coach_list_subscribed";
@Injectable({
  providedIn: 'root'
})
export class CoachService {
  constructor(private api: ApiService, private userData: UserDataService, private storage: Storage) { }

  async getList(offset: number = 0, filtres: any = {}): Promise<any>{
    let userId = await this.userData.getId();
    let ecole = await this.storage.get("school");
    let level: any = await this.userData.getLevel();
    return this.api.postData("action_mobile.php", {action:"coachs_json", userId:userId, offset: offset, ecole:ecole, filtres: filtres, level:level}).toPromise();
  }
  async setLocalList(coachs: any[]): Promise<any>{
    return this.storage.set(COACH_LIST, coachs);
  }
  async getLocalList(): Promise<any>{
    return this.storage.get(COACH_LIST);
  }
  async setLocalListSubsribed(coachs: any[]): Promise<any>{
    return this.storage.set(COACH_LIST_SUBSCRIBED, coachs);
  }
  async getLocalListSubscribed(): Promise<any>{
    return this.storage.get(COACH_LIST_SUBSCRIBED);
  }



  async sub(coachId){
    let level: any = await this.userData.getLevel()
    let userId = await this.userData.getId();
    return this.api.postData("action_mobile.php", {action:"sub_coach", userId:userId, coach: coachId, level:level});
  }
}
