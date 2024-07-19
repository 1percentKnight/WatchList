import { Component, Input, OnInit, SimpleChanges, viewChildren } from '@angular/core';
import { allShow, userShow } from '../../models/Show';
import { dbConnectionService } from '../../services/dbConnection.service';
import { UserService } from '../../services/user.service';

@Component({
    selector: 'app-content-view',
    templateUrl: './content-view.component.html',
    styleUrl: './content-view.component.css'
})
export class ContentViewComponent implements OnInit {

    userShows: any[] = [];
    constructor(private userService: UserService) {
    }

    ngOnInit(): void {
        this.userService.getUserData().subscribe(
            shows => {
                this.userShows = shows;
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
}