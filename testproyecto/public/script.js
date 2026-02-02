async function enviarMensaje() {
  const input = document.getElementById('input');
  const contextInput = document.getElementById('context');
  const mensaje = input.value;
  const contexto = contextInput.value;

  if (!mensaje.trim()) {
    alert("⚠️ El mensaje no puede estar vacío.");
    return;
  }

  const mensajes = document.getElementById('messages');
  const msgUsuario = document.createElement('div');
  msgUsuario.className = 'message user';
  msgUsuario.textContent = mensaje;
  mensajes.appendChild(msgUsuario);

  input.value = '';

  const res = await fetch('/api/contextchat', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      apiKey: 'sk-*************',
      contexto,
      mensaje
    })
  });

  const data = await res.json();
  const respuesta = document.createElement('div');
  respuesta.className = 'message bot';
  respuesta.textContent = data.reply;
  mensajes.appendChild(respuesta);
}