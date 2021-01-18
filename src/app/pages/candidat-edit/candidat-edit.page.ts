import { Component, OnInit } from '@angular/core';
import { NavController, NavParams, Platform, ActionSheetController, AlertController, ToastController, LoadingController } from '@ionic/angular';
import { UserDataService } from 'src/app/services/user-data/user-data.service';
import { ApiService } from 'src/app/services/api/api.service';
import { Camera, CameraOptions } from '@ionic-native/camera/ngx';
import { Crop } from '@ionic-native/crop/ngx';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-candidat-edit',
  templateUrl: './candidat-edit.page.html',
  styleUrls: ['./candidat-edit.page.scss'],
})
export class CandidatEditPage implements OnInit {

  public item:any = {};
  public loading:any = 0;
  public etablissement:any = "";
  public pseudo:any = "";
  public origine:any = "";
//cropperjs
  // @ViewChild('angularCropper') public angularCropper: AngularCropperjsComponent;
  cropperOptions: any;
  croppedImage = null;
 
  myImage = null;
  scaleValX = 1;
  scaleValY = 1;

  constructor(public navCtrl: NavController, public navParams: NavParams,
    public userData: UserDataService, public platform: Platform, public api: ApiService, public actionSheet:ActionSheetController, 
    private camera:Camera, public crop:Crop, public alertCtrl:AlertController, public toastCtrl:ToastController, 
    public loadingCtrl:LoadingController, private route: ActivatedRoute) {

    this.route.queryParams.forEach((p)=>{
      this.item = p.item;
    })
    this.userData.getId().then((data)=>{
      this.userProfile.userId = data;
    })
    this.cropperOptions = {
      dragMode: 'crop',
      aspectRatio: 1,
      autoCrop: true,
      movable: true,
      zoomable: true,
      scalable: true,
      autoCropArea: 0.8,
    };
  }
//  reset() {
//     this.angularCropper.cropper.reset();
//   }
 
//   clear() {
//     this.angularCropper.cropper.clear();
//   }
 
//   rotate() {
//     this.angularCropper.cropper.rotate(90);
//   }
 
//   zoom(zoomIn: boolean) {
//     let factor = zoomIn ? 0.1 : -0.1;
//     this.angularCropper.cropper.zoom(factor);
//   }
 
//   scaleX() {
//     this.scaleValX = this.scaleValX * -1;
//     this.angularCropper.cropper.scaleX(this.scaleValX);
//   }
 
//   scaleY() {
//     this.scaleValY = this.scaleValY * -1;
//     this.angularCropper.cropper.scaleY(this.scaleValY);
//   }
 
//   move(x, y) {
//     this.angularCropper.cropper.move(x, y);
//   }
 
  // saveImage() {
  //   let croppedImgB64String: string = this.angularCropper.cropper.getCroppedCanvas().toDataURL('image/jpeg', (100 / 100));
  //   this.croppedImage = croppedImgB64String;
  // }
  ionViewDidLoad() {
    console.log('ionViewDidLoad CandidatEditPage');
  }
  public defaultImg(element, fallback = "assets/img/default-user.png") {
    element.src = fallback;
  }
    //upload
  imageURI: any;
  imageFileName: any;
  cropedImage: string;
  userProfile: { displayName: string, telephone: string, userId: any, photo: string, domicile: string,
     email: string }={displayName:"", telephone:null, userId:null, photo:null, domicile:null, email:null};


  getImage() {
    let options: CameraOptions;

    this.actionSheet.create({
      header: "Choisissez une source svp",
      buttons: [
        {
          text: "Appareil photo",
          handler: () => {
            options = {
              allowEdit: false,
              sourceType: this.camera.PictureSourceType.CAMERA,
              mediaType: this.camera.MediaType.PICTURE,
              destinationType: this.camera.DestinationType.FILE_URI
            }
            this.camera.getPicture(options).then((fileUri) => {
              // this.imageURI = fileUri;        
              if (this.platform.is('ios')) {
                this.imageURI = fileUri;
              } else if (this.platform.is('android')) {
                // Modify fileUri format, may not always be necessary
                this.imageURI = "file://" + fileUri;

                /* Using cordova-plugin-crop starts here */
                this.crop.crop(this.imageURI, { quality: 100 }).then((path) => {
                  // path looks like 'file:///storage/emulated/0/Android/data/com.foo.bar/cache/1477008080626-cropped.jpg?1477008106566'
                  // alert('Cropped Image Path!: ' + path);
                  this.cropedImage = path;
                  // this.uploadFile(this.imageURI);
                  // this.uploadFile(this.cropedImage);
                }, (err) => {
                  alert(JSON.stringify(err));
                  // this.presentToast(err);
                });
              }
            }, (err) => {
              console.log(err)
            });
          }
        }, {
          text: "Galerie",
          handler: () => {
            options = {
              allowEdit: false,
              sourceType: this.camera.PictureSourceType.SAVEDPHOTOALBUM,
              mediaType: this.camera.MediaType.ALLMEDIA,
              destinationType: this.camera.DestinationType.FILE_URI
            };
            this.camera.getPicture(options).then((fileUri) => {
              // this.imageURI = fileUri;        
              if (this.platform.is('ios')) {
                this.imageURI = fileUri;
              } else if (this.platform.is('android')) {
                // Modify fileUri format, may not always be necessary
                this.imageURI = "file://" + fileUri;
                this.uploadFile(this.imageURI);

                /* Using cordova-plugin-crop starts here */
                // this.crop.crop(this.imageURI, { quality: 100 }).then((path) => {
                //   // path looks like 'file:///storage/emulated/0/Android/data/com.foo.bar/cache/1477008080626-cropped.jpg?1477008106566'
                //   // alert('Cropped Image Path!: ' + path);
                //   this.cropedImage = path;
                //   // this.uploadFile(this.imageURI);
                //   this.uploadFile(this.cropedImage);
                // }, (err) => {
                //   alert(JSON.stringify(err));
                //   // this.presentToast(err);
                // });
              }
            }, (err) => {
              alert(JSON.stringify(err));
              this.presentToast(err);
            });
          }
        }
      ]
    }).then(a=>{
      a.present();
    });

  }

  async uploadFile(url) {
    let loader = await this.loadingCtrl.create({
      message: "Envoie de l'image..."
    });
    loader.present();
    // const fileTransfer: FileTransferObject = this.transfer.upload();
    this.api.uploadPic(url, "profile/upload.php", {}).then((data)=>{
      console.log(data + " Uploaded Successfully");
      this.imageFileName = "https://natidja.octra.io/profile/images/ionicfile.jpg"
      loader.dismiss();
      try {
        let reponse = JSON.parse(data.response);
        this.imageFileName = reponse.link;
        this.userData.setPhoto(reponse.link);
        this.userProfile.photo = reponse.link;
        this.item.photo = reponse.link;
      }
      catch (err) {
        this.presentToast(err);
        alert(JSON.stringify(data.response))
      }
      // this.presentToast("Image uploaded successfully");
    }, (err)=>{
      console.log(err);
        loader.dismiss();
        alert(JSON.stringify(err));
    });
  }


  public save()
  {
    this.loading = 1;
    this.api.postData2("action_mobile.php",
      { action: "update_appropriate_num", annee:this.item.year, num:this.item.numero, exam:this.item.exam, userid:this.userProfile.userId, pseudo:this.item.nom, origine:this.item.origine, etablissement:this.item.etablissement }, {})
      .subscribe(response => {
        this.loading = 0;
        let rep = (response.data).trim();
        if(rep == "ok")
        {
          this.showAlert("Opération réussie", "Les modifications ont bien été enregistrées");
        }
        else
          alert(response.data)
        
        // this.loadPubs();
      }, (error) => {
        this.loading = 0;
        this.showAlert("Problème de connexion", JSON.stringify(error));
        // this.etudiants = this.etudiantsOriginal;
      });
  }
  public async showAlert(titre, contenu) {
    let alert = await this.alertCtrl.create({
      header: titre,
      message: contenu,
      buttons: ['Fermer']
    });
    if(titre || contenu)
      alert.present();
  }
  presentToast(msg) {
    let toast = this.toastCtrl.create({
      message: msg,
      duration: 6000,
      position: 'bottom'
    });

    toast.then((t) => {
      t.present();
      console.log('Dismissed toast');
    });
  }

  ngOnInit() {
  }

}
