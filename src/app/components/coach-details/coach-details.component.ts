import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-coach-details',
  templateUrl: './coach-details.component.html',
  styleUrls: ['./coach-details.component.scss'],
})
export class CoachDetailsComponent implements OnInit {

  @Input() id: string;
  @Input() nom: string;
  @Input() photo: string;
  @Input() prix_hebdo: string;
  @Input() slogan: string;

  constructor(private activate: ActivatedRoute) { }

  ngOnInit() {
    console.log(this.nom)
  }

}
