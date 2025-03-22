export interface Employee {
  id: string;
  name: string;
  surname: string;
  patronymic: string;
  phone: string;
  email: string;
  password?: string;
  medical_position: {
    label: string;
    value: string;
  };
  status: {
    label: string;
    value: string;
  };
  hired_at: number;
  fired_at: number;
  roles?: string[];
}

export interface EmployeeFormData extends Omit<Employee, 'id'> {}