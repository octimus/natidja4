import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class EventLoggerService {

  constructor() {
    console.log('Hello EventLoggerProvider Provider');
  }
 
  logButton(name:string,value:any){
    // this.fba.logEvent(name, { pram:value })
    // .then((res: any) => {console.log(res);})
    // .catch((error: any) => console.error(error));
  }
}
