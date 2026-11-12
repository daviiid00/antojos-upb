import './QuantitySelector.css'

// Selector de cantidad: nunca menos de 1 ni más del stock disponible
function QuantitySelector({ cantidad, maximo, onCambiar }) {
  function ajustar(valor) {
    onCambiar(Math.min(Math.max(valor, 1), maximo))
  }

  // Si escriben algo que no es un número, vuelve a 1
  function escribir(evento) {
    const numero = Number.parseInt(evento.target.value, 10)
    ajustar(Number.isNaN(numero) ? 1 : numero)
  }

  return (
    <div className="cantidad">
      <label className="cantidad__etiqueta" htmlFor="cantidad-producto">
        Cantidad
      </label>
      <div className="cantidad__control">
        <button
          className="cantidad__boton"
          type="button"
          aria-label="Disminuir cantidad"
          onClick={() => ajustar(cantidad - 1)}
          disabled={cantidad <= 1}
        >
          −
        </button>
        <input
          id="cantidad-producto"
          className="cantidad__valor"
          type="number"
          inputMode="numeric"
          min="1"
          max={maximo}
          step="1"
          value={cantidad}
          onChange={escribir}
        />
        <button
          className="cantidad__boton"
          type="button"
          aria-label="Aumentar cantidad"
          onClick={() => ajustar(cantidad + 1)}
          disabled={cantidad >= maximo}
        >
          +
        </button>
      </div>
      <p className="cantidad__ayuda">
        {maximo} {maximo === 1 ? 'disponible' : 'disponibles'}
      </p>
    </div>
  )
}

export default QuantitySelector