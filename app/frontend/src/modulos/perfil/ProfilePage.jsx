import { Navigate } from 'react-router';
import { haySesion } from '../../compartido/sesion-rutas/sesion';
import { MisPublicacionesContainer } from './MisPublicacionesContainer';
import './ProfilePage.css';

export function ProfilePage() {
  if (!haySesion()) {
    return <Navigate to="/login" replace />;
  }

  return (
    <section className="profile-page">
      <header className="profile-page__header">
        <h1 className="profile-page__titulo">Mi perfil</h1>
      </header>

      <div className="profile-page__seccion">
        <h2 className="profile-page__subtitulo">Mis publicaciones</h2>
        <MisPublicacionesContainer />
      </div>
    </section>
  );
}