import { ProductCard } from './ProductCard';

export function ProductList({ productos }) {
  return (
    <ul className="perfil-product-list">
      {productos.map((producto) => (
        <ProductCard key={producto.id} producto={producto} />
      ))}
    </ul>
  );
}