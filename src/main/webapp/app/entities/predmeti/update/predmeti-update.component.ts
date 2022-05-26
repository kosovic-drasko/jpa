import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize, map } from 'rxjs/operators';

import { IPredmeti, Predmeti } from '../predmeti.model';
import { PredmetiService } from '../service/predmeti.service';
import { IStudent } from 'app/entities/student/student.model';
import { StudentService } from 'app/entities/student/service/student.service';

@Component({
  selector: 'jhi-predmeti-update',
  templateUrl: './predmeti-update.component.html',
})
export class PredmetiUpdateComponent implements OnInit {
  isSaving = false;

  studentsSharedCollection: IStudent[] = [];

  editForm = this.fb.group({
    id: [],
    nazivPredmeta: [],
    brojSemestara: [],
    student: [],
  });

  constructor(
    protected predmetiService: PredmetiService,
    protected studentService: StudentService,
    protected activatedRoute: ActivatedRoute,
    protected fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ predmeti }) => {
      this.updateForm(predmeti);

      this.loadRelationshipsOptions();
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const predmeti = this.createFromForm();
    if (predmeti.id !== undefined) {
      this.subscribeToSaveResponse(this.predmetiService.update(predmeti));
    } else {
      this.subscribeToSaveResponse(this.predmetiService.create(predmeti));
    }
  }

  trackStudentById(_index: number, item: IStudent): number {
    return item.id!;
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IPredmeti>>): void {
    result.pipe(finalize(() => this.onSaveFinalize())).subscribe({
      next: () => this.onSaveSuccess(),
      error: () => this.onSaveError(),
    });
  }

  protected onSaveSuccess(): void {
    this.previousState();
  }

  protected onSaveError(): void {
    // Api for inheritance.
  }

  protected onSaveFinalize(): void {
    this.isSaving = false;
  }

  protected updateForm(predmeti: IPredmeti): void {
    this.editForm.patchValue({
      id: predmeti.id,
      nazivPredmeta: predmeti.nazivPredmeta,
      brojSemestara: predmeti.brojSemestara,
      student: predmeti.student,
    });

    this.studentsSharedCollection = this.studentService.addStudentToCollectionIfMissing(this.studentsSharedCollection, predmeti.student);
  }

  protected loadRelationshipsOptions(): void {
    this.studentService
      .query()
      .pipe(map((res: HttpResponse<IStudent[]>) => res.body ?? []))
      .pipe(
        map((students: IStudent[]) => this.studentService.addStudentToCollectionIfMissing(students, this.editForm.get('student')!.value))
      )
      .subscribe((students: IStudent[]) => (this.studentsSharedCollection = students));
  }

  protected createFromForm(): IPredmeti {
    return {
      ...new Predmeti(),
      id: this.editForm.get(['id'])!.value,
      nazivPredmeta: this.editForm.get(['nazivPredmeta'])!.value,
      brojSemestara: this.editForm.get(['brojSemestara'])!.value,
      student: this.editForm.get(['student'])!.value,
    };
  }
}
