import { Component, OnInit } from '@angular/core';
import { AffiliationService } from 'src/app/services/affiliation/affiliation.service';

@Component({
  selector: 'app-affiliate',
  templateUrl: './affiliate.page.html',
  styleUrls: ['./affiliate.page.scss'],
})
export class AffiliatePage implements OnInit {

  public items: any[] = [];
  constructor(private affiliationService: AffiliationService) { }

  ngOnInit() {
    this.loadData();
  }
  loadData(event:any = null){
    this.affiliationService.getAffiliate(this.items.length).then(data => {
      console.log(data);
      let json = JSON.parse(data.data);
      if(!event)
        this.items = json.data;
      else
      {  
        this.items = [...this.items, ...json.data];
        event.target.complete()
      }

    })
  }

}
