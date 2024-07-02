import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class ScraperService {

    private apiUrl = 'http://192.168.1.12:5000/scrape';

    constructor(private http: HttpClient) { }

    scrapeShow(searchId: string): Observable<any> {
        return this.http.post<any>(this.apiUrl, { searchId });
    }
}
