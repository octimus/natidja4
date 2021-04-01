import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NavController } from '@ionic/angular';

@Component({
  selector: 'app-coach-details',
  templateUrl: './coach-details.component.html',
  styleUrls: ['./coach-details.component.scss'],
})
export class CoachDetailsComponent implements OnInit {

  @Input() id: any;
  @Input() nom: string;
  @Input() nom_matiere: string;
  @Input() classe: string;
  @Input() photo: string;
  @Input() prix_hebdo: string;
  @Input() prix_tarzan: string;
  @Input() prix_technicien: string;
  @Input() label_offre: string;
  @Input() label_offre2: string;
  @Input() slogan: string;
  public coach: any;


  constructor(private activate: ActivatedRoute, public navCtrl: NavController) { }

  ngOnInit() {
    console.log(this.nom)
    this.coach = {
      id:this.id, nom: this.nom, prix_technicien: this.prix_technicien, prix_tarzan: this.prix_tarzan, 
      slogan: this.slogan, classe: this.classe, photo: this.photo, label_offre: this.label_offre, label_offre2: this.label_offre2
    }
  }

}
