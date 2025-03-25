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
 statusResponse: 'success' | 'failed' | null = null
 massage: string | null = null
 constructor() {
  makeAutoObservable(this)
 }

 fetchStaff = async () => {
  try {
   runInAction(() => {
    this.isLoading = true
    this.error = null
   })

   const responsesStaff = await employeeApi.getAll()
   const responsesDepartments = await employeeApi.getDepartments()
   const responseRoles = await employeeApi.getRoles()
   const responsePositions = await employeeApi.getPositions()

   runInAction(() => {
    this.staffMembers = (
     responsesStaff.data as unknown as { items: Employee[] }
    ).items
    this.departments = responsesDepartments.data.items
    this.roles = responseRoles.data.items
    this.positions = responsePositions.data.items
    this.isLoading = false
    this.statusResponse = 'success'
   })
  } catch (error) {
   runInAction(() => {
    this.error = 'Ошибка при загрузке данных'
    this.isLoading = false
    this.statusResponse = 'failed'
   })
  }
 }

 setSelectedStaff = (staff: Pick<Employee, 'id' | 'name' | 'roles'>[]) => {
  runInAction(() => {
   this.selectedStaff = staff
  })
 }

 setSelectedRoles = (roles: string[]) => {
  runInAction(() => {
   this.selectedRoles = roles
  })
 }

 toggleDismissed = () => {
  runInAction(() => {
   this.showDismissed = !this.showDismissed
  })
 }

 toggleBlocked = () => {
  runInAction(() => {
   this.showBlocked = !this.showBlocked
  })
 }

 addStaffMember = async (member: EmployeeFormDataAdd) => {
  console.log('addStaffMember')
  try {
   const newMember = await employeeApi.create(member)
   if (Object.prototype.hasOwnProperty.call(newMember, 'errors')) {
    console.log(newMember, ' newMember failed')
    runInAction(() => {
     this.statusResponse = 'failed'
     this.massage = Object.entries(newMember.errors)
      .map(([key, value]) => `${key}: ${value}`)
      .join('\n')
    })
   }
   if (!Object.prototype.hasOwnProperty.call(newMember, 'errors')) {
    console.log(newMember, ' newMember success')
    runInAction(() => {
     this.statusResponse = 'success'
     this.massage = `Сотрудник успешно добавлен id: ${newMember.data.id}`
    })
   }
  } catch (error) {
   runInAction(() => {
    this.statusResponse = 'failed'
    console.log(error)
   })
  }
 }

 removeStaffMember = async (id: string) => {
  console.log('сотрудника уволен', id)
  try {
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
  console.log('updateStaffMember')
  try {
   //  this.isLoading = true
   const updatedMember = await employeeApi.update(id, updates)

   if (Object.prototype.hasOwnProperty.call(updatedMember, 'errors')) {
    runInAction(() => {
     this.statusResponse = 'failed'
     this.massage = Object.entries(updatedMember.errors)
      .map(([key, value]) => `${key}: ${value}`)
      .join('\n')
    })
   }
   if (!Object.prototype.hasOwnProperty.call(updatedMember, 'errors')) {
    console.log(updatedMember, ' updatedMember success')
    runInAction(() => {
     this.statusResponse = 'success'
     this.massage = `Сотрудник успешно обновлен id: ${id}`
     this.staffMembers = this.staffMembers.map((member) =>
      member.id === id ? updatedMember : member
     )
    })
   }
  } catch (error) {
   runInAction(() => {
    this.statusResponse = 'failed'
    console.log(error)
   })
   return error
  }
 }
}

export const staffStore = new StaffStore()
