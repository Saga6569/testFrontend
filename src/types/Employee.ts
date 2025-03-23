export interface Employee {
  id: string;
  name: string;
  surname: string;
  patronymic: string;
  phone: string;
  email: string;
  password?: string;
  adminPosition?: string;
  department?: {
    label: string;
    value: string;
  };
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

export type EmployeeFormData = Omit<Employee, 'id'>

export interface EmployeeFormDataAdd {
  name: string;
  surname: string;
  patronymic: string;
  email: string;
  phone: string;
  department: string;
  administrative_position: string;
  medical_position: string;
  is_simple_digital_sign_enabled: boolean;
  hired_at: number;
}