import { REST, Routes } from 'discord.js';
import { config } from './config.js';
import pingCommand from "./commands/ping.js";
import personalInfo from "./commands/personal_info.js";
import dotenv from "dotenv";

dotenv.config();
// Gom tất cả data của các lệnh vào một mảng JSON
const commands = [
    pingCommand.data.toJSON(),
    personalInfo.data.toJSON()
];

const rest = new REST({ version: '10' }).setToken(config.token);
(async () => {
    try {
        console.log(`Làm mới ${commands.length} lệnh (/) ứng dụng...`);
        await rest.put(
            Routes.applicationCommands(process.env.APPLICATION_ID),
            { body: commands },
        );
        console.log('Cập nhật thành công');
    } catch (error) {
        console.error('Lỗi khi deploy lệnh:', error);
    }
})();