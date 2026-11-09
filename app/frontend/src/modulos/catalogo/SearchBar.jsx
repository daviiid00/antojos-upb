import { useState } from 'react'
import {
  IconoBuscar,
  IconoCerrar,
} from '../../compartido/componentes/Iconos.jsx'
import './SearchBar.css'

function SearchBar({ onBuscar, onLimpiar }) {
  const [valor, setValor] = useState('')

  function cambiar(evento) {
    const nuevo = evento.target.value
    setValor(nuevo)
    // Criterio: al borrar el texto se restablece el catálogo general
    if (nuevo.trim() === '') onLimpiar()
  }

  // Enter o clic en la lupa
  function enviar(evento) {
    evento.preventDefault()
    const termino = valor.trim()
    if (termino === '') return onLimpiar()
    onBuscar(termino)
  }

  function limpiar() {
    setValor('')
    onLimpiar()
  }

  return (
    <form className="buscador" role="search" onSubmit={enviar}>
      <button className="buscador__buscar" type="submit" aria-label="Buscar">
        <IconoBuscar />
      </button>
      <input
        className="buscador__entrada"
        type="text"
        name="q"
        placeholder="¿Qué se te antoja?"
        aria-label="Buscar productos"
        autoComplete="off"
        maxLength={100}
        value={valor}
        onChange={cambiar}
      />
      {valor && (
        <button
          className="buscador__limpiar"
          type="button"
          aria-label="Borrar búsqueda"
          onClick={limpiar}
        >
          <IconoCerrar />
        </button>
      )}
    </form>
  )
}

export default SearchBar