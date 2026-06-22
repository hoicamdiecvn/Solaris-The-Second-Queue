import { SlashCommandBuilder, EmbedBuilder } from 'discord.js';
import type { DiscordCommand } from '../structures/types.js';
import os from 'os';

const statCommand: DiscordCommand = {
    data: new SlashCommandBuilder()
        .setName('stats')
        .setDescription('Hiển thị thông số RAM, CPU và Uptime của bot'),
        
    async execute(interaction) {
        // Thông số RAM bot đang sử dụng
        const memoryUsage: NodeJS.MemoryUsage = process.memoryUsage();
        const botRamUsed: string = (memoryUsage.rss / 1024 / 1024).toFixed(2);

        // Thông số RAM tổng của máy chủ
        const totalSystemRam: string = (os.totalmem() / 1024 / 1024 / 1024).toFixed(2);
        const freeSystemRam: string = (os.freemem() / 1024 / 1024 / 1024).toFixed(2);

        // Tthời gian bot đã hoạt động
        const uptime: number = process.uptime();
        const days: number = Math.floor(uptime / 86400);
        const hours: number = Math.floor(uptime / 3600) % 24;
        const minutes: number = Math.floor(uptime / 60) % 60;
        const seconds: number = Math.floor(uptime % 60);
        const uptimeString: string = `${days}d ${hours}h ${minutes}m ${seconds}s`;

        // Thông tin CPU
        const cpuModel: string = os.cpus()?.[0]?.model || 'Unknown CPU Model';

        // Embed
        const statsEmbed: EmbedBuilder = new EmbedBuilder()
            .setColor('#00ff99')
            .setTitle('📊 Thông Số Hoạt Động Của Bot')
            .setThumbnail(interaction.client.user.displayAvatarURL())
            .addFields(
                { name: '💻 RAM Bot đang dùng', value: `${botRamUsed} MB`, inline: true },
                { name: '🖥️ RAM Hệ thống (Free/Total)', value: `${freeSystemRam} GB / ${totalSystemRam} GB`, inline: true },
                { name: '⚙️ CPU', value: `${cpuModel}`, inline: false },
                { name: '⏱️ Thời gian online liên tục', value: uptimeString, inline: false }
            )
            .setTimestamp()
            .setFooter({ text: `Yêu cầu bởi ${interaction.user.tag}`, iconURL: interaction.user.displayAvatarURL() });
        await interaction.reply({ embeds: [statsEmbed] });
    },
};

export default statCommand;