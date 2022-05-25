export interface IStudent {
  id?: number;
  name?: string | null;
}

export class Student implements IStudent {
  constructor(public id?: number, public name?: string | null) {}
}

export function getStudentIdentifier(student: IStudent): number | undefined {
  return student.id;
}
