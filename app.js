import { app } from "./firebase.js";

import {
  getAuth,
  createUserWithEmailAndPassword,
  GoogleAuthProvider,
   signInWithEmailAndPassword,
   onAuthStateChanged,
   signInWithPhoneNumber,
    signInWithPopup,
    signInAnonymously,
    signOut,
    RecaptchaVerifier
} from "https://www.gstatic.com/firebasejs/9.14.0/firebase-auth.js";

let user = null;


const auth = getAuth(app);
const provier = new GoogleAuthProvider();
const btnCrear = document.querySelector("#btnCrear");
const btnGoogle = document.querySelector("#btnGoogle");
const btnIniciar = document.querySelector("#btnIniciar");
const btnCerrar=document.querySelector("#btnCerrar");

const btnAnonimo=document.querySelector("#btninco");
btnAnonimo.addEventListener('click', async(e)=>{
  e.preventDefault();
  try{
    const result= await signInAnonymously(auth);
    console.log(result);
    user=result.user;
    bootstrap.Modal.getInstance(document.getElementById('iniciarModal')).hide();
  }catch(error){
    Swal.fire('Error Al iniciar secion de anonimo')
  }

});

const btnFon=document.querySelector("#iniciartel");
btnFon.addEventListener('click', async(e)=>{
  e.preventDefault();
  try{
    const {value:tel}=await Swal.fire({
      title: 'Coloque su numero de telefono',
      input: 'tel',
      inputLabel: 'Phone',
      inputValue: '+52',
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      cancelButtonText: 'Cancel',
      confirmButtonText: 'Verify',
      showCancelButton: true,
    })
    window.recaptchaVerifier=new RecaptchaVerifier('recaptcha', {'size':'invisible'}, auth);
    const appVerifier=window.recaptchaVerifier;
    const confirmationResult=await signInWithPhoneNumber(auth, tel, appVerifier)
    console.log(confirmationResult);
    window.confirmationResult=confirmationResult;
    const {value:code}=await Swal.fire({
      title: 'Coloque su codigo de verificacion',
      input: 'text',
      inputLabel: 'Code',
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      cancelButtonText: 'Cancel',
      confirmButtonText: 'Verify',
      showCancelButton: true,
    })

    const result=await window.confirmationResult.confirm(code)
    user=result.user;
    checarEstado(user)

  }catch(error){
    Swal.fire('Error al iniciar con num de telefono');
  }
  });

btnGoogle.addEventListener('click',async(e)=>{
  e.preventDefault();
  try {
    const credentials= await signInWithPopup(auth,provier)
    user=credentials.user;
    const modalInstance= bootstrap.modal.getInstance(btnGoogle.closest('.modal'));
    modalInstance.hide();
    checarEstado(user)
} catch (error) {
    console.log(error);
  }
 
})
const checarEstado=(user=null)=>{
  console.log(user);
  if (user==null) {
    document.querySelector("#iniciar").style.display="block";
    document.querySelector("#crear").style.display="block";
    document.querySelector("#btnCerrar").style.display="none";
    document.querySelector("#escaner").style.display="none";
  } else {
    document.querySelector("#iniciar").style.display="none";
    document.querySelector("#crear").style.display="none";
    document.querySelector("#btnCerrar").style.display="block";
    document.querySelector("#escaner").style.display="block";
  }
}

btnCerrar.addEventListener('click',async(e)=>{
  e.preventDefault();
  try {
    await  signOut(auth);
    checarEstado()
  } catch ( error) {
    console.log(error)
  }
  });
  
  
  






onAuthStateChanged(auth,(user)=>{
  const container=document.querySelector("#container");
  checarEstado(user);
  if (user) {
container.innerHTML=`<h1>BIENVENIDO: ${user.email}</h1>
<button class="btn btn-dark btn-lg float-end m-2"  data-bs-toggle="modal" data-bs-target="#addModal"><i class="bi bi-plus-circle m-2"></i>Agregars</button>
<table class="table table-dark">
<tr class="table-dark">
<td class="table-dark">marca</td>
<td class="table-dark">tipo</td>
<td class="table-dark">codigo</td>
<td class="table-dark">precio</td>
<td class="table-dark">cantidad</td>
<td class="table-dark">color</td>
<td class="table-dark">Borrar</td>
<td class="table-dark">Editar</td>
<td class="table-dark">QR</td>
</tr>
</table>

 


<table class="table table-dark" id="lista">
    
  </table>












`

const uid=user.uid;

  } else {
    container.innerHTML=`<h1>no hay usuarios</h1>`
  }
})






 btnIniciar.addEventListener("click", async (e) => {
  e.preventDefault();
  const email = document.querySelector("#iniciarEmail");
  const password = document.querySelector("#iniciarPassword");
  console.log(email.value, password.value);

   try {
     const res = await signInWithEmailAndPassword(
       auth,
       email.value,
       password.value
     );
     console.log(res.user);
     const user = res.user;
     Swal.fire('Bienvenido Nuevamente!!');
     var myModalEl = document.getElementById("iniciarModal");
     var modal = bootstrap.Modal.getInstance(myModalEl);
     modal.hide();
     const res2 = await onAuthStateChanged(auth, (user) => {
       const container = document.querySelector("#container");
       if (user) {
         container.innerHTML = `<h1>${user.email} </h1>`;
         document.querySelector("#iniciar").style.display = "none";
         document.querySelector("#crear").style.display = "none";
         const uid = user.uid;
       } else {
       container.innerHTML = `<h1>No Hay Usuarios!!</h1>`;
       }
     });
   } catch (error) {
     Swal.fire("Usuario y/o Password Incorrectos");
   }
   bootstrap.Modal.getInstance(document.getElementById('iniciarModal')).hide();
});

btnCrear.addEventListener("click", async (e) => {
  e.preventDefault();
  const email = document.querySelector("#crearEmail");
  const password = document.querySelector("#crearPassword");
  console.log(email.value, password.value);
  var myModalEl = document.getElementById("crearModal");
  var modal = bootstrap.Modal.getInstance(myModalEl);

  try {
    const respuesta = await createUserWithEmailAndPassword(
      auth,
      email.value,
      password.value
    );
    console.log(respuesta.user);
    Swal.fire({
      icon: "success",
      title: "exito",
      text: "Se Registro Correctamente!!",
    });
    email.value = "";
    password.value = "";
    modal.hide();
  } catch (error) {
    console.log(error.code);
    const code = error.code;
    if (code === "auth/invalid-email") {
      Swal.fire({
        icon: "error",

        text: "Email Invalido!",
      });
    } else if (code === "auth/weak-password") {
      Swal.fire({
        icon: "error",

        text: "Password Invalida!",
      });
    } else if (code === "auth/email-already-in-user") {
      Swal.fire({
        icon: "error",

        text: "Email Ya Esta Registrado!",
      });
    }
  }
});
checarEstado();