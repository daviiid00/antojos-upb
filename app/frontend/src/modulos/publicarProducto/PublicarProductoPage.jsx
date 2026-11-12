import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router'
import { ErrorApi, llamarApi } from '../../compartido/servicios/api.js'
import './PublicarProductoPage.css'

const FORMATOS_PERMITIDOS = ['image/jpeg', 'image/png', 'image/webp']
const TAMANO_MAXIMO_BYTES = 5 * 1024 * 1024 // 5 MB, igual que el backend

const MENSAJE_FORMATO =
  'Formato no válido. Solo se permiten imágenes .jpg, .png o .webp.'
const MENSAJE_TAMANO =
  'La imagen es demasiado pesada. El tamaño máximo es de 5 MB.'
const MENSAJE_GENERAL = 'No pudimos subir la imagen. Inténtalo de nuevo.'
const MENSAJE_SIN_IMAGEN = 'Agrega una foto de tu producto.'
const MENSAJE_SESION = 'Debes iniciar sesión para publicar.'
const MENSAJE_PUBLICAR = 'No pudimos publicar tu producto. Inténtalo de nuevo.'

const DATOS_INICIALES = { name: '', description: '', price: '', stock: '' }

// El 400 del backend trae su mensaje en cuerpo.message.
function mensajeDeError(error) {
  const mensaje =
    error instanceof ErrorApi && error.estado === 400
      ? error.cuerpo?.message
      : null
  return typeof mensaje === 'string' ? mensaje : MENSAJE_GENERAL
}

// Al publicar, el 400 trae un arreglo de mensajes y el 401 indica sin sesión.
function mensajesDePublicacion(error) {
  if (error instanceof ErrorApi && error.estado === 401) return [MENSAJE_SESION]
  const mensaje =
    error instanceof ErrorApi && error.estado === 400
      ? error.cuerpo?.message
      : null
  if (Array.isArray(mensaje)) return [...new Set(mensaje)]
  if (typeof mensaje === 'string') return [mensaje]
  return [MENSAJE_PUBLICAR]
}

// Igual que el backend: título y descripción no vacíos, precio > 0 y cantidad >= 1.
function validar(datos) {
  const errores = {}
  if (!datos.name.trim()) errores.name = 'El título es obligatorio.'
  if (!datos.description.trim()) {
    errores.description = 'La descripción es obligatoria.'
  }
  const precio = Number(datos.price)
  if (datos.price === '' || !Number.isInteger(precio) || precio < 1) {
    errores.price = 'Ingresa un precio entero mayor que 0.'
  }
  const cantidad = Number(datos.stock)
  if (datos.stock === '' || !Number.isInteger(cantidad) || cantidad < 1) {
    errores.stock = 'Ingresa una cantidad de al menos 1.'
  }
  return errores
}

function IconoCamara() {
  return (
    <svg
      className="publicar__icono"
      viewBox="0 0 24 24"
      width="24"
      height="24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M4 8h3l1.5-2h7L17 8h3a1 1 0 0 1 1 1v9a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V9a1 1 0 0 1 1-1z" />
      <circle cx="12" cy="13" r="3.5" />
    </svg>
  )
}

function PublicarProductoPage() {
  const navigate = useNavigate()
  const [previa, setPrevia] = useState(null)
  const [urlImagen, setUrlImagen] = useState(null)
  const [error, setError] = useState(null)
  const [subiendo, setSubiendo] = useState(false)
  const [datos, setDatos] = useState(DATOS_INICIALES)
  const [errores, setErrores] = useState({})
  const [erroresServidor, setErroresServidor] = useState([])
  const [publicando, setPublicando] = useState(false)

  // Libera la memoria de la vista previa al cambiar de foto o salir.
  useEffect(() => {
    return () => {
      if (previa) URL.revokeObjectURL(previa)
    }
  }, [previa])

  async function elegirImagen(evento) {
    const archivo = evento.target.files[0]
    if (!archivo) return
    setError(null)
    setUrlImagen(null)

    if (!FORMATOS_PERMITIDOS.includes(archivo.type)) {
      setPrevia(null)
      setError(MENSAJE_FORMATO)
      evento.target.value = ''
      return
    }
    if (archivo.size > TAMANO_MAXIMO_BYTES) {
      setPrevia(null)
      setError(MENSAJE_TAMANO)
      evento.target.value = ''
      return
    }

    setPrevia(URL.createObjectURL(archivo))
    setSubiendo(true)
    try {
      const formulario = new FormData()
      formulario.append('imagen', archivo)
      const { url } = await llamarApi('/products/upload-image', {
        metodo: 'POST',
        cuerpo: formulario,
      })
      setUrlImagen(url)
    } catch (fallo) {
      setError(mensajeDeError(fallo))
    } finally {
      setSubiendo(false)
    }
  }

    function actualizar(evento) {
    const { name, value } = evento.target
    setDatos((previos) => ({ ...previos, [name]: value }))
    setErrores((previos) => ({ ...previos, [name]: undefined }))
  }

  async function publicar(evento) {
    evento.preventDefault()
    setErroresServidor([])
    const nuevos = validar(datos)
    setErrores(nuevos)
    if (!urlImagen) setError(MENSAJE_SIN_IMAGEN)
    if (Object.keys(nuevos).length > 0 || !urlImagen) return

    setPublicando(true)
    try {
      await llamarApi('/products', {
        metodo: 'POST',
        cuerpo: {
          name: datos.name.trim(),
          description: datos.description.trim(),
          price: Number(datos.price),
          stock: Number(datos.stock),
          imageUrl: urlImagen,
        },
      })
      navigate('/profile', { replace: true })
    } catch (fallo) {
      setErroresServidor(mensajesDePublicacion(fallo))
      setPublicando(false)
    }
  }

  return (
    <main className="publicar">
      <h1 className="publicar__titulo">Nueva publicación</h1>

      <section className="publicar__campo">
        <p className="publicar__etiqueta">
          Fotografía <span aria-hidden="true">*</span>
        </p>

        <div className="publicar__foto">
          <input
            id="publicar-imagen"
            className="publicar__entrada"
            type="file"
            accept=".jpg,.jpeg,.png,.webp"
            onChange={elegirImagen}
          />
          <label className="publicar__subida" htmlFor="publicar-imagen">
            {previa ? (
              <img
                className="publicar__previa"
                src={previa}
                alt="Vista previa de la foto del producto"
              />
            ) : (
              <>
                <IconoCamara />
                <span className="publicar__subida-texto">Agregar foto</span>
              </>
            )}
          </label>

          <aside className="publicar__consejo">
            <p className="publicar__consejo-titulo">Hazlo irresistible</p>
            <p className="publicar__consejo-texto">
              Usa luz natural y muestra el producto desde un buen ángulo.
            </p>
          </aside>
        </div>

        <p className="publicar__ayuda">
          Formatos permitidos: .jpg, .png o .webp. Máximo 5 MB.
        </p>
        {subiendo && (
          <p className="publicar__estado" role="status">
            Subiendo imagen…
          </p>
        )}
        {urlImagen && !subiendo && (
          <p className="publicar__estado" role="status">
            Imagen lista.
          </p>
        )}
        {error && (
          <p className="publicar__error" role="alert">
            {error}
          </p>
        )}
      </section>

            <form onSubmit={publicar} noValidate>
        <div className="publicar__campo">
          <label className="publicar__etiqueta" htmlFor="publicar-titulo">
            Título
          </label>
          <input
            id="publicar-titulo"
            className={`publicar__texto${errores.name ? ' publicar__texto--error' : ''}`}
            type="text"
            name="name"
            placeholder="Ej. Brownies artesanales x6"
            value={datos.name}
            onChange={actualizar}
            aria-invalid={errores.name ? 'true' : undefined}
          />
          {errores.name && (
            <p className="publicar__error" role="alert">
              {errores.name}
            </p>
          )}
        </div>

        <div className="publicar__fila">
          <div className="publicar__campo">
            <label className="publicar__etiqueta" htmlFor="publicar-cantidad">
              Cantidad
            </label>
            <input
              id="publicar-cantidad"
              className={`publicar__texto${errores.stock ? ' publicar__texto--error' : ''}`}
              type="number"
              name="stock"
              min="1"
              step="1"
              inputMode="numeric"
              placeholder="1"
              value={datos.stock}
              onChange={actualizar}
              aria-invalid={errores.stock ? 'true' : undefined}
            />
            {errores.stock && (
              <p className="publicar__error" role="alert">
                {errores.stock}
              </p>
            )}
          </div>

          <div className="publicar__campo">
            <label className="publicar__etiqueta" htmlFor="publicar-precio">
              Precio (COP)
            </label>
            <input
              id="publicar-precio"
              className={`publicar__texto${errores.price ? ' publicar__texto--error' : ''}`}
              type="number"
              name="price"
              min="1"
              step="1"
              inputMode="numeric"
              placeholder="0"
              value={datos.price}
              onChange={actualizar}
              aria-invalid={errores.price ? 'true' : undefined}
            />
            {errores.price && (
              <p className="publicar__error" role="alert">
                {errores.price}
              </p>
            )}
          </div>
        </div>

        <div className="publicar__campo">
          <label className="publicar__etiqueta" htmlFor="publicar-descripcion">
            Descripción
          </label>
          <textarea
            id="publicar-descripcion"
            className={`publicar__texto publicar__area${errores.description ? ' publicar__texto--error' : ''}`}
            name="description"
            rows="4"
            placeholder="Cuenta qué incluye, disponibilidad y cómo se realiza la entrega."
            value={datos.description}
            onChange={actualizar}
            aria-invalid={errores.description ? 'true' : undefined}
          />
          {errores.description && (
            <p className="publicar__error" role="alert">
              {errores.description}
            </p>
          )}
        </div>

        {erroresServidor.length > 0 && (
          <ul className="publicar__errores" role="alert">
            {erroresServidor.map((mensaje) => (
              <li key={mensaje}>{mensaje}</li>
            ))}
          </ul>
        )}

        <button
          className="publicar__boton"
          type="submit"
          disabled={subiendo || publicando}
          aria-busy={publicando}
        >
          {publicando ? 'Publicando…' : 'Realizar publicación'}
        </button>
      </form>
    </main>
  )
}

export default PublicarProductoPage