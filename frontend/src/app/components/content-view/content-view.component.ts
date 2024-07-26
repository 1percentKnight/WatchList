import { Component, OnInit, OnDestroy } from '@angular/core';
import { UserService } from '../../services/user.service';

@Component({
    selector: 'app-content-view',
    templateUrl: './content-view.component.html',
    styleUrls: ['./content-view.component.css']
})
export class ContentViewComponent implements OnInit, OnDestroy {

    randShows: any[] = [];
    currentIndex = 0;
    currentImageUrl: string = ''; // Holds the URL of the current image
    private intervalId: any;
  
    constructor(private userService: UserService) { }
  
    ngOnInit(): void {
      this.userService.getRandomUserShow().subscribe(
        shows => {
          this.randShows = shows;
          if (this.randShows.length > 0) {
            this.currentImageUrl = this.randShows[this.currentIndex]?.poster_url;
            this.startImageRotation();
          }
        },
        error => console.error("Error fetching shows", error)
      );
    }
  
    ngOnDestroy(): void {
      if (this.intervalId) {
        clearInterval(this.intervalId);
      }
    }
  
    startImageRotation(): void {
      if (this.intervalId) {
        clearInterval(this.intervalId);
      }
  
      this.intervalId = setInterval(() => {
        this.changeImage('next');
      }, 10000); // Interval time (10 seconds)
    }
  
    changeImage(direction: 'next' | 'prev' | 'still'): void {
      const backgroundElement = document.getElementById('background');
      if (backgroundElement) {
        backgroundElement.classList.add('fade-out');
        setTimeout(() => {
          if (direction === 'next') {
            this.currentIndex = (this.currentIndex + 1) % this.randShows.length;
          } else if (direction === 'prev') {
            this.currentIndex = (this.currentIndex - 1 + this.randShows.length) % this.randShows.length;
          } else if (direction === 'still') {
            this.currentIndex = this.posterIndex;
          }
          this.currentImageUrl = this.randShows[this.currentIndex]?.poster_url;
          backgroundElement.classList.remove('fade-out');
          
          // Restart the rotation timer
          this.startImageRotation();
        }, 500); // Fade duration (0.5 seconds)
      }
    }
  
    reverseImage(): void {
      this.changeImage('prev');
    }

    posterIndex: number = -1;
    onImageClick(posterIndex: number): void {
    this.posterIndex = posterIndex;

      this.changeImage('still');
    }
  }