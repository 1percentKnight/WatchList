import { Component, EventEmitter, Output } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { dbConnectionService } from '../../services/dbConnection.service';
import { Router } from '@angular/router';

@Component({
    selector: 'app-dashboard',
    templateUrl: './dashboard.component.html',
    styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent {
    @Output() dataEmitter = new EventEmitter<string>();
    @Output() isDivOpen = new EventEmitter<boolean>();


    dropdownOptions: any[] = [
        { id: 1, value: ":Search" },
        { id: 3, value: ":Add To DB" }
    ];

    formGroup: FormGroup;
    showData: any = null;
    caValue: string = "";
    searchValue: string = "";

    constructor(private dbConnectionService: dbConnectionService, private fb: FormBuilder, private router: Router) {
        this.formGroup = this.fb.group({
            selectedOption: new FormControl(this.dropdownOptions[0].id.toString()),
            searchValue: new FormControl('', [Validators.required])
        });
    }

    ngOnInit() {
        // this.tempRunner();
    }

    tempRunner() {
        this.dbConnectionService.getShowByShowId("tt1375666").subscribe(
            data => {
                this.showData = data;
            },
            error => {
                console.error('Error fetching show:', error);
            }
        );
    }

    searchPage() {
        console.log("Search Page Logic");
    }
    scrapeInput = "";
    scrapeShow() {
        this.caValue = "Searching, please wait...";
        this.sendData();

        this.searchValue = this.searchValue.replaceAll(" ", "%20").toLowerCase();
        this.dbConnectionService.scrapeShow(this.scrapeInput).subscribe(
            data => {
                this.showData = data;
                console.log("Received showData:", this.showData);
                this.isDivOpen.emit(true);
                this.caValue = "";
                this.sendData();
                console.log("Found show with the ID: " + this.searchValue)
            },
            error => {
                console.error('Error:', error);
                this.caValue = "Failed to fetch!";
                setTimeout(() => {
                    this.sendData();
                }, 800);
            }
        );
    }

    addShowtoDB() {
        this.dbConnectionService.addShowtoDB(this.showData).subscribe(
            response => {
                console.log(response);
                alert('Show added to the database');
            },
            error => {
                console.error('Error adding show:', error);
                alert('Failed to add show, check if the ID already exists!');
            }
        );
    }

    sendData() {
        this.dataEmitter.emit(this.caValue);
    }

    closeAddDB() {
        this.showData = null;
        this.isDivOpen.emit(false);
    }

    menuOpen = false;
    toggleMenu() {
        this.menuOpen = !this.menuOpen;
    }

    logout() {
        localStorage.removeItem('authToken');
        this.router.navigateByUrl('/login');
    }
}
