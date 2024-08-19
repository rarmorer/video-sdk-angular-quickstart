import { Component, signal, Input } from '@angular/core';
import ZoomVideo from '@zoom/videosdk';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-home',
  standalone: true,
  template: `
    <h2>Video SDK with Angular + Analogjs</h2>

    <div class="card">
      <input [value]="sessionName()" (input)="updateName($event)" />
      <button type="button" (click)="createSession()">Join Session</button>
    </div>
  
  `,
  imports: [                                                                                                                                                
    ReactiveFormsModule
  ],
  styles: [
    `
      .logo {
        will-change: filter;
      }
      .logo:hover {
        filter: drop-shadow(0 0 2em #646cffaa);
      }
      .read-the-docs {
        color: #888;
      }
    `,
  ],
})
export default class HomeComponent {
  //save input as slug name
  sessionName = signal('session name here');

  createSession() {
    //navigate to [slug].page.ts
    console.log(this.sessionName())
  }
  
  updateName(e: Event) {
    this.sessionName.set((e.target as HTMLInputElement).value)
  }
}   
