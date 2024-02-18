import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-welcome',
  templateUrl: './welcome.component.html',
  styleUrl: './welcome.component.css',
})
export class WelcomeComponent implements OnInit {
  username?: string;
  counter = 5;

  constructor(private route: ActivatedRoute, private router: Router) {}

  ngOnInit(): void {
    this.route.params.subscribe((params) => {
      this.username = params['username'];
      const interval = setInterval(() => {
        this.counter--;
        if (this.counter === 0) {
          clearInterval(interval);
          this.navigateHome();
        }
      }, 1000);
    });
  }

  navigateHome() {
    this.router.navigate(['/']);
  }

  // goToHomePage() {
  //   this.router.navigate(['/']);
  //   console.log('lick');
  // }
}
