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

  getUserData(): Observable<userShow[]> {
    const authToken = localStorage.getItem('authToken');
    return this.http.get<userShow[]>(`${this.apiUrl}/user`, {
      headers: { Authorization: `Bearer ${authToken}` }
    });
  }
}
