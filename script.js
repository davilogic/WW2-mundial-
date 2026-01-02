import { initializeApp } from "firebase/app";
import { getFirestore, collection, addDoc, setDoc, doc, onSnapshot, query, orderBy, serverTimestamp } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyAs0eBwIlKmpcouUvVa8TF2_ke0t9QD6QE",
  authDomain: "ww2-6c783.firebaseapp.com",
  projectId: "ww2-6c783",
  storageBucket: "ww2-6c783.firebasestorage.app",
  messagingSenderId: "178695207566",
  appId: "1:178695207566:web:c93cf5dea461664d5ae7df"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// NAVEGAÇÃO
window.showSection = (id) => {
    document.querySelectorAll('.tab-content').forEach(s => s.classList.remove('active'));
    document.getElementById(id).classList.add('active');
};

// PERFIL
window.salvarPerfil = async () => {
    const nome = document.getElementById('perf-nome').value;
    const foto = document.getElementById('perf-foto').value;
    const bio = document.getElementById('perf-bio').value;
    if(!nome) return alert("Insira seu nome!");
    
    await setDoc(doc(db, "usuarios", nome), { nome, foto, bio });
    localStorage.setItem("userWW2", nome);
    alert("Perfil Atualizado!");
};

// CHAT
window.enviarMensagem = async () => {
    const input = document.getElementById('chat-input');
    const user = localStorage.getItem("userWW2") || "Soldado";
    if(input.value) {
        await addDoc(collection(db, "chat-geral"), {
            texto: input.value,
            usuario: user,
            data: serverTimestamp()
        });
        input.value = "";
    }
};

onSnapshot(query(collection(db, "chat-geral"), orderBy("data", "asc")), (snap) => {
    const box = document.getElementById('chat-box');
    box.innerHTML = "";
    snap.forEach(d => {
        box.innerHTML += `<p><strong>${d.data().usuario}:</strong> ${d.data().texto}</p>`;
    });
    box.scrollTop = box.scrollHeight;
});

// ADMIN (O código fica secreto aqui, ele não aparece no site)
window.acessarPainel = () => {
    const pass = document.getElementById('codigo-admin').value;
    if(pass === "2012") {
        document.getElementById('admin-login').style.display = "none";
        document.getElementById('admin-tools').style.display = "block";
    } else { alert("Código Negado."); }
};
