import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DataService {
  //private dataSubject = new Subject<{ time: string, value: number }>();

  //constructor() {
    //this.simulateData();
  //}

  getData(key: string): any {
    const data = localStorage.getItem(key);
    return data ? JSON.parse(data) : null;
  }

  saveData(key: string, data: any): void {
    localStorage.setItem(key, JSON.stringify(data));
  }

  /*private simulateData(): void {
    setInterval(() => {
      const time = new Date().toISOString();
      const value = Math.floor(Math.random() * (12000 - 4000 + 1)) + 4000;
      this.dataSubject.next({ time, value });
    }, 5000); // Enviar datos cada 5 segundos
  }*/
}
