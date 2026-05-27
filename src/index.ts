import {Client, Collection, GatewayIntentBits} from 'discord.js';
import { config } from './config.js';
import registerCommands from "./structures/register_command.js";
import fs from 'node:fs';
import path from 'node:path';
import { getLogState } from './utils/logState.js';

// Đảm bảo thư mục logs tồn tại
const logsDir = path.resolve(process.cwd(), 'logs');
if (!fs.existsSync(logsDir)) {
    fs.mkdirSync(logsDir, { recursive: true });
}
const logFilePath = path.join(logsDir, 'chat.log');

function getFormattedTimestamp(): string {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const day = String(now.getDate()).padStart(2, '0');
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    const seconds = String(now.getSeconds()).padStart(2, '0');
    return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
}

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

    if (getLogState()) {
        const timestamp = getFormattedTimestamp();
        const serverName = message.guild ? message.guild.name : 'Direct Message';
        const channelName = 'name' in message.channel ? message.channel.name : 'DM';
        const username = message.author.tag;
        const content = message.content;

        const logLine = `[${timestamp}] [${serverName}] [${channelName}] [${username}]: ${content}`;

        fs.appendFile(logFilePath, logLine + '\n', (err) => {
            if (err) {
                console.error('[LOG ERROR] Lỗi khi ghi vào file log:', err);
            }
        });

        console.log(logLine);
    }
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