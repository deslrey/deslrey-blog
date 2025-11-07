import { StrictMode } from 'react'
import { BrowserRouter } from 'react-router'
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import { SnackbarProvider } from 'notistack'
import { SnackbarUtilsConfigurator } from './utils/message.tsx'

import './styles/global/global.scss'
import './styles/base.scss'
import Nav from './web/components/NavComponents/index.tsx'
import ThemeProvider from './web/components/ThemeProvider/index.tsx'
import BgSeriesProvider from './web/components/BgSeriesProvider/index.tsx'
import ColorProvider from './web/components/ColorProvider/index.tsx'

const element = (
  <BrowserRouter>
    <StrictMode>
      <ThemeProvider>
        <BgSeriesProvider>
          <SnackbarProvider maxSnack={3}>
            <SnackbarUtilsConfigurator />
            <ColorProvider>
              <Nav />
              <App />
            </ColorProvider>
          </SnackbarProvider>
        </BgSeriesProvider>
      </ThemeProvider>
    </StrictMode>
  </BrowserRouter>
)

createRoot(document.getElementById('root')!).render(element)
