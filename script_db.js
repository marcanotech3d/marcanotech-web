// ════════════════════════════════
// FIREBASE CONFIG
// → Reemplazá estos valores con los
//   de tu proyecto en Firebase Console
// ════════════════════════════════
const FIREBASE_CONFIG = {
  apiKey:            "AIzaSyAfsAEiXCL5aSUtWsBrc3DaIYLlagU2Q6s",
  authDomain:        "marcanotech-3d.firebaseapp.com",
  databaseURL:       "https://marcanotech-3d-default-rtdb.firebaseio.com",
  projectId:         "marcanotech-3d",
  storageBucket:     "marcanotech-3d.firebasestorage.app",
  messagingSenderId: "95407454758",
  appId:             "1:95407454758:web:092246282f460f3b5e44e7",
  measurementId:     "G-871MEYT164"
};

// ════════════════════════════════
// DETECCIÓN DE MODO
// Si el config no está completo → modo offline (localStorage)
// Si está completo → Firebase Realtime DB
// ════════════════════════════════
const FIREBASE_READY = !FIREBASE_CONFIG.apiKey.startsWith('TU_');
let db_firebase = null;
let fbRef = null;

// ════════════════════════════════
// DATA STORE  (localStorage fallback)
// ════════════════════════════════
// ════════════════════════════════
// APP VERSION
// ════════════════════════════════
const APP_VERSION = {
  version: 'v2.8',
  fecha: '2026-04-29',
  nombre: 'Marcano Tech',
  changelog: [
    { v:'v2.8', fecha:'2026-04-29', cambios:[
      'Catálogo de Colores: nueva subsección dentro de Materiales',
      'Catálogo: gestión completa de colores por marca/material con estado de disponibilidad',
      'Catálogo: agregar, editar y eliminar colores publicados en marcanotech.com',
      'Catálogo: sincronización con Firebase RTDB (nodo catalogo-colores)',
      'Catálogo: filtros por marca y disponibilidad en el panel admin',
    ]},
    { v:'v2.7', fecha:'2026-04-29', cambios:[
      'Portal Clientes: nueva sección para gestionar usuarios registrados en marcanotech.com',
      'Portal Clientes: ver, buscar y filtrar usuarios por tier (Standard / VIP)',
      'Portal Clientes: asignar tier VIP con descuento personalizado y notas internas',
      'Portal Clientes: registrar pedidos, compras e historial vinculados al UID del cliente',
      'Portal Clientes: gestionar proyectos personalizados por cliente con estado y progreso',
      'Portal Clientes: botón WhatsApp directo desde el panel de cada cliente',
    ]},
    { v:'v2.6', fecha:'2026-04-26', cambios:[
      'Timer: gramos consumidos soporta decimales (ej: 6.78g)',
      'Timer: todos los campos de gramos usan parseFloat y muestran 2 decimales',
      'Stock: descuento de gramos preserva precisión decimal',
    ]},
    { v:'v2.5', fecha:'2026-04-26', cambios:[
      'Color: todo el azul (#4a7fd4, --blue, --accent) cambiado a naranja #f97316',
      'Timer historial: muestra tiempo, material, gramos, proyecto e impresora',
      'Timer historial: botón editar para corregir registros',
      'Consumo de Material: historial de consumo desde registros de impresión',
      'Consumo de Material: totales por material y tabla detallada',
    ]},
    { v:'v2.4', fecha:'2026-04-26', cambios:[
      'Timer: selector de material directo para descontar stock al finalizar',
      'Timer: descuento de gramos persistido en Firebase y reflejado en todas las secciones',
      'Historial timer: muestra nombre del material y gramos consumidos',
    ]},
    { v:'v2.3', fecha:'2026-04-26', cambios:[
      'Color de marca: Rojo #cc0000 → Naranja #f97316 en todo el dashboard',
      'Timer: descuenta gramos de filamento del stock al finalizar impresión',
      'Timer: actualiza horas de uso en la impresora seleccionada al finalizar',
      'Timer: campo Gramos usados agregado al formulario',
      'Timer: impresora se preselecciona automáticamente si hay una sola',
      'Sidebar: impresora activa se preselecciona automáticamente',
      'Historial timer: muestra gramos consumidos y proyecto vinculado',
    ]},
    { v:'v2.2', fecha:'2026-04-25', cambios:[
      'Fix crítico: sec-piezas tenía </div> extra que rompía el layout de todas las secciones siguientes',
      'Calibración: campos de velocidad, retracción y ventilador aceptan rangos (ej: 60-100)',
      'Calibración: título Perímetros renombrado a Perímetros (Inner Wall)',
      'Calibración: resumen muestra rangos con formato X/Y igual que boquilla',
    ]},
    { v:'v2.1', fecha:'2026-04-25', cambios:[
      'Impresoras: botón Agregar abre formulario vacío correctamente',
      'Proyectos: campo kg/g estimados desde STLs, estado Pendiente agregado',
      'Cola: campo proyecto con valor Ninguno por defecto, capa unificada desde STLs',
      'STL/Piezas: campo Altura de Capa, stats por escala en encabezado',
      'Tiempo de Impresión: pieza desde cola, tiempo auto desde proyecto',
      'Accesorios: stats por categoría en encabezado',
      'Componentes: vista cambiada a lista/tabla',
      'Productos: stats por categoría, vista lista, campos capa/paredes/relleno/STL',
      'Clientes/Proveedores: separados en bloques Clientes y Proveedores',
    ]},
    { v:'v2.0', fecha:'2026-04-25', cambios:[
      'Impresoras: título diferenciado Agregar vs Editar impresora',
      'Impresoras: fecha de vencimiento de garantía se guarda y restaura correctamente',
      'Tiempo de Impresión: renombrado a español, campo impresora agregado al timer',
      'Tiempo de Impresión: historial permite eliminar registros individuales',
      'Cola de impresión: lista de STLs del proyecto visible al seleccionar proyecto',
      'Proyectos: botón Eliminar proyecto disponible en cada card',
      'Acerca de: título corregido a "Marcano Tech", estadísticas eliminadas, solo historial de versiones',
    ]},
    { v:'v1.9', fecha:'2026-04-25', cambios:[
      'STL como tipo de insumo en proyectos',
      'Tiempo estimado auto-calculado desde STLs del proyecto',
      'Cola de impresión: lista de STLs con checklist (marcar como impreso)',
      'Cola: campo Material eliminado (ya está en cada STL)',
      'Impresoras: garantía calculada automáticamente (+1 año desde adquisición)',
      'Acerca de: nombre actualizado a Marcano Tech',
      'Fix: balance de divs en sidebar (espacio gigante eliminado)',
      'Fix: logos como img base64 en lugar de SVG inline',
    ]},
    { v:'v1.8', fecha:'2026-04-23', cambios:[
      'Productos: campos tiempo de impresión y gramos de filamento',
      'Proyectos: selector visual de color con nombres (paleta de 20 colores)',
      'Cotizaciones: nueva sección con sincronización Firebase',
      'Archivos STL: modal rediseñado con foto, código, boquilla, placas, materiales, URL, editable',
      'Clientes/Proveedores: campo URL web, sincronización Firebase corregida',
      'Ventas: selector cliente existente, edición en estado Pendiente',
      'Timer: visualización activa en topbar',
    ]},
    { v:'v1.7', fecha:'2026-04-21', cambios:[
      'Pantallas Materiales y Componentes rediseñadas como grilla de cards',
      'Sección Clientes / Proveedores con CRUD completo',
      'Modales de Filamento, Accesorio y Componente con precios ARS/USD y URL de compra',
      'Navegación móvil rediseñada: sidebar deslizante + topbar móvil',
      'Renombrado y reordenado del menú completo',
    ]},
    { v:'v1.6', fecha:'2026-04-21', cambios:[
      'Calculadora de costos con moneda, perfiles, filamentos múltiples, ganancia',
      'Sección Presupuestos: ítems dinámicos, envío WhatsApp/Email',
      'Sección Calibración de filamentos con perfiles completos',
      'Tipo de cambio USD/ARS en tiempo real vía dolarapi.com',
      'Selector de impresora en sidebar con estado en vivo',
    ]},
    { v:'v1.5', fecha:'2026-04-20', cambios:[
      'Fix crítico sync Firebase: unificación de claves localStorage',
      'Imagen en Proyectos, Productos, Impresoras',
      'Código auto IMP-001 en impresoras con selector de fabricante',
      'Accesorios: imagen, unidad de medida, código MT3-0001',
    ]},
    { v:'v1.0–v1.4', fecha:'2026-04-19', cambios:[
      'Dashboard inicial con proyectos, materiales, impresoras',
      'Cola de impresión, piezas/STL, mantenimiento',
      'Timer de impresión con progreso y ETA',
      'Login con Google + Firebase Auth + Sync Realtime Database',
      'GitHub Pages hosting',
    ]},
  ]
}

const KEYS = {
  proyectos:'proyectos', materiales:'materiales', productos:'productos',
  impresoras:'impresoras', cola:'cola', piezas:'piezas',
  mantenimiento:'mantenimiento', actividad:'actividad',
  ventas:'ventas', componentes:'componentes', timerHistorial:'timerHistorial',
  accesorios:'accesorios', calibracion:'calibracion', presupuestos:'presupuestos',
  clientes:'clientes', cotizaciones:'cotizaciones',
  portalclientes:'clientes-portal'
};

function loadLocal(key){ try{ return JSON.parse(localStorage.getItem(key)||'[]'); }catch(e){ return []; } }
function saveLocal(key,data){ localStorage.setItem(key,JSON.stringify(data)); }
function uid(){ return Date.now().toString(36)+Math.random().toString(36).slice(2,6); }

function loadWithMigration(newKey, oldKey){
  // Try new key first, fallback to old wl_ key, migrate if found
  const fromNew = loadLocal(newKey);
  if(fromNew && fromNew.length > 0) return fromNew;
  const fromOld = loadLocal(oldKey);
  if(fromOld && fromOld.length > 0){
    saveLocal(newKey, fromOld); // migrate to new key
    return fromOld;
  }
  return [];
}

let DB = {
  proyectos:     loadWithMigration('proyectos',    'wl_proyectos'),
  materiales:    loadWithMigration('materiales',   'wl_materiales'),
  productos:     loadWithMigration('productos',    'wl_productos'),
  impresoras:    loadWithMigration('impresoras',   'wl_impresoras'),
  cola:          loadWithMigration('cola',         'wl_cola'),
  piezas:        loadWithMigration('piezas',       'wl_piezas'),
  mantenimiento: loadWithMigration('mantenimiento','wl_mantenimiento'),
  actividad:     loadWithMigration('actividad',    'wl_actividad'),
  ventas:        loadWithMigration('ventas',       'wl_ventas'),
  componentes:   loadWithMigration('componentes',  'wl_componentes'),
  timerHistorial:loadWithMigration('timerHistorial','wl_timer_hist'),
  accesorios:    loadWithMigration('accesorios',   'wl_accesorios'),
  calibracion:   loadWithMigration('calibracion',  'wl_calibracion'),
  presupuestos:  loadWithMigration('presupuestos', 'wl_presupuestos'),
  clientes:      loadWithMigration('clientes',     'wl_clientes'),
  cotizaciones:  loadWithMigration('cotizaciones',  'wl_cotizaciones')
};

// ── FIREBASE WRITE HELPERS ──────────────────────────────
let _pendingWrites = {};
let _firebaseUserReady = false; // true after onAuthStateChanged confirms login

function stripImages(data){
  if(!Array.isArray(data)) return data;
  if(data.length === 0) return null;
  return data.map(item=>{
    if(item && typeof item === 'object'){
      const c = Object.assign({}, item);
      delete c.imagen;
      return c;
    }
    return item;
  });
}

function sanitizeForFirebase(obj){
  // Firebase rejects undefined values — replace with null recursively
  if(obj === undefined) return null;
  if(obj === null || typeof obj !== 'object') return obj;
  if(Array.isArray(obj)) return obj.map(sanitizeForFirebase);
  const clean = {};
  Object.keys(obj).forEach(k=>{
    const v = obj[k];
    clean[k] = (v === undefined) ? null : sanitizeForFirebase(v);
  });
  return clean;
}

function fbWrite(key, data){
  if(!FIREBASE_READY || !fbRef) return;
  let toSave = stripImages(data);
  if(toSave === null) return;
  toSave = sanitizeForFirebase(toSave);
  // Use onAuthStateChanged result - currentUser may be null during init
  if(_firebaseUserReady){
    if(window._fbWriteTs) window._fbWriteTs();
    fbRef.child(key).set(toSave).catch(e=>console.warn('FB write ['+key+']:', e));
  } else {
    _pendingWrites[key] = toSave; // queue until auth resolves
  }
}

function flushPendingWrites(){
  const keys = Object.keys(_pendingWrites);
  if(!keys.length) return;
  keys.forEach(key=>{
    fbRef.child(key).set(_pendingWrites[key]).catch(e=>console.warn('FB flush ['+key+']:', e));
  });
  _pendingWrites = {};
}

function persist(key){
  // key is the DB property name: 'proyectos', 'materiales', etc.
  // KEYS[key] now equals key (same string used for DB, localStorage, Firebase)
  try{
    if(DB[key] === undefined){
      console.warn('persist: DB['+key+'] is undefined, skipping');
      return;
    }
    saveLocal(key, DB[key]);
    fbWrite(key, DB[key]);
  } catch(e){
    console.warn('persist error ['+key+']:', e);
  }
}

// Full push of all data to Firebase (called after login)
function pushAllToFirebase(){
  Object.keys(KEYS).forEach(key=>{
    if(DB[key] && (Array.isArray(DB[key]) ? DB[key].length > 0 : true)){
      fbWrite(key, DB[key]);
    }
  });
  flushPendingWrites();
}

// ════════════════════════════════
// FIREBASE INIT + AUTH + SYNC
// ════════════════════════════════
function initFirebase(){
  if(!FIREBASE_READY){
    // No Firebase config → work offline from localStorage, hide login
    document.getElementById('login-screen').classList.add('hidden');
    showSyncStatus('offline');
    return;
  }
  // Show login screen while Firebase loads
  document.getElementById('login-screen').classList.remove('hidden');
  const scripts = [
    'https://www.gstatic.com/firebasejs/10.12.0/firebase-app-compat.js',
    'https://www.gstatic.com/firebasejs/10.12.0/firebase-auth-compat.js',
    'https://www.gstatic.com/firebasejs/10.12.0/firebase-database-compat.js'
  ];
  let loaded = 0;
  scripts.forEach(src=>{
    const s = document.createElement('script');
    s.src = src;
    s.onload = ()=>{ loaded++; if(loaded===scripts.length) connectFirebase(); };
    s.onerror = ()=>{
      // Firebase failed to load → work offline without login
      document.getElementById('login-screen').classList.add('hidden');
      showSyncStatus('error');
    };
    document.head.appendChild(s);
  });
}

function connectFirebase(){
  try{
    if(!firebase.apps.length) firebase.initializeApp(FIREBASE_CONFIG);
    db_firebase = firebase.database();
    fbRef = db_firebase.ref('marcanotech-dashboard');
    initStorage();
    showSyncStatus('connecting');
    // Enable login button now that Firebase SDK is loaded
    const loginBtn = document.getElementById('btn-google-login');
    if(loginBtn){
      loginBtn.disabled = false;
      loginBtn.style.opacity = '';
      loginBtn.style.cursor = '';
    }

    firebase.auth().onAuthStateChanged(user=>{
      if(user){
        showApp(user);
        subscribeData();
      } else {
        showLogin();
      }
    });
  } catch(e){
    console.warn('Firebase init error:', e);
    showSyncStatus('offline');
    // Even if Firebase fails, app works from localStorage
  }
}

// ════════════════════════════════
// FIREBASE STORAGE — IMAGE SYNC
// ════════════════════════════════
let _storage = null;

function initStorage(){
  try{
    if(typeof firebase !== 'undefined' && firebase.storage){
      _storage = firebase.storage();
    }
  } catch(e){ /* Storage not enabled - images work locally only */ }
}

// Upload image to Firebase Storage and return download URL
function uploadImageToStorage(dataUrl, path){
  return new Promise((resolve, reject)=>{
    if(!_storage || !dataUrl){ resolve(null); return; }
    try{
      const ref = _storage.ref(path);
      ref.putString(dataUrl, 'data_url').then(snap=>{
        snap.ref.getDownloadURL().then(url=>resolve(url)).catch(reject);
      }).catch(reject);
    } catch(e){ reject(e); }
  });
}

// Replace local base64 images with Storage URLs before saving
async function persistWithStorage(key, items){
  if(!_storage || !Array.isArray(items) || !_firebaseUserReady){
    persist(key); return;
  }
  const userId = firebase.auth().currentUser ? firebase.auth().currentUser.uid : 'anon';
  const updated = await Promise.all(items.map(async item=>{
    if(!item || !item.imagen) return item;
    // Already a URL (not base64) → skip
    if(item.imagen.startsWith('http')) return item;
    // Upload base64 to Storage
    try{
      const path = `images/${userId}/${key}/${item.id}`;
      const url = await uploadImageToStorage(item.imagen, path);
      if(url){
        // Save URL version to Firebase, keep base64 in localStorage
        return {...item, imagen: url};
      }
    } catch(e){ console.warn('Image upload failed:', e); }
    return item;
  }));
  // Save original (with base64) to localStorage
  saveLocal(key, items);
  // Save version with URLs to Firebase
  if(_firebaseUserReady && fbRef){
    const toSave = sanitizeForFirebase(updated.map(item=>{
      const c = Object.assign({}, item);
      // If imagen is still base64, remove it (too large)
      if(c.imagen && c.imagen.startsWith('data:')) delete c.imagen;
      return c;
    }));
    fbRef.child(key).set(toSave).catch(e=>console.warn('FB write ['+key+']:', e));
  }
}

// Download images from Storage URLs and cache in localStorage
function hydrateImagesFromStorage(items, key){
  if(!items || !_storage) return items;
  items.forEach(item=>{
    if(item && item.imagen && item.imagen.startsWith('http')){
      // Fetch and cache as base64 in localStorage for offline use
      fetch(item.imagen).then(r=>r.blob()).then(blob=>{
        const reader = new FileReader();
        reader.onload = e=>{
          const cached = loadLocal(key) || [];
          const idx = cached.findIndex(c=>c.id===item.id);
          if(idx>=0){ cached[idx].imagen = e.target.result; saveLocal(key, cached); }
          // Update in-memory DB
          const dbIdx = DB[key] ? DB[key].findIndex(c=>c.id===item.id) : -1;
          if(dbIdx>=0){ DB[key][dbIdx].imagen = e.target.result; renderSection(currentSection); }
        };
        reader.readAsDataURL(blob);
      }).catch(()=>{});
    }
  });
  return items;
}

function firebaseToArray(val){
  if(!val || val === null) return [];
  if(Array.isArray(val)) return val;
  if(typeof val === 'object'){
    // Firebase guarda arrays como {0: item, 1: item, ...} — restaurar orden
    const keys = Object.keys(val);
    const allNumeric = keys.every(k => !isNaN(parseInt(k)));
    if(allNumeric){
      const arr = [];
      keys.sort((a,b)=>parseInt(a)-parseInt(b)).forEach(k=>arr.push(val[k]));
      return arr;
    }
    return Object.values(val);
  }
  return [];
}

function subscribeData(){
  fbRef.once('value').then(snapshot=>{
    const fbData = snapshot.val();
    if(fbData){
      Object.keys(KEYS).forEach(k=>{
        if(fbData[k] !== undefined && fbData[k] !== null){
          const fromFirebase = firebaseToArray(fbData[k]);
          const fromLocal = loadLocal(k) || [];
          const localMap = {};
          fromLocal.forEach(item=>{ if(item && item.id) localMap[item.id] = item; });
          DB[k] = fromFirebase.map(item=>{
            if(!item) return item;
            // Prefer locally cached base64 over Storage URL
            if(item.id && localMap[item.id] && localMap[item.id].imagen){
              return Object.assign({}, item, {imagen: localMap[item.id].imagen});
            }
            return item;
          });
          saveLocal(k, DB[k]);
          // Hydrate Storage URLs → base64 for offline cache
          hydrateImagesFromStorage(DB[k], k);
        }
      });
      updateBadges();
      renderSection(currentSection);
      checkMantPending();
      updateSidebarPrinterSelect();
    } else {
      // Firebase is empty — push our localStorage data up
      console.log('Firebase empty, pushing localStorage data...');
      pushAllToFirebase();
    }
    showSyncStatus('online');
    // After initial load, listen for changes from OTHER devices
    // Use a timestamp to avoid re-applying our own writes
    setupRealtimeSync();
  }).catch(err=>{
    console.warn('Firebase read error:', err);
    showSyncStatus('error');
  });
}

function setupRealtimeSync(){
  // Listen for changes - but skip if we just wrote (avoid echo)
  let _lastWriteTime = 0;
  const origFbWrite = fbWrite;
  window._fbWriteTs = ()=>{ _lastWriteTime = Date.now(); };
  
  fbRef.on('value', snapshot=>{
    // If we wrote recently (<2s ago), skip - it's our own echo
    if(Date.now() - _lastWriteTime < 2000) return;
    const fbData = snapshot.val();
    if(!fbData) return;
    Object.keys(KEYS).forEach(k=>{
      if(fbData[k] !== undefined && fbData[k] !== null){
        const fromFirebase = firebaseToArray(fbData[k]);
        // Only update if Firebase has data we don't have locally
        if(fromFirebase.length > (DB[k]||[]).length){
          const fromLocal = loadLocal(k) || [];
          const localMap = {};
          fromLocal.forEach(item=>{ if(item&&item.id) localMap[item.id]=item; });
          DB[k] = fromFirebase.map(item=>{
            if(item&&item.id&&localMap[item.id]&&localMap[item.id].imagen)
              return Object.assign({},item,{imagen:localMap[item.id].imagen});
            return item;
          });
          saveLocal(k, DB[k]);
          hydrateImagesFromStorage(DB[k], k);
        }
      }
    });
    updateBadges();
    renderSection(currentSection);
    showSyncStatus('online');
  });
}

// ════════════════════════════════
// AUTH — LOGIN / LOGOUT
// ════════════════════════════════
function loginWithGoogle(){
  const btn = document.getElementById('btn-google-login');
  btn.textContent = 'Conectando...';
  btn.disabled = true;
  const provider = new firebase.auth.GoogleAuthProvider();
  firebase.auth().signInWithPopup(provider).catch(err=>{
    const errEl = document.getElementById('login-error');
    errEl.textContent = 'Error al iniciar sesión: ' + err.message;
    errEl.style.display = 'block';
    btn.disabled = false;
    btn.innerHTML = `<svg viewBox="0 0 24 24" width="20" height="20"><path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/><path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/><path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z"/><path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/></svg> Iniciar sesión con Google`;
  });
}

function logout(){
  _firebaseUserReady = false;
  firebase.auth().signOut().then(()=>{ showLogin(); });
}

function showLogin(){
  document.getElementById('login-screen').classList.remove('hidden');
  // Keep app visible underneath - login is an overlay
}

function showApp(user){
  document.getElementById('login-screen').classList.add('hidden');
  _firebaseUserReady = true;
  flushPendingWrites(); // flush any writes queued before login
  // Mostrar nombre de usuario en sidebar
  const userEl = document.getElementById('sidebar-user');
  if(userEl && user){
    userEl.innerHTML = `
      <div style="display:flex;align-items:center;gap:8px;padding:10px 10px 14px;">
        <img src="${user.photoURL||''}" style="width:26px;height:26px;border-radius:50%;background:var(--bg3)" onerror="this.style.display='none'">
        <div style="flex:1;min-width:0;">
          <div style="font-size:11px;font-weight:600;color:var(--text);white-space:nowrap;overflow:hidden;text-overflow:ellipsis">${user.displayName||user.email}</div>
          <button onclick="logout()" style="font-size:10px;color:var(--text3);font-family:var(--mono);background:none;border:none;cursor:pointer;padding:0">cerrar sesión</button>
        </div>
      </div>`;
  }
}

// ════════════════════════════════
// INDICADOR DE SYNC EN TOPBAR
// ════════════════════════════════
function showSyncStatus(state){
  const el = document.getElementById('sync-status');
  const elMobile = document.getElementById('sync-status-mobile');
  const cfg = {
    offline:    {dot:'var(--text3)',  label:'Modo local',    title:'Los datos se guardan solo en este dispositivo.'},
    connecting: {dot:'var(--amber)',  label:'Conectando…',   title:'Conectando a Firebase...'},
    online:     {dot:'var(--teal)',   label:'Sincronizado',  title:'Datos sincronizados con Firebase'},
    error:      {dot:'var(--coral)',  label:'Sin conexión',  title:'No se pudo conectar a Firebase.'}
  };
  const c = cfg[state]||cfg.offline;
  const html = `<span style="width:7px;height:7px;border-radius:50%;background:${c.dot};display:inline-block;${state==='connecting'?'animation:pulse 1s infinite':''}"></span><span style="font-size:10px;font-family:var(--mono);color:${c.dot};margin-left:4px">${c.label}</span>`;
  if(el){ el.title=c.title; el.innerHTML=html; }
  if(elMobile){ elMobile.innerHTML=html; }
}

// ════════════════════════════════
// NAVIGATION
// ════════════════════════════════
const sectionTitles = {
  dashboard:'Dashboard General', proyectos:'Proyectos RC',
  impresoras:'Mis Impresoras', cola:'Cola de Impresión',
  materiales:'Materiales & Filamentos', productos:'Catálogo de Productos',
  piezas:'Archivos STL', costos:'Calculadora de Costos',
  mantenimiento:'Mantenimiento', estadisticas:'Estadísticas',
  ventas:'Facturación', componentes:'Componentes',
  timer:'Tiempo de Impresión', graficos:'Consumo de Material',
  accesorios:'Accesorios & Herramientas',
  calibracion:'Calibración de Material',
  presupuestos:'Presupuestos',
  clientes:'Clientes & Proveedores',
  cotizaciones:'Cotizaciones',
  acercade:'Acerca de'
};
const addBtnLabels = {
  proyectos:'+ Nuevo proyecto', impresoras:'+ Agregar impresora',
  cola:'+ Agregar a cola', materiales:'+ Agregar material',
  productos:'+ Nuevo producto', piezas:'+ Registrar pieza',
  mantenimiento:'+ Registrar tarea', ventas:'+ Nueva venta',
  componentes:'+ Agregar componente', accesorios:'+ Agregar accesorio'
};
const addBtnModals = {
  proyectos:'modal-proyecto', impresoras:'modal-impresora',
  cola:'modal-cola', materiales:'modal-material',
  productos:'modal-producto', piezas:'modal-pieza',
  mantenimiento:'modal-mantenimiento', ventas:'modal-venta',
  componentes:'modal-componente', accesorios:'modal-accesorio'
};
let currentSection = 'dashboard';

// ════════════════════════════════
// SIDEBAR PRINTER SELECT
// ════════════════════════════════
function updateSidebarPrinterSelect(){
  const sel = document.getElementById('sidebar-imp-select');
  if(!sel) return;
  const prev = sel.value;
  sel.innerHTML = '<option value="">— Impresora activa —</option>' +
    DB.impresoras.map(i=>`<option value="${i.id}">${i.codigo||''} ${i.nombre}</option>`).join('');
  // Auto-select if only one printer, or restore previous selection
  if(prev && DB.impresoras.find(i=>i.id===prev)){
    sel.value = prev;
  } else if(DB.impresoras.length === 1){
    sel.value = DB.impresoras[0].id;
  }
  setSidebarImpresora(sel.value);
}

function setSidebarImpresora(id){
  const imp = DB.impresoras.find(i=>i.id===id);
  const nameEl = document.getElementById('sidebar-printer-name');
  const statusEl = document.getElementById('sidebar-printer-status');
  const barEl = document.getElementById('sidebar-bar');
  const dotEl = document.getElementById('sidebar-status-dot');
  if(!imp){
    if(nameEl) nameEl.textContent = DB.impresoras.length ? 'Seleccioná impresora' : 'Sin impresoras';
    if(statusEl) statusEl.textContent = DB.impresoras.length ? '' : 'Agregá desde Impresoras';
    if(barEl) barEl.style.width = '0%';
    if(dotEl){ dotEl.style.background = 'var(--text3)'; }
    return;
  }
  if(nameEl) nameEl.textContent = imp.nombre;
  if(statusEl) statusEl.textContent = imp.horas > 0 ? `${imp.horas}h registradas` : 'Sin trabajo activo';
  if(barEl) barEl.style.width = imp.horas ? Math.min(100,(imp.horas/5000)*100)+'%' : '0%';
  if(dotEl){ dotEl.style.background = 'var(--teal)'; }
}

// ════════════════════════════════
// DOLAR RATE + PRICE HELPERS
// ════════════════════════════════
let _dolarRate = null;
let _dolarLastFetch = 0;

async function fetchDolar(){
  const now = Date.now();
  if(_dolarRate && (now-_dolarLastFetch) < 3600000) return _dolarRate;
  try{
    const res = await fetch('https://dolarapi.com/v1/dolares/oficial');
    const data = await res.json();
    _dolarRate = parseFloat(data.venta);
    _dolarLastFetch = now;
    localStorage.setItem('wl_dolar', JSON.stringify({rate:_dolarRate, ts:now}));
    updateDolarDisplay();
    return _dolarRate;
  } catch(e){
    const cached = JSON.parse(localStorage.getItem('wl_dolar')||'null');
    if(cached){ _dolarRate = cached.rate; _dolarLastFetch = cached.ts; updateDolarDisplay(); return _dolarRate; }
    return null;
  }
}

function updateDolarDisplay(){
  const el = document.getElementById('dolar-rate-display');
  if(el && _dolarRate) el.innerHTML = `<span style="color:var(--teal)">●</span> USD oficial: <strong>$${_dolarRate.toLocaleString('es-AR')}</strong> ARS`;
}

function usdToArs(usd){ return (_dolarRate && usd) ? usd*_dolarRate : null; }
function arsToUsd(ars){ return (_dolarRate && ars) ? ars/_dolarRate : null; }

function updatePriceHint(inputId, hintId){
  const val = parseFloat(document.getElementById(inputId)?.value)||0;
  const hint = document.getElementById(hintId);
  if(!hint) return;
  const ars = usdToArs(val);
  hint.textContent = ars ? '≈ $'+Math.round(ars).toLocaleString('es-AR')+' ARS' : '';
}

// ════════════════════════════════
// THEME
// ════════════════════════════════
function setTheme(t){
  document.documentElement.setAttribute('data-theme',t);
  localStorage.setItem('wl_theme',t);
  document.querySelectorAll('.theme-btn').forEach(b=>b.classList.remove('active'));
  const btn=document.getElementById('theme-btn-'+t);
  if(btn) btn.classList.add('active');
}
function initTheme(){
  const t=localStorage.getItem('wl_theme')||'auto';
  setTheme(t);
}


// ════════════════════════════════
// MOBILE MENU
// ════════════════════════════════
function toggleMobileMenu(){
  const sidebar = document.querySelector('.sidebar');
  const overlay = document.getElementById('mobile-overlay');
  const isOpen = sidebar.classList.contains('open');
  if(isOpen){ closeMobileMenu(); }
  else { sidebar.classList.add('open'); if(overlay) overlay.classList.add('open'); }
}
function closeMobileMenu(){
  document.querySelector('.sidebar').classList.remove('open');
  const overlay = document.getElementById('mobile-overlay');
  if(overlay) overlay.classList.remove('open');
}



function showSection(id, navEl){
  document.querySelectorAll('.section').forEach(s=>s.classList.remove('active'));
  document.getElementById('sec-'+id).classList.add('active');
  document.querySelectorAll('.nav-item').forEach(i=>i.classList.remove('active'));
  if(navEl) navEl.classList.add('active');
  else{
    document.querySelectorAll('.nav-item').forEach(i=>{
      if(i.getAttribute('onclick')&&i.getAttribute('onclick').includes("'"+id+"'")) i.classList.add('active');
    });
  }
  const title = sectionTitles[id]||id;
  document.getElementById('topbar-title').textContent = title;
  const addBtn = document.getElementById('topbar-add-btn');
  if(addBtnLabels[id]){ addBtn.textContent=addBtnLabels[id]; addBtn.style.display=''; }
  else { addBtn.style.display='none'; }
  currentSection = id;
  renderSection(id);
  // Cargar portal clientes al entrar
  if (id === 'portalclientes') {
    if (Object.keys(_portalUsersCache).length === 0) loadPortalUsers();
    else renderPortalUsers();
  }
  // Close mobile menu on navigation
  if(window.innerWidth <= 900) closeMobileMenu();
}

function openAddModal(){
  if(currentSection==='materiales') { openMatModal(); return; }
  if(currentSection==='accesorios') { openAccesorioModal(); return; }
  if(currentSection==='proyectos') { resetProyectoForm(); openModal('modal-proyecto'); return; }
  if(currentSection==='componentes') { resetComponenteForm(); openModal('modal-componente'); return; }
  if(currentSection==='calibracion') { openCalModal(); return; }
  if(currentSection==='presupuestos') { openPresupuestoModal(); return; }
  if(currentSection==='clientes') { openClienteModal(); return; }
  if(addBtnModals[currentSection]) openModal(addBtnModals[currentSection]);
}

function resetProyectoForm(){
  document.getElementById('proyecto-edit-id').value='';
  document.getElementById('modal-proyecto-title').textContent='Nuevo proyecto';
  document.querySelector('#modal-proyecto .btn-accent').textContent='Guardar proyecto';
  clearForm(['proy-nombre','proy-material','proy-progreso','proy-notas','proy-tiempo','proy-color']);
  document.getElementById('proy-estado').value='diseño';
  document.getElementById('proy-tipo').value='Touring / Drift';
  document.getElementById('proy-emoji').value='🖨️';
  resetImgPreview('proy-img-preview','proy-imagen');
  _proyInsumos = [];
  renderProyInsumos();
  selectProyColor('#38d9a9','Teal');
  _proyColorOpen = false;
}

function nextCompCodigo(categoria){
  const prefixMap = {motor:'MOT',esc:'ESC',servo:'SRV',bateria:'BAT',radio:'RAD',otro:'ELC'};
  const cat = categoria || 'otro';
  const prefix = prefixMap[cat] || 'ELC';
  if(!DB.componentes || !DB.componentes.length) return prefix+'-0001';
  const nums = DB.componentes.map(c => parseInt((c.codigo||'ELC-0000').split('-')[1]||0)).filter(n=>!isNaN(n));
  return prefix+'-'+String((nums.length ? Math.max(...nums) : 0)+1).padStart(4,'0');
}

function resetComponenteForm(){
  document.getElementById('comp-edit-id').value='';
  clearForm(['comp-nombre','comp-marca','comp-modelo','comp-specs','comp-precio']);
  document.getElementById('comp-stock').value=1;
  document.getElementById('comp-estado').value='disponible';
  document.getElementById('comp-categoria').value='motor';
  resetImgPreview('comp-img-preview','comp-imagen');
  const codigo = nextCompCodigo();
  document.getElementById('comp-codigo-val').value=codigo;
  document.getElementById('comp-codigo-display').textContent=codigo;
  if(document.getElementById('comp-precio-ars')) document.getElementById('comp-precio-ars').value='';
  if(document.getElementById('comp-url')) document.getElementById('comp-url').value='';
  const cHint=document.getElementById('comp-precio-hint');
  if(cHint&&_dolarRate) cHint.textContent=`USD oficial: $${_dolarRate.toLocaleString('es-AR')} ARS`;
}

// ════════════════════════════════
// MODALS
// ════════════════════════════════
function openModal(id){
  populateModalSelects(id);
  document.getElementById(id).classList.add('open');
}
function closeModal(id){ document.getElementById(id).classList.remove('open'); }

// Close proy color dropdown on outside click
document.addEventListener('click', e=>{
  const dd = document.getElementById('proy-color-dropdown');
  const disp = document.getElementById('proy-color-display');
  if(dd && disp && !disp.contains(e.target) && !dd.contains(e.target)){
    dd.style.display='none'; _proyColorOpen=false;
  }
});
document.querySelectorAll('.modal-overlay').forEach(m=>{
  m.addEventListener('click',e=>{ if(e.target===m) m.classList.remove('open'); });
});

function populateModalSelects(modalId){
  const proyOpts = DB.proyectos.map(p=>`<option value="${p.id}">${p.nombre}</option>`).join('') || '<option value="">Sin proyectos</option>';
  const matOpts = DB.materiales.map(m=>`<option value="${m.id}">${m.tipo} ${m.color} (${m.marca})</option>`).join('') || '<option value="">Sin materiales</option>';
  const impOpts = DB.impresoras.map(i=>`<option value="${i.id}">${i.nombre}</option>`).join('') || '<option value="">Sin impresoras</option>';
  const today=new Date().toISOString().split('T')[0];
  if(modalId==='modal-cola'){
    document.getElementById('cola-proyecto').innerHTML='<option value="">Ninguno</option>'+DB.proyectos.map(p=>`<option value="${p.id}">${p.nombre}</option>`).join('');
    document.getElementById('cola-stl-section').style.display='none';
    // Auto-trigger STL list if a project is pre-selected
    const colaProy = document.getElementById('cola-proyecto');
    if(colaProy && colaProy.value) onColaProyectoChange(colaProy.value);
  }
  // modal-pieza: no longer needs proyecto/material selects
  if(modalId==='modal-mantenimiento'){
    document.getElementById('mant-impresora').innerHTML=impOpts;
    document.getElementById('mant-fecha').value=today;
  }
  if(modalId==='modal-venta'){
    document.getElementById('venta-fecha').value=today;
  }
  if(modalId==='modal-impresora'){
    const editIdImp=document.getElementById('impresora-edit-id').value;
    if(!editIdImp){
      const nums=DB.impresoras.map(i=>parseInt((i.codigo||'IMP-000').split('-')[1]||0)).filter(n=>!isNaN(n));
      const nextCode='IMP-'+String((nums.length?Math.max(...nums):0)+1).padStart(3,'0');
      document.getElementById('imp-codigo').value=nextCode;
      document.getElementById('imp-codigo-display').textContent=nextCode;
      document.getElementById('imp-modal-title').textContent='Agregar impresora';
      if(document.getElementById('impresora-edit-id')) document.getElementById('impresora-edit-id').value='';
      document.getElementById('imp-img-preview').innerHTML='<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="var(--text3)" stroke-width="1.5"><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/></svg><span style="font-size:10px;color:var(--text3);font-family:var(--mono)">Cargar</span>';
      document.getElementById('imp-imagen').value='';
    }
  }
  if(modalId==='modal-componente'){
    const sel=document.getElementById('comp-proyecto');
    if(sel) sel.innerHTML='<option value="">Sin asignar</option>'+proyOpts;
    const editIdComp=document.getElementById('comp-edit-id').value;
    if(!editIdComp){
      const codigo = nextCompCodigo();
      document.getElementById('comp-codigo-val').value=codigo;
      document.getElementById('comp-codigo-display').textContent=codigo;
      resetImgPreview('comp-img-preview','comp-imagen');
    }
  }
  if(modalId==='modal-proyecto'){
    const editIdP=document.getElementById('proyecto-edit-id').value;
    if(!editIdP) resetImgPreview('proy-img-preview','proy-imagen');
  }
  if(modalId==='modal-producto'){
    const editIdProd=document.getElementById('producto-edit-id').value;
    if(!editIdProd) resetImgPreview('prod-img-preview','prod-imagen');
  }
}

// ════════════════════════════════
// TOAST
// ════════════════════════════════
function showToast(msg, type='success'){
  const t=document.getElementById('toast');
  const ic=document.getElementById('toast-icon');
  document.getElementById('toast-msg').textContent=msg;
  ic.style.background=type==='success'?'rgba(56,217,169,0.2)':type==='error'?'rgba(255,107,91,0.2)':'rgba(240,180,41,0.2)';
  ic.innerHTML=type==='success'
    ?'<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="var(--teal)" stroke-width="3"><polyline points="20 6 9 17 4 12"/></svg>'
    :'<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="var(--coral)" stroke-width="3"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>';
  t.classList.add('show');
  setTimeout(()=>t.classList.remove('show'),3000);
}

// ════════════════════════════════
// ACTIVITY LOG
// ════════════════════════════════
function logActivity(text, type='success'){
  const entry = {
    id:uid(), text, type,
    time: new Date().toLocaleString('es-AR',{day:'2-digit',month:'2-digit',hour:'2-digit',minute:'2-digit'})
  };
  DB.actividad.unshift(entry);
  if(DB.actividad.length>50) DB.actividad=DB.actividad.slice(0,50);
  persist(KEYS.actividad);
}

// ════════════════════════════════
// PROYECTOS
// ════════════════════════════════
const estadoConfig = {
  'imprimiendo':{label:'imprimiendo',cls:'badge-teal',color:'var(--teal)'},
  'diseño':{label:'diseño',cls:'badge-blue',color:'var(--blue)'},
  'pausa':{label:'en pausa',cls:'badge-amber',color:'var(--amber)'},
  'completado':{label:'completado',cls:'badge-purple',color:'var(--purple)'},
  'prueba':{label:'en prueba',cls:'badge-coral',color:'var(--coral)'},
};

function saveProyecto(){
  const editId = document.getElementById('proyecto-edit-id').value;
  const insumos = _proyInsumos.map(i=>({...i}));

  // Auto-calculate total print time from STL insumos
  function parseMinutes(str){
    if(!str) return 0;
    let mins = 0;
    const h = str.match(/(\d+)\s*h/i); if(h) mins += parseInt(h[1])*60;
    const m = str.match(/(\d+)\s*m/i); if(m) mins += parseInt(m[1]);
    return mins;
  }
  const stlInsumos = insumos.filter(i=>i.tipo==='stl');
  let totalMins = 0;
  stlInsumos.forEach(i=>{
    const pieza = DB.piezas.find(p=>p.id===i.refId);
    if(pieza) totalMins += parseMinutes(pieza.tiempo) * (i.cantidad||1);
  });
  let tiempoAuto = '';
  if(totalMins > 0){
    const h = Math.floor(totalMins/60), m = totalMins%60;
    tiempoAuto = h > 0 ? `${h}h ${m > 0 ? m+'m' : ''}`.trim() : `${m}m`;
  }
  // Use manual time if entered, else auto from STLs
  const tiempoManual = document.getElementById('proy-tiempo').value.trim();
  const tiempoFinal = tiempoManual || tiempoAuto;

  const obj={
    id: editId||uid(),
    nombre:document.getElementById('proy-nombre').value.trim(),
    emoji:document.getElementById('proy-emoji').value||'🖨️',
    imagen:document.getElementById('proy-imagen').value||'',
    insumos,
    tipo:document.getElementById('proy-tipo').value,
    estado:document.getElementById('proy-estado').value,
    material:document.getElementById('proy-material').value,
    progreso:parseInt(document.getElementById('proy-progreso').value)||0,
    notas:document.getElementById('proy-notas').value,
    tiempo:tiempoFinal,
    tiempoAutoSTL: tiempoAuto,
    color:document.getElementById('proy-color').value||'#38d9a9',
    fecha: editId ? (DB.proyectos.find(p=>p.id===editId)||{}).fecha||new Date().toISOString() : new Date().toISOString()
  };
  if(!obj.nombre){ showToast('Ingresá un nombre','error'); return; }
  if(editId){ DB.proyectos=DB.proyectos.map(p=>p.id===editId?obj:p); }
  else { DB.proyectos.push(obj); logActivity(`Proyecto <strong>${obj.nombre}</strong> creado`,'success'); }
  persistWithStorage('proyectos', DB.proyectos);
  updateBadges();
  closeModal('modal-proyecto');
  clearForm(['proy-nombre','proy-material','proy-progreso','proy-notas','proy-tiempo','proy-color']);
  resetImgPreview('proy-img-preview','proy-imagen');
  document.getElementById('proyecto-edit-id').value='';
  document.getElementById('modal-proyecto-title').textContent='Nuevo proyecto';
  renderSection(currentSection);
  showToast('Proyecto guardado ✓');
}

// ════════════════════════════════
// IMAGE PREVIEW HELPERS
// ════════════════════════════════
function previewGenImg(input, previewId, hiddenId){
  const file = input.files[0]; if(!file) return;
  const reader = new FileReader();
  reader.onload = e => {
    const img = new Image();
    img.onload = () => {
      const canvas = document.createElement('canvas');
      const MAX = 300;
      let w = img.width, h = img.height;
      if(w > MAX){ h = Math.round(h*(MAX/w)); w = MAX; }
      if(h > MAX){ w = Math.round(w*(MAX/h)); h = MAX; }
      canvas.width = w; canvas.height = h;
      canvas.getContext('2d').drawImage(img, 0, 0, w, h);
      const dataUrl = canvas.toDataURL('image/jpeg', 0.72);
      document.getElementById(hiddenId).value = dataUrl;
      const prev = document.getElementById(previewId);
      if(prev) prev.innerHTML = `<img src="${dataUrl}" style="width:100%;height:100%;object-fit:cover;border-radius:10px">`;
    };
    img.src = e.target.result;
  };
  reader.readAsDataURL(file);
}

function previewImpImg(input){
  const file = input.files[0]; if(!file) return;
  const reader = new FileReader();
  reader.onload = e => {
    const img = new Image();
    img.onload = () => {
      const canvas = document.createElement('canvas');
      const MAX = 400;
      let w = img.width, h = img.height;
      if(w > MAX){ h = Math.round(h*(MAX/w)); w = MAX; }
      canvas.width = w; canvas.height = h;
      canvas.getContext('2d').drawImage(img, 0, 0, w, h);
      const dataUrl = canvas.toDataURL('image/jpeg', 0.75);
      document.getElementById('imp-imagen').value = dataUrl;
      const prev = document.getElementById('imp-img-preview');
      if(prev) prev.innerHTML = `<img src="${dataUrl}" style="width:100%;height:100%;object-fit:cover;border-radius:10px">`;
    };
    img.src = e.target.result;
  };
  reader.readAsDataURL(file);
}

function resetImgPreview(previewId, hiddenId){
  const el = document.getElementById(hiddenId);
  if(el) el.value = '';
  const prev = document.getElementById(previewId);
  if(prev) prev.innerHTML = `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="var(--text3)" stroke-width="1.5"><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/></svg><span style="font-size:9px;color:var(--text3);font-family:var(--mono)">Cargar</span>`;
}

// ════════════════════════════════
// GRAFICOS / CONSUMO DE MATERIAL
// ════════════════════════════════
function renderGraficos(){
  // ── Consumo historial from timer ──
  const consumoEl = document.getElementById('consumo-historial-list');
  if(consumoEl){
    const entries = DB.timerHistorial.filter(h=>h.gramosUsados>0);
    if(!entries.length){
      consumoEl.innerHTML = `<div style="text-align:center;padding:20px;color:var(--text3);font-size:12px">Sin registros de consumo. Finaliza impresiones con material y gramos para ver aquí.</div>`;
    } else {
      const totalG = entries.reduce((a,h)=>a+parseFloat(h.gramosUsados||0),0);
      consumoEl.innerHTML = `
        <div style="display:flex;gap:8px;margin-bottom:12px;flex-wrap:wrap">
          <div class="stat-card" style="flex:1"><div class="stat-label">Total consumido</div><div class="stat-value" style="color:var(--ferrari)">${totalG.toFixed(2)}g</div><div class="stat-delta neutral">${(totalG/1000).toFixed(2)} kg</div></div>
          <div class="stat-card" style="flex:1"><div class="stat-label">Impresiones</div><div class="stat-value">${entries.length}</div><div class="stat-delta neutral">con material</div></div>
          <div class="stat-card" style="flex:1"><div class="stat-label">Promedio</div><div class="stat-value">${(totalG/entries.length).toFixed(2)}g</div><div class="stat-delta neutral">por impresión</div></div>
        </div>
        <table class="data-table">
          <thead><tr><th>Fecha</th><th>Trabajo</th><th>Material</th><th>Gramos</th><th>Impresora</th><th>Tiempo</th></tr></thead>
          <tbody>${entries.map(h=>`<tr>
            <td style="font-family:var(--mono);font-size:11px">${h.fecha||'—'}</td>
            <td style="font-size:12px;font-weight:600">${h.nombre||'—'}</td>
            <td style="font-size:12px;color:var(--ferrari)">${h.materialNombre||'—'}</td>
            <td style="font-family:var(--mono);font-size:12px;font-weight:700;color:var(--amber)">${parseFloat(h.gramosUsados||0).toFixed(2)}g</td>
            <td style="font-size:11px;color:var(--text3)">${h.impresora||'—'}</td>
            <td style="font-family:var(--mono);font-size:11px">${h.tiempo||'—'}</td>
          </tr>`).join('')}</tbody>
        </table>`;

      // Also show per-material totals
      const byMat = {};
      entries.forEach(h=>{
        const k = h.materialNombre||'Sin material';
        byMat[k] = (byMat[k]||0) + (h.gramosUsados||0);
      });
      const matSummary = Object.entries(byMat).sort((a,b)=>b[1]-a[1]).map(([name,g])=>`
        <div style="display:flex;justify-content:space-between;align-items:center;padding:6px 0;border-bottom:0.5px solid var(--border)">
          <span style="font-size:12px;color:var(--text)">${name}</span>
          <span style="font-family:var(--mono);font-size:12px;font-weight:700;color:var(--ferrari)">${parseFloat(g||0).toFixed(2)}g</span>
        </div>`).join('');
      const matEl = document.getElementById('graf-materiales');
      if(matEl) matEl.innerHTML = matSummary || '<div style="color:var(--text3);font-size:12px">Sin datos</div>';
    }
  }

  const stats = document.getElementById('graficos-stats');
  if(stats){
    const totalKg = DB.materiales.reduce((a,m)=>a+(m.total||0),0)/1000;
    const usadoKg = DB.materiales.reduce((a,m)=>a+(m.total-m.stock||0),0)/1000;
    const pct = totalKg>0 ? Math.round((usadoKg/totalKg)*100) : 0;
    const totalCosto = DB.materiales.reduce((a,m)=>{
      const precioKg = m.precioARS || (m.precio ? m.precio*(_dolarRate||1) : 0);
      return a + (m.total/1000)*precioKg;
    }, 0);
    stats.innerHTML=`
      <div class="stat-card"><div class="stat-label">Stock total</div><div class="stat-value">${totalKg.toFixed(2)}</div><div class="stat-delta neutral">kg inventario</div></div>
      <div class="stat-card"><div class="stat-label">Consumido</div><div class="stat-value" style="color:var(--amber)">${usadoKg.toFixed(2)}</div><div class="stat-delta neutral">kg usado</div></div>
      <div class="stat-card"><div class="stat-label">% Consumo</div><div class="stat-value">${pct}%</div><div class="stat-delta neutral">del inventario</div></div>
      <div class="stat-card"><div class="stat-label">Valor stock</div><div class="stat-value">$${Math.round(totalCosto).toLocaleString('es-AR')}</div><div class="stat-delta neutral">ARS total</div></div>`;
  }
  const chartEl = document.getElementById('chart-filamentos');
  if(chartEl && DB.materiales.length){
    const bars = DB.materiales.map(m=>{
      const pct = m.total>0 ? Math.round((m.stock/m.total)*100) : 0;
      const c = pct>50?'var(--teal)':pct>20?'var(--amber)':'var(--coral)';
      const colorObj = MAT_COLORES.find(x=>x.id===m.color)||{hex:'#888'};
      const hex = colorObj.hex==='transparent-clear'?'rgba(180,180,180,0.5)':colorObj.hex;
      return `<div style="margin-bottom:10px">
        <div style="display:flex;justify-content:space-between;margin-bottom:3px">
          <div style="display:flex;align-items:center;gap:6px">
            <span style="width:10px;height:10px;border-radius:50%;background:${hex};border:0.5px solid var(--border2);flex-shrink:0;display:inline-block"></span>
            <span style="font-size:12px;color:var(--text)">${m.tipo} ${m.color}</span>
            <span style="font-size:10px;color:var(--text3)">${m.marca||''}</span>
          </div>
          <span style="font-size:11px;color:${c};font-family:var(--mono);font-weight:700">${m.stock}g / ${m.total}g (${pct}%)</span>
        </div>
        <div style="height:7px;background:var(--border);border-radius:4px;overflow:hidden">
          <div style="height:100%;width:${pct}%;background:${c};border-radius:4px"></div>
        </div>
      </div>`;
    }).join('');
    chartEl.innerHTML = bars;
  } else if(chartEl){
    chartEl.innerHTML = `<div style="text-align:center;padding:24px;color:var(--text3);font-size:13px">Sin materiales registrados</div>`;
  }
  const chartVentas = document.getElementById('chart-ventas-mes');
  if(chartVentas){
    const meses=['Ene','Feb','Mar','Abr','May','Jun','Jul','Ago','Sep','Oct','Nov','Dic'];
    const porMes = Array(12).fill(0);
    DB.ventas.forEach(v=>{ const d=new Date(v.fecha||v.ts||0); if(d.getFullYear()===new Date().getFullYear()) porMes[d.getMonth()]+=parseFloat(v.total||0); });
    const max = Math.max(...porMes,1);
    chartVentas.innerHTML = `<div style="display:flex;align-items:flex-end;gap:4px;height:80px">
      ${porMes.map((v,i)=>`<div style="flex:1;display:flex;flex-direction:column;align-items:center;gap:2px">
        <div style="width:100%;background:var(--accent);border-radius:3px 3px 0 0;height:${Math.round((v/max)*70)+4}px;opacity:${v>0?1:0.2}"></div>
        <span style="font-size:9px;color:var(--text3);font-family:var(--mono)">${meses[i]}</span>
      </div>`).join('')}
    </div>`;
  }
}

// ════════════════════════════════
// TIMER
// ════════════════════════════════
let _timerInterval = null;
let _timerStart = 0;
let _timerPaused = 0;
let _timerRunning = false;

function renderTimer(){
  const sel = document.getElementById('timer-proyecto');
  if(sel) sel.innerHTML = '<option value="">Sin proyecto</option>' +
    DB.proyectos.map(p=>`<option value="${p.id}">${p.nombre}</option>`).join('');
  const colaSel = document.getElementById('timer-cola-select');
  if(colaSel) colaSel.innerHTML = '<option value="">De cola...</option>' +
    DB.cola.map(c=>`<option value="${c.id}">${c.nombre}</option>`).join('');
  const impSel = document.getElementById('timer-impresora');
  if(impSel){
    impSel.innerHTML = '<option value="">Sin asignar</option>' +
      DB.impresoras.map(i=>`<option value="${i.id}">${i.nombre}</option>`).join('');
    if(!impSel.value && DB.impresoras.length===1) impSel.value = DB.impresoras[0].id;
  }
  const matSel = document.getElementById('timer-material-id');
  if(matSel){
    matSel.innerHTML = '<option value="">Sin material / No descontar</option>' +
      DB.materiales.map(m=>`<option value="${m.id}">${m.tipo} ${m.color} — ${m.marca||''} (${parseFloat(m.stock||0).toFixed(0)}g stock)</option>`).join('');
  }
  renderTimerHistorial();
}

function renderTimerHistorial(){
  const el = document.getElementById('timer-historial');
  if(!el) return;
  if(!DB.timerHistorial||!DB.timerHistorial.length){
    el.innerHTML='<div style="font-size:12px;color:var(--text3);font-family:var(--mono);padding:12px 0">Sin registros aún</div>'; return;
  }
  el.innerHTML = DB.timerHistorial.slice(0,20).map(h=>`
    <div style="padding:10px 0;border-bottom:0.5px solid var(--border)">
      <div style="display:flex;align-items:flex-start;gap:8px">
        <div style="flex:1;min-width:0">
          <div style="color:var(--text);font-weight:600;font-size:13px">${h.nombre||'Sin nombre'}</div>
          <div style="display:flex;flex-wrap:wrap;gap:8px;margin-top:4px">
            <span style="font-family:var(--mono);color:var(--ferrari);font-weight:700;font-size:14px">${h.tiempo||'—'}</span>
            ${h.impresora?`<span style="font-size:10px;color:var(--text3);font-family:var(--mono)">🖨️ ${h.impresora}</span>`:''}
            ${h.materialNombre?`<span style="font-size:10px;color:var(--ferrari);font-family:var(--mono)">⬡ ${h.materialNombre}</span>`:''}
            ${h.gramosUsados>0?`<span style="font-size:10px;color:var(--amber);font-family:var(--mono);font-weight:700">🔴 ${parseFloat(h.gramosUsados||0).toFixed(2)}g</span>`:''}
            ${h.proyectoNombre?`<span style="font-size:10px;color:var(--text3);font-family:var(--mono)">📁 ${h.proyectoNombre}</span>`:''}
            <span style="font-size:10px;color:var(--text3);font-family:var(--mono)">📅 ${h.fecha||'—'}</span>
          </div>
        </div>
        <div style="display:flex;gap:4px;flex-shrink:0">
          <button onclick="editTimerEntry('${h.id}')" style="background:rgba(249,115,22,0.08);border:none;border-radius:5px;padding:3px 7px;color:var(--ferrari);cursor:pointer;font-size:11px">✏️</button>
          <button onclick="deleteTimerEntry('${h.id}')" style="background:rgba(249,115,22,0.08);border:none;border-radius:5px;padding:3px 7px;color:var(--ferrari);cursor:pointer;font-size:11px">✕</button>
        </div>
      </div>
    </div>`).join('');
}

function timerAutoEstimado(){
  const proyId = document.getElementById('timer-proyecto')?.value;
  if(!proyId){ showToast('Seleccioná un proyecto primero','error'); return; }
  const proy = DB.proyectos.find(p=>p.id===proyId); if(!proy) return;
  function parseMin(str){ if(!str) return 0; let m=0; const h=str.match(/(\d+)\s*h/i); if(h) m+=parseInt(h[1])*60; const mn=str.match(/(\d+)\s*m/i); if(mn) m+=parseInt(mn[1]); return m; }
  const totalMin = (proy.insumos||[]).filter(i=>i.tipo==='stl').reduce((acc,i)=>{
    const p=DB.piezas.find(x=>x.id===i.refId); return acc+(p?parseMin(p.tiempo)*(i.cantidad||1):0);},0);
  if(totalMin>0){ document.getElementById('timer-estimado').value=totalMin; showToast(`${totalMin} minutos desde STLs`); }
  else showToast('Sin STLs con tiempo registrado','error');
}
function timerStart(){
  if(_timerRunning) return;
  _timerRunning = true;
  _timerStart = Date.now() - _timerPaused;
  document.getElementById('btn-timer-start').style.display='none';
  document.getElementById('btn-timer-pause').style.display='';
  document.getElementById('btn-timer-finish').style.display='';
  _timerInterval = setInterval(()=>{
    const elapsed = Date.now()-_timerStart;
    const h=Math.floor(elapsed/3600000), m=Math.floor((elapsed%3600000)/60000), s=Math.floor((elapsed%60000)/1000);
    const disp = document.getElementById('timer-display');
    if(disp) disp.textContent=`${String(h).padStart(2,'0')}:${String(m).padStart(2,'0')}:${String(s).padStart(2,'0')}`;
    const est = parseInt(document.getElementById('timer-estimado')?.value)||0;
    const bar = document.getElementById('timer-progress-bar');
    const eta = document.getElementById('timer-eta');
    const pctEl = document.getElementById('timer-pct');
    if(est>0){
      const pct = Math.min(100, Math.round((elapsed/60000/est)*100));
      if(bar) bar.style.width = pct+'%';
      if(pctEl) pctEl.textContent = pct+'%';
      const remainMs = Math.max(0, est*60000 - elapsed);
      if(eta){
        if(remainMs===0){
          eta.textContent = 'Tiempo restante: Completado';
          eta.style.color = 'var(--teal)';
        } else {
          const rh=Math.floor(remainMs/3600000), rm=Math.floor((remainMs%3600000)/60000), rs=Math.floor((remainMs%60000)/1000);
          const finMs = Date.now() + remainMs;
          const fin = new Date(finMs);
          const finStr = `${String(fin.getHours()).padStart(2,'0')}:${String(fin.getMinutes()).padStart(2,'0')}`;
          eta.textContent = `Tiempo restante: ${rh>0?rh+'h ':''} ${rm}m ${rs}s — Fin estimado: ${finStr}`;
          eta.style.color = '';
        }
      }
    } else {
      if(bar) bar.style.width='0%';
      if(eta) eta.textContent='Tiempo restante: — (ingresá tiempo estimado)';
      if(pctEl) pctEl.textContent='—';
    }
  },1000);
}

function timerPause(){
  if(!_timerRunning) return;
  _timerRunning = false;
  _timerPaused = Date.now()-_timerStart;
  clearInterval(_timerInterval);
  document.getElementById('btn-timer-start').style.display='';
  document.getElementById('btn-timer-pause').style.display='none';
}

function timerReset(){
  clearInterval(_timerInterval);
  _timerRunning=false; _timerStart=0; _timerPaused=0;
  const disp=document.getElementById('timer-display');
  if(disp) disp.textContent='00:00:00';
  const bar=document.getElementById('timer-progress-bar');
  if(bar) bar.style.width='0%';
  const pct=document.getElementById('timer-pct');
  if(pct) pct.textContent='0%';
  const eta=document.getElementById('timer-eta');
  if(eta){ eta.textContent='Tiempo restante: —'; eta.style.color=''; }
  const gramos=document.getElementById('timer-estimado-gramos');
  if(gramos) gramos.value='';
  const matSelR=document.getElementById('timer-material-id');
  if(matSelR) matSelR.value='';
  document.getElementById('btn-timer-start').style.display='';
  document.getElementById('btn-timer-pause').style.display='none';
  document.getElementById('btn-timer-finish').style.display='none';
}

function editTimerEntry(id){
  const h = DB.timerHistorial.find(x=>x.id===id); if(!h) return;
  document.getElementById('tedit-id').value = id;
  document.getElementById('tedit-nombre').value = h.nombre||'';
  document.getElementById('tedit-tiempo').value = h.tiempo||'';
  document.getElementById('tedit-gramos').value = h.gramosUsados||'';
  document.getElementById('tedit-impresora').value = h.impresora||'';
  document.getElementById('tedit-fecha').value = h.fecha||'';
  // Populate material select
  const sel = document.getElementById('tedit-material');
  if(sel){
    sel.innerHTML = '<option value="">Sin material</option>' +
      DB.materiales.map(m=>`<option value="${m.id}" ${h.materialId===m.id?'selected':''}>${m.tipo} ${m.color}</option>`).join('');
    if(h.materialNombre){
      const opt = [...sel.options].find(o=>o.text.includes(h.materialNombre.split(' ')[0]));
      if(opt) opt.selected=true;
    }
  }
  openModal('modal-timer-edit');
}

function saveTimerEntry(){
  const id = document.getElementById('tedit-id').value;
  const idx = DB.timerHistorial.findIndex(x=>x.id===id); if(idx<0) return;
  const matSel = document.getElementById('tedit-material');
  const mat = DB.materiales.find(m=>m.id===matSel?.value);
  DB.timerHistorial[idx] = {
    ...DB.timerHistorial[idx],
    nombre: document.getElementById('tedit-nombre').value,
    tiempo: document.getElementById('tedit-tiempo').value,
    gramosUsados: parseFloat(document.getElementById('tedit-gramos').value)||0,
    impresora: document.getElementById('tedit-impresora').value,
    fecha: document.getElementById('tedit-fecha').value,
    materialId: mat?.id||'',
    materialNombre: mat ? `${mat.tipo} ${mat.color}` : DB.timerHistorial[idx].materialNombre||'',
  };
  persist(KEYS.timerHistorial);
  closeModal('modal-timer-edit');
  renderTimerHistorial();
  showToast('Registro actualizado ✓');
}

function deleteTimerEntry(id){
  DB.timerHistorial = DB.timerHistorial.filter(h=>h.id!==id);
  persist(KEYS.timerHistorial);
  renderTimerHistorial();
}
function timerFinish(){
  if(!_timerRunning&&!_timerPaused) return;
  clearInterval(_timerInterval);
  _timerRunning=false;
  const elapsed = _timerPaused||(Date.now()-_timerStart);
  const h=Math.floor(elapsed/3600000), m=Math.floor((elapsed%3600000)/60000), s=Math.floor((elapsed%60000)/1000);
  const elapsedHours = elapsed/3600000;
  const tiempo=`${String(h).padStart(2,'0')}:${String(m).padStart(2,'0')}:${String(s).padStart(2,'0')}`;
  const nombre=document.getElementById('timer-nombre')?.value||'Trabajo';
  const impresoraId = document.getElementById('timer-impresora')?.value;
  const impresora = DB.impresoras.find(i=>i.id===impresoraId);

  // ── 1. Update printer hours ──
  if(impresora){
    impresora.horas = parseFloat(((impresora.horas||0) + elapsedHours).toFixed(2));
    persistWithStorage('impresoras', DB.impresoras);
    updateSidebarPrinterSelect();
  }

  // ── 2. Discount material stock directly from selected material ──
  const gramosUsados = parseFloat(document.getElementById('timer-estimado-gramos')?.value)||0;
  const matId = document.getElementById('timer-material-id')?.value;
  const proyId = document.getElementById('timer-proyecto')?.value;
  const proy = DB.proyectos.find(p=>p.id===proyId);
  let stockLog = '';
  if(gramosUsados > 0 && matId){
    const mat = DB.materiales.find(m=>m.id===matId);
    if(mat){
      const antes = parseFloat(mat.stock)||0;
      mat.stock = Math.max(0, parseFloat((antes - gramosUsados).toFixed(2)));
      stockLog = `${mat.tipo} ${mat.color}: -${gramosUsados}g (${antes}g → ${mat.stock}g)`;
      persistWithStorage('materiales', DB.materiales);
    }
  }

  const mat = DB.materiales.find(m=>m.id===matId);
  const entry={id:uid(),nombre,tiempo,
    impresora:impresora?impresora.nombre:'',
    gramosUsados,
    materialNombre: mat ? `${mat.tipo} ${mat.color}` : '',
    proyectoNombre:proy?proy.nombre:'',
    fecha:new Date().toLocaleDateString('es-AR'),ts:Date.now()};
  DB.timerHistorial.unshift(entry);
  if(DB.timerHistorial.length>20) DB.timerHistorial=DB.timerHistorial.slice(0,20);
  persist(KEYS.timerHistorial);
  timerReset();
  renderTimerHistorial();
  const msg = `Registrado: ${nombre} — ${tiempo}${impresora?' · '+impresora.nombre:''}${stockLog?' · '+stockLog:''}`;
  showToast(msg);
  // Refresh current section to reflect stock changes
  const refreshSecs=['materiales','dashboard','graficos','estadisticas','costos'];
  if(refreshSecs.includes(currentSection)) renderSection(currentSection);
}


// ════════════════════════════════
// IMPRESORA — WARRANTY CALC
// ════════════════════════════════
function calcImpGarantiaFromValue(garantiaDate){
  const diasEl = document.getElementById('imp-garantia-dias');
  if(!diasEl||!garantiaDate) return;
  const diff = Math.ceil((new Date(garantiaDate)-new Date())/86400000);
  if(diff>60){diasEl.textContent=diff+' días restantes';diasEl.style.color='var(--teal)';}
  else if(diff>0){diasEl.textContent='⚠️ '+diff+' días restantes';diasEl.style.color='var(--amber)';}
  else{diasEl.textContent='✗ Garantía vencida';diasEl.style.color='var(--ferrari)';}
}
function calcImpGarantia(){
  const fecha = document.getElementById('imp-fecha')?.value;
  const garantiaEl = document.getElementById('imp-garantia');
  const diasEl = document.getElementById('imp-garantia-dias');
  if(!fecha || !garantiaEl) return;
  const adq = new Date(fecha);
  const gar = new Date(adq);
  gar.setFullYear(gar.getFullYear() + 1);
  garantiaEl.value = gar.toISOString().split('T')[0];
  const hoy = new Date();
  const diff = Math.ceil((gar - hoy) / 86400000);
  if(diasEl){
    if(diff > 60){ diasEl.textContent = `${diff} días restantes`; diasEl.style.color = 'var(--teal)'; }
    else if(diff > 0){ diasEl.textContent = `⚠️ ${diff} días restantes`; diasEl.style.color = 'var(--amber)'; }
    else { diasEl.textContent = '✗ Garantía vencida'; diasEl.style.color = 'var(--ferrari)'; }
  }
}

// ════════════════════════════════
// MANTENIMIENTO — GUIDE CONTENT
// ════════════════════════════════
const MANT_GUIDE = {
  rutinario: {
    titulo: 'Rutinario — Después de cada impresión o semanalmente',
    color: 'var(--teal)',
    items: [
      { tarea: 'Limpieza de la placa de construcción', detalle: 'Utilizá agua tibia y jabón o alcohol isopropílico para eliminar residuos.' },
      { tarea: 'Limpieza interna', detalle: 'Usá una aspiradora pequeña o aire comprimido para quitar restos de filamento.' },
    ]
  },
  mensual: {
    titulo: 'Mensual — o cada 5 kg de filamento',
    color: 'var(--blue)',
    items: [
      { tarea: 'Limpieza y lubricación de ejes (XY)', detalle: 'Limpiá las guías lineales con alcohol isopropílico y aplicá una pequeña cantidad de aceite.' },
      { tarea: 'Limpieza de varillas de carbono (Eje X)', detalle: 'Limpiá las varillas con alcohol isopropílico (no engrasar) para mantener el movimiento suave.' },
      { tarea: 'Limpieza de ventiladores', detalle: 'Soplá polvo de los ventiladores de capa y del hotend.' },
    ]
  },
  trimestral: {
    titulo: 'Trimestral o Semestral',
    color: 'var(--amber)',
    items: [
      { tarea: 'Lubricación de husillos (Eje Z)', detalle: 'Limpiá la grasa vieja de los husillos y aplicá grasa nueva (como Super Lube 92003).' },
      { tarea: 'Revisión de tubos PTFE', detalle: 'Cambiá los tubos si muestran desgaste excesivo.' },
      { tarea: 'Calibración completa', detalle: 'Ejecutá una autocalibración completa desde la pantalla de la impresora tras el mantenimiento.' },
    ]
  }
};

function renderMantGuide(){
  const el = document.getElementById('mant-guide');
  if(!el) return;
  el.innerHTML = Object.values(MANT_GUIDE).map(g=>`
    <div style="background:var(--bg3);border-radius:10px;border:0.5px solid var(--border);padding:14px;margin-bottom:10px">
      <div style="display:flex;align-items:center;gap:8px;margin-bottom:10px">
        <div style="width:4px;height:4px;border-radius:50%;background:${g.color};flex-shrink:0"></div>
        <div style="font-size:12px;font-weight:700;color:${g.color}">${g.titulo}</div>
      </div>
      ${g.items.map(item=>`
        <div style="display:flex;gap:8px;padding:6px 0;border-bottom:0.5px solid var(--border)">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="${g.color}" stroke-width="2" style="flex-shrink:0;margin-top:2px"><polyline points="9 11 12 14 22 4"/><path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"/></svg>
          <div>
            <div style="font-size:12px;font-weight:600;color:var(--text)">${item.tarea}</div>
            <div style="font-size:11px;color:var(--text3);margin-top:2px;line-height:1.5">${item.detalle}</div>
          </div>
        </div>`).join('')}
    </div>`).join('');
}


const PROY_COLORES = [
  {hex:'#38d9a9',label:'Teal'},       {hex:'#4a7fd4',label:'Azul claro'},
  {hex:'#cc0000',label:'Ferrari'},    {hex:'#fbbf24',label:'Ámbar'},
  {hex:'#a78bfa',label:'Violeta'},    {hex:'#f97316',label:'Naranja'},
  {hex:'#34d399',label:'Verde'},      {hex:'#f472b6',label:'Rosa'},
  {hex:'#9eaab8',label:'Plateado'},   {hex:'#ffffff',label:'Blanco'},
  {hex:'#0d0d0f',label:'Negro'},      {hex:'#1a3a6b',label:'Navy'},
  {hex:'#78716c',label:'Gris'},       {hex:'#ec4899',label:'Fucsia'},
  {hex:'#06b6d4',label:'Cyan'},       {hex:'#84cc16',label:'Lima'},
  {hex:'#e01a00',label:'Rojo'},       {hex:'#b0b8c4',label:'Gris Plata'},
  {hex:'#d97706',label:'Marrón'},     {hex:'#0ea5e9',label:'Celeste'},
  {hex:'#8b5cf6',label:'Morado'},     {hex:'#10b981',label:'Esmeralda'},
];

function buildProyColorDropdown(){
  const dd = document.getElementById('proy-color-dropdown');
  if(!dd) return;
  dd.style.display = 'flex';
  dd.innerHTML = PROY_COLORES.map(c=>`
    <div onclick="selectProyColor('${c.hex}','${c.label}')"
      style="display:flex;flex-direction:column;align-items:center;gap:3px;cursor:pointer"
      title="${c.label}">
      <div style="width:28px;height:28px;border-radius:50%;background:${c.hex};
        border:2px solid var(--border2);
        transition:transform 0.15s,box-shadow 0.15s"
        onmouseover="this.style.transform='scale(1.2)';this.style.boxShadow='0 0 0 2px var(--accent)'"
        onmouseout="this.style.transform='scale(1)';this.style.boxShadow='none'">
      </div>
      <span style="font-size:8px;color:var(--text3);font-family:var(--mono);white-space:nowrap;max-width:36px;overflow:hidden;text-overflow:ellipsis">${c.label}</span>
    </div>`).join('');
  dd.style.display = 'none';
}

let _proyColorOpen = false;
function toggleProyColorDropdown(){
  const dd = document.getElementById('proy-color-dropdown');
  if(!dd) return;
  buildProyColorDropdown();
  _proyColorOpen = !_proyColorOpen;
  dd.style.display = _proyColorOpen ? 'flex' : 'none';
}

function selectProyColor(hex, label){
  document.getElementById('proy-color').value = hex;
  document.getElementById('proy-color-swatch').style.background = hex;
  document.getElementById('proy-color-label').textContent = label;
  const dd = document.getElementById('proy-color-dropdown');
  if(dd) dd.style.display = 'none';
  _proyColorOpen = false;
}

function setProyColorFromHex(hex){
  const c = PROY_COLORES.find(x=>x.hex===hex)||{hex:hex,label:hex};
  document.getElementById('proy-color').value = c.hex;
  const sw = document.getElementById('proy-color-swatch');
  const lb = document.getElementById('proy-color-label');
  if(sw) sw.style.background = c.hex;
  if(lb) lb.textContent = c.label;
}
// ════════════════════════════════
// PROYECTO — INSUMOS (materials list)
// ════════════════════════════════
let _proyInsumos = []; // [{id, tipo, refId, nombre, cantidad, unidad, consumir}]

const INSUMO_TIPOS = [
  {value:'material',   label:'Material / Filamento', icon:'⬡'},
  {value:'accesorio',  label:'Accesorio',             icon:'🔩'},
  {value:'componente', label:'Componente RC',          icon:'⚡'},
  {value:'producto',   label:'Producto',               icon:'📦'},
  {value:'stl',        label:'Archivo STL',            icon:'🖨️'},
  {value:'libre',      label:'Item libre',             icon:'✏️'},
];

function addProyInsumo(){
  _proyInsumos.push({id:uid(), tipo:'material', refId:'', nombre:'Marcano Tech', cantidad:1, unidad:'g', consumir:true});
  renderProyInsumos();
}

function removeProyInsumo(idx){
  _proyInsumos.splice(idx,1);
  renderProyInsumos();
}

function getInsumoOptions(tipo){
  switch(tipo){
    case 'material':   return DB.materiales.map(m=>({id:m.id, label:`${m.tipo} ${m.color} — ${m.marca}`, unidad:'g', stock:m.stock}));
    case 'accesorio':  return DB.accesorios.map(a=>({id:a.id, label:`${a.nombre} (${a.codigo||''})`, unidad:a.unidad||'Und', stock:a.stock}));
    case 'componente': return DB.componentes.map(c=>({id:c.id, label:`${c.nombre} ${c.codigo?'('+c.codigo+')':''}`, unidad:'Und', stock:c.stock}));
    case 'producto':   return DB.productos.map(p=>({id:p.id, label:`${p.nombre} (${p.sku||''})`, unidad:'Und', stock:p.stock}));
    case 'stl':        return DB.piezas.map(p=>({id:p.id, label:`${p.nombre}${p.codigo?' ['+p.codigo+']':''}${p.tiempo?' · '+p.tiempo:''}`, unidad:'pieza', tiempo:p.tiempo||'', gramos:p.gramos||0}));
    default: return [];
  }
}

function onInsumoTipoChange(idx){
  const tipoSel = document.getElementById(`insumo-tipo-${idx}`);
  if(!tipoSel) return;
  _proyInsumos[idx].tipo = tipoSel.value;
  _proyInsumos[idx].refId = '';
  _proyInsumos[idx].nombre = '';
  // Auto-set default unit
  const units = {material:'g', accesorio:'Und', componente:'Und', producto:'Und', libre:''};
  _proyInsumos[idx].unidad = units[tipoSel.value]||'Und';
  renderProyInsumos();
}

function onInsumoRefChange(idx){
  const refSel = document.getElementById(`insumo-ref-${idx}`);
  if(!refSel) return;
  const opts = getInsumoOptions(_proyInsumos[idx].tipo);
  const found = opts.find(o=>o.id===refSel.value);
  _proyInsumos[idx].refId = refSel.value;
  if(found){
    _proyInsumos[idx].nombre = found.label;
    _proyInsumos[idx].unidad = found.unidad||_proyInsumos[idx].unidad;
  }
  // Update unit display
  const unitEl = document.getElementById(`insumo-unit-${idx}`);
  if(unitEl) unitEl.textContent = _proyInsumos[idx].unidad;
}

function renderProyInsumos(){
  const cont = document.getElementById('proy-insumos-container');
  const empty = document.getElementById('proy-insumos-empty');
  if(!cont) return;
  if(empty) empty.style.display = _proyInsumos.length ? 'none' : 'block';
  if(!_proyInsumos.length){ cont.innerHTML=''; return; }

  cont.innerHTML = _proyInsumos.map((ins, i)=>{
    const opts = getInsumoOptions(ins.tipo);
    const optHtml = opts.length
      ? '<option value="">Seleccionar...</option>'+opts.map(o=>`<option value="${o.id}" ${ins.refId===o.id?'selected':''}>${o.label.substring(0,40)}${o.label.length>40?'...':''}</option>`).join('')
      : '<option value="">Sin registros</option>';
    const tipoIcon = INSUMO_TIPOS.find(t=>t.value===ins.tipo)?.icon||'•';
    return `<div style="background:var(--bg2);border-radius:var(--r);border:0.5px solid var(--border);padding:10px 12px;margin-bottom:8px">
      <div style="display:flex;align-items:center;gap:8px;margin-bottom:8px;flex-wrap:wrap">
        <!-- Tipo -->
        <select style="font-size:11px;background:var(--bg3);border:0.5px solid var(--border2);border-radius:6px;padding:4px 8px;color:var(--text);font-family:var(--font);cursor:pointer"
          id="insumo-tipo-${i}" onchange="onInsumoTipoChange(${i})">
          ${INSUMO_TIPOS.map(t=>`<option value="${t.value}" ${ins.tipo===t.value?'selected':''}>${t.icon} ${t.label}</option>`).join('')}
        </select>
        <!-- Toggle consumir stock -->
        <label style="display:flex;align-items:center;gap:5px;cursor:pointer;font-size:11px;color:var(--text2);margin-left:auto">
          <input type="checkbox" ${ins.consumir?'checked':''} onchange="_proyInsumos[${i}].consumir=this.checked" style="accent-color:var(--ferrari)">
          Descontar stock
        </label>
        <!-- Eliminar -->
        <button onclick="removeProyInsumo(${i})" style="background:rgba(249,115,22,0.1);border:none;border-radius:6px;padding:4px 8px;color:var(--ferrari);cursor:pointer;font-size:12px">✕</button>
      </div>
      <div style="display:flex;gap:8px;align-items:flex-end;flex-wrap:wrap">
        ${ins.tipo==='libre'
          ? `<div style="flex:1;min-width:140px">
               <label style="font-size:10px;color:var(--text3);display:block;margin-bottom:3px">Nombre</label>
               <input class="form-input" style="font-size:12px" placeholder="Descripción libre" value="${ins.nombre||''}"
                 oninput="_proyInsumos[${i}].nombre=this.value">
             </div>`
          : `<div style="flex:1;min-width:140px">
               <label style="font-size:10px;color:var(--text3);display:block;margin-bottom:3px">Item</label>
               <select class="form-input" style="font-size:12px" id="insumo-ref-${i}" onchange="onInsumoRefChange(${i})">
                 ${optHtml}
               </select>
             </div>`}
        <div style="width:80px">
          <label style="font-size:10px;color:var(--text3);display:block;margin-bottom:3px">Cantidad</label>
          <input class="form-input" type="number" style="font-size:12px" value="${ins.cantidad||1}" min="0.01" step="${ins.tipo==='material'?50:1}"
            oninput="_proyInsumos[${i}].cantidad=parseFloat(this.value)||1">
        </div>
        <div style="width:60px">
          <label style="font-size:10px;color:var(--text3);display:block;margin-bottom:3px">Unidad</label>
          <div style="font-size:12px;color:var(--text2);font-family:var(--mono);padding:9px 4px;font-weight:600" id="insumo-unit-${i}">${ins.unidad||'Und'}</div>
        </div>
        ${ins.refId && opts.length ? `<div style="font-size:10px;color:var(--text3);padding-bottom:10px">
          Stock: <span style="color:${opts.find(o=>o.id===ins.refId)?.stock>0?'var(--teal)':'var(--ferrari)'}">${opts.find(o=>o.id===ins.refId)?.stock??'—'}</span>
        </div>` : ''}
      </div>
    </div>`;
  }).join('');
}

// Called when saving proyecto — optionally deduct stock
function aplicarInsumosAlStock(insumos){
  insumos.forEach(ins=>{
    if(!ins.consumir || !ins.refId) return;
    const cant = parseFloat(ins.cantidad)||0;
    if(ins.tipo==='material'){
      const m = DB.materiales.find(x=>x.id===ins.refId);
      if(m){ m.stock = Math.max(0, (m.stock||0)-cant); persist('materiales'); }
    } else if(ins.tipo==='accesorio'){
      const a = DB.accesorios.find(x=>x.id===ins.refId);
      if(a){ a.stock = Math.max(0, (a.stock||0)-cant); persist('accesorios'); }
    } else if(ins.tipo==='componente'){
      const c = DB.componentes.find(x=>x.id===ins.refId);
      if(c){ c.stock = Math.max(0, (c.stock||0)-cant); persist('componentes'); }
    } else if(ins.tipo==='producto'){
      const p = DB.productos.find(x=>x.id===ins.refId);
      if(p){ p.stock = Math.max(0, (p.stock||0)-cant); persist('productos'); }
    }
  });
}

function renderProyectos(filter='todos'){
  const list=filter==='todos'?DB.proyectos:DB.proyectos.filter(p=>p.estado===filter);
  return list.length===0
    ? `<div style="grid-column:1/-1"><div class="empty-state"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"/></svg><p>Sin proyectos${filter!=='todos'?' en este estado':''}</p></div></div>
    <div class="add-card" onclick="openModal('modal-proyecto')" style="min-height:100px;"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="16"/><line x1="8" y1="12" x2="16" y2="12"/></svg><span>Nuevo proyecto</span></div>`
    : list.map(p=>{
        const ec=estadoConfig[p.estado]||{label:p.estado,cls:'badge-gray',color:'var(--text3)'};
        const bg=p.color||'#38d9a9';
        return `<div class="project-card" onclick="editProyecto('${p.id}')" style="display:grid;grid-template-columns:110px 1fr;overflow:hidden">
          <div style="background:linear-gradient(135deg,${bg}22,${bg}08);display:flex;align-items:center;justify-content:center;overflow:hidden;min-height:110px">${p.imagen ? `<img src="${p.imagen}" style="width:100%;height:100%;object-fit:cover">` : `<span style="font-size:32px">${p.emoji||'🖨️'}</span>`}</div>
          <div class="project-body">
            <div class="project-name">${p.nombre}</div>
            <div class="project-meta">${(p.insumos&&p.insumos.length)?p.insumos.length+' insumo'+(p.insumos.length>1?'s':''):(p.material||'Sin insumos')} · ${p.tipo||'—'}</div>
            <div class="project-progress"><div class="progress-fill" style="width:${p.progreso||0}%;background:${bg}"></div></div>
            <div class="project-footer">
              <span class="badge ${ec.cls}">${ec.label}</span>
              <span class="project-time">${p.tiempo||'—'}</span>
              ${(()=>{const stls=(p.insumos||[]).filter(i=>i.tipo==='stl');const totalG=stls.reduce((a,i)=>{const pz=DB.piezas.find(x=>x.id===i.refId);return a+(pz?parseFloat(pz.gramos||0)*(i.cantidad||1):0);},0);return totalG>0?`<span style="font-size:10px;color:var(--text3);font-family:var(--mono)">${totalG}g</span>`:''})()}
              <button onclick="event.stopPropagation();deleteProyecto('${p.id}')" style="background:rgba(249,115,22,0.1);border:none;border-radius:5px;padding:3px 8px;color:var(--ferrari);cursor:pointer;font-size:11px;margin-left:auto">Eliminar</button>
            </div>
          </div>
        </div>`;
      }).join('')+`<div class="add-card" onclick="openModal('modal-proyecto')"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="16"/><line x1="8" y1="12" x2="16" y2="12"/></svg><span>Nuevo proyecto</span></div>`;
}

function deleteProyecto(id){
  if(!confirm('¿Eliminar este proyecto? Esta acción no se puede deshacer.')) return;
  DB.proyectos=DB.proyectos.filter(p=>p.id!==id);
  persistWithStorage('proyectos', DB.proyectos);
  updateBadges(); renderSection(currentSection);
  showToast('Proyecto eliminado');
}
function editProyecto(id){
  const p=DB.proyectos.find(x=>x.id===id); if(!p) return;
  document.getElementById('proyecto-edit-id').value=p.id;
  document.getElementById('modal-proyecto-title').textContent='Editar proyecto';
  document.getElementById('proy-nombre').value=p.nombre;
  document.getElementById('proy-emoji').value=p.emoji;
  document.getElementById('proy-tipo').value=p.tipo;
  document.getElementById('proy-estado').value=p.estado;
  document.getElementById('proy-material').value=p.material;
  document.getElementById('proy-progreso').value=p.progreso;
  document.getElementById('proy-notas').value=p.notas;
  document.getElementById('proy-tiempo').value=p.tiempo;
  setProyColorFromHex(p.color||'#38d9a9');
  const imgValP = p.imagen||'';
  document.getElementById('proy-imagen').value = imgValP;
  if(imgValP){ document.getElementById('proy-img-preview').innerHTML=`<img src="${imgValP}" style="width:100%;height:100%;object-fit:cover;border-radius:10px">`; }
  else{ resetImgPreview('proy-img-preview','proy-imagen'); }
  // Restore insumos
  _proyInsumos = (p.insumos||[]).map(i=>({...i}));
  renderProyInsumos();
  openModal('modal-proyecto');
}

let _filtroProyectos='todos';
function filterProyectos(f,btn){
  _filtroProyectos=f;
  document.querySelectorAll('#sec-proyectos .tab').forEach(t=>t.classList.remove('active'));
  if(btn) btn.classList.add('active');
  document.getElementById('proyectos-grid').innerHTML=renderProyectos(f);
}

// ════════════════════════════════
// MATERIALES
// ════════════════════════════════
// ════════════════════════════════
// MATERIAL MODAL — DATA
// ════════════════════════════════
const MAT_TIPOS = [
  // ── PLA ──
  {id:'PLA',              name:'PLA Basic',              desc:'Uso general, fácil de imprimir y estable'},
  {id:'PLA Pro',          name:'PLA Pro',                desc:'Mayor resistencia y durabilidad, similar al ABS'},
  {id:'PLA+',             name:'PLA+ / Rapid PLA+',      desc:'Alta velocidad, mayor tenacidad que PLA básico'},
  {id:'PLA Matte',        name:'PLA Matte',              desc:'Acabado opaco y suave, oculta líneas de capa'},
  {id:'PLA Silk',         name:'PLA Silk / Seda',        desc:'Acabado brillante, satinado y efecto metálico'},
  {id:'PLA Marble',       name:'PLA Marble',             desc:'Efecto mármol para acabados estéticos únicos'},
  {id:'PLA Wood',         name:'PLA Wood',               desc:'Efecto madera con partículas orgánicas'},
  {id:'PLA CF',           name:'PLA-CF Fibra Carbono',   desc:'Reforzado con fibra de carbono, mayor rigidez'},
  // ── PETG ──
  {id:'PETG',             name:'PETG',                   desc:'Resistente y fácil de imprimir'},
  {id:'PETG Rapid',       name:'Rapid PETG',             desc:'Alta velocidad hasta 600 mm/s, fuerza del PETG'},
  {id:'PETG Pro',         name:'PETG Pro',               desc:'Mayor resistencia a impactos, agua y humedad'},
  {id:'PETG CF',          name:'PETG-CF Fibra Carbono',  desc:'PETG reforzado con fibra de carbono'},
  // ── ABS / ASA ──
  {id:'ABS',              name:'ABS',                    desc:'Resistente, requiere ventilación'},
  {id:'ASA',              name:'ASA',                    desc:'Resistente a rayos UV y exterior'},
  // ── TPU ──
  {id:'TPU 95A',          name:'TPU 95A',                desc:'Rígido-Flexible — uso general RC'},
  {id:'TPU 98A',          name:'TPU 98A',                desc:'Rígido-Flexible — casi rígido'},
  {id:'TPU 90A',          name:'TPU 90A',                desc:'Blando — buena absorción de impactos'},
  {id:'TPU 85A',          name:'TPU 85A',                desc:'Blando — muy flexible y suave'},
  {id:'TPU',              name:'TPU / Flexible',         desc:'Flexible genérico'},
  // ── Técnicos ──
  {id:'Nylon',            name:'Nylon (PA)',              desc:'Alta resistencia mecánica'},
  {id:'PC',               name:'Policarbonato (PC)',      desc:'Ultra resistente al impacto'},
  {id:'HIPS',             name:'HIPS',                   desc:'Material de soporte para ABS'},
  {id:'PVA',              name:'PVA',                    desc:'Soporte soluble en agua'},
  // ── Especiales ──
  {id:'Metal Fill',       name:'Metal Fill',             desc:'Con partículas metálicas'},
  {id:'Fosforescente',    name:'Fosforescente',          desc:'Brilla en la oscuridad'},
  {id:'Otro',             name:'Otro',                   desc:'Material personalizado'},
];

const MAT_COLORES = [
  {id:'Negro',        hex:'#1a1a1a', label:'Negro'},
  {id:'Blanco',       hex:'#f5f5f0', label:'Blanco'},
  {id:'Gris',         hex:'#888888', label:'Gris'},
  {id:'Gris Oscuro',  hex:'#444444', label:'Gris Oscuro'},
  {id:'Rojo',         hex:'#d32f2f', label:'Rojo'},
  {id:'Naranja',      hex:'#e65100', label:'Naranja'},
  {id:'Amarillo',     hex:'#f9a825', label:'Amarillo'},
  {id:'Verde',        hex:'#2e7d32', label:'Verde'},
  {id:'Verde Lima',   hex:'#7cb342', label:'Verde Lima'},
  {id:'Azul',         hex:'#1565c0', label:'Azul'},
  {id:'Azul Claro',   hex:'#0288d1', label:'Azul Claro'},
  {id:'Celeste',      hex:'#80d8ff', label:'Celeste'},
  {id:'Morado',       hex:'#6a1b9a', label:'Morado'},
  {id:'Violeta',      hex:'#ab47bc', label:'Violeta'},
  {id:'Rosa',         hex:'#e91e63', label:'Rosa'},
  {id:'Rosa Claro',   hex:'#f8bbd0', label:'Rosa Claro'},
  {id:'Marrón',       hex:'#5d4037', label:'Marrón'},
  {id:'Beige',        hex:'#d7ccc8', label:'Beige'},
  {id:'Dorado',       hex:'#d4a017', label:'Dorado'},
  {id:'Plateado',     hex:'#9e9e9e', label:'Plateado'},
  {id:'Bronce',       hex:'#8d6e63', label:'Bronce'},
  {id:'Cobre',        hex:'#bf7c2a', label:'Cobre'},
  {id:'Translúcido / Clear', hex:'transparent-clear', label:'Translúcido / Clear', special:'clear'},
  {id:'Translúcido Azul',    hex:'#90caf9',            label:'Translúcido Azul',   special:'transp'},
  {id:'Translúcido Rojo',    hex:'#ef9a9a',            label:'Translúcido Rojo',   special:'transp'},
  {id:'Translúcido Verde',   hex:'#a5d6a7',            label:'Translúcido Verde',  special:'transp'},
  {id:'Translúcido Naranja', hex:'#ffcc80',            label:'Translúcido Naranja',special:'transp'},
  {id:'Translúcido Amarillo',hex:'#fff176',            label:'Translúcido Amarillo',special:'transp'},
  {id:'Translúcido Natural',hex:'rgba(220,210,190,0.5)', label:'Translúcido Natural', special:'transp'},
  {id:'Gris Claro',          hex:'#bdbdbd',            label:'Gris Claro'},
  {id:'Natural',      hex:'#f0e6c8', label:'Natural / Marfil'},
  {id:'Multicolor',   hex:'multicolor', label:'Multicolor / Rainbow', special:'multi'},
  {id:'Otro',         hex:'#888888', label:'Otro'},
];

let _matTipoSelected = '';
let _matColorSelected = null;

// ── Marca select handler ──
function onMatMarcaSelect(val){
  const input = document.getElementById('mat-marca');
  const sel = document.getElementById('mat-marca-select');
  if(val === 'otra'){
    input.style.display = '';
    input.value = '';
    input.focus();
  } else {
    input.style.display = 'none';
    input.value = val; // store actual brand value in the text input
  }
}

// ── Price ARS → USD auto-calc ──
function onMatPrecioARS(arsVal){
  const ars = parseFloat(arsVal)||0;
  const usdEl = document.getElementById('mat-precio');
  const hint = document.getElementById('mat-dolar-rate-hint');
  if(_dolarRate && ars > 0){
    const usd = ars / _dolarRate;
    usdEl.value = usd.toFixed(2);
    if(hint) hint.textContent = `USD oficial: $${_dolarRate.toLocaleString('es-AR')} ARS`;
  } else {
    usdEl.value = '';
    if(hint) hint.textContent = _dolarRate ? `USD oficial: $${_dolarRate.toLocaleString('es-AR')} ARS` : 'Sin cotización';
  }
}

function onMatPrecioUSD(usdVal){
  // Allow manual USD edit → recalc ARS
  const usd = parseFloat(usdVal)||0;
  const arsEl = document.getElementById('mat-precio-ars');
  if(_dolarRate && usd > 0){
    arsEl.value = Math.round(usd * _dolarRate);
  }
}

// ── FIX openMatModal — full reset when called without editId ──
function openMatModal(editId=''){
  _matTipoSelected = '';
  _matColorSelected = null;
  document.getElementById('material-edit-id').value = '';
  // Reset all fields
  document.getElementById('mat-tipo-label').textContent = 'Seleccionar material...';
  document.getElementById('mat-tipo').value = '';
  document.getElementById('mat-color-label').textContent = 'Seleccionar color';
  document.getElementById('mat-color-swatch').style.display = 'none';
  document.getElementById('mat-color-nombre').value = '';
  document.getElementById('mat-color-hex').value = '#888888';
  document.getElementById('mat-modal-title').textContent = editId ? 'Editar Filamento' : 'Nuevo Filamento';
  document.querySelector('#modal-material .btn-accent').textContent = editId ? 'Guardar cambios' : 'Agregar Filamento';
  // Reset marca
  document.getElementById('mat-marca').value = '';
  document.getElementById('mat-marca').style.display = 'none';
  document.getElementById('mat-marca-select').value = '';
  // Reset precios
  document.getElementById('mat-precio').value = '';
  document.getElementById('mat-precio-ars').value = '';
  // Reset notas y URL
  document.getElementById('mat-notas').value = '';
  if(document.getElementById('mat-url')) document.getElementById('mat-url').value = '';
  // Reset imagen
  resetImgPreview('mat-img-preview','mat-imagen');
  // Reset dolar hint
  const hint = document.getElementById('mat-dolar-rate-hint');
  if(hint && _dolarRate) hint.textContent = `USD oficial: $${_dolarRate.toLocaleString('es-AR')} ARS`;
  // Reset peso a 1kg
  selectPeso(1000);
  buildMatDropdowns();
  openModal('modal-material');
}

function buildMatDropdowns(){
  // Tipos
  const dd = document.getElementById('mat-tipo-dropdown');
  dd.innerHTML = MAT_TIPOS.map(t=>`
    <div class="mat-dropdown-item ${_matTipoSelected===t.id?'selected':''}" onclick="selectMatTipo('${t.id}','${t.name}')">
      <div><div class="item-name">${t.name}</div><div class="item-desc">${t.desc}</div></div>
      ${_matTipoSelected===t.id?'<span class="mat-checkmark">✓</span>':''}
    </div>`).join('');

  // Colores
  const cd = document.getElementById('mat-color-dropdown');
  cd.innerHTML = MAT_COLORES.map(c=>{
    const swatchStyle = c.special==='clear'
      ? 'background:linear-gradient(135deg,#fff 50%,#e0e0e0 50%);border:1px solid #ccc'
      : c.special==='multi'
      ? 'background:linear-gradient(135deg,#f44336,#ff9800,#ffeb3b,#4caf50,#2196f3,#9c27b0)'
      : c.special==='transp'
      ? `background:${c.hex};opacity:0.7`
      : `background:${c.hex}`;
    return `<div class="mat-dropdown-item ${_matColorSelected&&_matColorSelected.id===c.id?'selected':''}" onclick="selectMatColor('${c.id}')">
      <span class="mat-color-swatch-item" style="${swatchStyle}"></span>
      <span class="item-name">${c.label}</span>
      ${_matColorSelected&&_matColorSelected.id===c.id?'<span class="mat-checkmark">✓</span>':''}
    </div>`;
  }).join('');
}

function toggleMatDropdown(){
  const dd=document.getElementById('mat-tipo-dropdown');
  const cd=document.getElementById('mat-color-dropdown');
  cd.style.display='none';
  dd.style.display = dd.style.display==='none' ? 'block' : 'none';
}

function toggleColorDropdown(){
  const dd=document.getElementById('mat-tipo-dropdown');
  const cd=document.getElementById('mat-color-dropdown');
  dd.style.display='none';
  cd.style.display = cd.style.display==='none' ? 'block' : 'none';
}

function selectMatTipo(id, name){
  _matTipoSelected = id;
  document.getElementById('mat-tipo').value = id;
  document.getElementById('mat-tipo-label').textContent = name;
  document.getElementById('mat-tipo-display').style.color = 'var(--text)';
  document.getElementById('mat-tipo-dropdown').style.display = 'none';
  buildMatDropdowns();
}

function selectMatColor(id){
  const c = MAT_COLORES.find(x=>x.id===id);
  if(!c) return;
  _matColorSelected = c;
  document.getElementById('mat-color-nombre').value = c.id;
  document.getElementById('mat-color-hex').value = c.special==='clear'?'#f0f0f0': c.special==='multi'?'#ff9800':c.hex;
  document.getElementById('mat-color-label').textContent = c.label;
  document.getElementById('mat-color-label').style.color = 'var(--text)';
  const sw = document.getElementById('mat-color-swatch');
  sw.style.display = 'inline-block';
  if(c.special==='clear') sw.style.background='linear-gradient(135deg,#fff 50%,#e0e0e0 50%)';
  else if(c.special==='multi') sw.style.background='linear-gradient(135deg,#f44336,#ff9800,#ffeb3b,#4caf50,#2196f3,#9c27b0)';
  else sw.style.background=c.hex;
  document.getElementById('mat-color-dropdown').style.display='none';
  buildMatDropdowns();
}

function selectPeso(g){
  document.querySelectorAll('.mat-peso-btn').forEach(b=>b.classList.remove('active'));
  const customInput = document.getElementById('mat-total');
  if(g==='custom'){
    document.querySelector('[data-g="custom"]').classList.add('active');
    customInput.style.display='block';
    customInput.focus();
    customInput.oninput=()=>{ document.getElementById('mat-total-val').value=customInput.value||0; updateStockSlider(document.getElementById('mat-stock-slider').value); };
  } else {
    document.querySelector(`[data-g="${g}"]`).classList.add('active');
    customInput.style.display='none';
    document.getElementById('mat-total-val').value=g;
    updateStockSlider(document.getElementById('mat-stock-slider').value);
  }
}

function updateStockSlider(pct){
  const total = parseInt(document.getElementById('mat-total-val').value)||1000;
  const grams = Math.round(total * pct / 100);
  document.getElementById('mat-stock').value = grams;
  const label = document.getElementById('mat-stock-label');
  const color = pct<20?'var(--coral)':pct<40?'var(--amber)':'var(--teal)';
  label.style.color = color;
  label.textContent = `${pct}% (${grams}g)`;
  document.getElementById('mat-stock-slider').style.accentColor = color;
}

// Cerrar dropdowns al hacer clic fuera
document.addEventListener('click', e=>{
  if(!e.target.closest('#modal-material')) return;
  if(!e.target.closest('#mat-tipo-display') && !e.target.closest('#mat-tipo-dropdown'))
    document.getElementById('mat-tipo-dropdown').style.display='none';
  if(!e.target.closest('#mat-color-display') && !e.target.closest('#mat-color-dropdown'))
    document.getElementById('mat-color-dropdown').style.display='none';
});

function saveMaterial(){
  try{
    const editId = document.getElementById('material-edit-id').value;
    const tipo = document.getElementById('mat-tipo').value;
    const colorNombre = document.getElementById('mat-color-nombre').value;
    if(!tipo){ showToast('Seleccioná un tipo de material','error'); return; }
    if(!colorNombre){ showToast('Seleccioná un color','error'); return; }
    const total = parseInt(document.getElementById('mat-total-val').value)||1000;
    const stock = parseInt(document.getElementById('mat-stock').value)||0;
    const obj = {
      id: editId||uid(),
      tipo,
      marca: document.getElementById('mat-marca').value||'—',
      color: colorNombre,
      colorHex: document.getElementById('mat-color-hex').value||'#888888',
      stock,
      total,
      precio: parseFloat(document.getElementById('mat-precio').value)||0,
      precioARS: parseFloat(document.getElementById('mat-precio-ars').value)||0,
      imagen: document.getElementById('mat-imagen').value||'',
      dolarRateAlta: _dolarRate||null,
      url: document.getElementById('mat-url')?.value||'',
      tempBoquilla: '—', tempCama: '—', velocidad: '—',
      notas: document.getElementById('mat-notas').value||''
    };
    if(editId){ DB.materiales=DB.materiales.map(m=>m.id===editId?obj:m); }
    else{ DB.materiales.push(obj); logActivity(`Material <strong>${obj.tipo} ${obj.color}</strong> registrado`,'success'); }
    persist(KEYS.materiales);
    updateBadges();
    closeModal('modal-material');
    document.getElementById('material-edit-id').value='';
    clearForm(['mat-notas','mat-url']);
    document.getElementById('mat-precio').value='';
    document.getElementById('mat-precio-ars').value='';
    document.getElementById('mat-marca').value='';
    document.getElementById('mat-marca').style.display='none';
    document.getElementById('mat-marca-select').value='';
    // Reset material and color dropdowns
    document.getElementById('mat-tipo').value='';
    document.getElementById('mat-tipo-label').textContent='Seleccionar material...';
    document.getElementById('mat-color-nombre').value='';
    document.getElementById('mat-color-hex').value='#888888';
    document.getElementById('mat-color-label').textContent='Color';
    const sw=document.getElementById('mat-color-swatch'); if(sw){sw.style.display='none';}
    // Reset peso buttons
    document.querySelectorAll('.mat-peso-btn').forEach(b=>b.classList.remove('active'));
    const btn1kg=document.querySelector('.mat-peso-btn[data-g="1000"]'); if(btn1kg) btn1kg.classList.add('active');
    document.getElementById('mat-total-val').value='1000';
    document.getElementById('mat-total').style.display='none';
    document.getElementById('mat-total').value='1000';
    document.getElementById('mat-stock-slider').value=100;
    document.getElementById('mat-stock').value=1000;
    document.getElementById('mat-stock-label').textContent='100% (1000g)';
    resetImgPreview('mat-img-preview','mat-imagen');
    const hint = document.getElementById('mat-dolar-rate-hint');
    if(hint && _dolarRate) hint.textContent = `USD oficial: $${_dolarRate.toLocaleString('es-AR')} ARS`;
    document.getElementById('mat-tipo-label').textContent='Seleccionar material...';
    document.getElementById('mat-color-label').textContent='Seleccionar color';
    document.getElementById('mat-color-swatch').style.display='none';
    _matTipoSelected=''; _matColorSelected=null;
    selectPeso(1000);
    document.getElementById('mat-stock-slider').value=100;
    updateStockSlider(100);
    renderSection(currentSection);
    showToast('Material guardado ✓');
  } catch(e){
    console.error('saveMaterial error:',e);
    showToast('Error: '+e.message,'error');
  }
}

function deleteMaterial(id){
  if(!confirm('¿Eliminar este material?')) return;
  DB.materiales=DB.materiales.filter(m=>m.id!==id);
  persist(KEYS.materiales); updateBadges(); renderSection(currentSection); showToast('Material eliminado','error');
}

function editMaterial(id){
  const m=DB.materiales.find(x=>x.id===id); if(!m) return;
  openMatModal(id);
  document.getElementById('material-edit-id').value=m.id;
  // Tipo
  const tipoObj=MAT_TIPOS.find(t=>t.id===m.tipo);
  _matTipoSelected=m.tipo;
  document.getElementById('mat-tipo').value=m.tipo;
  document.getElementById('mat-tipo-label').textContent=tipoObj?tipoObj.name:m.tipo;
  // Color
  const colorObj=MAT_COLORES.find(c=>c.id===m.color);
  _matColorSelected=colorObj||{id:m.color,hex:m.colorHex,label:m.color};
  document.getElementById('mat-color-nombre').value=m.color;
  document.getElementById('mat-color-hex').value=m.colorHex;
  document.getElementById('mat-color-label').textContent=m.color;
  document.getElementById('mat-color-label').style.color='var(--text)';
  const sw=document.getElementById('mat-color-swatch');
  sw.style.display='inline-block'; sw.style.background=m.colorHex;
  // Peso
  const pesoMap={250:250,500:500,750:750,1000:1000,2000:2000,3000:3000};
  if(pesoMap[m.total]) selectPeso(m.total);
  else{ selectPeso('custom'); document.getElementById('mat-total').value=m.total; document.getElementById('mat-total-val').value=m.total; }
  // Slider
  const pct=Math.round((m.stock/m.total)*100);
  document.getElementById('mat-stock-slider').value=pct;
  document.getElementById('mat-stock').value=m.stock;
  updateStockSlider(pct);
  // Resto
  // Restore marca
  const marcaSelect = document.getElementById('mat-marca-select');
  const marcaInput = document.getElementById('mat-marca');
  const knownBrands = ['Polymaker','eSun','Sunlu','Bambu Lab','Elegoo','Printalot','Grilon3','Plast.ar','GST3D','3N3','3NMax'];
  const marca = m.marca==='—'?'':m.marca;
  if(marca && knownBrands.includes(marca)){
    marcaSelect.value = marca;
    marcaInput.value = marca;
    marcaInput.style.display = 'none';
  } else if(marca){
    marcaSelect.value = 'otra';
    marcaInput.value = marca;
    marcaInput.style.display = '';
  } else {
    marcaSelect.value = '';
    marcaInput.value = '';
    marcaInput.style.display = 'none';
  }
  document.getElementById('mat-precio').value=m.precio||'';
  document.getElementById('mat-precio-ars').value=m.precioARS||'';
  const imgValMat = m.imagen||'';
  document.getElementById('mat-imagen').value=imgValMat;
  if(imgValMat){ document.getElementById('mat-img-preview').innerHTML=`<img src="${imgValMat}" style="width:100%;height:100%;object-fit:cover;border-radius:10px">`; }
  else{ resetImgPreview('mat-img-preview','mat-imagen'); }
  if(document.getElementById('mat-url')) document.getElementById('mat-url').value = m.url||'';
  const hint2 = document.getElementById('mat-dolar-rate-hint');
  if(hint2 && _dolarRate) hint2.textContent = `USD oficial: $${_dolarRate.toLocaleString('es-AR')} ARS`;
  document.getElementById('mat-notas').value=m.notas||'';
  buildMatDropdowns();
}

function renderMaterialesTable(){
  const tbody=document.getElementById('materiales-tbody');
  if(!tbody) return;
  if(!DB.materiales.length){ tbody.innerHTML=`<tr><td colspan="7" style="text-align:center;color:var(--text3);padding:24px;font-family:var(--mono);font-size:12px;">Sin materiales registrados</td></tr>`; return; }
  tbody.innerHTML=DB.materiales.map(m=>{
    const pct=Math.round((m.stock/m.total)*100);
    const color=pct<20?'var(--coral)':pct<40?'var(--amber)':'var(--teal)';
    return `<tr>
      <td><strong>${m.tipo}</strong>${m.codigo?`<div style="font-size:10px;color:var(--text3);font-family:var(--mono)">${m.codigo}</div>`:''}</td>
      <td class="mono">${m.tipo}</td>
      <td>${m.marca}</td>
      <td><span style="display:inline-flex;align-items:center;gap:6px;"><span style="width:10px;height:10px;border-radius:50%;background:${m.colorHex};display:inline-block;border:0.5px solid var(--border2)"></span>${m.color}</span></td>
      <td class="mono" style="color:${color}">${m.stock}g</td>
      <td class="mono">${m.total}g</td>
      <td><div style="width:80px;"><div style="height:4px;background:var(--border);border-radius:2px;overflow:hidden;"><div style="height:100%;width:${pct}%;background:${color};border-radius:2px"></div></div><div style="font-size:9px;color:var(--text3);font-family:var(--mono);margin-top:2px">${pct}%</div></div></td>
      <td><button class="btn btn-ghost btn-sm" onclick="editMaterial('${m.id}')">editar</button> <button class="btn btn-danger btn-sm" onclick="deleteMaterial('${m.id}')">✕</button></td>
    </tr>`;
  }).join('');
}

// ════════════════════════════════
// PRODUCTOS
// ════════════════════════════════
function saveProducto(){
  const editId=document.getElementById('producto-edit-id').value;
  const obj={
    id:editId||uid(),
    nombre:document.getElementById('prod-nombre').value.trim(),
    emoji:document.getElementById('prod-emoji').value||'📦',
    imagen:document.getElementById('prod-imagen').value||'',
    tiempo:document.getElementById('prod-tiempo')?.value||'',
    gramos:parseFloat(document.getElementById('prod-gramos')?.value)||0,
    layer:parseFloat(document.getElementById('prod-layer')?.value)||0,
    paredes:parseInt(document.getElementById('prod-paredes')?.value)||0,
    relleno:parseInt(document.getElementById('prod-relleno')?.value)||0,
    stlRef:document.getElementById('prod-stl-ref')?.value||'',
    sku:document.getElementById('prod-sku').value||'—',
    precio:parseFloat(document.getElementById('prod-precio').value)||0,
    stock:parseInt(document.getElementById('prod-stock').value)||0,
    categoria:document.getElementById('prod-categoria').value,
    descripcion:document.getElementById('prod-descripcion').value
  };
  if(!obj.nombre){ showToast('Ingresá un nombre','error'); return; }
  if(editId){ DB.productos=DB.productos.map(p=>p.id===editId?obj:p); }
  else{ DB.productos.push(obj); logActivity(`Producto <strong>${obj.nombre}</strong> agregado al catálogo`); }
  persistWithStorage('productos', DB.productos); updateBadges(); closeModal('modal-producto');
  document.getElementById('producto-edit-id').value='';
  clearForm(['prod-nombre','prod-sku','prod-precio','prod-stock','prod-descripcion']);
  resetImgPreview('prod-img-preview','prod-imagen');
  renderSection(currentSection); showToast('Producto guardado ✓');
}

function deleteProducto(id){
  if(!confirm('¿Eliminar este producto?')) return;
  DB.productos=DB.productos.filter(p=>p.id!==id);
  persist(KEYS.productos); updateBadges(); renderSection(currentSection); showToast('Producto eliminado','error');
}

function renderProductos(){
  const sr=document.getElementById('productos-stats-row');
  if(sr){
    const cats=['Kit completo','Body / Carrocería','Suspensión','Ruedas / Neumáticos','Hardware / Tech','Accesorios','Personalizado / Premium','Decoración / Home','Otro'];
    const total=DB.productos.length;
    const sinStock=DB.productos.filter(p=>parseInt(p.stock||0)===0).length;
    sr.innerHTML=`<div class="stat-card"><div class="stat-label">Total</div><div class="stat-value">${total}</div><div class="stat-delta neutral">productos</div></div>`+
      cats.map(cat=>{const n=DB.productos.filter(p=>p.categoria===cat).length;return n>0?`<div class="stat-card"><div class="stat-label">${cat.split('/')[0].trim()}</div><div class="stat-value">${n}</div><div class="stat-delta neutral">ítems</div></div>`:''}).join('')+
      (sinStock>0?`<div class="stat-card"><div class="stat-label">Sin stock</div><div class="stat-value" style="color:var(--amber)">${sinStock}</div><div class="stat-delta neutral">reponer</div></div>`:'');
  }
  const grid=document.getElementById('productos-grid'); if(!grid) return;
  if(!DB.productos.length){
    grid.innerHTML=`<tr><td colspan="7" style="text-align:center;padding:32px;color:var(--text3)"><div style="cursor:pointer" onclick="openModal('modal-producto')">Sin productos — <span style="color:var(--ferrari)">+ Agregar</span></div></td></tr>`;
    return;
  }
  const stColors2={ok:'var(--teal)',bajo:'var(--amber)',vacio:'var(--coral)'};
  grid.innerHTML = DB.productos.map(p=>{
    const stock=parseInt(p.stock||0);
    const sc = stock>5?'var(--teal)':stock>0?'var(--amber)':'var(--coral)';
    const arsStr = p.precio ? (window._dolar?`$${Math.round(parseFloat(p.precio)*window._dolar).toLocaleString('es-AR')} ARS / `:'') + `US$${parseFloat(p.precio).toFixed(2)}` : '—';
    const fabInfo = [p.tiempo?`⏱ ${p.tiempo}`:'', p.gramos?`${p.gramos}g`:''].filter(Boolean).join(' · ');
    return `<tr>
      <td><span style="font-family:var(--mono);font-size:11px;color:var(--ferrari);font-weight:700">${p.sku||'—'}</span></td>
      <td>
        <div style="display:flex;align-items:center;gap:8px">
          ${p.imagen?`<img src="${p.imagen}" style="width:32px;height:32px;object-fit:cover;border-radius:6px;flex-shrink:0">`:`<div style="width:32px;height:32px;background:var(--bg3);border-radius:6px;flex-shrink:0;display:flex;align-items:center;justify-content:center;font-size:16px">${p.emoji||'📦'}</div>`}
          <div style="min-width:0;flex:1">
            <strong style="font-size:12px;display:block">${p.nombre}</strong>
            ${p.descripcion?`<span style="font-size:10px;color:var(--text3);display:block;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;max-width:200px">${p.descripcion}</span>`:''}
          </div>
        </div>
      </td>
      <td><span class="badge badge-gray" style="font-size:10px">${p.categoria||'—'}</span></td>
      <td style="font-family:var(--mono);font-size:12px;color:${sc};font-weight:700">${stock}</td>
      <td style="font-size:12px;font-family:var(--mono)">${arsStr}</td>
      <td style="font-size:11px;color:var(--text3);font-family:var(--mono)">${fabInfo||'—'}</td>
      <td>
        <div style="display:flex;gap:4px">
          <button class="btn btn-ghost btn-sm" onclick="editProducto('${p.id}')">Editar</button>
          <button class="btn btn-danger btn-sm" onclick="deleteProducto('${p.id}')">✕</button>
        </div>
      </td>
    </tr>`;
  }).join('');
}


function editProducto(id){
  const p=DB.productos.find(x=>x.id===id); if(!p) return;
  document.getElementById('producto-edit-id').value=p.id;
  document.getElementById('prod-nombre').value=p.nombre;
  document.getElementById('prod-emoji').value=p.emoji;
  document.getElementById('prod-sku').value=p.sku;
  document.getElementById('prod-precio').value=p.precio;
  document.getElementById('prod-stock').value=p.stock;
  document.getElementById('prod-categoria').value=p.categoria;
  document.getElementById('prod-descripcion').value=p.descripcion;
  if(document.getElementById('prod-tiempo')) document.getElementById('prod-tiempo').value=p.tiempo||'';
  if(document.getElementById('prod-gramos')) document.getElementById('prod-gramos').value=p.gramos||'';
  if(document.getElementById('prod-layer')) document.getElementById('prod-layer').value=p.layer||'';
  if(document.getElementById('prod-paredes')) document.getElementById('prod-paredes').value=p.paredes||'';
  if(document.getElementById('prod-relleno')) document.getElementById('prod-relleno').value=p.relleno||'';
  const stlSel=document.getElementById('prod-stl-ref');
  if(stlSel){ stlSel.innerHTML='<option value="">Sin STL vinculado</option>'+DB.piezas.map(pz=>`<option value="${pz.id}" ${p.stlRef===pz.id?'selected':''}>${pz.nombre}</option>`).join(''); }
  const imgValProd = p.imagen||'';
  document.getElementById('prod-imagen').value = imgValProd;
  if(imgValProd){ document.getElementById('prod-img-preview').innerHTML=`<img src="${imgValProd}" style="width:100%;height:100%;object-fit:cover;border-radius:10px">`; }
  else{ resetImgPreview('prod-img-preview','prod-imagen'); }
  openModal('modal-producto');
}

// ════════════════════════════════
// IMPRESORAS
// ════════════════════════════════
function saveImpresora(){
  try{
    const editId=document.getElementById('impresora-edit-id').value;
    const nombre=document.getElementById('imp-nombre').value.trim();
    if(!nombre){ showToast('Ingresá un nombre para la impresora','error'); return; }
    const nextCodImp = ()=>{
      if(!DB.impresoras.length) return 'IMP-001';
      const nums=DB.impresoras.map(i=>parseInt((i.codigo||'IMP-000').split('-')[1]||0)).filter(n=>!isNaN(n));
      return 'IMP-'+String((nums.length?Math.max(...nums):0)+1).padStart(3,'0');
    };
    const obj={
      id:editId||uid(),
      codigo:editId?(DB.impresoras.find(i=>i.id===editId)||{}).codigo||nextCodImp():nextCodImp(),
      nombre,
      marca:document.getElementById('imp-marca').value||'—',
      volumen:document.getElementById('imp-volumen').value||'—',
      tecnologia:document.getElementById('imp-tecnologia').value||'FDM',
      estado:document.getElementById('imp-estado').value||'activa',
      horas:parseInt(document.getElementById('imp-horas').value)||0,
      fecha:document.getElementById('imp-fecha').value||'',
      garantia:document.getElementById('imp-garantia')?.value||'',
      imagen:document.getElementById('imp-imagen').value||'',
      notas:document.getElementById('imp-notas').value||''
    };
    if(editId){ DB.impresoras=DB.impresoras.map(i=>i.id===editId?obj:i); }
    else{ DB.impresoras.push(obj); logActivity(`Impresora <strong>${obj.nombre}</strong> registrada`); }
    persistWithStorage('impresoras', DB.impresoras);
    updateBadges();
    closeModal('modal-impresora');
    document.getElementById('impresora-edit-id').value='';
    clearForm(['imp-nombre','imp-marca','imp-volumen','imp-horas','imp-fecha','imp-notas']);
  document.getElementById('imp-imagen').value='';
  document.getElementById('imp-img-preview').innerHTML='<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="var(--text3)" stroke-width="1.5"><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/></svg><span style="font-size:10px;color:var(--text3);font-family:var(--mono)">Cargar</span>';
    renderSection(currentSection);
    showToast('Impresora guardada ✓');
  } catch(e){
    console.error('saveImpresora error:',e);
    showToast('Error al guardar: '+e.message,'error');
  }
}

function renderImpresoras(){
  const grid=document.getElementById('impresoras-grid'); if(!grid) return;
  if(!DB.impresoras.length){
    grid.innerHTML=`<div class="add-card" style="grid-column:1/-1;min-height:160px;" onclick="openModal('modal-impresora')"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><polyline points="6 9 6 2 18 2 18 9"/><path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"/><rect x="6" y="14" width="12" height="8"/></svg><span>Agregar primera impresora</span></div>`;
    return;
  }
  const stColors={'activa':'var(--teal)','imprimiendo':'var(--accent)','mantenimiento':'var(--amber)','inactiva':'var(--text3)'};
  const stLabels={'activa':'● Activa','imprimiendo':'● Imprimiendo','mantenimiento':'⚠ Mantenimiento','inactiva':'○ Inactiva'};
  grid.innerHTML=DB.impresoras.map(i=>{
    const sc=stColors[i.estado]||'var(--text3)';
    const sl=stLabels[i.estado]||i.estado;
    const imgContent = i.imagen
      ? `<img src="${i.imagen}" style="width:100%;height:100%;object-fit:cover;display:block">`
      : `<div style="width:100%;height:100%;display:flex;align-items:center;justify-content:center;background:var(--bg3)"><svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="var(--text3)" stroke-width="1" opacity="0.3"><polyline points="6 9 6 2 18 2 18 9"/><path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"/><rect x="6" y="14" width="12" height="8"/></svg></div>`;
    return `<div class="printer-card-v2">
      <div class="printer-card-v2-inner">
        <div class="printer-card-v2-img">
          ${imgContent}
          <div class="printer-card-v2-imginfo">
            <div style="font-size:10px;font-family:var(--mono);font-weight:700;color:var(--ferrari);margin-bottom:3px">${i.codigo||'—'}</div>
            <div style="font-size:14px;font-weight:700;color:#fff;line-height:1.2;margin-bottom:6px;text-shadow:0 1px 4px rgba(0,0,0,0.6)">${i.nombre}</div>
            <span style="display:inline-flex;align-items:center;gap:5px;padding:3px 10px;border-radius:20px;font-size:10px;font-weight:700;font-family:var(--mono);background:${sc}44;color:${sc};border:0.5px solid ${sc}88">${sl}</span>
          </div>
        </div>
        <div class="printer-card-v2-body">
          <div style="font-size:11px;color:var(--text3);font-family:var(--mono);margin-bottom:12px">${i.marca} · ${i.tecnologia||'FDM'}</div>
          <div class="printer-specs" style="gap:8px">
            <div class="spec-item"><div class="spec-label">Volumen</div><div class="spec-val" style="font-size:11px">${i.volumen||'—'}</div></div>
            <div class="spec-item"><div class="spec-label">Horas</div><div class="spec-val">${i.horas||0}h</div></div>
            <div class="spec-item"><div class="spec-label">Adquirida</div><div class="spec-val" style="font-size:10px">${i.fecha||'—'}</div></div>
            <div class="spec-item"><div class="spec-label">Garantía</div><div class="spec-val" style="font-size:10px;color:${i.garantia?(Math.ceil((new Date(i.garantia)-new Date())/86400000)>60?'var(--teal)':Math.ceil((new Date(i.garantia)-new Date())/86400000)>0?'var(--amber)':'var(--ferrari)'):'var(--text3)'}">
              ${i.garantia?(Math.ceil((new Date(i.garantia)-new Date())/86400000)>0?Math.ceil((new Date(i.garantia)-new Date())/86400000)+' días restantes':'Vencida'):'—'}
            </div></div>
            <div class="spec-item"><div class="spec-label">Tipo</div><div class="spec-val" style="font-size:11px">${i.tecnologia||'FDM'}</div></div>
          </div>
          ${i.notas?`<div style="margin-top:10px;font-size:10px;color:var(--text3);font-family:var(--mono);background:var(--bg3);padding:8px 10px;border-radius:7px;line-height:1.5;max-height:56px;overflow:hidden;position:relative">${i.notas}</div>`:''}
          <div style="margin-top:12px;display:flex;gap:8px">
            <button class="btn btn-ghost btn-sm" onclick="editImpresora('${i.id}')">Editar</button>
            <button class="btn btn-danger btn-sm" onclick="deleteImpresora('${i.id}')">Eliminar</button>
          </div>
        </div>
      </div>
    </div>`;
  }).join('')+`<div class="add-card" onclick="openModal('modal-impresora')" style="min-height:160px;"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="16"/><line x1="8" y1="12" x2="16" y2="12"/></svg><span>Agregar impresora</span></div>`;
  updateSidebarPrinterSelect();
}


function openImpresora(){
  document.getElementById('impresora-edit-id').value='';
  document.getElementById('imp-modal-title').textContent='Agregar impresora';
  clearForm(['imp-nombre','imp-marca','imp-volumen','imp-horas','imp-fecha','imp-notas','imp-garantia']);
  document.getElementById('imp-garantia-dias').textContent='';
  document.getElementById('imp-imagen').value='';
  const prev=document.getElementById('imp-img-preview');
  if(prev) prev.innerHTML='<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="var(--text3)" stroke-width="1.5"><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/></svg><span style="font-size:10px;color:var(--text3);font-family:var(--mono)">Cargar</span>';
  document.getElementById('imp-estado').value='activa';
  document.getElementById('imp-tecnologia').value='FDM';
  openModal('modal-impresora');
}
function editImpresora(id){
  const i=DB.impresoras.find(x=>x.id===id); if(!i) return;
  document.getElementById('impresora-edit-id').value=i.id;
  document.getElementById('imp-modal-title').textContent='Editar impresora';
  document.getElementById('imp-nombre').value=i.nombre;
  document.getElementById('imp-marca').value=i.marca==='—'?'':i.marca;
  document.getElementById('imp-volumen').value=i.volumen==='—'?'':i.volumen;
  document.getElementById('imp-estado').value=i.estado||'activa';
  document.getElementById('imp-horas').value=i.horas||0;
  document.getElementById('imp-fecha').value=i.fecha||'';
  document.getElementById('imp-tecnologia').value=i.tecnologia||'FDM';
  document.getElementById('imp-notas').value=i.notas||'';
  if(document.getElementById('imp-garantia')) {
    document.getElementById('imp-garantia').value=i.garantia||'';
    if(i.garantia) calcImpGarantiaFromValue(i.garantia);
  }
  document.getElementById('imp-imagen').value=i.imagen||'';
  document.getElementById('imp-codigo').value=i.codigo||'';
  document.getElementById('imp-codigo-display').textContent=i.codigo||'IMP-???';
  if(i.imagen){
    const prev=document.getElementById('imp-img-preview');
    prev.innerHTML='<img src="'+i.imagen+'" style="width:100%;height:100%;object-fit:cover;border-radius:10px">';
  }
  openModal('modal-impresora');
}
function deleteImpresora(id){
  if(!confirm('¿Eliminar esta impresora?')) return;
  DB.impresoras=DB.impresoras.filter(i=>i.id!==id);
  persist(KEYS.impresoras); updateBadges(); renderSection(currentSection);
  updateSidebarPrinterSelect();
}

// ════════════════════════════════
// COLA
// ════════════════════════════════
function onColaProyectoChange(proyId){
  const sec = document.getElementById('cola-stl-section');
  const list = document.getElementById('cola-stl-list');
  if(!sec || !list) return;
  const proy = DB.proyectos.find(p=>p.id===proyId);
  if(!proy || !proy.insumos) { sec.style.display='none'; return; }
  const stlInsumos = proy.insumos.filter(i=>i.tipo==='stl');
  if(!stlInsumos.length){ sec.style.display='none'; return; }
  sec.style.display='block';
  list.innerHTML = stlInsumos.map(ins=>{
    const pieza = DB.piezas.find(p=>p.id===ins.refId);
    const nombre = pieza ? pieza.nombre : ins.nombre||'STL sin nombre';
    const tiempo = pieza ? pieza.tiempo||'—' : '—';
    const boquilla = pieza ? pieza.boquilla||'' : '';
    const mats = pieza && pieza.insumos ? pieza.insumos.filter(x=>x.tipo==='material').map(x=>x.nombre).join(', ') : '';
    return `<div style="display:flex;align-items:center;gap:8px;padding:7px 0;border-bottom:0.5px solid var(--border)">
      <div style="font-size:12px;flex:1">
        <div style="font-weight:600;color:var(--text)">${nombre}</div>
        <div style="font-size:10px;color:var(--text3);font-family:var(--mono)">⏱ ${tiempo}${boquilla?' · '+boquilla:''}${mats?' · '+mats:''}</div>
      </div>
      <span style="font-size:9px;color:var(--text3);font-family:var(--mono)">${ins.cantidad>1?'×'+ins.cantidad:''}</span>
    </div>`;
  }).join('') || '<div style="font-size:11px;color:var(--text3)">Sin STLs registrados en el proyecto</div>';
  // Auto-fill time from project
  if(proy.tiempoAutoSTL && !document.getElementById('cola-tiempo').value){
    document.getElementById('cola-tiempo').value = proy.tiempoAutoSTL;
  }
  // Unified layer: most common layer among STLs (or smallest)
  const layers = stlInsumos.map(i=>{const p=DB.piezas.find(x=>x.id===i.refId);return p&&p.layer?parseFloat(p.layer):0;}).filter(l=>l>0);
  if(layers.length){
    const unified = Math.min(...layers);
    const lu = document.getElementById('cola-layer-unified');
    if(lu && !lu.value) { lu.value=unified; document.getElementById('cola-layer').value=unified; }
  }
}

function saveCola(){
  const proyId = document.getElementById('cola-proyecto').value;
  const proy = DB.proyectos.find(p=>p.id===proyId);
  // Build STL list snapshot from project
  const stlList = proy ? (proy.insumos||[]).filter(i=>i.tipo==='stl').map(i=>{
    const pieza = DB.piezas.find(p=>p.id===i.refId);
    return { refId:i.refId, nombre:pieza?pieza.nombre:i.nombre||'', cantidad:i.cantidad||1, impreso:false };
  }) : [];
  const obj={
    id:uid(),
    nombre:document.getElementById('cola-nombre').value.trim(),
    proyectoId:proyId,
    stlList,
    tiempo:document.getElementById('cola-tiempo').value,
    layer:document.getElementById('cola-layer').value,
    prioridad:document.getElementById('cola-prioridad').value,
    fecha:new Date().toISOString()
  };
  if(!obj.nombre){ showToast('Ingresá un nombre','error'); return; }
  DB.cola.push(obj); persist(KEYS.cola); updateBadges(); closeModal('modal-cola');
  clearForm(['cola-nombre','cola-tiempo','cola-layer']);
  logActivity(`Pieza <strong>${obj.nombre}</strong> agregada a la cola`);
  renderSection(currentSection); showToast('Agregado a la cola ✓');
}

function toggleColaSTL(colaId, stlIdx){
  const item = DB.cola.find(c=>c.id===colaId); if(!item||!item.stlList) return;
  item.stlList[stlIdx].impreso = !item.stlList[stlIdx].impreso;
  persist(KEYS.cola);
  renderSection(currentSection);
}

function deleteCola(id){
  DB.cola=DB.cola.filter(c=>c.id!==id);
  persist(KEYS.cola); updateBadges(); renderSection(currentSection);
}

function renderCola(){
  const list=document.getElementById('cola-list'); if(!list) return;
  if(!DB.cola.length){
    list.innerHTML=`<div class="empty-state"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><line x1="8" y1="6" x2="21" y2="6"/><line x1="8" y1="12" x2="21" y2="12"/><line x1="8" y1="18" x2="21" y2="18"/></svg><p>Cola vacía</p></div>`;
    return;
  }
  const priColors={normal:'var(--text3)',alta:'var(--amber)',urgente:'var(--coral)'};
  list.innerHTML=DB.cola.map((c,i)=>{
    const proy=DB.proyectos.find(p=>p.id===c.proyectoId);
    const pc=priColors[c.prioridad]||'var(--text3)';
    const stlList = c.stlList||[];
    const stlDone = stlList.filter(s=>s.impreso).length;
    const stlTotal = stlList.length;
    const stlPct = stlTotal > 0 ? Math.round(stlDone/stlTotal*100) : null;

    const stlHtml = stlList.length ? `
      <div style="margin-top:8px;background:var(--bg3);border-radius:8px;padding:8px 10px">
        <div style="font-size:10px;color:var(--text3);font-family:var(--mono);margin-bottom:6px;display:flex;justify-content:space-between">
          <span>STLs a imprimir</span>
          <span style="color:${stlDone===stlTotal?'var(--teal)':'var(--text3)'}">
            ${stlDone}/${stlTotal} listos
          </span>
        </div>
        ${stlList.map((s,idx)=>`
          <div style="display:flex;align-items:center;gap:8px;padding:4px 0;cursor:pointer" onclick="toggleColaSTL('${c.id}',${idx})">
            <div style="width:16px;height:16px;border-radius:4px;border:1.5px solid ${s.impreso?'var(--teal)':'var(--border2)'};
              background:${s.impreso?'var(--teal)':'transparent'};flex-shrink:0;display:flex;align-items:center;justify-content:center">
              ${s.impreso?'<svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="3"><polyline points="20 6 9 17 4 12"/></svg>':''}
            </div>
            <span style="font-size:12px;color:var(--text);${s.impreso?'text-decoration:line-through;opacity:0.5':''}">
              ${s.nombre||'STL'}${s.cantidad>1?' ×'+s.cantidad:''}
            </span>
          </div>`).join('')}
        ${stlPct!==null?`<div style="margin-top:6px;height:3px;background:var(--border);border-radius:2px">
          <div style="height:100%;width:${stlPct}%;background:var(--teal);border-radius:2px;transition:width 0.3s"></div>
        </div>`:''}
      </div>` : '';

    return `<div class="queue-item" style="flex-direction:column;align-items:stretch;gap:6px">
      <div style="display:flex;align-items:center;gap:10px">
        <div class="queue-num" style="color:${pc}">${String(i+1).padStart(2,'0')}</div>
        <div style="flex:1">
          <div class="queue-name">${c.nombre}</div>
          <div class="queue-meta">${proy?'📁 '+proy.nombre:'Marcano Tech'} ${c.layer?'· '+c.layer+'mm':''}</div>
        </div>
        <span class="badge" style="font-size:9px;background:${pc}22;color:${pc}">${c.prioridad}</span>
        <div class="queue-time">${c.tiempo||'—'}</div>
        <button class="btn btn-danger btn-sm" onclick="deleteCola('${c.id}')">✕</button>
      </div>
      ${stlHtml}
    </div>`;
  }).join('');
}


// ════════════════════════════════
// PIEZAS
// ════════════════════════════════
// ════════════════════════════════
// PIEZAS / ARCHIVOS STL
// ════════════════════════════════
let _piezaInsumos = [];

function addPiezaInsumo(){
  _piezaInsumos.push({id:uid(), tipo:'material', refId:'', nombre:'Marcano Tech', cantidad:1, unidad:'g'});
  renderPiezaInsumos();
}

function renderPiezaInsumos(){
  const cont = document.getElementById('pieza-insumos-container');
  const empty = document.getElementById('pieza-insumos-empty');
  if(!cont) return;
  if(empty) empty.style.display = _piezaInsumos.length ? 'none' : 'block';
  if(!_piezaInsumos.length){ cont.innerHTML=''; return; }
  cont.innerHTML = _piezaInsumos.map((ins,i)=>{
    const opts = getInsumoOptions(ins.tipo);
    const optHtml = opts.length
      ? '<option value="">Seleccionar...</option>'+opts.map(o=>`<option value="${o.id}" ${ins.refId===o.id?'selected':''}>${o.label.substring(0,38)}${o.label.length>38?'...':''}</option>`).join('')
      : '<option value="">Sin registros</option>';
    return `<div style="background:var(--bg2);border-radius:var(--r);border:0.5px solid var(--border);padding:8px 10px;margin-bottom:6px;display:flex;gap:8px;align-items:center;flex-wrap:wrap">
      <select style="font-size:11px;background:var(--bg3);border:0.5px solid var(--border2);border-radius:6px;padding:4px 8px;color:var(--text);font-family:var(--font);cursor:pointer"
        onchange="_piezaInsumos[${i}].tipo=this.value;_piezaInsumos[${i}].refId='';renderPiezaInsumos()">
        <option value="material" ${ins.tipo==='material'?'selected':''}>⬡ Material</option>
        <option value="accesorio" ${ins.tipo==='accesorio'?'selected':''}>🔩 Accesorio</option>
        <option value="componente" ${ins.tipo==='componente'?'selected':''}>⚡ Componente</option>
        <option value="stl" ${ins.tipo==='stl'?'selected':''}>🖨️ Archivo STL</option>
        <option value="libre" ${ins.tipo==='libre'?'selected':''}>✏️ Libre</option>
      </select>
      ${ins.tipo==='libre'
        ? `<input class="form-input" style="flex:1;font-size:12px;min-width:120px" placeholder="Nombre" value="${ins.nombre||''}" oninput="_piezaInsumos[${i}].nombre=this.value">`
        : `<select class="form-input" style="flex:1;font-size:12px;min-width:120px" onchange="_piezaInsumos[${i}].refId=this.value;const o=getInsumoOptions('${ins.tipo}').find(x=>x.id===this.value);if(o){_piezaInsumos[${i}].nombre=o.label;_piezaInsumos[${i}].unidad=o.unidad||'Und';}">${optHtml}</select>`}
      <button onclick="_piezaInsumos.splice(${i},1);renderPiezaInsumos()" style="background:rgba(249,115,22,0.1);border:none;border-radius:6px;padding:4px 8px;color:var(--ferrari);cursor:pointer;font-size:12px;flex-shrink:0">✕</button>
    </div>`;
  }).join('');
}

function openPiezaModal(editId=''){
  _piezaInsumos=[];
  document.getElementById('pieza-edit-id').value='';
  document.getElementById('pieza-modal-title').textContent='Registrar Archivo STL';
  document.getElementById('pieza-save-btn').textContent='Guardar STL';
  clearForm(['pieza-nombre','pieza-codigo','pieza-tiempo','pieza-notas','pieza-url']);
  document.getElementById('pieza-escala').value='1:10';
  document.getElementById('pieza-boquilla').value='0.4mm';
  document.getElementById('pieza-gramos').value='';
  document.getElementById('pieza-placas').value='1';
  resetImgPreview('pieza-img-preview','pieza-imagen');
  renderPiezaInsumos();
  openModal('modal-pieza');
}

function savePieza(){
  const editId = document.getElementById('pieza-edit-id').value;
  const nombre = document.getElementById('pieza-nombre').value.trim();
  if(!nombre){ showToast('Ingresá un nombre','error'); return; }
  const obj={
    id: editId||uid(),
    nombre,
    codigo:   document.getElementById('pieza-codigo').value||'',
    escala:   document.getElementById('pieza-escala').value||'1:10',
    boquilla: document.getElementById('pieza-boquilla').value||'0.4mm',
    tiempo:   document.getElementById('pieza-tiempo').value||'',
    gramos:   parseFloat(document.getElementById('pieza-gramos').value)||0,
    placas:   parseInt(document.getElementById('pieza-placas').value)||1,
    url:      document.getElementById('pieza-url').value||'',
    notas:    document.getElementById('pieza-notas').value||'',
    layer:    parseFloat(document.getElementById('pieza-layer')?.value)||0,
    imagen:   document.getElementById('pieza-imagen').value||'',
    insumos:  _piezaInsumos.map(i=>({...i})),
    fecha:    new Date().toISOString()
  };
  if(editId){ DB.piezas=DB.piezas.map(p=>p.id===editId?obj:p); }
  else{ DB.piezas.push(obj); logActivity(`Archivo STL <strong>${obj.nombre}</strong> registrado`); }
  persist(KEYS.piezas); updateBadges(); closeModal('modal-pieza');
  renderSection(currentSection); showToast('STL guardado ✓');
}

function deletePieza(id){
  if(!confirm('¿Eliminar este archivo STL?')) return;
  DB.piezas=DB.piezas.filter(p=>p.id!==id);
  persist(KEYS.piezas); updateBadges(); renderSection(currentSection);
}

function editPieza(id){
  const p=DB.piezas.find(x=>x.id===id); if(!p) return;
  openPiezaModal(id);
  document.getElementById('pieza-edit-id').value=p.id;
  document.getElementById('pieza-modal-title').textContent='Editar Archivo STL';
  document.getElementById('pieza-save-btn').textContent='Guardar cambios';
  document.getElementById('pieza-nombre').value=p.nombre||'';
  document.getElementById('pieza-codigo').value=p.codigo||'';
  document.getElementById('pieza-escala').value=p.escala||'1:10';
  document.getElementById('pieza-boquilla').value=p.boquilla||'0.4mm';
  document.getElementById('pieza-tiempo').value=p.tiempo||'';
  document.getElementById('pieza-gramos').value=p.gramos||'';
  document.getElementById('pieza-placas').value=p.placas||1;
  document.getElementById('pieza-url').value=p.url||'';
  if(document.getElementById('pieza-layer')) document.getElementById('pieza-layer').value=p.layer||'';
  document.getElementById('pieza-notas').value=p.notas||'';
  const imgVal=p.imagen||'';
  document.getElementById('pieza-imagen').value=imgVal;
  if(imgVal) document.getElementById('pieza-img-preview').innerHTML=`<img src="${imgVal}" style="width:100%;height:100%;object-fit:cover;border-radius:10px">`;
  _piezaInsumos=(p.insumos||[]).map(i=>({...i}));
  renderPiezaInsumos();
}

function renderPiezas(){
  const sr=document.getElementById('piezas-stats-row');
  if(sr){
    const escalas=['1:8','1:10','1:12','1:18','1:24','Otro'];
    const total=DB.piezas.length;
    sr.innerHTML=`<div class="stat-card"><div class="stat-label">Total STL</div><div class="stat-value">${total}</div><div class="stat-delta neutral">registrados</div></div>`+
      escalas.map(e=>{const n=DB.piezas.filter(p=>(p.escala||'1:10')===e).length;return n>0?`<div class="stat-card"><div class="stat-label">Escala ${e}</div><div class="stat-value">${n}</div><div class="stat-delta neutral">archivos</div></div>`:''}).join('');
  }
  const tbody=document.getElementById('piezas-tbody'); if(!tbody) return;
  if(!DB.piezas.length){
    tbody.innerHTML=`<tr><td colspan="6" style="text-align:center;color:var(--text3);padding:24px;font-family:var(--mono);font-size:12px">Sin archivos STL registrados</td></tr>`;
    return;
  }
  tbody.innerHTML=DB.piezas.map(p=>`<tr>
    <td>
      <div style="display:flex;align-items:center;gap:8px">
        ${p.imagen?`<img src="${p.imagen}" style="width:32px;height:32px;object-fit:cover;border-radius:6px;flex-shrink:0">`:`<div style="width:32px;height:32px;background:var(--bg3);border-radius:6px;display:flex;align-items:center;justify-content:center;font-size:16px">🖨️</div>`}
        <div>
          <strong>${p.nombre}</strong>
          ${p.codigo?`<div style="font-size:10px;color:var(--ferrari);font-family:var(--mono)">${p.codigo}</div>`:''}
        </div>
      </div>
    </td>
    <td class="mono" style="font-size:12px">${p.escala||'1:10'}</td>
    <td class="mono" style="font-size:12px">${p.boquilla||'0.4mm'}</td>
    <td class="mono" style="font-size:12px">${p.tiempo||'—'}${p.gramos?` · ${p.gramos}g`:''}${p.placas>1?` · ${p.placas}x`:''}</td>
    <td style="font-size:12px">
      ${(p.insumos||[]).length?`<span style="font-size:10px;color:var(--text3);font-family:var(--mono)">${p.insumos.length} material${p.insumos.length>1?'es':''}</span>`:'—'}
      ${p.url?`<a href="${p.url}" target="_blank" style="display:block;font-size:10px;color:var(--blue);font-family:var(--mono);text-decoration:none;margin-top:2px">🔗 Descargar</a>`:''}
    </td>
    <td>
      <div style="display:flex;gap:4px">
        <button class="btn btn-ghost btn-sm" onclick="editPieza('${p.id}')">Editar</button>
        <button class="btn btn-danger btn-sm" onclick="deletePieza('${p.id}')">✕</button>
      </div>
    </td>
  </tr>`).join('');
}



// ════════════════════════════════
// MANTENIMIENTO
// ════════════════════════════════
function saveMantenimiento(){
  const obj={
    id:uid(),
    tarea:document.getElementById('mant-tarea').value.trim(),
    impresoraId:document.getElementById('mant-impresora').value,
    tipo:document.getElementById('mant-tipo').value,
    fecha:document.getElementById('mant-fecha').value,
    estado:document.getElementById('mant-estado').value,
    notas:document.getElementById('mant-notas').value
  };
  if(!obj.tarea){ showToast('Ingresá una tarea','error'); return; }
  DB.mantenimiento.push(obj); persist(KEYS.mantenimiento); closeModal('modal-mantenimiento');
  clearForm(['mant-tarea','mant-notas']);
  logActivity(`Mantenimiento: <strong>${obj.tarea}</strong> programado`,'info');
  renderSection(currentSection); showToast('Tarea de mantenimiento guardada ✓');
  checkMantPending();
}

function checkMantPending(){
  const pending=DB.mantenimiento.filter(m=>m.estado==='pendiente'||m.estado==='vencido');
  document.getElementById('notif-dot').style.display=pending.length?'':'none';
}

function deleteMantenimiento(id){
  DB.mantenimiento=DB.mantenimiento.filter(m=>m.id!==id);
  persist(KEYS.mantenimiento); renderSection(currentSection); checkMantPending();
}

function completarMantenimiento(id){
  DB.mantenimiento=DB.mantenimiento.map(m=>m.id===id?{...m,estado:'completado'}:m);
  persist(KEYS.mantenimiento); renderSection(currentSection); checkMantPending();
  showToast('Tarea completada ✓');
}

function toggleMantGuide(){
  const el = document.getElementById('mant-guide');
  const arrow = document.getElementById('mant-guide-arrow');
  if(!el) return;
  const isOpen = el.style.display !== 'none';
  el.style.display = isOpen ? 'none' : 'block';
  if(arrow) arrow.style.transform = isOpen ? '' : 'rotate(180deg)';
  if(!isOpen) renderMantGuide();
}

function renderMantenimiento(){
  const list=document.getElementById('mantenimiento-list'); if(!list) return;
  if(!DB.mantenimiento.length){
    list.innerHTML=`<div class="empty-state"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"/></svg><p>Sin tareas de mantenimiento</p></div>`;
    return;
  }
  const stMap={pendiente:{l:'pendiente',c:'var(--amber)'},completado:{l:'completado',c:'var(--teal)'},vencido:{l:'vencido',c:'var(--coral)'}};
  list.innerHTML=DB.mantenimiento.map(m=>{
    const imp=DB.impresoras.find(i=>i.id===m.impresoraId);
    const st=stMap[m.estado]||{l:m.estado,c:'var(--text3)'};
    return `<div class="maint-card">
      <div class="maint-header">
        <div>
          <div class="maint-title">${m.tarea}</div>
          <div class="maint-meta">${m.tipo} · ${imp?imp.nombre:'Marcano Tech'} · ${m.fecha||'sin fecha'}</div>
        </div>
        <span class="badge" style="background:${st.c}22;color:${st.c}">${st.l}</span>
      </div>
      ${m.notas?`<div style="font-size:11px;color:var(--text3);font-family:var(--mono);margin-bottom:8px">${m.notas}</div>`:''}
      <div style="display:flex;gap:8px">
        ${m.estado!=='completado'?`<button class="btn btn-accent btn-sm" onclick="completarMantenimiento('${m.id}')">Marcar completado</button>`:''}
        <button class="btn btn-danger btn-sm" onclick="deleteMantenimiento('${m.id}')">Eliminar</button>
      </div>
    </div>`;
  }).join('');
}

// ════════════════════════════════
// COSTOS
// ════════════════════════════════
// ════════════════════════════════
// CALCULADORA DE COSTOS v2
// ════════════════════════════════
let _calcMoneda = 'ARS';
let _calcFilamentos = [{id:'f1', matId:'', precioPorKg:0, gramos:0}];
let _calcGananciaMode = 'multiplicador';
let _calcDisenoMode = 'fijo';
let _calcPostpMode = 'fijo';
let _calcPerfiles = JSON.parse(localStorage.getItem('calc_perfiles')||'[]');

const MONEDA_SIMBOLO = {ARS:'ARS $', USD:'US$', EUR:'€'};

function setCalcMoneda(m){
  _calcMoneda = m;
  document.querySelectorAll('.calc-currency-btn').forEach(b=>b.classList.remove('active'));
  document.getElementById('calc-cur-'+m).classList.add('active');
  recalcularCosto();
}

function setCalcToggle(tipo, modo){
  if(tipo==='ganancia'){
    _calcGananciaMode = modo;
    document.getElementById('calc-gan-mult-btn').classList.toggle('active', modo==='multiplicador');
    document.getElementById('calc-gan-pct-btn').classList.toggle('active', modo==='porcentaje');
    document.getElementById('calc-gan-mult-wrap').style.display = modo==='multiplicador'?'':'none';
    document.getElementById('calc-gan-pct-wrap').style.display = modo==='porcentaje'?'':'none';
  } else if(tipo==='diseno'){
    _calcDisenoMode = modo;
    document.getElementById('calc-diseno-fijo-btn').classList.toggle('active', modo==='fijo');
    document.getElementById('calc-diseno-hora-btn').classList.toggle('active', modo==='hora');
    document.getElementById('calc-diseno-fijo-wrap').style.display = modo==='fijo'?'':'none';
    document.getElementById('calc-diseno-hora-wrap').style.display = modo==='hora'?'':'none';
  } else if(tipo==='postp'){
    _calcPostpMode = modo;
    document.getElementById('calc-postp-fijo-btn').classList.toggle('active', modo==='fijo');
    document.getElementById('calc-postp-hora-btn').classList.toggle('active', modo==='hora');
    document.getElementById('calc-postp-fijo-wrap').style.display = modo==='fijo'?'':'none';
    document.getElementById('calc-postp-hora-wrap').style.display = modo==='hora'?'':'none';
  }
  recalcularCosto();
}

function setCalcMultiplicador(val){
  document.querySelectorAll('.calc-preset-btn').forEach(b=>b.classList.remove('active'));
  if(val==='custom'){
    document.getElementById('calc-mult-custom-btn').classList.add('active');
    document.getElementById('calc-multiplicador').focus();
  } else {
    document.querySelectorAll('.calc-preset-btn').forEach(b=>{ if(b.textContent.includes('x'+val)) b.classList.add('active'); });
    document.getElementById('calc-multiplicador').value = val;
  }
  recalcularCosto();
}

// ── Filamentos dinámicos ──
function addCalcFilamento(){
  _calcFilamentos.push({id:'f'+Date.now(), matId:'', precioPorKg:0, gramos:0});
  renderCalcFilamentos();
}

function removeCalcFilamento(idx){
  _calcFilamentos.splice(idx,1);
  renderCalcFilamentos();
  recalcularCosto();
}

function renderCalcFilamentos(){
  const cont = document.getElementById('calc-filamentos-container'); if(!cont) return;
  const matOptions = '<option value="">Usar filamento guardado...</option>' +
    DB.materiales.map(m=>`<option value="${m.id}" data-precio="${m.precio||0}">${m.tipo} ${m.color} — ${m.marca} ($${m.precio||0}/kg)</option>`).join('');
  cont.innerHTML = _calcFilamentos.map((f,i)=>`
    <div class="calc-filamento-row">
      <div style="font-size:11px;color:var(--text3);font-family:var(--mono);margin-bottom:8px">Filamento ${i+1}</div>
      <select class="form-input" style="margin-bottom:8px" onchange="onCalcMatChange(${i},this)">
        ${matOptions.replace(`value="${f.matId}"`, `value="${f.matId}" selected`)}
      </select>
      <div class="form-row" style="margin-bottom:0">
        <div class="form-group" style="margin-bottom:0">
          <label class="form-label">Precio/KG</label>
          <input class="form-input" type="number" value="${f.precioPorKg||''}" placeholder="0" step="0.01" oninput="_calcFilamentos[${i}].precioPorKg=parseFloat(this.value)||0;recalcularCosto()">
        </div>
        <div class="form-group" style="margin-bottom:0">
          <label class="form-label">Gramos</label>
          <input class="form-input" type="number" value="${f.gramos||''}" placeholder="0" step="1" oninput="_calcFilamentos[${i}].gramos=parseFloat(this.value)||0;recalcularCosto()">
        </div>
        ${_calcFilamentos.length>1?`<button onclick="removeCalcFilamento(${i})" style="background:none;border:none;color:var(--coral);cursor:pointer;padding:0 4px;font-size:18px;align-self:flex-end;padding-bottom:6px">✕</button>`:''}
      </div>
    </div>`).join('');
}

function onCalcMatChange(idx, sel){
  const opt = sel.options[sel.selectedIndex];
  const precio = parseFloat(opt.dataset.precio)||0;
  _calcFilamentos[idx].matId = sel.value;
  _calcFilamentos[idx].precioPorKg = precio;
  renderCalcFilamentos();
  recalcularCosto();
}

// ── Main calculation ──
function recalcularCosto(){
  const kwh = parseFloat(document.getElementById('calc-kwh-nuevo')?.value)||0;
  const watts = parseFloat(document.getElementById('calc-watts')?.value)||120;
  const vidaUtil = parseFloat(document.getElementById('calc-vida-util')?.value)||5000;
  const repuestos = parseFloat(document.getElementById('calc-repuestos')?.value)||0;
  const margenError = parseFloat(document.getElementById('calc-margen-error')?.value)||0;
  const horas = parseFloat(document.getElementById('calc-horas-nuevo')?.value)||0;
  const mins = parseFloat(document.getElementById('calc-minutos-nuevo')?.value)||0;
  const tiempoH = horas + mins/60;
  const insumos = parseFloat(document.getElementById('calc-insumos')?.value)||0;
  const comisionPct = parseFloat(document.getElementById('calc-comision')?.value)||0;

  // Material cost
  const costMaterial = _calcFilamentos.reduce((a,f)=>a + (f.precioPorKg/1000)*(f.gramos||0), 0);

  // Electricity cost
  const kwhUsados = (watts/1000)*tiempoH;
  const costElec = kwhUsados * kwh;

  // Machine wear cost per hour
  const costDesgaste = vidaUtil>0 ? (repuestos/vidaUtil)*tiempoH : 0;

  // Base costs
  const costoBase = costMaterial + costElec + costDesgaste;

  // Additional costs
  const costMargenError = costoBase * (margenError/100);
  const costInsumos = insumos;

  // Diseño
  let costDiseno = 0;
  if(_calcDisenoMode==='fijo'){
    costDiseno = parseFloat(document.getElementById('calc-diseno-fijo')?.value)||0;
  } else {
    const ph = parseFloat(document.getElementById('calc-diseno-precio-hora')?.value)||0;
    const hd = parseFloat(document.getElementById('calc-diseno-horas')?.value)||0;
    costDiseno = ph*hd;
  }

  // Posprocesado
  let costPostp = 0;
  if(_calcPostpMode==='fijo'){
    costPostp = parseFloat(document.getElementById('calc-postp-fijo')?.value)||0;
  } else {
    const pp = parseFloat(document.getElementById('calc-postp-precio-hora')?.value)||0;
    const hp = parseFloat(document.getElementById('calc-postp-horas')?.value)||0;
    costPostp = pp*hp;
  }

  const costProduccion = costDiseno + costPostp;
  const totalCostos = costoBase + costMargenError + costProduccion + costInsumos;

  // Ganancia
  let precioFinal = 0;
  if(_calcGananciaMode==='multiplicador'){
    const mult = parseFloat(document.getElementById('calc-multiplicador')?.value)||3;
    precioFinal = totalCostos * mult;
  } else {
    const pct = parseFloat(document.getElementById('calc-ganancia-pct')?.value)||40;
    precioFinal = totalCostos * (1 + pct/100);
  }

  // With external commission
  const precioConComision = comisionPct>0 ? precioFinal/(1-comisionPct/100) : precioFinal;

  // Format number
  const fmt = n => {
    const sym = MONEDA_SIMBOLO[_calcMoneda]||'$';
    if(_calcMoneda==='ARS') return `${sym} ${n.toLocaleString('es-AR',{minimumFractionDigits:2,maximumFractionDigits:2})}`;
    return `${sym} ${n.toFixed(2)}`;
  };

  // Alt currency
  const fmtAlt = n => {
    if(!_dolarRate) return '';
    if(_calcMoneda==='ARS') return `≈ US$ ${(n/_dolarRate).toFixed(2)}`;
    if(_calcMoneda==='USD') return `≈ ARS $ ${Math.round(n*_dolarRate).toLocaleString('es-AR')}`;
    return '';
  };

  // Render base
  const baseEl = document.getElementById('calc-result-base');
  if(baseEl) baseEl.innerHTML = `
    <div class="calc-result-row"><span class="label">⬡ Material</span><span class="val">${fmt(costMaterial)}</span></div>
    <div class="calc-result-row"><span class="label">⚡ Electricidad</span><span class="val">${fmt(costElec)}</span></div>
    <div class="calc-result-row"><span class="label">🔧 Desgaste</span><span class="val">${fmt(costDesgaste)}</span></div>`;

  // Render adicional
  const adicEl = document.getElementById('calc-result-adicional');
  if(adicEl) adicEl.innerHTML = `
    <div class="calc-result-row"><span class="label">Margen Error (${margenError}%)</span><span class="val">${fmt(costMargenError)}</span></div>
    <div class="calc-result-row"><span class="label">Costo Producción</span><span class="val">${fmt(costProduccion)}</span></div>
    <div class="calc-result-row"><span class="label">Insumos (fijo)</span><span class="val">${fmt(costInsumos)}</span></div>
    <div class="calc-result-row" style="padding-top:8px;border-top:0.5px solid var(--border2);margin-top:4px"><span class="label" style="font-weight:700;color:var(--text)">Total Costos</span><span class="val" style="font-weight:700;color:var(--text)">${fmt(totalCostos)}</span></div>`;

  // Final price
  const totalEl = document.getElementById('calc-total-final');
  const altEl = document.getElementById('calc-total-alt');
  if(totalEl) totalEl.textContent = fmt(precioFinal);
  if(altEl) altEl.textContent = fmtAlt(precioFinal);

  // Commission
  const comDisp = document.getElementById('calc-comision-display');
  const comLabel = document.getElementById('calc-comision-label');
  const comTotal = document.getElementById('calc-total-comision');
  if(comDisp){
    comDisp.style.display = comisionPct>0?'block':'none';
    if(comLabel) comLabel.textContent = `Precio con comisión (+${comisionPct}%)`;
    if(comTotal) comTotal.textContent = fmt(precioConComision);
  }
}

// ── Perfiles ──
function guardarPerfilCalc(){
  const nombre = document.getElementById('calc-perfil-nombre')?.value?.trim();
  if(!nombre){ showToast('Ingresá un nombre para el perfil','error'); return; }
  const perfil = {
    id: uid(), nombre,
    kwh: document.getElementById('calc-kwh-nuevo')?.value,
    watts: document.getElementById('calc-watts')?.value,
    vidaUtil: document.getElementById('calc-vida-util')?.value,
    repuestos: document.getElementById('calc-repuestos')?.value,
    margenError: document.getElementById('calc-margen-error')?.value,
    gananciaMode: _calcGananciaMode,
    multiplicador: document.getElementById('calc-multiplicador')?.value,
    gananciaPct: document.getElementById('calc-ganancia-pct')?.value,
    comision: document.getElementById('calc-comision')?.value,
    moneda: _calcMoneda
  };
  _calcPerfiles = _calcPerfiles.filter(p=>p.nombre!==nombre);
  _calcPerfiles.push(perfil);
  localStorage.setItem('calc_perfiles', JSON.stringify(_calcPerfiles));
  renderCalcPerfiles();
  showToast(`Perfil "${nombre}" guardado ✓`);
}

function cargarPerfilCalc(id){
  const p = _calcPerfiles.find(x=>x.id===id); if(!p) return;
  const set = (elId, val)=>{ const el=document.getElementById(elId); if(el&&val!==undefined) el.value=val; };
  set('calc-kwh-nuevo', p.kwh);
  set('calc-watts', p.watts);
  set('calc-vida-util', p.vidaUtil);
  set('calc-repuestos', p.repuestos);
  set('calc-margen-error', p.margenError);
  set('calc-multiplicador', p.multiplicador);
  set('calc-ganancia-pct', p.gananciaPct);
  set('calc-comision', p.comision);
  if(p.moneda) setCalcMoneda(p.moneda);
  if(p.gananciaMode) setCalcToggle('ganancia', p.gananciaMode);
  recalcularCosto();
  showToast(`Perfil "${p.nombre}" cargado`);
}

function renderCalcPerfiles(){
  const sel = document.getElementById('calc-perfil-select'); if(!sel) return;
  sel.innerHTML = '<option value="">⬇ Cargar...</option>' +
    _calcPerfiles.map(p=>`<option value="${p.id}">${p.nombre}</option>`).join('');
}

function copiarResumenCosto(){
  const fmt = n => {
    const sym = MONEDA_SIMBOLO[_calcMoneda]||'$';
    return `${sym} ${n.toFixed(2)}`;
  };
  const kwh = parseFloat(document.getElementById('calc-kwh-nuevo')?.value)||0;
  const watts = parseFloat(document.getElementById('calc-watts')?.value)||120;
  const vidaUtil = parseFloat(document.getElementById('calc-vida-util')?.value)||5000;
  const repuestos = parseFloat(document.getElementById('calc-repuestos')?.value)||0;
  const horas = parseFloat(document.getElementById('calc-horas-nuevo')?.value)||0;
  const mins = parseFloat(document.getElementById('calc-minutos-nuevo')?.value)||0;
  const tiempoH = horas + mins/60;
  const costMaterial = _calcFilamentos.reduce((a,f)=>a+(f.precioPorKg/1000)*(f.gramos||0),0);
  const costElec = (watts/1000)*tiempoH*kwh;
  const costDesgaste = vidaUtil>0?(repuestos/vidaUtil)*tiempoH:0;
  const costoBase = costMaterial+costElec+costDesgaste;
  const margenError = parseFloat(document.getElementById('calc-margen-error')?.value)||0;
  const insumos = parseFloat(document.getElementById('calc-insumos')?.value)||0;
  const totalCostos = costoBase*(1+margenError/100)+insumos;
  const precioFinalEl = document.getElementById('calc-total-final');
  const texto = `📊 RESUMEN DE COSTO — MarcanoTech
${'─'.repeat(35)}
Material:       ${fmt(costMaterial)}
Electricidad:   ${fmt(costElec)}
Desgaste:       ${fmt(costDesgaste)}
Costo base:     ${fmt(costoBase)}
─────────────────────────
Total costos:   ${fmt(totalCostos)}
PRECIO FINAL:   ${precioFinalEl?.textContent||'—'}
${'─'.repeat(35)}
Generado con MarcanoTech Dashboard`;
  navigator.clipboard.writeText(texto).then(()=>showToast('Resumen copiado ✓')).catch(()=>showToast('No se pudo copiar','error'));
}

function renderCostos(){
  renderCalcFilamentos();
  renderCalcPerfiles();
  // Populate impresora select
  const sel = document.getElementById('calc-impresora');
  if(sel){
    sel.innerHTML = '<option value="">Seleccionar impresora...</option>' +
      DB.impresoras.map(i=>`<option value="${i.id}">${i.codigo||''} ${i.nombre}</option>`).join('');
  }
  recalcularCosto();
}



// ════════════════════════════════
// ESTADÍSTICAS
// ════════════════════════════════
function renderEstadisticas(){
  const estados=Object.entries(DB.proyectos.reduce((a,p)=>{a[p.estado]=(a[p.estado]||0)+1;return a},{}));
  const ec=document.getElementById('chart-estados');
  if(ec){
    if(!estados.length){ ec.innerHTML=`<div style="font-size:12px;color:var(--text3);font-family:var(--mono);padding:20px">Sin datos</div>`; }
    else{
      const max=Math.max(...estados.map(e=>e[1]));
      const cfg=estadoConfig;
      ec.innerHTML=`<div style="display:flex;flex-direction:column;gap:8px;margin-top:8px">`+
        estados.map(([st,n])=>{
          const c=cfg[st]?cfg[st].color:'var(--text3)';
          return `<div style="display:flex;align-items:center;gap:10px">
            <div style="font-size:11px;color:var(--text2);font-family:var(--mono);width:90px">${st}</div>
            <div style="flex:1;height:8px;background:var(--border);border-radius:4px;overflow:hidden"><div style="height:100%;width:${(n/max)*100}%;background:${c};border-radius:4px"></div></div>
            <div style="font-size:11px;color:var(--text3);font-family:var(--mono);width:20px;text-align:right">${n}</div>
          </div>`;
        }).join('')+'</div>';
    }
  }
  const fc=document.getElementById('chart-filamentos');
  if(fc){
    if(!DB.materiales.length){ fc.innerHTML=`<div style="font-size:12px;color:var(--text3);font-family:var(--mono);padding:20px">Sin materiales</div>`; }
    else{
      fc.innerHTML=`<div style="display:flex;flex-direction:column;gap:8px;margin-top:8px">`+
        DB.materiales.map(m=>{
          const pct=Math.round((m.stock/m.total)*100);
          const c=pct<20?'var(--coral)':pct<40?'var(--amber)':'var(--teal)';
          return `<div style="display:flex;align-items:center;gap:10px">
            <div style="width:8px;height:8px;border-radius:50%;background:${m.colorHex};flex-shrink:0;border:0.5px solid var(--border2)"></div>
            <div style="font-size:11px;color:var(--text2);font-family:var(--mono);flex:1">${m.tipo} ${m.color}</div>
            <div style="width:80px;height:6px;background:var(--border);border-radius:3px;overflow:hidden"><div style="height:100%;width:${pct}%;background:${c};border-radius:3px"></div></div>
            <div style="font-size:10px;color:var(--text3);font-family:var(--mono);width:32px;text-align:right">${pct}%</div>
          </div>`;
        }).join('')+'</div>';
    }
  }
  const tbody=document.getElementById('stats-proyectos-tbody');
  if(tbody){
    if(!DB.proyectos.length){ tbody.innerHTML=`<tr><td colspan="5" style="text-align:center;color:var(--text3);padding:20px;font-family:var(--mono);font-size:12px">Sin proyectos</td></tr>`; }
    else{
      tbody.innerHTML=DB.proyectos.map(p=>{
        const ec=estadoConfig[p.estado]||{label:p.estado,cls:'badge-gray'};
        return `<tr>
          <td>${p.emoji} <strong>${p.nombre}</strong></td>
          <td><span class="badge ${ec.cls}">${ec.label}</span></td>
          <td class="mono">${p.material||'—'}</td>
          <td><div style="display:flex;align-items:center;gap:8px"><div style="width:80px;height:80px;display:flex;align-items:center;justify-content:center;margin:0 auto 12px"><img src="data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCA3MDAgNjAwIiBvdmVyZmxvdz0iaGlkZGVuIj48ZwogICAgIGlkPSJnMSI+CiAgICA8ZwogICAgICAgaWQ9ImcyIgogICAgICAgdHJhbnNmb3JtPSJ0cmFuc2xhdGUoOC44MjM1Mjk0LC0xMS43NjQ3MDYpIj4KICAgICAgPGcKICAgICAgICAgaWQ9Imc3NzkiCiAgICAgICAgIHRyYW5zZm9ybT0idHJhbnNsYXRlKC00MC41NDIwNCwtMjYuNzYwNTYzKSI+CiAgICAgICAgPHBhdGgKICAgICAgICAgICBzdHlsZT0iZmlsbDojMDAwMDAwO2ZpbGwtb3BhY2l0eToxO3N0cm9rZTojZmY2NjAwO3N0cm9rZS13aWR0aDoyO3N0cm9rZS1saW5lY2FwOmJ1dHQ7c3Ryb2tlLWxpbmVqb2luOnJvdW5kO3N0cm9rZS1taXRlcmxpbWl0OjA7c3Ryb2tlLWRhc2hhcnJheTpub25lO3N0cm9rZS1kYXNob2Zmc2V0OjA7c3Ryb2tlLW9wYWNpdHk6MTtwYWludC1vcmRlcjpub3JtYWwiCiAgICAgICAgICAgZD0ibSA0MTkuMzQxNTYsNTk4LjM1MzkxIGggMjYuNzQ4OTcgTCA0MzIuOTIxODEsNjE4LjEwNyBaIgogICAgICAgICAgIGlkPSJwYXRoNzc2IiAvPgogICAgICAgIDxwYXRoCiAgICAgICAgICAgc3R5bGU9ImZpbGw6I2ZmNjYwMDtmaWxsLW9wYWNpdHk6MTtzdHJva2U6I2ZmNjYwMDtzdHJva2Utd2lkdGg6Mi4wNDA1MjtzdHJva2UtbGluZWNhcDpidXR0O3N0cm9rZS1saW5lam9pbjpyb3VuZDtzdHJva2UtbWl0ZXJsaW1pdDowO3N0cm9rZS1kYXNoYXJyYXk6bm9uZTtzdHJva2UtZGFzaG9mZnNldDowO3N0cm9rZS1vcGFjaXR5OjE7cGFpbnQtb3JkZXI6bm9ybWFsIgogICAgICAgICAgIGQ9Im0gNDA3LjE0MjQyLDU3OS40NDE5MyBoIDUyLjg2MDczIGwgLTguNTk1MjQsMTEuMDc0OTkgaCAtMzYuOTU5NTQgeiIKICAgICAgICAgICBpZD0icGF0aDc3OCIgLz4KICAgICAgICA8cmVjdAogICAgICAgICAgIHN0eWxlPSJmaWxsOiMwMDAwMDA7ZmlsbC1ydWxlOmV2ZW5vZGQ7c3Ryb2tlOiNmZjY2MDA7c3Ryb2tlLXdpZHRoOjIuMDU3NztzdHJva2UtbGluZWpvaW46cm91bmQ7c3Ryb2tlLWRhc2hhcnJheTpub25lO3N0cm9rZS1vcGFjaXR5OjEiCiAgICAgICAgICAgaWQ9InJlY3Q3NzkiCiAgICAgICAgICAgd2lkdGg9IjE3LjQyNCIKICAgICAgICAgICBoZWlnaHQ9IjI3LjM5ODk5MSIKICAgICAgICAgICB4PSI0MjQuNzQ3NSIKICAgICAgICAgICB5PSI0MzkuMTQxNDIiIC8+CiAgICAgICAgPHJlY3QKICAgICAgICAgICBzdHlsZT0iZmlsbDojMDAwMDAwO2ZpbGwtcnVsZTpldmVub2RkO3N0cm9rZTojZmY2NjAwO3N0cm9rZS13aWR0aDoxLjU2NTM7c3Ryb2tlLWxpbmVjYXA6cm91bmQ7c3Ryb2tlLWxpbmVqb2luOnJvdW5kO3N0cm9rZS1kYXNoYXJyYXk6bm9uZTtzdHJva2Utb3BhY2l0eToxIgogICAgICAgICAgIGlkPSJyZWN0Nzc5LTEiCiAgICAgICAgICAgd2lkdGg9IjE2LjM3MTIyMiIKICAgICAgICAgICBoZWlnaHQ9IjY5LjU0NjIxOSIKICAgICAgICAgICB4PSI0MjUuMTU1MjQiCiAgICAgICAgICAgeT0iNDcxLjM1NTIyIiAvPgogICAgICAgIDxyZWN0CiAgICAgICAgICAgc3R5bGU9ImZpbGw6I2ZmNjYwMDtmaWxsLW9wYWNpdHk6MTtmaWxsLXJ1bGU6ZXZlbm9kZDtzdHJva2U6I2ZmNjYwMDtzdHJva2Utd2lkdGg6MTtzdHJva2UtbGluZWpvaW46cm91bmQ7c3Ryb2tlLWRhc2hhcnJheTpub25lO3N0cm9rZS1vcGFjaXR5OjEiCiAgICAgICAgICAgaWQ9InJlY3Q3NzktMS00LTUiCiAgICAgICAgICAgd2lkdGg9IjQuMTA0NDE4OCIKICAgICAgICAgICBoZWlnaHQ9IjUyLjQzNDc1MyIKICAgICAgICAgICB4PSI0ODcuMjc5NzkiCiAgICAgICAgICAgeT0iLTQ1Ny4xODQ4OCIKICAgICAgICAgICB0cmFuc2Zvcm09Im1hdHJpeCgwLjAwMzI2MzM2LDAuOTk5OTk0NjgsLTAuOTk5OTk5OTYsMi45OTQ4Nzg0ZS00LDAsMCkiIC8+CiAgICAgICAgPHJlY3QKICAgICAgICAgICBzdHlsZT0iZmlsbDojZmY2NjAwO2ZpbGwtb3BhY2l0eToxO2ZpbGwtcnVsZTpldmVub2RkO3N0cm9rZTojZmY2NjAwO3N0cm9rZS13aWR0aDoxO3N0cm9rZS1saW5lam9pbjpyb3VuZDtzdHJva2UtZGFzaGFycmF5Om5vbmU7c3Ryb2tlLW9wYWNpdHk6MSIKICAgICAgICAgICBpZD0icmVjdDc3OS0xLTQtNS02IgogICAgICAgICAgIHdpZHRoPSI0LjEwNDQxODgiCiAgICAgICAgICAgaGVpZ2h0PSI1Mi40MzQ3NTMiCiAgICAgICAgICAgeD0iNTAzLjQzOTUxIgogICAgICAgICAgIHk9Ii00NTYuODkxODgiCiAgICAgICAgICAgdHJhbnNmb3JtPSJtYXRyaXgoMC4wMDMyNjMzNiwwLjk5OTk5NDY4LC0wLjk5OTk5OTk2LDIuOTk0ODc4NGUtNCwwLDApIiAvPgogICAgICAgIDxyZWN0CiAgICAgICAgICAgc3R5bGU9ImZpbGw6I2ZmNjYwMDtmaWxsLW9wYWNpdHk6MTtmaWxsLXJ1bGU6ZXZlbm9kZDtzdHJva2U6I2IwYjhjNDtzdHJva2Utd2lkdGg6MS4yMDAwMTtzdHJva2UtbGluZWpvaW46cm91bmQ7c3Ryb2tlLWRhc2hhcnJheTpub25lO3N0cm9rZS1vcGFjaXR5OjEiCiAgICAgICAgICAgaWQ9InJlY3Q3NzktMS00LTUtNi00IgogICAgICAgICAgIHdpZHRoPSIzLjkwMDg4MDEiCiAgICAgICAgICAgaGVpZ2h0PSI4MC4wMjMzNTQiCiAgICAgICAgICAgeD0iNjMxLjA5ODUxIgogICAgICAgICAgIHk9Ii00NjkuOTE4NDYiCiAgICAgICAgICAgdHJhbnNmb3JtPSJtYXRyaXgoMC4wMDUyNDAyNCwwLjk5OTk4NjI3LC0wLjk5OTk5OTk4LDEuODY1MDQzNGUtNCwwLDApIiAvPgogICAgICAgIDxyZWN0CiAgICAgICAgICAgc3R5bGU9ImZpbGw6I2IwYjhjNDtmaWxsLW9wYWNpdHk6MTtmaWxsLXJ1bGU6ZXZlbm9kZDtzdHJva2U6I2ZmNjYwMDtzdHJva2Utd2lkdGg6MS41MDAwMTtzdHJva2UtbGluZWpvaW46cm91bmQ7c3Ryb2tlLWRhc2hhcnJheTpub25lO3N0cm9rZS1vcGFjaXR5OjEiCiAgICAgICAgICAgaWQ9InJlY3Q3NzktMS00LTUtNi00LTgiCiAgICAgICAgICAgd2lkdGg9IjYuOTUxNjIxNSIKICAgICAgICAgICBoZWlnaHQ9IjExNy4wNzYyNCIKICAgICAgICAgICB4PSI2NDQuMDg2MyIKICAgICAgICAgICB5PSItNDkxLjA3NDE5IgogICAgICAgICAgIHRyYW5zZm9ybT0ibWF0cml4KDAuMDA0MzAyMDksMC45OTk5OTA3NSwtMC45OTk5OTk5NywyLjI3MTc1OTVlLTQsMCwwKSIgLz4KICAgICAgICA8cmVjdAogICAgICAgICAgIHN0eWxlPSJmaWxsOiNiMGI4YzQ7ZmlsbC1vcGFjaXR5OjE7ZmlsbC1ydWxlOmV2ZW5vZGQ7c3Ryb2tlOiNmZjY2MDA7c3Ryb2tlLXdpZHRoOjEuNTAwMDE7c3Ryb2tlLWxpbmVqb2luOnJvdW5kO3N0cm9rZS1kYXNoYXJyYXk6bm9uZTtzdHJva2Utb3BhY2l0eToxIgogICAgICAgICAgIGlkPSJyZWN0Nzc5LTEtNC01LTYtNC04LTkiCiAgICAgICAgICAgd2lkdGg9IjcuNjA2MjE5MyIKICAgICAgICAgICBoZWlnaHQ9IjE2MS41MjE5MyIKICAgICAgICAgICB4PSI2NjEuMjIzNTEiCiAgICAgICAgICAgeT0iLTUxMi42NTY2MiIKICAgICAgICAgICB0cmFuc2Zvcm09Im1hdHJpeCgwLjAwNTQyNDUsMC45OTk5ODUyOSwtMC45OTk5OTk5OCwxLjgwMTY4OTZlLTQsMCwwKSIgLz4KICAgICAgICA8cmVjdAogICAgICAgICAgIHN0eWxlPSJmaWxsOiNmZjY2MDA7ZmlsbC1vcGFjaXR5OjE7ZmlsbC1ydWxlOmV2ZW5vZGQ7c3Ryb2tlOiNmZjY2MDA7c3Ryb2tlLXdpZHRoOjEuMDUwMDE7c3Ryb2tlLWxpbmVqb2luOnJvdW5kO3N0cm9rZS1kYXNoYXJyYXk6bm9uZTtzdHJva2Utb3BhY2l0eToxIgogICAgICAgICAgIGlkPSJyZWN0Nzc5LTEtNC0zIgogICAgICAgICAgIHdpZHRoPSI1LjQ5Mjk4NDMiCiAgICAgICAgICAgaGVpZ2h0PSI5OS44MTU5NTYiCiAgICAgICAgICAgeD0iNDc5LjY0OTQ4IgogICAgICAgICAgIHk9Ii00NzguNTMzNjYiCiAgICAgICAgICAgdHJhbnNmb3JtPSJtYXRyaXgoMC4wMDQ2NDE4MiwwLjk5OTk4OTIzLC0wLjk5OTk5OTk4LDIuMTA1NDg3OGUtNCwwLDApIiAvPgogICAgICAgIDxyZWN0CiAgICAgICAgICAgc3R5bGU9ImZpbGw6I2ZmNjYwMDtmaWxsLW9wYWNpdHk6MTtmaWxsLXJ1bGU6ZXZlbm9kZDtzdHJva2U6I2ZmNjYwMDtzdHJva2Utd2lkdGg6MS4wNTAwMTtzdHJva2UtbGluZWpvaW46cm91bmQ7c3Ryb2tlLWRhc2hhcnJheTpub25lO3N0cm9rZS1vcGFjaXR5OjEiCiAgICAgICAgICAgaWQ9InJlY3Q3NzktMS00LTMtOCIKICAgICAgICAgICB3aWR0aD0iNS40OTI5ODQzIgogICAgICAgICAgIGhlaWdodD0iOTkuODE1OTU2IgogICAgICAgICAgIHg9IjQ5NS44MzExMiIKICAgICAgICAgICB5PSItNDc4LjI0MTg1IgogICAgICAgICAgIHRyYW5zZm9ybT0ibWF0cml4KDAuMDA0NjQxODIsMC45OTk5ODkyMywtMC45OTk5OTk5OCwyLjEwNTQ4NzhlLTQsMCwwKSIgLz4KICAgICAgICA8cmVjdAogICAgICAgICAgIHN0eWxlPSJmaWxsOiNmZjY2MDA7ZmlsbC1vcGFjaXR5OjE7ZmlsbC1ydWxlOmV2ZW5vZGQ7c3Ryb2tlOiNmZjY2MDA7c3Ryb2tlLXdpZHRoOjEuMDUwMDE7c3Ryb2tlLWxpbmVqb2luOnJvdW5kO3N0cm9rZS1kYXNoYXJyYXk6bm9uZTtzdHJva2Utb3BhY2l0eToxIgogICAgICAgICAgIGlkPSJyZWN0Nzc5LTEtNC0zLTgtOCIKICAgICAgICAgICB3aWR0aD0iNS40OTI5ODQzIgogICAgICAgICAgIGhlaWdodD0iOTkuODE1OTU2IgogICAgICAgICAgIHg9IjUxMi4wMzEzMSIKICAgICAgICAgICB5PSItNDc4LjE2NjY2IgogICAgICAgICAgIHRyYW5zZm9ybT0ibWF0cml4KDAuMDA0NjQxODIsMC45OTk5ODkyMywtMC45OTk5OTk5OCwyLjEwNTQ4NzhlLTQsMCwwKSIgLz4KICAgICAgICA8cmVjdAogICAgICAgICAgIHN0eWxlPSJmaWxsOiNmZjY2MDA7ZmlsbC1vcGFjaXR5OjE7ZmlsbC1ydWxlOmV2ZW5vZGQ7c3Ryb2tlOiNmZjY2MDA7c3Ryb2tlLXdpZHRoOjAuNDI5MDM1O3N0cm9rZS1saW5lam9pbjpyb3VuZDtzdHJva2UtZGFzaGFycmF5Om5vbmU7c3Ryb2tlLW9wYWNpdHk6MSIKICAgICAgICAgICBpZD0icmVjdDc3OS0xLTQtOSIKICAgICAgICAgICB3aWR0aD0iMi45NjA0NDA5IgogICAgICAgICAgIGhlaWdodD0iMjguODkyNjk2IgogICAgICAgICAgIHg9IjQ3NC43OTEwOCIKICAgICAgICAgICB5PSItNDQ2LjMyMzg4IgogICAgICAgICAgIHRyYW5zZm9ybT0ibWF0cml4KDAuMDAyNDkzMDMsMC45OTk5OTY4OSwtMC45OTk5OTk5MiwzLjkyMDI3MDFlLTQsMCwwKSIgLz4KICAgICAgICA8cmVjdAogICAgICAgICAgIHN0eWxlPSJmaWxsOiNmZjY2MDA7ZmlsbC1vcGFjaXR5OjE7ZmlsbC1ydWxlOmV2ZW5vZGQ7c3Ryb2tlOiNmZjY2MDA7c3Ryb2tlLXdpZHRoOjAuNTQ2MzA1O3N0cm9rZS1saW5lam9pbjpyb3VuZDtzdHJva2UtZGFzaGFycmF5Om5vbmU7c3Ryb2tlLW9wYWNpdHk6MSIKICAgICAgICAgICBpZD0icmVjdDc3OS0xLTQtOS00IgogICAgICAgICAgIHdpZHRoPSIyLjg0MzYzNzIiCiAgICAgICAgICAgaGVpZ2h0PSI0OC43NzAzNDgiCiAgICAgICAgICAgeD0iNTE5LjM3OTciCiAgICAgICAgICAgeT0iLTQ1NS4xNjgwOSIKICAgICAgICAgICB0cmFuc2Zvcm09Im1hdHJpeCgwLjAwNDM4MTA0LDAuOTk5OTkwNCwtMC45OTk5OTk5OCwyLjIzMDgxMzFlLTQsMCwwKSIgLz4KICAgICAgICA8cmVjdAogICAgICAgICAgIHN0eWxlPSJmaWxsOiNmZjY2MDA7ZmlsbC1vcGFjaXR5OjE7ZmlsbC1ydWxlOmV2ZW5vZGQ7c3Ryb2tlOiNmZjY2MDA7c3Ryb2tlLXdpZHRoOjAuNTI4NjUzO3N0cm9rZS1saW5lam9pbjpyb3VuZDtzdHJva2UtZGFzaGFycmF5Om5vbmU7c3Ryb2tlLW9wYWNpdHk6MSIKICAgICAgICAgICBpZD0icmVjdDc3OS0xLTQtOS01IgogICAgICAgICAgIHdpZHRoPSIyLjg2MTIxODIiCiAgICAgICAgICAgaGVpZ2h0PSI0NS4zODg4NjMiCiAgICAgICAgICAgeD0iNTMzLjU3ODE5IgogICAgICAgICAgIHk9Ii00NTMuODkxMDIiCiAgICAgICAgICAgdHJhbnNmb3JtPSJtYXRyaXgoMC4wMDQwNTIyMywwLjk5OTk5MTc5LC0wLjk5OTk5OTk3LDIuNDExODMyNGUtNCwwLDApIiAvPgogICAgICAgIDxyZWN0CiAgICAgICAgICAgc3R5bGU9ImZpbGw6IzAwMDAwMDtmaWxsLXJ1bGU6ZXZlbm9kZDtzdHJva2U6I2ZmNjYwMDtzdHJva2Utd2lkdGg6MjtzdHJva2UtbGluZWNhcDpyb3VuZDtzdHJva2UtbGluZWpvaW46cm91bmQ7c3Ryb2tlLWRhc2hhcnJheTpub25lO3N0cm9rZS1vcGFjaXR5OjEiCiAgICAgICAgICAgaWQ9InJlY3Q3NzktNCIKICAgICAgICAgICB3aWR0aD0iNjUuODc1OTg0IgogICAgICAgICAgIGhlaWdodD0iMjguMjQ5ODkzIgogICAgICAgICAgIHg9IjM5OS45MjY2MSIKICAgICAgICAgICB5PSI1NDMuNzg1MjgiIC8+CiAgICAgICAgPHJlY3QKICAgICAgICAgICBzdHlsZT0iZmlsbDojZmY2NjAwO2ZpbGwtb3BhY2l0eToxO2ZpbGwtcnVsZTpldmVub2RkO3N0cm9rZTojZmY2NjAwO3N0cm9rZS13aWR0aDoxLjA1MDAxO3N0cm9rZS1saW5lam9pbjpyb3VuZDtzdHJva2UtZGFzaGFycmF5Om5vbmU7c3Ryb2tlLW9wYWNpdHk6MSIKICAgICAgICAgICBpZD0icmVjdDc3OS0xLTQtMy04LTciCiAgICAgICAgICAgd2lkdGg9IjUuNDkyOTg0MyIKICAgICAgICAgICBoZWlnaHQ9Ijk5LjgxNTk1NiIKICAgICAgICAgICB4PSI1MjYuODMxNTQiCiAgICAgICAgICAgeT0iLTQ3OC40OTc5MiIKICAgICAgICAgICB0cmFuc2Zvcm09Im1hdHJpeCgwLjAwNDY0MTgyLDAuOTk5OTg5MjMsLTAuOTk5OTk5OTgsMi4xMDU0ODc4ZS00LDAsMCkiIC8+CiAgICAgIDwvZz4KICAgICAgPGcKICAgICAgICAgaWQ9Imc3ODAiCiAgICAgICAgIHRyYW5zZm9ybT0idHJhbnNsYXRlKC00MC44NDUwNywtMjYuNzYwNTYzKSIKICAgICAgICAgc3R5bGU9ImZpbGw6I2ZmNjYwMDtmaWxsLW9wYWNpdHk6MTtzdHJva2U6I2ZmNjYwMDtzdHJva2Utb3BhY2l0eTowLjk5NjA3OCI+CiAgICAgICAgPHBhdGgKICAgICAgICAgICBzdHlsZT0iZmlsbDojZmY2NjAwO2ZpbGwtb3BhY2l0eToxO3N0cm9rZTojZmY2NjAwO3N0cm9rZS13aWR0aDozO3N0cm9rZS1saW5lY2FwOnNxdWFyZTtzdHJva2UtbGluZWpvaW46cm91bmQ7c3Ryb2tlLW1pdGVybGltaXQ6MDtzdHJva2UtZGFzaGFycmF5Om5vbmU7c3Ryb2tlLWRhc2hvZmZzZXQ6NC41O3N0cm9rZS1vcGFjaXR5OjAuOTk2MDc4O3BhaW50LW9yZGVyOm5vcm1hbCIKICAgICAgICAgICBkPSJtIDMyOC44MDY1OSw1ODUuMTg1MTggLTM0LjU2NzksLTM3LjAzNzAzIDAuODIzMDQsLTI1MS40NDAzMyBoIDM4LjY4MzEzIGwgOTcuNTMwODYsMTAxLjIzNDU2IDEwMCwtMTAwLjgyMzA0IGggMzkuNTA2MTggdiAyNTIuMjYzMzcgbCAtMzUuODAyNDcsMzguMjcxNjEgViAzNTkuMjU5MjYgbCAtODYuNDE5NzYsODYuMDA4MjMgLTAuNDExNTIsLTExLjkzNDE2IGggLTI4LjgwNjU4IHYgMTMuOTkxNzcgbCAtOTAuMTIzNDYsLTg4LjQ3NzM3IHoiCiAgICAgICAgICAgaWQ9InBhdGg3NjIiIC8+CiAgICAgICAgPHBhdGgKICAgICAgICAgICBzdHlsZT0iZmlsbDojZmY2NjAwO2ZpbGwtb3BhY2l0eToxO3N0cm9rZTojZmY2NjAwO3N0cm9rZS13aWR0aDoyO3N0cm9rZS1saW5lY2FwOnJvdW5kO3N0cm9rZS1saW5lam9pbjpyb3VuZDtzdHJva2UtbWl0ZXJsaW1pdDowO3N0cm9rZS1kYXNoYXJyYXk6bm9uZTtzdHJva2UtZGFzaG9mZnNldDowO3N0cm9rZS1vcGFjaXR5OjAuOTk2MDc4O3BhaW50LW9yZGVyOm5vcm1hbCIKICAgICAgICAgICBkPSJtIDIyMSwyMDQgaCA1NCBsIDIwLDI1IEggMzk4LjMzMzMzIEwgNDI2LjY2NjY3LDI2MC4zMzMzMyA0MzkuMzMzMzMsMjYwIDQ2OCwyMjkuMzMzMzMgNTcyLjY2NjY3LDIyOSBsIDE4LC0yNC42NjY2NyBoIDUzLjY2NjY2IEwgNjQ1LDIzNSA2MDksMjgwLjMzMzMzIDYwOC4zMzMzMyw2NjggbCA3LDAuMzMzMzMgMC4zMzMzNCwtMzgyIDI5LjMzMzMzLC0zNyB2IDQyNCBIIDYwMC42NjY2NyBWIDI2Ni42NjY2NyBIIDQ3MiBsIC0yOS4zMzMzMywyNy42NjY2NiAwLjY2NjY2LDI2LjMzMzM0IC0yMiwwLjMzMzMzIC0wLjY2NjY2LC0yNi4zMzMzMyBMIDM5NCwyNjcgbCAtMTI4LjY2NjY3LDAuMzMzMzMgMC42NjY2Nyw0MDcgaCAtNDUuNjY2NjcgbCAwLjMzMzM0LC00MjIgMzAuNjY2NjYsNDAgTCAyNTEsNjY4LjY2NjY3IDI1OC42NjY2Nyw2NjkgMjU4LDI4NC42NjY2NyAyMjAuNjY2NjcsMjM1LjMzMzMzIFoiCiAgICAgICAgICAgaWQ9InBhdGg3ODAiIC8+CiAgICAgIDwvZz4KICAgIDwvZz4KICA8L2c+PC9zdmc+" style="height:80px;width:auto;flex-shrink:0;display:block" alt="MarcanoTech"></div></div><span style="font-size:10px;font-family:var(--mono);color:var(--text3)">${p.progreso||0}%</span></div></td>
          <td style="font-size:11px;color:var(--text3)">${p.notas||'—'}</td>
        </tr>`;
      }).join('');
    }
  }
  const sr=document.getElementById('stats-row-extra');
  if(sr){
    const totalGramos=DB.materiales.reduce((a,m)=>a+m.stock,0);
    const stockProductos=DB.productos.reduce((a,p)=>a+p.stock,0);
    const mantPendiente=DB.mantenimiento.filter(m=>m.estado==='pendiente').length;
    sr.innerHTML=`
      <div class="stat-card"><div class="stat-label">Total piezas STL</div><div class="stat-value">${DB.piezas.length}</div><div class="stat-delta neutral">registradas</div></div>
      <div class="stat-card"><div class="stat-label">Filamento en stock</div><div class="stat-value">${(totalGramos/1000).toFixed(1)}kg</div><div class="stat-delta ${totalGramos<500?'down':'neutral'}">${DB.materiales.length} tipos</div></div>
      <div class="stat-card"><div class="stat-label">Unidades en stock</div><div class="stat-value">${stockProductos}</div><div class="stat-delta neutral">${DB.productos.length} productos</div></div>
      <div class="stat-card"><div class="stat-label">Mant. pendiente</div><div class="stat-value">${mantPendiente}</div><div class="stat-delta ${mantPendiente>0?'down':'up'}">${mantPendiente>0?'revisar':'todo al día'}</div></div>`;
  }
}

// ════════════════════════════════
// DASHBOARD
// ════════════════════════════════
function renderDashboard(){
  document.getElementById('dash-proyectos').textContent=DB.proyectos.length;
  document.getElementById('dash-materiales').textContent=DB.materiales.length;
  document.getElementById('dash-productos').textContent=DB.productos.length;
  document.getElementById('dash-cola').textContent=DB.cola.length;
  const activos=DB.proyectos.filter(p=>p.estado==='imprimiendo').length;
  document.getElementById('dash-proyectos-sub').textContent=activos>0?`${activos} imprimiendo ahora`:`${DB.proyectos.length} en total`;
  const bajos=DB.materiales.filter(m=>(m.stock/m.total)<0.2).length;
  document.getElementById('dash-mat-sub').textContent=bajos>0?`⚠ ${bajos} con stock bajo`:`${DB.materiales.length} registrados`;
  const agotados=DB.productos.filter(p=>p.stock===0).length;
  document.getElementById('dash-prod-sub').textContent=agotados>0?`${agotados} agotados`:`${DB.productos.length} en catálogo`;
  document.getElementById('dash-cola-sub').textContent=DB.cola.length>0?`próximo: ${DB.cola[0]?.nombre||'—'}`:'cola vacía';

  // Projects grid
  const pg=document.getElementById('dash-projects-grid');
  const recent=DB.proyectos.slice(-6).reverse();
  if(!recent.length){
    pg.innerHTML=`<div style="grid-column:1/-1"><div class="empty-state"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"/></svg><p>Creá tu primer proyecto</p></div></div><div class="add-card" onclick="openModal('modal-proyecto')"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="16"/><line x1="8" y1="12" x2="16" y2="12"/></svg><span>Nuevo proyecto</span></div>`;
  } else {
    pg.innerHTML=recent.map(p=>{
      const ec=estadoConfig[p.estado]||{label:p.estado,cls:'badge-gray'};
      const bg=p.color||'#38d9a9';
      return `<div class="project-card" onclick="editProyecto('${p.id}')" style="display:grid;grid-template-columns:100px 1fr;overflow:hidden">
        <div style="background:linear-gradient(135deg,${bg}22,${bg}08);display:flex;align-items:center;justify-content:center;overflow:hidden;min-height:100px">${p.imagen?`<img src="${p.imagen}" style="width:100%;height:100%;object-fit:cover">`:`<span style="font-size:28px">${p.emoji||'🖨️'}</span>`}</div>
        <div class="project-body">
          <div class="project-name">${p.nombre}</div>
          <div class="project-meta">${p.material||'—'}</div>
          <div class="project-progress"><div class="progress-fill" style="width:${p.progreso||0}%;background:${bg}"></div></div>
          <div class="project-footer"><span class="badge ${ec.cls}">${ec.label}</span><span class="project-time">${p.tiempo||'—'}</span></div>
        </div>
      </div>`;
    }).join('');
  }

  // Materials panel
  const mp=document.getElementById('dash-materials-panel');
  if(DB.materiales.length){
    mp.innerHTML=`<div class="material-list">`+DB.materiales.slice(0,6).map(m=>{
      const pct=Math.round((m.stock/m.total)*100);
      const c=pct<20?'var(--coral)':pct<40?'var(--amber)':'var(--teal)';
      return `<div class="material-item">
        <div class="mat-color" style="background:${m.colorHex};border:0.5px solid var(--border2)"></div>
        <div class="mat-info"><div class="mat-name">${m.tipo} ${m.color}</div><div class="mat-type">${m.marca}</div></div>
        <div class="mat-bar"><div class="mat-bar-fill" style="width:${pct}%;background:${c}"></div></div>
        <div class="mat-grams" style="color:${c}">${m.stock}g</div>
      </div>`;
    }).join('')+'</div>';
  } else {
    mp.innerHTML=`<div class="empty-state"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><ellipse cx="12" cy="5" rx="9" ry="3"/><path d="M3 5v14c0 1.66 4 3 9 3s9-1.34 9-3V5"/></svg><p>Sin materiales registrados</p></div>`;
  }

  // Queue panel
  const qp=document.getElementById('dash-queue-panel');
  if(DB.cola.length){
    const priColors={normal:'var(--text3)',alta:'var(--amber)',urgente:'var(--coral)'};
    qp.innerHTML=`<div class="queue-list">`+DB.cola.slice(0,5).map((c,i)=>{
      const mat=DB.materiales.find(m=>m.id===c.materialId);
      const pc=priColors[c.prioridad]||'var(--text3)';
      return `<div class="queue-item">
        <div class="queue-num" style="color:${pc}">${String(i+1).padStart(2,'0')}</div>
        <div><div class="queue-name">${c.nombre}</div><div class="queue-meta">${mat?mat.tipo+' '+mat.color:'—'}</div></div>
        <div class="queue-time">${c.tiempo||'—'}</div>
      </div>`;
    }).join('')+'</div>';
  } else {
    qp.innerHTML=`<div class="empty-state"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><line x1="8" y1="6" x2="21" y2="6"/><line x1="8" y1="12" x2="21" y2="12"/><line x1="8" y1="18" x2="21" y2="18"/></svg><p>Cola vacía</p></div>`;
  }

  // Activity
  const act=document.getElementById('dash-activity');
  if(DB.actividad.length){
    const typeMap={success:{bg:'rgba(56,217,169,0.12)',stroke:'var(--teal)'},error:{bg:'rgba(255,107,91,0.12)',stroke:'var(--coral)'},info:{bg:'rgba(78,168,255,0.12)',stroke:'var(--blue)'}};
    act.innerHTML=`<div class="activity-list">`+DB.actividad.slice(0,8).map(a=>{
      const t=typeMap[a.type]||typeMap.info;
      return `<div class="activity-item">
        <div class="act-dot" style="background:${t.bg}"><svg viewBox="0 0 24 24" fill="none" stroke="${t.stroke}" stroke-width="2"><circle cx="12" cy="12" r="4"/></svg></div>
        <div class="act-body"><div class="act-text">${a.text}</div><div class="act-time">${a.time}</div></div>
      </div>`;
    }).join('')+'</div>';
  } else {
    act.innerHTML=`<div class="empty-state"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/></svg><p>Sin actividad aún</p></div>`;
  }

  // Sidebar printer status
  const impActiva=DB.impresoras.find(i=>i.estado==='imprimiendo');
  if(impActiva){
    document.getElementById('sidebar-printer-status').textContent='Imprimiendo...';
    document.getElementById('sidebar-bar').style.width='45%';
    document.getElementById('sidebar-pct').textContent='45%';
    document.getElementById('sidebar-layer').textContent=impActiva.nombre;
  } else if(DB.impresoras.length){
    document.getElementById('sidebar-printer-status').textContent=DB.impresoras[0].nombre;
    document.getElementById('sidebar-bar').style.width='0%';
    document.getElementById('sidebar-pct').textContent='—';
    document.getElementById('sidebar-layer').textContent='sin trabajo activo';
  }
}
  updateSidebarPrinterSelect();

// ════════════════════════════════
// SHARED PRICE HELPER
// ════════════════════════════════
function onPrecioARS(arsId, usdId, hintId){
  const ars = parseFloat(document.getElementById(arsId)?.value)||0;
  const usdEl = document.getElementById(usdId);
  const hint = document.getElementById(hintId);
  if(_dolarRate && ars > 0){
    if(usdEl){ usdEl.value = (ars/_dolarRate).toFixed(2); }
    if(hint) hint.textContent = `USD oficial: $${_dolarRate.toLocaleString('es-AR')} ARS`;
  } else {
    if(usdEl){ usdEl.value = ''; }
    if(hint) hint.textContent = _dolarRate ? `USD oficial: $${_dolarRate.toLocaleString('es-AR')} ARS` : 'Sin cotización';
  }
}

// ════════════════════════════════
// MATERIALES — CARD GRID
// ════════════════════════════════
function renderMateriales(){
  const sr = document.getElementById('mat-stats-row');
  if(sr){
    const total = DB.materiales.length;
    const stockOk = DB.materiales.filter(m=>(m.stock/m.total)>0.2).length;
    const bajo = DB.materiales.filter(m=>m.stock>0&&(m.stock/m.total)<=0.2).length;
    const totalKg = DB.materiales.reduce((a,m)=>a+(m.stock||0),0)/1000;
    sr.innerHTML=`
      <div class="stat-card"><div class="stat-label">Total</div><div class="stat-value">${total}</div><div class="stat-delta neutral">filamentos</div></div>
      <div class="stat-card"><div class="stat-label">Stock OK</div><div class="stat-value" style="color:var(--teal)">${stockOk}</div><div class="stat-delta up">disponibles</div></div>
      <div class="stat-card"><div class="stat-label">Stock bajo</div><div class="stat-value" style="color:var(--amber)">${bajo}</div><div class="stat-delta neutral">≤ 20%</div></div>
      <div class="stat-card"><div class="stat-label">Stock total</div><div class="stat-value">${totalKg.toFixed(2)}</div><div class="stat-delta neutral">kg</div></div>`;
  }
  // Populate filter selects
  const tipoSel = document.getElementById('mat-filter-tipo');
  const colorSel = document.getElementById('mat-filter-color');
  const marcaSel = document.getElementById('mat-filter-marca');
  if(tipoSel){
    const prevT = tipoSel.value;
    tipoSel.innerHTML = '<option value="">Material</option>';
    [...new Set(DB.materiales.map(m=>m.tipo))].sort().forEach(t=>{ const o=document.createElement('option'); o.value=t; o.textContent=t; if(t===prevT) o.selected=true; tipoSel.appendChild(o); });
  }
  if(colorSel){
    const prevC = colorSel.value;
    colorSel.innerHTML = '<option value="">Color</option>';
    [...new Set(DB.materiales.map(m=>m.color))].sort().forEach(c=>{ const o=document.createElement('option'); o.value=c; o.textContent=c; if(c===prevC) o.selected=true; colorSel.appendChild(o); });
  }
  if(marcaSel){
    const prevM = marcaSel.value;
    marcaSel.innerHTML = '<option value="">Marca</option>';
    [...new Set(DB.materiales.map(m=>m.marca).filter(m=>m&&m!=='—'))].sort().forEach(m=>{ const o=document.createElement('option'); o.value=m; o.textContent=m; if(m===prevM) o.selected=true; marcaSel.appendChild(o); });
  }
  const search = (document.getElementById('mat-search')?.value||'').toLowerCase();
  const fTipo = document.getElementById('mat-filter-tipo')?.value||'';
  const fColor = document.getElementById('mat-filter-color')?.value||'';
  const fMarca = document.getElementById('mat-filter-marca')?.value||'';
  let list = DB.materiales.filter(m=>{
    if(fTipo && m.tipo!==fTipo) return false;
    if(fColor && m.color!==fColor) return false;
    if(fMarca && m.marca!==fMarca) return false;
    if(search && !(`${m.tipo} ${m.color} ${m.marca}`).toLowerCase().includes(search)) return false;
    return true;
  });
  const grid = document.getElementById('materiales-grid'); if(!grid) return;
  if(!list.length){
    grid.innerHTML=`<div class="add-card" style="grid-column:1/-1;min-height:140px" onclick="openMatModal()">
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><ellipse cx="12" cy="5" rx="9" ry="3"/><path d="M3 5v14c0 1.66 4 3 9 3s9-1.34 9-3V5"/></svg>
      <span>Agregar primer filamento</span></div>`; return;
  }
  grid.innerHTML = list.map(m=>{
    const pct = m.total>0 ? Math.round((m.stock/m.total)*100) : 0;
    const c = pct>50?'var(--teal)':pct>20?'var(--amber)':'var(--coral)';
    const colorObj = MAT_COLORES.find(x=>x.id===m.color)||{hex:'#888'};
    const hex = colorObj.hex==='transparent-clear'?'rgba(200,200,200,0.3)':colorObj.hex;
    const arsStr = m.precioARS ? `$${parseFloat(m.precioARS).toLocaleString('es-AR',{minimumFractionDigits:2,maximumFractionDigits:2})}/kg` : m.precio ? `US$${parseFloat(m.precio||0).toFixed(2)}/kg` : '';
    return `<div class="panel" style="border:0.5px solid var(--border)">
      <div style="display:flex;align-items:flex-start;gap:10px;margin-bottom:10px">
        ${m.imagen?`<img src="${m.imagen}" style="width:48px;height:48px;object-fit:cover;border-radius:50%;flex-shrink:0;border:2px solid var(--border2)">`
          :`<div style="width:48px;height:48px;border-radius:50%;flex-shrink:0;background:${hex};border:2px solid var(--border2)"></div>`}
        <div style="flex:1;min-width:0">
          <div style="font-size:14px;font-weight:700;color:var(--text);line-height:1.2">${m.tipo} ${m.color}</div>
          <div style="font-size:11px;color:var(--text3);margin-top:1px">${m.marca||'—'}</div>
          <div style="font-size:10px;color:var(--text3);font-family:var(--mono);margin-top:2px">${MAT_TIPOS.find(t=>t.id===m.tipo)?.desc||''}</div>
        </div>
        <div style="display:flex;gap:4px">
          <button onclick="editMaterial('${m.id}')" title="Editar" style="background:none;border:none;color:var(--text3);cursor:pointer;padding:4px;font-size:14px">✏️</button>
          <button onclick="deleteMaterial('${m.id}')" title="Eliminar" style="background:none;border:none;color:var(--coral);cursor:pointer;padding:4px;font-size:14px">🗑</button>
        </div>
      </div>
      <div style="display:flex;justify-content:space-between;margin-bottom:4px">
        <span style="font-size:11px;color:var(--text2)">Stock</span>
        <span style="font-size:11px;font-weight:700;color:${c};font-family:var(--mono)">${m.stock}g / ${m.total}g (${pct}%)</span>
      </div>
      <div style="height:6px;background:var(--border);border-radius:3px;overflow:hidden;margin-bottom:8px">
        <div style="height:100%;width:${pct}%;background:${c};border-radius:3px"></div>
      </div>
      ${arsStr?`<div style="font-size:12px;font-weight:700;color:var(--ferrari);font-family:var(--mono)">${arsStr}</div>`:''}
      ${m.url?`<a href="${m.url}" target="_blank" style="font-size:10px;color:var(--blue);font-family:var(--mono);text-decoration:none;display:block;margin-top:4px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap">🔗 Ver compra</a>`:''}
    </div>`;
  }).join('')+`<div class="add-card" onclick="openMatModal()" style="min-height:120px">
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="16"/><line x1="8" y1="12" x2="16" y2="12"/></svg>
    <span>Nuevo filamento</span></div>`;
}

// ════════════════════════════════
// ACCESORIOS — CRUD
// ════════════════════════════════
function nextCodigoAccesorio(){
  if(!DB.accesorios||!DB.accesorios.length) return 'MT3-0001';
  const nums = DB.accesorios.map(a=>parseInt((a.codigo||'MT3-0000').split('-')[1]||0)).filter(n=>!isNaN(n));
  return 'MT3-'+String((nums.length?Math.max(...nums):0)+1).padStart(4,'0');
}

function openAccesorioModal(editId=''){
  document.getElementById('accesorio-edit-id').value='';
  document.getElementById('acc-modal-title').textContent='Agregar Accesorio';
  document.getElementById('acc-save-btn').textContent='Agregar Accesorio';
  clearForm(['acc-nombre','acc-marca','acc-notas','acc-url']);
  document.getElementById('acc-stock').value=1;
  document.getElementById('acc-stock-min').value=1;
  document.getElementById('acc-categoria').value='Consumible';
  document.getElementById('acc-unidad').value='Und';
  if(document.getElementById('acc-precio')) document.getElementById('acc-precio').value='';
  if(document.getElementById('acc-precio-ars')) document.getElementById('acc-precio-ars').value='';
  const hint=document.getElementById('acc-precio-hint');
  if(hint&&_dolarRate) hint.textContent=`USD oficial: $${_dolarRate.toLocaleString('es-AR')} ARS`;
  const codigo=nextCodigoAccesorio();
  document.getElementById('acc-codigo').value=codigo;
  document.getElementById('acc-codigo-display').textContent=codigo;
  resetImgPreview('acc-img-preview','acc-imagen');
  openModal('modal-accesorio');
}

function saveAccesorio(){
  const editId=document.getElementById('accesorio-edit-id').value;
  const nombre=document.getElementById('acc-nombre').value.trim();
  if(!nombre){ showToast('Ingresá el nombre','error'); return; }
  const obj={
    id:editId||uid(),
    codigo:document.getElementById('acc-codigo').value||nextCodigoAccesorio(),
    nombre,
    categoria:document.getElementById('acc-categoria').value||'Consumible',
    marca:document.getElementById('acc-marca').value||'—',
    unidad:document.getElementById('acc-unidad').value||'Und',
    stock:parseInt(document.getElementById('acc-stock').value)||0,
    stockMin:parseInt(document.getElementById('acc-stock-min').value)||1,
    precio:parseFloat(document.getElementById('acc-precio')?.value)||0,
    precioARS:parseFloat(document.getElementById('acc-precio-ars')?.value)||0,
    notas:document.getElementById('acc-notas').value||'',
    imagen:document.getElementById('acc-imagen').value||'',
    url:document.getElementById('acc-url')?.value||''
  };
  if(editId){ DB.accesorios=DB.accesorios.map(a=>a.id===editId?obj:a); }
  else{ DB.accesorios.push(obj); logActivity(`Accesorio <strong>${obj.nombre}</strong> agregado`); }
  persistWithStorage('accesorios', DB.accesorios);
  updateBadges(); closeModal('modal-accesorio'); renderSection(currentSection);
  showToast('Accesorio guardado ✓');
}

function deleteAccesorio(id){
  if(!confirm('¿Eliminar este accesorio?')) return;
  DB.accesorios=DB.accesorios.filter(a=>a.id!==id);
  persist('accesorios'); updateBadges(); renderSection(currentSection);
}

function editAccesorio(id){
  const a=DB.accesorios.find(x=>x.id===id); if(!a) return;
  openAccesorioModal(id);
  document.getElementById('accesorio-edit-id').value=a.id;
  document.getElementById('acc-modal-title').textContent='Editar Accesorio';
  document.getElementById('acc-save-btn').textContent='Guardar cambios';
  document.getElementById('acc-nombre').value=a.nombre||'';
  document.getElementById('acc-categoria').value=a.categoria||'Consumible';
  document.getElementById('acc-marca').value=a.marca==='—'?'':a.marca||'';
  document.getElementById('acc-unidad').value=a.unidad||'Und';
  document.getElementById('acc-stock').value=a.stock||0;
  document.getElementById('acc-stock-min').value=a.stockMin||1;
  if(document.getElementById('acc-precio')) document.getElementById('acc-precio').value=a.precio||'';
  if(document.getElementById('acc-precio-ars')) document.getElementById('acc-precio-ars').value=a.precioARS||'';
  if(document.getElementById('acc-notas')) document.getElementById('acc-notas').value=a.notas||'';
  if(document.getElementById('acc-url')) document.getElementById('acc-url').value=a.url||'';
  document.getElementById('acc-codigo').value=a.codigo||'';
  document.getElementById('acc-codigo-display').textContent=a.codigo||'—';
  const imgVal=a.imagen||'';
  document.getElementById('acc-imagen').value=imgVal;
  if(imgVal){ document.getElementById('acc-img-preview').innerHTML=`<img src="${imgVal}" style="width:100%;height:100%;object-fit:cover;border-radius:10px">`; }
  else{ resetImgPreview('acc-img-preview','acc-imagen'); }
}

// ════════════════════════════════
// PRESUPUESTOS — CRUD
// ════════════════════════════════
let _filtroPresupuestos = 'todos';
let _presupItems = [];
let _presupExtras = [];

function nextPresupNumero(){
  if(!DB.presupuestos||!DB.presupuestos.length) return 'PRES-0001';
  const nums=DB.presupuestos.map(p=>parseInt((p.numero||'PRES-0000').split('-')[1]||0)).filter(n=>!isNaN(n));
  return 'PRES-'+String((nums.length?Math.max(...nums):0)+1).padStart(4,'0');
}

function openPresupuestoModal(editId=''){
  document.getElementById('presupuesto-edit-id').value='';
  document.getElementById('presup-modal-title').textContent='Nuevo Presupuesto';
  clearForm(['presup-destinatario','presup-contacto','presup-negocio','presup-notas','presup-descuento','presup-validez']);
  document.getElementById('presup-moneda').value='USD';
  document.getElementById('presup-cliente-tipo').value='manual';
  document.getElementById('presup-cliente-manual').style.display='';
  const extToggle=document.getElementById('presup-extras-toggle');
  if(extToggle) extToggle.checked=false;
  const extCont=document.getElementById('presup-extras-container');
  if(extCont) extCont.style.display='none';
  const desglosar=document.getElementById('presup-desglosar');
  if(desglosar) desglosar.checked=false;
  document.getElementById('presup-negocio').value='MarcanoTech';
  document.getElementById('presup-fecha').value=new Date().toISOString().split('T')[0];
  const num=nextPresupNumero();
  document.getElementById('presup-numero').value=num;
  document.getElementById('presup-num-display').textContent=num;
  _presupItems=[{id:uid(),desc:'',cant:1,precio:0}];
  _presupExtras=[];
  renderPresupItems();
  updatePresupTotal();
  openModal('modal-presupuesto');
}

function savePresupuesto(estado='borrador'){
  const editId=document.getElementById('presupuesto-edit-id').value;
  const items=_presupItems.filter(i=>i.desc&&i.desc.trim());
  if(!items.length){ showToast('Agregá al menos un ítem','error'); return; }
  const destinatario=document.getElementById('presup-destinatario').value.trim();
  if(!destinatario){ showToast('Ingresá el destinatario','error'); return; }
  const subtotal=_presupItems.reduce((a,i)=>a+(i.cant||1)*(i.precio||0),0);
  const desc=parseFloat(document.getElementById('presup-descuento').value)||0;
  const total=subtotal*(1-desc/100);
  const obj={
    id:editId||uid(),
    numero:document.getElementById('presup-numero').value,
    fecha:document.getElementById('presup-fecha').value,
    estado, items:_presupItems.map(i=>({...i})), extras:_presupExtras.map(i=>({...i})),
    moneda:document.getElementById('presup-moneda').value, descuento:desc,
    subtotal, total, destinatario,
    contacto:document.getElementById('presup-contacto').value,
    negocio:document.getElementById('presup-negocio').value||'MarcanoTech',
    validez:document.getElementById('presup-validez').value||'',
    notas:document.getElementById('presup-notas').value,
    desglosar:document.getElementById('presup-desglosar')?.checked||false,
    dolarRate:_dolarRate||null, ts:Date.now()
  };
  if(editId){ DB.presupuestos=DB.presupuestos.map(p=>p.id===editId?obj:p); }
  else{ DB.presupuestos.push(obj); logActivity(`Presupuesto <strong>${obj.numero}</strong> creado`); }
  persist('presupuestos'); updateBadges(); closeModal('modal-presupuesto');
  renderSection(currentSection);
  showToast(`Presupuesto ${estado==='borrador'?'guardado como borrador':'guardado ✓'}`);
}

function deletePresupuesto(id){
  if(!confirm('¿Eliminar este presupuesto?')) return;
  DB.presupuestos=DB.presupuestos.filter(p=>p.id!==id);
  persist('presupuestos'); updateBadges(); renderSection(currentSection);
}

function editPresupuesto(id){
  const p=DB.presupuestos.find(x=>x.id===id); if(!p) return;
  openPresupuestoModal(id);
  document.getElementById('presupuesto-edit-id').value=p.id;
  document.getElementById('presup-modal-title').textContent='Editar Presupuesto';
  document.getElementById('presup-numero').value=p.numero;
  document.getElementById('presup-num-display').textContent=p.numero;
  document.getElementById('presup-fecha').value=p.fecha||'';
  document.getElementById('presup-moneda').value=p.moneda||'USD';
  document.getElementById('presup-descuento').value=p.descuento||'';
  document.getElementById('presup-destinatario').value=p.destinatario||'';
  document.getElementById('presup-contacto').value=p.contacto||'';
  document.getElementById('presup-negocio').value=p.negocio||'MarcanoTech';
  document.getElementById('presup-validez').value=p.validez||'';
  document.getElementById('presup-notas').value=p.notas||'';
  _presupItems=p.items&&p.items.length?p.items.map(i=>({...i})):[{id:uid(),desc:'',cant:1,precio:0}];
  _presupExtras=p.extras?p.extras.map(i=>({...i})):[];
  renderPresupItems(); updatePresupTotal();
}

function cambiarEstadoPresupuesto(id, nuevoEstado){
  DB.presupuestos=DB.presupuestos.map(p=>p.id===id?{...p,estado:nuevoEstado}:p);
  persist('presupuestos'); renderSection(currentSection);
  showToast(`Estado: ${nuevoEstado}`);
}

function filterPresupuestos(f, btn){
  _filtroPresupuestos=f;
  document.querySelectorAll('#sec-presupuestos .tab').forEach(t=>t.classList.remove('active'));
  if(btn) btn.classList.add('active');
  renderPresupuestos(f);
}

function renderPresupuestos(filter){
  filter=filter||_filtroPresupuestos||'todos';
  const sr=document.getElementById('presup-stats-row');
  if(sr){
    const total=DB.presupuestos.length;
    const aceptados=DB.presupuestos.filter(p=>p.estado==='aceptado');
    const pendientes=DB.presupuestos.filter(p=>p.estado==='enviado');
    const totalAcept=aceptados.reduce((a,p)=>a+(p.moneda==='USD'?p.total:(p.total/(_dolarRate||1))),0);
    sr.innerHTML=`
      <div class="stat-card"><div class="stat-label">Total</div><div class="stat-value">${total}</div><div class="stat-delta neutral">presupuestos</div></div>
      <div class="stat-card"><div class="stat-label">Pendientes</div><div class="stat-value" style="color:var(--amber)">${pendientes.length}</div><div class="stat-delta neutral">enviados</div></div>
      <div class="stat-card"><div class="stat-label">Aceptados</div><div class="stat-value" style="color:var(--teal)">${aceptados.length}</div><div class="stat-delta up">$${totalAcept.toFixed(0)} USD</div></div>
      <div class="stat-card"><div class="stat-label">Borradores</div><div class="stat-value">${DB.presupuestos.filter(p=>p.estado==='borrador').length}</div></div>`;
  }
  const list=document.getElementById('presupuestos-list'); if(!list) return;
  const data=filter==='todos'?DB.presupuestos:DB.presupuestos.filter(p=>p.estado===filter);
  if(!data.length){
    list.innerHTML=`<div class="add-card" style="min-height:140px" onclick="openPresupuestoModal()">
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>
      <span>Crear primer presupuesto</span></div>`; return;
  }
  const stColors={borrador:'var(--text3)',enviado:'var(--blue)',aceptado:'var(--teal)',rechazado:'var(--coral)',vencido:'var(--amber)'};
  const stIcons={borrador:'📝',enviado:'📤',aceptado:'✅',rechazado:'❌',vencido:'⏰'};
  list.innerHTML=[...data].reverse().map(p=>{
    const sc=stColors[p.estado]||'var(--text3)';
    const arsStr=p.moneda==='USD'&&_dolarRate?` / $${Math.round(p.total*_dolarRate).toLocaleString('es-AR')} ARS`:'';
    return `<div class="panel" style="margin-bottom:10px;border:0.5px solid var(--border)">
      <div style="display:flex;align-items:flex-start;justify-content:space-between;gap:12px;flex-wrap:wrap">
        <div style="flex:1;min-width:0">
          <div style="display:flex;align-items:center;gap:8px;margin-bottom:4px;flex-wrap:wrap">
            <span style="font-family:var(--mono);font-size:11px;font-weight:700;color:var(--ferrari)">${p.numero}</span>
            <span class="badge" style="background:${sc}22;color:${sc}">${stIcons[p.estado]||''} ${p.estado}</span>
          </div>
          <div style="font-size:14px;font-weight:700;color:var(--text)">${p.destinatario}</div>
          <div style="font-size:11px;color:var(--text3);font-family:var(--mono)">${p.negocio||''} · ${p.fecha||'—'}</div>
        </div>
        <div style="text-align:right;flex-shrink:0">
          <div style="font-size:20px;font-weight:700;color:var(--ferrari);font-family:var(--mono)">$${parseFloat(p.total||0).toFixed(2)} ${p.moneda||'USD'}</div>
          <div style="font-size:10px;color:var(--text3);font-family:var(--mono)">${arsStr}${p.items?` · ${p.items.length} ítems`:''}</div>
        </div>
      </div>
      <div style="display:flex;gap:6px;margin-top:10px;flex-wrap:wrap">
        <button class="btn btn-ghost btn-sm" onclick="editPresupuesto('${p.id}')">Editar</button>
        ${p.estado!=='aceptado'?`<button class="btn btn-sm" style="background:rgba(56,217,169,0.1);color:var(--teal);border:0.5px solid rgba(56,217,169,0.2)" onclick="cambiarEstadoPresupuesto('${p.id}','aceptado')">✓ Aceptado</button>`:''}
        ${p.estado==='enviado'?`<button class="btn btn-sm" style="background:rgba(255,107,91,0.1);color:var(--coral);border:0.5px solid rgba(255,107,91,0.2)" onclick="cambiarEstadoPresupuesto('${p.id}','rechazado')">✕ Rechazado</button>`:''}
        <button class="btn btn-ghost btn-sm" onclick="exportPresupuestoPDFById('${p.id}')">PDF</button>
        <button class="btn btn-sm" style="background:#25D36622;color:#25D366;border:0.5px solid #25D36644" onclick="enviarWhatsAppById('${p.id}')">WhatsApp</button>
        <button class="btn btn-danger btn-sm" onclick="deletePresupuesto('${p.id}')">✕</button>
      </div>
    </div>`;
  }).join('');
}

function buildPresupuestoText(p){
  const items=p.items||[];
  const lineas=items.map(i=>`  • ${i.cant}× ${i.desc}: $${((i.cant||1)*(i.precio||0)).toFixed(2)} ${p.moneda||'USD'}`).join('\n');
  return `PRESUPUESTO ${p.numero}\n${'─'.repeat(38)}\nFecha: ${p.fecha||'—'}${p.validez?`  |  Válido: ${p.validez} días`:''}\nDE: ${p.negocio||'MarcanoTech'}\nPARA: ${p.destinatario}${p.contacto?'\n'+p.contacto:''}\n${'─'.repeat(38)}\nÍTEMS:\n${lineas}\n${'─'.repeat(38)}\n${p.descuento?`Subtotal: $${parseFloat(p.subtotal||0).toFixed(2)}\nDescuento ${p.descuento}%: -$${(parseFloat(p.subtotal||0)-parseFloat(p.total||0)).toFixed(2)}\n`:''}TOTAL: $${parseFloat(p.total||0).toFixed(2)} ${p.moneda||'USD'}${p.moneda==='USD'&&p.dolarRate?`\n≈ $${Math.round(p.total*p.dolarRate).toLocaleString('es-AR')} ARS`:''}\n${'─'.repeat(38)}\n${p.notas?'NOTAS:\n'+p.notas+'\n':''}\nMarcanoTech Workshop Dashboard`;
}

function exportPresupuestoPDFById(id){
  const p=DB.presupuestos.find(x=>x.id===id); if(!p) return;
  const blob=new Blob([buildPresupuestoText(p)],{type:'text/plain;charset=utf-8'});
  const a=document.createElement('a'); a.href=URL.createObjectURL(blob);
  a.download=`${p.numero}_${p.destinatario.replace(/\s+/g,'_')}.txt`; a.click();
  showToast('Resumen descargado ✓');
}

function exportPresupuestoPDF(){
  const id=document.getElementById('presupuesto-edit-id').value;
  if(id) exportPresupuestoPDFById(id); else showToast('Guardá el presupuesto primero','error');
}

function enviarWhatsAppById(id){
  const p=DB.presupuestos.find(x=>x.id===id); if(!p) return;
  const tel=p.contacto?p.contacto.replace(/\D/g,''):'';
  window.open(`https://wa.me/${tel}?text=${encodeURIComponent(buildPresupuestoText(p))}`,'_blank');
}

function enviarWhatsApp(){
  const id=document.getElementById('presupuesto-edit-id').value;
  if(id) enviarWhatsAppById(id); else showToast('Guardá el presupuesto primero','error');
}

function enviarEmail(){
  const id=document.getElementById('presupuesto-edit-id').value;
  const p=id?DB.presupuestos.find(x=>x.id===id):null; if(!p) return;
  const mail=p.contacto&&p.contacto.includes('@')?p.contacto:'';
  window.location.href=`mailto:${mail}?subject=Presupuesto ${p.numero}&body=${encodeURIComponent(buildPresupuestoText(p))}`;
}

function renderPresupItems(){
  const cont=document.getElementById('presup-items-container'); if(!cont) return;
  cont.innerHTML=_presupItems.map((item,i)=>`
    <div style="background:var(--bg3);border-radius:var(--r);padding:12px;border:0.5px solid var(--border);margin-bottom:8px">
      <div class="form-group" style="margin-bottom:8px">
        <label class="form-label">Producto / servicio ${i+1}</label>
        <input class="form-input" value="${item.desc||''}" placeholder="Nombre del producto o servicio"
          oninput="_presupItems[${i}].desc=this.value">
      </div>
      <div style="display:flex;gap:8px;align-items:flex-end">
        <div style="flex:1"><label class="form-label">Cant.</label>
          <input class="form-input" type="number" value="${item.cant||1}" min="1" step="0.5"
            oninput="_presupItems[${i}].cant=parseFloat(this.value)||1;updatePresupTotal()"></div>
        <div style="flex:2"><label class="form-label">Precio unit.</label>
          <input class="form-input" type="number" value="${item.precio||''}" placeholder="0.00" step="0.01"
            oninput="_presupItems[${i}].precio=parseFloat(this.value)||0;updatePresupTotal()"></div>
        <div style="flex:2"><label class="form-label">Subtotal</label>
          <div style="background:var(--bg2);border:0.5px solid var(--border);border-radius:8px;padding:9px 12px;font-family:var(--mono);font-size:13px;color:var(--ferrari)">
            $${((item.cant||1)*(item.precio||0)).toFixed(2)}</div></div>
        ${_presupItems.length>1?`<button onclick="removePresupItem(${i})" style="background:rgba(255,107,91,0.1);border:none;border-radius:8px;padding:9px 10px;color:var(--coral);cursor:pointer">✕</button>`:''}
      </div>
    </div>`).join('');
}

function addPresupItem(){ _presupItems.push({id:uid(),desc:'',cant:1,precio:0}); renderPresupItems(); }
function removePresupItem(i){ _presupItems.splice(i,1); renderPresupItems(); updatePresupTotal(); }

function togglePresupExtras(on){
  const cont=document.getElementById('presup-extras-container');
  const slider=document.getElementById('presup-extras-slider');
  if(cont) cont.style.display=on?'block':'none';
  if(slider) slider.style.background=on?'var(--accent)':'var(--border2)';
  if(on&&_presupExtras.length===0){ _presupExtras=[{id:uid(),desc:'',precio:0}]; renderPresupExtras(); }
}

function renderPresupExtras(){
  const cont=document.getElementById('presup-extras-container'); if(!cont) return;
  cont.innerHTML=_presupExtras.map((item,i)=>`
    <div style="display:flex;gap:8px;align-items:flex-end;margin-bottom:8px">
      <div style="flex:3"><label class="form-label">Ítem informativo</label>
        <input class="form-input" value="${item.desc||''}" placeholder="Descripción" oninput="_presupExtras[${i}].desc=this.value"></div>
      <div style="flex:2"><label class="form-label">Valor ref.</label>
        <input class="form-input" type="number" value="${item.precio||''}" placeholder="0.00" step="0.01"
          oninput="_presupExtras[${i}].precio=parseFloat(this.value)||0"></div>
      <button onclick="_presupExtras.splice(${i},1);renderPresupExtras()" style="background:rgba(255,107,91,0.1);border:none;border-radius:8px;padding:9px 10px;color:var(--coral);cursor:pointer">✕</button>
    </div>`).join('')+
    `<button onclick="_presupExtras.push({id:uid(),desc:'',precio:0});renderPresupExtras()" style="width:100%;padding:8px;border-radius:7px;border:0.5px dashed var(--border2);background:none;color:var(--text3);font-size:12px;cursor:pointer;font-family:var(--font)">+ Agregar cotización extra</button>`;
}

function toggleClienteManual(val){ document.getElementById('presup-cliente-manual').style.display=val==='manual'?'':'none'; }

function updatePresupTotal(){
  const subtotal=_presupItems.reduce((a,i)=>a+(i.cant||1)*(i.precio||0),0);
  const desc=parseFloat(document.getElementById('presup-descuento')?.value)||0;
  const total=subtotal*(1-desc/100);
  const moneda=document.getElementById('presup-moneda')?.value||'USD';
  const fmt=n=>moneda==='ARS'?`$${n.toLocaleString('es-AR',{minimumFractionDigits:2})}`:`$${n.toFixed(2)}`;
  const sub=document.getElementById('presup-subtotal'); if(sub) sub.textContent=fmt(subtotal);
  const descRow=document.getElementById('presup-desc-row'); if(descRow) descRow.style.display=desc>0?'flex':'none';
  const descVal=document.getElementById('presup-desc-val'); if(descVal) descVal.textContent=`-${fmt(subtotal-total)}`;
  const tot=document.getElementById('presup-total-display'); if(tot) tot.textContent=`${fmt(total)} ${moneda}`;
  const arsEl=document.getElementById('presup-total-ars');
  if(arsEl){ arsEl.textContent=moneda==='USD'&&_dolarRate?`≈ $${Math.round(total*_dolarRate).toLocaleString('es-AR')} ARS`:moneda==='ARS'&&_dolarRate?`≈ $${(total/_dolarRate).toFixed(2)} USD`:''; }
  renderPresupItems();
}

// ════════════════════════════════
// ACCESORIOS — CARD GRID
// ════════════════════════════════
let _filtroAccesorios = 'todos';
function filterAccesorios(f, btn){
  _filtroAccesorios = f;
  document.querySelectorAll('#sec-accesorios .tab').forEach(t=>t.classList.remove('active'));
  if(btn) btn.classList.add('active');
  renderAccesorios();
}

function renderAccesorios(){
  // Stats by category
  const sr = document.getElementById('accesorios-stats-row');
  if(sr){
    const cats=['Adhesivo','Herramienta','Consumible','Repuesto','Electrónica','Otro'];
    const total = DB.accesorios.length;
    const bajo = DB.accesorios.filter(a=>a.stockMin>0&&a.stock<a.stockMin).length;
    sr.innerHTML = `
      <div class="stat-card"><div class="stat-label">Total</div><div class="stat-value">${total}</div><div class="stat-delta neutral">registrados</div></div>
      ${cats.map(cat=>{const n=DB.accesorios.filter(a=>a.categoria===cat).length;return n>0?`<div class="stat-card"><div class="stat-label">${cat}</div><div class="stat-value">${n}</div><div class="stat-delta neutral">ítems</div></div>`:''}).join('')}
      ${bajo>0?`<div class="stat-card"><div class="stat-label">Stock bajo</div><div class="stat-value" style="color:var(--amber)">${bajo}</div><div class="stat-delta neutral">reponer</div></div>`:''}`;
  }
  const f = _filtroAccesorios||'todos';
  let list = f==='todos' ? DB.accesorios : DB.accesorios.filter(a=>a.categoria===f);
  const tbody = document.getElementById('accesorios-tbody');
  if(!tbody) return;
  if(!list.length){
    tbody.innerHTML=`<tr><td colspan="8" style="text-align:center;padding:32px;color:var(--text3)">
      <div style="cursor:pointer" onclick="openAccesorioModal()">Sin accesorios — <span style="color:var(--ferrari)">+ Agregar</span></div></td></tr>`;
    return;
  }
  const stColors={ok:'var(--teal)',bajo:'var(--amber)',vacio:'var(--coral)'};
  tbody.innerHTML = list.map(a=>{
    const pct = a.stockMin>0 ? a.stock/a.stockMin : 1;
    const st = pct>=1?'ok':pct>0?'bajo':'vacio';
    const sc = stColors[st];
    const arsStr = a.precioARS ? `$${parseFloat(a.precioARS).toLocaleString('es-AR',{minimumFractionDigits:2,maximumFractionDigits:2})}` : a.precio ? `US$${parseFloat(a.precio||0).toFixed(2)}` : '—';
    return `<tr>
      <td><span style="font-family:var(--mono);font-size:11px;color:var(--ferrari);font-weight:700">${a.codigo||'—'}</span></td>
      <td style="max-width:260px">
        <div style="display:flex;align-items:center;gap:8px">
          ${a.imagen?`<img src="${a.imagen}" style="width:32px;height:32px;object-fit:cover;border-radius:6px;flex-shrink:0">`:`<div style="width:32px;height:32px;background:var(--bg3);border-radius:6px;flex-shrink:0"></div>`}
          <div style="min-width:0;flex:1">
            <strong style="font-size:12px;display:block">${a.nombre}</strong>
            ${a.url?`<a href="${a.url}" target="_blank" style="font-size:10px;color:var(--blue);text-decoration:none;font-family:var(--mono)">🔗 Ver compra</a>`:(a.marca&&a.marca!=='—'?`<span style="font-size:10px;color:var(--text3)">${a.marca}</span>`:'')}
          </div>
        </div>
      </td>
      <td><span class="badge badge-gray">${a.categoria}</span></td>
      <td style="font-family:var(--mono);font-size:12px;color:${sc};font-weight:700">${a.stock} ${a.unidad||'Und'}</td>
      <td style="font-family:var(--mono);font-size:11px;color:var(--text3)">${a.stockMin||0}</td>
      <td style="font-size:12px;font-family:var(--mono)">${arsStr}</td>
      <td>
        <div style="display:flex;gap:4px">
          <button class="btn btn-ghost btn-sm" onclick="editAccesorio('${a.id}')">Editar</button>
          <button class="btn btn-danger btn-sm" onclick="deleteAccesorio('${a.id}')">✕</button>
        </div>
      </td>
    </tr>`;
  }).join('');
}

// ════════════════════════════════
// ACERCA DE
// ════════════════════════════════
function renderAcercaDe(){
  const vb = document.getElementById('version-badge-main');
  const vn = document.getElementById('acercade-app-name'); if(vn) vn.textContent = APP_VERSION.nombre||'Marcano Tech';
  const vf = document.getElementById('version-fecha-main');
  if(vb) vb.textContent = APP_VERSION.version;
  if(vf) vf.textContent = APP_VERSION.fecha;

  // stats removed
  const cl = document.getElementById('changelog-list');
  if(!cl) return;
  cl.innerHTML = APP_VERSION.changelog.map((ver,i)=>`
    <div style="background:var(--bg2);border-radius:var(--r2);border:0.5px solid var(--border);overflow:hidden;margin-bottom:10px">
      <div style="display:flex;align-items:center;justify-content:space-between;padding:12px 16px;background:var(--bg3);border-bottom:0.5px solid var(--border);cursor:pointer"
        onclick="this.nextElementSibling.style.display=this.nextElementSibling.style.display==='none'?'block':'none'">
        <div style="display:flex;align-items:center;gap:10px">
          <span style="font-size:15px;font-weight:700;font-family:var(--mono);color:${i===0?'var(--accent)':'var(--text)'}">${ver.v}</span>
          ${i===0?`<span style="background:rgba(232,255,71,0.15);color:var(--ferrari);font-size:10px;padding:2px 8px;border-radius:20px;font-family:var(--mono);font-weight:700">ACTUAL</span>`:''}
        </div>
        <span style="font-size:11px;color:var(--text3);font-family:var(--mono)">${ver.fecha}</span>
      </div>
      <div style="${i===0?'display:block':'display:none'};padding:12px 16px">
        ${ver.cambios.map(c=>`
          <div style="display:flex;gap:8px;padding:5px 0;border-bottom:0.5px solid var(--border);font-size:12px;color:var(--text2)">
            <span style="color:var(--teal);flex-shrink:0">✓</span><span>${c}</span>
          </div>`).join('')}
      </div>
    </div>`).join('');
}

// ════════════════════════════════
// SECTION ROUTER
// ════════════════════════════════
function renderSection(id){
  if(id==='dashboard') renderDashboard();
  else if(id==='proyectos'){ document.getElementById('proyectos-grid').innerHTML=renderProyectos(_filtroProyectos); }
  else if(id==='impresoras') renderImpresoras();
  else if(id==='cola') renderCola();
  else if(id==='materiales') renderMateriales();
  else if(id==='accesorios') renderAccesorios();
  else if(id==='calibracion') renderCalibracion(_filtroCalibracion);
  else if(id==='presupuestos') renderPresupuestos(_filtroPresupuestos);
  else if(id==='clientes') renderClientes();
  else if(id==='cotizaciones') renderCotizaciones();
  else if(id==='productos') renderProductos();
  else if(id==='piezas') renderPiezas();
  else if(id==='costos') renderCostos();
  else if(id==='mantenimiento') renderMantenimiento();
  else if(id==='estadisticas') renderEstadisticas();
  else if(id==='ventas') renderVentas();
  else if(id==='componentes') renderComponentes(_filtroComponentes);
  else if(id==='timer') renderTimer();
  else if(id==='graficos') renderGraficos();
  else if(id==='acercade') renderAcercaDe();
  else if(id==='portalclientes') { /* cargado por showSection */ }
}

// ════════════════════════════════
// BADGES
// ════════════════════════════════
function updateBadges(){
  document.getElementById('badge-proyectos').textContent=DB.proyectos.length;
  document.getElementById('badge-impresoras').textContent=DB.impresoras.length;
  document.getElementById('badge-cola').textContent=DB.cola.length;
  document.getElementById('badge-materiales').textContent=DB.materiales.length;
  document.getElementById('badge-productos').textContent=DB.productos.length;
  document.getElementById('badge-piezas').textContent=DB.piezas.length;
  document.getElementById('badge-ventas').textContent=DB.ventas.length;
  document.getElementById('badge-componentes').textContent=DB.componentes.length;
  document.getElementById('badge-accesorios').textContent=DB.accesorios.length;
  document.getElementById('badge-calibracion').textContent=DB.calibracion.length;
  document.getElementById('badge-presupuestos').textContent=DB.presupuestos.length;
  if(document.getElementById('badge-cotizaciones')) document.getElementById('badge-cotizaciones').textContent=(DB.cotizaciones||[]).length;
  document.getElementById('badge-clientes').textContent=DB.clientes.length;
  const bajos=DB.materiales.filter(m=>(m.stock/m.total)<0.2);
  const bajosAcc=DB.accesorios.filter(a=>a.stock<=(a.stockMin||1));
  const nd=document.getElementById('notif-dot');
  if(nd) nd.style.display=(bajos.length>0||bajosAcc.length>0)?'':'none';
  if(bajos.length>0) checkStockAlerts(bajos);
}

// ════════════════════════════════
// STOCK ALERTS
// ════════════════════════════════
let _alertsShown = {};
function checkStockAlerts(bajos){
  bajos.forEach(m=>{
    const key = m.id+'_alert';
    if(!_alertsShown[key]){
      _alertsShown[key] = true;
      showToast(`⚠ Stock bajo: ${m.tipo} ${m.color} (${m.stock}g restantes)`, 'warning');
    }
  });
}

// ════════════════════════════════
// VENTAS
// ════════════════════════════════
function calcVentaTotal(){
  const cant=parseInt(document.getElementById('venta-cantidad').value)||1;
  const precio=parseFloat(document.getElementById('venta-precio').value)||0;
  document.getElementById('venta-total').value=(cant*precio).toFixed(2);
}

function saveVenta(){
  const editId=document.getElementById('venta-edit-id').value;
  const cant=parseInt(document.getElementById('venta-cantidad').value)||1;
  const precio=parseFloat(document.getElementById('venta-precio').value)||0;
  const obj={
    id:editId||uid(),
    producto:document.getElementById('venta-producto').value.trim(),
    cantidad:cant,
    precio,
    total:cant*precio,
    cliente:document.getElementById('venta-cliente').value,
    fecha:document.getElementById('venta-fecha').value,
    canal:document.getElementById('venta-canal').value,
    estado:document.getElementById('venta-estado').value,
    notas:document.getElementById('venta-notas').value,
    ts:Date.now()
  };
  if(!obj.producto){ showToast('Ingresá un producto','error'); return; }
  if(editId){ DB.ventas=DB.ventas.map(v=>v.id===editId?obj:v); }
  else{ DB.ventas.push(obj); logActivity(`Venta registrada: <strong>${obj.producto}</strong> — $${obj.total.toFixed(2)}`,'success'); }
  persist(KEYS.ventas); updateBadges(); closeModal('modal-venta');
  document.getElementById('venta-edit-id').value='';
  clearForm(['venta-producto','venta-cantidad','venta-precio','venta-total','venta-cliente','venta-notas']);
  renderSection(currentSection); showToast('Venta guardada ✓');
}

function deleteVenta(id){
  if(!confirm('¿Eliminar esta venta?')) return;
  DB.ventas=DB.ventas.filter(v=>v.id!==id);
  persist(KEYS.ventas); updateBadges(); renderSection(currentSection);
}

function renderVentas(){
  // Stats
  const sr=document.getElementById('ventas-stats-row');
  const totalCobrado=DB.ventas.filter(v=>v.estado==='cobrado').reduce((a,v)=>a+v.total,0);
  const totalPendiente=DB.ventas.filter(v=>v.estado==='pendiente').reduce((a,v)=>a+v.total,0);
  const thisMonth=new Date().toISOString().slice(0,7);
  const ventasMes=DB.ventas.filter(v=>v.fecha&&v.fecha.startsWith(thisMonth));
  const totalMes=ventasMes.reduce((a,v)=>a+v.total,0);
  if(sr) sr.innerHTML=`
    <div class="stat-card"><div class="stat-label">Total cobrado</div><div class="stat-value">$${totalCobrado.toFixed(0)}</div><div class="stat-delta neutral" style="font-size:10px">${usdToArs(totalCobrado)?'≈ $'+Math.round(usdToArs(totalCobrado)).toLocaleString('es-AR')+' ARS':''}</div><div class="stat-delta up">${DB.ventas.filter(v=>v.estado==='cobrado').length} ventas</div></div>
    <div class="stat-card"><div class="stat-label">Pendiente cobro</div><div class="stat-value" style="color:var(--amber)">$${totalPendiente.toFixed(0)}</div><div class="stat-delta neutral">${DB.ventas.filter(v=>v.estado==='pendiente').length} pendientes</div></div>
    <div class="stat-card"><div class="stat-label">Este mes</div><div class="stat-value">$${totalMes.toFixed(0)}</div><div class="stat-delta neutral">${ventasMes.length} ventas</div></div>
    <div class="stat-card"><div class="stat-label">Total ventas</div><div class="stat-value">${DB.ventas.length}</div><div class="stat-delta neutral">historial completo</div></div>`;

  const tbody=document.getElementById('ventas-tbody'); if(!tbody) return;
  if(!DB.ventas.length){ tbody.innerHTML=`<tr><td colspan="8" style="text-align:center;color:var(--text3);padding:24px;font-family:var(--mono);font-size:12px">Sin ventas registradas</td></tr>`; return; }
  const stMap={cobrado:{l:'cobrado',c:'var(--teal)'},pendiente:{l:'pendiente',c:'var(--amber)'},cancelado:{l:'cancelado',c:'var(--coral)'}};
  tbody.innerHTML=[...DB.ventas].reverse().map(v=>{
    const st=stMap[v.estado]||{l:v.estado,c:'var(--text3)'};
    return `<tr>
      <td class="mono">${v.fecha||'—'}</td>
      <td><strong>${v.producto}</strong>${v.notas?`<div style="font-size:10px;color:var(--text3)">${v.notas}</div>`:''}</td>
      <td class="mono">${v.cantidad}</td>
      <td class="mono">$${parseFloat(v.precio||0).toFixed(2)}</td>
      <td class="mono" style="color:var(--ferrari);font-weight:700">$${parseFloat(v.total||0).toFixed(2)}</td>
      <td>${v.cliente||'—'}<div style="font-size:10px;color:var(--text3);font-family:var(--mono)">${v.canal||''}</div></td>
      <td><span class="badge" style="background:${st.c}22;color:${st.c}">${st.l}</span></td>
      <td>
        <div style="display:flex;gap:4px">
          ${v.estado==='pendiente'?`<button class="btn btn-ghost btn-sm" onclick="editVenta('${v.id}')">Editar</button>`:''}
          <button class="btn btn-danger btn-sm" onclick="deleteVenta('${v.id}')">✕</button>
        </div>
      </td>
    </tr>`;
  }).join('');
}

// ════════════════════════════════
// COMPONENTES RC
// ════════════════════════════════
const compEmojis={motor:'⚡',esc:'🎛️',servo:'🔧',bateria:'🔋',radio:'📡',otro:'🔩'};
const compColors={motor:'var(--amber)',esc:'var(--blue)',servo:'var(--teal)',bateria:'var(--green)',radio:'var(--purple)',otro:'var(--text2)'};
let _filtroComponentes='todos';

function saveComponente(){
  const editId=document.getElementById('comp-edit-id').value;
  const obj={
    id:editId||uid(),
    nombre:document.getElementById('comp-nombre').value.trim(),
    categoria:document.getElementById('comp-categoria').value,
    marca:document.getElementById('comp-marca').value,
    modelo:document.getElementById('comp-modelo').value,
    stock:parseInt(document.getElementById('comp-stock').value)||1,
    precio:parseFloat(document.getElementById('comp-precio').value)||0,
    proyectoId:document.getElementById('comp-proyecto').value,
    estado:document.getElementById('comp-estado').value,
    specs:document.getElementById('comp-specs').value,
    emoji:document.getElementById('comp-emoji').value||compEmojis[document.getElementById('comp-categoria').value]||'🔩',
    imagen:document.getElementById('comp-imagen').value||'',
    codigo:document.getElementById('comp-codigo-val').value||nextCompCodigo(),
    precioARS:parseFloat(document.getElementById('comp-precio-ars')?.value)||0,
    url:document.getElementById('comp-url')?.value||''
  };
  if(!obj.nombre){ showToast('Ingresá un nombre','error'); return; }
  if(editId){ DB.componentes=DB.componentes.map(c=>c.id===editId?obj:c); }
  else{ DB.componentes.push(obj); logActivity(`Componente <strong>${obj.nombre}</strong> agregado`); }
  persistWithStorage('componentes', DB.componentes); updateBadges(); closeModal('modal-componente');
  document.getElementById('comp-edit-id').value='';
  clearForm(['comp-nombre','comp-marca','comp-modelo','comp-specs','comp-emoji']);
  renderSection(currentSection); showToast('Componente guardado ✓');
}

function deleteComponente(id){
  if(!confirm('¿Eliminar este componente?')) return;
  DB.componentes=DB.componentes.filter(c=>c.id!==id);
  persist(KEYS.componentes); updateBadges(); renderSection(currentSection);
}

function editComponente(id){
  const c=DB.componentes.find(x=>x.id===id); if(!c) return;
  document.getElementById('comp-edit-id').value=c.id;
  document.getElementById('comp-nombre').value=c.nombre;
  document.getElementById('comp-categoria').value=c.categoria;
  document.getElementById('comp-marca').value=c.marca;
  document.getElementById('comp-modelo').value=c.modelo;
  document.getElementById('comp-stock').value=c.stock;
  document.getElementById('comp-precio').value=c.precio;
  document.getElementById('comp-estado').value=c.estado;
  document.getElementById('comp-specs').value=c.specs;
  document.getElementById('comp-emoji').value=c.emoji;
  populateModalSelects('modal-componente');
  document.getElementById('comp-proyecto').value=c.proyectoId||'';
  if(document.getElementById('comp-precio-ars')) document.getElementById('comp-precio-ars').value = c.precioARS||'';
  if(document.getElementById('comp-url')) document.getElementById('comp-url').value = c.url||'';
  const imgValC = c.imagen||'';
  document.getElementById('comp-imagen').value = imgValC;
  if(imgValC){ document.getElementById('comp-img-preview').innerHTML=`<img src="${imgValC}" style="width:100%;height:100%;object-fit:cover;border-radius:10px">`; }
  else{ resetImgPreview('comp-img-preview','comp-imagen'); }
  document.getElementById('comp-codigo-val').value = c.codigo||'';
  document.getElementById('comp-codigo-display').textContent = c.codigo||'—';
  openModal('modal-componente');
}

function filterComponentes(f,btn){
  _filtroComponentes=f;
  document.querySelectorAll('#sec-componentes .tab').forEach(t=>t.classList.remove('active'));
  if(btn) btn.classList.add('active');
  renderComponentes(f);
}

function renderComponentes(filter){
  // Stats
  const sr = document.getElementById('comp-stats-row');
  const total = DB.componentes.length;
  const disponibles = DB.componentes.filter(c=>c.estado==='disponible').length;
  const instalados = DB.componentes.filter(c=>c.estado==='instalado').length;
  const pedidos = DB.componentes.filter(c=>c.estado==='pedido').length;
  if(sr) sr.innerHTML=`
    <div class="stat-card"><div class="stat-label">Total</div><div class="stat-value">${total}</div><div class="stat-delta neutral">registrados</div></div>
    <div class="stat-card"><div class="stat-label">Disponibles</div><div class="stat-value" style="color:var(--teal)">${disponibles}</div><div class="stat-delta up">en stock</div></div>
    <div class="stat-card"><div class="stat-label">Instalados</div><div class="stat-value" style="color:var(--blue)">${instalados}</div><div class="stat-delta neutral">en uso</div></div>
    <div class="stat-card"><div class="stat-label">En pedido</div><div class="stat-value" style="color:var(--amber)">${pedidos}</div><div class="stat-delta neutral">pendientes</div></div>`;

  const _f = filter||_filtroComponentes||'todos';
  const list = _f==='todos'?DB.componentes:DB.componentes.filter(c=>c.categoria===_f);
  const grid = document.getElementById('componentes-grid'); if(!grid) return;
  if(!list.length){
    grid.innerHTML=`<tr><td colspan="7" style="text-align:center;padding:32px;color:var(--text3)"><div style="cursor:pointer" onclick="resetComponenteForm();openModal('modal-componente')">Sin componentes — <span style="color:var(--ferrari)">+ Agregar</span></div></td></tr>`;
    return;
  }
  const stColors={disponible:'var(--teal)',instalado:'var(--blue)',dañado:'var(--coral)',pedido:'var(--amber)'};
  grid.innerHTML = list.map(c=>{
    const sc = stColors[c.estado]||'var(--text3)';
    const arsStr = c.precioARS ? `$${parseFloat(c.precioARS).toLocaleString('es-AR',{minimumFractionDigits:2,maximumFractionDigits:2})}` : c.precio ? `US$${parseFloat(c.precio||0).toFixed(2)}` : '—';
    return `<tr>
      <td><span style="font-family:var(--mono);font-size:11px;color:var(--ferrari);font-weight:700">${c.codigo||'—'}</span></td>
      <td style="max-width:260px">
        <div style="display:flex;align-items:center;gap:8px">
          ${c.imagen?`<img src="${c.imagen}" style="width:32px;height:32px;object-fit:cover;border-radius:6px;flex-shrink:0">`:`<div style="width:32px;height:32px;background:var(--bg3);border-radius:6px;flex-shrink:0;display:flex;align-items:center;justify-content:center;font-size:16px">⚙️</div>`}
          <div style="min-width:0;flex:1">
            <strong style="font-size:12px;display:block">${c.nombre}</strong>
            <span style="font-size:10px;color:var(--text3)">${c.marca||''}${c.modelo?' / '+c.modelo:''}</span>
          </div>
        </div>
      </td>
      <td><span class="badge badge-gray">${c.categoria||'—'}</span></td>
      <td><span class="badge" style="background:${sc}22;color:${sc}">${c.estado||'—'}</span></td>
      <td style="font-family:var(--mono);font-size:12px">${c.stock||1}${c.stock>1?' Und':' Und'}</td>
      <td style="font-size:12px;font-family:var(--mono)">${arsStr}</td>
      <td>
        <div style="display:flex;gap:4px">
          <button class="btn btn-ghost btn-sm" onclick="editComponente('${c.id}')">Editar</button>
          <button class="btn btn-danger btn-sm" onclick="deleteComponente('${c.id}')">✕</button>
        </div>
      </td>
    </tr>`;
  }).join('');
}

// ════════════════════════════════
// CLIENTES / PROVEEDORES
// ════════════════════════════════
function nextClienteCodigo(){
  if(!DB.clientes||!DB.clientes.length) return 'CLI-0001';
  const nums = DB.clientes.map(c=>parseInt((c.codigo||'CLI-0000').split('-')[1]||0)).filter(n=>!isNaN(n));
  return 'CLI-'+String((nums.length?Math.max(...nums):0)+1).padStart(4,'0');
}

function openClienteModal(editId=''){
  document.getElementById('cliente-edit-id').value='';
  document.getElementById('cliente-modal-title').textContent='Nuevo Cliente / Proveedor';
  clearForm(['cliente-nombre','cliente-doc-nro','cliente-telefono','cliente-whatsapp','cliente-email','cliente-empresa','cliente-ciudad','cliente-provincia','cliente-direccion','cliente-notas','cliente-web']);
  document.getElementById('cliente-tipo').value='cliente';
  document.getElementById('cliente-doc-tipo').value='';
  const codigo=nextClienteCodigo();
  document.getElementById('cliente-codigo').value=codigo;
  document.getElementById('cliente-codigo-display').textContent=codigo;
  openModal('modal-cliente');
}

function saveCliente(){
  const editId=document.getElementById('cliente-edit-id').value;
  const nombre=document.getElementById('cliente-nombre').value.trim();
  if(!nombre){ showToast('Ingresá el nombre','error'); return; }
  const obj={
    id:editId||uid(),
    codigo:document.getElementById('cliente-codigo').value,
    nombre,
    tipo:document.getElementById('cliente-tipo').value,
    docTipo:document.getElementById('cliente-doc-tipo').value,
    docNro:document.getElementById('cliente-doc-nro').value,
    telefono:document.getElementById('cliente-telefono').value,
    whatsapp:document.getElementById('cliente-whatsapp').value,
    email:document.getElementById('cliente-email').value,
    empresa:document.getElementById('cliente-empresa').value,
    ciudad:document.getElementById('cliente-ciudad').value,
    provincia:document.getElementById('cliente-provincia').value,
    direccion:document.getElementById('cliente-direccion').value,
    web:document.getElementById('cliente-web').value||'',
    notas:document.getElementById('cliente-notas').value,
    ts:Date.now()
  };
  if(editId){ DB.clientes=DB.clientes.map(c=>c.id===editId?obj:c); }
  else{ DB.clientes.push(obj); logActivity(`Contacto <strong>${obj.nombre}</strong> registrado`); }
  persist(KEYS.clientes); updateBadges(); closeModal('modal-cliente'); renderSection(currentSection);
  showToast('Contacto guardado ✓');
}

function deleteCliente(id){
  if(!confirm('¿Eliminar este contacto?')) return;
  DB.clientes=DB.clientes.filter(c=>c.id!==id);
  persist(KEYS.clientes); updateBadges(); renderSection(currentSection);
}

function editCliente(id){
  const c=DB.clientes.find(x=>x.id===id); if(!c) return;
  openClienteModal(id);
  document.getElementById('cliente-edit-id').value=c.id;
  document.getElementById('cliente-modal-title').textContent='Editar Contacto';
  document.getElementById('cliente-codigo').value=c.codigo||'';
  document.getElementById('cliente-codigo-display').textContent=c.codigo||'—';
  document.getElementById('cliente-nombre').value=c.nombre||'';
  document.getElementById('cliente-tipo').value=c.tipo||'cliente';
  document.getElementById('cliente-doc-tipo').value=c.docTipo||'';
  document.getElementById('cliente-doc-nro').value=c.docNro||'';
  document.getElementById('cliente-telefono').value=c.telefono||'';
  document.getElementById('cliente-whatsapp').value=c.whatsapp||'';
  document.getElementById('cliente-email').value=c.email||'';
  document.getElementById('cliente-empresa').value=c.empresa||'';
  document.getElementById('cliente-ciudad').value=c.ciudad||'';
  document.getElementById('cliente-provincia').value=c.provincia||'';
  document.getElementById('cliente-direccion').value=c.direccion||'';
  if(document.getElementById('cliente-web')) document.getElementById('cliente-web').value=c.web||'';
  document.getElementById('cliente-notas').value=c.notas||'';
}

function renderClientes(){
  const sr=document.getElementById('clientes-stats-row');
  const total=DB.clientes.length;
  const cli=DB.clientes.filter(c=>c.tipo==='cliente'||c.tipo==='ambos').length;
  const prov=DB.clientes.filter(c=>c.tipo==='proveedor'||c.tipo==='ambos').length;
  if(sr) sr.innerHTML=`
    <div class="stat-card"><div class="stat-label">Total contactos</div><div class="stat-value">${total}</div><div class="stat-delta neutral">registrados</div></div>
    <div class="stat-card"><div class="stat-label">Clientes</div><div class="stat-value" style="color:var(--teal)">${cli}</div><div class="stat-delta up">compradores</div></div>
    <div class="stat-card"><div class="stat-label">Proveedores</div><div class="stat-value" style="color:var(--blue)">${prov}</div><div class="stat-delta neutral">vendedores</div></div>`;

  const search=(document.getElementById('clientes-search')?.value||'').toLowerCase();
  const fTipo=document.getElementById('clientes-filter-tipo')?.value||'';
  let list=DB.clientes.filter(c=>{
    if(fTipo && c.tipo!==fTipo) return false;
    if(search && !(`${c.nombre} ${c.empresa||''} ${c.email||''}`).toLowerCase().includes(search)) return false;
    return true;
  });

  // Split into two lists
  const tipoColors={cliente:'var(--teal)',proveedor:'var(--blue)',ambos:'var(--purple)'};
  const tipoLabels={cliente:'Cliente',proveedor:'Proveedor',ambos:'Cliente y Proveedor'};
  const clientes = list.filter(c=>c.tipo==='cliente'||c.tipo==='ambos');
  const proveedores = list.filter(c=>c.tipo==='proveedor'||c.tipo==='ambos');
  const grid=document.getElementById('clientes-grid'); if(!grid) return;

  function renderContactCard(c){
    const tc=tipoColors[c.tipo]||'var(--text3)';
    return `<tr>
      <td><span style="font-family:var(--mono);font-size:11px;color:var(--ferrari);font-weight:700">${c.codigo||'—'}</span></td>
      <td>
        <div style="font-size:13px;font-weight:700;color:var(--text)">${c.nombre}</div>
        ${c.empresa?`<div style="font-size:10px;color:var(--text3)">${c.empresa}</div>`:''}
      </td>
      <td style="font-size:12px;color:var(--text2)">${c.telefono||c.whatsapp||'—'}</td>
      <td style="font-size:12px;color:var(--text2)">${c.email||'—'}</td>
      <td style="font-size:11px;color:var(--text3)">${[c.ciudad,c.provincia].filter(Boolean).join(', ')||'—'}</td>
      <td>
        <div style="display:flex;gap:4px">
          ${c.whatsapp?`<a href="https://wa.me/${c.whatsapp.replace(/\D/g,'')}" target="_blank" class="btn btn-sm" style="background:#25D36622;color:#25D366;border:0.5px solid #25D36644;text-decoration:none;padding:3px 7px">💬</a>`:''}
          <button class="btn btn-ghost btn-sm" onclick="editCliente('${c.id}')">Editar</button>
          <button class="btn btn-danger btn-sm" onclick="deleteCliente('${c.id}')">✕</button>
        </div>
      </td>
    </tr>`;
  }

  const headers = '<tr><th>Código</th><th>Nombre</th><th>Teléfono</th><th>Email</th><th>Ubicación</th><th>Acciones</th></tr>';

  grid.innerHTML = `
    <div style="margin-bottom:20px">
      <div style="font-size:13px;font-weight:700;color:var(--teal);margin-bottom:8px;display:flex;align-items:center;gap:6px">
        <span>👤 Clientes</span><span style="font-size:11px;font-family:var(--mono);background:rgba(52,211,153,0.1);color:var(--teal);padding:1px 7px;border-radius:10px">${clientes.length}</span>
      </div>
      <div class="panel" style="overflow-x:auto;padding:0">
        <table class="data-table"><thead>${headers}</thead><tbody>
          ${clientes.length ? clientes.map(renderContactCard).join('') : '<tr><td colspan="6" style="text-align:center;padding:16px;color:var(--text3)">Sin clientes registrados</td></tr>'}
        </tbody></table>
      </div>
    </div>
    <div>
      <div style="font-size:13px;font-weight:700;color:var(--blue);margin-bottom:8px;display:flex;align-items:center;gap:6px">
        <span>🏢 Proveedores</span><span style="font-size:11px;font-family:var(--mono);background:rgba(249,115,22,0.1);color:var(--blue);padding:1px 7px;border-radius:10px">${proveedores.length}</span>
      </div>
      <div class="panel" style="overflow-x:auto;padding:0">
        <table class="data-table"><thead>${headers}</thead><tbody>
          ${proveedores.length ? proveedores.map(renderContactCard).join('') : '<tr><td colspan="6" style="text-align:center;padding:16px;color:var(--text3)">Sin proveedores registrados</td></tr>'}
        </tbody></table>
      </div>
    </div>`;
}


let _filtroCalibracion = 'todos';

function openCalModal(editId=''){
  document.getElementById('calibracion-edit-id').value = '';
  document.getElementById('cal-modal-title').textContent = 'Nuevo perfil de calibración';
  // Reset all fields
  clearForm(['cal-nombre','cal-temp-boquilla-1','cal-temp-boquilla-2',
    'cal-temp-cama-1','cal-temp-cama-2','cal-vel-impresion','cal-vel-primera',
    'cal-vel-perimetros','cal-vel-relleno','cal-retraccion','cal-vel-retraccion',
    'cal-fan','cal-notas']);
  document.getElementById('cal-layer-height').value = '0.20';
  document.getElementById('cal-flow').value = '100';
  document.getElementById('cal-rating').value = '3';
  document.getElementById('cal-estado').value = 'activo';
  document.getElementById('cal-camara').value = 'no';
  // Populate material and impresora selects
  const matSel = document.getElementById('cal-material-ref');
  const impSel = document.getElementById('cal-impresora-ref');
  matSel.innerHTML = '<option value="">Seleccionar material...</option>' +
    DB.materiales.map(m=>`<option value="${m.id}">${m.tipo} ${m.color} — ${m.marca}</option>`).join('');
  impSel.innerHTML = '<option value="">Seleccionar impresora...</option>' +
    DB.impresoras.map(i=>`<option value="${i.id}">${i.codigo||''} ${i.nombre}</option>`).join('');
  openModal('modal-calibracion');
}

function saveCalibracion(){
  try{
    const editId = document.getElementById('calibracion-edit-id').value;
    const matId = document.getElementById('cal-material-ref').value;
    if(!matId){ showToast('Seleccioná un material','error'); return; }
    const mat = DB.materiales.find(m=>m.id===matId);
    const imp = DB.impresoras.find(i=>i.id===document.getElementById('cal-impresora-ref').value);
    const obj = {
      id: editId||uid(),
      materialId: matId,
      materialNombre: mat ? `${mat.tipo} ${mat.color} — ${mat.marca}` : '—',
      materialTipo: mat ? mat.tipo : 'otro',
      materialColorHex: mat ? mat.colorHex : '#888',
      impresoraId: document.getElementById('cal-impresora-ref').value||'',
      impresoraNombre: imp ? imp.nombre : 'Marcano Tech',
      nombre: document.getElementById('cal-nombre').value || (mat?`${mat.tipo} ${mat.color} perfil`:'Perfil'),
      tempBoquilla1: document.getElementById('cal-temp-boquilla-1').value||'—',
      tempBoquilla2: document.getElementById('cal-temp-boquilla-2').value||'—',
      tempCama1: document.getElementById('cal-temp-cama-1').value||'—',
      tempCama2: document.getElementById('cal-temp-cama-2').value||'—',
      velImpresion: document.getElementById('cal-vel-impresion').value||'—',
      velPrimera: document.getElementById('cal-vel-primera').value||'—',
      velPerimetros: document.getElementById('cal-vel-perimetros').value||'—',
      velRelleno: document.getElementById('cal-vel-relleno').value||'—',
      retraccion: document.getElementById('cal-retraccion').value||'—',
      velRetraccion: document.getElementById('cal-vel-retraccion').value||'—',
      layerHeight: document.getElementById('cal-layer-height').value||'0.20',
      flow: document.getElementById('cal-flow').value||'100',
      fan: document.getElementById('cal-fan').value||'—',
      camara: document.getElementById('cal-camara').value||'no',
      rating: parseInt(document.getElementById('cal-rating').value)||3,
      estado: document.getElementById('cal-estado').value||'activo',
      notas: document.getElementById('cal-notas').value||'',
      fecha: editId ? (DB.calibracion.find(c=>c.id===editId)||{}).fecha||new Date().toISOString() : new Date().toISOString()
    };
    if(editId){ DB.calibracion = DB.calibracion.map(c=>c.id===editId?obj:c); }
    else{ DB.calibracion.push(obj); logActivity(`Perfil de calibración <strong>${obj.nombre}</strong> guardado`); }
    persist('calibracion');
    updateBadges();
    closeModal('modal-calibracion');
    renderSection(currentSection);
    showToast('Perfil guardado ✓');
  } catch(e){ console.error(e); showToast('Error: '+e.message,'error'); }
}

function deleteCalibracion(id){
  if(!confirm('¿Eliminar este perfil?')) return;
  DB.calibracion = DB.calibracion.filter(c=>c.id!==id);
  persist('calibracion'); updateBadges(); renderSection(currentSection);
}

function editCalibracion(id){
  const c = DB.calibracion.find(x=>x.id===id); if(!c) return;
  openCalModal(id);
  document.getElementById('calibracion-edit-id').value = c.id;
  document.getElementById('cal-modal-title').textContent = 'Editar perfil';
  document.getElementById('cal-material-ref').value = c.materialId||'';
  document.getElementById('cal-impresora-ref').value = c.impresoraId||'';
  document.getElementById('cal-nombre').value = c.nombre||'';
  document.getElementById('cal-temp-boquilla-1').value = c.tempBoquilla1||'';
  document.getElementById('cal-temp-boquilla-2').value = c.tempBoquilla2||'';
  document.getElementById('cal-temp-cama-1').value = c.tempCama1||'';
  document.getElementById('cal-temp-cama-2').value = c.tempCama2||'';
  document.getElementById('cal-vel-impresion').value = c.velImpresion||'';
  document.getElementById('cal-vel-primera').value = c.velPrimera||'';
  document.getElementById('cal-vel-perimetros').value = c.velPerimetros||'';
  document.getElementById('cal-vel-relleno').value = c.velRelleno||'';
  document.getElementById('cal-retraccion').value = c.retraccion||'';
  document.getElementById('cal-vel-retraccion').value = c.velRetraccion||'';
  document.getElementById('cal-layer-height').value = c.layerHeight||'0.20';
  document.getElementById('cal-flow').value = c.flow||'100';
  document.getElementById('cal-fan').value = c.fan||'';
  document.getElementById('cal-camara').value = c.camara||'no';
  document.getElementById('cal-rating').value = c.rating||3;
  document.getElementById('cal-estado').value = c.estado||'activo';
  document.getElementById('cal-notas').value = c.notas||'';
}

function filterCalibracion(f, btn){
  _filtroCalibracion = f;
  document.querySelectorAll('#sec-calibracion .tab').forEach(t=>t.classList.remove('active'));
  if(btn) btn.classList.add('active');
  renderCalibracion(f);
}

// ════════════════════════════════
// VENTA — CLIENTE SELECTOR
// ════════════════════════════════
let _ventaClienteMode = 'manual';

function setVentaClienteMode(mode){
  _ventaClienteMode = mode;
  const manual = document.getElementById('venta-cliente-manual');
  const existente = document.getElementById('venta-cliente-existente');
  const btnManual = document.getElementById('venta-cliente-btn-manual');
  const btnExist = document.getElementById('venta-cliente-btn-existente');
  if(mode === 'manual'){
    manual.style.display = ''; existente.style.display = 'none';
    btnManual.style.background = 'var(--accent)'; btnManual.style.color = '#fff';
    btnExist.style.background = 'var(--bg3)'; btnExist.style.color = 'var(--text2)';
    btnManual.style.borderColor = 'var(--accent)'; btnExist.style.borderColor = 'var(--border2)';
  } else {
    manual.style.display = 'none'; existente.style.display = '';
    btnExist.style.background = 'var(--accent)'; btnExist.style.color = '#fff';
    btnManual.style.background = 'var(--bg3)'; btnManual.style.color = 'var(--text2)';
    btnExist.style.borderColor = 'var(--accent)'; btnManual.style.borderColor = 'var(--border2)';
    // Populate cliente select
    const sel = document.getElementById('venta-cliente-select');
    if(sel){
      sel.innerHTML = '<option value="">— Seleccionar cliente —</option>' +
        DB.clientes.map(c=>`<option value="${c.nombre}">${c.nombre}${c.empresa?' — '+c.empresa:''}</option>`).join('');
    }
  }
}

function onVentaClienteSelect(nombre){
  document.getElementById('venta-cliente').value = nombre;
}

function editVenta(id){
  const v = DB.ventas.find(x=>x.id===id); if(!v) return;
  if(v.estado !== 'pendiente'){ showToast('Solo se pueden editar ventas pendientes','error'); return; }
  document.getElementById('venta-edit-id').value = v.id;
  document.getElementById('venta-producto').value = v.producto||'';
  document.getElementById('venta-cantidad').value = v.cantidad||1;
  document.getElementById('venta-precio').value = v.precio||'';
  document.getElementById('venta-total').value = v.total||'';
  document.getElementById('venta-cliente').value = v.cliente||'';
  document.getElementById('venta-fecha').value = v.fecha||'';
  document.getElementById('venta-canal').value = v.canal||'Directo';
  document.getElementById('venta-estado').value = v.estado||'pendiente';
  document.getElementById('venta-notas').value = v.notas||'';
  setVentaClienteMode('manual');
  openModal('modal-venta');
}

// ════════════════════════════════
// TIMER DISPLAY IN TOPBAR
// ════════════════════════════════
function updateTopbarTimer(){
  const el = document.getElementById('topbar-timer');
  if(!el) return;
  if(_timerRunning){
    const elapsed = Date.now() - _timerStart;
    const h=Math.floor(elapsed/3600000), m=Math.floor((elapsed%3600000)/60000), s=Math.floor((elapsed%60000)/1000);
    el.style.display='flex';
    el.innerHTML=`<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg> ${String(h).padStart(2,'0')}:${String(m).padStart(2,'0')}:${String(s).padStart(2,'0')}`;
  } else {
    el.style.display='none';
  }
}
setInterval(updateTopbarTimer, 1000);


function renderCotizaciones(){
  if(!DB.cotizaciones) DB.cotizaciones=[];
  const sr=document.getElementById('cotiz-stats-row');
  if(sr){
    const total=DB.cotizaciones.length;
    const nuevos=DB.cotizaciones.filter(c=>c.estado==='nuevo').length;
    const acept=DB.cotizaciones.filter(c=>c.estado==='aceptado').length;
    sr.innerHTML=`
      <div class="stat-card"><div class="stat-label">Total</div><div class="stat-value">${total}</div><div class="stat-delta neutral">solicitudes</div></div>
      <div class="stat-card"><div class="stat-label">Nuevas</div><div class="stat-value" style="color:var(--ferrari)">${nuevos}</div><div class="stat-delta neutral">sin responder</div></div>
      <div class="stat-card"><div class="stat-label">Aceptadas</div><div class="stat-value" style="color:var(--teal)">${acept}</div><div class="stat-delta up">convertidas</div></div>`;
  }
  const f=document.getElementById('cotiz-filter')?.value||'';
  const list=f?DB.cotizaciones.filter(c=>c.estado===f):[...DB.cotizaciones];
  const cont=document.getElementById('cotizaciones-list'); if(!cont) return;
  if(!list.length){
    cont.innerHTML=`<div class="add-card" style="min-height:140px" onclick="openCotizacionModal()">
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>
      <span>Sin cotizaciones — Agregar primera</span></div>`;
    return;
  }
  const stColors={nuevo:'var(--ferrari)',contactado:'var(--amber)',presupuestado:'var(--blue)',aceptado:'var(--teal)',rechazado:'var(--text3)'};
  cont.innerHTML=list.map(c=>`
    <div class="panel" style="margin-bottom:10px;border:0.5px solid var(--border)">
      <div style="display:flex;align-items:flex-start;justify-content:space-between;gap:12px;flex-wrap:wrap;margin-bottom:10px">
        <div style="flex:1;min-width:0">
          <div style="display:flex;align-items:center;gap:8px;margin-bottom:4px;flex-wrap:wrap">
            <span class="badge" style="background:${stColors[c.estado]||'var(--text3)'}22;color:${stColors[c.estado]||'var(--text3)'}">${c.estado}</span>
            <span style="font-size:10px;color:var(--text3);font-family:var(--mono)">${c.fecha||'—'}</span>
          </div>
          <div style="font-size:15px;font-weight:700;color:var(--text)">${c.titulo}</div>
          <div style="font-size:12px;color:var(--text2);margin-top:4px;line-height:1.5">${c.descripcion||''}</div>
          ${c.ciudad||c.provincia?`<div style="font-size:11px;color:var(--text3);margin-top:6px">📍 ${[c.ciudad,c.provincia].filter(Boolean).join(', ')}</div>`:''}
        </div>
        <div style="text-align:right;flex-shrink:0">
          ${c.whatsapp?`<div style="font-size:12px;color:var(--text2)">📱 ${c.whatsapp}</div>`:''}
          ${c.email?`<div style="font-size:12px;color:var(--text2)">✉️ ${c.email}</div>`:''}
        </div>
      </div>
      <div style="display:flex;gap:6px;flex-wrap:wrap">
        ${c.whatsapp?`<a href="https://wa.me/${c.whatsapp.replace(/\D/g,'')}" target="_blank" class="btn btn-sm" style="background:#25D36622;color:#25D366;border:0.5px solid #25D36644;text-decoration:none">💬 WhatsApp</a>`:''}
        <select class="btn btn-ghost btn-sm" style="cursor:pointer" onchange="cambiarEstadoCotiz('${c.id}',this.value);this.value=''">
          <option value="">Estado...</option>
          <option value="nuevo">Nuevo</option>
          <option value="contactado">Contactado</option>
          <option value="presupuestado">Presupuestado</option>
          <option value="aceptado">Aceptado</option>
          <option value="rechazado">Rechazado</option>
        </select>
        <button class="btn btn-ghost btn-sm" onclick="editCotizacion('${c.id}')">Editar</button>
        <button class="btn btn-danger btn-sm" onclick="deleteCotizacion('${c.id}')">✕</button>
      </div>
    </div>`).join('');
}

function cambiarEstadoCotiz(id,estado){
  if(!estado) return;
  DB.cotizaciones=DB.cotizaciones.map(c=>c.id===id?{...c,estado}:c);
  persist(KEYS.cotizaciones); updateBadges(); renderSection(currentSection);
}

function deleteCotizacion(id){
  if(!confirm('¿Eliminar esta cotización?')) return;
  DB.cotizaciones=DB.cotizaciones.filter(c=>c.id!==id);
  persist(KEYS.cotizaciones); updateBadges(); renderSection(currentSection);
}

function openCotizacionModal(){
  document.getElementById('cotiz-edit-id').value='';
  document.getElementById('cotiz-modal-title').textContent='Nueva Cotización';
  clearForm(['cotiz-titulo','cotiz-desc','cotiz-ciudad','cotiz-prov','cotiz-wa','cotiz-email','cotiz-notas']);
  if(document.getElementById('cotiz-estado')) document.getElementById('cotiz-estado').value='nuevo';
  openModal('modal-cotizacion');
}

function editCotizacion(id){
  const c=(DB.cotizaciones||[]).find(x=>x.id===id); if(!c) return;
  openCotizacionModal();
  document.getElementById('cotiz-edit-id').value=c.id;
  document.getElementById('cotiz-modal-title').textContent='Editar Cotización';
  document.getElementById('cotiz-titulo').value=c.titulo||'';
  document.getElementById('cotiz-desc').value=c.descripcion||'';
  document.getElementById('cotiz-ciudad').value=c.ciudad||'';
  document.getElementById('cotiz-prov').value=c.provincia||'';
  document.getElementById('cotiz-wa').value=c.whatsapp||'';
  document.getElementById('cotiz-email').value=c.email||'';
  document.getElementById('cotiz-notas').value=c.notas||'';
  if(document.getElementById('cotiz-estado')) document.getElementById('cotiz-estado').value=c.estado||'nuevo';
}

function saveCotizacion(){
  const editId=document.getElementById('cotiz-edit-id').value;
  const titulo=document.getElementById('cotiz-titulo').value.trim();
  if(!titulo){ showToast('Ingresá el título','error'); return; }
  const obj={
    id:editId||uid(), titulo,
    descripcion:document.getElementById('cotiz-desc').value,
    ciudad:document.getElementById('cotiz-ciudad').value,
    provincia:document.getElementById('cotiz-prov').value,
    whatsapp:document.getElementById('cotiz-wa').value,
    email:document.getElementById('cotiz-email').value,
    notas:document.getElementById('cotiz-notas').value,
    estado:document.getElementById('cotiz-estado')?.value||'nuevo',
    fecha:new Date().toLocaleDateString('es-AR'), ts:Date.now()
  };
  if(!DB.cotizaciones) DB.cotizaciones=[];
  if(editId){ DB.cotizaciones=DB.cotizaciones.map(c=>c.id===editId?obj:c); }
  else{ DB.cotizaciones.unshift(obj); logActivity(`Cotización <strong>${obj.titulo}</strong> registrada`); }
  persist(KEYS.cotizaciones); updateBadges(); closeModal('modal-cotizacion');
  renderSection(currentSection); showToast('Cotización guardada ✓');
}

function renderCalibracion(filter='todos'){
  const grid = document.getElementById('calibracion-grid'); if(!grid) return;
  const list = filter==='todos' ? DB.calibracion :
    DB.calibracion.filter(c=>{
      if(filter==='ABS') return c.materialTipo==='ABS'||c.materialTipo==='ASA';
      return c.materialTipo===filter||c.materialTipo.startsWith(filter);
    });
  if(!list.length){
    grid.innerHTML=`<div class="add-card" style="grid-column:1/-1;min-height:140px" onclick="openCalModal()">
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><circle cx="12" cy="12" r="3"/><path d="M19.07 4.93a10 10 0 0 1 0 14.14M4.93 4.93a10 10 0 0 0 0 14.14"/></svg>
      <span>Agregar primer perfil de calibración</span>
    </div>`;
    return;
  }
  const stColors={activo:'var(--teal)',prueba:'var(--amber)',archivado:'var(--text3)'};
  const stars = n=>'⭐'.repeat(n)+'☆'.repeat(5-n);
  grid.innerHTML = list.map(c=>{
    const sc = stColors[c.estado]||'var(--text3)';
    return `<div class="panel" style="position:relative;border:0.5px solid var(--border)">
      <!-- Header -->
      <div style="display:flex;align-items:center;gap:10px;margin-bottom:12px">
        <div style="width:14px;height:14px;border-radius:50%;background:${c.materialColorHex||'#888'};border:0.5px solid var(--border2);flex-shrink:0"></div>
        <div style="flex:1;min-width:0">
          <div style="font-size:13px;font-weight:700;color:var(--text);white-space:nowrap;overflow:hidden;text-overflow:ellipsis">${c.nombre}</div>
          <div style="font-size:10px;color:var(--text3);font-family:var(--mono)">${c.materialNombre}</div>
        </div>
        <span class="badge" style="background:${sc}22;color:${sc};flex-shrink:0">${c.estado}</span>
      </div>
      <!-- Rating -->
      <div style="font-size:13px;margin-bottom:12px;letter-spacing:1px">${stars(c.rating||3)}</div>
      <!-- Impresora -->
      <div style="font-size:11px;color:var(--text3);font-family:var(--mono);margin-bottom:12px">🖨️ ${c.impresoraNombre||'Sin impresora'} · capa ${c.layerHeight||'—'}mm</div>
      <!-- Specs grid -->
      <div style="display:grid;grid-template-columns:1fr 1fr;gap:6px;margin-bottom:12px">
        <div style="background:var(--bg3);border-radius:8px;padding:8px 10px">
          <div style="font-size:9px;color:var(--text3);font-family:var(--mono);margin-bottom:2px">BOQUILLA</div>
          <div style="font-size:13px;font-weight:700;color:var(--coral)">${c.tempBoquilla1||'—'}°C <span style="font-size:10px;font-weight:400;color:var(--text3)">/ ${c.tempBoquilla2||'—'}°C</span></div>
        </div>
        <div style="background:var(--bg3);border-radius:8px;padding:8px 10px">
          <div style="font-size:9px;color:var(--text3);font-family:var(--mono);margin-bottom:2px">CAMA</div>
          <div style="font-size:13px;font-weight:700;color:var(--amber)">${c.tempCama1||'—'}°C <span style="font-size:10px;font-weight:400;color:var(--text3)">/ ${c.tempCama2||'—'}°C</span></div>
        </div>
        <div style="background:var(--bg3);border-radius:8px;padding:8px 10px">
          <div style="font-size:9px;color:var(--text3);font-family:var(--mono);margin-bottom:2px">VELOCIDAD</div>
          <div style="font-size:13px;font-weight:700;color:var(--blue)">${(c.velImpresion||'—').replace('-','/')} <span style="font-size:10px;color:var(--text3)">mm/s</span></div>
        </div>
        <div style="background:var(--bg3);border-radius:8px;padding:8px 10px">
          <div style="font-size:9px;color:var(--text3);font-family:var(--mono);margin-bottom:2px">RETRACCIÓN</div>
          <div style="font-size:13px;font-weight:700;color:var(--purple)">${(c.retraccion||'—').replace('-','/')} <span style="font-size:10px;color:var(--text3)">mm @ ${(c.velRetraccion||'—').replace('-','/')}</span></div>
        </div>
        <div style="background:var(--bg3);border-radius:8px;padding:8px 10px">
          <div style="font-size:9px;color:var(--text3);font-family:var(--mono);margin-bottom:2px">VENTILADOR</div>
          <div style="font-size:13px;font-weight:700;color:var(--teal)">${(c.fan||'—').replace('-','/')}<span style="font-size:10px;color:var(--text3)">%</span></div>
        </div>
        <div style="background:var(--bg3);border-radius:8px;padding:8px 10px">
          <div style="font-size:9px;color:var(--text3);font-family:var(--mono);margin-bottom:2px">FLOW / CÁMARA</div>
          <div style="font-size:13px;font-weight:700;color:var(--text)">${c.flow||'100'}<span style="font-size:10px;color:var(--text3)">% / ${c.camara||'—'}</span></div>
        </div>
      </div>
      <!-- Velocidades extra -->
      <div style="font-size:10px;color:var(--text3);font-family:var(--mono);margin-bottom:8px">
        1ª capa: ${(c.velPrimera||'—').replace('-','/')} mm/s · Perímetros (IW): ${(c.velPerimetros||'—').replace('-','/')} mm/s · Relleno: ${(c.velRelleno||'—').replace('-','/')} mm/s
      </div>
      ${c.notas?`<div style="font-size:11px;color:var(--text2);background:var(--bg3);padding:8px 10px;border-radius:8px;border-left:3px solid var(--accent);margin-bottom:8px;line-height:1.5">${c.notas}</div>`:''}
      <!-- Fecha + acciones -->
      <div style="display:flex;align-items:center;justify-content:space-between;margin-top:8px;padding-top:10px;border-top:0.5px solid var(--border)">
        <span style="font-size:10px;color:var(--text3);font-family:var(--mono)">${new Date(c.fecha).toLocaleDateString('es-AR')}</span>
        <div style="display:flex;gap:8px">
          <button class="btn btn-ghost btn-sm" onclick="editCalibracion('${c.id}')">Editar</button>
          <button class="btn btn-danger btn-sm" onclick="deleteCalibracion('${c.id}')">✕</button>
        </div>
      </div>
    </div>`;
  }).join('')+`<div class="add-card" onclick="openCalModal()" style="min-height:140px"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="16"/><line x1="8" y1="12" x2="16" y2="12"/></svg><span>Nuevo perfil</span></div>`;
}


function clearForm(ids){ ids.forEach(id=>{ const el=document.getElementById(id); if(el) el.value=''; }); }

const d=new Date();
const dias=['Domingo','Lunes','Martes','Miércoles','Jueves','Viernes','Sábado'];
const meses=['enero','febrero','marzo','abril','mayo','junio','julio','agosto','septiembre','octubre','noviembre','diciembre'];
document.getElementById('topbar-date').textContent=`${dias[d.getDay()]}, ${d.getDate()} de ${meses[d.getMonth()]} de ${d.getFullYear()}`;
document.getElementById('topbar-add-btn').style.display='none';
// Sincronizar versión mobile con APP_VERSION
const mobileVerBadge = document.getElementById('mobile-version-badge');
if (mobileVerBadge) mobileVerBadge.textContent = APP_VERSION.version;
initTheme();
fetchDolar();
updateBadges();
renderDashboard();
updateSidebarPrinterSelect();
checkMantPending();
initFirebase();

// ══════════════════════════════════════════════
//  PORTAL CLIENTES — Gestión desde el Dashboard
// ══════════════════════════════════════════════

let _portalCurrentUID = null;
let _portalUsersCache = {};

// ── Carga todos los usuarios del portal desde Firebase ──
function loadPortalUsers() {
  const db = typeof firebase !== 'undefined' && firebase.apps.length
    ? firebase.database() : null;
  if (!db) {
    document.getElementById('portal-users-table').innerHTML =
      `<div style="text-align:center;padding:32px;color:var(--text3);font-size:13px">
        <div style="font-size:28px;margin-bottom:8px">⚠️</div>
        Firebase no disponible. Iniciá sesión primero.
      </div>`;
    return;
  }
  document.getElementById('portal-users-table').innerHTML =
    `<div style="text-align:center;padding:20px;color:var(--text3);font-size:12px">Cargando...</div>`;

  db.ref('marcanotech-dashboard/clientes-portal').once('value').then(snap => {
    const data = snap.val() || {};
    _portalUsersCache = data;
    renderPortalUsers();
  }).catch(e => {
    document.getElementById('portal-users-table').innerHTML =
      `<div style="text-align:center;padding:32px;color:#f87171;font-size:12px">Error al cargar: ${e.message}</div>`;
  });
}

function renderPortalUsers() {
  const search = (document.getElementById('portal-search')?.value || '').toLowerCase();
  const users = Object.entries(_portalUsersCache);

  const filtered = users.filter(([uid, u]) => {
    const p = u.perfil || {};
    return !search ||
      (p.nombre||'').toLowerCase().includes(search) ||
      (p.email||'').toLowerCase().includes(search);
  });

  // Stats
  const total   = users.length;
  const vip     = users.filter(([,u]) => (u.perfil?.tier||'') === 'vip').length;
  const std     = total - vip;
  document.getElementById('portal-users-count').textContent =
    `${total} usuario${total !== 1 ? 's' : ''} registrado${total !== 1 ? 's' : ''}`;
  const badgeEl = document.getElementById('badge-portalclientes');
  if (badgeEl) badgeEl.textContent = total;

  document.getElementById('portal-stats-row').innerHTML = `
    <div class="stat-card"><div class="stat-val">${total}</div><div class="stat-label">Registrados</div></div>
    <div class="stat-card"><div class="stat-val" style="color:var(--ferrari)">${vip}</div><div class="stat-label">VIP</div></div>
    <div class="stat-card"><div class="stat-val" style="color:var(--text3)">${std}</div><div class="stat-label">Estándar</div></div>
    <div class="stat-card"><div class="stat-val" style="color:var(--teal)">${
      users.reduce((a,[,u])=>a+Object.keys(u.compras||{}).length,0)
    }</div><div class="stat-label">Compras totales</div></div>`;

  if (!filtered.length) {
    document.getElementById('portal-users-table').innerHTML =
      `<div style="text-align:center;padding:32px;color:var(--text3);font-size:13px">
        ${total === 0
          ? '<div style="font-size:28px;margin-bottom:8px">👥</div>Aún no hay usuarios registrados en el portal web.'
          : 'No se encontraron usuarios con ese criterio.'}
      </div>`;
    return;
  }

  const rows = filtered.map(([uid, u]) => {
    const p    = u.perfil || {};
    const isVip = p.tier === 'vip';
    const nPedidos  = Object.keys(u.pedidos||{}).length;
    const nCompras  = Object.keys(u.compras||{}).length;
    const nProy     = Object.keys(u.proyectos||{}).length;
    const inicial   = (p.nombre||p.email||'?')[0].toUpperCase();
    const avatarEl  = p.fotoURL
      ? `<img src="${p.fotoURL}" style="width:32px;height:32px;border-radius:50%;object-fit:cover" onerror="this.outerHTML='<div style=\\'width:32px;height:32px;border-radius:50%;background:var(--ferrari);color:#fff;display:flex;align-items:center;justify-content:center;font-size:13px;font-weight:700\\'>${inicial}</div>'">`
      : `<div style="width:32px;height:32px;border-radius:50%;background:var(--ferrari);color:#fff;display:flex;align-items:center;justify-content:center;font-size:13px;font-weight:700">${inicial}</div>`;
    const tierBadge = isVip
      ? `<span style="background:linear-gradient(135deg,#b45309,#f97316);color:#fff;padding:2px 7px;border-radius:10px;font-size:10px;font-weight:700">★ VIP</span>`
      : `<span style="background:rgba(158,170,184,0.15);color:#9eaab8;border:1px solid rgba(158,170,184,0.2);padding:2px 7px;border-radius:10px;font-size:10px">ESTÁNDAR</span>`;
    const fechaStr  = p.creadoEn
      ? new Date(p.creadoEn).toLocaleDateString('es-AR',{day:'2-digit',month:'short',year:'numeric'})
      : '—';
    const waNum = (p.telefono||'').replace(/\D/g,'');
    const waBtn = waNum
      ? `<a href="https://wa.me/${waNum}" target="_blank" title="WhatsApp" style="display:inline-flex;align-items:center;justify-content:center;width:28px;height:28px;background:rgba(52,211,153,0.12);border:1px solid rgba(52,211,153,0.25);border-radius:6px;color:#34d399;text-decoration:none;font-size:13px">💬</a>`
      : '';
    return `<tr style="border-bottom:1px solid rgba(255,255,255,0.04);cursor:pointer" onclick="openPortalUserDetail('${uid}')">
      <td style="padding:10px 12px">
        <div style="display:flex;align-items:center;gap:10px">
          ${avatarEl}
          <div>
            <div style="font-size:13px;font-weight:600;color:var(--text)">${escHtml(p.nombre||'Sin nombre')}</div>
            <div style="font-size:11px;color:var(--text3);font-family:var(--mono)">${escHtml(p.email||'')}</div>
          </div>
        </div>
      </td>
      <td style="padding:10px 12px">${tierBadge}</td>
      <td style="padding:10px 12px;text-align:center;font-size:12px;color:var(--text2)">${nPedidos}</td>
      <td style="padding:10px 12px;text-align:center;font-size:12px;color:var(--teal)">${nCompras}</td>
      <td style="padding:10px 12px;text-align:center;font-size:12px;color:#a78bfa">${nProy}</td>
      <td style="padding:10px 12px;font-size:11px;color:var(--text3);font-family:var(--mono)">${fechaStr}</td>
      <td style="padding:10px 12px">
        <div style="display:flex;gap:6px;align-items:center">
          ${waBtn}
          <button onclick="event.stopPropagation();openPortalUserDetail('${uid}')"
            style="background:rgba(249,115,22,0.1);border:1px solid rgba(249,115,22,0.25);color:var(--ferrari);padding:4px 10px;border-radius:6px;font-size:11px;cursor:pointer">
            Gestionar
          </button>
        </div>
      </td>
    </tr>`;
  }).join('');

  document.getElementById('portal-users-table').innerHTML = `
    <div style="overflow-x:auto">
      <table style="width:100%;border-collapse:collapse;font-size:13px">
        <thead>
          <tr style="border-bottom:1px solid rgba(255,255,255,0.08)">
            <th style="padding:8px 12px;text-align:left;font-size:10px;color:var(--text3);font-family:var(--mono);font-weight:600;text-transform:uppercase;letter-spacing:1px">Cliente</th>
            <th style="padding:8px 12px;text-align:left;font-size:10px;color:var(--text3);font-family:var(--mono);font-weight:600;text-transform:uppercase;letter-spacing:1px">Tier</th>
            <th style="padding:8px 12px;text-align:center;font-size:10px;color:var(--text3);font-family:var(--mono);font-weight:600;text-transform:uppercase;letter-spacing:1px">Pedidos</th>
            <th style="padding:8px 12px;text-align:center;font-size:10px;color:var(--text3);font-family:var(--mono);font-weight:600;text-transform:uppercase;letter-spacing:1px">Compras</th>
            <th style="padding:8px 12px;text-align:center;font-size:10px;color:var(--text3);font-family:var(--mono);font-weight:600;text-transform:uppercase;letter-spacing:1px">Proyectos</th>
            <th style="padding:8px 12px;text-align:left;font-size:10px;color:var(--text3);font-family:var(--mono);font-weight:600;text-transform:uppercase;letter-spacing:1px">Alta</th>
            <th style="padding:8px 12px;text-align:left;font-size:10px;color:var(--text3);font-family:var(--mono);font-weight:600;text-transform:uppercase;letter-spacing:1px">Acciones</th>
          </tr>
        </thead>
        <tbody>${rows}</tbody>
      </table>
    </div>`;
}

// ── Abrir panel de detalle de un usuario ──
function openPortalUserDetail(uid) {
  _portalCurrentUID = uid;
  const u = _portalUsersCache[uid] || {};
  const p = u.perfil || {};
  const isVip  = p.tier === 'vip';
  const inicial = (p.nombre||p.email||'?')[0].toUpperCase();

  document.getElementById('portal-detail-title').textContent =
    `Gestionar: ${p.nombre || p.email || uid}`;

  // Avatar
  const avatarEl = document.getElementById('portal-detail-avatar');
  avatarEl.innerHTML = '';
  if (p.fotoURL) {
    avatarEl.innerHTML = `<img src="${p.fotoURL}" style="width:100%;height:100%;object-fit:cover">`;
  } else {
    avatarEl.textContent = inicial;
  }

  document.getElementById('portal-detail-name').textContent  = p.nombre || '—';
  document.getElementById('portal-detail-email').textContent = p.email  || '—';
  document.getElementById('portal-detail-phone').textContent = p.telefono || 'No registrado';
  document.getElementById('portal-detail-uid').textContent   = uid;

  const fechaStr = p.creadoEn
    ? new Date(p.creadoEn).toLocaleDateString('es-AR',{day:'2-digit',month:'long',year:'numeric'})
    : '—';
  document.getElementById('portal-detail-since').textContent = fechaStr;

  // Tier selector
  document.getElementById('portal-edit-tier').value = p.tier || 'standard';
  document.getElementById('portal-edit-discount').value = p.descuento || '';
  document.getElementById('portal-edit-notes').value = p.notasInternas || '';
  document.getElementById('portal-vip-discount-group').style.display = isVip ? 'block' : 'none';

  // Vincular cambio de tier
  document.getElementById('portal-edit-tier').onchange = function() {
    document.getElementById('portal-vip-discount-group').style.display =
      this.value === 'vip' ? 'block' : 'none';
  };

  renderPortalDetailPedidos(u.pedidos);
  renderPortalDetailCompras(u.compras);
  renderPortalDetailProyectos(u.proyectos);

  document.getElementById('portal-user-detail').style.display = 'block';
  document.getElementById('portal-user-detail').scrollIntoView({ behavior: 'smooth', block: 'start' });
}

function closePortalUserDetail() {
  document.getElementById('portal-user-detail').style.display = 'none';
  _portalCurrentUID = null;
}

// ── Guardar config del usuario (tier, descuento, notas) ──
function savePortalUserConfig() {
  if (!_portalCurrentUID) return;
  const db = firebase.database();
  const tier    = document.getElementById('portal-edit-tier').value;
  const disc    = parseFloat(document.getElementById('portal-edit-discount').value) || 0;
  const notes   = document.getElementById('portal-edit-notes').value.trim();

  const updates = { tier };
  if (tier === 'vip' && disc > 0) updates.descuento = disc;
  else updates.descuento = null;
  if (notes) updates.notasInternas = notes;
  else updates.notasInternas = null;

  db.ref(`marcanotech-dashboard/clientes-portal/${_portalCurrentUID}/perfil`).update(updates)
    .then(() => {
      // Actualizar cache
      if (!_portalUsersCache[_portalCurrentUID]) _portalUsersCache[_portalCurrentUID] = {};
      if (!_portalUsersCache[_portalCurrentUID].perfil) _portalUsersCache[_portalCurrentUID].perfil = {};
      Object.assign(_portalUsersCache[_portalCurrentUID].perfil, updates);
      renderPortalUsers();
      showToast('Configuración guardada ✓');
    })
    .catch(e => showToast('Error: ' + e.message, true));
}

// ── Agregar pedido ──
function addPortalPedido() {
  if (!_portalCurrentUID) return;
  const desc   = document.getElementById('portal-new-pedido-desc').value.trim();
  const estado = document.getElementById('portal-new-pedido-estado').value;
  if (!desc) { showToast('Ingresá una descripción', true); return; }

  const db  = firebase.database();
  const key = Date.now().toString(36) + Math.random().toString(36).slice(2,5);
  const pedido = { descripcion: desc, estado, fecha: new Date().toISOString() };

  db.ref(`marcanotech-dashboard/clientes-portal/${_portalCurrentUID}/pedidos/${key}`).set(pedido)
    .then(() => {
      if (!_portalUsersCache[_portalCurrentUID].pedidos)
        _portalUsersCache[_portalCurrentUID].pedidos = {};
      _portalUsersCache[_portalCurrentUID].pedidos[key] = pedido;
      document.getElementById('portal-new-pedido-desc').value = '';
      renderPortalDetailPedidos(_portalUsersCache[_portalCurrentUID].pedidos);
      renderPortalUsers();
      showToast('Pedido agregado ✓');
    })
    .catch(e => showToast('Error: ' + e.message, true));
}

function renderPortalDetailPedidos(pedidos) {
  const el = document.getElementById('portal-detail-pedidos');
  if (!pedidos || !Object.keys(pedidos).length) {
    el.innerHTML = `<div style="text-align:center;padding:14px;color:var(--text3);font-size:12px">Sin pedidos registrados</div>`;
    return;
  }
  const arr = Object.entries(pedidos).sort((a,b) => new Date(b[1].fecha||0) - new Date(a[1].fecha||0));
  el.innerHTML = arr.map(([kid, p]) => {
    const statusColors = {
      'Pendiente':   'color:#fbbf24;background:rgba(251,191,36,0.12)',
      'En proceso':  'color:#f97316;background:rgba(249,115,22,0.12)',
      'Completado':  'color:#34d399;background:rgba(52,211,153,0.12)',
      'Cancelado':   'color:#f87171;background:rgba(239,68,68,0.12)',
    };
    const sc = statusColors[p.estado] || 'color:var(--text3);background:rgba(255,255,255,0.05)';
    return `<div style="display:flex;align-items:center;justify-content:space-between;padding:8px 10px;border-radius:6px;background:rgba(255,255,255,0.03);border:1px solid rgba(255,255,255,0.05);margin-bottom:6px">
      <div>
        <div style="font-size:12px;font-weight:600;color:var(--text2)">${escHtml(p.descripcion||p.titulo||'Pedido')}</div>
        <div style="font-size:10px;color:var(--text3);font-family:var(--mono)">${p.fecha ? new Date(p.fecha).toLocaleDateString('es-AR') : '—'}</div>
      </div>
      <div style="display:flex;align-items:center;gap:8px">
        <span style="font-size:10px;font-weight:700;padding:2px 8px;border-radius:10px;${sc}">${p.estado||'Pendiente'}</span>
        <button onclick="deletePortalItem('pedidos','${kid}')" style="background:none;border:none;color:var(--text3);cursor:pointer;font-size:14px;line-height:1;padding:2px 4px" title="Eliminar">✕</button>
      </div>
    </div>`;
  }).join('');
}

// ── Agregar compra ──
function addPortalCompra() {
  if (!_portalCurrentUID) return;
  const desc  = document.getElementById('portal-new-compra-desc').value.trim();
  const monto = parseFloat(document.getElementById('portal-new-compra-monto').value) || 0;
  if (!desc) { showToast('Ingresá una descripción', true); return; }

  const db  = firebase.database();
  const key = Date.now().toString(36) + Math.random().toString(36).slice(2,5);
  const compra = { descripcion: desc, monto, fecha: new Date().toISOString() };

  db.ref(`marcanotech-dashboard/clientes-portal/${_portalCurrentUID}/compras/${key}`).set(compra)
    .then(() => {
      if (!_portalUsersCache[_portalCurrentUID].compras)
        _portalUsersCache[_portalCurrentUID].compras = {};
      _portalUsersCache[_portalCurrentUID].compras[key] = compra;
      document.getElementById('portal-new-compra-desc').value  = '';
      document.getElementById('portal-new-compra-monto').value = '';
      renderPortalDetailCompras(_portalUsersCache[_portalCurrentUID].compras);
      renderPortalUsers();
      showToast('Compra registrada ✓');
    })
    .catch(e => showToast('Error: ' + e.message, true));
}

function renderPortalDetailCompras(compras) {
  const el = document.getElementById('portal-detail-compras');
  if (!compras || !Object.keys(compras).length) {
    el.innerHTML = `<div style="text-align:center;padding:14px;color:var(--text3);font-size:12px">Sin compras registradas</div>`;
    return;
  }
  const arr = Object.entries(compras).sort((a,b) => new Date(b[1].fecha||0) - new Date(a[1].fecha||0));
  const totalARS = arr.reduce((s,[,c]) => s + (parseFloat(c.monto)||0), 0);
  el.innerHTML = `
    <div style="text-align:right;margin-bottom:8px;font-size:11px;color:var(--teal);font-family:var(--mono)">
      Total: $${totalARS.toLocaleString('es-AR')} ARS
    </div>` +
    arr.map(([kid, c]) => `
    <div style="display:flex;align-items:center;justify-content:space-between;padding:8px 10px;border-radius:6px;background:rgba(52,211,153,0.05);border:1px solid rgba(52,211,153,0.12);margin-bottom:6px">
      <div>
        <div style="font-size:12px;font-weight:600;color:var(--text2)">${escHtml(c.descripcion||'Compra')}</div>
        <div style="font-size:10px;color:var(--text3);font-family:var(--mono)">${c.fecha ? new Date(c.fecha).toLocaleDateString('es-AR') : '—'}</div>
      </div>
      <div style="display:flex;align-items:center;gap:8px">
        ${c.monto ? `<span style="font-size:12px;font-weight:700;color:#34d399">$${parseFloat(c.monto).toLocaleString('es-AR')}</span>` : ''}
        <button onclick="deletePortalItem('compras','${kid}')" style="background:none;border:none;color:var(--text3);cursor:pointer;font-size:14px;line-height:1;padding:2px 4px" title="Eliminar">✕</button>
      </div>
    </div>`).join('');
}

// ── Agregar proyecto personalizado ──
function addPortalProyecto() {
  if (!_portalCurrentUID) return;
  const nombre = document.getElementById('portal-new-proyecto-nombre').value.trim();
  const estado = document.getElementById('portal-new-proyecto-estado').value;
  if (!nombre) { showToast('Ingresá un nombre de proyecto', true); return; }

  const db  = firebase.database();
  const key = Date.now().toString(36) + Math.random().toString(36).slice(2,5);
  const proyecto = { nombre, estado, fecha: new Date().toISOString() };

  db.ref(`marcanotech-dashboard/clientes-portal/${_portalCurrentUID}/proyectos/${key}`).set(proyecto)
    .then(() => {
      if (!_portalUsersCache[_portalCurrentUID].proyectos)
        _portalUsersCache[_portalCurrentUID].proyectos = {};
      _portalUsersCache[_portalCurrentUID].proyectos[key] = proyecto;
      document.getElementById('portal-new-proyecto-nombre').value = '';
      renderPortalDetailProyectos(_portalUsersCache[_portalCurrentUID].proyectos);
      renderPortalUsers();
      showToast('Proyecto agregado ✓');
    })
    .catch(e => showToast('Error: ' + e.message, true));
}

function renderPortalDetailProyectos(proyectos) {
  const el = document.getElementById('portal-detail-proyectos');
  if (!proyectos || !Object.keys(proyectos).length) {
    el.innerHTML = `<div style="text-align:center;padding:14px;color:var(--text3);font-size:12px">Sin proyectos registrados</div>`;
    return;
  }
  const arr = Object.entries(proyectos).sort((a,b) => new Date(b[1].fecha||0) - new Date(a[1].fecha||0));
  el.innerHTML = arr.map(([kid, p]) => {
    const statusColors = {
      'Pendiente':    'color:#fbbf24;background:rgba(251,191,36,0.12)',
      'Diseño':       'color:#a78bfa;background:rgba(167,139,250,0.12)',
      'Imprimiendo':  'color:#f97316;background:rgba(249,115,22,0.12)',
      'Completado':   'color:#34d399;background:rgba(52,211,153,0.12)',
    };
    const sc = statusColors[p.estado] || 'color:var(--text3);background:rgba(255,255,255,0.05)';
    return `<div style="display:flex;align-items:center;justify-content:space-between;padding:8px 10px;border-radius:6px;background:rgba(167,139,250,0.05);border:1px solid rgba(167,139,250,0.12);margin-bottom:6px">
      <div>
        <div style="font-size:12px;font-weight:600;color:var(--text2)">${escHtml(p.nombre||p.titulo||'Proyecto')}</div>
        <div style="font-size:10px;color:var(--text3);font-family:var(--mono)">${p.fecha ? new Date(p.fecha).toLocaleDateString('es-AR') : '—'}${p.nota ? ' · '+escHtml(p.nota) : ''}</div>
      </div>
      <div style="display:flex;align-items:center;gap:8px">
        <span style="font-size:10px;font-weight:700;padding:2px 8px;border-radius:10px;${sc}">${p.estado||'Pendiente'}</span>
        <button onclick="deletePortalItem('proyectos','${kid}')" style="background:none;border:none;color:var(--text3);cursor:pointer;font-size:14px;line-height:1;padding:2px 4px" title="Eliminar">✕</button>
      </div>
    </div>`;
  }).join('');
}

// ── Eliminar item (pedido / compra / proyecto) ──
function deletePortalItem(tipo, kid) {
  if (!_portalCurrentUID) return;
  if (!confirm('¿Eliminás este registro?')) return;
  const db = firebase.database();
  db.ref(`marcanotech-dashboard/clientes-portal/${_portalCurrentUID}/${tipo}/${kid}`).remove()
    .then(() => {
      delete _portalUsersCache[_portalCurrentUID][tipo][kid];
      if      (tipo === 'pedidos')   renderPortalDetailPedidos(_portalUsersCache[_portalCurrentUID].pedidos);
      else if (tipo === 'compras')   renderPortalDetailCompras(_portalUsersCache[_portalCurrentUID].compras);
      else if (tipo === 'proyectos') renderPortalDetailProyectos(_portalUsersCache[_portalCurrentUID].proyectos);
      renderPortalUsers();
      showToast('Eliminado ✓');
    })
    .catch(e => showToast('Error: ' + e.message, true));
}



// ── Helper escHtml (puede ya existir en el dashboard — lo definimos como fallback) ──
if (typeof escHtml === 'undefined') {
  function escHtml(s) {
    return String(s||'').replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');
  }
}

// ══════════════════════════════════════════════
//  CATÁLOGO DE COLORES — Admin Dashboard
// ══════════════════════════════════════════════

let _catCache     = {};  // colores en Firebase
let _catEditId    = null;
let _catDispoSel  = 'stock';

const COLORES_BASE_IDS = [
  'bl-01','bl-02','bl-03','bl-04','bl-05','bl-06','bl-07','bl-08','bl-09','bl-10','bl-11','bl-12','bl-13',
  'es-01','es-02','es-03','es-04','es-05','es-06','es-07','es-08','es-09','es-10','es-11','es-12','es-13',
  'pm-01','pm-02','pm-03','pm-04','pm-05','pm-06','pm-07','pm-08','pm-09','pm-10',
  'pl-01','pl-02','pl-03','pl-04','pl-05','pl-06','pl-07','pl-08','pl-09','pl-10',
  'gr-01','gr-02','gr-03','gr-04','gr-05','gr-06','gr-07',
  'eg-01','eg-02','eg-03','eg-04','eg-05','eg-06','eg-07','eg-08'
];

// ── Tabs de Materiales ──
function switchMatTab(tab) {
  document.getElementById('mat-tab-stock').classList.toggle('active',    tab === 'stock');
  document.getElementById('mat-tab-catalogo').classList.toggle('active', tab === 'catalogo');
  document.getElementById('mat-panel-stock').style.display    = tab === 'stock'    ? '' : 'none';
  document.getElementById('mat-panel-catalogo').style.display = tab === 'catalogo' ? '' : 'none';
  document.getElementById('mat-add-btn').style.display        = tab === 'stock'    ? '' : 'none';
  if (tab === 'catalogo') loadCatalogoAdmin();
}

// ── Cargar catálogo desde Firebase ──
function loadCatalogoAdmin() {
  const db = typeof firebase !== 'undefined' && firebase.apps.length ? firebase.database() : null;
  if (!db) { renderCatalogoAdmin(); return; }
  db.ref('marcanotech-dashboard/catalogo-colores').once('value').then(snap => {
    _catCache = snap.val() || {};
    renderCatalogoAdmin();
  }).catch(() => renderCatalogoAdmin());
}

// ── Renderizar tabla admin del catálogo ──
function renderCatalogoAdmin() {
  const search    = (document.getElementById('cat-search')?.value || '').toLowerCase();
  const filtMarca = document.getElementById('cat-filter-marca')?.value || '';
  const filtDispo = document.getElementById('cat-filter-dispo')?.value || '';

  // Fusionar base + Firebase (Firebase puede sobreescribir estado)
  const baseColores = typeof COLORES_BASE !== 'undefined' ? [] : [];
  const entries = Object.entries(_catCache);

  const dispoLabel = { stock:'En stock', disponible:'Disponible', consultar:'Bajo pedido' };
  const dispoColor = { stock:'#34d399',  disponible:'#fbbf24',    consultar:'#9eaab8'     };
  const dispoBg    = { stock:'rgba(52,211,153,0.1)', disponible:'rgba(251,191,36,0.1)', consultar:'rgba(158,170,184,0.1)' };

  const filtered = entries.filter(([,c]) => {
    const okSearch = !search || (c.nombre||'').toLowerCase().includes(search) || (c.marca||'').toLowerCase().includes(search);
    const okMarca  = !filtMarca || c.marca === filtMarca;
    const okDispo  = !filtDispo || c.dispo === filtDispo;
    return okSearch && okMarca && okDispo;
  });

  // Stats
  const total      = entries.length;
  const enStock    = entries.filter(([,c]) => c.dispo === 'stock').length;
  const disponible = entries.filter(([,c]) => c.dispo === 'disponible').length;
  const consultar  = entries.filter(([,c]) => c.dispo === 'consultar').length;
  const catStatsEl = document.getElementById('cat-stats-row');
  if (catStatsEl) catStatsEl.innerHTML = `
    <div class="stat-card"><div class="stat-val">${total}</div><div class="stat-label">Total colores</div></div>
    <div class="stat-card"><div class="stat-val" style="color:#34d399">${enStock}</div><div class="stat-label">En stock</div></div>
    <div class="stat-card"><div class="stat-val" style="color:#fbbf24">${disponible}</div><div class="stat-label">Disponibles</div></div>
    <div class="stat-card"><div class="stat-val" style="color:#9eaab8">${consultar}</div><div class="stat-label">Bajo pedido</div></div>`;

  const tableEl = document.getElementById('catalogo-admin-table');
  if (!tableEl) return;

  if (!filtered.length) {
    tableEl.innerHTML = `<div style="text-align:center;padding:32px;color:var(--text3);font-size:13px">
      ${total === 0 ? '<div style="font-size:28px;margin-bottom:8px">🎨</div>No hay colores aún. Usá "Agregar color" o "Sincronizar" para cargar el catálogo base.' : 'No hay colores con ese filtro.'}
    </div>`;
    return;
  }

  // Agrupar por marca
  const porMarca = {};
  filtered.forEach(([kid, c]) => {
    const m = c.marca || 'Sin marca';
    if (!porMarca[m]) porMarca[m] = [];
    porMarca[m].push([kid, c]);
  });

  tableEl.innerHTML = Object.entries(porMarca).map(([marca, cols]) => `
    <div style="margin-bottom:20px">
      <div style="font-size:11px;font-weight:700;color:var(--text3);font-family:var(--mono);letter-spacing:1.5px;text-transform:uppercase;margin-bottom:10px;padding-bottom:6px;border-bottom:1px solid rgba(255,255,255,0.06)">${escHtml(marca)} <span style="color:var(--text3);font-weight:400">(${cols.length})</span></div>
      <div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(200px,1fr));gap:8px">
        ${cols.map(([kid, c]) => {
          const dc = dispoColor[c.dispo] || '#9eaab8';
          const db2 = dispoBg[c.dispo]  || 'rgba(158,170,184,0.1)';
          const dl = dispoLabel[c.dispo] || c.dispo;
          return `
          <div style="display:flex;align-items:center;gap:10px;padding:8px 10px;background:var(--bg3);border-radius:8px;border:1px solid rgba(255,255,255,0.05)">
            <div style="width:32px;height:32px;border-radius:6px;background:${c.hex||'#888'};flex-shrink:0;border:1px solid rgba(255,255,255,0.1)"></div>
            <div style="flex:1;min-width:0">
              <div style="font-size:12px;font-weight:600;color:var(--text2);white-space:nowrap;overflow:hidden;text-overflow:ellipsis">${escHtml(c.nombre||'')}</div>
              <div style="font-size:10px;color:var(--text3);font-family:var(--mono)">${(c.hex||'').toUpperCase()} · ${escHtml(c.material||'')}</div>
              <span style="font-size:10px;font-weight:600;padding:1px 6px;border-radius:8px;background:${db2};color:${dc}">${dl}</span>
            </div>
            <div style="display:flex;flex-direction:column;gap:4px;flex-shrink:0">
              <button onclick="editCatalogoColor('${kid}')" style="background:none;border:1px solid rgba(255,255,255,0.1);color:var(--text3);padding:3px 7px;border-radius:4px;font-size:10px;cursor:pointer" title="Editar">✏️</button>
              <button onclick="deleteCatalogoColor('${kid}')" style="background:none;border:1px solid rgba(255,255,255,0.1);color:var(--text3);padding:3px 7px;border-radius:4px;font-size:10px;cursor:pointer" title="Eliminar">✕</button>
            </div>
          </div>`;
        }).join('')}
      </div>
    </div>`).join('');
}

// ── Modal agregar/editar ──
function openCatalogoColorModal(id) {
  _catEditId = id || null;
  const c = id ? (_catCache[id] || {}) : {};
  document.getElementById('cat-modal-title').textContent = id ? 'Editar color' : 'Agregar color al catálogo';
  document.getElementById('cat-nombre').value   = c.nombre   || '';
  document.getElementById('cat-hex').value      = c.hex      || '#F5F5F0';
  document.getElementById('cat-hex-picker').value = c.hex    || '#F5F5F0';
  document.getElementById('cat-marca').value    = c.marca    || '';
  document.getElementById('cat-material').value = c.material || '';
  document.getElementById('cat-notas').value    = c.notas    || '';
  _catDispoSel = c.dispo || 'stock';
  document.querySelectorAll('.cat-dispo-btn').forEach(b => {
    const isActive = b.dataset.val === _catDispoSel;
    b.classList.toggle('active', isActive);
    b.style.background     = isActive ? (b.dataset.val === 'stock' ? 'rgba(52,211,153,0.15)' : b.dataset.val === 'disponible' ? 'rgba(251,191,36,0.15)' : 'rgba(158,170,184,0.15)') : '';
    b.style.borderColor    = isActive ? (b.dataset.val === 'stock' ? 'rgba(52,211,153,0.4)'  : b.dataset.val === 'disponible' ? 'rgba(251,191,36,0.4)'  : 'rgba(158,170,184,0.4)')  : '';
    b.style.color          = isActive ? (b.dataset.val === 'stock' ? '#34d399' : b.dataset.val === 'disponible' ? '#fbbf24' : '#9eaab8') : '';
  });
  openModal('modal-catalogo-color');
}

function editCatalogoColor(id) { openCatalogoColorModal(id); }

function setCatDispo(val, btn) {
  _catDispoSel = val;
  const colors = { stock:['rgba(52,211,153,0.15)','rgba(52,211,153,0.4)','#34d399'], disponible:['rgba(251,191,36,0.15)','rgba(251,191,36,0.4)','#fbbf24'], consultar:['rgba(158,170,184,0.15)','rgba(158,170,184,0.4)','#9eaab8'] };
  document.querySelectorAll('.cat-dispo-btn').forEach(b => {
    const active = b.dataset.val === val;
    b.classList.toggle('active', active);
    const [bg, bd, tc] = colors[b.dataset.val] || ['','',''];
    b.style.background  = active ? bg : '';
    b.style.borderColor = active ? bd : '';
    b.style.color       = active ? tc : '';
  });
}

function syncColorPicker() {
  const hex = document.getElementById('cat-hex').value;
  if (/^#[0-9A-Fa-f]{6}$/.test(hex)) {
    document.getElementById('cat-hex-picker').value = hex;
  }
}

function saveCatalogoColor() {
  const nombre   = document.getElementById('cat-nombre').value.trim();
  const hex      = document.getElementById('cat-hex').value.trim();
  const marca    = document.getElementById('cat-marca').value;
  const material = document.getElementById('cat-material').value;
  const notas    = document.getElementById('cat-notas').value.trim();
  if (!nombre || !hex || !marca || !material) { showToast('Completá todos los campos obligatorios', true); return; }
  if (!/^#[0-9A-Fa-f]{6}$/.test(hex)) { showToast('El hex debe ser del tipo #RRGGBB', true); return; }

  const db  = firebase.database();
  const key = _catEditId || ('custom-' + Date.now().toString(36));
  const entry = { id: key, nombre, hex, marca, material, dispo: _catDispoSel, notas };

  db.ref(`marcanotech-dashboard/catalogo-colores/${key}`).set(entry)
    .then(() => {
      _catCache[key] = entry;
      renderCatalogoAdmin();
      closeModal('modal-catalogo-color');
      showToast(`Color "${nombre}" guardado ✓`);
    })
    .catch(e => showToast('Error: ' + e.message, true));
}

function deleteCatalogoColor(id) {
  if (!confirm('¿Eliminás este color del catálogo?')) return;
  const db = firebase.database();
  db.ref(`marcanotech-dashboard/catalogo-colores/${id}`).remove()
    .then(() => {
      delete _catCache[id];
      renderCatalogoAdmin();
      showToast('Color eliminado ✓');
    })
    .catch(e => showToast('Error: ' + e.message, true));
}

// ── Publicar catálogo base a Firebase (primera vez) ──
function publicarCatalogoBase() {
  if (!confirm('¿Publicás los colores base (' + (typeof COLORES_BASE !== 'undefined' ? 0 : 0) + ' colores) a Firebase? Esto los hará visibles en la web.')) return;
  showToast('Esta función corre desde la web, no desde el dashboard.');
}