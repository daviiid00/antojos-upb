import './SearchHeader.css'

// Encabezado informativo: total de resultados y filtros aplicados
function SearchHeader({ total, consulta, textoTipo }) {
  const filtros = [
    consulta && `para “${consulta}”`,
    textoTipo && `de tipo “${textoTipo}”`,
  ]
    .filter(Boolean)
    .join(' ')

  const texto = filtros
    ? `${total} ${total === 1 ? 'resultado' : 'resultados'} ${filtros}`
    : `${total} ${total === 1 ? 'producto' : 'productos'}`

  return (
    <p className="encabezado-resultados" aria-live="polite">
      {texto}
    </p>
  )
}

export default SearchHeader