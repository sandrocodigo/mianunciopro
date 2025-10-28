import { Injectable } from '@angular/core';
import {
  CollectionReference,
  DocumentData,
  Firestore,
  addDoc,
  collection,
  collectionData,
  doc,
  docData,
  getDoc,
  getDocs,
  orderBy,
  query,
  serverTimestamp,
  updateDoc,
} from '@angular/fire/firestore';
import { Observable, catchError, map, of } from 'rxjs';

import { Anuncio, TipoAnuncio } from '../modelos/anuncio';

export type CrearAnuncioPayload = Omit<Anuncio, 'id' | 'createdAt' | 'updatedAt'>;

@Injectable({
  providedIn: 'root',
})
export class AnuncioService {
  private readonly url = 'anuncios';
  private readonly coleccion: CollectionReference<DocumentData>;

  constructor(private readonly firestore: Firestore) {
    this.coleccion = collection(this.firestore, this.url);
  }


  // NUEVO
  async nuevo(datos: any) {
    const docRef = await addDoc(collection(this.firestore, `${this.url}`), datos);
    return docRef;
  }

  // EDITAR
  async editar(ID: any, datos: any) {
    // Convertir a flotante solo si el campo existe
/*     if (datos.hasOwnProperty('cantidad')) { datos.cantidad = parseFloat(datos.cantidad); }
    if (datos.hasOwnProperty('pc')) { datos.pc = parseFloat(datos.pc); }
    if (datos.hasOwnProperty('pv')) { datos.pv = parseFloat(datos.pv); }
    if (datos.hasOwnProperty('subtotal')) { datos.subtotal = parseFloat(datos.subtotal); } */
    const documento = doc(this.firestore, `${this.url}`, ID);
    await updateDoc(documento, datos);
  }

  async crear(anuncio: CrearAnuncioPayload): Promise<string> {
    const payload = {
      ...anuncio,
      attrs: this.normalizarAttrs(anuncio.tipo, anuncio.attrs),
      fotos: (anuncio.fotos ?? []).filter((url) => url && url.trim().length > 0),
      views: anuncio.views ?? 0,
      favoritosCount: anuncio.favoritosCount ?? 0,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    };

    const docRef = await addDoc(this.coleccion, payload);
    return docRef.id;
  }

  async actualizar(id: string, cambios: Partial<CrearAnuncioPayload>): Promise<void> {
    const docRef = doc(this.firestore, this.url, id);

    const payload: Record<string, unknown> = {
      ...cambios,
      updatedAt: serverTimestamp(),
    };

    if (cambios.tipo && cambios.attrs) {
      payload['attrs'] = this.normalizarAttrs(cambios.tipo as TipoAnuncio, cambios.attrs);
    }

    if (cambios.fotos) {
      payload['fotos'] = cambios.fotos.filter((url) => url && url.trim().length > 0);
    }

    await updateDoc(docRef, payload);
  }

  async obtenerPorId(id: string): Promise<Anuncio | null> {
    const docRef = doc(this.firestore, this.url, id);
    const snapshot = await getDoc(docRef);
    if (!snapshot.exists()) {
      return null;
    }
    return this.mapearAnuncio(snapshot.id, snapshot.data());
  }

  obtenerPorIdTR(id: string): Observable<Anuncio | null> {
    const docRef = doc(this.firestore, this.url, id);
    return docData(docRef, { idField: 'id' }).pipe(
      map((data) => {
        if (!data) {
          return null;
        }
        const anuncio = data as DocumentData & { id: string };
        return this.mapearAnuncio(anuncio.id, anuncio);
      }),
      catchError(() => of(null)),
    );
  }

  async obtenerTodos(): Promise<Anuncio[]> {
    const consulta = query(this.coleccion, orderBy('createdAt', 'desc'));
    const snapshot = await getDocs(consulta);
    return snapshot.docs.map((docSnap) => this.mapearAnuncio(docSnap.id, docSnap.data()));
  }

  obtenerTodosTR(): Observable<Anuncio[]> {
    const consulta = query(this.coleccion, orderBy('createdAt', 'desc'));
    return collectionData(consulta, { idField: 'id' }).pipe(
      map((registros) =>
        registros.map((registro) => {
          const anuncio = registro as DocumentData & { id: string };
          return this.mapearAnuncio(anuncio.id, anuncio);
        }),
      ),
    );
  }

  private mapearAnuncio(id: string, data: DocumentData): Anuncio {
    const anuncio = {
      ...data,
      id,
    } as Anuncio;
    anuncio.attrs = this.normalizarAttrs(anuncio.tipo, anuncio.attrs);
    return anuncio;
  }

  private normalizarAttrs(tipo: TipoAnuncio, attrs: unknown): Record<string, unknown> {
    const datos = (attrs ?? {}) as Record<string, unknown>;

    const limpiar = (valor: unknown) => {
      if (valor === null || valor === undefined || valor === '') {
        return undefined;
      }
      return valor;
    };

    switch (tipo) {
      case 'VEHICULO':
        return {
          marca: limpiar(datos['marca']),
          modelo: limpiar(datos['modelo']),
          anio: limpiar(this.aNumero(datos['anio'])),
          kilometraje: limpiar(this.aNumero(datos['kilometraje'])),
          transmision: limpiar(datos['transmision']),
          combustible: limpiar(datos['combustible']),
        };
      case 'INMUEBLE':
        return {
          tipoPropiedad: limpiar(datos['tipoPropiedad']),
          metrosCuadrados: limpiar(this.aNumero(datos['metrosCuadrados'])),
          habitaciones: limpiar(this.aNumero(datos['habitaciones'])),
          banos: limpiar(this.aNumero(datos['banos'])),
          amoblado: limpiar(datos['amoblado']),
        };
      case 'EMPLEO':
        return {
          cargo: limpiar(datos['cargo']),
          tipoContrato: limpiar(datos['tipoContrato']),
          salarioMin: limpiar(this.aNumero(datos['salarioMin'])),
          salarioMax: limpiar(this.aNumero(datos['salarioMax'])),
        };
      case 'SERVICIO':
        return {
          rubro: limpiar(datos['rubro']),
          experiencia: limpiar(this.aNumero(datos['experiencia'])),
        };
      case 'MARKETPLACE':
        return {
          condicion: limpiar(datos['condicion']),
          marca: limpiar(datos['marca']),
          modelo: limpiar(datos['modelo']),
        };
      default:
        return {};
    }
  }

  private aNumero(valor: unknown): number | undefined {
    if (valor === null || valor === undefined || valor === '') {
      return undefined;
    }
    const numero = Number(valor);
    return Number.isFinite(numero) ? numero : undefined;
  }
}
