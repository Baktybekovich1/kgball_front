import { BrowserRouter } from './router';
import {
  StyledEngineProvider,
  ThemeProvider,
  createTheme,
} from '@mui/material';
import { QueryClientProvider as TanStackQueryClientProvider } from '@tanstack/react-query';
import { queryClient } from '~shared/lib/react-query/react-query.lib';
import { ToastContainer } from 'react-toastify';
import { Provider } from 'react-redux'; 
import { store} from "~shared/slices/store"

const theme = createTheme({
  typography: {
  },
});

function App() {
  return (
    <Provider store={store}> 
      <TanStackQueryClientProvider client={queryClient}>
        <StyledEngineProvider injectFirst>
          <ThemeProvider theme={theme}>
            <ToastContainer
              position="top-right"
              autoClose={1500}
              hideProgressBar
              pauseOnFocusLoss
              draggable
              pauseOnHover
              theme="colored"
            />
            <BrowserRouter />
          </ThemeProvider>
        </StyledEngineProvider>
      </TanStackQueryClientProvider>
    </Provider>
  );
}

export default App;
