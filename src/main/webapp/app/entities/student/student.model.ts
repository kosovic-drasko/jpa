import { IPredmeti } from 'app/entities/predmeti/predmeti.model';

export interface IStudent {
  id?: number;
  name?: string | null;
  predmetis?: IPredmeti[] | null;
}

export class Student implements IStudent {
  constructor(public id?: number, public name?: string | null, public predmetis?: IPredmeti[] | null) {}
}

export function getStudentIdentifier(student: IStudent): number | undefined {
  return student.id;
}
