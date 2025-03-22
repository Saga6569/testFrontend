import ky from 'ky'
import { Employee, EmployeeFormData } from '../models/Employee'

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
 meta?: any
 links?: any
}

// API для работы с сотрудниками
export const employeeApi = {
 // Получение списка всех сотрудников
 async getAll(): Promise<ApiResponse<Employee[]>> {
  // Пробуем несколько вариантов URL для получения данных
  const url = 'api/v1/users'

  let response
  let lastError

  try {
   const rawResponse = await api.get(url)
   response = await rawResponse.json<ApiResponse<Employee[]>>()
   console.log('JSON API response:', response)
   return response
  } catch (error) {
   console.warn(`URL ${url} не работает:`, error)
   lastError = error
  }

  console.warn('Не удалось получить данные из ответа:', response)
  return { data: [] }
 },

 // Получение одного сотрудника по ID
 async getById(id: string): Promise<Employee> {
  try {
   const response = await api.get(`api/v1/users/${id}`).json<any>()

   if (response && response.data) {
    return response.data
   }

   return response
  } catch (error) {
   console.error(`Ошибка при получении сотрудника с ID ${id}:`, error)
   throw error
  }
 },

 // Создание нового сотрудника
 async create(employee: EmployeeFormData): Promise<Employee> {
  try {
   const response = await api
    .post('api/v1/users', { json: employee })
    .json<any>()

   if (response && response.data) {
    return response.data
   }

   return response
  } catch (error) {
   console.error('Ошибка при создании сотрудника:', error)
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
    .json<any>()

   if (response && response.data) {
    return response.data
   }

   return response
  } catch (error) {
   console.error(`Ошибка при обновлении сотрудника с ID ${id}:`, error)
   throw error
  }
 },

 // Удаление сотрудника
 async delete(id: string): Promise<void> {
  try {
   await api.delete(`api/v1/users/${id}`)
  } catch (error) {
   console.error(`Ошибка при удалении сотрудника с ID ${id}:`, error)
   throw error
  }
 },

 // Изменение статуса сотрудника (блокировка/разблокировка)
 async changeStatus(
  id: string,
  status: 'active' | 'blocked'
 ): Promise<Employee> {
  try {
   const response = await api
    .patch(`api/v1/users/${id}/status`, { json: { status } })
    .json<any>()

   if (response && response.data) {
    return response.data
   }

   return response
  } catch (error) {
   console.error(`Ошибка при изменении статуса сотрудника с ID ${id}:`, error)
   throw error
  }
 },
}
