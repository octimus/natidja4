import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'money'
})
export class MoneyPipe implements PipeTransform {

  transform(value: number, ...args: unknown[]): number {
    let money: number = Math.round(value);
    let reste: number = money % 25;
    if(reste != 0){
      money = money - reste;
    }

    return money;

  }

}
