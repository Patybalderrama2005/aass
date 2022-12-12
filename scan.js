import {
    getFirestore,
    collection,
    getDocs,
    onSnapshot,
    addDoc,
    deleteDoc,
    doc,
    getDoc,
    updateDoc
} from "https://www.gstatic.com/firebasejs/9.14.0/firebase-firestore.js";
 
import {app} from './firebase.js ';
const db=getFirestore(app);
const coleccion=collection(db,"alumnos");




const onScanSuccess = async (qrCodeMessage) => {
  const data = await getDoc(doc(db, "alumnos", qrCodeMessage));
  const alumno = data.data();
  document.querySelector("#result").innerHTML = `
  <p>${alumno.marca}</p>
  <p>${alumno.tipo}</p>
  <p>${alumno.codigo}</p>
  <p>${alumno.precio}</p>
  <p> ${alumno.cantidad}</p>
  <p>${alumno.color}</p>
    `;
  scan.clear();
  document.querySelector("#reader").remove();
}
const onScanError = (errorMessage) => {
  //swal.fire('Error al escanear El QR')
}
var scan = new Html5QrcodeScanner(
  "reader", { fps: 10, qrbox: 250 });
scan.render(onScanSuccess, onScanError);