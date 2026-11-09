import { TIPOS_PRODUCTO } from '../../compartido/constantes/tipos-producto.js'
import './TypeFilterChips.css'

// Fila de chips: "Todos" y un chip por cada tipo de producto
function TypeFilterChips({ tipo, onCambiar }) {
  const opciones = [{ id: '', texto: 'Todos' }, ...TIPOS_PRODUCTO]

  return (
    <div
      className="chips"
      role="group"
      aria-label="Filtrar por tipo de producto"
    >
      {opciones.map((opcion) => (
        <button
          key={opcion.id}
          className={`chips__chip${tipo === opcion.id ? ' chips__chip--activo' : ''}`}
          type="button"
          aria-pressed={tipo === opcion.id}
          onClick={() => onCambiar(opcion.id)}
        >
          {opcion.texto}
        </button>
      ))}
    </div>
  )
}

export default TypeFilterChips