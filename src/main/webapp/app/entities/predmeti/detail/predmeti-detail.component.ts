import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { IPredmeti } from '../predmeti.model';

@Component({
  selector: 'jhi-predmeti-detail',
  templateUrl: './predmeti-detail.component.html',
})
export class PredmetiDetailComponent implements OnInit {
  predmeti: IPredmeti | null = null;

  constructor(protected activatedRoute: ActivatedRoute) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ predmeti }) => {
      this.predmeti = predmeti;
    });
  }

  previousState(): void {
    window.history.back();
  }
}
