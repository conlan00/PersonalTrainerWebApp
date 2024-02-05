import { Component } from '@angular/core';
import { CarouselModule } from 'ngx-bootstrap/carousel';
@Component({
  selector: 'app-about',
  templateUrl: './about.component.html',
  styleUrl: './about.component.css'
})
export class AboutComponent {
  itemsPerSlide = 5;
  singleSlideOffset = false;
  noWrap = false;

  slidesChangeMessage = '';

  slides = [
    { image: 'assets/123.jpg' },
    { image: 'assets/1234.jpg' },
    { image: 'assets/12345.jpg' },
    { image: 'assets/123456.jpg' },
    { image: 'assets/1234567.jpg' },
    { image: 'assets/1234567.jpg' },
    { image: 'assets/123.jpg' },
    { image: 'assets/1234.jpg' },
    { image: 'assets/123456.jpg' },
    { image: 'assets/12345.jpg' },
  ];
  onSlideRangeChange(indexes: number[] | void): void {
    this.slidesChangeMessage = `Slides have been switched: ${indexes}`;
  }
}
