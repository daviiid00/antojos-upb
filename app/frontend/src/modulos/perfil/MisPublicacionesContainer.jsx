import { useEffect, useState } from 'react';
import { Link } from 'react-router';
import {
  eliminarMiProducto,
  obtenerMisProductos,
} from '../../compartido/servicios/mis-productos';
import { DeleteProductModal } from './DeleteProductModal';
import { ProductList } from './ProductList';

export function MisPublicacionesContainer() {
  const [productos, setProductos] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState(null);

  const [productoAEliminar, setProductoAEliminar] = useState(null);
  const [eliminando, setEliminando] = useState(false);
  const [errorEliminacion, setErrorEliminacion] = useState(null);

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

  function abrirModalEliminar(producto) {
    setErrorEliminacion(null);
    setProductoAEliminar(producto);
  }

  function cerrarModalEliminar() {
    if (eliminando) return;
    setProductoAEliminar(null);
    setErrorEliminacion(null);
  }

  async function confirmarEliminacion(productoId) {
    try {
      setEliminando(true);
      setErrorEliminacion(null);
      await eliminarMiProducto(productoId);
      setProductos((prev) => prev.filter((item) => item.id !== productoId));
      setProductoAEliminar(null);
    } catch (err) {
      setErrorEliminacion(
        err?.message || 'No se pudo eliminar la publicación. Intenta nuevamente.',
      );
    } finally {
      setEliminando(false);
    }
  }

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

  return (
    <>
      <ProductList
        productos={productos}
        onSolicitarEliminar={abrirModalEliminar}
      />

      <DeleteProductModal
        producto={productoAEliminar}
        eliminando={eliminando}
        error={errorEliminacion}
        onConfirmar={confirmarEliminacion}
        onCancelar={cerrarModalEliminar}
      />
    </>
  );
}