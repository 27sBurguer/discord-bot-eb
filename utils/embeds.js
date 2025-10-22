import { EmbedBuilder } from "discord.js";

export const embedColors = {
  SUCCESS: 0x2ecc71,    
  ERROR: 0xe74c3c,      
  WARNING: 0xf39c12,    
  INFO: 0x3498db,       
  MILITARY: 0x2c3e50,   
  PROMOTION: 0x9b59b6,  
  WELCOME: 0x1abc9c,    
  VERIFIED: 0x00ff00,   
  ANNOUNCEMENT: 0xf39c12 
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

export function createSuccessEmbed(title, description, fields = []) {
  return createMilitaryEmbed(title, description, embedColors.SUCCESS, fields);
}

export function createErrorEmbed(title, description, fields = []) {
  return createMilitaryEmbed(title, description, embedColors.ERROR, fields);
}

export function createWarningEmbed(title, description, fields = []) {
  return createMilitaryEmbed(title, description, embedColors.WARNING, fields);
}

export function createInfoEmbed(title, description, fields = []) {
  return createMilitaryEmbed(title, description, embedColors.INFO, fields);
}

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

export function createStatusEmbed(client, stats) {
  return createMilitaryEmbed(
    "🟢 STATUS DO SISTEMA",
    "**Informações técnicas do bot militar:**",
    embedColors.SUCCESS,
    stats
  );
}