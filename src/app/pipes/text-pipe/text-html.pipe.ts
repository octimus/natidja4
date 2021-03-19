import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'textHtml'
})
export class TextHtmlPipe implements PipeTransform {
  transform(text: string, ...args: string[]): string {
    text = text.replace('\n', '<br/>');
    // Put the URL to variable $1 after visiting the URL
    var Rexp =  /((http|https|ftp):\/\/[\w?=&.\/-;#~%-]+(?![\w\s?&.\/;#~%"=-]*>))/g; 
    // Replac the RegExp content by HTML element
    return text.replace(Rexp, "<a href='$1' target='_blank'>$1</a>");
  }

}
