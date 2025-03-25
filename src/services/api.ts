import ky from 'ky'
import {
 Employee,
 EmployeeFormData,
 EmployeeFormDataAdd,
} from '../types/Employee'

// Базовый URL API
const API_URL = 'https://api.mock.sb21.ru'

// Создаем экземпляр ky с предустановленным префиксом URL и логированием запросов
const api = ky.create({
 prefixUrl: API_URL,
 timeout: 30000,
 retry: 1,
})

// Интерфейс для ответа API
interface ApiResponse<T> {
 data: T
 meta?: {
  total: number
  page: number
  per_page: number
 }
 links?: {
  first: string
  last: string
  prev: string | null
  next: string | null
 }
}

interface ApiError {
 name: string
 response: Response
}

export interface Department {
 id: string
 name: string
 code: string
 status: {
  label: string
  value: string
 }
}

export interface Role {
 id: string
 name: string
 code: string
}

export interface Position {
 id: string
 name: string
 code: string
}

export const employeeApi = {
 async getAll(): Promise<ApiResponse<Employee[]>> {
  const url = 'api/v1/users'

  try {
   const rawResponse = await api.get(url)
   const response = await rawResponse.json<ApiResponse<Employee[]>>()
   return response
  } catch (error: unknown) {
   if (error && typeof error === 'object' && 'name' in error) {
    const apiError = error as ApiError
    if (apiError.name === 'HTTPError') {
     const errorJson = await apiError.response.json()
     throw errorJson
    }
   }
   throw error
  }
 },

 // Получение одного сотрудника по ID
 async getById(id: string): Promise<ApiResponse<Employee>> {
  try {
   const response = await api
    .get(`api/v1/users/${id}`)
    .json<ApiResponse<Employee>>()
   return response
  } catch (error: unknown) {
   if (error && typeof error === 'object' && 'name' in error) {
    const apiError = error as ApiError
    if (apiError.name === 'HTTPError') {
     const errorJson = await apiError.response.json()
     throw errorJson
    }
   }
   throw error
  }
 },

 // Создание нового сотрудника
 async create(employee: EmployeeFormDataAdd): Promise<ApiResponse<Employee>> {
  try {
   const response = await api
    .post('api/v1/users', { json: employee })
    .json<ApiResponse<Employee>>()
   return response
  } catch (error: unknown) {
   if (error && typeof error === 'object' && 'name' in error) {
    const apiError = error as ApiError
    if (apiError.name === 'HTTPError') {
     const errorJson = await apiError.response.json()
     return errorJson
    }
   }
   throw error
  }
 },

 // Обновление существующего сотрудника
 async update(
  id: string,
  employee: Partial<EmployeeFormData>
 ): Promise<Employee> {
  try {
   const response = await api
    .put(`api/v1/users/${id}`, { json: employee })
    .json<ApiResponse<Employee>>()
   return response.data
  } catch (error: unknown) {
   if (error && typeof error === 'object' && 'name' in error) {
    const apiError = error as ApiError
    if (apiError.name === 'HTTPError') {
     const errorJson = await apiError.response.json()
     throw errorJson
    }
   }
   throw error
  }
 },

 // Удаление сотрудника
 async delete(id: string): Promise<void> {
  try {
   await api.delete(`api/v1/users/${id}`)
  } catch (error: unknown) {
   if (error && typeof error === 'object' && 'name' in error) {
    const apiError = error as ApiError
    if (apiError.name === 'HTTPError') {
     const errorJson = await apiError.response.json()
     throw errorJson
    }
   }
   throw error
  }
 },

 async getDepartments(): Promise<ApiResponse<Department[]>> {
  try {
   const response = await api
    .get('api/v1/departments')
    .json<ApiResponse<Department[]>>()
   return response
  } catch (error: unknown) {
   if (error && typeof error === 'object' && 'name' in error) {
    const apiError = error as ApiError
    if (apiError.name === 'HTTPError') {
     const errorJson = await apiError.response.json()
     throw errorJson
    }
   }
   throw error
  }
 },

 async getRoles(): Promise<ApiResponse<Role[]>> {
  try {
   const response = await api.get('api/v1/roles').json<ApiResponse<Role[]>>()
   return response
  } catch (error: unknown) {
   if (error && typeof error === 'object' && 'name' in error) {
    const apiError = error as ApiError
    if (apiError.name === 'HTTPError') {
     const errorJson = await apiError.response.json()
     throw errorJson
    }
   }
   throw error
  }
 },

 async getPositions(): Promise<ApiResponse<Position[]>> {
  try {
   const response = await api
    .get('api/v1/positions')
    .json<ApiResponse<Position[]>>()
   return response
  } catch (error: unknown) {
   if (error && typeof error === 'object' && 'name' in error) {
    const apiError = error as ApiError
    if (apiError.name === 'HTTPError') {
     const errorJson = await apiError.response.json()
     throw errorJson
    }
   }
   throw error
  }
 },

 // Изменение статуса сотрудника (блокировка/разблокировка)
 //  async changeStatus(
 //   id: string,
 //   status: 'active' | 'blocked'
 //  ): Promise<Employee> {
 //   try {
 //    const response = await api
 //     .patch(`api/v1/users/${id}/status`, { json: { status } })
 //     .json<ApiResponse<Employee>>()
 //    return response.data
 //   } catch (error) {
 //    console.error(`Ошибка при изменении статуса сотрудника с ID ${id}:`, error)
 //    throw error
 //   }
 //  },
}
