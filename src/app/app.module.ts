import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';

import { IonicModule, IonicRouteStrategy, NavParams } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { HTTP } from '@ionic-native/http/ngx';
import { Network } from '@ionic-native/network/ngx';
import { CallNumber } from '@ionic-native/call-number/ngx';
import { IonicStorageModule } from '@ionic/storage';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { FileTransfer } from '@ionic-native/file-transfer/ngx';
import { Camera } from '@ionic-native/camera/ngx';
import { FileChooser } from '@ionic-native/file-chooser/ngx';
import { Crop } from '@ionic-native/crop/ngx';
import { InAppBrowser } from '@ionic-native/in-app-browser/ngx';
import { SMS } from '@ionic-native/sms/ngx';
import { SmsRetriever } from '@ionic-native/sms-retriever/ngx';
// import { AndroidPermissions } from '@ionic-native/android-permissions/ngx';
import { OneSignal } from '@ionic-native/onesignal/ngx';
import { ChatService } from './services/chat/chat.service';
import { CoursService } from './services/cours/cours.service';
import { PreviewAnyFile } from '@ionic-native/preview-any-file/ngx';
import { File } from '@ionic-native/file/ngx';

@NgModule({
  declarations: [AppComponent],
  entryComponents: [],
  exports: [HttpClientModule],
  imports: [
    BrowserModule,
    IonicModule.forRoot(),
    AppRoutingModule,
    IonicStorageModule.forRoot(), FormsModule
  ],
  providers: [
    StatusBar, Camera, Crop, InAppBrowser, SMS, SmsRetriever, ChatService, CoursService, PreviewAnyFile,
    SplashScreen, HTTP, NavParams, Network, CallNumber, FileTransfer, FileChooser, File,
    OneSignal,
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy }
  ],
  bootstrap: [AppComponent]
})
export class AppModule {}
