import { NgModule } from '@angular/core';
import { SharedModule } from 'app/shared/shared.module';
import { PredmetiComponent } from './list/predmeti.component';
import { PredmetiDetailComponent } from './detail/predmeti-detail.component';
import { PredmetiUpdateComponent } from './update/predmeti-update.component';
import { PredmetiDeleteDialogComponent } from './delete/predmeti-delete-dialog.component';
import { PredmetiRoutingModule } from './route/predmeti-routing.module';

@NgModule({
  imports: [SharedModule, PredmetiRoutingModule],
  declarations: [PredmetiComponent, PredmetiDetailComponent, PredmetiUpdateComponent, PredmetiDeleteDialogComponent],
  entryComponents: [PredmetiDeleteDialogComponent],
})
export class PredmetiModule {}
