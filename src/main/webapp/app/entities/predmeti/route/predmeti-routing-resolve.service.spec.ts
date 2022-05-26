import { TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ActivatedRouteSnapshot, ActivatedRoute, Router, convertToParamMap } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of } from 'rxjs';

import { IPredmeti, Predmeti } from '../predmeti.model';
import { PredmetiService } from '../service/predmeti.service';

import { PredmetiRoutingResolveService } from './predmeti-routing-resolve.service';

describe('Predmeti routing resolve service', () => {
  let mockRouter: Router;
  let mockActivatedRouteSnapshot: ActivatedRouteSnapshot;
  let routingResolveService: PredmetiRoutingResolveService;
  let service: PredmetiService;
  let resultPredmeti: IPredmeti | undefined;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule.withRoutes([])],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: {
            snapshot: {
              paramMap: convertToParamMap({}),
            },
          },
        },
      ],
    });
    mockRouter = TestBed.inject(Router);
    jest.spyOn(mockRouter, 'navigate').mockImplementation(() => Promise.resolve(true));
    mockActivatedRouteSnapshot = TestBed.inject(ActivatedRoute).snapshot;
    routingResolveService = TestBed.inject(PredmetiRoutingResolveService);
    service = TestBed.inject(PredmetiService);
    resultPredmeti = undefined;
  });

  describe('resolve', () => {
    it('should return IPredmeti returned by find', () => {
      // GIVEN
      service.find = jest.fn(id => of(new HttpResponse({ body: { id } })));
      mockActivatedRouteSnapshot.params = { id: 123 };

      // WHEN
      routingResolveService.resolve(mockActivatedRouteSnapshot).subscribe(result => {
        resultPredmeti = result;
      });

      // THEN
      expect(service.find).toBeCalledWith(123);
      expect(resultPredmeti).toEqual({ id: 123 });
    });

    it('should return new IPredmeti if id is not provided', () => {
      // GIVEN
      service.find = jest.fn();
      mockActivatedRouteSnapshot.params = {};

      // WHEN
      routingResolveService.resolve(mockActivatedRouteSnapshot).subscribe(result => {
        resultPredmeti = result;
      });

      // THEN
      expect(service.find).not.toBeCalled();
      expect(resultPredmeti).toEqual(new Predmeti());
    });

    it('should route to 404 page if data not found in server', () => {
      // GIVEN
      jest.spyOn(service, 'find').mockReturnValue(of(new HttpResponse({ body: null as unknown as Predmeti })));
      mockActivatedRouteSnapshot.params = { id: 123 };

      // WHEN
      routingResolveService.resolve(mockActivatedRouteSnapshot).subscribe(result => {
        resultPredmeti = result;
      });

      // THEN
      expect(service.find).toBeCalledWith(123);
      expect(resultPredmeti).toEqual(undefined);
      expect(mockRouter.navigate).toHaveBeenCalledWith(['404']);
    });
  });
});
