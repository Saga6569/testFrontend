import React, { useEffect } from 'react'
import { observer } from 'mobx-react-lite'
import '../styles/Table.css'
import {
 Table,
 TableBody,
 TableCell,
 TableContainer,
 TableHead,
 TableRow,
 Paper,
 Checkbox,
 Button,
 Typography,
 Box,
 CircularProgress,
 Alert,
} from '@mui/material'
import { staffStore } from '../store/StaffStore'
import StaffSelect from './StaffSelect'
import StaffTableRow from './StaffTableRow'

import AddStaffModal from './AddStaffModal'

const StaffTable: React.FC = observer(() => {
 const [isAddModalOpen, setIsAddModalOpen] = React.useState(false)

 useEffect(() => {
  staffStore.fetchStaff()
 }, [])

 const handleOpenAddModal = () => {
  setIsAddModalOpen(true)
 }

 const handleCloseAddModal = () => {
  setIsAddModalOpen(false)
 }

 if (staffStore.isLoading) {
  return (
   <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
    <CircularProgress />
   </Box>
  )
 }

 if (staffStore.error) {
  return (
   <Box sx={{ p: 3 }}>
    <Alert severity="error">{staffStore.error}</Alert>
   </Box>
  )
 }

 return (
  <Box sx={{ p: 3 }}>
   <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
    <Typography variant="h5">Штатное расписание</Typography>
    <Button
     variant="contained"
     onClick={handleOpenAddModal}
     sx={{
      bgcolor: '#E3EDFB',
      color: '#000',
      '&:hover': { bgcolor: '#d0e1f9' },
     }}
    >
     Добавить сотрудника
    </Button>
   </Box>

   <Box sx={{ mb: 3 }}>
    <StaffSelect
     selectedStaff={staffStore.staffMembers.filter((member) =>
      staffStore.selectedStaff.some((selected) => selected.id === member.id)
     )}
     onStaffChange={staffStore.setSelectedStaff}
     selectedRoles={staffStore.selectedRoles}
     onRolesChange={staffStore.setSelectedRoles}
    />
   </Box>

   <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
    <Box sx={{ display: 'flex', alignItems: 'center' }}>
     <Checkbox />
     <Typography>Выбрать всех</Typography>
    </Box>
    <Box sx={{ display: 'flex', alignItems: 'center' }}>
     <Checkbox
      checked={staffStore.showDismissed}
      onChange={staffStore.toggleDismissed}
     />
     <Typography>Отображать уволенных</Typography>
    </Box>
    <Box sx={{ display: 'flex', alignItems: 'center' }}>
     <Checkbox
      checked={staffStore.showBlocked}
      onChange={staffStore.toggleBlocked}
     />
     <Typography>Отображать заблокированных</Typography>
    </Box>
   </Box>

   <TableContainer component={Paper}>
    <Table>
     <TableHead>
      <TableRow>
       <TableCell padding="checkbox"></TableCell>
       <TableCell className="table-cell cell-header">ФИО</TableCell>
       <TableCell className="table-cell cell-header">Телефон</TableCell>
       <TableCell className="table-cell cell-header">E-mail</TableCell>
       <TableCell className="table-cell cell-header">Пароль</TableCell>
       <TableCell className="table-cell cell-header">Отделение</TableCell>
       <TableCell className="table-cell cell-header">Должность</TableCell>
       <TableCell className="table-cell cell-header">Роль в ВКК</TableCell>
       <TableCell className="table-cell cell-header">Статус УЗ</TableCell>
       <TableCell className="table-cell cell-header">ПЭП</TableCell>
       <TableCell className="table-cell cell-header">Дата рег.</TableCell>
       <TableCell className="table-cell cell-header">Дата ув.</TableCell>
       <TableCell className="table-cell cell-header">Действия</TableCell>
      </TableRow>
     </TableHead>
     <TableBody>
      {staffStore.staffMembers.map((member) => (
       <StaffTableRow key={member.id} member={member} />
      ))}
     </TableBody>
    </Table>
   </TableContainer>
   <AddStaffModal open={isAddModalOpen} onClose={handleCloseAddModal} />
  </Box>
 )
})

export default StaffTable
