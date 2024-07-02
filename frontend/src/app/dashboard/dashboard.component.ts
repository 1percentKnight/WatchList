import { Component, ElementRef, EventEmitter, Output, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ScraperService } from '../services/python.service';
import { dbConnectionService } from '../services/dbConnection.service';

@Component({
    selector: 'app-dashboard',
    templateUrl: './dashboard.component.html',
    styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent {
    @Output() dataEmitter = new EventEmitter<string>();
    @Output() isDivOpen = new EventEmitter<boolean>();


    dropdownOptions: any[] = [
        { id: 1, value: ":Search Page" },
        { id: 2, value: ":Add Entry" },
        { id: 3, value: ":Add To DB" }
    ];

    formGroup: FormGroup;
    showData: any = null;
    caValue: string = "";
    searchValue: string = "";

    constructor(private scraperService: ScraperService, private showService: dbConnectionService, private fb: FormBuilder) {
        this.formGroup = this.fb.group({
            selectedOption: new FormControl(this.dropdownOptions[0].id.toString()),
            searchValue: new FormControl('', [Validators.required])
        });
    }

    ngOnInit() {
        // this.tempRunner();
    }

    tempRunner() {
        this.showService.getShowByShowId("tt1375666").subscribe(
            data => {
                this.showData = data;
            },
            error => {
                console.error('Error fetching show:', error);
            }
        );
    }

    submitForm() {
        if (this.formGroup.valid) {
            this.searchValue = this.formGroup.get('searchValue')?.value;

            switch (this.formGroup.get('selectedOption')?.value.toString()) {
                case '1':
                    this.searchPage();
                    break;
                case '2':
                    this.addShowforUser();
                    break;
                case '3':
                    this.scrapeShow();
                    break;
                default:
                    console.log("Unhandled selection option");
            }
        } else {
            console.error('Form is invalid!');
        }
    }

    searchPage() {
        console.log("Search Page Logic");
    }

    addShowforUser() {
        console.log("Add Entry Logic");
        
    }

    scrapeShow() {
        if (!this.searchValue) {
            console.error('IMDb ID is required.');
            return;
        }

        this.caValue = "Searching, please wait...";
        this.sendData();

        this.scraperService.scrapeShow(this.searchValue).subscribe(
            data => {
                this.showData = data;
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
        const showWithId = { ...this.showData, id: this.searchValue };

        this.showService.addShowtoDB(showWithId).subscribe(
            response => {
                console.log(response);
                alert('Show added to the database');
            },
            error => {
                console.error('Error adding show:', error);
                alert('Failed to add show since the ID already exists!');
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
}
