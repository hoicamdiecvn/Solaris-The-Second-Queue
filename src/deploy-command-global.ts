import { REST, Routes } from 'discord.js';
import { config } from './config.js';
import {commandsPath} from "./utils/commands_path.js";

const applicationId = process.env.APPLICATION_ID;

const rest = new REST({ version: '10' }).setToken(config.token);
(async () => {
    try {
        const commands = await commandsPath();

        await rest.put(
            Routes.applicationCommands(config.applicationId),
            { body: commands },
        );
        console.log('Cập nhật thành công');
    } catch (error) {
        console.error('Lỗi khi deploy lệnh:', error);
    }
})();
