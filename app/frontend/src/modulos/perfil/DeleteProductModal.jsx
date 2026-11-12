import './DeleteProductModal.css';

export function DeleteProductModal({
  producto,
  eliminando,
  error,
  onConfirmar,
  onCancelar,
}) {
  if (!producto) return null;

  return (
    <div
      className="modal-eliminar-overlay"
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-eliminar-titulo"
      onClick={eliminando ? undefined : onCancelar}
    >
      <div
        className="modal-eliminar-caja"
        onClick={(e) => e.stopPropagation()}
      >
        <h3 id="modal-eliminar-titulo" className="modal-eliminar-titulo">
          ¿Eliminar publicación?
        </h3>
        <p className="modal-eliminar-texto">
          Estás a punto de eliminar <strong>{producto.name}</strong>. Esta
          acción quitará el producto de tu perfil y del catálogo público.
        </p>

        {error && <p className="modal-eliminar-error">{error}</p>}

        <div className="modal-eliminar-acciones">
          <button
            type="button"
            className="modal-eliminar-btn modal-eliminar-btn--cancelar"
            onClick={onCancelar}
            disabled={eliminando}
          >
            Cancelar
          </button>
          <button
            type="button"
            className="modal-eliminar-btn modal-eliminar-btn--confirmar"
            onClick={() => onConfirmar(producto.id)}
            disabled={eliminando}
          >
            {eliminando ? 'Eliminando...' : 'Sí, eliminar'}
          </button>
        </div>
      </div>
    </div>
  );
}