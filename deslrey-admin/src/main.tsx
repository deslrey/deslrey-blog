import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom';

import '@fontsource/roboto/300.css';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';


import App from './App.tsx'
import { SnackbarProvider } from 'notistack';
import { SnackbarUtilsConfigurator } from './utils/message.tsx';

const containerElement = document.getElementById('root') as HTMLElement;

const root = createRoot(containerElement);

const element = (
  <BrowserRouter>
    <StrictMode>
      <SnackbarProvider maxSnack={3}>
        <SnackbarUtilsConfigurator />
        <App />
      </SnackbarProvider>
    </StrictMode>
  </BrowserRouter>
);

root.render(element);
