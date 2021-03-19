import { Pipe, PipeTransform } from '@angular/core';
import * as moment from 'moment';

@Pipe({
  name: 'moment'
})
export class MomentPipe implements PipeTransform {

  transform(date, format="", ...args: unknown[]): unknown {
    moment.locale('fr')
    var startdate = moment(date);
    if(format == "")
      return startdate.add(moment.duration(3, 'hours')).fromNow();
    else
      return moment(date).calendar().replace(" à 00:00:00", "").replace(" à 00:00", "");
  }

}
