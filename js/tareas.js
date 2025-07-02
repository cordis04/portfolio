// Lógica de la Lista de Tareas
function initializeTodoList() {
    const inputTarea = document.getElementById('tareaNueva');
    const btnAgregar = document.getElementById('botonAgregar');
    const listaTareas = document.getElementById('listaDeTareas');
    
    if (!inputTarea || !btnAgregar || !listaTareas) {
        console.warn("Elementos de la lista de tareas no encontrados. El script no se inicializará.");
        return;
    }

    let db;
    const DB_NAME = 'TareasDB';
    const STORE_NAME = 'tareas';
    const DB_VERSION = 1;
    
    const request = indexedDB.open(DB_NAME, DB_VERSION);
    
    request.onerror = function(event) {
        console.error("Error al abrir la base de datos", event.target.error);
        listaTareas.innerHTML = '<li class="error">Error al cargar las tareas. Recarga la página.</li>';
    };
    
    request.onsuccess = function(event) {
        db = event.target.result;
        cargarTareas();
    };
    
    request.onupgradeneeded = function(event) {
        const db = event.target.result;
        
        const objectStore = db.createObjectStore(STORE_NAME, {
            keyPath: 'id',
            autoIncrement: true
        });
        
        objectStore.createIndex('texto', 'texto', { unique: false });
        objectStore.createIndex('completada', 'completada', { unique: false });
    };
    
    btnAgregar.addEventListener('click', agregarTarea);
    inputTarea.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') agregarTarea();
    });
    
    function agregarTarea() {
        const texto = inputTarea.value.trim();
        if (texto === '') return;
        
        const transaction = db.transaction([STORE_NAME], 'readwrite');
        const store = transaction.objectStore(STORE_NAME);
        
        const tarea = {
            texto: texto,
            completada: false,
            fecha: new Date().toISOString()
        };
        
        const request = store.add(tarea);
        
        request.onsuccess = function() {
            inputTarea.value = '';
            inputTarea.focus();
            cargarTareas();
        };
        
        request.onerror = function(event) {
            console.error("Error al agregar tarea", event.target.error);
        };
    }
    
    function cargarTareas() {
        const transaction = db.transaction([STORE_NAME], 'readonly');
        const store = transaction.objectStore(STORE_NAME);
        const request = store.getAll();
        
        request.onsuccess = function(event) {
            const tareas = event.target.result;
            renderizarTareas(tareas);
        };
        
        request.onerror = function(event) {
            console.error("Error al cargar tareas", event.target.error);
            listaTareas.innerHTML = '<li class="error">Error al cargar las tareas. Recarga la página.</li>';
        };
    }
    
    function renderizarTareas(tareas) {
        if (tareas.length === 0) {
            listaTareas.innerHTML = '<li class="vacio">No hay tareas. ¡Añade alguna!</li>';
            return;
        }
        
        listaTareas.innerHTML = '';
        
        // Ordenar por fecha (nueva a vieja)
        tareas.sort((a, b) => new Date(b.fecha) - new Date(a.fecha));
        
        tareas.forEach(tarea => {
            const li = document.createElement('li');
            li.className = `tarea ${tarea.completada ? 'completada' : ''}`;
            li.dataset.id = tarea.id;
            
            const span = document.createElement('span');
            span.textContent = tarea.texto;
            
            const divAcciones = document.createElement('div');
            divAcciones.className = 'acciones';
            
            const btnCompletar = document.createElement('button');
            btnCompletar.textContent = tarea.completada ? '❌' : '✓';
            btnCompletar.onclick = () => toggleCompletada(tarea);
            
            const btnEditar = document.createElement('button');
            btnEditar.textContent = '✏️';
            btnEditar.className = 'editar';
            btnEditar.onclick = () => editarTarea(tarea);
            
            const btnGuardar = document.createElement('button');
            btnGuardar.textContent = '💾';
            btnGuardar.className = 'guardar';
            btnGuardar.style.display = 'none';
            btnGuardar.onclick = () => guardarEdicion(tarea.id);
            
            const btnEliminar = document.createElement('button');
            btnEliminar.textContent = '🗑️';
            btnEliminar.className = 'eliminar';
            btnEliminar.onclick = () => eliminarTarea(tarea.id);
            
            divAcciones.appendChild(btnCompletar);
            divAcciones.appendChild(btnEditar);
            divAcciones.appendChild(btnGuardar);
            divAcciones.appendChild(btnEliminar);
            
            li.appendChild(span);
            li.appendChild(divAcciones);
            listaTareas.appendChild(li);
        });
    }
    
    function toggleCompletada(tarea) {
        const transaction = db.transaction([STORE_NAME], 'readwrite');
        const store = transaction.objectStore(STORE_NAME);
        
        tarea.completada = !tarea.completada;
        
        const request = store.put(tarea);
        
        request.onsuccess = function() {
            cargarTareas();
        };
        
        request.onerror = function(event) {
            console.error("Error al actualizar tarea", event.target.error);
        };
    }
    
    function editarTarea(tarea) {
        const li = document.querySelector(`li[data-id="${tarea.id}"]`);
        
        if (li) {
            const span = li.querySelector('span');
            const input = document.createElement('input');
            input.type = 'text';
            input.value = tarea.texto;
            input.className = 'edit-input';
            
            li.replaceChild(input, span);
            input.focus();
            
            li.querySelector('.editar').style.display = 'none';
            li.querySelector('.guardar').style.display = 'block';
            
            input.addEventListener('keypress', function(e) {
                if (e.key === 'Enter') {
                    guardarEdicion(tarea.id);
                }
            });
        }
    }
    
    function guardarEdicion(id) {
        const li = document.querySelector(`li[data-id="${id}"]`);
        if (!li) return;

        const input = li.querySelector('.edit-input');
        if (!input) return;

        const nuevoTexto = input.value.trim();
        
        if (nuevoTexto === '') {
            eliminarTarea(id);
            return;
        }
        
        const transaction = db.transaction([STORE_NAME], 'readwrite');
        const store = transaction.objectStore(STORE_NAME);
        const getRequest = store.get(id);
        
        getRequest.onsuccess = function(event) {
            const tarea = event.target.result;
            if (tarea) {
                tarea.texto = nuevoTexto;
                tarea.fecha = new Date().toISOString();
                
                const putRequest = store.put(tarea);
                
                putRequest.onsuccess = function() {
                    cargarTareas();
                };
                
                putRequest.onerror = function(event) {
                    console.error("Error al guardar edición", event.target.error);
                };
            }
        };
        
        getRequest.onerror = function(event) {
            console.error("Error al obtener tarea para editar", event.target.error);
        };
    }
    
    function eliminarTarea(id) {
        const transaction = db.transaction([STORE_NAME], 'readwrite');
        const store = transaction.objectStore(STORE_NAME);
        const request = store.delete(id);
        
        request.onsuccess = function() {
            cargarTareas();
        };
        
        request.onerror = function(event) {
            console.error("Error al eliminar tarea", event.target.error);
        };
    }
}

// Inicializar cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', initializeTodoList);
