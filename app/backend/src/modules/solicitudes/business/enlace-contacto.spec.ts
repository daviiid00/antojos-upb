import { construirEnlaceContacto } from './enlace-contacto.js';

describe('construirEnlaceContacto', () => {
  it('arma el enlace wa.me con el mensaje codificado', () => {
    const enlace = construirEnlaceContacto('573001234567', 'Hola, ¿qué tal?');
    expect(enlace).toBe(
      `https://wa.me/573001234567?text=${encodeURIComponent('Hola, ¿qué tal?')}`,
    );
  });

  it.each([null, undefined, '', '3001234567', '57123', '572001234567'])(
    'devuelve null si el número no es válido (%s)',
    (telefono) => {
      expect(construirEnlaceContacto(telefono, 'Hola')).toBeNull();
    },
  );
});