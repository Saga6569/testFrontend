import { makeAutoObservable, runInAction } from 'mobx'
import { employeeApi, Department, Role, Position } from '../services/api'
import {
 Employee,
 EmployeeFormData,
 EmployeeFormDataAdd,
} from '../types/Employee'

class StaffStore {
 staffMembers: Employee[] = []
 selectedStaff: Pick<Employee, 'id' | 'name' | 'roles'>[] = []
 selectedRoles: string[] = []
 showDismissed: boolean = false
 showBlocked: boolean = false
 isLoading: boolean = false
 error: string | null = null
 departments: Department[] = []
 roles: Role[] = []
 positions: Position[] = []

 constructor() {
  makeAutoObservable(this)
 }

 fetchStaff = async () => {
  try {
   this.isLoading = true
   this.error = null
   const responsesStaff = await employeeApi.getAll()
   const responsesDepartments = await employeeApi.getDepartments()
   const responseRoles = await employeeApi.getRoles()
   const responsePositions = await employeeApi.getPositions()
   console.log(responsePositions)
   runInAction(() => {
    this.staffMembers = (
     responsesStaff.data as unknown as { items: Employee[] }
    ).items
    this.departments = responsesDepartments.data.items
    this.roles = responseRoles.data.items
    this.positions = responsePositions.data.items
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
   //  this.isLoading = true
   const newMember = await employeeApi.create(member)
   runInAction(() => {
    // this.isLoading = false
   })
  } catch (error) {
   console.log(error)
   runInAction(() => {
    // this.isLoading = false
   })
  }
 }

 removeStaffMember = async (id: string) => {
  console.log('сотрудника уволен', id)
  try {
   //  this.isLoading = true
   await employeeApi.delete(id)

   runInAction(() => {
    this.staffMembers = this.staffMembers.map((member) =>
     member.id !== id
      ? member
      : {
         ...member,
         status: { label: 'Уволен', value: 'dismissed' },
        }
    )
    // this.isLoading = false
   })
  } catch (error) {
   console.log(error)
   runInAction(() => {
    this.error = 'Ошибка при удалении сотрудника'
    this.isLoading = false
   })
  }
 }

 updateStaffMember = async (id: string, updates: Partial<EmployeeFormData>) => {
  try {
   //  this.isLoading = true
   const updatedMember = await employeeApi.update(id, updates)
   console.log(updatedMember)
   //  runInAction(() => {
   //   const index = this.staffMembers.findIndex((member) => member.id === id)
   //   if (index !== -1) {
   //    this.staffMembers[index] = updatedMember
   //   }
   //  })
  } catch (error) {
   console.log(error)
   //  runInAction(() => {
   //   this.error = 'Ошибка при обновлении данных сотрудника'
   //   this.isLoading = false
   //  })
  }
 }
}

export const staffStore = new StaffStore()
