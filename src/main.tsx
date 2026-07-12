import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import './styles/tokens.css'
import './styles/global.css'
import App from './App.tsx'
import { I18nProvider } from './i18n/I18nContext.tsx'
import { SeoOverrideProvider } from './components/seo/SeoOverrideContext.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <I18nProvider>
        <SeoOverrideProvider>
          <App />
        </SeoOverrideProvider>
      </I18nProvider>
    </BrowserRouter>
  </StrictMode>,
)
