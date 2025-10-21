import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Firestore, collectionData, collection, addDoc, doc, setDoc, getDoc, updateDoc, orderBy, onSnapshot, query, where, getDocs, CollectionReference, limit, startAt, endAt } from '@angular/fire/firestore';
import { Anuncio } from '../modelos/anuncio';

@Injectable({
  providedIn: 'root'
})
export class AnuncioService {

  private url = 'anuncios';

  constructor(private firestore: Firestore) { }

  // CREAR
  async crear(datos: any) {
    // Normalizar a mayúsculas
    if (datos.hasOwnProperty('codigo') && datos.codigo) {
      datos.codigo = String(datos.codigo).toUpperCase();
    }
    if (datos.hasOwnProperty('descripcion') && datos.descripcion) {
      datos.descripcion = String(datos.descripcion).toUpperCase();
    }

    if (datos.hasOwnProperty('precioServicio')) { datos.precioServicio = parseFloat(datos.precioServicio); }

    const docRef = await addDoc(collection(this.firestore, `${this.url}`), datos);
    return docRef;
  }

  // EDITAR
  async editar(ID: any, datos: any) {

    // Normalizar a mayúsculas
    if (datos.hasOwnProperty('codigo') && datos.codigo) {
      datos.codigo = String(datos.codigo).toUpperCase();
    }
    if (datos.hasOwnProperty('descripcion') && datos.descripcion) {
      datos.descripcion = String(datos.descripcion).toUpperCase();
    }

    if (datos.hasOwnProperty('precioServicio')) { datos.precioServicio = parseFloat(datos.precioServicio); }

    if (datos.hasOwnProperty('pc')) { datos.pc = parseFloat(datos.pc); }
    if (datos.hasOwnProperty('pv')) { datos.pv = parseFloat(datos.pv); }
    if (datos.hasOwnProperty('cantidadTotal')) { datos.cantidadTotal = parseFloat(datos.cantidadTotal); }

    const documento = doc(this.firestore, `${this.url}`, ID);
    await updateDoc(documento, datos);
  }

  // OBTENER POR ID
  async obtenerPorId(ID: any): Promise<any | null> {
    const docRef = doc(this.firestore, `${this.url}`, ID);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      return docSnap.data() as any;
    } else {
      return null;
    }
  }

  // ONTENER POR ID EN TIEMPO REAL
  obtenerPorIdTR(ID: any) {
    const docRef = doc(this.firestore, `${this.url}`, ID);
    return new Observable((subscriber) => {
      const unsubscribe = onSnapshot(docRef, (docSnap) => {
        if (docSnap.exists()) {
          subscriber.next(docSnap.data());
        } else {
          subscriber.next(null);
        }
      });
      return unsubscribe;
    });
  }

  // OBTENER TODOS
  async obtenerTodos(): Promise<any[]> {
    let q = query(
      collection(this.firestore, `${this.url}`) as CollectionReference<any>,
      orderBy('codigo')
    );
    return getDocs(q).then((querySnapshot) => {
      const registros: any[] = [];
      querySnapshot.forEach((doc) => {
        registros.push({ ...doc.data(), id: doc.id } as any);
      });
      return registros;
    });
  }

  // OBTENER TODOS EN TIEMPO REAL
  obtenerTodosTR() {
    return collectionData<any>(
      query<any, any>(
        collection(this.firestore, `${this.url}`) as CollectionReference<any>,
        orderBy('ordenar')
      ), { idField: 'id' }
    );
  }

  // OBTENER CONSULTA
  async obtenerConsulta(datos: any): Promise<Anuncio[]> {

    let coleccion = collection(this.firestore, `${this.url}`) as CollectionReference<Anuncio>;
    let condiciones = [];

    if (datos.hasOwnProperty('activo') && datos.activo !== 'TODOS') {
      const activoBoolean = datos.activo === 'true'; // Asegúrate de que sea booleano
      condiciones.push(where('activo', '==', activoBoolean));
    }

    if (datos.tipo !== 'TODOS') {
      condiciones.push(where('tipo', '==', datos.tipo));
    }

    if (datos.categoria !== 'TODOS') {
      condiciones.push(where('categoria', '==', datos.categoria));
    }

    if (datos.publicado !== 'TODOS') {
      const publicadoBoolean = datos.publicado === 'true'; // Asegúrate de que sea booleano
      condiciones.push(where('publicado', '==', publicadoBoolean));
    }

    // Orden predeterminado y rango de fechas
    let ordenYRango = [
      orderBy('codigo'),
    ];

    // Combinar condiciones, orden y rango para crear la consulta
    let q = query(coleccion, ...condiciones, ...ordenYRango);

    // Ejecutar la consulta y procesar los resultados
    const querySnapshot = await getDocs(q);
    const registros = querySnapshot.docs.map(doc => ({ ...doc.data(), id: doc.id }));

    return registros;
  }

  // OBTENER COINCIDENCIA
  async obtenerCoincidencia(datos: any): Promise<Anuncio[]> {
    console.log('DATOS RECIBIDOS EN SERVICIO: ', datos.descripcion);
    let coleccion = collection(this.firestore, `${this.url}`) as CollectionReference<Anuncio>;
    let condiciones = [];

    if (datos.hasOwnProperty('activo') && datos.activo !== 'TODOS') {
      const activoBoolean = datos.activo === 'true';
      condiciones.push(where('activo', '==', activoBoolean));
    }

    if (datos.tipo !== 'TODOS') {
      condiciones.push(where('tipo', '==', datos.tipo));
    }

    if (datos.categoria !== 'TODOS') {
      condiciones.push(where('categoria', '==', datos.categoria));
    }

    if (datos.publicado !== 'TODOS') {
      const publicadoBoolean = datos.publicado === 'true';
      condiciones.push(where('publicado', '==', publicadoBoolean));
    }

    // Orden predeterminado y rango de fechas
    let ordenYRango = [orderBy('descripcion')];

    // Si se busca por descripción
    if (datos.descripcion && datos.descripcion.trim() !== '') {
      const texto = datos.descripcion.trim().toLowerCase();
      ordenYRango = [orderBy('descripcion')];
      condiciones.push(startAt(texto));
      condiciones.push(endAt(texto + '\uf8ff'));
    }

    // Combinar condiciones, orden y rango para crear la consulta
    let q = query(coleccion, ...ordenYRango, ...condiciones, limit(datos.limite));

    const querySnapshot = await getDocs(q);
    const registros = querySnapshot.docs.map(doc => ({ ...doc.data(), id: doc.id }));

    return registros;
  }



  async obtenerConsultaConSaldo(datos: any): Promise<any[]> {
    // Obtener todos los productos
    const productosSnapshot = await getDocs(collection(this.firestore, 'productos'));
    const productos = productosSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

    // Inicializar objetos para mantener la suma de saldos y el último pv
    const saldosPorProducto: any = {};
    const pvPorProducto: any = {};

    // Obtener todos los detalles de ingresos
    const ingresosDetallesSnapshot = await getDocs(collection(this.firestore, 'ingresos-detalles'));
    ingresosDetallesSnapshot.forEach(doc => {
      const detalle: any = doc.data();

      // Sumar la cantidadSaldo al producto correspondiente
      if (detalle.productoId && detalle.cantidadSaldo) {
        if (!saldosPorProducto[detalle.productoId]) {
          saldosPorProducto[detalle.productoId] = 0;
        }
        saldosPorProducto[detalle.productoId] += detalle.cantidadSaldo;
      }

      // Actualizar el último pv para el producto
      if (detalle.productoId && detalle.pv) {
        pvPorProducto[detalle.productoId] = detalle.pv;
      }
    });

    // Agregar la cantidadSaldo total y el último pv a cada producto
    const productosConSaldo = productos.map(producto => ({
      ...producto,
      cantidadSaldoTotal: saldosPorProducto[producto.id] || 0,
      precioVenta: pvPorProducto[producto.id] || 0
    }));

    return productosConSaldo;
  }


  async obtenerConsultaConSaldoPublicado(datos: any): Promise<any[]> {
    // Obtener productos que tienen 'publicado' igual a true
    const productosRef = collection(this.firestore, 'productos');
    const q = query(productosRef, where('publicado', '==', true));
    const productosSnapshot = await getDocs(q);
    const productos = productosSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));


    // Inicializar objetos para mantener la suma de saldos y el último pv
    const saldosPorProducto: any = {};
    const pvPorProducto: any = {};

    // Obtener todos los detalles de ingresos
    const ingresosDetallesSnapshot = await getDocs(collection(this.firestore, 'ingresos-detalles'));
    ingresosDetallesSnapshot.forEach(doc => {
      const detalle: any = doc.data();

      // Sumar la cantidadSaldo al producto correspondiente
      if (detalle.productoId && detalle.cantidadSaldo) {
        if (!saldosPorProducto[detalle.productoId]) {
          saldosPorProducto[detalle.productoId] = 0;
        }
        saldosPorProducto[detalle.productoId] += detalle.cantidadSaldo;
      }

      // Actualizar el último pv para el producto
      if (detalle.productoId && detalle.pv) {
        pvPorProducto[detalle.productoId] = detalle.pv;
      }
    });

    // Agregar la cantidadSaldo total y el último pv a cada producto
    const productosConSaldo = productos.map(producto => ({
      ...producto,
      cantidadSaldoTotal: saldosPorProducto[producto.id] || 0,
      precioVenta: pvPorProducto[producto.id] || 0
    }));

    return productosConSaldo;
  }

  async obtenerConsultaConSaldoReporte(datos: any): Promise<any[]> {
    let coleccion = collection(this.firestore, `${this.url}`) as CollectionReference<Anuncio>;
    let condiciones = [where('activo', '==', true)];

    // Aplicar condiciones solo si el usuario y el producto no son 'TODOS'
    if (datos.tipo !== 'TODOS') {
      condiciones.push(where('tipo', '==', datos.tipo));
    }

    if (datos.publicado !== 'TODOS') {
      const publicadoBoolean = datos.publicado === 'true'; // Asegúrate de que sea booleano
      condiciones.push(where('publicado', '==', publicadoBoolean));
    }

    // Orden predeterminado y rango de fechas
    let ordenYRango = [orderBy('descripcion')];

    // Crear la consulta con filtros y orden
    let q = query(coleccion, ...condiciones, ...ordenYRango, limit(datos.limite));

    // Ejecutar la consulta de productos
    const querySnapshot = await getDocs(q);
    const productos = querySnapshot.docs.map((doc: any) => ({
      id: doc.id,
      ...doc.data()
    }));

    // Inicializar objetos para mantener la suma de saldos y el último pv
    const saldosPorProducto: any = {};
    const pvPorProducto: any = {};

    // Obtener todos los detalles de ingresos
    const ingresosDetallesSnapshot = await getDocs(collection(this.firestore, 'ingresos-detalles'));
    ingresosDetallesSnapshot.forEach(doc => {
      const detalle: any = doc.data();

      // Sumar la cantidadSaldo al producto correspondiente
      if (detalle.productoId && detalle.cantidadSaldo) {
        if (!saldosPorProducto[detalle.productoId]) {
          saldosPorProducto[detalle.productoId] = 0;
        }
        saldosPorProducto[detalle.productoId] += detalle.cantidadSaldo;
      }

      // Actualizar el último pv para el producto
      if (detalle.productoId && detalle.pv) {
        pvPorProducto[detalle.productoId] = detalle.pv;
      }
    });

    // Agregar la cantidadSaldo total y el último pv a cada producto
    const productosConSaldo = productos.map(producto => ({
      ...producto,
      cantidadSaldoTotal: saldosPorProducto[producto.id] || 0,
      precioVenta: pvPorProducto[producto.id] || 0
    }));

    return productosConSaldo;
  }

  async obtenerConsultaSaldoYPrecio(datos: any): Promise<any[]> {
    const coleccion = collection(this.firestore, `${this.url}`) as CollectionReference<Anuncio>;
    const condiciones = [where('activo', '==', true)];

    // Aplicar condiciones según filtros
    if (datos.tipo !== 'TODOS') {
      condiciones.push(where('tipo', '==', datos.tipo));
    }

    if (datos.publicado !== 'TODOS') {
      const publicadoBoolean = datos.publicado === 'true';
      condiciones.push(where('publicado', '==', publicadoBoolean));
    }

    // Orden y límite
    const ordenYRango = [orderBy('descripcion')];
    const q = query(coleccion, ...condiciones, ...ordenYRango, limit(datos.limite));

    // Consulta de productos
    const querySnapshot = await getDocs(q);
    const productos = querySnapshot.docs.map((doc: any) => ({
      id: doc.id,
      ...doc.data()
    }));

    // Inicializar estructuras de acumulación
    const saldosPorProducto: Record<string, number> = {};
    const totalPvPorProducto: Record<string, number> = {};
    const totalCantidadPorProducto: Record<string, number> = {};
    const ultimoPvPorProducto: Record<string, number> = {};

    // Obtener todos los ingresos-detalles
    const ingresosDetallesSnapshot = await getDocs(collection(this.firestore, 'ingresos-detalles'));
    ingresosDetallesSnapshot.forEach(doc => {
      const detalle: any = doc.data();
      const productoId = detalle.productoId;

      if (!productoId) return;

      const cantidad = detalle.cantidadSaldo || 0;
      const pv = detalle.pv || 0;

      // Sumar saldos
      saldosPorProducto[productoId] = (saldosPorProducto[productoId] || 0) + cantidad;

      // Sumar para el cálculo del promedio ponderado
      totalPvPorProducto[productoId] = (totalPvPorProducto[productoId] || 0) + (pv * cantidad);
      totalCantidadPorProducto[productoId] = (totalCantidadPorProducto[productoId] || 0) + cantidad;

      // Guardar el último precio de venta registrado
      ultimoPvPorProducto[productoId] = pv;
    });

    // Construir resultado final
    const productosConSaldo = productos.map(producto => {
      const cantidadTotal = totalCantidadPorProducto[producto.id] || 0;
      const totalPv = totalPvPorProducto[producto.id] || 0;
      const promedio = cantidadTotal > 0 ? totalPv / cantidadTotal : 0;

      return {
        ...producto,
        cantidadSaldoTotal: saldosPorProducto[producto.id] || 0,
        precioVenta: parseFloat(promedio.toFixed(2)), // promedio ponderado
        ultimoPrecioVenta: ultimoPvPorProducto[producto.id] || 0 // último pv registrado
      };
    });

    return productosConSaldo;
  }


  // OBTENER POR TIPO
  async obtenerPorTipo(tipo: any): Promise<any[]> {
    let q = query(
      collection(this.firestore, `${this.url}`) as CollectionReference<any>,
      where('tipo', '==', tipo),
      where('publicado', '==', true)
    );
    return getDocs(q).then((querySnapshot) => {
      const registros: any[] = [];
      querySnapshot.forEach((doc) => {
        registros.push({ ...doc.data(), id: doc.id } as any);
      });
      return registros;
    });
  }

  async obtenerFavoritosPorCategoria(categoria: any): Promise<any[]> {
    let q = query(
      collection(this.firestore, `${this.url}`) as CollectionReference<any>,
      where('categoria', '==', categoria),
      where('favorito', '==', true),
      where('activo', '==', true)
    );
    return getDocs(q).then((querySnapshot) => {
      const registros: any[] = [];
      querySnapshot.forEach((doc) => {
        registros.push({ ...doc.data(), id: doc.id } as any);
      });
      return registros;
    });
  }


  async obtenerPorCampo(link: string) {
    const q = query(collection(this.firestore, this.url), where("tituloLink", "==", link));
    const querySnapshot = await getDocs(q);
    if (!querySnapshot.empty) {
      // Como esperamos un único resultado, tomamos el primer documento
      const doc = querySnapshot.docs[0];
      return doc.data(); // Devuelve los datos del primer documento encontrado
    } else {
      return null; // No se encontraron documentos
    }
  }

  async obtenerPorCodigoBarra(codigoBarra: string) {
    const q = query(collection(this.firestore, this.url),
      where("codigoBarra", "==", codigoBarra),
      where("activo", "==", true),
    );
    const querySnapshot = await getDocs(q);

    if (!querySnapshot.empty) {
      // Como esperamos un único resultado, tomamos el primer documento
      const doc = querySnapshot.docs[0];
      return {
        id: doc.id,         // Incluimos el ID del documento
        ...doc.data(),      // Incluimos también los datos del documento
      };
    } else {
      return null; // No se encontraron documentos
    }
  }


}
