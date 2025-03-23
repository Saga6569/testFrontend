import { makeAutoObservable, runInAction } from 'mobx'
import { employeeApi } from '../services/api'
import { Employee, EmployeeFormData, EmployeeFormDataAdd } from '../types/Employee'

class StaffStore {
 staffMembers: Employee[] = []
 selectedStaff: Pick<Employee, 'id' | 'name' | 'roles'>[] = []
 selectedRoles: string[] = []
 showDismissed: boolean = false
 showBlocked: boolean = false
 isLoading: boolean = false
 error: string | null = null

 constructor() {
  makeAutoObservable(this)
 }

 get availableRoles() {
  const roles = new Set<string>()
  this.staffMembers.forEach((member) => {
   member.roles?.forEach((role) => roles.add(role))
  })
  return Array.from(roles)
 }

 fetchStaff = async () => {
  try {
   this.isLoading = true
   this.error = null
   const response = await employeeApi.getAll()
   console.log(response)
   runInAction(() => {
    this.staffMembers = ((response.data as unknown) as { items: Employee[] }).items
    this.isLoading = false
   })
  } catch {
   runInAction(() => {
    this.error = 'Ошибка при загрузке данных'
    this.isLoading = false
   })
  }
 }

 setSelectedStaff = (staff: Pick<Employee, 'id' | 'name' | 'roles'>[]) => {
  this.selectedStaff = staff
 }

 setSelectedRoles = (roles: string[]) => {
  this.selectedRoles = roles
 }

 toggleDismissed = () => {
  this.showDismissed = !this.showDismissed
 }

 toggleBlocked = () => {
  this.showBlocked = !this.showBlocked
 }

 addStaffMember = async (member: EmployeeFormDataAdd) => {
  try {
   this.isLoading = true
   const newMember = await employeeApi.create(member)
   console.log(newMember)
   runInAction(() => {
    this.staffMembers.push(newMember)
    this.isLoading = false
   })
  } catch (error) {
   console.log(error)
   runInAction(() => {
    this.error = 'Ошибка при добавлении сотрудника'
    this.isLoading = false
   })
  }
 }

 removeStaffMember = async (id: string) => {
  console.log('удаление сотрудника', id)
  // try {
  //   this.isLoading = true;
  //   await employeeApi.delete(id);
  //   runInAction(() => {
  //     this.staffMembers = this.staffMembers.filter(member => member.id !== id);
  //     this.isLoading = false;
  //   });
  // } catch (error) {
  //   runInAction(() => {
  //     this.error = 'Ошибка при удалении сотрудника';
  //     this.isLoading = false;
  //   });
  // }
 }

 updateStaffMember = async (id: string, updates: Partial<EmployeeFormData>) => {
  console.log('обновление сотрудника', id, updates)
  // try {
  //  this.isLoading = true
  //  const updatedMember = await employeeApi.update(id, updates)
  //  runInAction(() => {
  //   const index = this.staffMembers.findIndex((member) => member.id === id)
  //   if (index !== -1) {
  //    this.staffMembers[index] = updatedMember
  //   }
  //   this.isLoading = false
  //  })
  // } catch {
  //  runInAction(() => {
  //   this.error = 'Ошибка при обновлении данных сотрудника'
  //   this.isLoading = false
  //  })
  // }
 }
}

export const staffStore = new StaffStore()
