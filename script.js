import { initializeApp } from "firebase/app";
import { 
    getFirestore, collection, addDoc, onSnapshot, 
    query, orderBy, serverTimestamp, doc, setDoc, deleteDoc, getDocs, where 
} from "firebase/firestore";

// 1. SUA CONFIGURAÇÃO (Mantenha a sua se for diferente desta)
const firebaseConfig = {
  apiKey: "AIzaSyAs0eBwIlKmpcouUvVa8TF2_ke0t9QD6QE",
  authDomain: "ww2-6c783.firebaseapp.com",
  projectId: "ww2-6c783",
  storageBucket: "ww2-6c783.firebasestorage.app",
  messagingSenderId: "178695207566",
  appId: "1:178695207566:web:c93cf5dea461664d5ae7df",
  measurementId: "G-JEJYQ4TWFM"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// --- FUNÇÃO PARA NAVEGAR NO SITE ---
window.showSection = (id) => {
    document.querySelectorAll('section').forEach(s => s.style.display = 'none');
    document.getElementById(id).style.display = 'block';
};

// --- SISTEMA DE PERFIL ---
window.salvarPerfil = async () => {
    const nome = document.getElementById('perf-nome').value;
    const bio = document.getElementById('perf-bio').value;
    const foto = document.getElementById('perf-foto').value;

    if (!nome) return alert("Identifique-se, soldado!");

    await setDoc(doc(db, "usuarios", nome), {
        nome, bio, foto: foto || "https://i.imgur.com/v8pE8C8.png"
    });
    localStorage.setItem("nomeUsuario", nome);
    localStorage.setItem("fotoUsuario", foto || "https://i.imgur.com/v8pE8C8.png");
    alert("Alistado com sucesso!");
    window.showSection('chat');
};

// --- CHAT EM TEMPO REAL ---
window.enviarMensagem = async () => {
    const input = document.getElementById('chat-input');
    const nome = localStorage.getItem("nomeUsuario") || "Recruta";
    const foto = localStorage.getItem("fotoUsuario") || "";

    if (input.value.trim() !== "") {
        await addDoc(collection(db, "chat-geral"), {
            texto: input.value,
            usuario: nome,
            foto: foto,
            data: serverTimestamp()
        });
        input.value = "";
    }
};

const qChat = query(collection(db, "chat-geral"), orderBy("data", "asc"));
onSnapshot(qChat, (snapshot) => {
    const chatBox = document.getElementById('chat-box');
    chatBox.innerHTML = "";
    snapshot.forEach((doc) => {
        const d = doc.data();
        chatBox.innerHTML += `
            <div class="msg">
                <img src="${d.foto}" width="30" style="border-radius:50%" onclick="alert('Perfil: ${d.usuario}')">
                <p><strong>${d.usuario}:</strong> ${d.texto}</p>
                ${localStorage.getItem("admin") === "true" ? `<button onclick="window.apagarMensagem('${doc.id}')">X</button>` : ""}
            </div>`;
    });
    chatBox.scrollTop = chatBox.scrollHeight;
});

// --- PAINEL ADMIN (CÓDIGO 2012) ---
window.acessarPainel = () => {
    const cod = document.getElementById('codigo-admin').value;
    if (cod === "2012") {
        document.getElementById('login-admin').style.display = 'none';
        document.getElementById('painel-controle').style.display = 'block';
        localStorage.setItem("admin", "true");
        alert("Comandante no comando!");
    } else {
        alert("Código incorreto!");
    }
};

// --- FUNÇÃO DE BANIR (ADMIN) ---
window.banirUsuario = async () => {
    const nomeParaBanir = document.getElementById('ban-nome').value;
    if(!nomeParaBanir) return;

    // Remove o perfil do banco
    await deleteDoc(doc(db, "usuarios", nomeParaBanir));
    alert(`Soldado ${nomeParaBanir} foi expulso do exército!`);
};

// --- APAGAR MENSAGEM (ADMIN) ---
window.apagarMensagem = async (id) => {
    await deleteDoc(doc(db, "chat-geral", id));
};

// --- POSTAR VIP (ADMIN) ---
window.postarVip = async () => {
    const nome = document.getElementById('vip-nome').value;
    const desc = document.getElementById('vip-desc').value;
    const preco = document.getElementById('vip-preco').value;

    await addDoc(collection(db, "loja-vip"), { nome, desc, preco });
    alert("VIP postado!");
};

// --- CARREGAR LOJA ---
onSnapshot(collection(db, "loja-vip"), (snapshot) => {
    const loja = document.getElementById('lista-vips');
    loja.innerHTML = "";
    snapshot.forEach(doc => {
        const v = doc.data();
        loja.innerHTML += `
            <div class="vip-card">
                <h3>${v.nome}</h3>
                <p>${v.desc}</p>
                <p><strong>R$ ${v.preco}</strong></p>
                <button onclick="window.location.href='https://discord.gg/WMaDevNNy'">COMPRAR</button>
            </div>`;
    });
});
