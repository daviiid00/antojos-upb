import { useState } from 'react'
import { Link, Navigate, useNavigate } from 'react-router'
import {
  IconoCandado,
  IconoContinuar,
  IconoCorreo,
  IconoDesplegar,
  IconoPersona,
  IconoVolver,
} from '../../compartido/componentes/Iconos.jsx'
import {
  SEDES,
  VINCULOS_UNIVERSITARIOS,
} from '../../compartido/constantes/usuario.js'
import { ErrorApi, llamarApi } from '../../compartido/servicios/api.js'
import {
  guardarToken,
  haySesion,
} from '../../compartido/sesion-rutas/sesion.js'
import './RegisterPage.css'

const DATOS_INICIALES = {
  name: '',
  email: '',
  universityLink: VINCULOS_UNIVERSITARIOS[0],
  campus: SEDES[0],
  password: '',
  termsAccepted: false,
}

const MENSAJE_GENERAL = 'No pudimos crear tu cuenta. Inténtalo de nuevo.'

// El 400 del backend trae un arreglo de mensajes en español; cualquier otro
// error (incluido el 500 del correo repetido, que maneja ANTOJOS-12) es general.
function mensajesDeError(error) {
  const mensajes =
    error instanceof ErrorApi && error.estado === 400
      ? error.cuerpo?.message
      : null
  return Array.isArray(mensajes) ? [...new Set(mensajes)] : [MENSAJE_GENERAL]
}

function RegisterPage() {
  const navigate = useNavigate()
  const [datos, setDatos] = useState(DATOS_INICIALES)
  const [errores, setErrores] = useState([])
  const [enviando, setEnviando] = useState(false)

  if (haySesion()) return <Navigate to="/home" replace />

  function actualizar(evento) {
    const { name, type, value, checked } = evento.target
    setDatos((previos) => ({
      ...previos,
      [name]: type === 'checkbox' ? checked : value,
    }))
  }

  async function enviar(evento) {
    evento.preventDefault()
    setErrores([])
    setEnviando(true)
    try {
      const { token } = await llamarApi('/auth/register', {
        metodo: 'POST',
        cuerpo: datos,
      })
      guardarToken(token)
      navigate('/home', { replace: true })
    } catch (error) {
      setErrores(mensajesDeError(error))
      setEnviando(false)
    }
  }

  return (
    <main className="registro">
      <header className="registro__barra">
        <Link
          className="registro__volver"
          to="/welcome"
          aria-label="Volver a la bienvenida"
        >
          <IconoVolver />
        </Link>
        <p className="registro__barra-titulo">Crear cuenta</p>
      </header>

      <h1 className="registro__titulo">Únete a antojos UPB</h1>
      <p className="registro__subtitulo">
        Crea tu perfil para comprar, ofrecer y conectar dentro de la
        universidad.
      </p>

      <form className="registro__formulario" onSubmit={enviar} noValidate>
        <div className="registro__campo">
          <label className="registro__etiqueta" htmlFor="registro-nombre">
            Nombre completo
          </label>
          <div className="registro__control">
            <IconoPersona />
            <input
              id="registro-nombre"
              className="registro__entrada"
              type="text"
              name="name"
              autoComplete="name"
              placeholder="Laura Gómez"
              value={datos.name}
              onChange={actualizar}
              aria-required="true"
            />
          </div>
        </div>

        <div className="registro__campo">
          <label className="registro__etiqueta" htmlFor="registro-correo">
            Correo institucional
          </label>
          <div className="registro__control">
            <IconoCorreo />
            <input
              id="registro-correo"
              className="registro__entrada"
              type="email"
              name="email"
              autoComplete="email"
              inputMode="email"
              placeholder="laura.gomez@upb.edu.co"
              value={datos.email}
              onChange={actualizar}
              aria-required="true"
              aria-describedby="registro-correo-ayuda"
            />
          </div>
          <p id="registro-correo-ayuda" className="registro__ayuda">
            Usaremos este correo para validar tu vínculo con UPB.
          </p>
        </div>

        <div className="registro__fila">
          <div className="registro__campo">
            <label className="registro__etiqueta" htmlFor="registro-vinculo">
              Soy
            </label>
            <div className="registro__control registro__control--select">
              <select
                id="registro-vinculo"
                className="registro__entrada"
                name="universityLink"
                value={datos.universityLink}
                onChange={actualizar}
              >
                {VINCULOS_UNIVERSITARIOS.map((vinculo) => (
                  <option key={vinculo} value={vinculo}>
                    {vinculo}
                  </option>
                ))}
              </select>
              <IconoDesplegar />
            </div>
          </div>

          <div className="registro__campo">
            <label className="registro__etiqueta" htmlFor="registro-sede">
              Sede
            </label>
            <div className="registro__control registro__control--select">
              <select
                id="registro-sede"
                className="registro__entrada"
                name="campus"
                value={datos.campus}
                onChange={actualizar}
              >
                {SEDES.map((sede) => (
                  <option key={sede} value={sede}>
                    {sede}
                  </option>
                ))}
              </select>
              <IconoDesplegar />
            </div>
          </div>
        </div>

        <div className="registro__campo">
          <label className="registro__etiqueta" htmlFor="registro-clave">
            Contraseña
          </label>
          <div className="registro__control">
            <IconoCandado />
            <input
              id="registro-clave"
              className="registro__entrada"
              type="password"
              name="password"
              autoComplete="new-password"
              value={datos.password}
              onChange={actualizar}
              aria-required="true"
              aria-describedby="registro-clave-ayuda"
            />
          </div>
          <p id="registro-clave-ayuda" className="registro__ayuda">
            Mínimo 8 caracteres, una mayúscula y un número.
          </p>
        </div>

        <label className="registro__terminos">
          <input
            className="registro__casilla"
            type="checkbox"
            name="termsAccepted"
            checked={datos.termsAccepted}
            onChange={actualizar}
          />
          <span>
            Acepto los <strong>términos de uso</strong> y las normas de
            convivencia de Antojos UPB.
          </span>
        </label>

        {errores.length > 0 && (
          <div className="registro__errores" role="alert">
            <ul>
              {errores.map((mensaje) => (
                <li key={mensaje}>{mensaje}</li>
              ))}
            </ul>
          </div>
        )}

        <button
          className="registro__boton"
          type="submit"
          disabled={!datos.termsAccepted || enviando}
          aria-busy={enviando}
        >
          <IconoContinuar />
          {enviando ? 'Creando cuenta…' : 'Crear cuenta'}
        </button>
      </form>
    </main>
  )
}

export default RegisterPage
