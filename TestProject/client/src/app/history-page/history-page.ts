import { Component, OnInit, ViewChild, ElementRef, AfterViewInit, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { MaterialInstance, MaterialService } from '../shared/classes/material.service';
import { CommonModule } from '@angular/common';
import { HistoryFilter } from './history-filter/history-filter';
import { HistoryList } from './history-list/history-list';
import { OrdersService } from '../shared/layouts/services/orders.service';
import { Subscription } from 'rxjs';
import { Filter, Order } from '../shared/interfaces';
import { Loader } from '../shared/components/loader/loader';

const STEP = 2;

@Component({
  selector: 'app-history-page',
  imports: [CommonModule, HistoryFilter, HistoryList, Loader],
  templateUrl: './history-page.html',
  styleUrl: './history-page.css',
})
export class HistoryPage implements OnInit, OnDestroy, AfterViewInit{

  @ViewChild('tooltip') tooltipRef!: ElementRef;
  tooltip!: MaterialInstance;
  oSub!: Subscription;
  isFilterVisible = false;
  orders: Order[] = [];
  filter: Filter = {};

  offset = 0;
  limit = STEP;

  loading = false;
  reloading = false;
  noMoreOrders = false;
  constructor(private ordersService: OrdersService, private cdr: ChangeDetectorRef) {

  }

  ngOnInit() {
    this.reloading = true;
    this.fetch();
  }

  private fetch() {

    const params = Object.assign({}, this.filter, {
      offset: this.offset,
      limit: this.limit
    });

    this.oSub = this.ordersService.fetch(params).subscribe(orders => {
      this.orders = this.orders.concat(orders);
      this.noMoreOrders = orders.length < STEP;
      this.loading = false;
      this.reloading = false;
      this.cdr.detectChanges();
    });
  }

  loadMore() {
    this.offset += STEP;
    this.loading = true;
    this.fetch();
  }

  ngOnDestroy() {
    this?.tooltip?.destroy?.();
    this.oSub.unsubscribe();
  }

  ngAfterViewInit() {
    this.tooltip = MaterialService.initTooltip(this.tooltipRef);
  }

  applyFilter(filter: Filter) {
    this.orders = [];
    this.offset = 0;
    this.filter = filter;
    this.reloading = true;
    this.fetch();
  }

  isFiltered(): boolean {
    return Object.keys(this.filter).length !== 0;
  }

}
