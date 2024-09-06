import { Component } from "@angular/core";
import VideoCallPageComponent from "../videocall.page";

@Component({
  selector: 'app-page',
  standalone: true,
  imports: [VideoCallPageComponent],
  template: `@defer {<app-videocall/>}`,
})
export default class pageComponent {

}