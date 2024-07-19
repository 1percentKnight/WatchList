import { Component, inject, OnInit } from '@angular/core';
import { allShow } from '../../models/Show';
import { dbConnectionService } from '../../services/dbConnection.service';

@Component({
  selector: 'app-explore',
  templateUrl: './explore.component.html',
  styleUrl: './explore.component.css'
})
export class ExploreComponent implements OnInit {
  allShows: allShow[] = [];

  eShows: allShow[] = [];
  hShows: allShow[] = [];
  jShows: allShow[] = [];
  miscShows: allShow[] = [];

  dbConnection = inject(dbConnectionService)

  ngOnInit() {
    this.dbConnection.getAllShows().subscribe(
      result => {
        this.allShows = result;
        this.filterShowsByLanguage();
      },
      error => {
        console.log("Error fetching shows again. ", error);
      }
    );
  }

  filterShowsByLanguage() {
    this.eShows = this.allShows.filter(show => show.languages?.[0] === "English");
    this.hShows = this.allShows.filter(show => show.languages?.[0] === "Hindi");
    this.jShows = this.allShows.filter(show => show.languages?.[0] === "Japanese");
    this.miscShows = this.allShows.filter(show => {
      const firstLanguage = show.languages?.[0] || "";
      return !["English", "Hindi", "Japanese"].includes(firstLanguage);
  });
  }
}
