import { 
  checkAndRegisterVideoLink, 
  rewardVideoLink 
} from '../firebase.js';

import { createMilitaryEmbed } from '../utils/embeds.js';
export async function handleVideoChannelMessage(message, client) {
  if (!message.channel.name.includes('vídeos') && !message.channel.name.includes('🎥')) {
    return;
  }

  if (message.author.bot) return;
  const urlRegex = /https?:\/\/[^\s]+/g;
  const links = message.content.match(urlRegex);

  if (!links || links.length === 0) {
    try {
      await message.delete();
      
      const warningEmbed = createMilitaryEmbed(
        "❌ MENSAGEM REMOVIDA",
        `**${message.author.tag}, apenas links de vídeos são permitidos neste canal!**\n\n` +
        `📋 **Regras do canal 🎥│・vídeos:**\n` +
        `• Apenas links de vídeos são permitidos\n` +
        `• Plataformas suportadas: YouTube, TikTok, Twitch, Instagram, Twitter, Facebook\n` +
        `• Cada link válido dá **50 Bellos**\n` +
        `• Links duplicados serão removidos\n` +
        `• Mensagens sem links serão deletadas\n\n` +
        `💡 **Dica:** Use \`/estatisticas-videos\` para ver seu progresso!`,
        0xE74C3C
      );

      await message.author.send({ embeds: [warningEmbed] }).catch(() => {
      });
      
    } catch (error) {
      console.error('Erro ao deletar mensagem:', error);
    }
    return;
  }

  let validLinkFound = false;
  let processedLinks = 0;

  for (const link of links) {
    processedLinks++;
    
    const result = await checkAndRegisterVideoLink(
      message.author.id,
      message.author.tag,
      link,
      message.id
    );

    if (result.success) {
      validLinkFound = true;
      
      const rewardResult = await rewardVideoLink(result.videoId, message.author.id);
      
      if (rewardResult.success) {
        const successEmbed = createMilitaryEmbed(
          "🎥 VÍDEO REGISTRADO!",
          `**${message.author} enviou um link de vídeo válido!**\n\n` +
          `📹 **Plataforma:** ${result.platform}\n` +
          `💰 **Recompensa:** 50 Bellos\n` +
          `🔗 **Link:** [Clique aqui](${link})\n\n` +
          `💎 **Total ganho com vídeos:** +50 Bellos\n` +
          `📊 **Use \`/estatisticas-videos\` para ver seu progresso!**`,
          0x2ECC71
        );

        await message.channel.send({ 
          content: `🎉 ${message.author} **+50 Bellos por compartilhar vídeo!**`,
          embeds: [successEmbed] 
        });

        const dmEmbed = createMilitaryEmbed(
          "💰 RECOMPensa RECEBIDA!",
          `**Olá ${message.author.tag}! Você recebeu 50 Bellos por compartilhar um vídeo!**\n\n` +
          `📹 **Vídeo:** ${link}\n` +
          `🏆 **Plataforma:** ${result.platform}\n` +
          `💎 **Recompensa:** 50 Bellos\n\n` +
          `💡 **Continue compartilhando vídeos para ganhar mais Bellos!**`,
          0x2ECC71
        );

        await message.author.send({ embeds: [dmEmbed] }).catch(() => {
        });

      }
    } else {
      if (result.reason === 'Link duplicado') {
        try {
          await message.delete();
          
          const duplicateEmbed = createMilitaryEmbed(
            "❌ LINK DUPLICADO",
            `**${message.author.tag}, este link já foi postado anteriormente!**\n\n` +
            `🔗 **Link:** ${link}\n` +
            `📛 **Motivo:** Removido por ser duplicado\n\n` +
            `💡 **Compartilhe links novos para ganhar Bellos!**`,
            0xF39C12
          );

          await message.author.send({ embeds: [duplicateEmbed] }).catch(() => {});
          
        } catch (error) {
          console.error('Erro ao deletar mensagem duplicada:', error);
        }
      } else if (result.reason === 'Plataforma não suportada') {
        try {
          await message.delete();
          
          const platformEmbed = createMilitaryEmbed(
            "❌ PLATAFORMA NÃO SUPORTADA",
            `**${message.author.tag}, plataforma de vídeo não suportada!**\n\n` +
            `🔗 **Link:** ${link}\n` +
            `📛 **Motivo:** Removido - plataforma não suportada\n\n` +
            `📋 **Plataformas suportadas:**\n` +
            `• YouTube, TikTok, Twitch\n` +
            `• Instagram, Twitter, Facebook\n\n` +
            `💡 **Use uma das plataformas acima para ganhar Bellos!**`,
            0xF39C12
          );

          await message.author.send({ embeds: [platformEmbed] }).catch(() => {});
          
        } catch (error) {
          console.error('Erro ao deletar mensagem com plataforma inválida:', error);
        }
      }
    }
  }

  if (processedLinks > 0 && !validLinkFound) {
    try {
      await message.delete();
    } catch (error) {
      console.error('Erro ao deletar mensagem sem links válidos:', error);
    }
  }
}