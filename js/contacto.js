/* Variables User Profile*/
const ingresar = document.querySelector(".ingresar");
const logueado = document.querySelector(".logueado");
const loggedUser = document.getElementById("logged-user1");
const modalContent = document.getElementById("modal-body");

/* Variables App*/

let estado_sanitizante, base_co2, base_ozono, base_minutos, estado_detener,
  detener_por_co2, detener_por_ozono, detener_por_minutos, estado_extractor;

/* Fin Variables App*/

/* Variables Disp*/
let co2, ozono_liberado, minutos_encendido, monoxido, gas_natural, temperatura, ozono;

/* Fim Variables Disp*/

let flag; // No sé para qué se usa

const divAutomatizacionCo2 = document.querySelector('.automatizacion_co2');
// const limiteCO2 = document.getElementById('limite_co2');

const divAutomatizacionOzono = document.querySelector('.automatizacion_ozono');
const barraOzono = document.getElementById('barra_ozono');
const limiteOzono = document.getElementById('limite_ozono');

const divAutomatizacionMinutos = document.querySelector('.automatizacion_minutos');
// const limiteMinutos = document.getElementById('limite_minutos');

const inputCO2 = document.getElementById('base_co2');
const inputOzono = document.getElementById('base_ozono');
const inputMinutos = document.getElementById('base_minutos');


/* Configuraciones */
const divAguja = document.querySelector('.aguja');
const cbActivar = document.getElementById('check-config');

const divDetenerCuando = document.querySelector('.detener_cuando');
const inputDetenerPorCO2 = document.getElementById('detener_por_co2');
const divTextCO2 = document.getElementById('tb-CO2');
const inputBaseCO2 = document.getElementById('base_co2');
const inputDetenerPorOzono = document.getElementById('detener_por_ozono');
const divTextOzono = document.getElementById('tb-ozono');
const inputBaseOzono = document.getElementById('base_ozono');
const inputDetenerPorMinutos = document.getElementById('detener_por_minutos');
const divTextMinutos = document.getElementById('tb-minutos');
const inputBaseMinutos = document.getElementById('base_minutos');




let btnPower;
let btnPowerExtractor;



/* ************************************************************* */
/*                          SCRIPT FIREBASE                      */
/* ************************************************************* */

//Variables de referencia de escucha de cambios en el user, Application y Device
let refUser = null;
let refApp = null;
let refDev = null;


const firebaseConfig = {
  apiKey: "AIzaSyD-vYQZydNHc1uzqoEPBwdUNOh8jtI-K1s",
  authDomain: "kozapp-8529c.firebaseapp.com",
  databaseURL: "https://kozapp-8529c-default-rtdb.firebaseio.com",
  projectId: "kozapp-8529c",
  storageBucket: "kozapp-8529c.appspot.com",
  messagingSenderId: "254335785667",
  appId: "1:254335785667:web:dd27bad275cb2ddeb76076"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);
const auth = firebase.auth();
const database = firebase.database();
const logout = document.querySelector("#logout");

logout.addEventListener("click", (e) => {
  e.preventDefault();
  console.log("logout")
  auth.signOut().then(() => {
    console.log("signup out");

    sessionStorage.removeItem('userSave');

    location.reload();
  });
});



window.addEventListener("load", () => {
  //console.log("Funcionó el onload");
  let saveUserStorage = JSON.parse(sessionStorage.getItem("userSave"));

  if (saveUserStorage) {
    ingresar.style.display = "none";
    logueado.style.display = "block";
    loggedUser.innerHTML = `<label class="logged-user">${saveUserStorage.username}</label>`;
    logueado.classList.add("loggerprint");
    modalContent.innerHTML = `
            <p>${saveUserStorage.username}</p>
            <p>${saveUserStorage.email}</p>
    `
  } else {
    ingresar.style.display = "block";
    logueado.style.display = "none";
    logueado.classList.remove("loggerprint");
    window.location.href = "../html/login.html";
  }
});


/* ************************************************************* */
/*                           JS FIREBASE                         */
/* ************************************************************* */

const loginCheck = (user) => {
  if (user) {
    console.log("El usuario está logueado")
    console.log(user)


  } else {
    console.log("El usuario no está logueado")
  }
};

auth.onAuthStateChanged((user) => {
  if (user) {
    console.log("signin");
    console.log(user);

    // Escuchar cambios en /Username
    refUser = database.ref(user.uid + "/Username");
    refUser.on('value', (snapshot) => {
      const valor = snapshot.val();
      console.log(valor);

    }, (error) => {
      console.error("Error al escuchar cambios en 'Username':", error);
    });

    // Escuchar cambios en /Application
    refApp = database.ref(user.uid + "/Application");
    refApp.on('value', (snapshot) => {
      const valor = snapshot.val();
      console.log(valor);
      var partes = valor.split("-");
      var var1 = partes[0];
      var var2 = partes[1];
      var var3 = partes[2];
      var var4 = partes[3];
      var var5 = partes[4];
      var var6 = partes[5];
      var var7 = partes[6];
      var var8 = partes[7];
      var var9 = partes[8];
      CargarDatosDeApplication(var1, var2, var3, var4, var5, var6, var7, var8, var9);

    }, (error) => {
      console.error("Error al escuchar cambios en 'Application':", error);
    });

    // Escuchar cambios en /Device
    refDev = database.ref(user.uid + "/Device");
    refDev.on('value', (snapshot) => {
      const valor = snapshot.val();
      console.log(valor);
      var partes = valor.split("-");

      var var1 = partes[0];
      var var2 = partes[1];
      var var3 = partes[2];
      var var4 = partes[3];
      var var5 = partes[4];
      var var6 = partes[5];
      CargarDatosDelDevice(var1, var2, var3, var4, var5, var6);
    }, (error) => {
      console.error("Error al escuchar cambios en 'Device':", error);
    });


  } else {
    console.log("signout");
    loginCheck(user);
    window.location.href = "../index.html";
  }
});


/* ************************************************************* */
/*                              Navbar                           */
/* ************************************************************* */

const btnMenu = document.querySelector("#btnMenu");
const menu = document.querySelector("#menu");
btnMenu.addEventListener("click", function () {
  menu.classList.toggle("mostrar");
});


const nav = document.querySelector('header')
window.addEventListener('scroll', fixNav)

function fixNav() {
  if (window.scrollY > nav.offsetHeight + 50) {
    nav.classList.add('active')
  } else {
    nav.classList.remove('active')
  }
}




/* ************************************************************* */
/*                               MAIN                            */
/* ************************************************************* */

function CargarDatosDeApplication(_estado_sanitizante, _base_co2, _base_ozono, _base_minutos,
  _estado_detener, _detener_por_co2, _detener_por_ozono, _detener_por_minutos, _estado_extractor) {
  estado_sanitizante = _estado_sanitizante;
  base_co2 = _base_co2;
  base_ozono = _base_ozono;
  base_minutos = _base_minutos;
  estado_detener = _estado_detener;
  detener_por_co2 = _detener_por_co2;
  detener_por_ozono = _detener_por_ozono;
  detener_por_minutos = _detener_por_minutos;
  estado_extractor = _estado_extractor;



  
  


  /* Configuraciones */
  /********** Limite CO2 ************/


  inputCO2.value = base_co2;
  inputOzono.value = base_ozono;
  inputMinutos.value = base_minutos;





  if (estado_detener == "1") {
    cbActivar.checked = true;
    document.getElementById('state-config').textContent = "Activado";
    divDetenerCuando.style.display = 'block';
    inputDetenerPorCO2.style.display = 'block';
    divTextCO2.style.display = 'block';
    inputBaseCO2.style.display = 'block';
    inputDetenerPorOzono.style.display = 'block';
    divTextOzono.style.display = 'block';
    inputBaseOzono.style.display = 'block';
    inputDetenerPorMinutos.style.display = 'block';
    divTextMinutos.style.display = 'block';
    inputBaseMinutos.style.display = 'block';
  } else {
    cbActivar.checked = false;
    document.getElementById('state-config').textContent = "Activado";
    divDetenerCuando.style.display = 'none';
    inputDetenerPorCO2.style.display = 'none';
    divTextCO2.style.display = 'none';
    inputBaseCO2.style.display = 'none';
    inputDetenerPorOzono.style.display = 'none';
    divTextOzono.style.display = 'none';
    inputBaseOzono.style.display = 'none';
    inputDetenerPorMinutos.style.display = 'none';
    divTextMinutos.style.display = 'none';
    inputBaseMinutos.style.display = 'none';
  }
  if (detener_por_co2 == "1") {
    inputDetenerPorCO2.checked = true;
  } else {
    inputDetenerPorCO2.checked = false;
  }
  if (detener_por_ozono == "1") {
    inputDetenerPorOzono.checked = true;
  } else {
    inputDetenerPorOzono.checked = false;
  }
  if (detener_por_minutos == "1") {
    inputDetenerPorMinutos.checked = true;
  } else {
    inputDetenerPorMinutos.checked = false;
  }

  /* EXTRACTOR */
  var card;
  $('.footer-extractor').empty();
  var contenido = $('.footer-extractor');
  if (estado_extractor == "1") {
    card = `<button type="button" class="btn btn-success" id="power_extractor"> Activado </button>`
  } else {
    card = `<button type="button" class="btn btn-danger" id="power_extractor"> Desactivado </button>`
  }
  contenido.append(card);
  btnPowerExtractor = document.getElementById('power_extractor');

  // Agrega el evento click al botón
  btnPowerExtractor.addEventListener('click', function () {
    powerExtractor();
  });





}





function CargarDatosDelDevice(_co2, _ozono_liberado, _minutos_encendido, _monoxido, _gas_natural, _temperatura) {
  console.log("Cargar Datos");
  co2 = _co2;
  ozono_liberado = _ozono_liberado;
  minutos_encendido = _minutos_encendido;
  monoxido = _monoxido;
  gas_natural = _gas_natural;
  temperatura = _temperatura;

  if (estado_sanitizante == "Activado" && estado_detener == "1") {
    if (detener_por_co2 == "1") {
      if (co2 <= base_co2) {
        detenerDispositivo();
      }
    }
    if (detener_por_ozono == "1") {
      if (ozono_liberado >= base_ozono) {
        detenerDispositivo();
      }
    }
    if (detener_por_minutos == "1") {
      //if(Integer.parseInt(part_minutos_encendido)>=Integer.parseInt(base_minutos)){
      let minutoSs = minutos_encendido.toString().split(":")[0];
      if (minutoSs >= base_minutos) {
        detenerDispositivo();
      }
    }
  }

}



function detenerDispositivo() {
  // detenerReloj();

  let datosAEnviar = '';

  datosAEnviar = "Desactivado" + "-" + base_co2 + "-" + base_ozono + "-" + base_minutos +
    "-" + estado_detener + "-" + detener_por_co2 + "-" + detener_por_ozono + "-" + detener_por_minutos +
    "-" + estado_extractor;

  console.log(datosAEnviar);
  // refApp.set(datosAEnviar)
  //       .then(() => {
  //           console.log('Datos enviados con éxito a Firebase Realtime Database');
  //       })
  //       .catch((error) => {
  //           console.error('Error al enviar datos a Firebase:', error);
  //       });

}

const configurationForm = document.querySelector("#save");




cbActivar.addEventListener('change', function () {
  if (cbActivar.checked) {
    // cbActivar.setText("Activado");
    divDetenerCuando.style.display = 'block';
    inputDetenerPorCO2.style.display = 'block';
    divTextCO2.style.display = 'block';
    inputBaseCO2.style.display = 'block';
    inputDetenerPorOzono.style.display = 'block';
    divTextOzono.style.display = 'block';
    inputBaseOzono.style.display = 'block';
    inputDetenerPorMinutos.style.display = 'block';
    divTextMinutos.style.display = 'block';
    inputBaseMinutos.style.display = 'block';
  } else {
    // cbActivar.setText("Desactivado");
    divDetenerCuando.style.display = 'none';
    inputDetenerPorCO2.style.display = 'none';
    divTextCO2.style.display = 'none';
    inputBaseCO2.style.display = 'none';
    inputDetenerPorOzono.style.display = 'none';
    divTextOzono.style.display = 'none';
    inputBaseOzono.style.display = 'none';
    inputDetenerPorMinutos.style.display = 'none';
    divTextMinutos.style.display = 'none';
    inputBaseMinutos.style.display = 'none';
  }
});



configurationForm.addEventListener("click", (e) => {
  e.preventDefault();
  estado_detener = (document.getElementById('check-config').checked)?1:0;
  detener_por_co2 = (document.getElementById('detener_por_co2').checked)?1:0;
  base_co2 = document.getElementById('base_co2').value;
  detener_por_ozono = (document.getElementById('detener_por_ozono').checked)?1:0;
  base_ozono = document.getElementById('base_ozono').value;
  detener_por_minutos = (document.getElementById('detener_por_minutos').checked)?1:0;
  base_minutos = document.getElementById('base_minutos').value;

  // Luego puedes hacer lo que quieras con estos valores
  // console.log('Nivel de Cpnfig es (Checkbox):', estado_detener);
  // console.log('Nivel de CO2 es (Checkbox):', detener_por_co2);
  // console.log('Nivel de CO2:', base_co2);
  // console.log('Ozono liberado es (Checkbox):', detener_por_ozono);
  // console.log('Ozono liberado:', base_ozono);
  // console.log('Transcurren minutos (Checkbox):', detener_por_minutos);
  // console.log('Minutos:', base_minutos);

  let datosAEnviar = '';
  if (estado_detener && !detener_por_co2 && !detener_por_ozono && !detener_por_minutos) {
    console.log("Para activar la detención automática debe activar alguna opción para su detenimiento.");
    createToast("success", "Para activar la detención automática debe activar alguna opción para su detenimiento.")
  } else {
    datosAEnviar = estado_sanitizante + "-" + base_co2 + "-" + base_ozono + "-" + base_minutos +
      "-" + estado_detener + "-" + detener_por_co2 + "-" + detener_por_ozono + "-" + detener_por_minutos +
      "-" + estado_extractor;

      console.log(datosAEnviar)
      // refDev.set(datosAEnviar)
      //     .then(() => {
      //         console.log('Datos enviados con éxito a Firebase Realtime Database');
      //     })
      //     .catch((error) => {
      //         console.error('Error al enviar datos a Firebase:', error);
      //     });
    
    
  }


});


/* ######################################## Extractor ########################################  */
function powerExtractor() {
  if (estado_extractor == "1") {
    estado_extractor = "0"; // Uso auxiliar
  } else {
    estado_extractor = "1";
  }

  let datosAEnviar = estado_sanitizante + "-" + base_co2 + "-" + base_ozono + "-" + base_minutos +
    "-" + estado_detener + "-" + detener_por_co2 + "-" + detener_por_ozono + "-" + detener_por_minutos +
    "-" + estado_extractor;

  console.log(datosAEnviar)
  refApp.set(datosAEnviar)
    .then(() => {
      console.log('Datos enviados con éxito a Firebase Realtime Database');
    })
    .catch((error) => {
      console.error('Error al enviar datos a Firebase:', error);
    });
}
/* ######################################## FIN Extractor ########################################  */