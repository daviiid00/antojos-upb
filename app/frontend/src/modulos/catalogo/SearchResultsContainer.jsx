import { useEffect, useState } from 'react'
import { TIPOS_PRODUCTO } from '../../compartido/constantes/tipos-producto.js'
import { buscarProductos } from '../../compartido/servicios/productos.js'
import ProductCardGrid from './ProductCardGrid.jsx'
import SearchHeader from './SearchHeader.jsx'
import './SearchResultsContainer.css'

// Pide los productos según los filtros y muestra encabezado + tarjetas
function SearchResultsContainer({ consulta, tipo }) {
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

  if (cargando) return <p className="resultados__mensaje">Cargando…</p>

  if (hayError) {
    return (
      <p className="resultados__mensaje" role="alert">
        No pudimos cargar los productos. Inténtalo de nuevo.
      </p>
    )
  }

  const textoTipo = TIPOS_PRODUCTO.find((t) => t.id === tipo)?.texto

  return (
    <section className="resultados" aria-label="Resultados">
      <SearchHeader
        total={productos.length}
        consulta={consulta}
        textoTipo={textoTipo}
      />
      {productos.length === 0 ? (
        <p className="resultados__mensaje">
          No encontramos productos. Prueba con otra palabra.
        </p>
      ) : (
        <ProductCardGrid productos={productos} />
      )}
    </section>
  )
}

export default SearchResultsContainer