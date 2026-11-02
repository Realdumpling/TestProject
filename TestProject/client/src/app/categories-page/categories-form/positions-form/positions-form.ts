import { Component, ElementRef, OnInit, Input, ViewChild, AfterViewInit, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { FormGroup, FormControl, Validators, ReactiveFormsModule } from '@angular/forms';
import { PositionsService } from '../../../shared/layouts/services/positions.service';
import { Position } from '../../../shared/interfaces';
import { MaterialService } from '../../../shared/classes/material.service';
import { CommonModule } from '@angular/common';
import { Loader } from '../../../shared/components/loader/loader'

@Component({
  selector: 'app-positions-form',
  standalone: true,
  imports: [CommonModule, Loader, ReactiveFormsModule],
  templateUrl: './positions-form.html',
  styleUrl: './positions-form.css',
})
export class PositionsForm implements OnInit, AfterViewInit, OnDestroy {
  @Input('categoryId') categoryId!: string;
  @ViewChild('modal') modalRef!: ElementRef;
  positions: Position[] = [];
  loading = false;
  modal: any = null;
  form!: FormGroup;
  positionId: string | null = null;
  constructor(private positionsService: PositionsService, private cdr: ChangeDetectorRef) {

  }

  ngOnInit() {
    this.form = new FormGroup({
      name: new FormControl(null, Validators.required),
      cost: new FormControl(1, [Validators.required, Validators.min(1)])
    })

    this.loading = true;
    this.positionsService.fetch(this.categoryId).subscribe(
      (positions: Position[]) => {   
        this.positions = positions;
        this.loading = false;
        this.cdr.detectChanges();
      },
      (error: any) => {
        console.error('Ошибка загрузки позиций:', error);
        this.loading = false;
        this.cdr.detectChanges();
      }
    );
    
  }

  ngAfterViewInit() {
    this.modal = MaterialService.initModal(this.modalRef);
  }

  ngOnDestroy() {
    this.modal.destroy();
  }

  onSelectPosition(position: Position) {
    this.positionId = position._id || null;
    this.form.patchValue({
      name: position.name,
      cost: position.cost
    })
    this.modal.open();
  }

  onAddPosition() {
    this.positionId = null;
    this.form.reset({
      name: null,
      cost: 1
    })
    this.modal.open();
  }

  onCancel() {
    this.modal.close();
  }

  onSubmit() {
    this.form.disable();

    const newPosition: Position = {
      name: this.form.value.name,
      cost: this.form.value.cost,
      category: this.categoryId
    };

    const completed = () => {
      this.modal.close();
      this.form.reset({ name: '', cost: 1 });
      this.form.enable();
    }

    if (this.positionId) {
      newPosition._id = this.positionId;
      this.positionsService.update(newPosition).subscribe(
          (position: Position) => {
          const idx = this.positions.findIndex(p => p._id === position._id);
          this.positions[idx] = position;
          MaterialService.toast('Позиция изменена');
        },
          (error: { error: { message: string; }; }) => {
          MaterialService.toast(error.error.message);
        },
        completed
      );
    } else {
      this.positionsService.create(newPosition).subscribe(
          (position: Position) => {
          MaterialService.toast('Позиция создана');
          this.positions.push(position);
        },
          (error: { error: { message: string; }; }) => {
          MaterialService.toast(error.error.message);
        },
        completed
      )
    }


  }

  onDeletePosition(event: Event, position: Position) {
    event.stopPropagation();
    const decision = window.confirm(`Удалить позицию "${position.name}"?`);
    if (decision) {
      this.positionsService.delete(position).subscribe(
          (response: { message: string; }) => {
          const idx = this.positions.findIndex(p => p._id === position._id);
          this.positions.splice(idx, 1);
          MaterialService.toast(response.message);
        },
          (error: { error: { message: string; }; }) => MaterialService.toast(error.error.message)
      )
    }
  }
}
