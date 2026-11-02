import { Navigate, Route, Routes } from 'react-router'
import Proximamente from './compartido/componentes/Proximamente.jsx'

function App() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/welcome" replace />} />
      <Route path="/welcome" element={<Proximamente titulo="Bienvenida" />} />
      <Route path="/register" element={<Proximamente titulo="Crear cuenta" />} />
      <Route path="/login" element={<Proximamente titulo="Iniciar sesión" />} />
      <Route path="/home" element={<Proximamente titulo="Inicio" />} />
    </Routes>
  )
}

export default App
