import { useEffect, useState } from 'react'
import { ErrorApi, llamarApi } from '../../compartido/servicios/api.js'
import './PublicarProductoPage.css'

const FORMATOS_PERMITIDOS = ['image/jpeg', 'image/png', 'image/webp']
const TAMANO_MAXIMO_BYTES = 5 * 1024 * 1024 // 5 MB, igual que el backend

const MENSAJE_FORMATO =
  'Formato no válido. Solo se permiten imágenes .jpg, .png o .webp.'
const MENSAJE_TAMANO =
  'La imagen es demasiado pesada. El tamaño máximo es de 5 MB.'
const MENSAJE_GENERAL = 'No pudimos subir la imagen. Inténtalo de nuevo.'

// El 400 del backend trae su mensaje en cuerpo.message.
function mensajeDeError(error) {
  const mensaje =
    error instanceof ErrorApi && error.estado === 400
      ? error.cuerpo?.message
      : null
  return typeof mensaje === 'string' ? mensaje : MENSAJE_GENERAL
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
  const [previa, setPrevia] = useState(null)
  const [urlImagen, setUrlImagen] = useState(null)
  const [error, setError] = useState(null)
  const [subiendo, setSubiendo] = useState(false)

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
    </main>
  )
}

export default PublicarProductoPage