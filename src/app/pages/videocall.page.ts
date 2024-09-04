import { Component, signal, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import ZoomVideo, { VideoQuality, type VideoPlayer } from '@zoom/videosdk';
import HomeComponent from './index.page';
import { NgIf } from '@angular/common';
import pageComponent from './Call/[slug].page';
import { dataService } from '../data.service';
import { getToken } from '../../server/routes/v1/getData';

@Component({
  selector: 'app-videocall',
  standalone: true,
  template: `
  <h2>Session: {{sessionName()}} </h2>
  <div id='sessionContainer'></div>
  
  <div>
  <button *ngIf="inSession()" (click)="leaveSession()">Leave Session</button> 
  <button *ngIf="!inSession()" (click)="joinSession()">Join Session</button> 

  <button *ngIf="inSession() && !isVideoMuted()" (click)="onCameraClick()">Turn off Camera</button>
  <button *ngIf="inSession() && isVideoMuted()" (click)="onCameraClick()">Turn on Camera</button>
  <lucide-icon name="camera"></lucide-icon>
  <button *ngIf="inSession() && !isAudioMuted()" (click)="onMicrophoneClick()">Mute</button>
  <button *ngIf="inSession() && isAudioMuted()" (click)="onMicrophoneClick()">Unmute</button>

  </div>
  `,
  imports: [NgIf],
  providers: [HomeComponent, pageComponent, getToken]

})
export default class VideoCallPageComponent {
  dataService = inject(dataService);
  sessionName = this.dataService.sessionName;
  jwt = this.dataService.jwt;
  role = this.dataService.role
  generateSignature = inject(getToken).generateSignature;

  sessionContainer: any;
  client = ZoomVideo.createClient();
  inSession = signal(false);
  isVideoMuted = signal(!this.client.getCurrentUserInfo()?.bVideoOn);
  isAudioMuted = signal(this.client.getCurrentUserInfo()?.muted ?? true);

  constructor(public httpClient: HttpClient) {};

  async joinSession() {
    console.log('joining session', import.meta.env['VITE_ZOOM_SDK_KEY'])
    this.sessionContainer = document.getElementById('sessionContainer');
    this.jwt.set(this.generateSignature(this.sessionName(), 1))
    
    console.log(this.sessionName(), ',', this.jwt(), ',', this.userName);

    await this.client.init("en-US", "Global", { patchJsMedia: true });
    this.client.on("peer-video-state-change", (payload) => void this.renderVideo(payload));
    //change topic on backend to be passed through username
    await this.client.join(this.sessionName(), this.jwt(), this.userName).catch((e) => {
      console.log('error here', e)
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

  async onCameraClick() {
    const mediaStream = this.client.getMediaStream();
    if (this.isVideoMuted()) {
      await mediaStream.startVideo();
      this.isVideoMuted.set(false);
      await this.renderVideo({
        action: "Start", 
        userId: this.client.getCurrentUserInfo().userId
      });
    } else {
      await mediaStream.stopVideo();
      this.isVideoMuted.set(true);
      await this.renderVideo({
        action: "Stop", 
        userId: this.client.getCurrentUserInfo().userId
      });
    }
  }

  async onMicrophoneClick() {
    const mediaStream = this.client.getMediaStream();
    this.isAudioMuted() ? await mediaStream?.unmuteAudio() : await mediaStream?.muteAudio();
    this.isAudioMuted.set(this.client.getCurrentUserInfo().muted ?? true)
  };

  userName = `User-${new Date().getTime().toString().slice(8)}`;
}   
