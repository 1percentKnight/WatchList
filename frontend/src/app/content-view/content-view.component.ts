import { Component, Input, OnInit, SimpleChanges, viewChildren } from '@angular/core';
import { allShow, userShow } from '../models/Show';
import { dbConnectionService } from '../services/dbConnection.service';

@Component({
    selector: 'app-content-view',
    templateUrl: './content-view.component.html',
    styleUrl: './content-view.component.css'
})
export class ContentViewComponent implements OnInit {

    userShows: any[] = [];
    constructor(private showService: dbConnectionService) {
    }

    ngOnInit(): void {
        this.showService.getShowsByUserId(this.userId).subscribe(
            shows => {
                this.userShows = shows;
                // console.log(this.allShows);
            },
            error => console.error("Error fetching all shows", error)
        );
    }

    contentStyles: { [key: string]: string } = {};
    @Input() isDivOpen?: boolean;
    ngOnChanges(changes: SimpleChanges) {
        if (changes['isDivOpen']) {
            console.log("Is search div open: " + this.isDivOpen);
            this.updateStyles();
        }
    }
    updateStyles() {
        this.contentStyles = this.isDivOpen ? {
            'margin-top': '-345px'
        } : {
            'margin-top': '0'
        };
    }

    userId: number = 1;
}