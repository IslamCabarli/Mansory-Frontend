import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-loading-screen',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './loading-screen.component.html',
  styleUrl: './loading-screen.component.scss'
})
export class LoadingScreenComponent implements OnInit {
  isVisible = signal(true);

  ngOnInit(): void {
   
    setTimeout(() => {
      this.isVisible.set(false);
    }, 3000);
  }
}