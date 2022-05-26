import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Resolve, ActivatedRouteSnapshot, Router } from '@angular/router';
import { Observable, of, EMPTY } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { IPredmeti, Predmeti } from '../predmeti.model';
import { PredmetiService } from '../service/predmeti.service';

@Injectable({ providedIn: 'root' })
export class PredmetiRoutingResolveService implements Resolve<IPredmeti> {
  constructor(protected service: PredmetiService, protected router: Router) {}

  resolve(route: ActivatedRouteSnapshot): Observable<IPredmeti> | Observable<never> {
    const id = route.params['id'];
    if (id) {
      return this.service.find(id).pipe(
        mergeMap((predmeti: HttpResponse<Predmeti>) => {
          if (predmeti.body) {
            return of(predmeti.body);
          } else {
            this.router.navigate(['404']);
            return EMPTY;
          }
        })
      );
    }
    return of(new Predmeti());
  }
}
