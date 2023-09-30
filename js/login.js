var x = document.getElementById("Login");
var y = document.getElementById("Register");
var z = document.getElementById("btn");
const socialIcons = document.querySelector(".social-icons");
const inputGroup = document.querySelector(".input-group");



function Register() {
  x.style.left = "-400px";
  y.style.left = "50px";
  z.style.left = "110px";

  socialIcons.style.display = "none";
}

function Login() {
  x.style.left = "50px";
  y.style.left = "450px";
  z.style.left = "0";
  socialIcons.style.display = "block";

}

/* ************************************************************* */
/*                          SCRIPT FIREBASE                      */
/* ************************************************************* */

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



/* ************************************************************* */
/*                           JS FIREBASE                         */
/* ************************************************************* */

const loginCheck = (user) => {
  if (user) {
    console.log("El usuario está logueado")
    console.log(user)

    window.location.href = "../index.html";

  } else {
    console.log("El usuario no está logueado")
  }
};

// events
// list for auth state changes
/* se dispara cuando se loguea o se desloguea */
auth.onAuthStateChanged((user) => {
  if (user) {
    console.log("signin");

    const referencia = database.ref(user.uid /*+ "/Username"*/ );

    referencia.on('value', (snapshot) => {
      const valor = snapshot.val();
      // Hacer algo con el valor leído
      console.log(valor);
      console.log(user);
      // debugger;
      saveUserStorage(valor.Username, user.email, user.uid)
      loginCheck(user);

    });

  } else {
    console.log("signout");
    //setupPosts([]);
    loginCheck(user);
  }
});
/* ************************************************************* */
/*                            SIGN UP                            */
/* ************************************************************* */

const signUpForm = document.querySelector("#Register");
signUpForm.addEventListener("submit", (e) => {
  e.preventDefault();
  cargando();
  const username = signUpForm["signup-username"].value;
  const email = signUpForm["signup-email"].value;
  const password = signUpForm["signup-password"].value;

  // Authenticate the User
  auth
    .createUserWithEmailAndPassword(email, password)
    .then((userCredential) => {
      // clear the form
      //signUpForm.reset();
      // close the modal
      //$("#signupModal").modal("hide");



      //saveUserStorage(username, telephone, email,"usuario",userCredential.user.uid)

      console.log(userCredential.user.uid)

      database.ref(userCredential.user.uid).set({
          Application: "Desactivado-180-10-5-1-1-0-0-0",
          Device: "",
          // Device: "181-10-1-40-41-42",
          Username: username
        })
        .then(() => {
          console.log("Registrado Correctamente")

          createToast("success", "Ha sido registrado correctamente")

          console.log('Registro agregado con éxito.');
        })
        .catch((error) => {
          console.error('Error al agregar el registro:', error);
        });


    })
    .catch(err => {
      console.log(err);
      detenerCargando();
      createToast("error", "No se ha podido registrar correctamente, compruebe son completados correctamente.")
    })
});

/* ************************************************************* */
/*                             LOGOUT                            */
/* ************************************************************* */

const logout = document.querySelector("#logout");

logout.addEventListener("click", (e) => {
  e.preventDefault();
  auth.signOut().then(() => {
    console.log("signup out");
    removeUserStorage();
  });
});

/* ************************************************************* */
/*                            SIGN IN                            */
/* ************************************************************* */

const signInForm = document.querySelector("#Login");

signInForm.addEventListener("submit", (e) => {
  e.preventDefault();
  cargando();
  // loadingAlert = cargando();
  const email = signInForm["login-email"].value;
  const password = signInForm["login-password"].value;

  // debugger;
  // Authenticate the User
  auth.signInWithEmailAndPassword(email, password).then((userCredential) => {
    console.log(userCredential)
    //console.log("Logueado Correctamente")
    //saveUserStorage(username, telephone, email,"usuario",userCredential.user.uid)

    // clear the form
    //signInForm.reset();
    // close the modal
    //$("#signinModal").modal("hide");

    createToast("success", "Ha ingresado correctamente")

  })
  .catch(err => {
    console.log(err);
    detenerCargando();
    createToast("error", "Email o contraseña incorrecta, no ha sido autenticado correctamente.")
  })
});




/* ************************************************************* */
/*                       LOGIN WITH GOOGLE                       */
/* ************************************************************* */
const googleButton = document.querySelector("#googleLogin");

googleButton.addEventListener("click", (e) => {
  e.preventDefault();
  cargando();
  //signInForm.reset();
  //$("#signinModal").modal("hide");

  const provider = new firebase.auth.GoogleAuthProvider();
  auth.signInWithPopup(provider).then((userCredential) => {
      console.log("google sign in, redirect");



      //saveUserStorage(username, telephone, email,"usuario",userCredential.user.uid)
      console.log(userCredential);
      // console.log(userCredential.user.uid)

      database.ref(userCredential.user.uid).set({
          Application: "Desactivado-180-10-5-1-1-0-0-0",
          Device: "",
          // Device: "181-10-1-40-41-42",
          Username: userCredential.user.displayName
        })
        .then(() => {
          console.log("Registrado Correctamente")

          createToast("success", "Ha sido registrado correctamente")
    
          console.log('Registro agregado con éxito.');
        })
        .catch((error) => {
          console.error('Error al agregar el registro:', error);
        });
    })
    .catch(err => {
      console.log(err);
      detenerCargando();
      createToast("error", "No se ha podido registrar correctamente, compruebe son completados correctamente.")
    })
});


/* ************************************************************* */
/*                      LOGIN WITH FACEBOOK                     */
/* ************************************************************* */

const facebookButton = document.querySelector('#facebookLogin');

facebookButton.addEventListener('click', e => {
  e.preventDefault();
  cargando();
  //signInForm.reset();
  //$("#signinModal").modal("hide");

  const provider = new firebase.auth.FacebookAuthProvider();
  auth.signInWithPopup(provider).then((result) => {
      /*console.log(result);
      console.log(result.user);
      console.log(result.user.uid);
      console.log((result.user.displayName.split(" "))[0]);
      console.log(result.user.displayName);
      console.log(result.user.phoneNumber);
      console.log(result.user.email);*/
      console.log("facebook sign in");


      // saveUserStorage((result.user.displayName.split(" "))[0],
      // (result.user.phoneNumber)? result.user.phoneNumber: "",
      // result.user.email,"usuario",result.user.uid)


      fs.collection("usuarios").doc(result.user.uid).set({
          username: (result.user.displayName.split(" "))[0],
          telefono: (result.user.phoneNumber) ? result.user.phoneNumber : "",
          email: result.user.email,
          rol: "usuario",
          id: result.user.uid
        })
        .then(() => {
          console.log("Document successfully written!");
        })
        .catch((error) => {
          console.error("Error writing document: ", error);
        });
    })
    .catch(err => {
      console.log(err);
    })

})





function saveUserStorage(_username, _email, _id) {
  // debugger
  sessionStorage.setItem('userSave',
    JSON.stringify({
      username: _username,
      email: _email,
      id: _id
    })
  );
}

function getUserStorage() {
  return JSON.parse(sessionStorage.getItem('userSave'));
}

function removeUserStorage() {
  sessionStorage.removeItem('userSave');
}




function cargando() {
  return Swal.fire({
    title: "Cargando...",
    showConfirmButton: false,
    allowOutsideClick: false,
    imageUrl: "../gifs/load.gif"
  });
}

function detenerCargando() {
  Swal.close();
}

