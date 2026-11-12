import { useState } from 'react';
import { formatearPrecio, optimizarImagen } from '../../compartido/utilidades/formato';
import './ProductCard.css';

export function ProductCard({ producto, onSolicitarEliminar }) {
  const [errorImagen, setErrorImagen] = useState(false);
  const urlOptimizada = optimizarImagen(producto.image_url);
  const mostrarFallback = !urlOptimizada || errorImagen;

  return (
    <li className="perfil-product-card">
      <div className="perfil-product-card__imagen-caja">
        {mostrarFallback ? (
          <div className="perfil-product-card__sin-imagen" aria-label="Sin imagen">
            Sin imagen
          </div>
        ) : (
          <img
            src={urlOptimizada}
            alt={producto.name}
            className="perfil-product-card__imagen"
            onError={() => setErrorImagen(true)}
          />
        )}
      </div>

      <div className="perfil-product-card__detalle">
        <span className="perfil-product-card__estado">ACTIVA</span>
        <h3 className="perfil-product-card__nombre" title={producto.name}>
          {producto.name}
        </h3>
        <p className="perfil-product-card__precio">
          {formatearPrecio(producto.price)}
        </p>
      </div>

      <button
        type="button"
        className="perfil-product-card__btn-eliminar"
        onClick={() => onSolicitarEliminar(producto)}
        aria-label={`Eliminar ${producto.name}`}
      >
        Eliminar
      </button>
    </li>
  );
}