import { useRef, useState } from 'react'
import { Link, Navigate, useNavigate } from 'react-router'
import {
  IconoCandado,
  IconoContinuar,
  IconoCorreo,
  IconoVolver,
} from '../../compartido/componentes/Iconos.jsx'
import { ErrorApi, llamarApi } from '../../compartido/servicios/api.js'
import {
  guardarToken,
  haySesion,
} from '../../compartido/sesion-rutas/sesion.js'
import './LoginPage.css'

const DATOS_INICIALES = { email: '', password: '' }

const MENSAJE_GENERAL = 'No pudimos iniciar sesión. Inténtalo de nuevo.'
const MENSAJE_CREDENCIALES = 'Correo o contraseña incorrectos.'

function LoginPage() {
  const navigate = useNavigate()
  const campoClave = useRef(null)
  const [datos, setDatos] = useState(DATOS_INICIALES)
  const [error, setError] = useState(null)
  const [credencialesInvalidas, setCredencialesInvalidas] = useState(false)
  const [enviando, setEnviando] = useState(false)

  if (haySesion()) return <Navigate to="/home" replace />

  function actualizar(evento) {
    const { name, value } = evento.target
    setCredencialesInvalidas(false)
    setDatos((previos) => ({ ...previos, [name]: value }))
  }

  async function enviar(evento) {
    evento.preventDefault()
    setError(null)
    setCredencialesInvalidas(false)
    setEnviando(true)
    try {
      const { token } = await llamarApi('/auth/login', {
        metodo: 'POST',
        cuerpo: datos,
      })
      guardarToken(token)
      navigate('/home', { replace: true })
    } catch (fallo) {
      if (fallo instanceof ErrorApi && fallo.estado === 401) {
        setError(fallo.cuerpo?.message ?? MENSAJE_CREDENCIALES)
        setCredencialesInvalidas(true)
        setDatos((previos) => ({ ...previos, password: '' }))
        campoClave.current?.focus()
      } else {
        setError(MENSAJE_GENERAL)
      }
      setEnviando(false)
    }
  }

  return (
    <main className="login">
      <header className="login__barra">
        <Link
          className="login__volver"
          to="/welcome"
          aria-label="Volver a la bienvenida"
        >
          <IconoVolver />
        </Link>
        <p className="login__barra-titulo">Iniciar sesión</p>
      </header>

      <h1 className="login__titulo">Qué bueno verte</h1>
      <p className="login__subtitulo">
        Entra con tu correo institucional para seguir comprando y ofreciendo
        dentro de la universidad.
      </p>

      <form className="login__formulario" onSubmit={enviar} noValidate>
        <div className="login__campo">
          <label className="login__etiqueta" htmlFor="login-correo">
            Correo institucional
          </label>
          <div className="login__control">
            <IconoCorreo />
            <input
              id="login-correo"
              className="login__entrada"
              type="email"
              name="email"
              autoComplete="email"
              inputMode="email"
              placeholder="laura.gomez@upb.edu.co"
              value={datos.email}
              onChange={actualizar}
              aria-required="true"
              aria-invalid={credencialesInvalidas ? 'true' : undefined}
              aria-describedby={credencialesInvalidas ? 'login-error' : undefined}
            />
          </div>
        </div>

        <div className="login__campo">
          <label className="login__etiqueta" htmlFor="login-clave">
            Contraseña
          </label>
          <div className="login__control">
            <IconoCandado />
            <input
              ref={campoClave}
              id="login-clave"
              className="login__entrada"
              type="password"
              name="password"
              autoComplete="current-password"
              value={datos.password}
              onChange={actualizar}
              aria-required="true"
              aria-invalid={credencialesInvalidas ? 'true' : undefined}
              aria-describedby={credencialesInvalidas ? 'login-error' : undefined}
            />
          </div>
        </div>

        {error && (
          <div id="login-error" className="login__error" role="alert">
            {error}
          </div>
        )}

        <button
          className="login__boton"
          type="submit"
          disabled={enviando}
          aria-busy={enviando}
        >
          <IconoContinuar />
          {enviando ? 'Iniciando sesión…' : 'Iniciar sesión'}
        </button>
      </form>

      <p className="login__pregunta">
        ¿No tienes cuenta?{' '}
        <Link className="login__enlace" to="/register">
          Crea una
        </Link>
      </p>
    </main>
  )
}

export default LoginPage
