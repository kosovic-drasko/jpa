import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

import { isPresent } from 'app/core/util/operators';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { IPredmeti, getPredmetiIdentifier } from '../predmeti.model';

export type EntityResponseType = HttpResponse<IPredmeti>;
export type EntityArrayResponseType = HttpResponse<IPredmeti[]>;

@Injectable({ providedIn: 'root' })
export class PredmetiService {
  protected resourceUrl = this.applicationConfigService.getEndpointFor('api/predmetis');

  constructor(protected http: HttpClient, protected applicationConfigService: ApplicationConfigService) {}

  create(predmeti: IPredmeti): Observable<EntityResponseType> {
    return this.http.post<IPredmeti>(this.resourceUrl, predmeti, { observe: 'response' });
  }

  update(predmeti: IPredmeti): Observable<EntityResponseType> {
    return this.http.put<IPredmeti>(`${this.resourceUrl}/${getPredmetiIdentifier(predmeti) as number}`, predmeti, { observe: 'response' });
  }

  partialUpdate(predmeti: IPredmeti): Observable<EntityResponseType> {
    return this.http.patch<IPredmeti>(`${this.resourceUrl}/${getPredmetiIdentifier(predmeti) as number}`, predmeti, {
      observe: 'response',
    });
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http.get<IPredmeti>(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http.get<IPredmeti[]>(this.resourceUrl, { params: options, observe: 'response' });
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  addPredmetiToCollectionIfMissing(predmetiCollection: IPredmeti[], ...predmetisToCheck: (IPredmeti | null | undefined)[]): IPredmeti[] {
    const predmetis: IPredmeti[] = predmetisToCheck.filter(isPresent);
    if (predmetis.length > 0) {
      const predmetiCollectionIdentifiers = predmetiCollection.map(predmetiItem => getPredmetiIdentifier(predmetiItem)!);
      const predmetisToAdd = predmetis.filter(predmetiItem => {
        const predmetiIdentifier = getPredmetiIdentifier(predmetiItem);
        if (predmetiIdentifier == null || predmetiCollectionIdentifiers.includes(predmetiIdentifier)) {
          return false;
        }
        predmetiCollectionIdentifiers.push(predmetiIdentifier);
        return true;
      });
      return [...predmetisToAdd, ...predmetiCollection];
    }
    return predmetiCollection;
  }
}
