import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/internal/Observable';
import { ApiService } from '../api/api.service';
import { UserDataService } from '../user-data/user-data.service';

@Injectable({
  providedIn: 'root'
})
export class AffiliationService {

  constructor(private api: ApiService, private userData: UserDataService) { 

  }

  async getAffiliate(offset: number = 0): Promise<any>{
    let userId = await this.userData.getId();
    return this.api.postDataAlt("octram/action_mobile.php", {action: "get_affiliates", id_membre: userId, offset:offset}).toPromise();
  }
  async countAffiliations(): Promise<any>{
    let userId = await this.userData.getId();
    return this.api.postDataAlt("octram/action_mobile.php", {action: "get_affiliates_count", id_membre: userId}).toPromise();
  }
}
