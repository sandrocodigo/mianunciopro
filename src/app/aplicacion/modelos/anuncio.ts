export type Moneda = 'BOB' | 'USD'; // simplifica y evita errores
export type Categorias = 'VEHICULOS' | 'INMUEBLES' | 'EMPLEOS'| 'SERVICIOS' | 'MARKETPLACE';

export interface Ubicacion {
    departamento: string;      // "La Paz"
    provincia: string;
    ciudad: string;            // "El Alto"
    zona?: string;             // "Villa Adela"
    lat?: number;
    lng?: number;
    geohash?: string;          // para búsquedas por radio
}

export interface BaseAnuncio {
    id: string;

    categoria: Categorias;         // p.ej. "Vehículos"
    categoria1?: string;
    categoria2?: string;
    categoria3?: string;

    titulo: string;
    descripcion: string;
    urlAnuncio: string;    

    precio: number;            // usa entero si quieres evitar decimales (p.ej. centavos)
    moneda: Moneda;
    negociable?: boolean;

    ubicacion: Ubicacion;

    fotos: string[];           // rutas Storage o URLs públicas
    vendedorId: string;

    // control/estado
    estado: 'publicado' | 'pendiente' | 'pausado' | 'eliminado';
    destacado?: { activo: boolean; venceAt?: any /* Timestamp */ };
    
    publicado?: boolean;
    publicadoFecha?: any;

    // métricas
    views?: number;
    favoritosCount?: number;

    createdAt: any;            // Timestamp (serverTimestamp)
    updatedAt: any;            // Timestamp (serverTimestamp)

    // campos de búsqueda denormalizados (ver abajo)
    search?: {
        texto?: string[];        // tokens normalizados
        precioBucket?: number;   // 0..N para filtros rápidos
    };
}

/** Atributos por tipo */
export interface AttrsVehiculo {
    marca?: string;
    modelo?: string;
    anio?: number;
    kilometraje?: number;
    transmision?: 'MANUAL' | 'AUTOMATICA';
    combustible?: 'GASOLINA' | 'DIESEL' | 'HIBRIDO' | 'ELECTRICO';
}

export interface AttrsInmueble {
    tipoPropiedad?: 'CASA' | 'DEPTO' | 'TERRENO' | 'OFICINA' | 'LOCAL';
    metrosCuadrados?: number;
    habitaciones?: number;
    banos?: number;
    amoblado?: boolean;
}

export interface AttrsEmpleo {
    cargo?: string;
    tipoContrato?: 'TIEMPO_COMPLETO' | 'MEDIO_TIEMPO' | 'FREELANCE' | 'PRACTICAS';
    salarioMin?: number;
    salarioMax?: number;
}

export interface AttrsServicio {
    rubro?: string;            // p.ej. "Plomería"
    experiencia?: number;      // años
}

export interface AttrsMarketplace {
    condicion?: 'NUEVO' | 'USADO';
    marca?: string;
    modelo?: string;
}

export type Anuncio =
    | (BaseAnuncio & { categoria: 'VEHICULOS'; attrs: AttrsVehiculo })
    | (BaseAnuncio & { categoria: 'INMUEBLES'; attrs: AttrsInmueble })
    | (BaseAnuncio & { categoria: 'EMPLEOS'; attrs: AttrsEmpleo })
    | (BaseAnuncio & { categoria: 'SERVICIOS'; attrs: AttrsServicio })
    | (BaseAnuncio & { categoria: 'MARKETPLACE'; attrs: AttrsMarketplace });
