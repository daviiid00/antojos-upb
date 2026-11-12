import { Navigate, Route, Routes } from 'react-router'
import Proximamente from './compartido/componentes/Proximamente.jsx'
import LoginPage from './modulos/autenticacion/LoginPage.jsx'
import RegisterPage from './modulos/autenticacion/RegisterPage.jsx'
import WelcomePage from './modulos/autenticacion/WelcomePage.jsx'
import CatalogPage from './modulos/catalogo/CatalogPage.jsx'
import HomePage from './modulos/inicio/HomePage.jsx'

function App() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/welcome" replace />} />
      <Route path="/welcome" element={<WelcomePage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route path="/explorar" element={<CatalogPage />} />
      <Route
        path="/producto/:id"
        element={<Proximamente titulo="Detalle del producto" />}
      />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/home" element={<HomePage />} />
    </Routes>
  )
}

export default App
