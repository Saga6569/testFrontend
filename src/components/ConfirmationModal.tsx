import React from 'react'
import {
 Dialog,
 DialogContent,
 DialogTitle,
 Button,
 Box,
 Typography,
 IconButton,
} from '@mui/material'
import CloseIcon from '@mui/icons-material/Close'

export type ModalType = 'fire' | 'blocking' | 'delete' | 'CannotDelete'

interface ConfirmationModalProps {
 open: boolean
 onClose: () => void
 onConfirm: () => void

 typeModal: ModalType
}

const maping: Record<
 ModalType,
 { title: string; message: string; buttonName: string }
> = {
 fire: {
  title: 'Увольнение сотрудника',
  message:
   'Это действие будет невозможно отменить. Вы действительно хотите уволить сотрудника? Он навсегда потеряет доступ к своей учетной записи, если таковая была. Все созданные им документы и сделанные изменения в документах сохранятся. Также карточка данного сотрудника будет в нашей базе данных.',
  buttonName: 'Уволить',
 },
 blocking: {
  title: 'Блокировка сотрудника',
  message:
   'Это действие будет можно отменить. Вы действительно хотите заблокировать сотрудника? На время блокировки сотрудник потеряет доступ к своей учётной записи, если таковая существует. Все созданные им документы и сделанные изменения в документах сохранятся. Также карточка данного сотрудника будет храниться в вашей базе данных.',
  buttonName: 'Заблокировать',
 },
 delete: {
  title: 'Удаление карточки сотрудника',
  message:
   'Это действие будет невозможно отменить. Вы действительно хотите удалить карточку сотрудника? После этого сотрудник навсегда потеряет доступ к своей учетной записи, если таковая существует. Также карточка данного сотрудника будет безвозвратно удалена из вашей базы данных. Все созданные им документы и сделанные изменения в документах сохранятся.',
  buttonName: 'Удалить',
 },
 CannotDelete: {
  title: 'Невозможно удалить сотрудника',
  message:
   'Этот сотрудник назначен на роль ВКК. Пожалуйста, измените ответственного в разделе «Исполнительный орган», чтобы продолжить удаление',
  buttonName: 'Таб Исполнительный орган',
 },
}

const ConfirmationModal: React.FC<ConfirmationModalProps> = ({
 open,
 onClose,
 onConfirm,
 typeModal,
}) => {
 if (!typeModal) {
  return null
 }

 return (
  <Dialog
   open={open}
   onClose={onClose}
   maxWidth="xs"
   fullWidth
   PaperProps={{
    sx: {
     borderRadius: '8px',
     boxShadow: '0px 4px 12px rgba(0, 0, 0, 0.15)',
    },
   }}
   aria-labelledby="confirmation-dialog-title"
   disableEnforceFocus
   disableAutoFocus
   keepMounted
  >
   <Box sx={{ position: 'relative' }}>
    <IconButton
     onClick={onClose}
     sx={{
      position: 'absolute',
      right: 8,
      top: 8,
      color: 'rgba(0, 0, 0, 0.54)',
      padding: '4px',
     }}
     aria-label="close"
    >
     <CloseIcon sx={{ fontSize: 20 }} />
    </IconButton>

    <DialogTitle
     sx={{
      textAlign: 'center',
      pt: 3,
      pb: 1,
      fontSize: '1.25rem',
      fontWeight: 500,
     }}
    >
     {maping[typeModal].title}
    </DialogTitle>

    <DialogContent sx={{ pb: 3 }}>
     <Typography
      sx={{
       textAlign: 'center',
       color: 'rgba(0, 0, 0, 0.87)',
       mb: 3,
       px: 2,
      }}
     >
      {maping[typeModal].message}
     </Typography>

     <Box
      sx={{
       display: 'flex',
       gap: 1,
       px: 2,
      }}
     >
      <Button
       variant="contained"
       onClick={onConfirm}
       sx={{
        flex: 1,
        bgcolor: '#f5f5f5',
        color: 'rgba(0, 0, 0, 0.87)',
        boxShadow: 'none',
        '&:hover': {
         bgcolor: '#e0e0e0',
         boxShadow: 'none',
        },
       }}
      >
       {maping[typeModal].buttonName}
      </Button>
      <Button
       variant="contained"
       onClick={onClose}
       sx={{
        flex: 1,
        bgcolor: '#2196f3',
        color: '#fff',
        boxShadow: 'none',
        '&:hover': {
         bgcolor: '#1976d2',
         boxShadow: 'none',
        },
       }}
      >
       Отмена
      </Button>
     </Box>
    </DialogContent>
   </Box>
  </Dialog>
 )
}

export default ConfirmationModal
