import { Component, signal, Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})

export class dataService {
  sessionName = signal('session name here');
  jwt = signal('');
  role = signal(1);
}