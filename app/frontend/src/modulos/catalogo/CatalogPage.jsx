import { useEffect, useState } from 'react'
import { TIPOS_PRODUCTO } from '../../compartido/constantes/tipos-producto.js'
import { buscarProductos } from '../../compartido/servicios/productos.js'
import SearchBar from './SearchBar.jsx'
import TypeFilterChips from './TypeFilterChips.jsx'
import './CatalogPage.css'

function formatearPrecio(precio) {
  return `$${precio.toLocaleString('es-CO')}`
}

function CatalogPage() {
  // consulta = texto de la barra, tipo = id del chip elegido ('' = Todos)
  const [consulta, setConsulta] = useState('')
  const [tipo, setTipo] = useState('')
  // El resultado se guarda junto con los filtros a los que pertenece
  const [resultado, setResultado] = useState({
    consulta: null,
    tipo: null,
    productos: [],
    hayError: false,
  })

  // Cada vez que cambia un filtro se vuelve a pedir la lista
  useEffect(() => {
    let vigente = true // evita pintar respuestas viejas
    buscarProductos(consulta, tipo)
      .then((productos) => {
        if (vigente) {
          setResultado({ consulta, tipo, productos, hayError: false })
        }
      })
      .catch(() => {
        if (vigente) {
          setResultado({ consulta, tipo, productos: [], hayError: true })
        }
      })
    return () => {
      vigente = false
    }
  }, [consulta, tipo])

  // "Cargando" mientras el resultado guardado es de otros filtros
  const cargando = resultado.consulta !== consulta || resultado.tipo !== tipo
  const { productos, hayError } = resultado

  const cantidad = productos.length
  const textoTipo = TIPOS_PRODUCTO.find((t) => t.id === tipo)?.texto
  const filtros = [
    consulta && `para “${consulta}”`,
    textoTipo && `de tipo “${textoTipo}”`,
  ]
    .filter(Boolean)
    .join(' ')
  const resumen = filtros
    ? `${cantidad} ${cantidad === 1 ? 'resultado' : 'resultados'} ${filtros}`
    : `${cantidad} productos`

  return (
    <main className="catalogo">
      <header className="catalogo__cabecera">
        <h1 className="catalogo__titulo">Explorar</h1>
      </header>

      <div className="catalogo__contenido">
        <SearchBar onBuscar={setConsulta} onLimpiar={() => setConsulta('')} />
        <TypeFilterChips tipo={tipo} onCambiar={setTipo} />

        {cargando && <p className="catalogo__mensaje">Cargando…</p>}

        {hayError && (
          <p className="catalogo__mensaje" role="alert">
            No pudimos cargar los productos. Inténtalo de nuevo.
          </p>
        )}

        {!cargando && !hayError && (
          <>
            <p className="catalogo__resumen">{resumen}</p>
            {cantidad === 0 ? (
              <p className="catalogo__mensaje">
                No encontramos productos. Prueba con otra palabra.
              </p>
            ) : (
              <ul className="catalogo__lista">
                {productos.map((producto) => (
                  <li key={producto.id} className="catalogo__tarjeta">
                    <h2 className="catalogo__nombre">{producto.name}</h2>
                    <p className="catalogo__emprendedor">{producto.seller}</p>
                    <p className="catalogo__precio">
                      {formatearPrecio(producto.price)}
                    </p>
                  </li>
                ))}
              </ul>
            )}
          </>
        )}
      </div>
    </main>
  )
}

export default CatalogPage