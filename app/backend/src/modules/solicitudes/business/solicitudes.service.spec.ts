import type { Repository } from 'typeorm';
import type { Solicitud } from '../data/solicitud.entity.js';
import { SolicitudesService } from './solicitudes.service.js';

const solicitudGuardada = {
  id: 4,
  quantity: 2,
  status: 'PENDING',
  createdAt: new Date('2026-11-12T10:00:00Z'),
  product: {
    id: 7,
    name: 'Caja mini brownies',
    seller: { id: 1, name: 'Laura Gómez', phone: '573009998877' },
  },
  buyer: {
    id: 9,
    name: 'Carlos Ruiz',
    email: 'carlos@upb.edu.co',
    passwordHash: 'hash-secreto',
    phone: '573001234567',
  },
};

describe('SolicitudesService.listarDelVendedor', () => {
  let repositorio: { find: ReturnType<typeof vi.fn> };
  let servicio: SolicitudesService;

  beforeEach(() => {
    repositorio = { find: vi.fn() };
    servicio = new SolicitudesService(
      repositorio as unknown as Repository<Solicitud>,
    );
  });

  it('solo pide las solicitudes de productos del vendedor', async () => {
    repositorio.find.mockResolvedValue([]);
    await servicio.listarDelVendedor(1);
    expect(repositorio.find).toHaveBeenCalledWith(
      expect.objectContaining({
        where: { product: { seller: { id: 1 } } },
      }),
    );
  });

  it('devuelve producto, cantidad y estado de cada solicitud', async () => {
    repositorio.find.mockResolvedValue([solicitudGuardada]);
    const [solicitud] = await servicio.listarDelVendedor(1);
    expect(solicitud).toMatchObject({
      id: 4,
      productName: 'Caja mini brownies',
      quantity: 2,
      status: 'PENDING',
      buyerName: 'Carlos Ruiz',
    });
  });

  it('genera el enlace de contacto hacia el comprador con el producto en el mensaje', async () => {
    repositorio.find.mockResolvedValue([solicitudGuardada]);
    const [solicitud] = await servicio.listarDelVendedor(1);
    expect(solicitud.contactLink).toMatch(/^https:\/\/wa\.me\/573001234567\?text=/);
    const texto = decodeURIComponent(solicitud.contactLink!.split('?text=')[1]);
    expect(texto).toContain('Caja mini brownies');
    expect(texto).toContain('2 unidades');
  });

  it('deja el enlace en null si el comprador no tiene celular', async () => {
    repositorio.find.mockResolvedValue([
      {
        ...solicitudGuardada,
        buyer: { ...solicitudGuardada.buyer, phone: null },
      },
    ]);
    const [solicitud] = await servicio.listarDelVendedor(1);
    expect(solicitud.contactLink).toBeNull();
  });

  it('no expone datos privados del comprador', async () => {
    repositorio.find.mockResolvedValue([solicitudGuardada]);
    const [solicitud] = await servicio.listarDelVendedor(1);
    const texto = JSON.stringify(solicitud);
    expect(texto).not.toContain('hash-secreto');
    expect(texto).not.toContain('carlos@upb.edu.co');
    expect(solicitud).not.toHaveProperty('buyer');
    expect(solicitud).not.toHaveProperty('phone');
  });

  it('devuelve una lista vacía si no hay solicitudes', async () => {
    repositorio.find.mockResolvedValue([]);
    await expect(servicio.listarDelVendedor(1)).resolves.toEqual([]);
  });
});