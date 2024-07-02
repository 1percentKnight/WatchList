import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  caValue: string = "";
  isDivOpen: boolean = false;

  receivedData(data: string | boolean) {
    if(typeof(data) == 'string') {
      this.caValue = data;
    } else if(typeof(data) == 'boolean') {
      this.isDivOpen = data;
    }
  }


}
