// Estados del pedido según el SRS (RF-07). El frontend tiene una copia espejo
// en src/compartido/constantes/solicitud.js: si cambias la lista, cámbiala allá.
export const ESTADOS_SOLICITUD = [
  'PENDING',
  'CONFIRMED',
  'DELIVERED',
  'CANCELLED',
] as const;

export type EstadoSolicitud = (typeof ESTADOS_SOLICITUD)[number];