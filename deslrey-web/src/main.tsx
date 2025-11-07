import { StrictMode } from 'react'
import { BrowserRouter } from 'react-router'
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import { SnackbarProvider } from 'notistack'
import { SnackbarUtilsConfigurator } from './utils/message.tsx'

const element = (
  <BrowserRouter>
    <StrictMode>
      <SnackbarProvider maxSnack={3}>
        <SnackbarUtilsConfigurator />
        <App />
      </SnackbarProvider>
    </StrictMode>
  </BrowserRouter>
)

createRoot(document.getElementById('root')!).render(element)
