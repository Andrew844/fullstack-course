import { AfterViewInit, Component, ElementRef, ViewChild } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { MaterialService } from '../../services/material.service';

@Component({
  selector: 'app-site-layout',
  templateUrl: './site-layout.component.html',
  styleUrls: ['./site-layout.component.scss'],
})
export class SiteLayoutComponent implements AfterViewInit {
  @ViewChild('floating') floatingRef: ElementRef;

  links = [
    { url: '/overview', title: 'Обзор' },
    { url: '/analytics', title: 'Аналитика' },
    { url: '/history', title: 'История' },
    { url: '/order', title: 'Добавить заказ' },
    { url: '/categories', title: 'Ассортимент' },
  ];

  constructor(private authService: AuthService, private router: Router) {}

  logout(e: Event): void {
    e.preventDefault();
    this.authService.logout();
    this.router.navigateByUrl('/');
  }

  ngAfterViewInit(): void {
    MaterialService.initializeFloatingBtn(this.floatingRef);
  }
}
