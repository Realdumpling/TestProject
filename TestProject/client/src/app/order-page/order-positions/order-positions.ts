import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { Observable } from 'rxjs';
import { switchMap, map } from 'rxjs/operators';
import { PositionsService } from '../../shared/layouts/services/positions.service';
import { Position } from '../../shared/interfaces';
import { OrderService } from '../order.service';
import { CommonModule } from '@angular/common';
import { Loader } from '../../shared/components/loader/loader';
import { FormsModule } from '@angular/forms';
import { MaterialService } from '../../shared/classes/material.service';

@Component({
  selector: 'app-order-positions',
  imports: [CommonModule, Loader, FormsModule],
  templateUrl: './order-positions.html',
  styleUrl: './order-positions.css',
})
export class OrderPositions implements OnInit {

  positions$!: Observable<Position[]>;

  constructor(private route: ActivatedRoute, private positionsService: PositionsService, private order: OrderService) {

  }

  ngOnInit() {
    this.positions$ = this.route.params.pipe(
      switchMap(
        (params: Params) => {
          return this.positionsService.fetch(params['id']);
        }
      ),
      map(
        (positions: Position[]) => {
          return positions.map(position => {
            position.quantity = 1;
            return position
          })
        }
      )
    )
  }

  addToOrder(position: Position) {
    MaterialService.toast(`Добавлено ${position.name} х${position.quantity}`);
    this.order.add(position);
  }

}
