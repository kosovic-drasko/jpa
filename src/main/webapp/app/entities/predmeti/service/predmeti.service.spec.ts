import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { IPredmeti, Predmeti } from '../predmeti.model';

import { PredmetiService } from './predmeti.service';

describe('Predmeti Service', () => {
  let service: PredmetiService;
  let httpMock: HttpTestingController;
  let elemDefault: IPredmeti;
  let expectedResult: IPredmeti | IPredmeti[] | boolean | null;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    });
    expectedResult = null;
    service = TestBed.inject(PredmetiService);
    httpMock = TestBed.inject(HttpTestingController);

    elemDefault = {
      id: 0,
      nazivPredmeta: 'AAAAAAA',
      brojSemestara: 0,
    };
  });

  describe('Service methods', () => {
    it('should find an element', () => {
      const returnedFromService = Object.assign({}, elemDefault);

      service.find(123).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'GET' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(elemDefault);
    });

    it('should create a Predmeti', () => {
      const returnedFromService = Object.assign(
        {
          id: 0,
        },
        elemDefault
      );

      const expected = Object.assign({}, returnedFromService);

      service.create(new Predmeti()).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'POST' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should update a Predmeti', () => {
      const returnedFromService = Object.assign(
        {
          id: 1,
          nazivPredmeta: 'BBBBBB',
          brojSemestara: 1,
        },
        elemDefault
      );

      const expected = Object.assign({}, returnedFromService);

      service.update(expected).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PUT' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should partial update a Predmeti', () => {
      const patchObject = Object.assign(
        {
          nazivPredmeta: 'BBBBBB',
        },
        new Predmeti()
      );

      const returnedFromService = Object.assign(patchObject, elemDefault);

      const expected = Object.assign({}, returnedFromService);

      service.partialUpdate(patchObject).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PATCH' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should return a list of Predmeti', () => {
      const returnedFromService = Object.assign(
        {
          id: 1,
          nazivPredmeta: 'BBBBBB',
          brojSemestara: 1,
        },
        elemDefault
      );

      const expected = Object.assign({}, returnedFromService);

      service.query().subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'GET' });
      req.flush([returnedFromService]);
      httpMock.verify();
      expect(expectedResult).toContainEqual(expected);
    });

    it('should delete a Predmeti', () => {
      service.delete(123).subscribe(resp => (expectedResult = resp.ok));

      const req = httpMock.expectOne({ method: 'DELETE' });
      req.flush({ status: 200 });
      expect(expectedResult);
    });

    describe('addPredmetiToCollectionIfMissing', () => {
      it('should add a Predmeti to an empty array', () => {
        const predmeti: IPredmeti = { id: 123 };
        expectedResult = service.addPredmetiToCollectionIfMissing([], predmeti);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(predmeti);
      });

      it('should not add a Predmeti to an array that contains it', () => {
        const predmeti: IPredmeti = { id: 123 };
        const predmetiCollection: IPredmeti[] = [
          {
            ...predmeti,
          },
          { id: 456 },
        ];
        expectedResult = service.addPredmetiToCollectionIfMissing(predmetiCollection, predmeti);
        expect(expectedResult).toHaveLength(2);
      });

      it("should add a Predmeti to an array that doesn't contain it", () => {
        const predmeti: IPredmeti = { id: 123 };
        const predmetiCollection: IPredmeti[] = [{ id: 456 }];
        expectedResult = service.addPredmetiToCollectionIfMissing(predmetiCollection, predmeti);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(predmeti);
      });

      it('should add only unique Predmeti to an array', () => {
        const predmetiArray: IPredmeti[] = [{ id: 123 }, { id: 456 }, { id: 70816 }];
        const predmetiCollection: IPredmeti[] = [{ id: 123 }];
        expectedResult = service.addPredmetiToCollectionIfMissing(predmetiCollection, ...predmetiArray);
        expect(expectedResult).toHaveLength(3);
      });

      it('should accept varargs', () => {
        const predmeti: IPredmeti = { id: 123 };
        const predmeti2: IPredmeti = { id: 456 };
        expectedResult = service.addPredmetiToCollectionIfMissing([], predmeti, predmeti2);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(predmeti);
        expect(expectedResult).toContain(predmeti2);
      });

      it('should accept null and undefined values', () => {
        const predmeti: IPredmeti = { id: 123 };
        expectedResult = service.addPredmetiToCollectionIfMissing([], null, predmeti, undefined);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(predmeti);
      });

      it('should return initial array if no Predmeti is added', () => {
        const predmetiCollection: IPredmeti[] = [{ id: 123 }];
        expectedResult = service.addPredmetiToCollectionIfMissing(predmetiCollection, undefined, null);
        expect(expectedResult).toEqual(predmetiCollection);
      });
    });
  });

  afterEach(() => {
    httpMock.verify();
  });
});
