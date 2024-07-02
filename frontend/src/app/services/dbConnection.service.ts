import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { allShow, userShow } from '../models/Show';

@Injectable({
    providedIn: 'root'
})
export class dbConnectionService {
    private apiUrl = 'http://192.168.1.12:3000/dBCon';

    constructor(private httpClient: HttpClient) { }

    addUser(user: any): Observable<any> {
        return this.httpClient.post<any>(`${this.apiUrl}/users`, user);
    }

    addShowtoDB(show: any): Observable<any> {
        return this.httpClient.post<any>(`${this.apiUrl}/shows`, show);
    }

    getAllShows(): Observable<allShow[]> {
        return this.httpClient.get<allShow[]>(`${this.apiUrl}/shows`);
    }

    getShowByShowId(showId: string): Observable<allShow> {
        return this.httpClient.get<allShow>(`${this.apiUrl}/shows/${showId}`);
    }

    getShowsByUserId(userId: number): Observable<userShow[]> {
        return this.httpClient.get<userShow[]>(`${this.apiUrl}/users/${userId}`);
    }

    // updateUser(userId: number, userData: any): Observable<any> {
    //     return this.httpClient.put<any>(`${this.apiUrl}/users/${userId}`, userData);
    // }

    // deleteUser(userId: number): Observable<any> {
    //     return this.httpClient.delete<any>(`${this.apiUrl}/users/${userId}`);
    // }

    // updateShow(showId: string, showData: any): Observable<any> {
    //     return this.httpClient.put<any>(`${this.apiUrl}/shows/${showId}`, showData);
    // }

    // deleteShow(showId: string): Observable<any> {
    //     return this.httpClient.delete<any>(`${this.apiUrl}/shows/${showId}`);
    // }
}
