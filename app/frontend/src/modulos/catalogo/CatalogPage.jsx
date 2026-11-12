import { useState } from 'react'
import SearchBar from './SearchBar.jsx'
import SearchResultsContainer from './SearchResultsContainer.jsx'
import TypeFilterChips from './TypeFilterChips.jsx'
import './CatalogPage.css'

function CatalogPage() {
  // consulta = texto de la barra, tipo = id del chip elegido ('' = Todos)
  const [consulta, setConsulta] = useState('')
  const [tipo, setTipo] = useState('')

  return (
    <main className="catalogo">
      <header className="catalogo__cabecera">
        <h1 className="catalogo__titulo">Explorar</h1>
      </header>

      <div className="catalogo__contenido">
        <SearchBar onBuscar={setConsulta} onLimpiar={() => setConsulta('')} />
        <TypeFilterChips tipo={tipo} onCambiar={setTipo} />
        <SearchResultsContainer consulta={consulta} tipo={tipo} />
      </div>
    </main>
  )
}

export default CatalogPage