import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  router = inject(Router);
  http = inject(HttpClient);

  private apiUrl = 'http://192.168.1.12:3000/dBCon';

  login(loginData: any): Observable<any> {
    console.log("Received login data in auth service:", loginData);
    return this.http.post<any>(`${this.apiUrl}/login`, loginData);
  }

  getToken(): string | null {
    if (typeof localStorage !== 'undefined') {
      return localStorage.getItem('authToken');
    }
    return null;
  }

  isLoggedIn(): boolean {
    return !!this.getToken();
  }

  logout() {
    localStorage.removeItem('authToken');
    this.router.navigateByUrl('/login');
  }
}
