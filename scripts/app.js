// ====================== VARIABLES ======================
const tabla = document.getElementById("tablaEstudiantes");
const form = document.getElementById("formEstudiante");
const idInput = document.getElementById("id");
const nombreInput = document.getElementById("nombre");
const apellidoInput = document.getElementById("apellido");
const edadInput = document.getElementById("edad");

// ====================== GET ======================
async function obtenerEstudiantes() {
    try {
        const response = await fetch("http://localhost:1337/api/estudiantes");
        if (!response.ok) throw new Error("Error al obtener los datos.");
        const data = await response.json();
        console.log(data.data);
        return data.data;
    } catch (error) {
        console.error("Error al obtener estudiantes:", error);
        return [];
    }
}

// ====================== CARGAR TABLA ======================
function cargarTabla(estudiantes) {
    tabla.innerHTML = "";
    if (estudiantes.length === 0) {
        tabla.innerHTML = "<tr><td colspan='5' class='text-center'>No hay estudiantes registrados.</td></tr>";
        return;
    }

    estudiantes.forEach((est) => {
        const fila = `
        <tr data-document-id="${est.documentId}">
            <td>${est.IdEstudiante}</td>
            <td>${est.Nombre}</td>
            <td>${est.Apellido}</td>
            <td>${est.Edad}</td>
            <td>
                <button class="btn btn-sm btn-warning btn-editar">Editar</button>
                <button class="btn btn-sm btn-danger btn-eliminar">Eliminar</button>
            </td>
        </tr>`;
        tabla.innerHTML += fila;
    });
}

// ====================== POST ======================
async function agregarEstudiante(estudiante) {
    try {
        const response = await fetch("http://localhost:1337/api/estudiantes", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ data: estudiante }),
        });
        if (!response.ok) throw new Error("Error al agregar el estudiante.");
        await init(); // Recargar tabla
        form.reset(); // Limpiar formulario
    } catch (error) {
        console.error("Error en agregarEstudiante:", error);
    }
}

// ====================== PUT ======================
async function actualizarEstudiante(docId, estudiante) {
    try {
        const response = await fetch(`http://localhost:1337/api/estudiantes/${docId}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ data: estudiante }),
        });
        if (!response.ok) throw new Error("Error al actualizar el estudiante.");
    } catch (error) {
        console.error("Error en actualizarEstudiante:", error);
    }
}

// ====================== DELETE ======================
async function eliminarEstudiante(docId) {
    try {
        const response = await fetch(`http://localhost:1337/api/estudiantes/${docId}`, {
            method: "DELETE",
        });
        if (!response.ok) throw new Error("Error al eliminar el estudiante.");
    } catch (error) {
        console.error("Error en eliminarEstudiante:", error);
    }
}

// ====================== EVENTOS DE TABLA ======================
tabla.addEventListener("click", async (e) => {
    if (e.target.classList.contains("btn-editar")) {
        // ---- Llenar formulario para editar ----
        const fila = e.target.closest("tr");
        const docId = fila.dataset.documentId;
        const nombre = fila.children[1].textContent;
        const apellido = fila.children[2].textContent;
        const edad = fila.children[3].textContent;

        idInput.value = docId;
        nombreInput.value = nombre;
        apellidoInput.value = apellido;
        edadInput.value = edad;

    } else if (e.target.classList.contains("btn-eliminar")) {
        // ---- Eliminar estudiante ----
        const fila = e.target.closest("tr");
        const docId = fila.dataset.documentId;
        if (confirm("¿Estás seguro de que quieres eliminar este estudiante?")) {
            await eliminarEstudiante(docId);
            await init(); // Recargar tabla
        }
    }
});

// ====================== EVENTO SUBMIT ======================
form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const docId = idInput.value;
    const nombre = nombreInput.value.trim();
    const apellido = apellidoInput.value.trim();
    const edad = edadInput.value.trim();

    if (!nombre || !apellido || !edad) {
        alert("Por favor, complete todos los campos.");
        return;
    }

    const estudianteData = {
        Nombre: nombre,
        Apellido: apellido,
        edad: parseInt(edad, 10),
    };

    if (docId) {
        await actualizarEstudiante(docId, estudianteData);
    } else {
        await agregarEstudiante(estudianteData);
    }

    form.reset();
    await init();
});

// ====================== INICIALIZAR ======================
async function init() {
    const estudiantes = await obtenerEstudiantes();
    cargarTabla(estudiantes);
}

init();
