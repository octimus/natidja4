import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-file-component',
  templateUrl: './file-component.component.html',
  styleUrls: ['./file-component.component.scss'],
})
export class FileComponentComponent implements OnInit {
  @Input() src: string;
  @Input() alt: string;
  @Input() scheme: string;
  @Input() title: string;
  @Input() poster: string;
  @Input() controls: boolean = true;
  constructor() { }

  ngOnInit() {
  }
  picOrVid(url: string): string{
    let type;
    let tab = url.split(".");
    const ext = tab[tab.length - 1];
    const videoExtensions: string [] = ["mp4", "avi", "mpg4", "webml", "mpeg"];
    const pictureExtensions: string [] = ["png", "jpg", "jpeg", "bmp"];
    const audioExtensions: string [] = ["mp3", "wav", "wma", "ogg", "acc"];
    // console.log({ext:ext});
    
    if(videoExtensions.indexOf(ext.toLowerCase()) >= 0)
      type = "video";
    else if(pictureExtensions.indexOf(ext.toLowerCase()) >= 0)
      type = "picture";
    else if(audioExtensions.indexOf(ext.toLowerCase()) >= 0)
      type = "audio";
    else
      type = "document";
    
    return type;
  }
}
