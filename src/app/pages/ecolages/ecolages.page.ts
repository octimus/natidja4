import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AlertController } from '@ionic/angular';
import { ApiService } from 'src/app/services/api/api.service';
import { UserDataService } from 'src/app/services/user-data/user-data.service';
import { Storage } from '@ionic/storage';

@Component({
  selector: 'app-ecolages',
  templateUrl: './ecolages.page.html',
  styleUrls: ['./ecolages.page.scss'],
})
export class EcolagesPage implements OnInit {

  public item: any;
  public ecolages: any[] = [];
  private ecole: any = null;
  public total: number  = 0;
  public reste: any  = 0;

  constructor(private activateRoute: ActivatedRoute, private api: ApiService, 
    private userData: UserDataService, private storage: Storage, private alt: AlertController) { 

  }

  imgError(event){
    console.log(event.target);
    event.target.parentNode.remove(event.target);
    
    // event.target.src = 'assets/img/default-avatar.png';
  }
  ngOnInit() {
    this.activateRoute.queryParams.forEach(p => {
      this.item = p;
      console.log({rrrrrrr:this.item})
      this.storage.get(`ecolages${this.item?.id_eleve}`).then(es => {
        this.ecolages = es;this.calc(false)
      });
    this.storage.get("school").then((data) => {
      this.ecole = data;
      this.loadEco();
    })

      console.log({iii: this.item});
    })
    
  }

  loadEco(){
    let params = {action: "ecolages_json", ecole:this.item.ecole, id_eleve:this.item?.id};
    console.log(params)
    this.api.postData("action_mobile_gestion.php", params).subscribe((data) => {
      try {
        
        let json = typeof(data?.data) === "string" ? JSON.parse(data.data) : data?.data ? data.data : data;
        if(json.status == "ok"){
          console.log(json.data);
          if(!json.data[0].montant){
            this.reste = json.data[0].rest;
            return;
          }
          this.ecolages = json.data;
          this.storage.set(`ecolages${this.item.id_eleve}`, this.ecolages);
          this.calc();
        }
      } catch (error) {
        console.log(data.data);
        
      }
    })
  }

  calc(animate: boolean = true){
    this.total = 0;
    let timer = 0;
    console.log(this.ecolages)
    if(this.ecolages == null)
      return;
    this.ecolages.forEach( (e) => {
      if(animate)
      {  
        setTimeout(() => {
          if(e.montant){
            this.total += parseInt(e.montant);
            this.reste = parseInt(e.total_a_paye) - this.total;
          }
        }, timer+=50);
      }
      else
      {  
        this.total += parseInt(e.montant);
        this.reste = (e.total_a_paye);
      }
    });
  }

}
