import { Injectable } from '@angular/core';
import { ApiService } from '../api/api.service';
import { UserDataService } from '../user-data/user-data.service';
import { Storage } from '@ionic/storage';

@Injectable({
  providedIn: 'root'
})
export class CoachService {

  constructor(private api: ApiService, private userData: UserDataService, private storage: Storage) { }

  async getList(offset: number = 0): Promise<any>{
    let userId = await this.userData.getId();
    let ecole = await this.storage.get("school");
    return this.api.postData("action_mobile.php", {action:"coachs_json", userId:userId, offset: offset, ecole:ecole}).toPromise();
  }

  async sub(coachId){
    let userId = await this.userData.getId();
    return this.api.postData("action_mobile.php", {action:"sub_coach", userId:userId, coach: coachId});
  }
}
