import { Navigate, Route, Routes } from 'react-router'
import AppLayout from './compartido/componentes/AppLayout.jsx'
import Proximamente from './compartido/componentes/Proximamente.jsx'
import RegisterPage from './modulos/autenticacion/RegisterPage.jsx'
import WelcomePage from './modulos/autenticacion/WelcomePage.jsx'
import CatalogPage from './modulos/catalogo/CatalogPage.jsx'

function App() {
  return (
    <Routes>
      {/* Pantallas SIN barra de navegación */}
      <Route path="/" element={<Navigate to="/welcome" replace />} />
      <Route path="/welcome" element={<WelcomePage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route path="/login" element={<Proximamente titulo="Iniciar sesión" />} />

      {/* Inicio es del release 2: por ahora /home lleva a Explorar */}
      <Route path="/home" element={<Navigate to="/explorar" replace />} />

      {/* Pantallas CON barra de navegación */}
      <Route element={<AppLayout />}>
        <Route path="/explorar" element={<CatalogPage />} />
        <Route
          path="/producto/:id"
          element={<Proximamente titulo="Detalle del producto" />}
        />
        <Route path="/publicar" element={<Proximamente titulo="Publicar" />} />
        <Route
          path="/solicitudes"
          element={<Proximamente titulo="Solicitudes" />}
        />
        <Route path="/perfil" element={<Proximamente titulo="Perfil" />} />
      </Route>
    </Routes>
  )
}

export default App