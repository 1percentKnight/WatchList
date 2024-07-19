import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { allShow, userShow } from '../models/Show';

@Injectable({
    providedIn: 'root'
})
export class dbConnectionService {
    private apiUrl = 'http://192.168.1.12:3000/dBCon';

    constructor(private http: HttpClient) { }

    addUser(user: any): Observable<any> {
        return this.http.post<any>(`${this.apiUrl}/signUp`, user);
    }

    addShowtoDB(show: any): Observable<any> {
        return this.http.post<any>(`${this.apiUrl}/shows`, show);
    }

    getAllShows(): Observable<allShow[]> {
        return this.http.get<allShow[]>(`${this.apiUrl}/shows`);
    }

    getShowByShowId(showId: string): Observable<allShow> {
        return this.http.get<allShow>(`${this.apiUrl}/shows/${showId}`);
    }    

    scrapeShow(searchId: string): Observable<any> {
        return this.http.post<any>(`${this.apiUrl}/search`, { searchId });
    }

    // updateUser(userId: number, userData: any): Observable<any> {
    //     return this.http.put<any>(`${this.apiUrl}/users/${userId}`, userData);
    // }

    // deleteUser(userId: number): Observable<any> {
    //     return this.http.delete<any>(`${this.apiUrl}/users/${userId}`);
    // }

    // updateShow(showId: string, showData: any): Observable<any> {
    //     return this.http.put<any>(`${this.apiUrl}/shows/${showId}`, showData);
    // }

    // deleteShow(showId: string): Observable<any> {
    //     return this.http.delete<any>(`${this.apiUrl}/shows/${showId}`);
    // }
}
