import { ChatInputCommandInteraction, SlashCommandBuilder } from 'discord.js';

// Định nghĩa cấu trúc Object này để ép kiểu cho chặt chẽ
interface DiscordCommand {
    data: SlashCommandBuilder;
    execute: (interaction: ChatInputCommandInteraction) => Promise<void>;
}

const pingCommand: DiscordCommand = {
    data: new SlashCommandBuilder()
        .setName('ping')
        .setDescription('Kiểm tra độ trễ của bot'),

    async execute(interaction) {
        await interaction.reply('Pong!');
    },
};

// Export Object này ra ngoài để file index.ts bốc vào dùng
export default pingCommand;