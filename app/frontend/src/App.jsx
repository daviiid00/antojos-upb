import { Navigate, Route, Routes } from 'react-router'
import Proximamente from './compartido/componentes/Proximamente.jsx'
import RegisterPage from './modulos/autenticacion/RegisterPage.jsx'
import WelcomePage from './modulos/autenticacion/WelcomePage.jsx'

function App() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/welcome" replace />} />
      <Route path="/welcome" element={<WelcomePage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route path="/login" element={<Proximamente titulo="Iniciar sesión" />} />
      <Route path="/home" element={<Proximamente titulo="Inicio" />} />
    </Routes>
  )
}

export default App
