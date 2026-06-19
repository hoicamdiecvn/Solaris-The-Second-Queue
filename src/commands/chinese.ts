import { ContextMenuCommandBuilder, ApplicationCommandType } from 'discord.js';
import type { DiscordCommand } from '../structures/types.js';
import { analyzeTextWithGemini } from '../structures/gemini_model.js';
import { sendLanguageAnalysisTabs } from '../structures/language_tabs.js';

const japanese: DiscordCommand = {
    data: new ContextMenuCommandBuilder()
        .setName('Phân tích Tiếng Trung')
        .setType(ApplicationCommandType.Message),
    
    async execute(interaction) {
        if (!interaction.isMessageContextMenuCommand()) return;
        const targetMessage = interaction.targetMessage;
        const messageContent = targetMessage.content;
        if (!messageContent) {
            return interaction.reply({ content: 'Tin nhắn này không có chữ để phân tích!', ephemeral: true });
        }
        await interaction.deferReply({ ephemeral: true });
        
        try {
            const { data: aiData, modelUsed } = await analyzeTextWithGemini(messageContent, 'src/prompts/chinese_prompt.txt'); 
            const formattedData = {
                languageIcon: '🇨🇳',
                languageName: 'tiếng Trung',
                originalText: messageContent,
                standardizedText: aiData.standard_vietnamese,
                translatedText: aiData.chinese_translation,
                pronunciation: aiData.pinyin,
                grammarList: aiData.grammar_breakdown || [],
                vocabList: (aiData.vocabulary_to_learn || []).map((item: any) => ({
                    mainWord: item.hanzi,
                    subWord: item.pinyin,
                    meaning: item.meaning
                }))
            };
            await sendLanguageAnalysisTabs(interaction, formattedData, modelUsed);

        } catch (error) {
            console.error('[Gemini API Error]:', error);
            await interaction.editReply('❌ Có lỗi xảy ra khi gọi AI. Vui lòng kiểm tra lại.');
        }
    },
};

export default japanese;