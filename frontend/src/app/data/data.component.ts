import { Component, OnInit } from '@angular/core';
import { DataService } from '../services/data.service';

@Component({
  selector: 'app-data',
  templateUrl: './data.component.html',
  styleUrls: ['./data.component.css']
})
export class DataComponent implements OnInit {
  userData: any;

  constructor(private dataService: DataService) { }

  ngOnInit(): void {
    this.dataService.getUserData().subscribe(
      data => {
        this.userData = data;
        console.log(this.userData);
      },
      error => {
        console.error('Error fetching user data:', error);
      }
    );
  }
}
