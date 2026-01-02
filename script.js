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
