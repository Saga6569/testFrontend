import React from 'react'
import { createPortal } from 'react-dom'
import {
 TableRow,
 TableCell,
 Checkbox,
 IconButton,
 Box,
 Tooltip,
 Button,
} from '@mui/material'
import {
 Edit as EditIcon,
 Delete as DeleteIcon,
 Lock as LockIcon,
 ContentCopy as CopyIcon,
} from '@mui/icons-material'
import { Employee } from '../models/Employee'
import ConfirmationModal, { ModalType } from './ConfirmationModal'
import AddStaffModal from './AddStaffModal'
import { staffStore } from '../store/StaffStore'

interface StaffTableRowProps {
 member: Employee
}

const StaffTableRow: React.FC<StaffTableRowProps> = ({ member }) => {
 const [phoneTooltipOpen, setPhoneTooltipOpen] = React.useState(false)
 const [emailTooltipOpen, setEmailTooltipOpen] = React.useState(false)
 const [dismissModalOpen, setDismissModalOpen] = React.useState(false)
 const [editModalOpen, setEditModalOpen] = React.useState(false)
 const [typeModal, setTypeModal] = React.useState<ModalType>('fire')

 const copyToClipboard = (text: string, type: 'phone' | 'email') => {
  navigator.clipboard.writeText(text)
  if (type === 'phone') {
   setPhoneTooltipOpen(true)
   setTimeout(() => setPhoneTooltipOpen(false), 2000)
  } else {
   setEmailTooltipOpen(true)
   setTimeout(() => setEmailTooltipOpen(false), 2000)
  }
 }

 const data = [
  ['Руководитель МО'],
  ['Уполномоченное лицо'],
  ['Администратор клиники'],
 ]

 const RenderRole = () => {
  if (data.length === 1) {
   return (
    <Box>
     {data.map((item: string[], index: number) => (
      <Box
       key={index}
       sx={{
        bgcolor:
         item[0] === 'Руководитель МО'
          ? '#ffcdd2'
          : item[0] === 'Ответственное лицо'
            ? '#e1bee7'
            : '#bbdefb',
        color: 'rgba(0, 0, 0, 0.87)',
        borderRadius: 1,
        px: 1,
        py: 0.5,
        fontSize: '0.875rem',
       }}
      >
       {item[0]}
      </Box>
     ))}
    </Box>
   )
  }
  if (data.length >= 2) {
   return (
    <Tooltip
     slotProps={{
      tooltip: {
       sx: {
        bgcolor: 'transparent',
        p: 0,
       },
      },
     }}
     title={
      <Box
       sx={{
        display: 'flex',
        flexDirection: 'column',
        gap: 1,
        bgcolor: 'white',
        p: 1,
        borderRadius: 1,
        boxShadow: '0px 2px 8px rgba(0,0,0,0.15)',
       }}
      >
       {data.map((item: string[], index: number) => (
        <Box
         key={index}
         sx={{
          bgcolor:
           item[0] === 'Руководитель МО'
            ? '#ffcdd2'
            : item[0] === 'Ответственное лицо'
              ? '#e1bee7'
              : '#bbdefb',
          color: 'rgba(0, 0, 0, 0.87)',
          borderRadius: 1,
          px: 1,
          py: 0.5,
          fontSize: '0.875rem',
          whiteSpace: 'nowrap',
         }}
        >
         {item[0]}
        </Box>
       ))}
      </Box>
     }
    >
     <Box
      sx={{
       bgcolor: '#e0e0e0',
       color: 'rgba(0, 0, 0, 0.87)',
       borderRadius: 1,
       px: 1,
       py: 0.5,
       fontSize: '0.875rem',
       cursor: 'pointer',
      }}
     >
      Несколько ролей
     </Box>
    </Tooltip>
   )
  }
  return null
 }

 const handleDismiss = () => {
  setDismissModalOpen(false)
 }

 const tableRowContent = (
  <TableRow key={member.id}>
   <TableCell padding="checkbox">
    <Checkbox />
   </TableCell>
   <TableCell className="table-cell">
    <Tooltip
     title={member.name + ' ' + member.surname + ' ' + member.patronymic}
     placement="top"
    >
     <div className="table-item">
      {member.name + ' ' + member.surname + ' ' + member.patronymic}
     </div>
    </Tooltip>
   </TableCell>
   <TableCell className="table-cell cell-copy">
    <div className="items-copy">
     <div className="table-item">
      {member.phone.replace(
       /^\+?(\d)(\d{3})(\d{3})(\d{2})(\d{2})$/,
       '+$1($2)$3-$4-$5'
      )}
     </div>
     <Tooltip title="Скопировано" placement="top" open={phoneTooltipOpen}>
      <button
       style={{
        background: 'transparent',
        border: 'none',
        padding: '0px 10px 0px 10px',
       }}
       onClick={() => copyToClipboard(member.phone, 'phone')}
      >
       <CopyIcon
        style={{
         width: '15px',
         height: '15px',
         stroke: '#A3A3A3',
        }}
       />
      </button>
     </Tooltip>
    </div>
   </TableCell>
   <TableCell className="table-cell cell-copy">
    <div className="items-copy">
     <div className="table-item">{member.email}</div>
     <Tooltip title="Скопировано" placement="top" open={emailTooltipOpen}>
      <button
       style={{
        background: 'transparent',
        border: 'none',
        padding: '0px 10px 0px 10px',
       }}
       onClick={() => copyToClipboard(member.email, 'email')}
      >
       <CopyIcon
        style={{
         width: '15px',
         height: '15px',
         stroke: '#A3A3A3',
        }}
       />
      </button>
     </Tooltip>
    </div>
   </TableCell>
   <TableCell className="table-cell">
    <div className="table-item">{member.password ?? '*******'}</div>
   </TableCell>
   <TableCell className="table-cell">
    <Tooltip
     title={`должность: ${member.medical_position?.label ?? 'неизвестна'}`}
     placement="top"
     arrow
    >
     <div className="table-item">
      {member.department?.label ?? 'данные отсутствуют'}
     </div>
    </Tooltip>
   </TableCell>
   <TableCell className="table-cell">
    <div className="table-item">{member.medical_position?.label}</div>
   </TableCell>
   <TableCell className="table-cell">
    <Box sx={{ display: 'flex', gap: 0.5, flexWrap: 'wrap' }}>
     <RenderRole />
    </Box>
   </TableCell>
   <TableCell className="table-cell">
    <div className="table-item">{member.status.label}</div>
   </TableCell>
   <TableCell padding="checkbox">
    <Checkbox />
   </TableCell>
   <TableCell className="table-cell">
    <div
     style={{
      color: 'rgba(0, 0, 0, 0.87)',
      fontSize: '0.875rem',
      fontFamily: '"Roboto","Helvetica","Arial",sans-serif',
      fontWeight: 400,
      lineHeight: 1.43,
     }}
    >
     <div className="table-item">
      {new Date(+member.hired_at * 1000).toLocaleDateString('ru')}
     </div>
    </div>
   </TableCell>
   <TableCell className="table-cell">
    <div
     style={{
      color: 'rgba(0, 0, 0, 0.87)',
      fontSize: '0.875rem',
      fontFamily: '"Roboto","Helvetica","Arial",sans-serif',
      fontWeight: 400,
      lineHeight: 1.43,
     }}
    >
     <div className="table-item">
      {member.fired_at === null
       ? 'работает'
       : new Date(+member.fired_at * 1000).toLocaleDateString('ru')}
     </div>
    </div>
   </TableCell>

   <TableCell className="table-cell">
    {member.status.label === 'Активен' && (
     <Button
      variant="contained"
      onClick={() => {
       setTypeModal('fire')
       setDismissModalOpen(true)
      }}
      data-testid="fire-button"
      sx={{
       marginRight: '20px',
       bgcolor: '#FFF2F2',
       color: '#000',
       '&:hover': { bgcolor: '#FFE5E5' },
       textTransform: 'none',
       py: 1,
       minWidth: 'auto',
       borderRadius: '10px',
       width: '100px',
      }}
     >
      Уволить
     </Button>
    )}
    <IconButton
     size="small"
     onClick={() => setEditModalOpen(true)}
     aria-label="Редактировать сотрудника"
    >
     <EditIcon />
    </IconButton>
    <IconButton
     size="small"
     onClick={() => {
      setTypeModal('delete')
      staffStore.removeStaffMember(member.id)
      setDismissModalOpen(true)
     }}
     data-testid="delete-button"
     aria-label="Удалить сотрудника"
    >
     <DeleteIcon />
    </IconButton>
    <IconButton
     size="small"
     onClick={() => {
      setTypeModal('blocking')
      setDismissModalOpen(true)
     }}
     aria-label="Заблокировать сотрудника"
    >
     <LockIcon />
    </IconButton>
   </TableCell>
  </TableRow>
 )

 return (
  <>
   {tableRowContent}
   {createPortal(
    <>
     <ConfirmationModal
      open={dismissModalOpen}
      onClose={() => setDismissModalOpen(false)}
      onConfirm={handleDismiss}
      typeModal={typeModal}
      data-testid="confirmation-modal"
     />
     <AddStaffModal
      open={editModalOpen}
      onClose={() => setEditModalOpen(false)}
      initialData={member}
      isEdit
     />
    </>,
    document.getElementById('modal-root') || document.body
   )}
  </>
 )
}

export default StaffTableRow
