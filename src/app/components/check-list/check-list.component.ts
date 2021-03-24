import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-check-list',
  templateUrl: './check-list.component.html',
  styleUrls: ['./check-list.component.scss'],
})
export class CheckListComponent implements OnInit {

  @Input() label: string;
  @Input() value: any;
  @Input() name: string;
  @Input() id: any;
  @Input() checked: boolean;

  constructor() { }

  ngOnInit() {}

}
