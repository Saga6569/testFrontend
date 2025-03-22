import React from 'react'
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
} from '@mui/material'
import { ArrowBack } from '@mui/icons-material'
import DatePicker from 'react-datepicker'
import { ru } from 'date-fns/locale'
import 'react-datepicker/dist/react-datepicker.css'
import { useForm, Controller } from 'react-hook-form'
import * as yup from 'yup'
import { yupResolver } from '@hookform/resolvers/yup'
import { PatternFormat } from 'react-number-format'
import { Employee } from '../models/Employee'
import { InferType } from 'yup'

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

 const onSubmit = (data: IFormInput) => {
  console.log(data)
  // Здесь будет логика сохранения/обновления
  onClose()
 }

 return (
  <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
   <DialogTitle sx={{ p: 2, bgcolor: '#fff' }}>
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
   </DialogTitle>
   <DialogContent sx={{ p: 3 }}>
    <Box component="form" onSubmit={handleSubmit(onSubmit)} sx={{ mb: 4 }}>
     <Box component="h2" sx={{ fontSize: 24, fontWeight: 400, mb: 3 }}>
      Основные данные сотрудника
     </Box>
     <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2.5 }}>
      <Controller
       name="surname"
       control={control}
       render={({ field }) => (
        <TextField
         {...field}
         fullWidth
         label="Фамилия"
         placeholder="Введите Фамилию"
         size="small"
         error={!!errors.surname}
         helperText={errors.surname?.message}
         sx={{ bgcolor: '#fff' }}
        />
       )}
      />
      <Controller
       name="name"
       control={control}
       render={({ field }) => (
        <TextField
         {...field}
         fullWidth
         label="Имя"
         placeholder="Введите Имя"
         size="small"
         error={!!errors.name}
         helperText={errors.name?.message}
         sx={{ bgcolor: '#fff' }}
        />
       )}
      />
      <Controller
       name="patronymic"
       control={control}
       render={({ field }) => (
        <TextField
         {...field}
         fullWidth
         label="Отчество"
         placeholder="Введите Отчество"
         size="small"
         error={!!errors.patronymic}
         helperText={errors.patronymic?.message}
         sx={{ bgcolor: '#fff' }}
        />
       )}
      />
      <Box sx={{ display: 'flex', gap: 2 }}>
       <FormControl
        fullWidth
        size="small"
        sx={{ flex: '1 1 50%', bgcolor: '#fff' }}
        error={!!errors.adminPosition}
       >
        <InputLabel>Административная должность</InputLabel>
        <Controller
         name="adminPosition"
         control={control}
         render={({ field }) => (
          <Select {...field} label="Административная должность">
           <MenuItem value="head">Руководитель МО</MenuItem>
           <MenuItem value="admin">Администратор клиники</MenuItem>
          </Select>
         )}
        />
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
           value={field.value.filter(
            (role): role is string => role !== undefined
           )}
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
           <MenuItem value="Руководитель МО">Руководитель МО</MenuItem>
           <MenuItem value="Администратор клиники">
            Администратор клиники
           </MenuItem>
           <MenuItem value="Уполномоченное лицо">Уполномоченное лицо</MenuItem>
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
       <Controller
        name="medicalPosition"
        control={control}
        render={({ field }) => (
         <Select {...field} label="Медицинская должность">
          <MenuItem value="doctor">Врач</MenuItem>
          <MenuItem value="nurse">Медсестра</MenuItem>
         </Select>
        )}
       />
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
       <Controller
        name="department"
        control={control}
        render={({ field }) => (
         <Select {...field} label="Подразделение">
          <MenuItem value="therapy">Терапевтическое отделение</MenuItem>
          <MenuItem value="surgery">Хирургическое отделение</MenuItem>
         </Select>
        )}
       />
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
      <Controller
       name="email"
       control={control}
       render={({ field }) => (
        <TextField
         {...field}
         fullWidth
         label="E-mail"
         placeholder="Введите ваш E-mail"
         size="small"
         error={!!errors.email}
         helperText={errors.email?.message}
         sx={{ bgcolor: '#fff' }}
        />
       )}
      />
      <Controller
       name="hireDate"
       control={control}
       render={({ field }) => (
        <FormControl fullWidth error={!!errors.hireDate}>
         <DatePicker
          selected={field.value instanceof Date ? field.value : null}
          onChange={(date: Date | null) => field.onChange(date || new Date())}
          dateFormat="dd.MM.yyyy"
          locale={ru}
          placeholderText="Выберите дату"
          customInput={<TextField fullWidth error={!!errors.hireDate} />}
         />
         {errors.hireDate && (
          <FormHelperText>{errors.hireDate.message}</FormHelperText>
         )}
        </FormControl>
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
    </Box>
   </DialogContent>
  </Dialog>
 )
}

export default AddStaffModal
