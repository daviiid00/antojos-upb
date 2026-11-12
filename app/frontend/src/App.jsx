import { Navigate, Route, Routes } from 'react-router'
import AppLayout from './compartido/componentes/AppLayout.jsx'
import Proximamente from './compartido/componentes/Proximamente.jsx'
import LoginPage from './modulos/autenticacion/LoginPage.jsx'
import RegisterPage from './modulos/autenticacion/RegisterPage.jsx'
import WelcomePage from './modulos/autenticacion/WelcomePage.jsx'
import CatalogPage from './modulos/catalogo/CatalogPage.jsx'
import HomePage from './modulos/inicio/HomePage.jsx'
import PublicarProductoPage from './modulos/publicarProducto/PublicarProductoPage.jsx'
import ProductDetailContainer from './modulos/producto/ProductDetailContainer.jsx'

function App() {
  return (
    <Routes>
      {/* Pantallas SIN barra de navegación */}
      <Route path="/" element={<Navigate to="/welcome" replace />} />
      <Route path="/welcome" element={<WelcomePage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route path="/login" element={<LoginPage />} />

      {/* Inicio es del release 2: login y registro mandan a /home, que lleva a Explorar */}
      <Route path="/home" element={<Navigate to="/explorar" replace />} />

      {/* Ruta anterior de la pantalla de Publicar: ahora es /publicar */}
      <Route path="/publish" element={<Navigate to="/publicar" replace />} />

      {/* Pantallas CON barra de navegación */}
      <Route element={<AppLayout />}>
        <Route path="/explorar" element={<CatalogPage />} />
               <Route path="/producto/:id" element={<ProductDetailContainer />} />
        <Route path="/publicar" element={<PublicarProductoPage />} />
        <Route
          path="/solicitudes"
          element={<Proximamente titulo="Solicitudes" />}
        />
        <Route path="/perfil" element={<Proximamente titulo="Perfil" />} />
        {/* La pantalla de Inicio queda lista para el release 2 */}
        <Route path="/inicio" element={<HomePage />} />
      </Route>
    </Routes>
  )
}

export default App