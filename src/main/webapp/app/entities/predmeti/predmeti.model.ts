import { IStudent } from 'app/entities/student/student.model';

export interface IPredmeti {
  id?: number;
  nazivPredmeta?: string | null;
  brojSemestara?: number | null;
  student?: IStudent | null;
}

export class Predmeti implements IPredmeti {
  constructor(
    public id?: number,
    public nazivPredmeta?: string | null,
    public brojSemestara?: number | null,
    public student?: IStudent | null
  ) {}
}

export function getPredmetiIdentifier(predmeti: IPredmeti): number | undefined {
  return predmeti.id;
}
