import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { IPredmeti } from '../predmeti.model';
import { PredmetiService } from '../service/predmeti.service';
import { PredmetiDeleteDialogComponent } from '../delete/predmeti-delete-dialog.component';

@Component({
  selector: 'jhi-predmeti',
  templateUrl: './predmeti.component.html',
})
export class PredmetiComponent implements OnInit {
  predmetis?: IPredmeti[];
  isLoading = false;

  constructor(protected predmetiService: PredmetiService, protected modalService: NgbModal) {}

  loadAll(): void {
    this.isLoading = true;

    this.predmetiService.query().subscribe({
      next: (res: HttpResponse<IPredmeti[]>) => {
        this.isLoading = false;
        this.predmetis = res.body ?? [];
      },
      error: () => {
        this.isLoading = false;
      },
    });
  }

  ngOnInit(): void {
    this.loadAll();
  }

  trackId(_index: number, item: IPredmeti): number {
    return item.id!;
  }

  delete(predmeti: IPredmeti): void {
    const modalRef = this.modalService.open(PredmetiDeleteDialogComponent, { size: 'lg', backdrop: 'static' });
    modalRef.componentInstance.predmeti = predmeti;
    // unsubscribe not needed because closed completes on modal close
    modalRef.closed.subscribe(reason => {
      if (reason === 'deleted') {
        this.loadAll();
      }
    });
  }
}
