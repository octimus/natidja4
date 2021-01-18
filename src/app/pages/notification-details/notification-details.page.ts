import { Route } from '@angular/compiler/src/core';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-notification-details',
  templateUrl: './notification-details.page.html',
  styleUrls: ['./notification-details.page.scss'],
})
export class NotificationDetailsPage implements OnInit {
  public item: any = {}
  constructor(private route: ActivatedRoute) { 
    this.route.queryParams.forEach((p)=>{
      this.item = p.item;
    });
  }

  ngOnInit() {
  }

}
