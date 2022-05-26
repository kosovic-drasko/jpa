import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { PredmetiComponent } from '../list/predmeti.component';
import { PredmetiDetailComponent } from '../detail/predmeti-detail.component';
import { PredmetiUpdateComponent } from '../update/predmeti-update.component';
import { PredmetiRoutingResolveService } from './predmeti-routing-resolve.service';

const predmetiRoute: Routes = [
  {
    path: '',
    component: PredmetiComponent,
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: PredmetiDetailComponent,
    resolve: {
      predmeti: PredmetiRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: PredmetiUpdateComponent,
    resolve: {
      predmeti: PredmetiRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: PredmetiUpdateComponent,
    resolve: {
      predmeti: PredmetiRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
];

@NgModule({
  imports: [RouterModule.forChild(predmetiRoute)],
  exports: [RouterModule],
})
export class PredmetiRoutingModule {}
