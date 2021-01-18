import { Injectable } from '@angular/core';
import { HTTP } from '@ionic-native/http/ngx';
import { HttpClient } from '@angular/common/http';
import { Observable, from } from 'rxjs';
import { Platform } from '@ionic/angular';
import { Storage } from '@ionic/storage';
import { FileChooser } from '@ionic-native/file-chooser/ngx';
import { FileTransfer, FileTransferObject } from '@ionic-native/file-transfer/ngx';

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  api_url: string = "https://octra.io/";
  api_url2: string = "https://natidja.octra.io/";
  api_url_alt: string = "https://octra.io/";
  public native: boolean = true;
  private entete: {} = {};
  public device:any;
  
  constructor(private http: HTTP, private httpClient: HttpClient, 
    private platform: Platform, private storage: Storage, 
    private fileTransfer: FileTransfer, private fileChooser: FileChooser) { 
      this.device = this.platform.platforms();
      console.log({platform: this.device});
      // if(this.device.indexOf("mobileweb"))
      
    // this.http.setDataSerializer("json");
    
    // this.getEntetes();
  }

  getEntetes(): void
  {
    this.storage.get("access_token").then((data) => {
      if(data)
      {
        this.entete = {
         authorization: "Bearer "+data,
        };
        console.log(this.entete);
        
      }
    });
  }

  public uploadPic(uri, method="", reference): Promise<any>
  {
    console.log({reference: method});
    
    let fileTransferObject: FileTransferObject = this.fileTransfer.create();
    return fileTransferObject.upload(uri, method, {
      headers: this.entete,
      fileKey:"imageFilename",
      chunkedMode:false,
      params: {
        reference:reference,
      }
    });
  }

  public getData(method="", data: any, headers: {} = this.entete): Observable<any>
  { 
    data.device = this.device;
    let back: Observable<any>;
    if(!this.native)
    {
      back = this.httpClient.get(this.api_url+method, {
        headers: headers,
        params: data
      });
    }
    else
    {
      let backThen = this.http.get(this.api_url+method, data, headers);
      back = from(backThen).pipe()
    }
    return back;
  }
  public setServer(url="https://natidja.app/")
  {
    this.api_url = url;
  }
  public postDataAlt(method, params, entetes: {} = this.entete): Observable<any>
  {
    // method = "/createClient/"
    // this.setTestServer()
    params.device = this.device;


    if(this.native)
    {
      // debugger
      console.log(this.api_url_alt+method, params, entetes);
      
      let backThen = this.http.post(this.api_url_alt+method, params, entetes);
      return from(backThen);
    }
    else
    {
      return this.httpClient.post(this.api_url_alt+method, params, {});
    }
  }
  public postData(method, params, entetes: {} = this.entete): Observable<any>
  {
    params.device = this.device;


    if(this.native)
    {
      let url = method != "bac/action.php" ? this.api_url : this.api_url_alt;
      let backThen = this.http.post(url+method, params, entetes);
      return from(backThen);
    }
    else
    {
      return this.httpClient.post(this.api_url+method, params, {});
    }
  }
  public postData2(method, params, entetes: {} = this.entete): Observable<any>
  {
    // method = "/createClient/"
    // this.setTestServer()
    params.device = this.device;

    if(this.native)
    {
      // debugger
      let backThen = this.http.post(this.api_url2+method, params, entetes);
      return from(backThen);
    }
    else
    {
      return this.httpClient.post(this.api_url2+method, params, {});
    }
  }

  putData(method, params, entetes: {} = this.entete): Observable<any> {
    params.device = this.device;
    
    if(this.native)
    {
      let backThen = this.http.put(this.api_url+method, params, entetes);
      return from(backThen);
    }
    else
    {
      return this.httpClient.put(this.api_url+method, params, {
        responseType: 'text',
        headers:entetes
      });
    }
  }
  deleteData(method, entetes: {} = this.entete) {
    if(this.native)
    {
      let backThen = this.http.delete(this.api_url+method,{}, entetes);
      return from(backThen);
    }
    else
    {
      return this.httpClient.delete(this.api_url+method, {
        responseType: 'text',
        headers:entetes
      });
    }
  }
}