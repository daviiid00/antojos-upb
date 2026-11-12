import { IconoDestellos } from './Iconos.jsx'
import './MarcaAntojos.css'

function MarcaAntojos() {
  return (
    <div className="marca">
      <span className="marca__icono">
        <IconoDestellos />
      </span>
      <span className="marca__texto">
        <span className="marca__nombre">Antojos</span>
        <span className="marca__sede">UPB</span>
      </span>
    </div>
  )
}

export default MarcaAntojos
