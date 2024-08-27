import { Component, HostListener, AfterViewInit } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent implements AfterViewInit {
  ngAfterViewInit() {
    this.checkFooterVisibility();
  }

  @HostListener('window:scroll', [])
  onWindowScroll() {
    this.checkFooterVisibility();
  }

  checkFooterVisibility() {
    const footer = document.querySelector('footer');
    if (footer) {
      const windowHeight = window.innerHeight;
      const bodyHeight = document.body.offsetHeight;

      // Provera da li postoji skrol
      if (
        bodyHeight <= windowHeight ||
        window.innerHeight + window.scrollY >= bodyHeight
      ) {
        footer.classList.add('visible');
      } else {
        footer.classList.remove('visible');
      }
    }
  }
}
