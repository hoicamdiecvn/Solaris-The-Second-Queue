import {Client, Collection, GatewayIntentBits} from 'discord.js';
import { config } from './config.js';
import registerCommands from "./structures/register_command.js";

// Khởi tạo Client với các quyền hạn cụ thể
const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,           // Quyền nhận diện cấu trúc server
        GatewayIntentBits.GuildMessages,    // Quyền nhận diện sự kiện có tin nhắn mới
        GatewayIntentBits.MessageContent,   // Quyền đọc nội dung chữ trong tin nhắn
    ],
});

// Đẩy lệnh vào
registerCommands(client);

// Khi bot đăng nhập thành công và sẵn sàng hoạt động
client.once('clientReady', () => {
    if (client.user) {
        console.log(`Logged in as: ${client.user.tag}`);

        const commandCount = (client as any).commands.size;
        console.log(`[Hệ thống] Bot đang hoạt động với tổng cộng: ${commandCount} lệnh (/).`);
        const commandNames = Array.from((client as any).commands.keys()).map(name => `/${name}`).join(', ');
        console.log(`[Danh sách] Các lệnh sẵn sàng: ${commandNames}`);
    }
});

client.on('messageCreate', (message) => {
    if (message.author.bot) return;
    const channelName = 'name' in message.channel ? message.channel.name : 'DM';
    console.log(`[${channelName}] ${message.author.tag}: ${message.content}`);
});

// Gõ Lệnh
client.on('interactionCreate', async (interaction) => {
    if (!interaction.isChatInputCommand()) return;
    const command = (client as any).commands.get(interaction.commandName);
    if (!command) return console.error(`Không tìm thấy lệnh ${interaction.commandName} trong bộ nhớ bot.`);

    try {
        await command.execute(interaction);
    } catch (error) {
        console.error(`Lỗi khi thực thi lệnh ${interaction.commandName}:`, error);
        if (interaction.replied || interaction.deferred) {
            await interaction.followUp({ content: 'Đã có lỗi xảy ra khi chạy lệnh này!', ephemeral: true });
        } else {
            await interaction.reply({ content: 'Đã có lỗi xảy ra khi chạy lệnh này!', ephemeral: true });
        }
    }
});

client.login(config.token);