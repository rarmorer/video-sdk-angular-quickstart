import { Component, inject, signal } from "@angular/core";
import ZoomVideo from '@zoom/videosdk';
import VideoCallPageComponent from "../videocall.page";
import HomeComponent from "../index.page";
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-page',
  standalone: true,
  imports: [VideoCallPageComponent],
  template: `@defer {<app-videocall/>}`,
  styles: [``],
  providers: [HomeComponent], 
  
  //lazy load videocompnent by bringing into imoprts and using defer method
})
export default class pageComponent {

}