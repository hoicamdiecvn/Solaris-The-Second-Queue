import { REST, Routes } from 'discord.js';
import { config } from './config.js';

// Gom tất cả data của các lệnh vào một mảng JSON
const commands = [
    // input những commands mình muốn vào
];

const rest = new REST({ version: '10' }).setToken(config.token);
(async () => {
    try {
        const guildIds: string[] = []; // Input những ID server muốn vào

        console.log(`Làm mới ${commands.length} lệnh (/) ứng dụng...`);
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
