import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from '../api/api.service';
import { UserDataService } from '../user-data/user-data.service';

@Injectable({
  providedIn: 'root'
})
export class CoursService {

  constructor(private api: ApiService, private userData: UserDataService) { }

  async getList(ecole: any, eleve:any): Promise<Observable<any>>{
    let telephone = await this.userData.getTelephone();
    return this.api.postData("action_mobile_gestion.php", {"action": "lecons_json", "telephone": telephone, ecole:ecole, eleve:eleve});
  }
  delete(item:any): Observable<any>{
    return this.api.postData("action_mobile_gestion.php", {"action": "delete_cour", id:item.id});
  }
}
