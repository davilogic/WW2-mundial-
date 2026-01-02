import { initializeApp } from "firebase/app";
import { getFirestore, collection, addDoc, onSnapshot, query, orderBy } from "firebase/firestore";

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

// Função para trocar de abas
window.showSection = (id) => {
    document.querySelectorAll('section').forEach(s => s.style.display = 'none');
    document.getElementById(id).style.display = 'block';
}

// Acesso Admin
window.acessarPainel = () => {
    const cod = document.getElementById('codigo-admin').value;
    if(cod === "2012") {
        document.getElementById('login-admin').style.display = 'none';
        document.getElementById('painel-controle').style.display = 'block';
        alert("Comandante autenticado!");
    } else {
        alert("Código Inválido!");
    }
}

// Lógica de envio de chat e outras funções viriam aqui...
