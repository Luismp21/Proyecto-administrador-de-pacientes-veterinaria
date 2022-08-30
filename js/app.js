//Campos del formulario
const mascotaInput = document.querySelector("#mascota");
const propietarioInput = document.querySelector("#propietario");
const telefonoInput = document.querySelector("#telefono");
const fechaInput = document.querySelector("#fecha");
const horaInput = document.querySelector("#hora");
const sintomasInput = document.querySelector("#sintomas");

//UI
const formulario = document.querySelector("#nueva-cita");
const contenedorCitas = document.querySelector("#citas");

let editando;

//Clases

class Citas {
  constructor() {
    this.citas = [];
    this.citas = JSON.parse(localStorage.getItem("Citas")) || [];
  }
  agregarCita(cita) {
    this.citas = [...this.citas, cita];
    sincronizarLocalStorage(this.citas);
  }
  eliminarCita(id) {
    this.citas = this.citas.filter((cita) => cita.id !== id);
    sincronizarLocalStorage(this.citas);
  }
  editarCita(citaActualizada) {
    this.citas = this.citas.map((cita) =>
      cita.id === citaActualizada.id ? citaActualizada : cita
    );
    sincronizarLocalStorage(this.citas);
  }
}

function sincronizarLocalStorage(thisCitas) {
  localStorage.setItem("Citas", JSON.stringify(thisCitas));
}

class UI {
  crearError(mensaje, tipo) {
    //Crear el div
    const divMensaje = document.createElement("div");

    //Agregar clases genericas
    divMensaje.classList.add("text-center", "alert", "col-12", "d-block");

    if (tipo === "error") {
      divMensaje.classList.add("alert-danger");
      divMensaje.textContent = mensaje;
    } else {
      divMensaje.classList.add("alert-success");
      divMensaje.textContent = mensaje;
    }

    //Agregra al HTML
    document
      .querySelector("#contenido")
      .insertBefore(divMensaje, document.querySelector(".agregar-cita"));

    //Quitar el mensaje despues de 3s
    setTimeout(() => {
      divMensaje.remove();
    }, 3000);
  }

  imprimirCitas({ citas }) {
    this.limpiarHTML();
    citas.forEach((cita) => {
      const { mascota, propietario, telefono, fecha, hora, sintomas, id } =
        cita;

      const divCita = document.createElement("div");
      divCita.classList.add("cita", "p-3");
      divCita.dataset.id = id;

      //Scripting de los elementos de la citas
      const mascotaParrafo = document.createElement("h2");
      mascotaParrafo.classList.add("card-title", "font-weight-bolder");
      mascotaParrafo.textContent = mascota;

      const propietarioParrafo = document.createElement("p");
      propietarioParrafo.innerHTML = `
        <span class = "font-weight-bolder">Dueño: </span> ${propietario}
      `;

      const telefonoParrafo = document.createElement("p");
      telefonoParrafo.innerHTML = `
      <span class = "font-weight-bolder">Teléfono: </span> ${telefono}
      `;

      const fechaParrafo = document.createElement("p");
      fechaParrafo.innerHTML = `
      <span class = "font-weight-bolder">Fecha: </span> ${fecha}
      `;

      const horaParrafo = document.createElement("p");
      horaParrafo.innerHTML = `
      <span class = "font-weight-bolder">Hora: </span> ${hora}
      `;

      const sintomasParrafo = document.createElement("p");
      sintomasParrafo.innerHTML = `
      <span class = "font-weight-bolder">Síntomas: </span> ${sintomas}
      `;

      //Agregar un btn para eliminar las citas
      const btnEliminar = document.createElement("button");
      btnEliminar.classList.add("btn", "btn-danger", "mr-2");
      btnEliminar.innerHTML = `Eliminar <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
      <path strokeLinecap="round" strokeLinejoin="round" d="M9.75 9.75l4.5 4.5m0-4.5l-4.5 4.5M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
     </svg>
      `;

      //Funcion onclick para eliminar cita
      btnEliminar.onclick = () => eliminarCita(id);

      //Agregar un btn para editar las citas
      const btnEditar = document.createElement("button");
      btnEditar.classList.add("btn", "btn-info", "mr-2");
      btnEditar.innerHTML = ` Editar <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
        <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10" />
      </svg>
      `;

      //Funcion onclick para editar cita
      btnEditar.onclick = () => cargarEdicion(cita);

      //Agregar los Parrafos al divCita
      divCita.appendChild(mascotaParrafo);
      divCita.appendChild(propietarioParrafo);
      divCita.appendChild(telefonoParrafo);
      divCita.appendChild(fechaParrafo);
      divCita.appendChild(horaParrafo);
      divCita.appendChild(sintomasParrafo);
      divCita.appendChild(btnEliminar);
      divCita.appendChild(btnEditar);

      //Insertar en el HTML
      contenedorCitas.appendChild(divCita);
    });
  }

  //Limpiar HTML
  limpiarHTML() {
    while (contenedorCitas.firstChild) {
      contenedorCitas.removeChild(contenedorCitas.firstChild);
    }
  }
}

//Instanciar las clases

const administrarCitas = new Citas();
const ui = new UI();

//Registrar Eventos
eventListener();
function eventListener() {
  mascotaInput.addEventListener("input", datosCita);
  propietarioInput.addEventListener("input", datosCita);
  telefonoInput.addEventListener("input", datosCita);
  fechaInput.addEventListener("input", datosCita);
  horaInput.addEventListener("input", datosCita);
  sintomasInput.addEventListener("input", datosCita);

  formulario.addEventListener("submit", nuevaCita);

  //Evento para cargar el lolalStorage
  document.addEventListener("DOMContentLoaded", () => {
    ui.imprimirCitas(administrarCitas);
  });
}

//Objeto con la informacion de la cita
const citaObjt = {
  mascota: "",
  propietario: "",
  telefono: "",
  fecha: "",
  hora: "",
  sintomas: "",
};

//Funciones
//Agrega datos al objeto
function datosCita(e) {
  citaObjt[e.target.name] = e.target.value;
  // console.log(citaObjt);
}

//Validar y agregar
function nuevaCita(e) {
  e.preventDefault();

  //Extraer la Informacion
  const { mascota, propietario, telefono, fecha, hora, sintomas } = citaObjt;

  //Validar
  if (
    mascota === "" ||
    propietario === "" ||
    telefono === "" ||
    fecha === "" ||
    hora === "" ||
    sintomas === ""
  ) {
    ui.crearError("Debe de llenar todos los campos", "error");
    return;
  }

  if (editando) {
    //mensaje de editado correctamente
    ui.crearError("Editado correctamente");

    //Pasar el Objt de la cita edicion
    administrarCitas.editarCita({ ...citaObjt });

    //Regresa el texto del boton a su estado original
    formulario.querySelector("button[type='submit']").textContent =
      "Crear Cita";

    //Quitar Modo edicion
    editando = false;
  } else {
    //Crear una ID
    citaObjt.id = Date.now();

    //Crear una nueva Cita
    administrarCitas.agregarCita({ ...citaObjt });

    //mensaje de agregado correctamente
    ui.crearError("Se agregó correctamente");
  }

  //Reiniciar el Objeto
  reiniciarObjeto();

  //Reiniciar el formulario
  formulario.reset();

  //Mostra el HTML de las citas
  ui.imprimirCitas(administrarCitas);
}

//Reiniciar el objeto
function reiniciarObjeto() {
  citaObjt.mascota = "";
  citaObjt.propietario = "";
  citaObjt.telefono = "";
  citaObjt.fecha = "";
  citaObjt.hora = "";
  citaObjt.sintomas = "";
}

//Eliminar cita
function eliminarCita(id) {
  //Eliminar cita
  administrarCitas.eliminarCita(id);
  console.log(id);

  //Muestra un mensaje
  ui.crearError("Cita Eliminida Correctamente");

  //Actualiza las citas
  ui.imprimirCitas(administrarCitas);
}

//Carga los datos y el modo edicion
function cargarEdicion(cita) {
  //Extraer la Informacion
  const { mascota, propietario, telefono, fecha, hora, sintomas, id } = cita;

  //Llenar los inputs
  mascotaInput.value = mascota;
  propietarioInput.value = propietario;
  telefonoInput.value = telefono;
  fechaInput.value = fecha;
  horaInput.value = hora;
  sintomasInput.value = sintomas;

  //Llenar el objeto
  citaObjt.mascota = mascota;
  citaObjt.propietario = propietario;
  citaObjt.telefono = telefono;
  citaObjt.fecha = fecha;
  citaObjt.hora = hora;
  citaObjt.sintomas = sintomas;
  citaObjt.id = id;

  //Cambiar el texto en el boton
  formulario.querySelector("button[type='submit']").textContent =
    "Guardar Cambios";

  editando = true;
}
