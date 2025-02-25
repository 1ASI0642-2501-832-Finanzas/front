import { Component } from '@angular/core';
import { AuthService } from '../auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
  standalone: false
})
export class LoginComponent {
  email = '';
  password = '';

  constructor(private authService: AuthService, private router: Router) {}

  onSubmit() {
  this.authService.login({ email: this.email, password: this.password }).subscribe({
    next: (response) => {
      if (response.token) {
        localStorage.setItem('token', response.token);
        console.log("Login successful, token:", response.token);

        this.router.navigate(['/dashboard']).then(success => {
          if (success) {
            console.log("Navigation complete");
          } else {
            console.error("Navigation failed");
          }
        });
      } else {
        console.error("No token received in response");
      }
    },
    error: (error) => {
      console.error("Login failed:", error);
    }
  });
  }
}
