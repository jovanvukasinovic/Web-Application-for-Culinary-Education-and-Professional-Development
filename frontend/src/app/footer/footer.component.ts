import { Component, HostListener } from '@angular/core';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.css'],
})
export class FooterComponent {
  @HostListener('window:scroll', [])
  onWindowScroll(): void {
    const footer = document.querySelector('footer');
    if (footer) {
      const scrolledToBottom =
        window.innerHeight + window.scrollY >= document.body.offsetHeight;
      if (scrolledToBottom) {
        footer.classList.add('visible');
      } else {
        footer.classList.remove('visible');
      }
    }
  }
}
