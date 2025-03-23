import { CssBaseline, ThemeProvider, createTheme } from '@mui/material';
import StaffTable from './components/StaffTable';
import './styles/index.css';

const theme = createTheme({
  palette: {
    primary: {
      main: '#1976d2',
    },
  },
});

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <StaffTable />
    </ThemeProvider>
  );
}

export default App;
