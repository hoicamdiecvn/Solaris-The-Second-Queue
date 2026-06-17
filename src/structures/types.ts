import { ContextMenuCommandBuilder, ChatInputCommandInteraction, SlashCommandBuilder, MessageContextMenuCommandInteraction } from 'discord.js';

export interface DiscordCommand {
    data: SlashCommandBuilder | ContextMenuCommandBuilder | Omit<SlashCommandBuilder, "addSubcommand" | "addSubcommandGroup">;
    execute: (interaction: ChatInputCommandInteraction | MessageContextMenuCommandInteraction | any) => Promise<void>;
}