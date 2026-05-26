import { REST, Routes } from 'discord.js';
import { config } from './config.js';
import {commandsPath} from "./utils/commands_path.js";

const rest = new REST({ version: '10' }).setToken(config.token);
(async () => {
    try {
        const commands = await commandsPath();
        const guildIds: string[] = []; // Input những ID server muốn vào

        for (const guildId of guildIds) {
            await rest.put(
                Routes.applicationGuildCommands(config.applicationId, guildId),
                {body: commands},
            );
            console.log(`Các server được cập nhật gồm: ${guildId}`)
        }
        console.log('Cập nhật thành công vào các server chỉ định');
    } catch (error) {
        console.error('Lỗi khi deploy lệnh:', error);
    }
})();
