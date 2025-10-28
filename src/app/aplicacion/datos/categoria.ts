export const categorias = [
  {
    id: 'VEHICULOS',
    descripcion: 'Vehículos',
    icono: 'directions_car',
    subcategoria: [
      { id: 'AUTOS_USADOS', descripcion: 'Autos Usados' },
      { id: 'AUTOS_NUEVOS', descripcion: 'Autos Nuevos' },
      { id: 'MOTOS', descripcion: 'Motos' },
      { id: 'CAMIONES_BUSES', descripcion: 'Camiones y Buses' },
      { id: 'BICICLETAS', descripcion: 'Bicicletas y Scooters' },
      {
        id: 'PIEZAS_ACCESORIOS',
        descripcion: 'Piezas y Accesorios',
        subcategoria: [
          { id: 'CHASIS_PARTES_EXTERNAS', descripcion: 'Chasis y Partes Externas' },
          { id: 'EQUIPO_MUSICA', descripcion: 'Equipo de Música' },
          { id: 'LLANTAS_RUEDAS', descripcion: 'Llantas y Ruedas' },
          { id: 'MOTORES_TRANSMISION', descripcion: 'Motores y Transmisión' },
          { id: 'INTERIOR', descripcion: 'Accesorios de Interior' },
          { id: 'ACEITES_FLUIDOS', descripcion: 'Aceites y Fluidos' },
        ],
      },
    ],
  },
  {
    id: 'INMUEBLES',
    descripcion: 'Bienes Raíces',
    icono: 'apartment',
    subcategoria: [
      {
        id: 'VENTA',
        descripcion: 'Venta',
        subcategoria: [
          { id: 'CASAS', descripcion: 'Venta de Casas' },
          { id: 'APARTAMENTOS', descripcion: 'Apartamentos' },
          { id: 'TERRENOS', descripcion: 'Terrenos' },
          { id: 'PROPIEDADES_PLAYA', descripcion: 'Propiedades de Playa' },
        ],
      },
      {
        id: 'ALQUILER',
        descripcion: 'Alquiler',
        subcategoria: [
          { id: 'CASAS', descripcion: 'Casas en Alquiler' },
          { id: 'APARTAMENTOS', descripcion: 'Apartamentos en Alquiler' },
          { id: 'OFICINAS', descripcion: 'Oficinas y Locales Comerciales' },
          { id: 'CUARTOS', descripcion: 'Cuartos o Habitaciones' },
        ],
      },
      {
        id: 'ALQUILER_VACACIONAL',
        descripcion: 'Alquiler Vacacional',
        subcategoria: [
          { id: 'CASAS', descripcion: 'Casas Vacacionales' },
          { id: 'DEPARTAMENTOS', descripcion: 'Departamentos de Playa' },
        ],
      },
    ],
  },
  {
    id: 'EMPLEOS_SERVICIOS',
    descripcion: 'Empleos y Servicios',
    icono: 'work',
    subcategoria: [
      {
        id: 'OFERTAS_TRABAJO',
        descripcion: 'Ofertas de Trabajo',
        subcategoria: [
          { id: 'TIEMPO_COMPLETO', descripcion: 'Tiempo Completo' },
          { id: 'MEDIO_TIEMPO', descripcion: 'Medio Tiempo' },
          { id: 'FREELANCE', descripcion: 'Freelance / Remoto' },
        ],
      },
      { id: 'HOJA_VIDA', descripcion: 'Publicar Hoja de Vida' },
      {
        id: 'CURSOS_EDUCACION',
        descripcion: 'Cursos y Educación',
        subcategoria: [
          { id: 'IDIOMAS_TRADUCCION', descripcion: 'Idiomas y Traducción' },
          { id: 'ARTE_MUSICA', descripcion: 'Arte, Danza y Música' },
          { id: 'OTROS_CURSOS', descripcion: 'Otros Cursos' },
          { id: 'TECNICOS_INFORMATICA', descripcion: 'Técnicos / Informática' },
        ],
      },
      {
        id: 'SERVICIOS_NEGOCIOS',
        descripcion: 'Servicios y Negocios',
        subcategoria: [
          { id: 'CONSTRUCCION', descripcion: 'Construcción y Remodelación' },
          { id: 'TRANSPORTE', descripcion: 'Transporte y Mudanzas' },
          { id: 'LIMPIEZA', descripcion: 'Limpieza y Mantenimiento' },
          { id: 'REPARACIONES', descripcion: 'Reparaciones Técnicas' },
          { id: 'MARKETING', descripcion: 'Publicidad y Marketing' },
        ],
      },
    ],
  },
  {
    id: 'MARKETPLACE',
    descripcion: 'Marketplace',
    icono: 'storefront',
    subcategoria: [
      {
        id: 'TECNOLOGIA',
        descripcion: 'Tecnología',
        subcategoria: [
          { id: 'TELEFONOS_CELULARES', descripcion: 'Teléfonos Celulares' },
          { id: 'ELECTRONICOS_VESTIBLES', descripcion: 'Dispositivos Electrónicos Vestibles' },
          { id: 'DOMOTICA', descripcion: 'Domótica y Casa Inteligente' },
          { id: 'AUDIO_VIDEO_FOTO', descripcion: 'Audio, Video y Fotografía' },
          { id: 'COMPUTACION', descripcion: 'Computadoras y Accesorios' },
        ],
      },
      {
        id: 'MERCANCIA_MAYORISTA',
        descripcion: 'Mercancía Mayorista',
        subcategoria: [
          { id: 'SE_VENDE', descripcion: 'Se Vende' },
          { id: 'YO_BUSCO', descripcion: 'Yo Busco' },
        ],
      },
      {
        id: 'CONSTRUCCION',
        descripcion: 'Construcción',
        subcategoria: [
          { id: 'HERRAMIENTAS', descripcion: 'Herramientas y Materiales' },
          { id: 'MAQUINARIA', descripcion: 'Maquinaria y Equipos' },
        ],
      },
      {
        id: 'MUEBLES_HOGAR',
        descripcion: 'Muebles, Hogar y Jardín',
        subcategoria: [
          { id: 'MUEBLES_INTERIOR', descripcion: 'Muebles de Interior' },
          { id: 'COCINA', descripcion: 'Cocina y Electrodomésticos' },
          { id: 'JARDIN', descripcion: 'Jardín y Exterior' },
          { id: 'DECORACION', descripcion: 'Decoración y Accesorios' },
        ],
      },
    ],
  },
];

