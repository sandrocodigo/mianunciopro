export const categorias = [
  {
    id: 'VEHICULOS',
    descripcion: 'Vehículos',
    icono: 'directions_car',
    subcategorias: [
      { id: 'AUTOS_USADOS', descripcion: 'Autos Usados' },
      { id: 'AUTOS_NUEVOS', descripcion: 'Autos Nuevos' },
      { id: 'MOTOS', descripcion: 'Motos' },
      { id: 'CAMIONES_BUSES', descripcion: 'Camiones y Buses' },
      { id: 'BICICLETAS', descripcion: 'Bicicletas y Scooters' },
      {
        id: 'PIEZAS_ACCESORIOS',
        descripcion: 'Piezas y Accesorios',
        subcategorias: [
          { id: 'CHASIS_PARTES_EXTERNAS', descripcion: 'Chasis y Partes Externas' },
          {
            id: 'EQUIPO_MUSICA',
            descripcion: 'Equipo de Música',
            subcategorias: [
              { id: 'EQUIPO_5_1', descripcion: '5.1' },
              { id: 'EQUIPO_7_1', descripcion: '7.1' },
            ],
          },
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
    subcategorias: [
      {
        id: 'VENTA',
        descripcion: 'Venta',
        subcategorias: [
          { id: 'CASAS', descripcion: 'Venta de Casas' },
          { id: 'APARTAMENTOS', descripcion: 'Apartamentos' },
          { id: 'TERRENOS', descripcion: 'Terrenos' },
          { id: 'PROPIEDADES_PLAYA', descripcion: 'Propiedades de Playa' },
        ],
      },
      {
        id: 'ALQUILER',
        descripcion: 'Alquiler',
        subcategorias: [
          { id: 'CASAS_ALQUILER', descripcion: 'Casas en Alquiler' },
          { id: 'APARTAMENTOS_ALQUILER', descripcion: 'Apartamentos en Alquiler' },
          { id: 'OFICINAS_LOCALES', descripcion: 'Oficinas y Locales Comerciales' },
          { id: 'CUARTOS_HABITACIONES', descripcion: 'Cuartos o Habitaciones' },
        ],
      },
      {
        id: 'ALQUILER_VACACIONAL',
        descripcion: 'Alquiler Vacacional',
        subcategorias: [
          { id: 'CASAS_VACACIONALES', descripcion: 'Casas Vacacionales' },
          { id: 'DEPARTAMENTOS_PLAYA', descripcion: 'Departamentos de Playa' },
        ],
      },
    ],
  },

  //
  // EMPLEOS: solo laboral
  //
  {
    id: 'EMPLEOS',
    descripcion: 'Empleos',
    icono: 'work',
    subcategorias: [
      {
        id: 'OFERTAS_TRABAJO',
        descripcion: 'Ofertas de Trabajo',
        subcategorias: [
          { id: 'TIEMPO_COMPLETO', descripcion: 'Tiempo Completo' },
          { id: 'MEDIO_TIEMPO', descripcion: 'Medio Tiempo' },
          { id: 'FREELANCE_REMOTO', descripcion: 'Freelance / Remoto' },
          { id: 'PRACTICAS_PASANTIAS', descripcion: 'Prácticas y Pasantías' },
        ],
      },
      {
        id: 'HOJA_VIDA',
        descripcion: 'Publicar Hoja de Vida',
      },
      {
        id: 'CURSOS_CAPACITACION',
        descripcion: 'Cursos y Capacitación',
        subcategorias: [
          { id: 'IDIOMAS_TRADUCCION', descripcion: 'Idiomas y Traducción' },
          { id: 'ARTE_MUSICA', descripcion: 'Arte, Danza y Música' },
          { id: 'OTROS_CURSOS', descripcion: 'Otros Cursos' },
          { id: 'TECNICOS_INFORMATICA', descripcion: 'Técnicos / Informática' },
        ],
      },
    ],
  },

  //
  // SERVICIOS: lo que alguien ofrece (no empleo)
  //
  {
    id: 'SERVICIOS',
    descripcion: 'Servicios',
    icono: 'handyman',
    subcategorias: [
      {
        id: 'SERVICIOS_HOGAR',
        descripcion: 'Hogar y Mantenimiento',
        subcategorias: [
          { id: 'LIMPIEZA', descripcion: 'Limpieza y Mantenimiento' },
          { id: 'PLOMERIA', descripcion: 'Plomería' },
          { id: 'ELECTRICIDAD', descripcion: 'Electricidad' },
          { id: 'JARDINERIA', descripcion: 'Jardinería' },
        ],
      },
      {
        id: 'CONSTRUCCION',
        descripcion: 'Construcción y Remodelación',
        subcategorias: [
          { id: 'ALBANILERIA', descripcion: 'Albañilería' },
          { id: 'PINTURA', descripcion: 'Pintura' },
          { id: 'CARPINTERIA', descripcion: 'Carpintería' },
        ],
      },
      {
        id: 'TRANSPORTE',
        descripcion: 'Transporte y Mudanzas',
        subcategorias: [
          { id: 'MUDANZAS', descripcion: 'Mudanzas' },
          { id: 'CARGA', descripcion: 'Transporte de Carga' },
        ],
      },
      {
        id: 'SERVICIOS_EMPRESARIALES',
        descripcion: 'Servicios Empresariales',
        subcategorias: [
          { id: 'MARKETING', descripcion: 'Publicidad y Marketing' },
          { id: 'DISENO_WEB', descripcion: 'Diseño y Desarrollo Web' },
          { id: 'CONTABILIDAD', descripcion: 'Contabilidad y Tributación' },
        ],
      },
    ],
  },

  {
    id: 'MARKETPLACE',
    descripcion: 'Marketplace',
    icono: 'storefront',
    subcategorias: [
      {
        id: 'TECNOLOGIA',
        descripcion: 'Tecnología',
        subcategorias: [
          { id: 'TELEFONOS_CELULARES', descripcion: 'Teléfonos Celulares' },
          { id: 'ELECTRONICOS_VESTIBLES', descripcion: 'Dispositivos Vestibles' },
          { id: 'DOMOTICA', descripcion: 'Domótica y Casa Inteligente' },
          { id: 'AUDIO_VIDEO_FOTO', descripcion: 'Audio, Video y Fotografía' },
          { id: 'COMPUTACION', descripcion: 'Computadoras y Accesorios' },
        ],
      },
      {
        id: 'MERCANCIA_MAYORISTA',
        descripcion: 'Mercancía Mayorista',
        subcategorias: [
          { id: 'SE_VENDE', descripcion: 'Se Vende' },
          { id: 'YO_BUSCO', descripcion: 'Yo Busco' },
        ],
      },
      {
        id: 'CONSTRUCCION',
        descripcion: 'Construcción',
        subcategorias: [
          { id: 'HERRAMIENTAS', descripcion: 'Herramientas y Materiales' },
          { id: 'MAQUINARIA', descripcion: 'Maquinaria y Equipos' },
        ],
      },
      {
        id: 'MUEBLES_HOGAR',
        descripcion: 'Muebles, Hogar y Jardín',
        subcategorias: [
          { id: 'MUEBLES_INTERIOR', descripcion: 'Muebles de Interior' },
          { id: 'COCINA', descripcion: 'Cocina y Electrodomésticos' },
          { id: 'JARDIN', descripcion: 'Jardín y Exterior' },
          { id: 'DECORACION', descripcion: 'Decoración y Accesorios' },
        ],
      },
    ],
  },
];
