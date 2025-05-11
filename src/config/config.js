module.exports = {
  bot: {
    name: "BotHandler v14",
    clientid: "",  // Este es el ID del cliente de Discord
    description: "",  // Una descripción del bot
    topgg: "https://top.gg/bot/",
    paypal: "https://www.paypal.com/paypalme/",
    discordlist: "https://discordlist.gg/bot/",
  },
  support: {
    name: "",  // Nombre del servidor de soporte
    invite: "",  // Enlace de invitación del servidor de soporte
  },
  website: {
    showStatus: true,  // Si mostrar el estado del bot en la página web
    url: {
      ip: "localhost",  // Dirección IP o nombre de dominio del servidor
      port: 8080,  // Puerto donde corre la aplicación web
      protocol: process.env.PROTOCOL || "http://",  // Protocolo (http o https)
      domain: process.env.PROTOCOL ? `${process.env.PROTOCOL}localhost` : "http://localhost",  // Se ajusta según el protocolo
    },
    callback: "http://localhost:8080/auth/discord/callback",  // URL para el callback de autenticación
    cookieSecret: "",  // Clave secreta para cookies
    description: "",  // Descripción del sitio web
    feature1: "",  // Característica adicional o mensaje
  },
};
