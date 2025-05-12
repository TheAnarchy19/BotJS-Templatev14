module.exports = {
  /* ===========================
     Configuración básica del bot
     =========================== */
  bot: {
    name: "BotHandler v14",
    prefix: process.env.PREFIX || "!", // Prefijo por defecto
    token: process.env.TOKEN || "", // Token del bot (OBLIGATORIO, usa .env)
    guildId: "ID_DEL_SERVIDOR", // ID de tu servidor
    clientId: "ID_DEL_BOT", // ID de la aplicación en Discord Dev Portal
    embedColors: {
      default: "#2b2d31",       // Color principal (gris oscuro de Discord)
      error: "#ff0000",         // Rojo para errores
      success: "#00ff00",       // Verde para acciones exitosas
      warning: "#ffff00",       // Amarillo para advertencias
      info: "#0099ff",          // Azul claro para información
      premium: "#ffcc00",       // Dorado para funciones premium
      moderation: "#a84300",    // Naranja oscuro para logs de moderación
      random: () => `#${Math.floor(Math.random() * 16777215).toString(16)}`, // Color aleatorio (opcional)
    },
  },

  /* ===========================
     Configuración del servidor
     =========================== */
  server: {
    // Roles importantes
    roles: {
      admin: "ID_ROL_ADMIN", // Rol con permisos de administrador
      moderator: "ID_ROL_MOD", // Rol para moderadores
      premium: "ID_ROL_PREMIUM", // Rol para usuarios premium
      muted: "ID_ROL_MUTE", // Rol para silenciar usuarios
    },

    // Canales de logs y eventos
    channels: {
      logs: "ID_CANAL_LOGS", // Canal para logs (comandos, errores)
      welcome: "ID_CANAL_BIENVENIDAS", // Canal de bienvenidas
      voiceLogs: "ID_CANAL_LOGS_VOZ", // Registro de actividad en voz
      commands: "ID_CANAL_COMANDOS", // Canal exclusivo para comandos (opcional)
    },

    // Sistema de voz temporal
    tempVoice: {
      enabled: true, // Activar/desactivar
      createChannel: "ID_CANAL_CREACION", // Canal donde se crean salas
      category: "ID_CATEGORIA_VOZ", // Categoría donde se alojan las salas
      defaultName: "🎙️│Sala de {user}", // Formato del nombre
      defaultLimit: 4, // Límite de usuarios (0 = ilimitado)
    },

    // Tickets (opcional)
    tickets: {
      enabled: false, // Si usas sistema de tickets
      channel: "ID_CANAL_TICKETS", // Canal donde se crean
      category: "ID_CATEGORIA_TICKETS", // Categoría para tickets abiertos
      supportRoles: ["ID_ROL_SOPORTE"], // Roles que atienden tickets
    },
  },

  /* ===========================
     Configuración de comandos personalizados
     =========================== */
  customCommands: {
    "reglas": "📜 **Reglas del servidor:**\n1. No spam...\n2. Sé respetuoso...",
    "ip": "🌍 **IP del servidor de Minecraft:** `mc.miservidor.com`",
  },

  /* ===========================
     Extras (opcionales)
     =========================== */
  features: {
    autoMod: true, // Anti-links, anti-spam, etc.
    levelSystem: false, // Sistema de niveles (ej: MEE6)
    welcomeDM: "¡Bienvenido al servidor! Lee las reglas en #📜reglas", // Mensaje por MD
  },
};

/* 
  Mi nombre: TheAnarchy19 
  Mi Discord: TheAanrchy19.oficial 
  Mi servidor: https://discord.gg/anarchy 
  Donaciones y un poco más 
*/