// catalog.js
import { 
  ActionRowBuilder, 
  ButtonBuilder, 
  ButtonStyle, 
  StringSelectMenuBuilder,
  ModalBuilder,
  TextInputBuilder,
  TextInputStyle,
  PermissionFlagsBits,
} from "discord.js";

import { createMilitaryEmbed } from "../utils/embeds.js";
import { getCatalogItems, getItem, createPurchase, getUser } from "../firebase.js";

export const commands = [
  {
    name: "catalogo",
    description: "🛍️ Abre o catálogo de itens do Bellinho"
  },
  {
    name: "additem",
    description: "➕ Adicionar item ao catálogo (Admin)",
    default_member_permissions: "8",
    options: [
      {
        name: "nome",
        type: 3,
        description: "📝 Nome do item",
        required: true
      },
      {
        name: "descricao",
        type: 3,
        description: "📄 Descrição do item",
        required: true
      },
      {
        name: "preco_moedas",
        type: 4,
        description: "💰 Preço em Bellos",
        required: true,
        min_value: 1
      },
      {
        name: "preco_pix",
        type: 10,
        description: "💵 Preço em PIX",
        required: true,
        min_value: 0.01
      },
      {
        name: "categoria",
        type: 3,
        description: "📦 Categoria do item",
        required: true,
        choices: [
          { name: "💵 Dinheiro no Jogo", value: "dinheiro" },
          { name: "⭐ VIP", value: "vip" },
          { name: "🎖️ Cargos", value: "cargos" },
          { name: "🎁 Pacotes", value: "pacotes" },
          { name: "📦 Outros", value: "outros" },
          { name: "💫 Gamepass", value: "passes"}
        ]
      },
      {
        name: "emoji",
        type: 3,
        description: "😊 Emoji do item (opcional)",
        required: false
      },
      {
        name: "cupom_nome",
        type: 3,
        description: "🎫 Nome do cupom de desconto (opcional)",
        required: false
      },
      {
        name: "cupom_descricao",
        type: 3,
        description: "📝 Descrição do cupom (opcional)",
        required: false
      },
      {
        name: "cupom_desconto",
        type: 10, // NUMBER
        description: "💰 Percentual de desconto (0.1 = 10%)",
        required: false,
        min_value: 0.01,
        max_value: 0.99
      }
    ]
  },
  {
    name: "edititem",
    description: "✏️ Editar item do catálogo (Admin)",
    default_member_permissions: "8", // "8" é o valor numérico para Administrator
    options: [
      {
        name: "item_id",
        type: 3,
        description: "🆔 ID do item para editar",
        required: true
      },
      {
        name: "campo",
        type: 3,
        description: "📝 Campo para editar",
        required: true,
        choices: [
          { name: "Nome", value: "name" },
          { name: "Descrição", value: "description" },
          { name: "Preço em Bellos", value: "coinPrice" },
          { name: "Preço em PIX", value: "pixPrice" },
          { name: "Disponibilidade", value: "available" }
        ]
      },
      {
        name: "valor",
        type: 3,
        description: "🎯 Novo valor",
        required: true
      }
    ]
  },
  {
    name: "removeitem",
    description: "🗑️ Remover item do catálogo (Admin)",
    default_member_permissions: "8",
    options: [
      {
        name: "item_id",
        type: 3,
        description: "🆔 ID do item para remover",
        required: true
      },
      {
        name: "confirmacao",
        type: 3,
        description: "❌ Digite 'CONFIRMAR' para remover o item",
        required: true,
        choices: [
          { name: "✅ CONFIRMAR REMOÇÃO", value: "CONFIRMAR" }
        ]
      }
    ]
  },
  {
    name: "iditem",
    description: "🔍 Buscar informações de um item pelo nome",
    default_member_permissions: "8", // Apenas admin pode usar
    options: [
        {
        name: "nome_item",
        type: 3,
        description: "🛍️ Nome do item para buscar",
        required: true,
        autocomplete: true
        }
    ]
    },
    {
      name: "diario",
      description: "🎁 Resgatar recompensa diária de Bellos"
    },
    {
      name: "streak",
      description: "🔥 Ver seu streak atual e ranking"
    },
    {
      name: "checkin",
      description: "✅ Verificar status do resgate diário"
    },
    {
      name: "lootbox",
      description: "🎁 Comprar e abrir uma lootbox (30 Bellos)"
    },
    {
      name: "meus-codigos",
      description: "📋 Ver seus códigos de lootbox"
    },
    {
      name: "estatisticas-lootbox",
      description: "📊 Ver estatísticas das suas lootboxes"
    },
    {
      name: "estatisticas-videos",
      description: "📊 Ver estatísticas dos seus vídeos compartilhados"
    },
    {
      name: "regras-videos",
      description: "📋 Ver regras do canal de vídeos"
    }
];

export async function execute(interaction, client) {
  const { commandName } = interaction;

  switch (commandName) {
    case "catalogo":
      await handleCatalogo(interaction, client);
      break;
    case "additem":
      await handleAddItem(interaction, client);
      break;
    case "edititem":
      await handleEditItem(interaction, client);
      break;
    case "removeitem":
      await handleRemoveItem(interaction, client);
      break;
    case "iditem":
      await handleIdItem(interaction, client);
      break;
    case "diario":
      await handleDiario(interaction, client);
      break;
    case "streak":
      await handleStreak(interaction, client);
      break;
    case "checkin":
      await handleCheckin(interaction, client);
      break;
    case "lootbox":
      await handleLootbox(interaction, client);
      break;
    case "meus-codigos":
      await handleMeusCodigos(interaction, client);
      break;
    case "estatisticas-lootbox":
      await handleEstatisticasLootbox(interaction, client);
      break;
    case "estatisticas-videos":
      await handleEstatisticasVideos(interaction, client);
      break;
    case "regras-videos":
      await handleRegrasVideos(interaction, client);
      break;
  }
}

// ============================================================
// 📊 COMANDO: /estatisticas-videos
// ============================================================

async function handleEstatisticasVideos(interaction, client) {
  await interaction.deferReply({ ephemeral: true });

  try {
    const { getUserVideoStats } = await import('../firebase.js');
    
    const stats = await getUserVideoStats(interaction.user.id);
    
    if (stats.totalVideos === 0) {
      const emptyEmbed = createMilitaryEmbed(
        "📊 ESTATÍSTICAS DE VÍDEOS",
        `**${interaction.user.tag}, você ainda não compartilhou nenhum vídeo!**\n\n` +
        `🎥 **Como ganhar Bellos com vídeos:**\n` +
        `1. Vá para o canal 🎥│・vídeos\n` +
        `2. Poste um link de vídeo (YouTube, TikTok, etc)\n` +
        `3. Ganhe **50 Bellos** por link válido!\n` +
        `4. Links duplicados serão removidos\n\n` +
        `💡 **Plataformas suportadas:** YouTube, TikTok, Twitch, Instagram, Twitter, Facebook`,
        0x95A5A6
      );
      return interaction.editReply({ embeds: [emptyEmbed] });
    }

    const statsEmbed = createMilitaryEmbed(
      "📊 ESTATÍSTICAS DE VÍDEOS",
      `**${interaction.user.tag}, aqui estão suas estatísticas:**\n\n` +
      `🎥 **Total de vídeos compartilhados:** ${stats.totalVideos}\n` +
      `💰 **Total de Bellos ganhos:** ${stats.totalRewards}\n` +
      `📈 **Média por vídeo:** 50 Bellos\n` +
      `🏆 **Último vídeo:** ${stats.videos.length > 0 ? `<t:${Math.floor(new Date(stats.videos[0].postedAt).getTime() / 1000)}:R>` : 'Nunca'}`,
      0x3498DB
    );

    // Adicionar últimos vídeos
    if (stats.videos.length > 0) {
      const recentVideos = stats.videos.slice(0, 5);
      let videosText = '';
      
      recentVideos.forEach((video, index) => {
        const date = new Date(video.postedAt);
        videosText += `**${index + 1}.** [${video.platform}](${video.videoUrl}) - <t:${Math.floor(date.getTime() / 1000)}:D>\n`;
      });

      statsEmbed.addFields({
        name: "📺 ÚLTIMOS VÍDEOS",
        value: videosText,
        inline: false
      });
    }

    statsEmbed.addFields(
      {
        name: "💰 SISTEMA DE RECOMPENSAS",
        value: "• **50 Bellos** por link válido\n• Apenas links **novos**\n• Máximo: **sem limite**\n• Plataformas suportadas",
        inline: true
      },
      {
        name: "📋 REGRAS",
        value: "• Apenas links de vídeo\n• Sem duplicatas\n• Plataformas suportadas\n• Sem spam",
        inline: true
      }
    );

    statsEmbed.setFooter({ 
      text: `Continue compartilhando vídeos para ganhar mais Bellos! • ${new Date().toLocaleDateString('pt-BR')}` 
    });

    await interaction.editReply({ embeds: [statsEmbed] });

  } catch (error) {
    console.error("Erro no comando estatisticas-videos:", error);
    const errorEmbed = createMilitaryEmbed(
      "❌ ERRO",
      "**Ocorreu um erro ao buscar suas estatísticas.**\n\nTente novamente.",
      0xE74C3C
    );
    await interaction.editReply({ embeds: [errorEmbed] });
  }
}

// ============================================================
// 📋 COMANDO: /regras-videos
// ============================================================

async function handleRegrasVideos(interaction, client) {
  await interaction.deferReply({ ephemeral: true });

  const rulesEmbed = createMilitaryEmbed(
    "📋 REGRAS DO CANAL DE VÍDEOS",
    `**🎥│・vídeos - Sistema de Recompensas**\n\n` +
    `💰 **Ganhe 50 Bellos por cada link de vídeo válido!**\n\n` +
    `📜 **REGRAS E DIRETRIZES:**\n` +
    `✅ **PERMITIDO:**\n` +
    `• Links de vídeos do YouTube\n` +
    `• Links do TikTok, Instagram Reels\n` +
    `• Vídeos do Twitch, Facebook Watch\n` +
    `• Twitter/X com vídeos\n` +
    `• Apenas **links novos** (não duplicados)\n\n` +
    `❌ **NÃO PERMITIDO:**\n` +
    `• Links duplicados (serão removidos)\n` +
    `• Mensagens sem links (serão deletadas)\n` +
    `• Spam de múltiplos links\n` +
    `• Links de plataformas não suportadas\n` +
    `• Conteúdo inadequado ou ofensivo\n\n` +
    `🎯 **COMO FUNCIONA:**\n` +
    `1. Poste um link no canal 🎥│・vídeos\n` +
    `2. Sistema verifica automaticamente\n` +
    `3. Se for válido: **+50 Bellos**\n` +
    `4. Se for duplicado: mensagem removida\n` +
    `5. Use \`/estatisticas-videos\` para ver progresso\n\n` +
    `💡 **Dica:** Compartilhe vídeos interessantes da comunidade!`,
    0xF39C12
  );

  rulesEmbed.addFields(
    {
      name: "📺 PLATAFORMAS SUPORTADAS",
      value: "YouTube, TikTok, Twitch, Instagram, Twitter/X, Facebook",
      inline: true
    },
    {
      name: "💰 RECOMPENSA",
      value: "50 Bellos por link",
      inline: true
    },
    {
      name: "⚡ LIMITE",
      value: "Sem limite diário",
      inline: true
    }
  );

  await interaction.editReply({ embeds: [rulesEmbed] });
}

// ============================================================
// 🎁 COMANDO: /lootbox - COMPRAR E ABRIR LOOTBOX
// ============================================================

// No comando /lootbox, atualize as probabilidades:
async function handleLootbox(interaction, client) {
  await interaction.deferReply({ ephemeral: true });

  try {
    // Criar embed de confirmação com RARIDADES ATUALIZADAS
    const confirmEmbed = createMilitaryEmbed(
      "🎁 LOOTBOX - CONFIRMAÇÃO",
      `**${interaction.user.tag}, você está prestes a comprar uma lootbox!**\n\n` +
      `💰 **Custo:** 30 Bellos\n` +
      `🎯 **Itens possíveis:** 7 códigos diferentes\n` +
      `📊 **Sistema de raridade ATUALIZADO:**\n` +
      `• 🟢 **Comum (60%)** - Dino Rosa, Dino Verde\n` +
      `• 🔵 **Raro (25%)** - Dominus Branco\n` +
      `• 🟣 **Épico (13%)** - Dominus Vermelho, Esqueleto Branco, Esqueleto Vermelho\n` +
      `• 🟠 **Lendário (2%)** - Dominus Esqueleto\n\n` +
      `⚠️ **ALERTA IMPORTANTE:**\n` +
      `• **Poderá vir códigos repetidos!**\n` +
      `• **Cada lootbox é totalmente aleatória**\n` +
      `• **Não há garantia de itens novos**\n` +
      `• **Lendário tem apenas 2% de chance!**\n\n` +
      `**Deseja continuar com a compra?**`,
      0xF39C12
    );

    // Botões de confirmação (mantido igual)
    const confirmRow = new ActionRowBuilder()
      .addComponents(
        new ButtonBuilder()
          .setLabel('✅ SIM, COMPRAR LOOTBOX (30 Bellos)')
          .setStyle(ButtonStyle.Success)
          .setCustomId('confirm_lootbox'),
        new ButtonBuilder()
          .setLabel('❌ NÃO, CANCELAR')
          .setStyle(ButtonStyle.Danger)
          .setCustomId('cancel_lootbox')
      );

    await interaction.editReply({ 
      embeds: [confirmEmbed],
      components: [confirmRow]
    });

  } catch (error) {
    console.error("Erro no comando lootbox:", error);
    const errorEmbed = createMilitaryEmbed(
      "❌ ERRO",
      "**Ocorreu um erro ao processar o comando.**\n\nTente novamente.",
      0xE74C3C
    );
    await interaction.editReply({ embeds: [errorEmbed] });
  }
}

// ============================================================
// 📋 COMANDO: /meus-codigos - VER CÓDIGOS OBTIDOS
// ============================================================

async function handleMeusCodigos(interaction, client) {
  await interaction.deferReply({ ephemeral: true });

  try {
    const { getUserLootboxCodes } = await import('../firebase.js');
    
    const userCodes = await getUserLootboxCodes(interaction.user.id);
    
    if (userCodes.length === 0) {
      const emptyEmbed = createMilitaryEmbed(
        "📋 SEUS CÓDIGOS",
        `**${interaction.user.tag}, você ainda não possui códigos!**\n\n` +
        `Use \`/lootbox\` para comprar sua primeira lootbox e ganhar códigos! 🎁`,
        0x95A5A6
      );
      return interaction.editReply({ embeds: [emptyEmbed] });
    }

    // Agrupar por raridade
    const commonCodes = userCodes.filter(c => c.rarity === 'Comum');
    const rareCodes = userCodes.filter(c => c.rarity === 'Raro');
    const epicCodes = userCodes.filter(c => c.rarity === 'Épico');
    const legendaryCodes = userCodes.filter(c => c.rarity === 'Lendário');

    const codesEmbed = createMilitaryEmbed(
      "📋 SEUS CÓDIGOS DE LOOTBOX",
      `**${interaction.user.tag}, aqui estão todos os seus códigos:**\n\n` +
      `📊 **Total de códigos:** ${userCodes.length}\n` +
      `🔄 **Códigos únicos:** ${[...new Set(userCodes.map(c => c.code))].length}/7\n` + // ✅ ATUALIZADO
      `📦 **Duplicatas:** ${userCodes.filter(c => c.isDuplicate).length}`,
      0x3498DB
    );

    // Adicionar códigos por raridade
    if (commonCodes.length > 0) {
      codesEmbed.addFields({
        name: `🟢 COMUM (${commonCodes.length})`,
        value: commonCodes.map(c => 
          `\`${c.code}\` - ${c.item} ${c.isDuplicate ? '🔁' : ''}`
        ).join('\n'),
        inline: true
      });
    }

    if (rareCodes.length > 0) {
      codesEmbed.addFields({
        name: `🔵 RARO (${rareCodes.length})`,
        value: rareCodes.map(c => 
          `\`${c.code}\` - ${c.item} ${c.isDuplicate ? '🔁' : ''}`
        ).join('\n'),
        inline: true
      });
    }

    if (epicCodes.length > 0) {
      codesEmbed.addFields({
        name: `🟣 ÉPICO (${epicCodes.length})`,
        value: epicCodes.map(c => 
          `\`${c.code}\` - ${c.item} ${c.isDuplicate ? '🔁' : ''}`
        ).join('\n'),
        inline: false
      });
    }

    if (legendaryCodes.length > 0) {
      codesEmbed.addFields({
        name: `🟠 LENDÁRIO (${legendaryCodes.length})`,
        value: legendaryCodes.map(c => 
          `\`${c.code}\` - ${c.item} ${c.isDuplicate ? '🔁' : ''}`
        ).join('\n'),
        inline: false
      });
    }

    codesEmbed.setFooter({ 
      text: `Use os códigos no jogo para resgatar seus itens! • ${new Date().toLocaleDateString('pt-BR')}` 
    });

    await interaction.editReply({ embeds: [codesEmbed] });

  } catch (error) {
    console.error("Erro no comando meus-codigos:", error);
    const errorEmbed = createMilitaryEmbed(
      "❌ ERRO",
      "**Ocorreu um erro ao buscar seus códigos.**\n\nTente novamente.",
      0xE74C3C
    );
    await interaction.editReply({ embeds: [errorEmbed] });
  }
}

// ============================================================
// 📊 COMANDO: /estatisticas-lootbox - VER ESTATÍSTICAS
// ============================================================

// No comando /estatisticas-lootbox, atualize o total de códigos:
async function handleEstatisticasLootbox(interaction, client) {
  await interaction.deferReply({ ephemeral: true });

  try {
    const { getLootboxStats } = await import('../firebase.js');
    
    const stats = await getLootboxStats(interaction.user.id);
    
    if (!stats || stats.totalOpened === 0) {
      const emptyEmbed = createMilitaryEmbed(
        "📊 ESTATÍSTICAS DE LOOTBOX",
        `**${interaction.user.tag}, você ainda não abriu nenhuma lootbox!**\n\n` +
        `Use \`/lootbox\` para comprar sua primeira lootbox e começar sua coleção! 🎁`,
        0x95A5A6
      );
      return interaction.editReply({ embeds: [emptyEmbed] });
    }

    const statsEmbed = createMilitaryEmbed(
      "📊 ESTATÍSTICAS DE LOOTBOX",
      `**${interaction.user.tag}, aqui estão suas estatísticas:**\n\n` +
      `📦 **Lootboxes abertas:** ${stats.totalOpened}\n` +
      `💰 **Bellos gastos:** ${stats.totalOpened * 30}\n` +
      `🎯 **Códigos obtidos:** ${stats.totalCodes}\n` +
      `⭐ **Códigos únicos:** ${stats.uniqueCodes}/7\n` + // ✅ ATUALIZADO: 7 códigos no total
      `🔁 **Duplicatas:** ${stats.duplicates}\n` +
      `📈 **Taxa de duplicata:** ${((stats.duplicates / stats.totalCodes) * 100).toFixed(1)}%`,
      0x9B59B6
    );

    // Adicionar estatísticas de raridade
    statsEmbed.addFields(
      {
        name: "🎲 DISTRIBUIÇÃO POR RARIDADE",
        value: `🟢 **Comum:** ${stats.rarityCount.Comum} (${((stats.rarityCount.Comum / stats.totalCodes) * 100).toFixed(1)}%)\n` +
               `🔵 **Raro:** ${stats.rarityCount.Raro} (${((stats.rarityCount.Raro / stats.totalCodes) * 100).toFixed(1)}%)\n` +
               `🟣 **Épico:** ${stats.rarityCount.Épico} (${((stats.rarityCount.Épico / stats.totalCodes) * 100).toFixed(1)}%)\n` +
               `🟠 **Lendário:** ${stats.rarityCount.Lendário} (${((stats.rarityCount.Lendário / stats.totalCodes) * 100).toFixed(1)}%)`,
        inline: false
      }
    );

    // Calcular progresso da coleção (ATUALIZADO para 7 códigos)
    const collectionPercent = (stats.uniqueCodes / 7) * 100;
    const progressBar = createProgressBar(collectionPercent);
    
    statsEmbed.addFields({
      name: "🏆 PROGRESSO DA COLEÇÃO",
      value: `${progressBar} **${collectionPercent.toFixed(1)}%**\n` +
             `**${stats.uniqueCodes}/7 códigos únicos**\n` +
             `${getCollectionMessage(collectionPercent)}`,
      inline: false
    });

    statsEmbed.setFooter({ 
      text: `Continue abrindo lootboxes para completar sua coleção! • ${new Date().toLocaleDateString('pt-BR')}` 
    });

    await interaction.editReply({ embeds: [statsEmbed] });

  } catch (error) {
    console.error("Erro no comando estatisticas-lootbox:", error);
    const errorEmbed = createMilitaryEmbed(
      "❌ ERRO",
      "**Ocorreu um erro ao buscar suas estatísticas.**\n\nTente novamente.",
      0xE74C3C
    );
    await interaction.editReply({ embeds: [errorEmbed] });
  }
}

// ============================================================
// 🎯 HANDLER DO BOTÃO DE CONFIRMAÇÃO DA LOOTBOX
// ============================================================

async function handleConfirmLootbox(interaction, client) {
  await interaction.deferReply({ ephemeral: true });

  try {
    const { openLootbox } = await import('../firebase.js');
    
    const result = await openLootbox(interaction.user.id);
    
    if (result.success) {
      const rarityColors = {
        'Comum': 0x2ECC71,    // Verde
        'Raro': 0x3498DB,     // Azul
        'Épico': 0x9B59B6,    // Roxo
        'Lendário': 0xF39C12  // Laranja
      };

      const rarityEmojis = {
        'Comum': '🟢',
        'Raro': '🔵', 
        'Épico': '🟣',
        'Lendário': '🟠'
      };

      const resultEmbed = createMilitaryEmbed(
        `${rarityEmojis[result.item.rarity]} LOOTBOX ABERTA!`,
        `**${interaction.user.tag}, você abriu uma lootbox!**\n\n` +
        `🎁 **Item obtido:** ${result.item.item}\n` +
        `📜 **Código:** \`${result.item.code}\`\n` +
        `⭐ **Raridade:** ${result.item.rarity}\n` +
        `${result.isDuplicate ? '🔁 **AVISO:** Código duplicado!\n' : '✅ **NOVO:** Código adicionado à sua coleção!\n'}` +
        `💰 **Seus Bellos agora:** ${formatPrice(result.userCoins)}\n` +
        `📦 **Total de lootboxes:** ${result.totalLootboxes}`,
        rarityColors[result.item.rarity]
      );

      // Adicionar mensagem especial para lendários
      if (result.item.rarity === 'Lendário') {
        resultEmbed.addFields({
          name: "🎉 PARABÉNS!",
          value: "**Você encontrou um item LENDÁRIO!** 🎊\nChance de apenas 5%!",
          inline: false
        });
      }

      resultEmbed.setFooter({ 
        text: `Use /meus-codigos para ver todos os seus códigos • ${new Date().toLocaleString('pt-BR')}` 
      });

      await interaction.editReply({ 
        embeds: [resultEmbed],
        components: []
      });

    } else {
      const errorEmbed = createMilitaryEmbed(
        "❌ ERRO NA LOOTBOX",
        `**${result.message || 'Não foi possível abrir a lootbox.'}**\n\n` +
        `Verifique se você tem Bellos suficientes e tente novamente.`,
        0xE74C3C
      );
      await interaction.editReply({ 
        embeds: [errorEmbed],
        components: [] 
      });
    }

  } catch (error) {
    console.error("Erro ao confirmar lootbox:", error);
    const errorEmbed = createMilitaryEmbed(
      "❌ ERRO",
      "**Ocorreu um erro ao processar sua lootbox.**\n\nTente novamente.",
      0xE74C3C
    );
    await interaction.editReply({ 
      embeds: [errorEmbed],
      components: [] 
    });
  }
}

// ============================================================
// 🎯 FUNÇÕES AUXILIARES
// ============================================================

function createProgressBar(percentage, length = 10) {
  const filled = Math.round((percentage / 100) * length);
  const empty = length - filled;
  return '█'.repeat(filled) + '░'.repeat(empty);
}

function getCollectionMessage(percentage) {
  if (percentage === 100) return '🎊 **COLEÇÃO COMPLETA!** Parabéns!';
  if (percentage >= 75) return '🔥 **Quase lá!** Falta pouco para completar!';
  if (percentage >= 50) return '⭐ **Bom progresso!** Continue assim!';
  if (percentage >= 25) return '📈 **Bom começo!** Vá com calma.';
  return '🌱 **Começando...** Boa sorte na sua jornada!';
}

// ============================================================
// 🎁 COMANDO: /diario - RECOMPENSA DIÁRIA (100 BELLOS)
// ============================================================

async function handleDiario(interaction, client) {
  await interaction.deferReply({ ephemeral: false });

  try {
    const { claimDailyReward } = await import('../firebase.js');
    
    const result = await claimDailyReward(interaction.user.id);
    
    if (result.success) {
      const rewardEmbed = createMilitaryEmbed(
        "🎁 RECOMPENSA DIÁRIA RESGATADA!",
        `**${interaction.user.tag}, você resgatou sua recompensa diária!**\n\n` +
        `💰 **Recompensa base:** ${formatPrice(result.baseReward)} Bellos\n` +
        `🔥 **Bônus de streak:** ${formatPrice(result.streakBonus)} Bellos\n` +
        `🎯 **Total recebido:** ${formatPrice(result.reward)} Bellos\n\n` +
        `📊 **Seu streak atual:** ${result.streak} dia(s)\n` +
        `⏰ **Próximo resgate:** <t:${Math.floor(result.nextClaim.getTime() / 1000)}:R>\n\n` +
        `💡 **Dica:** Volte amanhã para manter seu streak e ganhar mais Bellos!`,
        0xF39C12
      );

      // Adicionar emojis visuais
      rewardEmbed.addFields(
        {
          name: "🔥 STREAK ATUAL",
          value: getStreakEmoji(result.streak) + ` **${result.streak} dia(s)**`,
          inline: true
        },
        {
          name: "💰 PRÓXIMO BÔNUS",
          value: `**+${Math.min((result.streak + 1) * 10, 50)} Bellos**`,
          inline: true
        },
        {
          name: "🎯 MÁXIMO STREAK",
          value: "**150 Bellos** em 5 dias", // ✅ CORRIGIDO: 100 base + 50 bônus
          inline: true
        }
      );

      rewardEmbed.setThumbnail(interaction.user.displayAvatarURL({ size: 256 }));
      
      await interaction.editReply({ embeds: [rewardEmbed] });

    } else {
      const cooldownEmbed = createMilitaryEmbed(
        "⏰ RECOMPENSA JÁ RESGATADA",
        `**${interaction.user.tag}, você já resgatou sua recompensa hoje!**\n\n` +
        `🕒 **Próximo resgate disponível:** <t:${Math.floor(result.nextClaim.getTime() / 1000)}:R>\n\n` +
        `💡 **Volte amanhã para continuar seu streak!**`,
        0x95A5A6
      );

      await interaction.editReply({ embeds: [cooldownEmbed] });
    }

  } catch (error) {
    console.error("Erro no comando diário:", error);
    const errorEmbed = createMilitaryEmbed(
      "❌ ERRO AO RESGATAR",
      "**Ocorreu um erro ao resgatar sua recompensa diária.**\n\nTente novamente em alguns instantes.",
      0xE74C3C
    );
    await interaction.editReply({ embeds: [errorEmbed] });
  }
}

// ============================================================
// 🔥 COMANDO: /streak - VER STREAK E RANKING (MAIS ROBUSTO)
// ============================================================

async function handleStreak(interaction, client) {
  await interaction.deferReply({ ephemeral: true });

  try {
    const { getDailyReward, getStreakRanking } = await import('../firebase.js');
    
    // Buscar dados do usuário
    const userReward = await getDailyReward(interaction.user.id);
    
    // Buscar ranking
    const ranking = await getStreakRanking(5); // ✅ Reduzido para 5 para evitar problemas
    
    // Criar embed do usuário
    const userEmbed = createMilitaryEmbed(
      "🔥 SEU STREAK DIÁRIO",
      `**${interaction.user.tag}, aqui está seu progresso:**\n\n` +
      `${getStreakEmoji(userReward.streak)} **Streak atual:** ${userReward.streak} dia(s)\n` +
      `📊 **Total de resgates:** ${userReward.totalClaims} vez(es)\n` +
      `💰 **Bellos ganhos no total:** ${formatPrice(userReward.totalCoinsEarned)}\n` +
      `${userReward.lastClaim ? `⏰ **Último resgate:** <t:${Math.floor(userReward.lastClaim.seconds)}:R>\n` : '⏰ **Último resgate:** Nunca\n'}` +
      `🎯 **Próximo bônus:** +${Math.min((userReward.streak + 1) * 10, 50)} Bellos`,
      0x3498DB
    );

    userEmbed.setThumbnail(interaction.user.displayAvatarURL({ size: 256 }));

    // Adicionar ranking se houver dados
    if (ranking.length > 0) {
      let rankingText = '';
      let position = 1;
      
      for (const userData of ranking) {
        if (position > 5) break; // Limitar a 5 posições
        
        const medal = getPositionMedal(position);
        
        try {
          const user = await client.users.fetch(userData.userId);
          rankingText += `${medal} **${user.username}** - ${userData.streak} dia(s)\n`;
        } catch {
          rankingText += `${medal} **Usuário ${userData.userId.slice(0, 8)}...** - ${userData.streak} dia(s)\n`;
        }
        position++;
      }
      
      if (rankingText) {
        userEmbed.addFields({
          name: "🏆 TOP STREAKS",
          value: rankingText,
          inline: false
        });
      }
    } else {
      userEmbed.addFields({
        name: "🏆 TOP STREAKS",
        value: "Nenhum streak ativo no momento\nSeja o primeiro! 🎯",
        inline: false
      });
    }

    // Informações do sistema
    userEmbed.addFields(
      {
        name: "💰 SISTEMA DE RECOMPENSAS",
        value: "• **Base:** 100 Bellos/dia\n• **Bônus:** +10 Bellos por streak\n• **Máximo:** 150 Bellos/dia",
        inline: true
      },
      {
        name: "🎯 COMO FUNCIONA",
        value: "• Resgate 1x por dia\n• Mantenha o streak\n• Ganhe bônus progressivos",
        inline: true
      }
    );

    await interaction.editReply({ embeds: [userEmbed] });

  } catch (error) {
    console.error("Erro no comando streak:", error);
    
    // Embed de erro mais específico
    const errorEmbed = createMilitaryEmbed(
      "❌ ERRO AO BUSCAR STREAK",
      `**Ocorreu um erro ao buscar suas informações:**\n\n` +
      `\`${error.message}\`\n\n` +
      `Tente novamente em alguns instantes.`,
      0xE74C3C
    );
    
    await interaction.editReply({ embeds: [errorEmbed] });
  }
}

// Comando checkin atualizado
async function handleCheckin(interaction, client) {
  await interaction.deferReply({ ephemeral: true });

  try {
    const { getDailyReward } = await import('../firebase.js');
    const userReward = await getDailyReward(interaction.user.id);
    
    const now = new Date();
    const canClaim = !userReward.lastClaim || 
      new Date(userReward.lastClaim.seconds * 1000).toDateString() !== now.toDateString();

    // ✅ CORREÇÃO: 100 Bellos em vez de 1000
    const nextReward = 100 + Math.min(userReward.streak * 10, 50);

    const statusEmbed = createMilitaryEmbed(
      canClaim ? "✅ RESGATE DISPONÍVEL" : "⏰ AGUARDANDO",
      canClaim ? 
        `**${interaction.user.tag}, sua recompensa diária está disponível!**\n\n` +
        `Use \`/diario\` para resgatar ${formatPrice(nextReward)} Bellos!` :
        `**${interaction.user.tag}, você já resgatou hoje!**\n\n` +
        `🕒 **Próximo resgate:** <t:${Math.floor(new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1).getTime() / 1000)}:R>`,
      canClaim ? 0x2ECC71 : 0xF39C12
    );

    await interaction.editReply({ embeds: [statusEmbed] });

  } catch (error) {
    console.error("Erro no checkin:", error);
    const errorEmbed = createMilitaryEmbed(
      "❌ ERRO",
      "**Ocorreu um erro ao verificar status.**\n\nTente novamente.",
      0xE74C3C
    );
    await interaction.editReply({ embeds: [errorEmbed] });
  }
}

// ============================================================
// 🎯 FUNÇÕES AUXILIARES
// ============================================================

function getStreakEmoji(streak) {
  if (streak >= 30) return "🏆";
  if (streak >= 15) return "🔥";
  if (streak >= 7) return "⚡";
  if (streak >= 3) return "⭐";
  return "🔸";
}

function getPositionMedal(position) {
  switch (position) {
    case 1: return "🥇";
    case 2: return "🥈";
    case 3: return "🥉";
    default: return `${position}º`;
  }
}

// ============================================================
// 🗑️ COMANDO: /removeitem (ADMIN) - CORRIGIDO
// ============================================================

async function handleRemoveItem(interaction, client) {
  if (!interaction.member.permissions.has(PermissionFlagsBits.Administrator)) {
    const deniedEmbed = createMilitaryEmbed(
      "❌ ACESSO NEGADO",
      "**Apenas administradores podem usar este comando!**",
      0xe74c3c
    );
    return interaction.reply({ embeds: [deniedEmbed], ephemeral: true });
  }

  const itemId = interaction.options.getString("item_id");
  const confirmacao = interaction.options.getString("confirmacao");

  await interaction.deferReply({ ephemeral: true });

  try {
    // Verificar confirmação
    if (confirmacao !== "CONFIRMAR") {
      const errorEmbed = createMilitaryEmbed(
        "❌ CONFIRMAÇÃO NECESSÁRIA",
        "**Você deve confirmar a remoção digitando 'CONFIRMAR'!**\n\n" +
        "Esta ação é irreversível e removerá permanentemente o item do catálogo.",
        0xe74c3c
      );
      return interaction.editReply({ embeds: [errorEmbed] });
    }

    // Importar funções do Firebase
    const { getItem, deleteCatalogItem } = await import('../firebase.js');
    
    // Buscar item para verificar se existe
    const item = await getItem(itemId);
    
    if (!item) {
      const errorEmbed = createMilitaryEmbed(
        "❌ ITEM NÃO ENCONTRADO",
        `**Não foi encontrado nenhum item com o ID \`${itemId}\`**\n\nVerifique o ID e tente novamente.`,
        0xe74c3c
      );
      return interaction.editReply({ embeds: [errorEmbed] });
    }

    // Deletar o item usando a função do Firebase
    await deleteCatalogItem(itemId);

    const successEmbed = createMilitaryEmbed(
      "✅ ITEM REMOVIDO!",
      `**Item removido do catálogo com sucesso!**\n\n` +
      `🗑️ **Item removido:** ${item.image} ${item.name}\n` +
      `📄 **Descrição:** ${item.description}\n` +
      `💰 **Preço Bellos:** ${formatPrice(item.coinPrice)}\n` +
      `💵 **Preço PIX:** R$ ${item.pixPrice.toFixed(2)}\n` +
      `📦 **Categoria:** ${getCategoryName(item.category)}\n` +
      `🆔 **ID do item:** ${itemId}\n\n` +
      `⚠️ **Esta ação é irreversível!** O item foi permanentemente removido.`,
      0xe74c3c
    );

    await interaction.editReply({ embeds: [successEmbed] });

    // Log da remoção
    try {
      const logChannel = interaction.guild.channels.cache.find(channel => 
        channel.name.toLowerCase().includes("logs") || 
        channel.name.toLowerCase().includes("📥") ||
        channel.name.toLowerCase().includes("catalogo")
      );
      
      if (logChannel) {
        const logEmbed = createMilitaryEmbed(
          "🗑️ ITEM REMOVIDO DO CATÁLOGO",
          `**Item removido por um administrador:**\n\n` +
          `🛍️ **Item:** ${item.image} ${item.name}\n` +
          `📄 **Descrição:** ${item.description}\n` +
          `💰 **Preço Bellos:** ${formatPrice(item.coinPrice)}\n` +
          `💵 **Preço PIX:** R$ ${item.pixPrice.toFixed(2)}\n` +
          `📦 **Categoria:** ${getCategoryName(item.category)}\n` +
          `🆔 **ID:** ${itemId}\n` +
          `⚡ **Removido por:** ${interaction.user.tag}\n` +
          `⏰ **Data:** <t:${Math.floor(Date.now() / 1000)}:F>`,
          0xe74c3c
        );
        await logChannel.send({ embeds: [logEmbed] });
      }
    } catch (logError) {
      console.log("Não foi possível enviar log:", logError.message);
    }

  } catch (error) {
    console.error("Erro ao remover item:", error);
    const errorEmbed = createMilitaryEmbed(
      "❌ ERRO AO REMOVER ITEM",
      "**Ocorreu um erro ao remover o item do catálogo.**\n\nVerifique o ID e tente novamente.",
      0xe74c3c
    );
    await interaction.editReply({ embeds: [errorEmbed] });
  }
}

// ============================================================
// ➕ COMANDO: /additem (ADMIN) - ATUALIZADO COM CUPONS
// ============================================================

async function handleAddItem(interaction, client) {
  if (!interaction.member.permissions.has(PermissionFlagsBits.Administrator)) {
    const deniedEmbed = createMilitaryEmbed(
      "❌ ACESSO NEGADO",
      "**Apenas administradores podem usar este comando!**",
      0xe74c3c
    );
    return interaction.reply({ embeds: [deniedEmbed], ephemeral: true });
  }

  const nome = interaction.options.getString("nome");
  const descricao = interaction.options.getString("descricao");
  const precoMoedas = interaction.options.getInteger("preco_moedas");
  const precoPix = interaction.options.getNumber("preco_pix");
  const categoria = interaction.options.getString("categoria");
  const emoji = interaction.options.getString("emoji") || "📦";
  const cupomNome = interaction.options.getString("cupom_nome");
  const cupomDescricao = interaction.options.getString("cupom_descricao");
  const cupomDesconto = interaction.options.getNumber("cupom_desconto");

  await interaction.deferReply({ ephemeral: true });

  try {
    const { addCatalogItem } = await import('../firebase.js');
    
    // Preparar dados do item
    const itemData = {
      name: nome,
      description: descricao,
      coinPrice: precoMoedas,
      pixPrice: precoPix,
      category: categoria,
      image: emoji,
      available: true,
      discountCoupons: []
    };

    // Adicionar cupom se fornecido
    if (cupomNome && cupomDescricao && cupomDesconto) {
      itemData.discountCoupons.push({
        code: cupomNome.toUpperCase(),
        description: cupomDescricao,
        discount: cupomDesconto,
        createdAt: new Date()
      });
    }

    const itemId = await addCatalogItem(itemData);

    // Construir mensagem de sucesso
    let successMessage = `**Novo item adicionado ao catálogo com sucesso!**\n\n` +
      `🛍️ **Nome:** ${emoji} ${nome}\n` +
      `📄 **Descrição:** ${descricao}\n` +
      `💰 **Preço Bellos:** ${formatPrice(precoMoedas)}\n` +
      `💵 **Preço PIX:** R$ ${precoPix.toFixed(2)}\n` +
      `📦 **Categoria:** ${getCategoryName(categoria)}\n` +
      `🆔 **ID do item:** ${itemId}\n`;

    // Adicionar informações do cupom se existir
    if (cupomNome && cupomDescricao && cupomDesconto) {
      successMessage += `\n🎫 **Cupom adicionado:**\n` +
        `• **Código:** ${cupomNome.toUpperCase()}\n` +
        `• **Descrição:** ${cupomDescricao}\n` +
        `• **Desconto:** ${(cupomDesconto * 100)}% off\n` +
        `• **Valor com desconto:** R$ ${(precoPix * (1 - cupomDesconto)).toFixed(2)}`;
    }

    successMessage += `\n\n✨ O item já está disponível no catálogo!`;

    const successEmbed = createMilitaryEmbed(
      "✅ ITEM ADICIONADO!",
      successMessage,
      0x2ecc71
    );

    await interaction.editReply({ embeds: [successEmbed] });

  } catch (error) {
    console.error("Erro ao adicionar item:", error);
    const errorEmbed = createMilitaryEmbed(
      "❌ ERRO AO ADICIONAR ITEM",
      "**Ocorreu um erro ao adicionar o item ao catálogo.**\n\nVerifique os dados e tente novamente.",
      0xe74c3c
    );
    await interaction.editReply({ embeds: [errorEmbed] });
  }
}

// ============================================================
// 🔍 COMANDO: /iditem (BUSCAR ITEM POR NOME)
// ============================================================

async function handleIdItem(interaction, client) {
  if (!interaction.member.permissions.has(PermissionFlagsBits.Administrator)) {
    const deniedEmbed = createMilitaryEmbed(
      "❌ ACESSO NEGADO",
      "**Apenas administradores podem usar este comando!**",
      0xe74c3c
    );
    return interaction.reply({ embeds: [deniedEmbed], ephemeral: true });
  }

  const nomeItem = interaction.options.getString("nome_item");

  await interaction.deferReply({ ephemeral: true });

  try {
    // Buscar todos os itens
    const items = await getCatalogItems();
    
    // Buscar item pelo nome (case insensitive e parcial)
    const item = items.find(item => 
      item.name.toLowerCase().includes(nomeItem.toLowerCase())
    );
    
    if (!item) {
      // Se não encontrar exatamente, tentar busca mais ampla
      const similarItems = items.filter(item => 
        item.name.toLowerCase().includes(nomeItem.toLowerCase()) ||
        item.description.toLowerCase().includes(nomeItem.toLowerCase())
      );
      
      if (similarItems.length === 0) {
        const errorEmbed = createMilitaryEmbed(
          "❌ ITEM NÃO ENCONTRADO",
          `**Não foi encontrado nenhum item com o nome \`${nomeItem}\`**\n\n` +
          `💡 **Dicas:**\n` +
          `• Verifique a ortografia do nome\n` +
          `• Use o autocomplete para ajudar na busca\n` +
          `• Use \`/catalogo\` para ver todos os itens disponíveis`,
          0xe74c3c
        );
        return interaction.editReply({ embeds: [errorEmbed] });
      } else if (similarItems.length === 1) {
        // Se encontrou apenas um item similar, usar esse
        const foundItem = similarItems[0];
        await sendItemInfo(interaction, foundItem);
      } else {
        // Se encontrou múltiplos itens, mostrar lista
        const itemsList = similarItems.map(item => 
          `• ${item.image} **${item.name}** (ID: \`${item.id}\`)`
        ).join('\n');
        
        const multipleEmbed = createMilitaryEmbed(
          "🔍 MÚLTIPLOS ITENS ENCONTRADOS",
          `**Encontrei ${similarItems.length} itens com o nome \`${nomeItem}\`:**\n\n${itemsList}\n\n` +
          `💡 **Use um nome mais específico ou selecione do autocomplete.**`,
          0xf39c12
        );
        return interaction.editReply({ embeds: [multipleEmbed] });
      }
    } else {
      // Item encontrado exatamente
      await sendItemInfo(interaction, item);
    }

  } catch (error) {
    console.error("Erro no comando /iditem:", error);
    const errorEmbed = createMilitaryEmbed(
      "❌ ERRO AO BUSCAR ITEM",
      "**Ocorreu um erro ao buscar informações do item.**\n\nTente novamente.",
      0xe74c3c
    );
    await interaction.editReply({ embeds: [errorEmbed] });
  }
}

// Função auxiliar para enviar informações do item
async function sendItemInfo(interaction, item) {
  // Formatar informações do item com DESTAQUE para o ID
  const itemInfo = `**🔍 Informações detalhadas do item:**\n\n` +
    `🎯 **ITEM ENCONTRADO:** ${item.image} **${item.name}**\n\n` +
    `🆔 **ID DO ITEM (PRINCIPAL):** \`\`\`${item.id}\`\`\`\n` +
    `📄 **Descrição:** ${item.description}\n` +
    `💰 **Preço em Bellos:** ${formatPrice(item.coinPrice)}\n` +
    `💵 **Preço em PIX:** R$ ${item.pixPrice.toFixed(2)}\n` +
    `📦 **Categoria:** ${getCategoryName(item.category)}\n` +
    `🔄 **Disponível:** ${item.available ? '✅ Sim' : '❌ Não'}\n` +
    `📅 **Criado em:** <t:${Math.floor(new Date(item.createdAt).getTime() / 1000)}:F>\n` +
    `✏️ **Atualizado em:** ${item.updatedAt ? `<t:${Math.floor(new Date(item.updatedAt).getTime() / 1000)}:F>` : 'Nunca'}`;

  // Adicionar informações de cupons
  let cuponsInfo = "";
  if (item.discountCoupons && item.discountCoupons.length > 0) {
    cuponsInfo = `\n\n🎫 **Cupons de desconto:**\n` +
      item.discountCoupons.map(cupom => 
        `• **${cupom.code}** - ${cupom.description} (${(cupom.discount * 100)}% off) → R$ ${(item.pixPrice * (1 - cupom.discount)).toFixed(2)}`
      ).join('\n');
  } else {
    cuponsInfo = `\n\n🎫 **Cupons de desconto:** Nenhum cupom cadastrado`;
  }

  const infoEmbed = createMilitaryEmbed(
    "✅ ITEM ENCONTRADO!",
    itemInfo + cuponsInfo,
    0x2ecc71
  );

  // Adicionar campo destacado com o ID
  infoEmbed.addFields({
    name: "📋 ID PARA USAR EM COMANDOS:",
    value: `\`\`\`${item.id}\`\`\``,
    inline: false
  });

  await interaction.editReply({ 
    embeds: [infoEmbed],
  });
}

// catalog.js - Adicione estas funções

// ============================================================
// 🗑️ HANDLER DO BOTÃO REMOVER ITEM
// ============================================================

async function handleRemoveItemButton(interaction, itemId, client) {
  await interaction.deferReply({ ephemeral: true });

  try {
    const { getItem, deleteCatalogItem } = await import('../firebase.js');
    
    // Buscar item para verificar se existe
    const item = await getItem(itemId);
    
    if (!item) {
      const errorEmbed = createMilitaryEmbed(
        "❌ ITEM NÃO ENCONTRADO",
        `**Não foi encontrado nenhum item com o ID \`${itemId}\`**\n\nO item pode ter sido removido por outro administrador.`,
        0xe74c3c
      );
      return interaction.editReply({ embeds: [errorEmbed] });
    }

    // Criar embed de confirmação
    const confirmEmbed = createMilitaryEmbed(
      "🗑️ CONFIRMAR REMOÇÃO",
      `**Tem certeza que deseja remover este item?**\n\n` +
      `🛍️ **Item:** ${item.image} ${item.name}\n` +
      `📄 **Descrição:** ${item.description}\n` +
      `💰 **Preço Bellos:** ${formatPrice(item.coinPrice)}\n` +
      `💵 **Preço PIX:** R$ ${item.pixPrice.toFixed(2)}\n` +
      `🆔 **ID:** ${itemId}\n\n` +
      `⚠️ **ESTA AÇÃO É IRREVERSÍVEL!**\n` +
      `O item será permanentemente removido do catálogo.`,
      0xe74c3c
    );

    // Botões de confirmação
    const confirmRow = new ActionRowBuilder()
      .addComponents(
        new ButtonBuilder()
          .setLabel('✅ CONFIRMAR REMOÇÃO')
          .setStyle(ButtonStyle.Danger)
          .setCustomId(`confirm_remove_${itemId}`),
        new ButtonBuilder()
          .setLabel('❌ CANCELAR')
          .setStyle(ButtonStyle.Secondary)
          .setCustomId('cancel_remove')
      );

    await interaction.editReply({ 
      embeds: [confirmEmbed],
      components: [confirmRow]
    });

  } catch (error) {
    console.error("Erro no botão remover item:", error);
    const errorEmbed = createMilitaryEmbed(
      "❌ ERRO",
      "**Ocorreu um erro ao processar a remoção.**\n\nTente novamente.",
      0xe74c3c
    );
    await interaction.editReply({ embeds: [errorEmbed] });
  }
}

// ============================================================
// ✏️ HANDLER DO BOTÃO EDITAR ITEM
// ============================================================

async function handleEditItemButton(interaction, itemId, client) {
  await interaction.deferReply({ ephemeral: true });

  try {
    const { getItem } = await import('../firebase.js');
    
    // Buscar item
    const item = await getItem(itemId);
    
    if (!item) {
      const errorEmbed = createMilitaryEmbed(
        "❌ ITEM NÃO ENCONTRADO",
        `**Não foi encontrado nenhum item com o ID \`${itemId}\`**\n\nO item pode ter sido removido por outro administrador.`,
        0xe74c3c
      );
      return interaction.editReply({ embeds: [errorEmbed] });
    }

    // Criar modal para edição
    const modal = new ModalBuilder()
      .setCustomId(`edit_item_modal_${itemId}`)
      .setTitle(`✏️ Editar: ${item.name}`);

    // Campo para nome
    const nameInput = new TextInputBuilder()
      .setCustomId('item_name')
      .setLabel("📝 Nome do item")
      .setStyle(TextInputStyle.Short)
      .setRequired(true)
      .setValue(item.name)
      .setMaxLength(100);

    // Campo para descrição
    const descInput = new TextInputBuilder()
      .setCustomId('item_description')
      .setLabel("📄 Descrição do item")
      .setStyle(TextInputStyle.Paragraph)
      .setRequired(true)
      .setValue(item.description)
      .setMaxLength(500);

    // Campo para preço em Bellos
    const coinsInput = new TextInputBuilder()
      .setCustomId('item_coin_price')
      .setLabel("💰 Preço em Bellos")
      .setStyle(TextInputStyle.Short)
      .setRequired(true)
      .setValue(item.coinPrice.toString())
      .setMaxLength(10);

    // Campo para preço em PIX
    const pixInput = new TextInputBuilder()
      .setCustomId('item_pix_price')
      .setLabel("💵 Preço em PIX")
      .setStyle(TextInputStyle.Short)
      .setRequired(true)
      .setValue(item.pixPrice.toString())
      .setMaxLength(10);

    const firstRow = new ActionRowBuilder().addComponents(nameInput);
    const secondRow = new ActionRowBuilder().addComponents(descInput);
    const thirdRow = new ActionRowBuilder().addComponents(coinsInput);
    const fourthRow = new ActionRowBuilder().addComponents(pixInput);

    modal.addComponents(firstRow, secondRow, thirdRow, fourthRow);

    await interaction.showModal(modal);

  } catch (error) {
    console.error("Erro no botão editar item:", error);
    const errorEmbed = createMilitaryEmbed(
      "❌ ERRO",
      "**Ocorreu um erro ao abrir o editor.**\n\nTente novamente.",
      0xe74c3c
    );
    await interaction.editReply({ embeds: [errorEmbed] });
  }
}

// catalog.js - Adicione esta função

// ============================================================
// ✅ HANDLER DE CONFIRMAÇÃO DE REMOÇÃO
// ============================================================

async function handleConfirmRemoveItem(interaction, itemId, client) {
  await interaction.deferReply({ ephemeral: true });

  try {
    const { getItem, deleteCatalogItem } = await import('../firebase.js');
    
    // Buscar item para verificar se ainda existe
    const item = await getItem(itemId);
    
    if (!item) {
      const errorEmbed = createMilitaryEmbed(
        "❌ ITEM NÃO ENCONTRADO",
        `**O item com ID \`${itemId}\` já foi removido.**\n\nProvavelmente por outro administrador.`,
        0xe74c3c
      );
      return interaction.editReply({ embeds: [errorEmbed] });
    }

    // Deletar o item
    await deleteCatalogItem(itemId);

    const successEmbed = createMilitaryEmbed(
      "✅ ITEM REMOVIDO!",
      `**Item removido do catálogo com sucesso!**\n\n` +
      `🗑️ **Item removido:** ${item.image} ${item.name}\n` +
      `📄 **Descrição:** ${item.description}\n` +
      `💰 **Preço Bellos:** ${formatPrice(item.coinPrice)}\n` +
      `💵 **Preço PIX:** R$ ${item.pixPrice.toFixed(2)}\n` +
      `🆔 **ID do item:** ${itemId}\n\n` +
      `⚠️ **Item removido permanentemente do catálogo.**`,
      0xe74c3c
    );

    await interaction.editReply({ 
      embeds: [successEmbed],
      components: []
    });

  } catch (error) {
    console.error("Erro ao confirmar remoção:", error);
    const errorEmbed = createMilitaryEmbed(
      "❌ ERRO AO REMOVER ITEM",
      "**Ocorreu um erro ao remover o item.**\n\nTente usar o comando `/removeitem` manualmente.",
      0xe74c3c
    );
    await interaction.editReply({ embeds: [errorEmbed] });
  }
}

// ============================================================
// ✏️ COMANDO: /edititem (ADMIN) - CORRIGIDO
// ============================================================

async function handleEditItem(interaction, client) {
  if (!interaction.member.permissions.has(PermissionFlagsBits.Administrator)) {
    const deniedEmbed = createMilitaryEmbed(
      "❌ ACESSO NEGADO",
      "**Apenas administradores podem usar este comando!**",
      0xe74c3c
    );
    return interaction.reply({ embeds: [deniedEmbed], ephemeral: true });
  }

  const itemId = interaction.options.getString("item_id");
  const campo = interaction.options.getString("campo");
  const valor = interaction.options.getString("valor");

  await interaction.deferReply({ ephemeral: true });

  try {
    const { getItem, updateCatalogItem } = await import('../firebase.js');
    
    const item = await getItem(itemId);
    
    if (!item) {
      const errorEmbed = createMilitaryEmbed(
        "❌ ITEM NÃO ENCONTRADO",
        `**Não foi encontrado nenhum item com o ID \`${itemId}\`**\n\nVerifique o ID e tente novamente.`,
        0xe74c3c
      );
      return interaction.editReply({ embeds: [errorEmbed] });
    }

    let updateData = {};
    let formattedValue = valor;

    // Converter valores conforme o campo
    switch (campo) {
      case 'coinPrice':
        updateData.coinPrice = parseInt(valor);
        formattedValue = formatPrice(parseInt(valor));
        break;
      case 'pixPrice':
        updateData.pixPrice = parseFloat(valor);
        formattedValue = `R$ ${parseFloat(valor).toFixed(2)}`;
        break;
      case 'available':
        updateData.available = valor.toLowerCase() === 'true';
        formattedValue = updateData.available ? '🟢 Disponível' : '🔴 Indisponível';
        break;
      default:
        updateData[campo] = valor;
    }

    // Usar a função do Firebase para atualizar
    await updateCatalogItem(itemId, updateData);

    const successEmbed = createMilitaryEmbed(
      "✅ ITEM ATUALIZADO!",
      `**Item atualizado com sucesso!**\n\n` +
      `🛍️ **Item:** ${item.image} ${item.name}\n` +
      `📝 **Campo alterado:** ${getFieldName(campo)}\n` +
      `🎯 **Novo valor:** ${formattedValue}\n` +
      `🆔 **ID:** ${itemId}\n\n` +
      `✨ As alterações já estão visíveis no catálogo!`,
      0xf39c12
    );

    await interaction.editReply({ embeds: [successEmbed] });

  } catch (error) {
    console.error("Erro ao editar item:", error);
    const errorEmbed = createMilitaryEmbed(
      "❌ ERRO AO EDITAR ITEM",
      "**Ocorreu um erro ao editar o item.**\n\nVerifique os dados e tente novamente.",
      0xe74c3c
    );
    await interaction.editReply({ embeds: [errorEmbed] });
  }
}

// Função auxiliar para nome dos campos
function getFieldName(field) {
  const fields = {
    'name': 'Nome',
    'description': 'Descrição',
    'coinPrice': 'Preço em Bellos',
    'pixPrice': 'Preço em PIX',
    'available': 'Disponibilidade'
  };
  return fields[field] || field;
}

// ============================================================
// 🛍️ COMANDO: /catalogo - AGORA EPHEMERAL
// ============================================================

async function handleCatalogo(interaction, client) {
  // VERIFICAR se já foi feito deferUpdate ou deferReply
  if (!interaction.deferred && !interaction.replied) {
    await interaction.deferReply({ ephemeral: true }); // ← MUDADO para true
  }
  // Se já foi deferUpdate, não precisamos fazer nada

  try {
    // Buscar itens do catálogo
    const items = await getCatalogItems();
    
    if (items.length === 0) {
      const emptyEmbed = createMilitaryEmbed(
        "🛍️ CATÁLOGO DO BELLINHO",
        "**❌ O catálogo está vazio no momento!**\n\n" +
        "Os administradores ainda não adicionaram itens para venda.\n" +
        "Volte mais tarde! 🕒",
        0x95a5a6
      );
      
      if (interaction.deferred && !interaction.replied) {
        return interaction.editReply({ embeds: [emptyEmbed] });
      } else {
        return interaction.reply({ embeds: [emptyEmbed], ephemeral: true }); // ← MUDADO
      }
    }

    // Buscar dados do usuário
    const userData = await getUser(interaction.user.id);

    // Criar embed principal do catálogo
    const catalogEmbed = createMilitaryEmbed(
      "🛍️ CATÁLOGO DO BELLINHO",
      `**💎 *Não conta pra ninguém...* 💎**\n\n` +
      `**Aqui estão alguns itens pra comprar sem precisar gastar 1 único robux!**\n\n` +
      `💰 **Seus Bellos:** ${userData.coins.toLocaleString('pt-BR')}\n` +
      `🎯 **Itens disponíveis:** ${items.length}\n\n` +
      `*💡 Selecione um item abaixo para ver detalhes e comprar!*`,
      0x9b59b6
    );

    // Criar menu de seleção
    const selectOptions = items.map(item => {
      const label = item.name.length > 25 ? item.name.substring(0, 22) + '...' : item.name;
      const description = `${formatPrice(item.coinPrice)} Bellos • R$ ${item.pixPrice.toFixed(2)} PIX`;
      const finalDescription = description.length > 50 ? 
        description.substring(0, 47) + '...' : description;

      return {
        label: label,
        description: finalDescription,
        value: item.id,
        emoji: item.image
      };
    });

    const selectMenu = new StringSelectMenuBuilder()
      .setCustomId('select_item')
      .setPlaceholder('🎯 Selecione um item para comprar...')
      .addOptions(selectOptions);

    const actionRow = new ActionRowBuilder()
      .addComponents(selectMenu);

    // Botões de ação
    const buttonRow = new ActionRowBuilder()
      .addComponents(
        new ButtonBuilder()
          .setLabel('💰 Ver Meus Bellos')
          .setStyle(ButtonStyle.Secondary)
          .setCustomId('catalog_check_coins'),
        new ButtonBuilder()
          .setLabel('🔄 Atualizar')
          .setStyle(ButtonStyle.Primary)
          .setCustomId('catalog_refresh')
      );

    // DIFERENCIAR ENTRE deferReply E reply normal
    if (interaction.deferred && !interaction.replied) {
      // Caso 1: Já foi feito deferReply ou deferUpdate, usar editReply
      await interaction.editReply({ 
        embeds: [catalogEmbed],
        components: [actionRow, buttonRow]
      });
    } else {
      // Caso 2: Nada foi feito ainda, usar reply
      await interaction.reply({ 
        embeds: [catalogEmbed],
        components: [actionRow, buttonRow],
        ephemeral: true // ← MUDADO para true
      });
    }

  } catch (error) {
    console.error("Erro no comando /catalogo:", error);
    const errorEmbed = createMilitaryEmbed(
      "❌ ERRO NO CATÁLOGO",
      "**Ocorreu um erro ao abrir o catálogo.**\n\nTente novamente em alguns instantes.",
      0xe74c3c
    );
    
    if (interaction.deferred && !interaction.replied) {
      await interaction.editReply({ embeds: [errorEmbed] });
    } else if (interaction.replied) {
      await interaction.followUp({ embeds: [errorEmbed], ephemeral: true });
    } else {
      await interaction.reply({ embeds: [errorEmbed], ephemeral: true }); // ← MUDADO
    }
  }
}

// ============================================================
// 🎯 HANDLER DA SELEÇÃO DE ITENS
// ============================================================

async function handleItemSelect(interaction, client) {
  try {
    // VERIFICAR se precisa fazer deferReply
    if (!interaction.deferred && !interaction.replied) {
      await interaction.deferReply({ ephemeral: true });
    }

    const itemId = interaction.values[0];
    const item = await getItem(itemId);
    
    if (!item) {
      const errorEmbed = createMilitaryEmbed(
        "❌ ITEM NÃO ENCONTRADO",
        "**Este item não está mais disponível no catálogo.**\n\nTente selecionar outro item.",
        0xe74c3c
      );
      
      if (interaction.deferred && !interaction.replied) {
        return interaction.editReply({ embeds: [errorEmbed] });
      } else {
        return interaction.reply({ embeds: [errorEmbed], ephemeral: true });
      }
    }

    // Buscar dados do usuário
    const userData = await getUser(interaction.user.id);

    // Criar embed de detalhes do item
    const itemEmbed = createMilitaryEmbed(
      `🛍️ ${item.image} ${item.name}`,
      `**${item.description}**\n\n` +
      `📦 **Categoria:** ${getCategoryName(item.category)}\n` +
      `🪙 **Preço em Bellos:** ${formatPrice(item.coinPrice)}\n` +
      `💵 **Preço em PIX:** R$ ${item.pixPrice.toFixed(2)}\n\n` +
      `💰 **Seus Bellos:** ${userData.coins.toLocaleString('pt-BR')}\n` +
      `${userData.coins >= item.coinPrice ? '✅ **Você pode comprar com Bellos!**' : '❌ **Bellos insuficientes**'}\n\n` +
      `🎫 **Cupons disponíveis:**\n${formatDiscountCoupons(item.discountCoupons)}`,
      0x3498db
    );

    // Botões de compra
    const purchaseRow = new ActionRowBuilder()
      .addComponents(
        new ButtonBuilder()
          .setLabel(`🪙 Comprar com Bellos (${formatPrice(item.coinPrice)})`)
          .setStyle(ButtonStyle.Success)
          .setCustomId(`buy_coins_${itemId}`)
          .setDisabled(userData.coins < item.coinPrice),
        new ButtonBuilder()
          .setLabel(`💵 Comprar com PIX (R$ ${item.pixPrice.toFixed(2)})`)
          .setStyle(ButtonStyle.Primary)
          .setCustomId(`buy_pix_${itemId}`),
        new ButtonBuilder()
          .setLabel('🔙 Voltar ao Catálogo')
          .setStyle(ButtonStyle.Secondary)
          .setCustomId('catalog_back')
      );

    // DIFERENCIAR ENTRE deferReply E reply normal
    if (interaction.deferred && !interaction.replied) {
      await interaction.editReply({ 
        embeds: [itemEmbed],
        components: [purchaseRow]
      });
    } else {
      await interaction.reply({ 
        embeds: [itemEmbed],
        components: [purchaseRow],
        ephemeral: true
      });
    }

  } catch (error) {
    console.error("Erro ao selecionar item:", error);
    const errorEmbed = createMilitaryEmbed(
      "❌ ERRO",
      "**Ocorreu um erro ao carregar o item.**\n\nTente novamente.",
      0xe74c3c
    );
    
    if (interaction.deferred && !interaction.replied) {
      await interaction.editReply({ embeds: [errorEmbed] });
    } else if (interaction.replied) {
      await interaction.followUp({ embeds: [errorEmbed], ephemeral: true });
    } else {
      await interaction.reply({ embeds: [errorEmbed], ephemeral: true });
    }
  }
}

async function handleCoinPurchase(interaction, client) {
  try {
    const itemId = interaction.customId.replace('buy_coins_', '');
    const item = await getItem(itemId);
    const userData = await getUser(interaction.user.id);

    if (!item) {
      // Se não for modal, fazer deferReply primeiro
      if (!interaction.deferred && !interaction.replied) {
        await interaction.deferReply({ ephemeral: true });
      }
      
      const errorEmbed = createMilitaryEmbed(
        "❌ ITEM INDISPONÍVEL",
        "**Este item não está mais disponível para compra.**",
        0xe74c3c
      );
      
      if (interaction.deferred && !interaction.replied) {
        return interaction.editReply({ embeds: [errorEmbed] });
      } else {
        return interaction.reply({ embeds: [errorEmbed], ephemeral: true });
      }
    }

    if (userData.coins < item.coinPrice) {
      // Se não for modal, fazer deferReply primeiro
      if (!interaction.deferred && !interaction.replied) {
        await interaction.deferReply({ ephemeral: true });
      }
      
      const errorEmbed = createMilitaryEmbed(
        "❌ BELLOS INSUFICIENTES",
        `**Você não tem Bellos suficientes para esta compra!**\n\n` +
        `💰 **Necessário:** ${formatPrice(item.coinPrice)} Bellos\n` +
        `💸 **Você tem:** ${userData.coins.toLocaleString('pt-BR')} Bellos\n` +
        `📉 **Faltam:** ${(item.coinPrice - userData.coins).toLocaleString('pt-BR')} Bellos\n\n` +
        `💡 **Dica:** Convide amigos ou seja ativo no servidor para ganhar mais Bellos!`,
        0xe74c3c
      );
      
      if (interaction.deferred && !interaction.replied) {
        return interaction.editReply({ embeds: [errorEmbed] });
      } else {
        return interaction.reply({ embeds: [errorEmbed], ephemeral: true });
      }
    }

    // Criar modal para informações do Roblox
    const modal = new ModalBuilder()
      .setCustomId(`purchase_modal_${itemId}_coins`)
      .setTitle(`🛍️ Comprar: ${item.name}`);

    const robloxInput = new TextInputBuilder()
      .setCustomId('roblox_username')
      .setLabel("📝 Seu username COMPLETO do Roblox")
      .setStyle(TextInputStyle.Short)
      .setRequired(true)
      .setMaxLength(50)
      .setPlaceholder("Exemplo: Player123456789");

    const firstActionRow = new ActionRowBuilder().addComponents(robloxInput);
    modal.addComponents(firstActionRow);

    // MOSTRAR MODAL - não pode ter deferReply antes disso
    await interaction.showModal(modal);

  } catch (error) {
    console.error("Erro na compra com Bellos:", error);
    
    // Se ocorrer erro após tentar mostrar modal, responder normalmente
    if (!interaction.deferred && !interaction.replied) {
      await interaction.deferReply({ ephemeral: true });
    }
    
    const errorEmbed = createMilitaryEmbed(
      "❌ ERRO NA COMPRA",
      "**Ocorreu um erro ao processar sua compra.**\n\nTente novamente.",
      0xe74c3c
    );
    
    if (interaction.deferred && !interaction.replied) {
      await interaction.editReply({ embeds: [errorEmbed] });
    } else if (interaction.replied) {
      await interaction.followUp({ embeds: [errorEmbed], ephemeral: true });
    } else {
      await interaction.reply({ embeds: [errorEmbed], ephemeral: true });
    }
  }
}

async function handlePixPurchase(interaction, client) {
  // REMOVIDO: deferReply pois já foi feito no index.js
  // await interaction.deferReply({ ephemeral: true });

  try {
    const itemId = interaction.customId.replace('buy_pix_', '');
    const item = await getItem(itemId);

    if (!item) {
      const errorEmbed = createMilitaryEmbed(
        "❌ ITEM INDISPONÍVEL",
        "**Este item não está mais disponível para compra.**",
        0xe74c3c
      );
      return interaction.editReply({ embeds: [errorEmbed] });
    }

    // Criar modal para informações do PIX
    const modal = new ModalBuilder()
      .setCustomId(`purchase_modal_${itemId}_pix`)
      .setTitle(`💵 Comprar com PIX: ${item.name}`);

    const robloxInput = new TextInputBuilder()
      .setCustomId('roblox_username')
      .setLabel("📝 Seu username COMPLETO do Roblox")
      .setStyle(TextInputStyle.Short)
      .setRequired(true)
      .setMaxLength(50)
      .setPlaceholder("Exemplo: Player123456789");

    const couponInput = new TextInputBuilder()
      .setCustomId('discount_coupon')
      .setLabel("🎫 Cupom de desconto (opcional)")
      .setStyle(TextInputStyle.Short)
      .setRequired(false)
      .setMaxLength(20)
      .setPlaceholder("Insira Aqui o Código Promocional");

    const firstActionRow = new ActionRowBuilder().addComponents(robloxInput);
    const secondActionRow = new ActionRowBuilder().addComponents(couponInput);
    
    modal.addComponents(firstActionRow, secondActionRow);

    await interaction.showModal(modal);

  } catch (error) {
    console.error("Erro na compra com PIX:", error);
    const errorEmbed = createMilitaryEmbed(
      "❌ ERRO NA COMPRA",
      "**Ocorreu um erro ao processar sua compra.**\n\nTente novamente.",
      0xe74c3c
    );
    await interaction.editReply({ embeds: [errorEmbed] });
  }
}

// ============================================================
// 🎫 FUNÇÕES AUXILIARES
// ============================================================

function formatPrice(price) {
  if (typeof price === 'number') {
    return `${price.toLocaleString('pt-BR')},00`;
  }
  return '0,00';
}

function getCategoryName(category) {
  const categories = {
    'dinheiro': '💵 Dinheiro no Jogo',
    'vip': '⭐ VIP',
    'cargos': '🎖️ Cargos',
    'pacotes': '🎁 Pacotes',
    'passes': '💫 Gamepass'
  };
  return categories[category] || '📦 Outros';
}

function formatDiscountCoupons(coupons) {
  if (!coupons || coupons.length === 0) {
    return '• Nenhum cupom disponível';
  }
  
  return coupons.map(coupon => 
    `• **${coupon.code}** - ${coupon.description}`
  ).join('\n');
}

// ============================================================
// 📝 HANDLER DE MODAL DE COMPRA
// ============================================================

async function handlePurchaseModal(interaction, client) {
  try {
    // FAZER deferReply para modals
    if (!interaction.deferred && !interaction.replied) {
      await interaction.deferReply({ ephemeral: true });
    }

    const modalId = interaction.customId;
    console.log('Modal ID:', modalId); // Para debug
    
    // CORRIGIR: Extrair o itemId corretamente
    const parts = modalId.split('_');
    console.log('Parts:', parts); // Para debug
    
    // Encontrar a posição do itemId (entre "modal" e o paymentMethod)
    const modalIndex = parts.indexOf('modal');
    if (modalIndex === -1 || modalIndex + 1 >= parts.length) {
      throw new Error('Formato do modal ID inválido');
    }
    
    const itemId = parts[modalIndex + 1];
    const paymentMethod = parts[modalIndex + 2];
    
    console.log('Item ID:', itemId, 'Payment Method:', paymentMethod); // Para debug

    const item = await getItem(itemId);
    
    if (!item) {
      console.log('Item não encontrado com ID:', itemId); // Para debug
      const errorEmbed = createMilitaryEmbed(
        "❌ ITEM INDISPONÍVEL",
        "**Este item não está mais disponível para compra.**",
        0xe74c3c
      );
      return interaction.editReply({ embeds: [errorEmbed] });
    }

    // Obter valores dos campos de forma segura
    const robloxUsername = interaction.fields.getTextInputValue('roblox_username');
    
    let discountCoupon = '';
    // Verificar se o campo discount_coupon existe neste modal
    const hasDiscountField = interaction.fields.fields.some(field => field.customId === 'discount_coupon');
    if (hasDiscountField) {
      discountCoupon = interaction.fields.getTextInputValue('discount_coupon') || '';
    }

    console.log('Cupom digitado:', discountCoupon); // DEBUG
    console.log('Cupons disponíveis no item:', item.discountCoupons); // DEBUG

    // Aplicar desconto se cupom válido (apenas para PIX) - CORREÇÃO
    let finalPrice = paymentMethod === 'coins' ? item.coinPrice : item.pixPrice;
    let discountApplied = null;

    if (discountCoupon && item.discountCoupons && item.discountCoupons.length > 0 && paymentMethod === 'pix') {
      console.log('Procurando cupom válido...'); // DEBUG
      
      // CORREÇÃO: Buscar cupom de forma case-insensitive e trim espaços
      const validCoupon = item.discountCoupons.find(coupon => {
        const couponCode = coupon.code.trim().toUpperCase();
        const inputCode = discountCoupon.trim().toUpperCase();
        console.log(`Comparando: "${couponCode}" com "${inputCode}"`); // DEBUG
        return couponCode === inputCode;
      });
      
      if (validCoupon) {
        console.log('Cupom válido encontrado:', validCoupon); // DEBUG
        discountApplied = validCoupon;
        finalPrice = item.pixPrice * (1 - validCoupon.discount);
        console.log(`Preço original: R$ ${item.pixPrice}, Desconto: ${validCoupon.discount * 100}%, Preço final: R$ ${finalPrice}`); // DEBUG
      } else {
        console.log('Nenhum cupom válido encontrado'); // DEBUG
      }
    }

    if (paymentMethod === 'coins') {
      // Processar compra com Bellos
      await processCoinPurchase(interaction, item, robloxUsername, client);
    } else {
      // Processar compra com PIX
      await processPixPurchase(interaction, item, robloxUsername, finalPrice, discountApplied, client);
    }

  } catch (error) {
    console.error("Erro no modal de compra:", error);
    const errorEmbed = createMilitaryEmbed(
      "❌ ERRO NA COMPRA",
      "**Ocorreu um erro ao processar sua compra.**\n\nTente novamente.",
      0xe74c3c
    );
    
    if (interaction.deferred && !interaction.replied) {
      await interaction.editReply({ embeds: [errorEmbed] });
    } else if (interaction.replied) {
      await interaction.followUp({ embeds: [errorEmbed], ephemeral: true });
    } else {
      await interaction.reply({ embeds: [errorEmbed], ephemeral: true });
    }
  }
}

// ============================================================
// 🪙 PROCESSAR COMPRA COM BELLOS
// ============================================================

async function processCoinPurchase(interaction, item, robloxUsername, client) {
  try {
    const { updateUserCoins, createPurchase } = await import('../firebase.js');
    const userData = await getUser(interaction.user.id);

    // Verificar saldo novamente (segurança)
    if (userData.coins < item.coinPrice) {
      const errorEmbed = createMilitaryEmbed(
        "❌ BELLOS INSUFICIENTES",
        `**Você não tem Bellos suficientes!**\n\n` +
        `Alguém pode ter usado seus Bellos enquanto você preenchia o formulário.`,
        0xe74c3c
      );
      return interaction.editReply({ embeds: [errorEmbed] });
    }

    // Deduzir Bellos
    await updateUserCoins(interaction.user.id, -item.coinPrice);

    // Registrar compra
    const purchaseId = await createPurchase({
      userId: interaction.user.id,
      itemId: item.id,
      itemName: item.name,
      price: item.coinPrice,
      paymentMethod: 'coins',
      robloxUsername: robloxUsername,
      status: 'completed'
    });

    // ✅ CORREÇÃO: Passar o purchaseId para a notificação
    await sendPurchaseNotification(interaction, item, robloxUsername, 'coins', item.coinPrice, null, client, purchaseId);

    // Embed de sucesso
    const successEmbed = createMilitaryEmbed(
      "✅ COMPRA REALIZADA COM SUCESSO!",
      `**${interaction.user.tag}, sua compra foi processada!**\n\n` +
      `🛍️ **Item:** ${item.name}\n` +
      `🪙 **Preço:** ${formatPrice(item.coinPrice)} Bellos\n` +
      `🎮 **Roblox:** ${robloxUsername}\n` +
      `📊 **Seu saldo agora:** ${(userData.coins - item.coinPrice).toLocaleString('pt-BR')} Bellos\n` +
      `🆔 **ID da compra:** ${purchaseId}\n\n` +
      `⏰ **Entrega:** Seu item será entregue em até 24 horas!\n` +
      `📞 **Dúvidas?** Contate um administrador.`,
      0x2ecc71
    );

    await interaction.editReply({ embeds: [successEmbed] });

  } catch (error) {
    console.error("Erro ao processar compra com Bellos:", error);
    throw error;
  }
}

// ============================================================
// 💵 PROCESSAR COMPRA COM PIX - MELHORADO
// ============================================================

async function processPixPurchase(interaction, item, robloxUsername, finalPrice, discountApplied, client) {
  try {
    const { createPurchase } = await import('../firebase.js');

    // Registrar compra pendente
    const purchaseId = await createPurchase({
      userId: interaction.user.id,
      itemId: item.id,
      itemName: item.name,
      price: finalPrice,
      paymentMethod: 'pix',
      robloxUsername: robloxUsername,
      status: 'pending',
      discountCoupon: discountApplied?.code || null,
      originalPrice: item.pixPrice,
      discountPercent: discountApplied ? discountApplied.discount * 100 : 0
    });

    // CORREÇÃO: Melhorar embed com informações claras do cupom
    let discountInfo = '';
    if (discountApplied) {
      discountInfo = `🎫 **Cupom aplicado:** ${discountApplied.code} (${(discountApplied.discount * 100)}% off)\n` +
                    `💸 **Valor original:** R$ ${item.pixPrice.toFixed(2)}\n` +
                    `💰 **Você economizou:** R$ ${(item.pixPrice - finalPrice).toFixed(2)}\n`;
    } else {
      // Verificar se o usuário tentou usar um cupom que não existe
      const hasDiscountField = interaction.fields.fields.some(field => field.customId === 'discount_coupon');
      const discountCoupon = hasDiscountField ? interaction.fields.getTextInputValue('discount_coupon') || '' : '';
      
      if (discountCoupon) {
        discountInfo = `❌ **Cupom "${discountCoupon}" não encontrado ou inválido**\n` +
                      `💡 Cupons válidos: ${item.discountCoupons?.map(c => c.code).join(', ') || 'Nenhum'}\n`;
      } else {
        discountInfo = `💡 **Sem cupom aplicado**\n`;
      }
    }

    // Embed com instruções do PIX
    const pixEmbed = createMilitaryEmbed(
      "💵 COMPRA VIA PIX - PAGAMENTO PENDENTE",
      `**${interaction.user.tag}, sua compra foi registrada!**\n\n` +
      `🛍️ **Item:** ${item.name}\n` +
      `💰 **Valor a pagar:** R$ ${finalPrice.toFixed(2)}\n` +
      discountInfo +
      `🎮 **Roblox:** ${robloxUsername}\n` +
      `🆔 **ID da compra:** ${purchaseId}\n\n` +
      `📋 **PRÓXIMOS PASSOS:**\n` +
      `1. Um ticket será criado automaticamente\n` +
      `2. Você receberá a chave PIX para pagamento\n` +
      `3. Envie o comprovante no ticket\n` +
      `4. Aguarde a confirmação do pagamento\n` +
      `5. Seu item será entregue!`,
      0xF39C12
    );

    await interaction.editReply({ embeds: [pixEmbed] });

    // Criar ticket automaticamente
    await createPurchaseTicket(interaction, item, robloxUsername, finalPrice, discountApplied, purchaseId, client);

  } catch (error) {
    console.error("Erro ao processar compra com PIX:", error);
    throw error;
  }
}

// ============================================================
// 🎫 SISTEMA DE NOTIFICAÇÕES - COM BOTÃO ENTREGUE NO CANAL CORRETO
// ============================================================

// ✅ CORREÇÃO: Adicionar purchaseId como parâmetro opcional
async function sendPurchaseNotification(interaction, item, robloxUsername, paymentMethod, price, discountApplied, client, purchaseId = null) {
  try {
    // Buscar canal de compras 🤑│・compras-bello
    const purchaseChannel = interaction.guild.channels.cache.find(channel => 
      channel.name === "🤑│・compras-bello" ||
      channel.name.toLowerCase().includes("compras") ||
      channel.name.toLowerCase().includes("🤑")
    );

    if (!purchaseChannel) {
      console.log('❌ Canal de compras não encontrado');
      return;
    }

    // Apenas adicionar botão "Entregue" para compras com Bellos
    if (paymentMethod === 'coins') {
      const notificationEmbed = createMilitaryEmbed(
        "🪙 NOVA COMPRA COM BELLOS!",
        `**🎉 TEMOS UMA NOVA COMPRA NO SISTEMA!**\n\n` +
        `👤 **Comprador:** ${interaction.user.tag} (${interaction.user.id})\n` +
        `🛍️ **Item:** ${item.image} ${item.name}\n` +
        `📄 **Descrição:** ${item.description}\n` +
        `🎮 **Roblox:** \`${robloxUsername}\`\n` +
        `💰 **Valor:** ${formatPrice(price)} Bellos\n` +
        `${purchaseId ? `🆔 **ID da compra:** ${purchaseId}\n` : ''}` +
        `🏆 **Status:** ✅ **COMPRA CONCLUÍDA - AGUARDANDO ENTREGA**\n\n` +
        `⏰ **Data:** <t:${Math.floor(Date.now() / 1000)}:F>\n` +
        `📞 **Administradores:** Marque como entregue quando o item for entregue.`,
        0xF1C40F
    );

    const deliverButton = new ActionRowBuilder()
        .addComponents(
        new ButtonBuilder()
            .setLabel('✅ Marcar como Entregue')
            .setStyle(ButtonStyle.Success)
            .setCustomId(`deliver_item_${interaction.user.id}_${item.id}_${Date.now()}`)
        );

    const message = await purchaseChannel.send({ 
        content: `🎉 **@everyone NOVA COMPRA REALIZADA COM BELLOS!** 🎉`,
        embeds: [notificationEmbed],
        components: [deliverButton]
    });

    // ✅ CORREÇÃO: Aguardar a salvamento e verificar se foi bem sucedido
    const { savePurchaseInfo } = await import('../firebase.js');
    const saveResult = await savePurchaseInfo(message.id, {
        userId: interaction.user.id,
        userTag: interaction.user.tag,
        itemId: item.id,
        itemName: item.name,
        description: item.description, // ✅ Adicionar descrição
        image: item.image, // ✅ Adicionar emoji/imagem
        robloxUsername: robloxUsername,
        price: price,
        messageId: message.id,
        channelId: purchaseChannel.id,
        purchaseId: purchaseId,
        paymentMethod: 'coins',
        createdAt: new Date()
    });

    if (!saveResult) {
        console.error('❌ Falha ao salvar informações da compra no Firebase');
    } else {
        console.log('✅ Informações da compra salvas com sucesso para messageId:', message.id);
    }

    } else if (paymentMethod === 'pix') {
      // Para PIX, notificação normal sem botão
      const pixEmbed = createMilitaryEmbed(
        "💵 NOVA COMPRA VIA PIX!",
        `**📋 AGUARDANDO PAGAMENTO**\n\n` +
        `👤 **Comprador:** ${interaction.user.tag}\n` +
        `🛍️ **Item:** ${item.name}\n` +
        `🎮 **Roblox:** ${robloxUsername}\n` +
        `💰 **Valor:** R$ ${price.toFixed(2)}\n` +
        `${discountApplied ? `🎫 **Cupom usado:** ${discountApplied.code} (${(discountApplied.discount * 100)}% off)\n` : ''}` +
        `🆔 **ID:** ${Date.now().toString(36).toUpperCase()}\n\n` +
        `⏰ **Data:** <t:${Math.floor(Date.now() / 1000)}:F>\n` +
        `✅ **Status:** AGUARDANDO PAGAMENTO`,
        0x9B59B6
      );

      await purchaseChannel.send({ 
        content: `💵 **NOVA COMPRA VIA PIX AGUARDANDO PAGAMENTO!**`,
        embeds: [pixEmbed] 
      });
    }

  } catch (error) {
    console.error("Erro ao enviar notificação:", error);
  }
}

async function handleDeliverItem(interaction, userId, itemId, timestamp, client) {
  try {
    // Verificar se é administrador
    if (!interaction.member.permissions.has('Administrator')) {
      const errorEmbed = createMilitaryEmbed(
        "❌ PERMISSÃO NEGADA",
        "**Apenas administradores podem marcar itens como entregues!**",
        0xe74c3c
      );
      return interaction.editReply({ embeds: [errorEmbed] });
    }

    // ✅ CORREÇÃO: Importar as funções corretas
    const { markAsDelivered, getPurchaseInfo, getItem } = await import('../firebase.js');
    
    // Primeiro tentar buscar pelas informações salvas
    let purchaseInfo = await getPurchaseInfo(interaction.message.id);
    
    if (!purchaseInfo) {
      console.log('❌ Informações da compra não encontradas no Firebase, buscando item...');
      
      // Se não encontrar, buscar informações completas do item
      const item = await getItem(itemId);
      if (item) {
        purchaseInfo = {
          userId: userId,
          itemId: itemId,
          itemName: item.name,
          description: item.description,
          image: item.image,
          robloxUsername: 'Não informado no banco de dados',
          price: item.coinPrice,
          // Tentar extrair informações da mensagem original
          fromMessage: true
        };
        console.log('✅ Informações do item recuperadas:', purchaseInfo);
      } else {
        // Se não conseguir encontrar o item, usar informações mínimas
        purchaseInfo = {
          userId: userId,
          itemId: itemId,
          itemName: 'Item Desconhecido',
          robloxUsername: 'Não informado',
          price: 0
        };
        console.log('❌ Item não encontrado no catálogo');
      }
    } else {
      console.log('✅ Informações da compra recuperadas do Firebase:', purchaseInfo);
    }
    
    // Marcar como entregue no banco de dados
    console.log('📝 Marcando compra como entregue...');
    const deliveryResult = await markAsDelivered(interaction.message.id);
    
    if (!deliveryResult) {
      console.log('⚠️ Aviso: Não foi possível marcar como entregue no Firebase, mas continuando...');
    }

    // Buscar usuário pelo ID
    const user = await client.users.fetch(userId);
    console.log('👤 Usuário encontrado:', user.tag);
    
    // Buscar canal 🎮│・bello para enviar a mensagem de entrega
    const belloChannel = interaction.guild.channels.cache.find(channel => 
      channel.name === "🎮│・bello" ||
      channel.name.toLowerCase().includes("bello") ||
      channel.name.toLowerCase().includes("🎮")
    );

    if (belloChannel) {
      console.log('📢 Enviando notificação no canal bello...');
      
      // Enviar mensagem de entrega concluída no canal 🎮│・bello
      const deliveryEmbed = createMilitaryEmbed(
        "🎉 ENTREGA CONCLUÍDA!",
        `**✅ ITEM ENTREGUE COM SUCESSO!**\n\n` +
        `👤 **Cliente:** ${user}\n` +
        `🛍️ **Item:** ${purchaseInfo.image || '📦'} ${purchaseInfo.itemName}\n` +
        `📄 **Descrição:** ${purchaseInfo.description || 'Item do catálogo'}\n` +
        `🎮 **Roblox:** \`${purchaseInfo.robloxUsername}\`\n` +
        `💰 **Valor:** ${formatPrice(purchaseInfo.price)} Bellos\n\n` +
        `**📋 INSTRUÇÕES PARA O CLIENTE:**\n` +
        `1. **Saia do servidor do Roblox**\n` +
        `2. **Aguarde 1-2 minutos**\n` +
        `3. **Entre novamente no servidor**\n` +
        `4. **Seu item estará disponível!**\n\n` +
        `🔄 **Este processo é necessário para sincronizar o sistema!**\n\n` +
        `📞 **Problemas? Contate a administração!**`,
        0x2ecc71
      );

      deliveryEmbed.setThumbnail(user.displayAvatarURL({ size: 256 }));
      deliveryEmbed.addFields(
        {
          name: "⏰ TEMPO DE SINCRONIZAÇÃO",
          value: "🕒 **1-5 minutos** após reentrar\n✅ **Processo automático**\n🎯 **100% eficaz**",
          inline: true
        },
        {
          name: "🛡️ GARANTIA",
          value: "✅ **Entrega confirmada**\n🔒 **Sistema verificado**\n💫 **Funcionamento garantido**",
          inline: true
        }
      );

      deliveryEmbed.setFooter({ 
        text: `Entrega realizada por: ${interaction.user.tag} • ${new Date().toLocaleString('pt-BR')}`,
        iconURL: interaction.user.displayAvatarURL()
      });

      deliveryEmbed.setTimestamp();

      await belloChannel.send({ 
        content: `🎉 ${user} **SEU ITEM FOI ENTREGUE!** 🎉\n📋 Siga as instruções abaixo para receber seu item:`,
        embeds: [deliveryEmbed] 
      });
      
      console.log('✅ Notificação enviada no canal bello');
    } else {
      console.log('❌ Canal bello não encontrado');
    }

    // ✅ CORREÇÃO: Lidar com o embed de forma segura
    let embedsToEdit = [];
    
    if (interaction.message.embeds && interaction.message.embeds.length > 0) {
      const originalEmbed = interaction.message.embeds[0];
      
      // Criar um novo embed baseado no original
      const updatedEmbed = createMilitaryEmbed(
        originalEmbed.title || "🪙 COMPRA ENTREGUE!",
        originalEmbed.description ? 
          originalEmbed.description
            .replace('AGUARDANDO ENTREGA', '✅ **ENTREGUE**')
            .replace('COMPRA CONCLUÍDA - AGUARDANDO ENTREGA', '✅ **ENTREGUE**')
            .replace('Aguardando entrega', '✅ **ENTREGUE**') :
          `**✅ ITEM ENTREGUE COM SUCESSO!**\n\n🛍️ **Item:** ${purchaseInfo.itemName}\n👤 **Cliente:** ${user.tag}`,
        0x2ecc71 // Verde para entregue
      );

      embedsToEdit = [updatedEmbed];
    } else {
      // Se não houver embed, criar um simples
      const simpleEmbed = createMilitaryEmbed(
        "✅ ENTREGA CONCLUÍDA",
        `**Item marcado como entregue com sucesso!**\n\n` +
        `🛍️ **Item:** ${purchaseInfo.itemName}\n` +
        `👤 **Cliente:** ${user.tag}\n` +
        `💰 **Valor:** ${formatPrice(purchaseInfo.price)} Bellos`,
        0x2ecc71
      );
      embedsToEdit = [simpleEmbed];
    }

    // Atualizar a mensagem original
    console.log('✏️ Atualizando mensagem original...');
    await interaction.message.edit({
      embeds: embedsToEdit,
      components: [] // Remove o botão
    });
    console.log('✅ Mensagem original atualizada');

    const successEmbed = createMilitaryEmbed(
      "✅ ENTREGA CONCLUÍDA!",
      `**Item marcado como entregue com sucesso!**\n\n` +
      `👤 **Cliente:** ${user.tag}\n` +
      `🛍️ **Item:** ${purchaseInfo.itemName}\n` +
      `🎮 **Roblox:** ${purchaseInfo.robloxUsername}\n` +
      `💰 **Valor:** ${formatPrice(purchaseInfo.price)} Bellos\n\n` +
      `📢 **Notificação enviada no canal 🎮│・bello**\n` +
      `📋 **Instruções de sincronização fornecidas**`,
      0x2ecc71
    );

    await interaction.editReply({ embeds: [successEmbed] });
    console.log('✅ Resposta de confirmação enviada');

    // Tentar enviar DM para o usuário
    try {
      const dmEmbed = createMilitaryEmbed(
        "🎉 SEU ITEM FOI ENTREGUE!",
        `**Olá ${user.tag}! Sua compra foi processada e entregue!**\n\n` +
        `🛍️ **Item:** ${purchaseInfo.itemName}\n` +
        `💰 **Valor:** ${formatPrice(purchaseInfo.price)} Bellos\n\n` +
        `**📋 PARA RECEBER SEU ITEM:**\n` +
        `1. **Saia do servidor do Roblox**\n` +
        `2. **Aguarde 1-2 minutos**\n` +
        `3. **Entre novamente no servidor**\n` +
        `4. **Seu item estará disponível!**\n\n` +
        `🔄 Este processo é necessário para sincronizar o sistema.\n` +
        `📞 Dúvidas? Responda esta mensagem!`,
        0x2ecc71
      );

      await user.send({ embeds: [dmEmbed] });
      console.log('✅ DM enviada para o usuário');
    } catch (dmError) {
      console.log(`❌ Não foi possível enviar DM para ${user.tag}`);
    }

    console.log('🎉 Processo de entrega concluído com sucesso!');

  } catch (error) {
    console.error("❌ Erro ao marcar item como entregue:", error);
    const errorEmbed = createMilitaryEmbed(
      "❌ ERRO NA ENTREGA",
      "**Ocorreu um erro ao marcar o item como entregue.**\n\nTente novamente ou contate o suporte.",
      0xe74c3c
    );
    await interaction.editReply({ embeds: [errorEmbed] });
  }
}

// ============================================================
// 🎫 SISTEMA DE TICKETS PIX
// ============================================================

async function createPurchaseTicket(interaction, item, robloxUsername, finalPrice, discountApplied, purchaseId, client) {
  try {
    // Buscar categoria de tickets
    const guild = interaction.guild;
    const ticketCategory = guild.channels.cache.find(channel => 
      channel.type === 4 && (channel.name.toLowerCase().includes('ticket') || channel.name.toLowerCase().includes('compras'))
    );

    // Criar canal do ticket
    const ticketChannel = await guild.channels.create({
      name: `pix-${interaction.user.username}-${Date.now().toString(36)}`,
      type: 0, // TEXT_CHANNEL
      parent: ticketCategory?.id,
      permissionOverwrites: [
        {
          id: guild.id,
          deny: ['ViewChannel']
        },
        {
          id: interaction.user.id,
          allow: ['ViewChannel', 'SendMessages', 'ReadMessageHistory']
        },
        {
          id: client.user.id,
          allow: ['ViewChannel', 'SendMessages', 'ReadMessageHistory']
        }
      ]
    });

    // Embed do ticket
    const ticketEmbed = createMilitaryEmbed(
     "💵 PAGAMENTO VIA PIX - TICKET DE COMPRA",
    `**Olá ${interaction.user.tag}!**\n\n` +
    `📋 **RESUMO DA COMPRA:**\n` +
    `🛍️ **Item:** ${item.name}\n` +
    `💰 **Valor a pagar:** R$ ${finalPrice.toFixed(2)}\n` +
    (discountApplied ? 
        `🎫 **Cupom aplicado:** ${discountApplied.code} (${(discountApplied.discount * 100)}% off)\n` +
        `💸 **Valor original:** R$ ${item.pixPrice.toFixed(2)}\n` +
        `🤑 **Você economizou:** R$ ${(item.pixPrice - finalPrice).toFixed(2)}\n` 
        : '💡 **Sem cupom aplicado**\n') +
    `🎮 **Seu Roblox:** ${robloxUsername}\n` +
    `🆔 **ID da compra:** ${purchaseId}\n\n` +
      `📊 **INFORMAÇÕES PARA PAGAMENTO:**\n` +
      `🔑 **Chave PIX:** Conversaremos abaixo)\n` +
      `🏦 **Banco:** Conversaremos abaixo\n` +
      `👤 **Nome:** Conversaremos abaixo\n` +
      `💎 **Valor exato:** R$ ${finalPrice.toFixed(2)}\n\n` +
      `📝 **INSTRUÇÕES:**\n` +
      `1. Faça o PIX para a chave acima\n` +
      `2. **ENVIE O COMPROVANTE** neste chat\n` +
      `3. Aguarde a confirmação\n` +
      `4. Seu item será entregue em até 24h após confirmação\n\n` +
      `⏰ **Este ticket será fechado automaticamente em 48h**`,
      0x9B59B6
    );

    // Botão para fechar ticket
    const closeButton = new ActionRowBuilder()
      .addComponents(
        new ButtonBuilder()
          .setLabel('🔒 Fechar Ticket')
          .setStyle(ButtonStyle.Danger)
          .setCustomId('close_ticket')
      );

    await ticketChannel.send({ 
      content: `${interaction.user} 🎫 | @everyone **NOVO TICKET DE COMPRA VIA PIX!**`,
      embeds: [ticketEmbed],
      components: [closeButton]
    });

    // Notificar usuário
    await interaction.followUp({ 
      content: `🎫 **Ticket criado!** Acesse: ${ticketChannel}`,
      ephemeral: true 
    });

  } catch (error) {
    console.error("Erro ao criar ticket:", error);
    await interaction.followUp({ 
      content: "❌ **Erro ao criar ticket.** Contate um administrador manualmente.",
      ephemeral: true 
    });
  }
}

// ============================================================
// 🔄 HANDLERS DE BOTÕES DO CATÁLOGO
// ============================================================

// ALTERNATIVA SIMPLES - catalog.js
async function handleCatalogRefresh(interaction, client) {
  try {
    // Não fazer deferUpdate aqui, pois já foi feito no index.js
    // Apenas chamar handleCatalogo que vai detectar o estado da interação
    await handleCatalogo(interaction, client);
  } catch (error) {
    console.error("Erro ao atualizar catálogo:", error);
    const errorEmbed = createMilitaryEmbed(
      "❌ ERRO AO ATUALIZAR",
      "**Não foi possível atualizar o catálogo.**\n\nTente novamente.",
      0xe74c3c
    );
    
    // Usar followUp pois a interação já foi deferida
    await interaction.followUp({ embeds: [errorEmbed], ephemeral: true });
  }
}

async function handleCatalogBack(interaction, client) {
  try {
    // Não fazer deferUpdate aqui, pois já foi feito no index.js
    await handleCatalogo(interaction, client);
  } catch (error) {
    console.error("Erro ao voltar ao catálogo:", error);
    const errorEmbed = createMilitaryEmbed(
      "❌ ERRO AO VOLTAR",
      "**Não foi possível voltar ao catálogo.**\n\nTente novamente.",
      0xe74c3c
    );
    
    await interaction.followUp({ embeds: [errorEmbed], ephemeral: true });
  }
}



// catalog.js - CORREÇÃO
async function handleCatalogCheckCoins(interaction, client) {
  // REMOVA ESTA LINHA:
  // await interaction.deferReply({ ephemeral: true });
  
  try {
    const userData = await getUser(interaction.user.id);
    
    const coinsEmbed = createMilitaryEmbed(
      "💰 SEUS BELLOS",
      `**${interaction.user.tag}, aqui está seu saldo:**\n\n` +
      `🪙 **Bellos disponíveis:** ${userData.coins.toLocaleString('pt-BR')}\n` +
      `👥 **Recrutas convidados:** ${userData.invites}\n` +
      `⏰ **Tempo no servidor:** ${Math.floor(userData.totalTime / 60)} horas\n\n` +
      `💡 **Ganhe mais Bellos convidando amigos!**`,
      0xF1C40F
    );

    // Use editReply pois já foi feito deferReply no index.js
    await interaction.editReply({ embeds: [coinsEmbed] });
    
  } catch (error) {
    console.error("Erro ao verificar Bellos:", error);
    const errorEmbed = createMilitaryEmbed(
      "❌ ERRO",
      "**Não foi possível verificar seus Bellos.**\n\nTente novamente.",
      0xe74c3c
    );
    await interaction.editReply({ embeds: [errorEmbed] });
  }
}

// Função de autocomplete para nomes de itens
export async function autocomplete(interaction, client) {
  const focusedOption = interaction.options.getFocused(true);
  
  if (focusedOption.name === 'nome_item') {
    try {
      const items = await getCatalogItems();
      const searchTerm = focusedOption.value.toLowerCase();
      
      const filtered = items
        .filter(item => 
          item.name.toLowerCase().includes(searchTerm) ||
          item.description.toLowerCase().includes(searchTerm) ||
          item.category.toLowerCase().includes(searchTerm)
        )
        .slice(0, 25); // Limite do Discord
      
      await interaction.respond(
        filtered.map(item => ({
          name: `${item.image} ${item.name} | ${getCategoryName(item.category)} | ${formatPrice(item.coinPrice)}`,
          value: item.name
        }))
      );
    } catch (error) {
      console.error("Erro no autocomplete:", error);
      await interaction.respond([]);
    }
  }
}

export const catalogHandlers = {
  handleItemSelect,
  handleCoinPurchase,
  handlePixPurchase,
  handlePurchaseModal,
  handleCatalogRefresh,
  handleCatalogBack,
  handleCatalogCheckCoins,
  handleRemoveItemButton,
  handleEditItemButton,  
  handleConfirmRemoveItem,
  handleDeliverItem,
  handleConfirmLootbox,  
  handleMeusCodigos,     
  handleEstatisticasLootbox 
};