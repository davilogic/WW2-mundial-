import { initializeApp } from "firebase/app";
import { 
    getFirestore, 
    collection, 
    addDoc, 
    onSnapshot, 
    query, 
    orderBy, 
    serverTimestamp 
} from "firebase/firestore";

// Sua configuração (mantenha a que você já tem)
const firebaseConfig = { ... }; 

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// --- FUNÇÃO PARA ENVIAR MENSAGEM NO CHAT ---
window.enviarMensagem = async () => {
    const input = document.getElementById('chat-input');
    const msg = input.value;

    if (msg.trim() !== "") {
        try {
            await addDoc(collection(db, "chat-geral"), {
                texto: msg,
                usuario: "Soldado Anônimo", // Depois pegamos do perfil
                data: serverTimestamp()
            });
            input.value = ""; // Limpa o campo
        } catch (e) {
            console.error("Erro ao enviar: ", e);
        }
    }
}

// --- FUNÇÃO PARA LER O CHAT EM TEMPO REAL ---
const q = query(collection(db, "chat-geral"), orderBy("data", "asc"));

onSnapshot(q, (snapshot) => {
    const chatBox = document.getElementById('chat-box');
    chatBox.innerHTML = ""; // Limpa para atualizar
    snapshot.forEach((doc) => {
        const dados = doc.data();
        chatBox.innerHTML += `<p><strong>${dados.usuario}:</strong> ${dados.texto}</p>`;
    });
    chatBox.scrollTop = chatBox.scrollHeight; // Rola o chat para baixo
});
import { doc, setDoc, getDoc } from "firebase/firestore";

// FUNÇÃO PARA SALVAR O PERFIL
window.salvarPerfil = async () => {
    const nome = document.getElementById('perf-nome').value;
    const bio = document.getElementById('perf-bio').value;
    const foto = document.getElementById('perf-foto').value;

    if (!nome) return alert("Soldado! Você precisa de um nome de guerra!");

    // Aqui criamos um ID único baseado no nome (ou você pode usar o ID do dispositivo)
    const idUsuario = nome.toLowerCase().replace(/\s+/g, '-'); 

    try {
        await setDoc(doc(db, "usuarios", idUsuario), {
            nome: nome,
            bio: bio,
            foto: foto || "https://i.imgur.com/v8pE8C8.png", // Imagem padrão se ficar vazio
            cargo: "Soldado"
        });
        localStorage.setItem("meuIdRPG", idUsuario); // Salva no navegador pra ele não ter que logar sempre
        alert("Perfil salvo com sucesso! Pronto para o combate.");
        showSection('chat'); // Manda ele direto pro chat depois de salvar
    } catch (e) {
        alert("Erro ao salvar ficha: " + e);
    }
};

