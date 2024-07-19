import { Component } from '@angular/core';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent {
  caValue: string = "";
  isDivOpen: boolean = false;

  receivedData(data: string | boolean) {
    if (typeof data === 'string') {
      console.log("Received string data: ", data);
      this.caValue = data;
    } else if (typeof data === 'boolean') {
      console.log("Received boolean data: ", data);
      this.isDivOpen = data;
    }
  }
}
