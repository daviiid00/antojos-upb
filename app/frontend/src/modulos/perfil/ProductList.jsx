import { ProductCard } from './ProductCard';

export function ProductList({ productos, onSolicitarEliminar }) {
  return (
    <ul className="perfil-product-list">
      {productos.map((producto) => (
        <ProductCard
          key={producto.id}
          producto={producto}
          onSolicitarEliminar={onSolicitarEliminar}
        />
      ))}
    </ul>
  );
}