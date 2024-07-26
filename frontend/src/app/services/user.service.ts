import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { userShow } from '../models/Show';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor() { }

  private apiUrl = "http://192.168.1.12:3000/dbCon";
  http = inject(HttpClient);

  authToken = localStorage.getItem('authToken');

  getUserData(): Observable<userShow[]> {
    return this.http.get<userShow[]>(`${this.apiUrl}/user`, {
      headers: { Authorization: `Bearer ${this.authToken}` }
    });
  }

  getRandomUserShow(): Observable<userShow[]> {
    return this.http.get<userShow[]>(`${this.apiUrl}/randomShow`, {
      headers: { Authorization: `Bearer ${this.authToken}` }
    });
  }

  addShowforUser(showId: string): Observable<any> {
    const body = { showId };
    return this.http.post<any>(`${this.apiUrl}/user`, body, {
      headers: { Authorization: `Bearer ${this.authToken}` }
    });
  }
}
