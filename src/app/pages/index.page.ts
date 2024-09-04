import { Component, inject } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { dataService } from '../data.service';
import {MatFormFieldModule} from '@angular/material/form-field';

@Component({
  selector: 'app-home',
  standalone: true,
  providers: [Router],
  template: `
    <h1>Video SDK with Angular + Analogjs</h1>

    <div class="card">
      <input placeholder="session name here" (input)="updateName($event)" />
    </div>
    <div>
    <button type="button" (click)="createSession()">Create Session</button>
    </div>
  
  `,
  imports: [                                                                                                                                                
    ReactiveFormsModule
  ],
})
export default class HomeComponent {
  //save input as slug name
  dataService = inject(dataService);
  sessionName = this.dataService.sessionName;
  router: Router = inject(Router)

  createSession() {
    console.log(this.sessionName());
    this.router.navigate(['Call', this.sessionName()])
    
  }
  
  updateName(e: Event) {
    this.sessionName.set((e.target as HTMLInputElement).value)
  }
}   
