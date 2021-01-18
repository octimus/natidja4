import { Component, OnInit, ViewChild } from '@angular/core';
import { NavController, NavParams, AlertController } from '@ionic/angular';
import { HTTP } from '@ionic-native/http/ngx';
import { Chart } from 'chart.js';
import { ApiService } from 'src/app/services/api/api.service';

@Component({
  selector: 'app-stats',
  templateUrl: './stats.page.html',
  styleUrls: ['./stats.page.scss'],
})
export class StatsPage implements OnInit {

  ngOnInit() {
  }

  selectedItem: any;
  icons: string[];

  //chartjs
  @ViewChild('barCanvas') barCanvas;
  @ViewChild('doughnutCanvas') doughnutCanvas;
  @ViewChild('doughnutCanvasNew') doughnutCanvasNew;
  @ViewChild('lineCanvas') lineCanvas;
  @ViewChild('testCanvas') testCanvas;

  barChart: any;
  doughnutChart: any;
  doughnutChartNew: any;
  lineChart: any;
  testChart: any;
  //fin chartjs

  items: Array<{ title: string, note: string, icon: string }>;
  public statistique:any = {};

  constructor(public navCtrl: NavController, public navParams: NavParams, public http:HTTP, 
    public alertCtrl:AlertController, private api: ApiService) {

    this.statistique.success = [67.39, 21.37, 11.24];
    this.statistique.evolution_annees = ["2016", "2017"];
    this.statistique.evolution_data = [31, 11];
    this.statistique.successNew;

    this.charger();
  }
  public charger() {
    // this.etudiants = this.etudiantsOriginal.filter((etudiant) => {
    //   return etudiant.nom + " " + etudiant.prenom == this.recherche || etudiant.prenom + " " + etudiant.nom == this.recherche || etudiant.id == this.recherche
    // })
    this.api.postData("bac/action.php",
      { action: "charger_statistiques" }, {})
      .subscribe(response => {

        try {
          let donnees = JSON.parse(response.data.trim());
          this.statistique.success = donnees.sucess;
          this.statistique.evolution_annees = donnees.annees;
          this.statistique.evolution_data = donnees.evolutions;
          this.statistique.successNew = donnees.successNew;
          // alert(typeof(donnees.evolutions));
          // alert(JSON.stringify(donnees.evolutions));
          // alert(JSON.stringify(donnees.evolutions[0]));
          
          try {
            this.doughnutChartNew = new Chart(this.doughnutCanvasNew.nativeElement, {
        
              type: 'pie',
              data: {
                labels: ["Ajourné", "Oral", "Direct"],
                datasets: [{
                  label: '# of Votes',
                  data: donnees.successNew,
                  backgroundColor: [
                    'rgba(255, 99, 132, 0.2)',
                    'rgba(54, 162, 235, 0.2)',
                    'rgba(255, 206, 86, 0.2)',
                    'rgba(75, 192, 192, 0.2)',
                    'rgba(153, 102,255, 0.2)',
                    'rgba(255, 159, 64, 0.2)'
                  ],
                  hoverBackgroundColor: [
                    "#FF6384",
                    "#36A2EB",
                    "#FFCE56",
                    "#FF6384",
                    "#36A2EB",
                    "#FFCE56"
                  ]
                }]
              }
        
            });
            this.lineChart = new Chart(this.lineCanvas.nativeElement, {
  
              type: 'line',
              data: {
                labels: donnees.annees,
                datasets: [
                  {
                    label: "Direct",
                    fill: true,
                    lineTension: 0.1,
                    backgroundColor: "rgba(75,192,192,0.4)",
                    borderColor: "rgba(75,192,192,1)",
                    borderCapStyle: 'butt',
                    borderDash: [],
                    borderDashOffset: 0.0,
                    borderJoinStyle: 'miter',
                    pointBorderColor: "rgba(75,192,192,1)",
                    pointBackgroundColor: "#fff",
                    pointBorderWidth: 1,
                    pointHoverRadius: 5,
                    pointHoverBackgroundColor: "rgba(75,192,192,1)",
                    pointHoverBorderColor: "rgba(220,220,220,1)",
                    pointHoverBorderWidth: 2,
                    pointRadius: 1,
                    pointHitRadius: 10,
                    data: donnees.evolutions,
                    spanGaps: false,
                  }
                ]
              }
        
            });
          } catch (error) {
            alert(error)
          }
          
        }
        catch (error) {
          // alert(error);
          this.showAlert('', response.data);
        }
      }, (error) => {
        this.showAlert("Problème de connexion", "Veuillez verifier votre connexion à internet.");
        // this.etudiants = this.etudiantsOriginal;
      });
  }
  async showAlert(titre, contenu) {
    let alert = await this.alertCtrl.create({
      subHeader: titre,
      message: contenu,
      buttons: ['OK']
    });
    alert.present();
  }
  ionViewDidLoad() {
    // this.barChart = new Chart(this.barCanvas.nativeElement, {

    //   type: 'bar',
    //   data: {
    //     labels: ["Ngazidja", "Anjouan", "Moheli"],
    //     datasets: [{
    //       label: '# moyenne générale',
    //       data: [12, 18, 8],
    //       backgroundColor: [
    //         'rgba(255, 99, 132, 0.2)',
    //         'rgba(54, 162, 235, 0.2)',
    //         'rgba(255, 206, 86, 0.2)'
    //       ],
    //       borderColor: [
    //         'rgba(255,99,132,1)',
    //         'rgba(54, 162, 235, 1)',
    //         'rgba(255, 206, 86, 1)'
    //       ],
    //       borderWidth: 1
    //     }]
    //   },
    //   options: {
    //     scales: {
    //       yAxes: [{
    //         ticks: {
    //           beginAtZero: true
    //         }
    //       }]
    //     }
    //   }

    // });

  
    this.doughnutChart = new Chart(this.doughnutCanvas.nativeElement, {

      type: 'pie',
      data: {
        labels: ["Ajourné", "Oral", "Direct"],
        datasets: [{
          label: '# of Votes',
          data: this.statistique.success,
          backgroundColor: [
            'rgba(255, 99, 132, 0.2)',
            'rgba(54, 162, 235, 0.2)',
            'rgba(255, 206, 86, 0.2)',
            'rgba(75, 192, 192, 0.2)',
            'rgba(153, 102,255, 0.2)',
            'rgba(255, 159, 64, 0.2)'
          ],
          hoverBackgroundColor: [
            "#FF6384",
            "#36A2EB",
            "#FFCE56",
            "#FF6384",
            "#36A2EB",
            "#FFCE56"
          ]
        }]
      }

    });

    this.lineChart = new Chart(this.lineCanvas.nativeElement, {

      type: 'line',
      data: {
        labels: this.statistique.evolution_annees,
        datasets: [
          {
            label: "Direct",
            fill: true,
            lineTension: 0.1,
            backgroundColor: "rgba(75,192,192,0.4)",
            borderColor: "rgba(75,192,192,1)",
            borderCapStyle: 'butt',
            borderDash: [],
            borderDashOffset: 0.0,
            borderJoinStyle: 'miter',
            pointBorderColor: "rgba(75,192,192,1)",
            pointBackgroundColor: "#fff",
            pointBorderWidth: 1,
            pointHoverRadius: 5,
            pointHoverBackgroundColor: "rgba(75,192,192,1)",
            pointHoverBorderColor: "rgba(220,220,220,1)",
            pointHoverBorderWidth: 2,
            pointRadius: 1,
            pointHitRadius: 10,
            data: this.statistique.evolution_data,
            spanGaps: false,
          }
        ]
      }

    });
  }

  itemTapped(event, item) {
    // That's right, we're pushing to ourselves!
    this.navCtrl.navigateForward("stats", {queryParams:{
      item: item}
    });
  }

}
