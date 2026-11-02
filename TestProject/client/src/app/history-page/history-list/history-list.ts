import { Component, Input, ViewChild, OnDestroy, AfterViewInit, ElementRef } from '@angular/core';
import { Order } from '../../shared/interfaces';
import { CommonModule } from '@angular/common';
import { MaterialInstance, MaterialService } from '../../shared/classes/material.service';

@Component({
  selector: 'app-history-list',
  imports: [CommonModule],
  templateUrl: './history-list.html',
  styleUrl: './history-list.css',
})
export class HistoryList implements OnDestroy, AfterViewInit{
  @Input() orders!: Order[];
  @ViewChild('modal') modalRef!: ElementRef;

  selectedOrder!: Order;
  modal!: MaterialInstance;


  ngOnDestroy() {
    this?.modal?.destroy?.();
  }

  ngAfterViewInit() {
    this.modal = MaterialService.initModal(this.modalRef);
  }

  computePrice(order: Order): number {
    return order.list.reduce((total, item) => {
      return total += item.quantity * item.cost
    }, 0);
  }

  selecttOrder(order: Order) {
    this.selectedOrder = order;
    this?.modal?.open?.();
  }

  closeModal() {
    this?.modal?.close?.();
  }

}
