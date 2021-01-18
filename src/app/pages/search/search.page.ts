import { Component, OnInit } from '@angular/core';
import { Platform, NavController, NavParams } from '@ionic/angular';
import { ApiService } from 'src/app/services/api/api.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-search',
  templateUrl: './search.page.html',
  styleUrls: ['./search.page.scss'],
})
export class SearchPage implements OnInit {

  public etablissements;

  public etudiantsOriginal;
  public etudiants;
  public recherche;
  public indexLecture: any;
  public etablissement: any = "Tout";
  public serie: any;
  public loading;
  public loaded;
  public examen;
  public a_server;
  public iles;
  public ile;
  public years:any = [ '2016-2017', '2017-2018', '2018-2019', '2019-2020'];
  public annee:any = null;
  public mention:any = 'tout';
  public slidesPub:any = [];

  constructor(public api: ApiService, public platform: Platform, 
    public navCtrl: NavController, public route: ActivatedRoute) {
    this.indexLecture = 0;
    // this.etablissement = "EIK";
    this.annee = this.years[this.years.length-1];
    this.serie = "tout";
    this.loading = false;
    this.loaded = false;
    this.etudiants = [];
    this.etablissements = [];
    this.iles = ["Ngazidja", "Anjouan", "Moheli"];
    this.examen = "BAC";
    this.loadYears();
    this.loadEtablissement();
    // this.loadPubs();

    this.route.queryParams.forEach((d)=>{
      this.annee = d.annee;
    });
    this.route.queryParams.forEach((d)=>{
      this.examen = d.examen;
    });
    this.route.queryParams.forEach((d)=>{
      this.mention = d.mention;
    });
    this.route.queryParams.forEach((d)=>{
      this.etablissement = d.etablissement;
    });
    this.route.queryParams.forEach((d)=>{
      this.ile = d.ile;
    });

    if(!this.etablissements.includes(this.etablissement))
      this.etablissements.push(this.etablissement);

    this.rechercher();
    
    // this.lecture("Direct");


  }
  loadYears(){
    this.years = [];
    let currentYear = new Date().getFullYear();
    for(let y = currentYear; y >= 2017; y--){
      this.years.push(`${y-1}-${y}`);
    }

    this.annee = this.years[0];
  }
  public loadEtablissement(reload = false) {
    if (this.ile && (this.etablissements.length == 0 || reload)) {
      this.etablissements = [];
      this.api.postData("bac/action.php", {
        action: "etablissement_json", ile: this.ile, filtre: "ok", annee:this.annee
      }, {}).subscribe((response) => {
        try {
          this.etablissements = JSON.parse(response.data.trim());
        } catch (error) {
          // alert("Chargement des etablissements : " + response.data)
        }
        // this.etablissement = this.etablissements[0];
        // this.filtrer();
      })
    }
  }
  public lecture(filtre = "Autorisé") {
    // if (this.indexLecture == 0)
    // alert(this.etudiants[this.indexLecture].prenom);
    if (this.etudiants[this.indexLecture].status == filtre) {

      this.lire(this.etudiants[this.indexLecture].nom + " " +
        this.etudiants[this.indexLecture].prenom, function () {
          alert(this.indexLecture);
          this.lecture(filtre);
          this.indexLecture++;
        });
    }
    else
    { this.indexLecture++; this.lecture(filtre); }

  }
  public openItem(item) {
    this.navCtrl.navigateForward('item-details', {queryParams:{
      item: item}
    })
  }
  public rechercher() {
    this.filtrer();
    if (this.etudiants.length == 1)
      this.openItem(this.etudiants[0]);
  }
  public filtrer(emptyIt?: boolean, event?) {
    this.loading = true;
    if(typeof(emptyIt) == "undefined")
      emptyIt = true;
    if(emptyIt)
      this.etudiants = [];
    // this.etudiants = this.etudiantsOriginal.filter((etudiant) => {
    //   return etudiant.nom + " " + etudiant.prenom == this.recherche || etudiant.prenom + " " + etudiant.nom == this.recherche || etudiant.id == this.recherche
    // })
    this.api.postData("bac/action.php",
      {
        action: "advanced_filtre", etablissement: this.etablissement,
        serie: this.serie,
        examen: this.examen,
        ile: this.ile,
        annee:this.annee,
        mention:this.mention,
        recherche:this.recherche,
        offset: this.etudiants.length
      }, {})
      .subscribe(response => {
        var objet;
        if(event){
          event.target.complete();
        }

        try {
          let jsonData = JSON.parse(response.data.trim());
          if(this.etudiants.length == 0)
            this.etudiants = jsonData;
          else
            this.etudiants = [...this.etudiants, ...jsonData];
        } catch (error) {
          if(response.data)
            alert(response.data);
        }

        this.loading = false;
        this.loaded = true;
      }, (error) => {
        this.loading = false;
        if(event){
          event.target.complete();
        }
        alert("error :" + error.error);
      });
  }
  public lire(texte: string, callback) {
    // this.tts.speak(texte)
    //   .then(() => { alert('Success'); callback(); })
    //   .catch((reason: any) => { alert("erreur : " + JSON.stringify(reason)); });
  }
  
  public loadPubs() {
    return;
    this.slidesPub = [];
    
    this.api.postData("bac/action.php",
      { action: "pubs_json", page:"search" }, {})
      .subscribe(response => {

        try {

          let dat = response.data.trim();

          this.slidesPub = JSON.parse(dat);

        }
        catch (error) {
          if(response.data)
          {
            alert(response.data)
          }
        }
      }, (error) => {
        alert(error)
      });
  }

  ngOnInit() {
  }

}
