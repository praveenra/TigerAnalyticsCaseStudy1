import { Component, signal, OnInit } from '@angular/core';
import { RouterOutlet, Router } from '@angular/router';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-root',
  templateUrl: './app.html',
  styleUrls: ['./app.css'],
  standalone: true,
  imports: [RouterOutlet, ReactiveFormsModule, FormsModule, CommonModule]
})
export class App implements OnInit {  // implement OnInit
  protected readonly title = signal('Retail Pricing App');

  constructor(private router: Router) {} // inject Router, not RouterOutlet

  ngOnInit() {
    const isLoggedIn = document.cookie.includes('access_token'); // check JWT cookie
    if (isLoggedIn && this.router.url === '/') {
      this.router.navigate(['/dashboard']); // redirect to dashboard
    }
  }
}
