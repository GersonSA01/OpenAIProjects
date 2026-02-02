let contextoGlobal = "";
let recorder = null;
let isRecording = false; // estado de grabación
let mediaStream = null;  // guardamos el stream para cerrarlo luego

function confirmarContexto() {
  const contextInput = document.getElementById("context").value.trim();
  const apiKey = document.getElementById("apikey").value.trim();

  if (!contextInput) {
    alert("⚠️ Debes escribir un contexto primero.");
    return;
  }
  if (!apiKey) {
    alert("⚠️ Debes ingresar tu API Key.");
    return;
  }

  contextoGlobal = contextInput;

  // Mostrar contexto a la izquierda
  document.getElementById("context-view").textContent = contextoGlobal;

  // Ocultar configurador y mostrar chat
  document.getElementById("context-container").style.display = "none";
  document.getElementById("chat-container").style.display = "block";
}

async function grabarMensaje() {
  const apiKey = document.getElementById("apikey").value.trim();
  const contexto = contextoGlobal;
  const mensajesDiv = document.getElementById("messages");
  const btn = document.getElementById("record-btn");

  if (!apiKey) {
    alert("⚠️ Debes ingresar API Key.");
    return;
  }

  if (!isRecording) {
    // 👉 Iniciar grabación
    mediaStream = await navigator.mediaDevices.getUserMedia({ audio: true });
    recorder = new MediaRecorder(mediaStream);
    const chunks = [];

    recorder.ondataavailable = (e) => chunks.push(e.data);

    recorder.onstop = async () => {
      // Cerrar el micrófono
      if (mediaStream) {
        mediaStream.getTracks().forEach(track => track.stop());
        mediaStream = null;
      }

      const blob = new Blob(chunks, { type: "audio/webm" });
      const formData = new FormData();
      formData.append("audio", blob);
      formData.append("apiKey", apiKey);
      formData.append("contexto", contexto);

      const res = await fetch("/api/voicechat", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();

      const msgUsuario = document.createElement("div");
      msgUsuario.className = "user";
      msgUsuario.textContent = "🎤 Tú: " + data.transcript;
      mensajesDiv.appendChild(msgUsuario);

      const msgBot = document.createElement("div");
      msgBot.className = "bot";
      msgBot.textContent = "IA: " + data.reply;
      mensajesDiv.appendChild(msgBot);

      // 👉 reproducir voz de la IA si viene audio en base64
      if (data.audio) {
        const audio = new Audio("data:audio/mp3;base64," + data.audio);
        audio.play();
      }
    };

    recorder.start();
    isRecording = true;
    btn.textContent = "⏹ Detener";

  } else {
    // 👉 Detener grabación
    if (recorder && recorder.state === "recording") {
      recorder.stop();
    }
    isRecording = false;
    btn.textContent = "🎤 Hablar";
  }
}
