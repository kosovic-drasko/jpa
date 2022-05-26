import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpHeaders, HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { of } from 'rxjs';

import { PredmetiService } from '../service/predmeti.service';

import { PredmetiComponent } from './predmeti.component';

describe('Predmeti Management Component', () => {
  let comp: PredmetiComponent;
  let fixture: ComponentFixture<PredmetiComponent>;
  let service: PredmetiService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      declarations: [PredmetiComponent],
    })
      .overrideTemplate(PredmetiComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(PredmetiComponent);
    comp = fixture.componentInstance;
    service = TestBed.inject(PredmetiService);

    const headers = new HttpHeaders();
    jest.spyOn(service, 'query').mockReturnValue(
      of(
        new HttpResponse({
          body: [{ id: 123 }],
          headers,
        })
      )
    );
  });

  it('Should call load all on init', () => {
    // WHEN
    comp.ngOnInit();

    // THEN
    expect(service.query).toHaveBeenCalled();
    expect(comp.predmetis?.[0]).toEqual(expect.objectContaining({ id: 123 }));
  });
});
