import React from 'react'
import { render, screen, fireEvent } from '@testing-library/react'
import { Table, TableBody } from '@mui/material'
import StaffTableRow from '../src/components/StaffTableRow'
import { staffStore } from '../src/store/StaffStore'

// Мокаем store и модальные окна
jest.mock('../src/store/StaffStore', () => ({
 staffStore: {
  removeStaffMember: jest.fn(),
 },
}))

jest.mock('../src/modals/AddStaffModal', () => ({
 __esModule: true,
 default: () => null,
}))

jest.mock('../src/modals/ConfirmationModal', () => ({
 __esModule: true,
 default: ({ open }: { open: boolean }) =>
  open ? (
   <div data-testid="confirmation-modal">Mock Confirmation Modal</div>
  ) : null,
}))

const mockEmployee = {
 id: '1',
 name: 'Иван',
 surname: 'Иванов',
 patronymic: 'Иванович',
 phone: '+79001234567',
 email: 'ivan@example.com',
 password: 'password123',
 department: { label: 'Отдел разработки', value: 'dev' },
 medical_position: { label: 'Разработчик', value: 'developer' },
 status: { label: 'Активен', value: 'active' },
 roles: ['Руководитель МО', 'Администратор клиники'],
 hired_at: 1640995200, // 01.01.2022
 fired_at: null,
}

const renderWithTable = (ui: React.ReactElement) => {
 return render(
  <div>
   <Table>
    <TableBody>{ui}</TableBody>
   </Table>
   <div id="modal-root" />
  </div>
 )
}

describe('StaffTableRow', () => {
 beforeEach(() => {
  jest.clearAllMocks()
 })

 it('отображает данные сотрудника корректно', () => {
  renderWithTable(<StaffTableRow member={mockEmployee} />)

  // Проверяем основные данные
  expect(screen.getByText('Иван Иванов Иванович')).toBeInTheDocument()
  expect(screen.getByText('+7(900)123-45-67')).toBeInTheDocument()
  expect(screen.getByText('ivan@example.com')).toBeInTheDocument()
  expect(screen.getByText('Отдел разработки')).toBeInTheDocument()
  expect(screen.getByText('Разработчик')).toBeInTheDocument()
  expect(screen.getByText('Активен')).toBeInTheDocument()
  expect(screen.getByText('01.01.2022')).toBeInTheDocument()
  expect(screen.getByText('работает')).toBeInTheDocument()
 })

 it('отображает кнопку "Уволить" для активного сотрудника', () => {
  renderWithTable(<StaffTableRow member={mockEmployee} />)
  expect(screen.getByTestId('fire-button')).toBeInTheDocument()
 })

 it('не отображает кнопку "Уволить" для неактивного сотрудника', () => {
  const inactiveEmployee = {
   ...mockEmployee,
   status: { label: 'Неактивен', value: 'inactive' },
  }
  renderWithTable(<StaffTableRow member={inactiveEmployee} />)
  expect(screen.queryByTestId('fire-button')).not.toBeInTheDocument()
 })

 it('вызывает removeStaffMember при нажатии на кнопку удаления', () => {
  renderWithTable(<StaffTableRow member={mockEmployee} />)
  const fireButton = screen.getByTestId('fire-button')
  fireEvent.click(fireButton)
  expect(screen.getByTestId('confirmation-modal')).toBeInTheDocument()
 })

 it('открывает модальное окно подтверждения при нажатии на кнопку увольнения', () => {
  renderWithTable(<StaffTableRow member={mockEmployee} />)
  const fireButton = screen.getByTestId('fire-button')
  fireEvent.click(fireButton)
  expect(screen.getByTestId('confirmation-modal')).toBeInTheDocument()
 })
})
