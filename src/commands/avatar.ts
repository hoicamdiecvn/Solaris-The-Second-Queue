import { SlashCommandBuilder } from 'discord.js';
import type { DiscordCommand } from '../structures/types.js';

const helpCommand: DiscordCommand = {
    data: new SlashCommandBuilder()
        .setName('avatar')
        .setDescription('Lấy avatar profile của bản thân'),
    
    async execute(interaction) {
        const avatarUrl = interaction.user.displayAvatarURL({ extension: 'png', size: 4096 });
        await interaction.reply({
            embeds: [{
                color: 0x0099ff,
                title: `Avatar của ${interaction.user.username}`,
                image: { url: avatarUrl }
            }]
        });
    },
};

export default helpCommand;