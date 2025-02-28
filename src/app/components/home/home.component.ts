import { Component } from '@angular/core';

@Component({
  selector: 'app-home',
  standalone:false,
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent {

  testimonials = [
    {
      name: 'Carlos Herrera',
      review: 'FinanCartera me ha permitido organizar mis facturas de manera eficiente y sin complicaciones. Ahora tengo un control total sobre mis documentos y la rentabilidad de cada operación.',
      image: 'https://randomuser.me/api/portraits/men/45.jpg'
    },
    {
      name: 'Mariana López',
      review: 'La mejor herramienta para gestionar letras y facturas. Me encanta la función de reportes en tiempo real, ya que me permite tomar decisiones más acertadas sobre mis finanzas.',
      image: 'https://randomuser.me/api/portraits/women/32.jpg'
    },
    {
      name: 'Javier Morales',
      review: 'Antes llevaba mi cartera de letras de forma manual y siempre perdía tiempo en cálculos innecesarios. Ahora con FinanCartera todo es rápido, automático y seguro.',
      image: 'https://randomuser.me/api/portraits/men/20.jpg'
    },
    {
      name: 'Laura Fernández',
      review: 'Desde que uso FinanCartera, mi empresa ha optimizado sus procesos de gestión financiera. La herramienta de conversión de moneda me ahorra mucho trabajo y errores.',
      image: 'https://randomuser.me/api/portraits/women/45.jpg'
    }
  ];

  currentIndex = 0;

  // Ir a un testimonio específico
  goToTestimonial(index: number) {
    this.currentIndex = index;
  }

  // Cambio automático de testimonio cada 5 segundos
  ngOnInit() {
    setInterval(() => {
      this.currentIndex = (this.currentIndex + 1) % this.testimonials.length;
    }, 5000);
  }

}
