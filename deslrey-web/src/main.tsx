import { StrictMode } from 'react'
import { BrowserRouter } from 'react-router'
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import { SnackbarProvider } from 'notistack'
import { SnackbarUtilsConfigurator } from './utils/ui'

import './styles/global/global.scss'
import './styles/base.scss'
import './styles/card/card.scss'
import 'bytemd/dist/index.css'
import ThemeProvider from './components/ThemeProvider/index.tsx'
import BgSeriesProvider from './components/BgSeriesProvider/index.tsx'
import AppLayout from './pages/Layout.tsx'

const element = (
  <BrowserRouter>
    <StrictMode>
      <ThemeProvider>
        <BgSeriesProvider>
          <SnackbarProvider maxSnack={3}>
            <SnackbarUtilsConfigurator />
            <AppLayout>
              <App />
            </AppLayout>
          </SnackbarProvider>
        </BgSeriesProvider>
      </ThemeProvider>
    </StrictMode>
  </BrowserRouter>
)

createRoot(document.getElementById('root')!).render(element)
