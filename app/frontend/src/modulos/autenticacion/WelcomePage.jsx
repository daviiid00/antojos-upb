import { Link, Navigate } from 'react-router'
import { haySesion } from '../../compartido/sesion-rutas/sesion.js'
import logoUpb from '../../compartido/imagenes/logo-upb.png'
import './WelcomePage.css'

function WelcomePage() {
  if (haySesion()) return <Navigate to="/home" replace />

  return (
    <main className="welcome">
      <header className="welcome__hero">
        <img
          className="welcome__logo"
          src={logoUpb}
          alt="UPB"
          width="1024"
          height="358"
        />
        <h1 className="welcome__titulo">
          Lo bueno de la U, en un solo lugar.
        </h1>
      </header>

      <div className="welcome__contenido">
        <p className="welcome__descripcion">
          Descubre productos y servicios creados por estudiantes, y la
          comunidad UPB.
        </p>

        <ul className="welcome__tarjetas">
          <li className="welcome__tarjeta welcome__tarjeta--rosa">
            <h2 className="welcome__tarjeta-titulo">Compra local</h2>
            <p className="welcome__tarjeta-texto">
              Apoya talento de la comunidad.
            </p>
          </li>
          <li className="welcome__tarjeta welcome__tarjeta--azul">
            <h2 className="welcome__tarjeta-titulo">Acuerda en directo</h2>
            <p className="welcome__tarjeta-texto">
              Sin pagos dentro de la app.
            </p>
          </li>
        </ul>

        <div className="welcome__acciones">
          <Link className="welcome__boton" to="/register">
            Comenzar
          </Link>
          <p className="welcome__pregunta">
            ¿Ya tienes cuenta?{' '}
            <Link className="welcome__enlace" to="/login">
              Inicia sesión
            </Link>
          </p>
        </div>
      </div>
    </main>
  )
}

export default WelcomePage
