import { Component, Output, EventEmitter, ViewChild, ElementRef, AfterViewInit, OnDestroy } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Filter } from '../../shared/interfaces';
import { MaterialDatepicker, MaterialService } from '../../shared/classes/material.service';

@Component({
  selector: 'app-history-filter',
  imports: [FormsModule, CommonModule],
  templateUrl: './history-filter.html',
  styleUrl: './history-filter.css',
})
export class HistoryFilter implements OnDestroy, AfterViewInit {

  @Output() onFilter = new EventEmitter<Filter>();
  @ViewChild('start') startRef!: ElementRef;
  @ViewChild('end') endRef!: ElementRef;

  start!: MaterialDatepicker;
  end!: MaterialDatepicker;
  order!: number;

  isValid = true;

  submitFilter() {
    const filter: Filter = {};

    if (this.order) {
      filter.order = this.order
    }
    
    if (this.start.date) {
      filter.start = this.start.date;
    }
        
    if (this.end.date) {
      filter.end = this.end.date;
    }

    this.onFilter.emit(filter);
  }

  ngOnDestroy() {
    this?.start?.destroy?.();
    this?.end?.destroy?.();
  }

  ngAfterViewInit() {
    this.start = MaterialService.initDatepicker(this.startRef, this.validate.bind(this));
    this.end = MaterialService.initDatepicker(this.endRef, this.validate.bind(this));
  }

  validate() {
    if (!this.start.date || !this.end.date) {
      this.isValid = true;
      return
    }

    this.isValid = this.start.date < this.end.date;
    
  }

}
