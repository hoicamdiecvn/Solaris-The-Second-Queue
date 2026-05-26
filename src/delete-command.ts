import { REST, Routes } from 'discord.js';
import { config } from './config.js';

const rest = new REST({ version: '10' }).setToken(config.token);

(async () => {
    try {
        const guildIds: string[] = []; // Input những ID server muốn xoá lệnh vào 
        for (const guildId of guildIds) {
            await rest.put(
                Routes.applicationGuildCommands(config.applicationId, guildId),
                { body: [] },
            );
            console.log(`Xoá toàn bộ lệnh trong ${guildId}.`);
        }
    } catch (error) {
        console.error('Lỗi khi xóa lệnh:', error);
    }
})();