import { Link } from 'react-router'

// Pantalla temporal para rutas que todavía no se han construido.
function Proximamente({ titulo }) {
  return (
    <main>
      <h1>{titulo}</h1>
      <p>Próximamente.</p>
      <Link to="/welcome">Volver a la bienvenida</Link>
    </main>
  )
}

export default Proximamente
