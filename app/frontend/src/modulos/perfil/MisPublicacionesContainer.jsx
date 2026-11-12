import { useEffect, useState } from 'react';
import { Link } from 'react-router';
import { obtenerMisProductos } from '../../compartido/servicios/mis-productos';
import { ProductList } from './ProductList';

export function MisPublicacionesContainer() {
  const [productos, setProductos] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let activo = true;

    async function cargar() {
      try {
        setCargando(true);
        setError(null);
        const datos = await obtenerMisProductos();
        if (activo) {
          setProductos(Array.isArray(datos) ? datos : []);
        }
      } catch (err) {
        if (activo) {
          if (err?.status === 401 || err?.message?.includes('401')) {
            setError('401');
          } else {
            setError('No se pudieron cargar tus publicaciones. Intenta de nuevo.');
          }
        }
      } finally {
        if (activo) setCargando(false);
      }
    }

    cargar();
    return () => {
      activo = false;
    };
  }, []);

  if (cargando) {
    return <p className="perfil-mensaje">Cargando tus publicaciones...</p>;
  }

  if (error === '401') {
    return (
      <p className="perfil-mensaje perfil-mensaje--error">
        Tu sesión venció. <Link to="/login">Inicia sesión nuevamente</Link>.
      </p>
    );
  }

  if (error) {
    return <p className="perfil-mensaje perfil-mensaje--error">{error}</p>;
  }

  if (productos.length === 0) {
    return <p className="perfil-mensaje">Aún no tienes publicaciones activas.</p>;
  }

  return <ProductList productos={productos} />;
}