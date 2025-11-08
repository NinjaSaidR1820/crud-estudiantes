const tabla = document.getElementById("tablaEstudiantes");
const form = document.getElementById("formEstudiante");
const idInput = document.getElementById("id");
const nombreInput = document.getElementById("nombre");
const apellidoInput = document.getElementById("apellido");
const edadInput = document.getElementById("edad");

async function obtenerEstudiantes() {
    try {
        const response = await fetch(`http://localhost:1337/api/estudiantes`);
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }

        const data = await response.json();
        console.log(data.data);
        return data.data;
    } catch (error) {
        console.error('Error al obtener estudiantes:', error);
        return [];
    }
}

function cargarTabla(estudiantes) {
    tabla.innerHTML = '';
    if (estudiantes.length === 0) {
        tabla.innerHTML = "<tr><td colspan='5' class='text-center'>No hay estudiantes registrados.</td></tr>";
        return;
    }

    estudiantes.forEach(est => {
        const fila = `
        <tr data-id="${est.id}">
        <td>${est.id}</td>
        <td>${est.Nombre}</td>
        <td>${est.Apellido}</td>
        <td>${est.edad}</td>
        <td>
        <button class="btn btn-sm btn-warning btn-editar">Editar</button>
        <button class="btn btn-sm btn-danger btn-eliminar">Eliminar</button>
        </td>
        </tr>`;
        tabla.innerHTML += fila;
    });
}

async function init() {
    const estudiantes = await obtenerEstudiantes();
    cargarTabla(estudiantes);
}

init();

// Función para agregar un nuevo estudiante
async function agregarEstudiante(estudiante) {
    try {
        const response = await fetch('http://localhost:1337/api/estudiantes', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ data: estudiante })
        });

        if (!response.ok) {
            throw new Error('Error al agregar el estudiante.');
        }

        await init();   // Recargar la tabla
        form.reset();   // Limpiar el formulario

    } catch (error) {
        console.error('Error en agregarEstudiante:', error);
    }
}

// Evento submit del formulario
form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const nombre = nombreInput.value.trim();
    const apellido = apellidoInput.value.trim();
    const edad = edadInput.value.trim();

    if (!nombre || !apellido || !edad) {
        alert('Por favor, completa todos los campos (Nombre, Apellido, Edad).');
        return;
    }

    const nuevoEstudiante = {
        Nombre: nombre,
        Apellido: apellido,
        edad: parseInt(edad, 10)
    };

    await agregarEstudiante(nuevoEstudiante);
});
