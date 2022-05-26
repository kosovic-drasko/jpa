import { Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { IPredmeti } from '../predmeti.model';
import { PredmetiService } from '../service/predmeti.service';

@Component({
  templateUrl: './predmeti-delete-dialog.component.html',
})
export class PredmetiDeleteDialogComponent {
  predmeti?: IPredmeti;

  constructor(protected predmetiService: PredmetiService, protected activeModal: NgbActiveModal) {}

  cancel(): void {
    this.activeModal.dismiss();
  }

  confirmDelete(id: number): void {
    this.predmetiService.delete(id).subscribe(() => {
      this.activeModal.close('deleted');
    });
  }
}
