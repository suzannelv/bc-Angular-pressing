import { Component, HostListener } from '@angular/core';

@Component({
  selector: 'app-back-to-top',
  templateUrl: './back-to-top.component.html',
  styleUrl: './back-to-top.component.css',
})
export class BackToTopComponent {
  buttonToTop: HTMLElement | null = null;

  constructor() {}

  ngOnInit(): void {
    this.buttonToTop = document.getElementById('btn-back-to-top');
  }

  @HostListener('window:scroll', ['$event'])
  scrollFunction() {
    if (this.buttonToTop) {
      if (document.documentElement.scrollTop > 20) {
        this.buttonToTop.style.display = 'block';
      } else {
        this.buttonToTop.style.display = 'none';
      }
    }
  }

  backToTop() {
    document.documentElement.scrollTop = 0;
  }
}
