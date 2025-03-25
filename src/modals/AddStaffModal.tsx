import React, { FormEvent, useState } from 'react'
import {
 Dialog,
 DialogTitle,
 DialogContent,
 TextField,
 Button,
 Box,
 IconButton,
 Select,
 MenuItem,
 FormControl,
 InputLabel,
 FormHelperText,
 Modal,
 Typography,
} from '@mui/material'
import { ArrowBack, Close } from '@mui/icons-material'
import DatePicker from 'react-datepicker'
import { ru } from 'date-fns/locale'
import { useForm, Controller } from 'react-hook-form'
import * as yup from 'yup'
import { yupResolver } from '@hookform/resolvers/yup'
import { PatternFormat } from 'react-number-format'
import {
 Employee,
 EmployeeFormDataAdd,
 EmployeeFormData,
} from '../types/Employee'
import { InferType } from 'yup'
import { staffStore } from '../store/StaffStore'

interface AddStaffModalProps {
 open: boolean
 onClose: () => void
 initialData?: Employee
 isEdit?: boolean
}

const validationSchema = yup.object({
 phone: yup.string().required('Введите телефон'),
 email: yup.string().email('Неверный формат email').required('Введите email'),
 name: yup.string().required('Введите имя'),
 surname: yup.string().required('Введите фамилию'),
 patronymic: yup.string().required('Введите отчество'),
 adminPosition: yup.string().required('Выберите административную должность'),
 roles: yup.array().of(yup.string()).min(1, 'Выберите роли').defined(),
 medicalPosition: yup.string().required('Выберите медицинскую должность'),
 department: yup.string().required('Выберите отделение'),
 hireDate: yup.date().defined().required('Выберите дату приема'),
})

type IFormInput = InferType<typeof validationSchema>

const AddStaffModal: React.FC<AddStaffModalProps> = ({
 open,
 onClose,
 initialData,
 isEdit = false,
}) => {
 const {
  register,
  control,
  handleSubmit,
  formState: { errors },
  reset,
 } = useForm<IFormInput>({
  defaultValues: initialData
   ? {
      phone: initialData.phone,
      email: initialData.email,
      name: initialData.name,
      surname: initialData.surname,
      patronymic: initialData.patronymic,
      adminPosition: initialData.adminPosition || '',
      roles: initialData.roles || [],
      medicalPosition: initialData.medical_position?.value || '',
      department: initialData.department?.value || '',
      hireDate: new Date(+initialData.hired_at * 1000),
     }
   : {
      phone: '',
      email: '',
      name: '',
      surname: '',
      patronymic: '',
      adminPosition: '',
      roles: [],
      medicalPosition: '',
      department: '',
      hireDate: new Date(),
     },
  resolver: yupResolver<IFormInput>(validationSchema),
 })

 const [notification, setNotification] = useState({
  open: false,
  message: '',
 })

 function stopPropagate(callback: (event: FormEvent<HTMLFormElement>) => void) {
  return (e: FormEvent<HTMLFormElement>) => {
   e.stopPropagation()
   callback(e)
  }
 }

 React.useEffect(() => {
  if (initialData && isEdit) {
   reset({
    surname: initialData.surname,
    name: initialData.name,
    patronymic: initialData.patronymic,
    adminPosition: initialData.adminPosition,
    roles:
     initialData.roles?.filter((role): role is string => role !== undefined) ||
     [],
    medicalPosition: initialData.medical_position?.value,
    department: initialData.department?.value,
    phone: initialData.phone,
    email: initialData.email,
    hireDate: initialData.hired_at
     ? new Date(initialData.hired_at * 1000)
     : undefined,
   })
  }
 }, [initialData, isEdit, reset])

 const handleCloseNotification = () => {
  setNotification({ ...notification, open: false })
 }

 const onSubmit = async (data: IFormInput) => {
  try {
   if (isEdit && initialData) {
    const updateData: Partial<EmployeeFormData> = {
     name: data.name,
     surname: data.surname,
     patronymic: data.patronymic,
     email: data.email,
     phone: data.phone,
     department: data.department,
     administrative_position: data.adminPosition,
     medical_position: data.medicalPosition,
     is_simple_digital_sign_enabled: false,
     hired_at: data.hireDate.getTime() / 1000,
    }
    await staffStore.updateStaffMember(initialData.id, updateData)
    setNotification({ ...notification, open: true })
    staffStore.statusResponse === 'success' && setTimeout(() => onClose(), 1000)
   } else {
    const newData: EmployeeFormDataAdd = {
     name: data.name,
     surname: data.surname,
     patronymic: data.patronymic,
     email: data.email,
     phone: data.phone,
     department: data.department,
     administrative_position: data.adminPosition,
     medical_position: data.medicalPosition,
     is_simple_digital_sign_enabled: false,
     hired_at: data.hireDate.getTime() / 1000,
    }
    await staffStore.addStaffMember(newData)

    setNotification({ ...notification, open: true })
    staffStore.statusResponse === 'success' &&
     setTimeout(() => {
      onClose()
      reset()
     }, 1000)
   }
  } catch (error) {
   console.log(error)
  }
 }

 return (
  <>
   <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
    <DialogTitle sx={{ p: 2, bgcolor: '#fff' }}>
     <Box
      sx={{
       display: 'flex',
       alignItems: 'center',
       justifyContent: 'space-between',
      }}
     >
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
       <IconButton onClick={onClose} size="small">
        <ArrowBack />
       </IconButton>
       <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
        <Box component="span" sx={{ color: '#666' }}>
         Персонал
        </Box>
        <Box component="span" sx={{ color: '#666' }}>
         /
        </Box>
        <Box component="span">
         {isEdit ? 'Редактирование сотрудника' : 'Добавление нового сотрудника'}
        </Box>
       </Box>
      </Box>
      <IconButton onClick={onClose} size="small" sx={{ ml: 2 }}>
       <Close />
      </IconButton>
     </Box>
    </DialogTitle>
    <DialogContent sx={{ p: 3 }}>
     <form
      onSubmit={stopPropagate(handleSubmit(onSubmit))}
      style={{ marginBottom: '32px' }}
     >
      <Box component="h2" sx={{ fontSize: 24, fontWeight: 400, mb: 3 }}>
       Основные данные сотрудника
      </Box>
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2.5 }}>
       <TextField
        {...register('surname')}
        fullWidth
        label="Фамилия"
        placeholder="Введите Фамилию"
        size="small"
        error={!!errors.surname}
        helperText={errors.surname?.message}
        sx={{ bgcolor: '#fff' }}
       />
       <TextField
        {...register('name')}
        fullWidth
        label="Имя"
        placeholder="Введите Имя"
        size="small"
        error={!!errors.name}
        helperText={errors.name?.message}
        sx={{ bgcolor: '#fff' }}
       />
       <TextField
        {...register('patronymic')}
        fullWidth
        label="Отчество"
        placeholder="Введите Отчество"
        size="small"
        error={!!errors.patronymic}
        helperText={errors.patronymic?.message}
        sx={{ bgcolor: '#fff' }}
       />
       <Box sx={{ display: 'flex', gap: 2 }}>
        <FormControl
         fullWidth
         size="small"
         sx={{ flex: '1 1 50%', bgcolor: '#fff' }}
         error={!!errors.adminPosition}
        >
         <InputLabel>Административная должность</InputLabel>
         <Select
          {...register('adminPosition')}
          label="Административная должность"
         >
          {staffStore.positions
           .filter((position) => position.type === 'administrative')
           .map((position) => (
            <MenuItem key={position.id} value={position.value}>
             {position.label}
            </MenuItem>
           ))}
         </Select>
         {errors.adminPosition && (
          <FormHelperText>{errors.adminPosition.message}</FormHelperText>
         )}
        </FormControl>
        <FormControl
         fullWidth
         size="small"
         sx={{ flex: '1 1 50%', bgcolor: '#fff' }}
         error={!!errors.roles}
        >
         <InputLabel>Роли</InputLabel>
         <Controller
          name="roles"
          control={control}
          render={({ field }) => (
           <Select
            {...field}
            multiple
            label="Роли"
            value={
             field.value?.filter((v): v is string => v !== undefined) || []
            }
            renderValue={(selected: string[]) => (
             <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
              {selected.map((value: string) => (
               <Box
                key={value}
                sx={{
                 bgcolor:
                  value === 'Руководитель МО'
                   ? '#ffcdd2'
                   : value === 'Администратор клиники'
                     ? '#fff9c4'
                     : '#bbdefb',
                 borderRadius: 1,
                 px: 1,
                 py: 0.5,
                 fontSize: '0.875rem',
                }}
               >
                {value}
               </Box>
              ))}
             </Box>
            )}
           >
            {staffStore.roles.map((role) => (
             <MenuItem key={role.id} value={role.label}>
              {role.label}
             </MenuItem>
            ))}
           </Select>
          )}
         />
         {errors.roles && (
          <FormHelperText>{errors.roles.message}</FormHelperText>
         )}
        </FormControl>
       </Box>
       <FormControl
        fullWidth
        size="small"
        error={!!errors.medicalPosition}
        sx={{ bgcolor: '#fff' }}
       >
        <InputLabel>Медицинская должность</InputLabel>
        <Select {...register('medicalPosition')} label="Медицинская должность">
         {staffStore.positions
          .filter((position) => position.type === 'medical')
          .map((position) => (
           <MenuItem key={position.id} value={position.value}>
            {position.label}
           </MenuItem>
          ))}
        </Select>
        {errors.medicalPosition && (
         <FormHelperText>{errors.medicalPosition.message}</FormHelperText>
        )}
       </FormControl>
       <FormControl
        fullWidth
        size="small"
        error={!!errors.department}
        sx={{ bgcolor: '#fff' }}
       >
        <InputLabel>Подразделение</InputLabel>
        <Select {...register('department')} label="Подразделение">
         {staffStore.departments.map((department) => (
          <MenuItem key={department.id} value={department.value}>
           {department.label}
          </MenuItem>
         ))}
        </Select>
        {errors.department && (
         <FormHelperText>{errors.department.message}</FormHelperText>
        )}
       </FormControl>
       <Controller
        name="phone"
        control={control}
        render={({ field: { onChange, value } }) => (
         <PatternFormat
          format="+7 (###) ###-##-##"
          mask="_"
          customInput={TextField}
          value={value}
          onValueChange={(values) => {
           onChange(values.formattedValue)
          }}
          fullWidth
          label="Телефон"
          placeholder="+7 (###) ###-##-##"
          size="small"
          error={!!errors.phone}
          helperText={errors.phone?.message || 'Формат: +7 (###) ###-##-##'}
          sx={{ bgcolor: '#fff' }}
         />
        )}
       />
       <TextField
        {...register('email')}
        fullWidth
        label="E-mail"
        placeholder="Введите ваш E-mail"
        size="small"
        error={!!errors.email}
        helperText={errors.email?.message}
        sx={{ bgcolor: '#fff' }}
       />
       <Controller
        name="hireDate"
        control={control}
        render={({ field }) => (
         <DatePicker
          selected={field.value instanceof Date ? field.value : null}
          onChange={(date: Date | null) => field.onChange(date || new Date())}
          dateFormat="dd.MM.yyyy"
          locale={ru}
          // maxDate={new Date(new Date().setDate(new Date().getDate() - 1))}
          placeholderText="Выберите дату приема на работу"
          disabled={isEdit}
          customInput={
           <TextField
            fullWidth
            error={!!errors.hireDate}
            label="Дата приема на работу"
            helperText={
             errors.hireDate?.message ||
             'Укажите дату, когда сотрудник начал работу в организации'
            }
            disabled={isEdit}
           />
          }
         />
        )}
       />
      </Box>
      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 3 }}>
       <Button
        type="submit"
        variant="contained"
        sx={{
         bgcolor: '#E3EDFB',
         color: '#000',
         '&:hover': { bgcolor: '#d0e1f9' },
         width: '100%',
         borderRadius: 2,
         textTransform: 'none',
         py: 1.5,
        }}
       >
        Сохранить изменения
       </Button>
      </Box>
     </form>
    </DialogContent>
   </Dialog>
   <Modal
    open={notification.open}
    onClose={handleCloseNotification}
    aria-labelledby="notification-modal"
    aria-describedby="notification-description"
   >
    <Box
     sx={{
      position: 'absolute',
      top: '50%',
      left: '50%',
      transform: 'translate(-50%, -50%)',
      width: 400,
      bgcolor: 'background.paper',
      boxShadow: 24,
      p: 4,
      borderRadius: 2,
      textAlign: 'center',
      border:
       staffStore.statusResponse === 'success'
        ? '2px solid #4caf50'
        : '2px solid #f44336',
     }}
    >
     <Typography
      variant="h6"
      component="h2"
      sx={{
       color: staffStore.statusResponse === 'success' ? '#4caf50' : '#f44336',
       mb: 2,
      }}
     >
      {staffStore.statusResponse === 'success' ? 'Успешно!' : 'Ошибка!'}
     </Typography>
     <Typography sx={{ mt: 2 }}>{staffStore.massage}</Typography>
    </Box>
   </Modal>
  </>
 )
}

export default AddStaffModal
