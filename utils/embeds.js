import { EmbedBuilder } from "discord.js";

// 🎨 Cores para os Embeds
export const embedColors = {
  SUCCESS: 0x2ecc71,    // Verde
  ERROR: 0xe74c3c,      // Vermelho
  WARNING: 0xf39c12,    // Laranja
  INFO: 0x3498db,       // Azul
  MILITARY: 0x2c3e50,   // Azul militar
  PROMOTION: 0x9b59b6,  // Roxo para promoções
  WELCOME: 0x1abc9c,    // Verde água para boas-vindas
  VERIFIED: 0x00ff00,   // Verde para verificação
  ANNOUNCEMENT: 0xf39c12 // Laranja para anúncios
};

/**
 * 🎖️ Função para criar embed militar padronizado
 * @param {string} title - Título do embed
 * @param {string} description - Descrição do embed
 * @param {number} color - Cor do embed (hexadecimal)
 * @param {Array} fields - Campos do embed
 * @param {string} thumbnail - URL da thumbnail
 * @returns {EmbedBuilder} Embed construído
 */
export function createMilitaryEmbed(title, description, color = embedColors.MILITARY, fields = [], thumbnail = null) {
  const embed = new EmbedBuilder()
    .setTitle(`🎖️ ${title}`)
    .setDescription(description)
    .setColor(color)
    .setTimestamp()
    .setFooter({ 
      text: 'Sistema Militar de Verificação', 
      iconURL: 'https://i.imgur.com/8S3j3Zy.png' 
    });

  if (fields.length > 0) {
    embed.addFields(...fields);
  }

  if (thumbnail) {
    embed.setThumbnail(thumbnail);
  }

  return embed;
}

/**
 * ✅ Embed de sucesso padronizado
 */
export function createSuccessEmbed(title, description, fields = []) {
  return createMilitaryEmbed(title, description, embedColors.SUCCESS, fields);
}

/**
 * ❌ Embed de erro padronizado
 */
export function createErrorEmbed(title, description, fields = []) {
  return createMilitaryEmbed(title, description, embedColors.ERROR, fields);
}

/**
 * ⚠️ Embed de aviso padronizado
 */
export function createWarningEmbed(title, description, fields = []) {
  return createMilitaryEmbed(title, description, embedColors.WARNING, fields);
}

/**
 * ℹ️ Embed de informação padronizado
 */
export function createInfoEmbed(title, description, fields = []) {
  return createMilitaryEmbed(title, description, embedColors.INFO, fields);
}

/**
 * 🎉 Embed de boas-vindas padronizado
 */
export function createWelcomeEmbed(member, description = null) {
  const defaultDescription = `**Bem-vindo às Forças Armadas, ${member.user}!**\n\n` +
    `📍 **Identificação:** ${member.user.tag}\n` +
    `🎖️ **Cargo Inicial:** Civis\n` +
    `📅 **Data de Alistamento:** <t:${Math.floor(Date.now() / 1000)}:F>\n\n` +
    `**📝 Próximos Passos:**\n` +
    `• Use \`/manual\` para ver as instruções\n` +
    `• Use \`/conectar\` para verificar sua conta Roblox\n` +
    `• Obedeça às ordens dos superiores!`;

  return createMilitaryEmbed(
    "🎉 NOVO RECRUTA CHEGOU!",
    description || defaultDescription,
    embedColors.WELCOME,
    [],
    member.user.displayAvatarURL()
  );
}

/**
 * 📊 Embed de status do bot
 */
export function createStatusEmbed(client, stats) {
  return createMilitaryEmbed(
    "🟢 STATUS DO SISTEMA",
    "**Informações técnicas do bot militar:**",
    embedColors.SUCCESS,
    stats
  );
}