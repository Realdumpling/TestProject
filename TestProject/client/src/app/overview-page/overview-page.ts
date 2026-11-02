import { Component, OnInit, ViewChild, OnDestroy, AfterViewInit, ElementRef } from '@angular/core';
import { AnaliticsService } from '../shared/layouts/services/analytics.service';
import { OverviewPageData } from '../shared/interfaces';
import { Observable } from 'rxjs';
import { MaterialInstance, MaterialService } from '../shared/classes/material.service';
import { CommonModule } from '@angular/common';
import { Loader } from '../shared/components/loader/loader';


@Component({
  selector: 'app-overview-page',
  imports: [CommonModule, Loader],
  templateUrl: './overview-page.html',
  styleUrl: './overview-page.css',
})
export class OverviewPage implements OnInit, OnDestroy, AfterViewInit {

  @ViewChild('tapTarget') tapTargetRef!: ElementRef;
  tapTarget!: MaterialInstance;
  data$!: Observable<OverviewPageData>;
  yesterday = new Date();


  constructor(private service: AnaliticsService) {

  }

  ngOnInit() {
    this.data$ = this.service.getOverview();

    this.yesterday.setDate(this.yesterday.getDate() - 1);
  }

  ngOnDestroy() {
    this?.tapTarget?.destroy?.();
  }

  ngAfterViewInit() {
    this.tapTarget = MaterialService.initTapTarget(this.tapTargetRef);
  }

  openInfo() {
    this?.tapTarget?.open?.();
  }
}
