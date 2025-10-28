// Sugerencia: guarda esto en /data/categorias.schema.ts
export const CategoriaSchema = {
  VEHICULO: {
    meta: { icono: 'directions_car', path: 'vehiculo' },
    subcategorias: {
      AUTOS_USADOS: {
        filtrosRapidos: ['marca','modelo','anio','kilometraje','combustible','transmision','precio'],
        campos: [
          { id: 'marca', label: 'Marca', type: 'select', required: true, optionsSrc: 'VEH_MARCAS' },
          { id: 'modelo', label: 'Modelo', type: 'text', required: true, dependsOn: 'marca' },
          { id: 'anio', label: 'Año', type: 'number', required: true, min: 1980, max: new Date().getFullYear() + 1 },
          { id: 'kilometraje', label: 'Kilometraje', type: 'number', min: 0, step: 50, suffix: 'km' },
          { id: 'transmision', label: 'Transmisión', type: 'select', options: ['MANUAL','AUTOMATICA'] },
          { id: 'combustible', label: 'Combustible', type: 'select', options: ['GASOLINA','DIESEL','HIBRIDO','ELECTRICO','GNV'] },
          { id: 'traccion', label: 'Tracción', type: 'select', options: ['4X2','4X4','AWD','FWD','RWD'] },
          { id: 'cilindrada', label: 'Cilindrada', type: 'number', min: 600, max: 7000, suffix: 'cc' },
          { id: 'puertas', label: 'Puertas', type: 'select', options: [2,3,4,5] },
          { id: 'color', label: 'Color', type: 'text' },
          { id: 'unicoDueno', label: 'Único dueño', type: 'boolean' },
          { id: 'accidentado', label: '¿Ha sido chocado?', type: 'boolean' },
          { id: 'aireAcondicionado', label: 'Aire acondicionado', type: 'boolean' },
          { id: 'placa', label: 'Placa', type: 'text', private: true }, // no indexar/publicar
          { id: 'garantia', label: 'Garantía', type: 'text', placeholder: '3 meses motor/caja' },
        ],
      },
      AUTOS_NUEVOS: { extends: 'AUTOS_USADOS', override: { campos: [{ id: 'kilometraje', hide: true }, { id: 'garantia', required: true }] } },
      MOTOS: {
        filtrosRapidos: ['marca','modelo','anio','cilindrada','precio'],
        campos: [
          { id: 'marca', label: 'Marca', type: 'select', required: true, optionsSrc: 'MOTO_MARCAS' },
          { id: 'modelo', label: 'Modelo', type: 'text', required: true },
          { id: 'anio', label: 'Año', type: 'number', required: true },
          { id: 'cilindrada', label: 'Cilindrada', type: 'number', min: 50, max: 1400, suffix: 'cc' },
          { id: 'kilometraje', label: 'Kilometraje', type: 'number' },
          { id: 'condicion', label: 'Condición', type: 'select', options: ['NUEVO','USADO'] },
        ],
      },
      CAMIONES_BUSES: {
        filtrosRapidos: ['marca','anio','capacidadCarga','precio'],
        campos: [
          { id: 'marca', label: 'Marca', type: 'text', required: true },
          { id: 'anio', label: 'Año', type: 'number', required: true },
          { id: 'capacidadCarga', label: 'Capacidad de carga', type: 'number', suffix: 'ton' },
          { id: 'eje', label: 'N° Ejes', type: 'select', options: [2,3,4,5] },
        ],
      },
      PIEZAS_ACCESORIOS: {
        filtrosRapidos: ['tipoPieza','compatibleCon','condicion','precio'],
        campos: [
          { id: 'tipoPieza', label: 'Tipo de pieza', type: 'select',
            options: ['CHASIS_PARTES_EXTERNAS','EQUIPO_MUSICA','LLANTAS_RUEDAS','MOTORES_TRANSMISION','INTERIOR','ACEITES_FLUIDOS'] },
          { id: 'compatibleCon', label: 'Compatible con', type: 'text', placeholder: 'Marca/Modelo/Año' },
          { id: 'condicion', label: 'Condición', type: 'select', options: ['NUEVO','USADO'] },
          { id: 'garantia', label: 'Garantía', type: 'text' },
        ],
      },
    },
  },

  INMUEBLE: {
    meta: { icono: 'apartment', path: 'inmueble' },
    subcategorias: {
      VENTA_CASAS: {
        filtrosRapidos: ['habitaciones','banos','parqueos','metrosConstruidos','precio'],
        campos: [
          { id: 'operacion', label: 'Operación', type: 'const', value: 'VENTA' },
          { id: 'tipoPropiedad', label: 'Tipo', type: 'select', required: true, options: ['CASA','DUPLEX','CHALET','PH'] },
          { id: 'metrosConstruidos', label: 'Metros construidos', type: 'number', required: true, suffix: 'm²' },
          { id: 'metrosTerreno', label: 'Metros de terreno', type: 'number', suffix: 'm²' },
          { id: 'habitaciones', label: 'Habitaciones', type: 'number', min: 0 },
          { id: 'banos', label: 'Baños', type: 'number', min: 0 },
          { id: 'parqueos', label: 'Parqueos', type: 'number', min: 0 },
          { id: 'antiguedad', label: 'Antigüedad', type: 'number', min: 0, suffix: 'años' },
          { id: 'amoblado', label: 'Amoblado', type: 'boolean' },
          { id: 'gastosComunes', label: 'Gastos comunes', type: 'number', suffix: 'mes' },
          { id: 'amenities', label: 'Amenities', type: 'tags', options: ['Jardin','Terraza','Churrasquera','Piscina','Seguridad 24h'] },
        ],
      },
      ALQUILER_DEPARTAMENTOS: {
        filtrosRapidos: ['habitaciones','banos','amoblado','precio'],
        campos: [
          { id: 'operacion', label: 'Operación', type: 'const', value: 'ALQUILER' },
          { id: 'tipoPropiedad', label: 'Tipo', type: 'select', options: ['DEPTO','ESTUDIO','LOFT'], required: true },
          { id: 'metrosCuadrados', label: 'Metros', type: 'number', suffix: 'm²' },
          { id: 'habitaciones', label: 'Habitaciones', type: 'number' },
          { id: 'banos', label: 'Baños', type: 'number' },
          { id: 'amoblado', label: 'Amoblado', type: 'boolean' },
          { id: 'mascotas', label: 'Permite mascotas', type: 'boolean' },
          { id: 'incluyeServicios', label: 'Incluye servicios', type: 'boolean' },
          { id: 'expensas', label: 'Expensas', type: 'number' },
          { id: 'contratoMinMeses', label: 'Contrato mínimo', type: 'number', suffix: 'meses' },
          { id: 'depositoGarantia', label: 'Depósito garantía', type: 'number' },
        ],
      },
      TERRENOS: {
        filtrosRapidos: ['metrosTerreno','precio'],
        campos: [
          { id: 'operacion', label: 'Operación', type: 'select', options: ['VENTA','ALQUILER'] },
          { id: 'tipoPropiedad', label: 'Tipo', type: 'const', value: 'TERRENO' },
          { id: 'metrosTerreno', label: 'Metros de terreno', type: 'number', required: true, suffix: 'm²' },
          { id: 'frente', label: 'Frente', type: 'number', suffix: 'm' },
          { id: 'fondo', label: 'Fondo', type: 'number', suffix: 'm' },
          { id: 'servicios', label: 'Servicios', type: 'tags', options: ['Agua','Luz','Alcantarillado','Gas','Fibra'] },
        ],
      },
    },
  },

  EMPLEO: {
    meta: { icono: 'work', path: 'empleo' },
    subcategorias: {
      OFERTAS_TRABAJO: {
        filtrosRapidos: ['area','modalidad','seniority','salario','ciudad'],
        campos: [
          { id: 'cargo', label: 'Cargo', type: 'text', required: true },
          { id: 'area', label: 'Área', type: 'select', options: ['TI','Ventas','Administración','Logística','Salud','Educación','Construcción','Atención al cliente'] },
          { id: 'tipoContrato', label: 'Tipo de contrato', type: 'select', required: true, options: ['TIEMPO_COMPLETO','MEDIO_TIEMPO','FREELANCE','PRACTICAS'] },
          { id: 'modalidad', label: 'Modalidad', type: 'select', options: ['PRESENCIAL','HIBRIDO','REMOTO'] },
          { id: 'seniority', label: 'Seniority', type: 'select', options: ['Junior','Semi senior','Senior','Lider'] },
          { id: 'experienciaMin', label: 'Experiencia mínima', type: 'number', min: 0, suffix: 'años' },
          { id: 'salarioMin', label: 'Salario mínimo', type: 'number' },
          { id: 'salarioMax', label: 'Salario máximo', type: 'number' },
          { id: 'beneficios', label: 'Beneficios', type: 'tags', options: ['Seguro','Bono','Capacitación','Horario flexible'] },
          { id: 'fechaCierre', label: 'Fecha de cierre', type: 'date' },
          { id: 'requisitos', label: 'Requisitos', type: 'textarea' },
        ],
      },
      HOJA_VIDA: { campos: [{ id: 'cvUrl', label: 'CV (PDF/Drive)', type: 'file' }, { id: 'cargo', label: 'Puesto deseado', type: 'text' }] },
      CURSOS_EDUCACION: {
        campos: [
          { id: 'nombreCurso', label: 'Nombre del curso', type: 'text', required: true },
          { id: 'duracion', label: 'Duración', type: 'text' },
          { id: 'modalidad', label: 'Modalidad', type: 'select', options: ['Online','Presencial'] },
          { id: 'certificacion', label: '¿Otorga certificación?', type: 'boolean' },
        ],
      },
    },
  },

  SERVICIO: {
    meta: { icono: 'handyman', path: 'servicio' },
    subcategorias: {
      CONSTRUCCION: {
        filtrosRapidos: ['rubro','experiencia','metodoCobro','precio'],
        campos: [
          { id: 'rubro', label: 'Rubro', type: 'select', required: true, options: ['Albañilería','Plomería','Electricidad','Pintura','Carpintería'] },
          { id: 'experiencia', label: 'Años de experiencia', type: 'number', min: 0 },
          { id: 'metodoCobro', label: 'Método de cobro', type: 'select', options: ['POR_HORA','POR_PROYECTO','POR_VISITA'] },
          { id: 'precioHora', label: 'Precio por hora', type: 'number', showIf: { metodoCobro: 'POR_HORA' } },
          { id: 'coberturaZonas', label: 'Cobertura', type: 'chips', placeholder: 'Ej: Centro, Villa Adela...' },
          { id: 'horarios', label: 'Horarios', type: 'text' },
          { id: 'factura', label: '¿Emite factura?', type: 'boolean' },
          { id: 'licencia', label: 'Licencia/Registro', type: 'text' },
          { id: 'portafolioUrl', label: 'Portafolio', type: 'url' },
        ],
      },
      TRANSPORTE: {
        campos: [
          { id: 'tipoServicio', label: 'Tipo', type: 'select', options: ['Mudanzas','Cargas','Pasajeros','Encomiendas'] },
          { id: 'capacidad', label: 'Capacidad', type: 'number', suffix: 'm³' },
          { id: 'metodoCobro', label: 'Método de cobro', type: 'select', options: ['POR_HORA','POR_KM','POR_TRAMO'] },
        ],
      },
    },
  },

  MARKETPLACE: {
    meta: { icono: 'storefront', path: 'marketplace' },
    subcategorias: {
      TECNOLOGIA: {
        filtrosRapidos: ['categoriaItem','marca','condicion','precio'],
        campos: [
          { id: 'categoriaItem', label: 'Categoría', type: 'select',
            options: ['TELEFONOS_CELULARES','COMPUTACION','AUDIO_VIDEO_FOTO','DOMOTICA','ELECTRONICOS_VESTIBLES'] },
          { id: 'marca', label: 'Marca', type: 'text' },
          { id: 'modelo', label: 'Modelo', type: 'text' },
          { id: 'condicion', label: 'Condición', type: 'select', options: ['NUEVO','USADO','REACONDICIONADO'] },
          { id: 'garantia', label: 'Garantía', type: 'text' },
          { id: 'almacenamiento', label: 'Almacenamiento', type: 'text' },
          { id: 'ram', label: 'RAM', type: 'text' },
        ],
      },
      MUEBLES_HOGAR: {
        filtrosRapidos: ['categoriaItem','condicion','precio'],
        campos: [
          { id: 'categoriaItem', label: 'Categoría', type: 'select', options: ['Muebles','Cocina','Jardin','Decoracion'] },
          { id: 'condicion', label: 'Condición', type: 'select', options: ['NUEVO','USADO'] },
          { id: 'material', label: 'Material', type: 'text' },
          { id: 'dimensiones', label: 'Dimensiones', type: 'text', placeholder: 'Alto x Ancho x Prof.' },
          { id: 'peso', label: 'Peso', type: 'number', suffix: 'kg' },
        ],
      },
      MERCANCIA_MAYORISTA: {
        filtrosRapidos: ['operacionMayorista','precio'],
        campos: [
          { id: 'operacionMayorista', label: 'Tipo', type: 'select', options: ['SE_VENDE','YO_BUSCO'] },
          { id: 'unidadVenta', label: 'Unidad de venta', type: 'select', options: ['Unidad','Docena','Caja','Bulto'] },
          { id: 'minimoCompra', label: 'Mínimo de compra', type: 'number' },
        ],
      },
      ENVIO_ENTREGA: {
        // Bloque genérico para todas las subcats de marketplace
        campos: [
          { id: 'stock', label: 'Stock', type: 'number', min: 0 },
          { id: 'envioDisponible', label: '¿Envío disponible?', type: 'boolean' },
          { id: 'retiroEnTienda', label: '¿Retiro en tienda?', type: 'boolean' },
          { id: 'contraEntrega', label: '¿Contraentrega?', type: 'boolean' },
          { id: 'factura', label: '¿Emite factura?', type: 'boolean' },
        ],
      },
    },
  },
} as const;
