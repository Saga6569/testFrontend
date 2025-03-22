import React from 'react'
import { Autocomplete, Chip, TextField, Box, Checkbox } from '@mui/material'
import { observer } from 'mobx-react-lite'
import { staffStore } from '../store/StaffStore'
import { Employee } from '../models/Employee'

interface StaffSelectProps {
 selectedStaff: Employee[]
 onStaffChange: (newValue: Employee[]) => void
 selectedRoles: string[]
 onRolesChange: (newValue: string[]) => void
}

const StaffSelect: React.FC<StaffSelectProps> = observer(
 ({ selectedStaff, onStaffChange, selectedRoles, onRolesChange }) => {
  return (
   <Box sx={{ display: 'flex', gap: 2, width: '100%' }}>
    <Autocomplete<Employee, true>
     multiple
     disableCloseOnSelect
     options={staffStore.staffMembers}
     value={selectedStaff}
     onChange={(_, newValue) => onStaffChange(newValue)}
     getOptionLabel={(option: Employee) => option.name}
     isOptionEqualToValue={(option, value) => option.id === value.id}
     renderInput={(params) => (
      <TextField
       {...params}
       variant="outlined"
       placeholder="Выберите сотрудников"
      />
     )}
     renderOption={(props, option, { selected }) => (
      <li {...props}>
       <Box sx={{ display: 'flex', alignItems: 'center', width: '100%' }}>
        <Checkbox checked={selected} sx={{ mr: 1 }} />
        {option.name}
       </Box>
      </li>
     )}
     renderTags={(tagValue, getTagProps) =>
      tagValue.map((option, index) => (
       <Chip
        {...getTagProps({ index })}
        key={option.id}
        label={option.name}
        onDelete={() => {
         const newValue = selectedStaff.filter(
          (staff) => staff.id !== option.id
         )
         onStaffChange(newValue)
        }}
        sx={{
         mr: 0.5,
         backgroundColor: '#f0f0f0',
         '& .MuiChip-deleteIcon': {
          color: '#666',
          '&:hover': {
           color: '#000',
          },
         },
        }}
       />
      ))
     }
     sx={{
      flex: 1,
      '& .MuiOutlinedInput-root': {
       padding: '3px 8px',
      },
     }}
    />

    <Autocomplete<string, true>
     multiple
     disableCloseOnSelect
     options={[
      'Руководитель МО',
      'Уполномоченное лицо',
      'Администратор клиники'
     ]}
     value={selectedRoles}
     onChange={(_, newValue) => onRolesChange(newValue)}
     getOptionLabel={(option: string) => option}
     isOptionEqualToValue={(option, value) => option === value}
     renderInput={(params) => (
      <TextField {...params} variant="outlined" placeholder="Выберите роли" />
     )}
     renderOption={(props, option, { selected }) => (
      <li {...props}>
       <Box sx={{ display: 'flex', alignItems: 'center', width: '100%' }}>
        <Checkbox checked={selected} sx={{ mr: 1 }} />
        {option}
       </Box>
      </li>
     )}
     renderTags={(tagValue, getTagProps) =>
      tagValue.map((role, index) => (
       <Chip
        {...getTagProps({ index })}
        key={role}
        label={role}
        sx={{
         mr: 0.5,
         backgroundColor:
          role === 'Руководитель МО'
           ? '#ffcdd2'
           : role === 'Уполномоченное лицо'
             ? '#bbdefb'
             : role === 'Администратор клиники'
               ? '#fff9c4'
               : '#e0e0e0'
        }}
       />
      ))
     }
     sx={{
      flex: 1,
      '& .MuiOutlinedInput-root': {
       padding: '3px 8px'
      },
      '& .MuiAutocomplete-popper': {
        '& .MuiPaper-root': {
          boxShadow: '0px 2px 8px rgba(0,0,0,0.1)',
          borderRadius: 1
        }
      }
     }}
    />
   </Box>
  )
 }
)

export default StaffSelect
