import { Component, OnInit, AfterViewInit, ViewChild, ElementRef } from '@angular/core';
import { RouterOutlet, RouterLink, Router } from '@angular/router';
import { NgFor } from '@angular/common';
import { AuthService } from '../services/auth.service';
import { MaterialService } from '../../classes/material.service';

interface Link {
  url: string;
  name: string;
}

@Component({
  selector: 'app-site-layout',
  standalone: true,
  imports: [RouterOutlet, RouterLink, NgFor],
  templateUrl: './site-layout.html',
  styleUrl: './site-layout.css',
})
export class SiteLayout implements OnInit, AfterViewInit {

  @ViewChild('floating') floatingRef!: ElementRef;

  links: Link[] = [];
  ngOnInit(): void {
    this.links = [
      { url: '/overview', name: 'Обзор' },
      { url: '/analytics', name: 'Аналитика' },
      { url: '/history', name: 'История' },
      { url: '/order', name: 'Добавить заказ' },
      { url: '/categories', name: 'Ассортимент' }
    ];
  }

  ngAfterViewInit() {
    MaterialService.initializeFloatingButton(this.floatingRef);
  }

  constructor(private auth: AuthService, private router: Router) { }

  logout(event: Event) {
    event.preventDefault();
    this.auth.logout();
    this.router.navigate(['/login']);
  }
}
