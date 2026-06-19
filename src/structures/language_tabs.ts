import { 
    EmbedBuilder, 
    ActionRowBuilder, 
    ButtonBuilder, 
    ButtonStyle,
    ComponentType,
    MessageContextMenuCommandInteraction
} from 'discord.js';

// Định nghĩa cấu trúc chung
export interface LanguageAnalysisData {
    languageIcon: string;     // VD: '🇯🇵', '🇬🇧', '🇨🇳'
    languageName: string;     // VD: 'tiếng Nhật', 'tiếng Anh'
    originalText: string;
    standardizedText: string;
    translatedText: string;
    pronunciation: string;    // Dùng cho Romaji, Pinyin, hoặc phiên âm IPA
    grammarList: Array<{ word: string; type: string; explanation: string }>;
    vocabList: Array<{ mainWord: string; subWord: string; meaning: string }>;
}

export async function sendLanguageAnalysisTabs(
    interaction: MessageContextMenuCommandInteraction | any, 
    data: LanguageAnalysisData, 
    modelUsed: string
) {
    const baseColor = '#ff4757';
    const footerObj = { text: `${modelUsed} | Jukis Yuri` };

    // Tab 1: Dịch thuật
    const translationEmbed = new EmbedBuilder()
        .setColor(baseColor)
        .setTitle(`${data.languageIcon} Phân tích Nghĩa & Ngữ Cảnh`)
        .setAuthor({ name: interaction.user.username, iconURL: interaction.user.displayAvatarURL() })
        .setDescription(
            `**📝 Văn bản gốc:**\n\`${data.originalText}\`\n\n` +
            `**🇻🇳 Chuẩn hóa tiếng Việt:**\n\`${data.standardizedText}\`\n\n` + 
            `>>> **🌸 Bản dịch ${data.languageName}:**\n**${data.translatedText}**\n*${data.pronunciation}*`
        )
        .setFooter(footerObj)
        .setTimestamp();

    const contextHeader = `> **${data.translatedText}**\n> *${data.pronunciation}*\n\n`;
    // Tab 2: Ngữ pháp
    const grammarEmbed = new EmbedBuilder()
        .setColor('#3498db')
        .setTitle('🧩 Cấu trúc Ngữ pháp')
        .setFooter(footerObj)
        .setTimestamp();

    let grammarBody = '';
    if (data.grammarList && data.grammarList.length > 0) {
        grammarBody = data.grammarList
            .map(item => `**${item.word}** \`[${item.type}]\`\n└ ${item.explanation}`)
            .join('\n\n');
    } else {
        grammarEmbed.setDescription('*Không phát hiện cấu trúc ngữ pháp phức tạp nào.*');
    }
    grammarEmbed.setDescription(contextHeader + grammarBody);

    // Tab 3: Từ vựng
    const vocabEmbed = new EmbedBuilder()
        .setColor('#2ecc71')
        .setTitle('📚 Từ vựng nổi bật')
        .setFooter(footerObj)
        .setTimestamp();

    let vocabBody = '';
    if (data.vocabList && data.vocabList.length > 0) {
        vocabBody = data.vocabList
            .map(item => `**${item.mainWord}** (${item.subWord})\n└ 📖 Nghĩa: *${item.meaning}*`)
            .join('\n\n');
    } else {
        vocabEmbed.setDescription('*Không có từ vựng mới nào.*');
    }
    vocabEmbed.setDescription(contextHeader + vocabBody);

    // Khởi tạo nút
    const btnTranslation = new ButtonBuilder()
        .setCustomId('tab_translation')
        .setLabel('Dịch thuật')
        .setEmoji('🔤')
        .setStyle(ButtonStyle.Primary);

    const btnGrammar = new ButtonBuilder()
        .setCustomId('tab_grammar')
        .setLabel('Ngữ pháp')
        .setEmoji('🧩')
        .setStyle(ButtonStyle.Secondary);

    const btnVocab = new ButtonBuilder()
        .setCustomId('tab_vocab')
        .setLabel('Từ vựng')
        .setEmoji('📚')
        .setStyle(ButtonStyle.Secondary);

    let actionRow = new ActionRowBuilder<ButtonBuilder>().addComponents(btnTranslation, btnGrammar, btnVocab);

    // Gửi vào DM
    const dmMessage = await interaction.user.send({ 
        embeds: [translationEmbed], 
        components: [actionRow] 
    });

    await interaction.editReply({ content: `✅ Đã gửi kết quả phân tích vào tin nhắn riêng! (${modelUsed})` });
    setTimeout(() => interaction.deleteReply().catch(() => {}), 5000);

    // Tạo collector để lắng nghe sự kiện click nút
    const collector = dmMessage.createMessageComponentCollector({ componentType: ComponentType.Button });

    collector.on('collect', async (i: any) => {
        btnTranslation.setStyle(ButtonStyle.Secondary);
        btnGrammar.setStyle(ButtonStyle.Secondary);
        btnVocab.setStyle(ButtonStyle.Secondary);

        let selectedEmbed = translationEmbed;

        if (i.customId === 'tab_translation') {
            selectedEmbed = translationEmbed;
            btnTranslation.setStyle(ButtonStyle.Primary);
        } else if (i.customId === 'tab_grammar') {
            selectedEmbed = grammarEmbed;
            btnGrammar.setStyle(ButtonStyle.Primary);
        } else if (i.customId === 'tab_vocab') {
            selectedEmbed = vocabEmbed;
            btnVocab.setStyle(ButtonStyle.Primary);
        }

        actionRow = new ActionRowBuilder<ButtonBuilder>().addComponents(btnTranslation, btnGrammar, btnVocab);
        await i.update({ embeds: [selectedEmbed], components: [actionRow] });
    });

    collector.on('end', async () => {
        await dmMessage.edit({ components: [] }).catch(() => {});
    });
}