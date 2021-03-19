import { Component, OnInit } from '@angular/core';
import { AlertController, LoadingController, NavController } from '@ionic/angular';
import { ApiService } from 'src/app/services/api/api.service';
import { CoursService } from 'src/app/services/cours/cours.service';
import { PreviewAnyFile } from '@ionic-native/preview-any-file/ngx';
import { Storage } from '@ionic/storage';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-cours',
  templateUrl: './cours.page.html',
  styleUrls: ['./cours.page.scss'],
})
export class CoursPage implements OnInit {

  public eleve: any = null;
  public cours: any[] = [];
  constructor(private api: ApiService, public navCtrl: NavController, 
    private coursService: CoursService, public alertCtrl: AlertController, 
    private preview: PreviewAnyFile,
    private loadCtrl: LoadingController, private storage: Storage, private router: ActivatedRoute) { }

  ngOnInit() {
    this.router.queryParams.forEach(e => {
      console.log(e);
      console.log(e.item);
      
      this.eleve = e.item?.id;
    })
    this.load(this.eleve);
  }
  openCours(item:any){
    this.navCtrl.navigateForward("cours-details", {
      queryParams:item
    })
  }
  ionViewDidEnter(){
  }
  
  load(eleve:any){
    this.storage.get("school").then(s => {
      this.storage.get(`cours${s.id}`).then(c => this.cours = c);
      this.coursService.getList(s.id, eleve).then((cours) => {
        cours.subscribe((data)=>{

          try {
            const json = JSON.parse(data.data);
            console.log(json.request);
            console.log(json.post)
            
      
            if(json.status == "ok"){
              this.cours = json.data;
              this.storage.set(`cours${s.id}`, json.data);
            }
          } catch (error) {
            console.error(error)
            console.log(data.data);
            
          }
        })
        
      })
    })
  }
  public image:any = "";
  async viewFile(item){
    // console.log(item)
    let loader: HTMLIonLoadingElement = await this.loadCtrl.create({message:"chargement..."});

    this.preview.preview(item.url).then((d) => {
      loader.dismiss();
      console.log({after_preview: d});
    }, (err) => {
      loader.dismiss();
      console.error(err);
    })
    // this.vPlayer.play(item.url).then((data) => console.log({finished: data})).catch(err => console.log(err));
  }

  download(url:string, titre: string){
    this.api.downloadFileAndStore(url, titre.replace(" ", "")+".jpg").then((i) => this.image = i.nativeURL);
  }

}
