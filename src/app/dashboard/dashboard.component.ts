import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    const token = localStorage.getItem('token');
    if (token) {
      this.http.get('https://tu-backend.com/dashboard', {
        headers: { Authorization: `Bearer ${token}` }
      }).subscribe(
        data => console.log('Dashboard data:', data),
        error => console.error('Error en Dashboard:', error)
      );
    } else {
      console.error('No hay token almacenado.');
    }
  }
}
