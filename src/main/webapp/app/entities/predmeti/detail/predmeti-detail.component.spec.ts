import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

import { PredmetiDetailComponent } from './predmeti-detail.component';

describe('Predmeti Management Detail Component', () => {
  let comp: PredmetiDetailComponent;
  let fixture: ComponentFixture<PredmetiDetailComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [PredmetiDetailComponent],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: { data: of({ predmeti: { id: 123 } }) },
        },
      ],
    })
      .overrideTemplate(PredmetiDetailComponent, '')
      .compileComponents();
    fixture = TestBed.createComponent(PredmetiDetailComponent);
    comp = fixture.componentInstance;
  });

  describe('OnInit', () => {
    it('Should load predmeti on init', () => {
      // WHEN
      comp.ngOnInit();

      // THEN
      expect(comp.predmeti).toEqual(expect.objectContaining({ id: 123 }));
    });
  });
});
