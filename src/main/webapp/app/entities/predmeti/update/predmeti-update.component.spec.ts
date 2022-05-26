import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of, Subject, from } from 'rxjs';

import { PredmetiService } from '../service/predmeti.service';
import { IPredmeti, Predmeti } from '../predmeti.model';
import { IStudent } from 'app/entities/student/student.model';
import { StudentService } from 'app/entities/student/service/student.service';

import { PredmetiUpdateComponent } from './predmeti-update.component';

describe('Predmeti Management Update Component', () => {
  let comp: PredmetiUpdateComponent;
  let fixture: ComponentFixture<PredmetiUpdateComponent>;
  let activatedRoute: ActivatedRoute;
  let predmetiService: PredmetiService;
  let studentService: StudentService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule.withRoutes([])],
      declarations: [PredmetiUpdateComponent],
      providers: [
        FormBuilder,
        {
          provide: ActivatedRoute,
          useValue: {
            params: from([{}]),
          },
        },
      ],
    })
      .overrideTemplate(PredmetiUpdateComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(PredmetiUpdateComponent);
    activatedRoute = TestBed.inject(ActivatedRoute);
    predmetiService = TestBed.inject(PredmetiService);
    studentService = TestBed.inject(StudentService);

    comp = fixture.componentInstance;
  });

  describe('ngOnInit', () => {
    it('Should call Student query and add missing value', () => {
      const predmeti: IPredmeti = { id: 456 };
      const student: IStudent = { id: 12526 };
      predmeti.student = student;

      const studentCollection: IStudent[] = [{ id: 84792 }];
      jest.spyOn(studentService, 'query').mockReturnValue(of(new HttpResponse({ body: studentCollection })));
      const additionalStudents = [student];
      const expectedCollection: IStudent[] = [...additionalStudents, ...studentCollection];
      jest.spyOn(studentService, 'addStudentToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ predmeti });
      comp.ngOnInit();

      expect(studentService.query).toHaveBeenCalled();
      expect(studentService.addStudentToCollectionIfMissing).toHaveBeenCalledWith(studentCollection, ...additionalStudents);
      expect(comp.studentsSharedCollection).toEqual(expectedCollection);
    });

    it('Should update editForm', () => {
      const predmeti: IPredmeti = { id: 456 };
      const student: IStudent = { id: 18809 };
      predmeti.student = student;

      activatedRoute.data = of({ predmeti });
      comp.ngOnInit();

      expect(comp.editForm.value).toEqual(expect.objectContaining(predmeti));
      expect(comp.studentsSharedCollection).toContain(student);
    });
  });

  describe('save', () => {
    it('Should call update service on save for existing entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<Predmeti>>();
      const predmeti = { id: 123 };
      jest.spyOn(predmetiService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ predmeti });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: predmeti }));
      saveSubject.complete();

      // THEN
      expect(comp.previousState).toHaveBeenCalled();
      expect(predmetiService.update).toHaveBeenCalledWith(predmeti);
      expect(comp.isSaving).toEqual(false);
    });

    it('Should call create service on save for new entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<Predmeti>>();
      const predmeti = new Predmeti();
      jest.spyOn(predmetiService, 'create').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ predmeti });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: predmeti }));
      saveSubject.complete();

      // THEN
      expect(predmetiService.create).toHaveBeenCalledWith(predmeti);
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).toHaveBeenCalled();
    });

    it('Should set isSaving to false on error', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<Predmeti>>();
      const predmeti = { id: 123 };
      jest.spyOn(predmetiService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ predmeti });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.error('This is an error!');

      // THEN
      expect(predmetiService.update).toHaveBeenCalledWith(predmeti);
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).not.toHaveBeenCalled();
    });
  });

  describe('Tracking relationships identifiers', () => {
    describe('trackStudentById', () => {
      it('Should return tracked Student primary key', () => {
        const entity = { id: 123 };
        const trackResult = comp.trackStudentById(0, entity);
        expect(trackResult).toEqual(entity.id);
      });
    });
  });
});
