import { Component, signal, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import ZoomVideo, { VideoQuality, type VideoPlayer } from '@zoom/videosdk';
import HomeComponent from './index.page';
// import { load } from '../../server/routes/v1/getToken.server';

@Component({
  selector: 'app-VideoCall',
  standalone: true,
  template: `
  <div>hello</div>
  <button>
  <button type="button" (click)="getVideoSDKJWT()">Join Session</button>
  `,
  styles: [

  ],
  // imports: [HomeComponent], 
  providers: [HomeComponent]

})
export default class VideoCallPageComponent {
  sessionContainer: any;
  authEndpoint = ''
  
  readonly sessionName = inject(HomeComponent).sessionName;
  jwt = ''
  client = ZoomVideo.createClient();
  inSession = signal(false);
  isVideoMuted = signal(!this.client.getCurrentUserInfo()?.bVideoOn);
  isAudioMuted = signal(this.client.getCurrentUserInfo()?.muted ?? true);

  constructor(public httpClient: HttpClient) {

  }

  getVideoSDKJWT() {
    this.sessionContainer = document.getElementById('sessionContainer')    
    this.httpClient.post('api/v1/getToken', {
	    sessionName: this.sessionName(),
      role: 1,
    }, {responseType: 'text'}).subscribe((data: any) => {
      if(data.jwt) {
        console.log(data.jwt)
        this.jwt = data.signature
        this.joinSession()
      } else {
        console.log(data)
      }
    })
  }

  async joinSession() {
    await this.client.init("en-US", "Global", { patchJsMedia: true });
    this.client.on("peer-video-state-change", (payload) => void this.renderVideo(payload));
    await this.client.join(this.sessionName(), this.jwt, this.userName).catch((e) => {
      console.log(e)
    })
    this.inSession.set(true)
    const mediaStream = this.client.getMediaStream();
    //add back in safari specific workarounds  
    await mediaStream.startAudio();
    this.isAudioMuted.set(this.client.getCurrentUserInfo().muted ?? true);
    await mediaStream.startVideo();
    this.isVideoMuted.set(!this.client.getCurrentUserInfo().bVideoOn);
    await this.renderVideo({action: 'Start', userId: this.client.getCurrentUserInfo().userId})
  }


  async leaveSession(){
    this.client.off('peer-video-state-change',
    (payload: {action: "Start" | "Stop"; userId: number}) => 
    void this.renderVideo(payload)
    );
    await this.client.leave().catch((e) => console.log('leave error', e))
    window.location.href ='/'
  }

  async renderVideo(event: {action: "Start" | "Stop"; userId: number}){
    const mediaStream = this.client.getMediaStream();
    if (event.action === "Stop") {
      const element = await mediaStream.detachVideo(event.userId);
      Array.isArray(element) ? element.forEach((el) => el.remove()) : 
      element.remove();
    } else {
      const userVideo = await mediaStream.attachVideo(event.userId, VideoQuality.Video_360P);
      this.sessionContainer.appendChild(userVideo as VideoPlayer);
    };
   
  }

  userName = `User-${new Date().getTime().toString().slice(8)}`;
}   
