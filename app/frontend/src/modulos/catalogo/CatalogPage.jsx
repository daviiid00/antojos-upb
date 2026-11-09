import { useEffect, useState } from 'react'
import { buscarProductos } from '../../compartido/servicios/productos.js'
import SearchBar from './SearchBar.jsx'
import './CatalogPage.css'

function formatearPrecio(precio) {
  return `$${precio.toLocaleString('es-CO')}`
}

function CatalogPage() {
  // consulta = término buscado ('' = catálogo general)
  const [consulta, setConsulta] = useState('')
  // Se guarda el resultado junto con la consulta a la que pertenece
  const [resultado, setResultado] = useState({
    consulta: null,
    productos: [],
    hayError: false,
  })

  // Cada vez que cambia la consulta se vuelve a pedir la lista
  useEffect(() => {
    let vigente = true // evita pintar respuestas viejas
    buscarProductos(consulta)
      .then((productos) => {
        if (vigente) setResultado({ consulta, productos, hayError: false })
      })
      .catch(() => {
        if (vigente) setResultado({ consulta, productos: [], hayError: true })
      })
    return () => {
      vigente = false
    }
  }, [consulta])

  // "Cargando" mientras el resultado guardado es de otra consulta
  const cargando = resultado.consulta !== consulta
  const { productos, hayError } = resultado

  const cantidad = productos.length
  const resumen = consulta
    ? `${cantidad} ${cantidad === 1 ? 'resultado' : 'resultados'} para “${consulta}”`
    : `${cantidad} productos`

  return (
    <main className="catalogo">
      <header className="catalogo__cabecera">
        <h1 className="catalogo__titulo">Explorar</h1>
      </header>

      <div className="catalogo__contenido">
        <SearchBar onBuscar={setConsulta} onLimpiar={() => setConsulta('')} />

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