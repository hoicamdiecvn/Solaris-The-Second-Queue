import { Client, GatewayIntentBits } from 'discord.js';
import { config } from './config.js';
import pingCommand from "./commands/ping.js";

// Khởi tạo Client với các quyền hạn cụ thể
const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,           // Quyền nhận diện cấu trúc server
        GatewayIntentBits.GuildMessages,    // Quyền nhận diện sự kiện có tin nhắn mới
        GatewayIntentBits.MessageContent,   // Quyền đọc nội dung chữ trong tin nhắn
    ],
});

// Khi bot đăng nhập thành công và sẵn sàng hoạt động
client.once('ready', () => {
    if (client.user) {
        console.log(`Logged in as: ${client.user.tag}`);
    }
});


client.on('messageCreate', (message) => {
    if (message.author.bot) return;
    console.log(`[${message.channel.name}] ${message.author.tag}: ${message.content}`);
});

// Gõ Lệnh
client.on('interactionCreate', async (interaction) => {
    if (!interaction.isChatInputCommand()) return;
    if (interaction.commandName === 'ping') {
        await pingCommand.execute(interaction);
    }
});

client.login(config.token);