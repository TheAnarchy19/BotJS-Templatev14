````markdown
# 🤖 Bot.js Templatev14

*Plantilla modular para bots de Discord con arquitectura escalable y sistema de carga dinámica* [![Discord.js](https://img.shields.io/badge/Discord.js-v14-%237289DA?logo=discord)](https://discord.js.org/)
[![Node.js](https://img.shields.io/badge/Node.js-18%2B-%23339933?logo=node.js)](https://nodejs.org/)
[![License](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE)

![Banner del Proyecto](https://via.placeholder.com/800x200/2C2F33/7289DA?text=Discord.js+Advanced+Template)

---

## 📌 Descripción
Plantilla profesional para bots de Discord con:
- ✅ Sistema modular de eventos/handlers
- ✅ Configuración centralizada
- ✅ Soporte para comandos slash y prefijos
- ✅ Integración con bases de datos (MongoDB/PostgreSQL) //proximamente
- ✅ Logger avanzado con colores //proximamente
- ✅ Ready para TypeScript (opcional)

---

## 🚀 Primeros Pasos

### 📋 Requisitos
- Node.js v20 o superior
- npm v10 o yarn
- Token de bot de Discord ([crea uno aquí](https://discord.com/developers/applications))

### 🔧 Instalación
```bash
# 1. Clonar repositorio
git clone https://github.com/TheAnarchy19/BotJS-Templatev14.git
cd BotJS-Templatev14

# 2. Instalar dependencias
npm install

# 3. Configurar entorno (copiar .env.example)
cp .env.example .env

# 4. Editar .env con tus datos
nano .env  # o abre con tu editor favorito
````

### ⚙️ Variables de Entorno (`.env`)

```env
# Obligatorias
BOT_TOKEN=tu_token_aqui
PREFIX=!

```

### 🖥️ Comandos Útiles

| Comando | Descripción |
|---------|-------------|
| `npm start` | Inicia el bot en producción |
| `npm run dev` | Modo desarrollo (con nodemon) |
| `npm run deploy` | Despliega comandos slash |
| `npm run lint` | Ejecuta ESLint |
| `npm test` | Ejecuta pruebas unitarias |

-----

## 🏗️ Estructura del Proyecto //En mejora

```
📦src/
├── 📂config/            # Configuraciones
│   ├── config.js       # Parámetros globales
│   └── database.js     # Conexiones DB
├── 📂events/           # Eventos
│   ├── client/         # Eventos del bot
│   └── guild/          # Eventos de servidor
├── 📂handlers/         # Manejadores
│   ├── commands/       # Comandos
│   ├── buttons/        # Interacciones
│   └── modals/         # Formularios
├── 📂utils/            # Utilidades
│   ├── logger.js       # Sistema de logs
│   └── helpers.js      # Funciones auxiliares
└── 📜index.js          # Punto de entrada
```

-----

## 💡 Ejemplo de Módulo

### Evento (`events/client/ready.js`) 

```js
module.exports = {
    name: 'ready',
    once: true,
    execute(client) {
        console.log(`✅ ${client.user.tag} listo en ${client.guilds.cache.size} servidores`);
        
        // Establecer estado personalizado
        client.user.setActivity({
            name: `${client.config.prefix}help`,
            type: ActivityType.Listening
        });
    }
}
```

### Comando Slash (`handlers/commands/ping.js`) //Proximamente

```js
module.exports = {
    data: new SlashCommandBuilder()
        .setName('ping')
        .setDescription('Revisa la latencia del bot'),
    async execute(interaction) {
        await interaction.reply(`🏓 Pong! Latencia: ${interaction.client.ws.ping}ms`);
    }
}
```

-----

## 📚 Documentación Adicional

  - [Discord.js Guide](https://discordjs.guide/)
  - [Configuración de Intents](https://discordjs.guide/popular-topics/intents.html)
  - [Ejemplos oficiales](https://github.com/topics/discord-js-bot)

-----

## 🤝 Contribuir

1.  Haz fork del proyecto
2.  Crea una rama: `git checkout -b feature/nueva-funcion`
3.  Haz commit: `git commit -m "Añade: nueva función"`
4.  Haz push: `git push origin feature/nueva-funcion`
5.  Abre un Pull Request

-----

## 📜 Licencia

MIT © [TheAnarchy19](https://github.com/TheAnarchy19)

-----

> 💡 **Tip**: Usa `npm run deploy` para registrar comandos slash globalmente.  
> 🔧 **Soporte**:
>
>   * **Discord**: theanarchy19.oficial
>   * **Comunidad de Discord**: [Únete aquí](https://discord.gg/hfkJfVXF5X)
>   * **Mi Bot**: [TheAnarchy Bot](https://top.gg/bot/1275556555193974804)
>   * **PayPal**: [Dona aquí](https://www.paypal.com/paypalme/theanarchy19)

```
```