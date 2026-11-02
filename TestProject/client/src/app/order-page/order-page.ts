import { AfterViewInit, Component, OnInit, ElementRef, ViewChild, OnDestroy } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { MaterialInstance, MaterialService } from '../shared/classes/material.service';
import { OrderService } from './order.service';
import { CommonModule } from '@angular/common';
import { RouterOutlet, RouterLink } from '@angular/router';
import { Order, OrderPosition } from '../shared/interfaces';
import { OrdersService } from '../shared/layouts/services/orders.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-order-page',
  imports: [CommonModule, RouterOutlet, RouterLink],
  templateUrl: './order-page.html',
  styleUrl: './order-page.css',
  providers: [OrderService]
})
export class OrderPage implements OnInit, OnDestroy, AfterViewInit {

  @ViewChild('modal') modalRef!: ElementRef;
  modal!: MaterialInstance;
  isRoot!: boolean;
  pending = false;
  oSub!: Subscription;

  constructor(private router: Router, private order: OrderService, private ordersService: OrdersService) {

  }

  get orderService() {
    return this.order;
  }

  ngOnInit() {
    this.router.url === '/order' ? this.isRoot = true : this.isRoot = false;
    this.router.events.subscribe({
      next: (event: any) => {
        if (event instanceof NavigationEnd) {
          this.router.url === '/order' ? this.isRoot = true : this.isRoot = false;
        }    
    }})
  }

  ngOnDestroy() {
    this.modal?.destroy?.();
    if (this.oSub) {
      this.oSub.unsubscribe();
    }
  }

  ngAfterViewInit() {
    this.modal = MaterialService.initModal(this.modalRef);
  }

  open() {
    this.modal?.open?.();
  }

  cancel() {
    this.modal?.close?.();
  }

  submit() {
    this.pending = true;

    const order: Order = {
      list: this.order.list.map(item => {
        delete item._id;
        return item;
      })
    };

    this.oSub = this.ordersService.create(order).subscribe(
     newOrder => {
        MaterialService.toast(`Заказ №${newOrder.order} добавлен`)
        this.order.clear()
      },
      (error: any) => {
        MaterialService.toast(error.error.message)
      },
      () => {
        this.modal?.close?.();
        this.pending = false;
      }
    );
  }

  removePosition(orderPosition: OrderPosition) {
    this.order.remove(orderPosition);
  }

}
