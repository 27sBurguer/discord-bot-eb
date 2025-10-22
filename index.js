import "dotenv/config";
import {
  Client,
  GatewayIntentBits,
  REST,
  Routes,
  PermissionFlagsBits,
  Collection,
  EmbedBuilder,
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  MessageFlags
} from "discord.js";
import http from 'http';
import fetch from 'node-fetch';

// Importar comandos
import * as militaryCommands from './commands/military.js';
import * as utilityCommands from './commands/utility.js';
import * as adminCommands from './commands/admin.js';
import * as eventCommands from './commands/events.js';
import * as economyCommands from './commands/economy.js'; // ✅ NOVO
import * as catalogCommands from './commands/catalog.js'; // ✅ NOVO
import { handleVideoChannelMessage } from './commands/videoMonitor.js';

// Importar utils
import { createMilitaryEmbed } from './utils/embeds.js';

import { 
  setupRotatingStatus, 
  setupThemedStatus, 
  setupSpecialEventsStatus,
  cycleStatusTypes,
  getRandomDescription 
} from './utils/statusManager.js';

// ✅ INTENTS CORRIGIDAS - APENAS AS NECESSÁRIAS
const discordBot = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMembers, // ✅ Necessário para ver membros
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent, // ✅ Necessário para ler conteúdo de mensagens
  ],
});

// Collection para comandos
discordBot.commands = new Collection();

const SERVER_URL = process.env.SERVER_URL;
const CLIENT_ID = process.env.CLIENT_ID;

// No client.on('messageCreate'), adicione:
discordBot.on('messageCreate', async (message) => {
  // Monitoramento do canal de vídeos
  await handleVideoChannelMessage(message, discordBot);
});

// ============================================================
// 🗃️ Armazenamento Global
// ============================================================
export const robloxUsernames = new Map();

export const patents = {
  1: "N/A",
  2: "[REC] Recruta",
  3: "[SLD] Soldado",
  4: "[CB] Cabo",
  5: "[T-SGT] Terceiro-Sargento",
  6: "[S-SGT] Segundo-Sargento",
  7: "[P-SGT] Primeiro-Sargento",
  8: "[S-BTN] Sub-Tenente",
  9: "[AAO] Aspirante-Á-Oficial",
  10: "[STN] Segundo-Tenente",
  11: "[PTN] Primeiro-Tenente",
  12: "[CAP] Capitão",
  13: "[MAJ] Major",
  14: "[TEN-C] Tenente-Coronel",
  15: "[COR] Coronel",
  16: "[GEN-B] General-De-Brigada",
  17: "[GEN-D] General-De-Divisão",
  18: "[GEN-E] General-De-Exército",
  19: "[S-COM] Sub-Comandante",
  20: "[COM] Comandante",
};

export const rankGroups = {
  Civis: ["N/A"],
  Praças: ["[REC]", "[SLD]"],
  Graduados: ["[CB]", "[T-SGT]", "[S-SGT]", "[P-SGT]", "[S-BTN]"],
  Oficiais: ["[AAO]", "[STN]", "[PTN]", "[CAP]", "[MAJ]", "[TEN-C]", "[COR]"],
  Generais: ["[GEN-B]", "[GEN-D]", "[GEN-E]", "[S-COM]", "[COM]"],
};

// ============================================================
// 💬 Registrar Comandos em Todos os Servidores
// ============================================================
const allCommands = [
  ...militaryCommands.commands,
  ...utilityCommands.commands,
  ...adminCommands.commands,
  ...eventCommands.commands, // ✅ NOVO
  ...economyCommands.commands, // ✅ NOVO
  ...catalogCommands.commands // ✅ NOVO
];

const rest = new REST({ version: "10" }).setToken(process.env.DISCORD_TOKEN);

// Função para registrar comandos em um servidor específico
async function registerCommandsForGuild(guildId) {
  try {
    console.log(`📦 Registrando comandos no servidor: ${guildId}`);
    await rest.put(
      Routes.applicationGuildCommands(CLIENT_ID, guildId),
      { body: allCommands }
    );
    console.log(`✅ Comandos registrados no servidor: ${guildId}`);
  } catch (err) {
    console.error(`❌ Erro ao registrar comandos no servidor ${guildId}:`, err);
  }
}

// Adicionar comandos à Collection
catalogCommands.commands.forEach(cmd => 
  discordBot.commands.set(cmd.name, { 
    category: 'catalog',
    execute: catalogCommands.execute,
    data: cmd 
  })
);

economyCommands.commands.forEach(cmd => 
  discordBot.commands.set(cmd.name, { 
    category: 'economy',
    execute: economyCommands.execute,
    data: cmd 
  })
);

militaryCommands.commands.forEach(cmd => 
  discordBot.commands.set(cmd.name, { 
    category: 'military',
    execute: militaryCommands.execute,
    data: cmd 
  })
);
utilityCommands.commands.forEach(cmd => 
  discordBot.commands.set(cmd.name, { 
    category: 'utility',
    execute: utilityCommands.execute,
    data: cmd 
  })
);
adminCommands.commands.forEach(cmd => 
  discordBot.commands.set(cmd.name, { 
    category: 'admin',
    execute: adminCommands.execute,
    data: cmd 
  })
);
// ✅ NOVO - Comandos de eventos
eventCommands.commands.forEach(cmd => 
  discordBot.commands.set(cmd.name, { 
    category: 'events',
    execute: eventCommands.execute,
    data: cmd 
  })
);

// ============================================================
// 🚀 Inicializa o bot
// ============================================================
discordBot.once("ready", async () => {
  console.log(`🤖 Bot do Discord logado como ${discordBot.user.tag}`);
  console.log(`📊 Comandos carregados: ${discordBot.commands.size}`);
  console.log(`🔗 Conectado em ${discordBot.guilds.cache.size} servidores`);

  eventCommands.initializeEventSystem(discordBot);

  // ✅ INICIALIZAR CATÁLOGO
  try {
    const { initializeCatalog } = await import('./firebase.js');
    await initializeCatalog();
  } catch (error) {
    console.error('❌ Erro ao inicializar catálogo:', error);
  }

  // ✅ INICIALIZAR CACHE DE CONVITES
  try {
    console.log('🔍 Inicializando cache de convites...');
    const guilds = discordBot.guilds.cache;
    
    for (const [guildId, guild] of guilds) {
      const invites = await guild.invites.fetch();
      discordBot.inviteCache = new Map();
      
      invites.forEach(invite => {
        discordBot.inviteCache.set(invite.code, invite.uses);
      });
      
      console.log(`✅ Cache de convites inicializado para: ${guild.name} (${invites.size} convites)`);
    }
  } catch (error) {
    console.error('❌ Erro ao inicializar cache de convites:', error);
  }

  // ✅ TESTAR CONEXÃO COM FIREBASE
  try {
    const { testFirebaseConnection } = await import('./firebase.js');
    await testFirebaseConnection();
  } catch (error) {
    console.error('❌ Erro ao carregar Firebase:', error);
  }
  
  // Registrar comandos em todos os servidores atuais
  console.log('🌍 Registrando comandos em todos os servidores...');
  const guilds = discordBot.guilds.cache;
  
  for (const [guildId, guild] of guilds) {
    await registerCommandsForGuild(guildId);
  }
  
  // ✅ NOVO SISTEMA DE STATUS AUTOMÁTICO
  console.log('🎮 Configurando sistema de status automático...');
  
  // 1. Primeiro verifica se há status especial para data comemorativa
  const hasSpecialStatus = setupSpecialEventsStatus(discordBot);
  
  if (!hasSpecialStatus) {
    // 2. Se não há status especial, configura sistema normal
    
    // Sistema de status rotativo (aleatório a cada 2 minutos)
    setupRotatingStatus(discordBot, 2 * 60 * 1000);
    
    // Sistema de status temático (muda conforme horário)
    setupThemedStatus(discordBot);
    
    // Sistema de status cíclico (estatísticas a cada 3 minutos)
    cycleStatusTypes(discordBot);
  }
  
  // ✅ Atualizar descrição do bot (se possível)
  try {
    const randomDescription = getRandomDescription();
    console.log(`📝 Descrição do bot: ${randomDescription}`);
  } catch (error) {
    console.log('ℹ️ Não foi possível atualizar a descrição do bot');
  }
  
  console.log('✅ Sistema de status automático configurado!');
});

// ============================================================
// 🎯 EVENTO: Quando o bot é adicionado a um novo servidor
// ============================================================
discordBot.on("guildCreate", async (guild) => {
  console.log(`🔔 Bot adicionado ao servidor: ${guild.name} (${guild.id})`);
  
  // Registrar comandos no novo servidor
  await registerCommandsForGuild(guild.id);
  
  // Enviar mensagem de boas-vindas
  const systemChannel = guild.systemChannel || guild.channels.cache.find(channel => 
    channel.type === 0 && channel.permissionsFor(guild.members.me).has('SendMessages')
  );
  
  if (systemChannel) {
    const welcomeEmbed = createMilitaryEmbed(
      "🎉 BOT MILITAR ADICIONADO!",
      `**Sistema Militar ativado no servidor ${guild.name}!**\n\n` +
      `🤖 **Bot:** ${discordBot.user.tag}\n` +
      `⚙️ **Comandos:** Registrados automaticamente\n` +
      `👥 **Membros:** ${guild.memberCount}\n\n` +
      `**📋 Funcionalidades:**\n` +
      `• Sistema de patentes militar\n` +
      `• Verificação de conta Roblox\n` +
      `• Atribuição automática de cargos\n` +
      `• Comandos de administração\n\n` +
      `**🚀 Comece agora:**\n` +
      `Use \`/ajuda\` para ver todos os comandos disponíveis!`,
      0x1abc9c,
      [],
      discordBot.user.displayAvatarURL()
    );
    
    await systemChannel.send({ embeds: [welcomeEmbed] });
  }
  
  // Log no console
  console.log(`✅ Comandos registrados e mensagem enviada no servidor: ${guild.name}`);
});

// ============================================================
// 🎯 EVENTO: Interações de Botões
// ============================================================
discordBot.on("interactionCreate", async (interaction) => {
  // Se for um comando de chat
  if (interaction.isChatInputCommand()) {
    const commandData = discordBot.commands.get(interaction.commandName);
    
    if (!commandData) {
      const errorEmbed = createMilitaryEmbed(
        "COMANDO NÃO ENCONTRADO",
        "❌ **Este comando não está disponível.**\n\nUse `/ajuda` para ver todos os comandos.",
        0xe74c3c
      );
      return interaction.reply({ embeds: [errorEmbed], ephemeral: true });
    }

    try {
      await commandData.execute(interaction, discordBot);
    } catch (error) {
      console.error(`Erro executando comando ${interaction.commandName}:`, error);
      
      const errorEmbed = createMilitaryEmbed(
        "ERRO NO COMANDO",
        "❌ **Ocorreu um erro ao executar este comando.**\n\n📞 Contate a administração.",
        0xe74c3c
      );
      
      if (interaction.replied || interaction.deferred) {
        await interaction.followUp({ embeds: [errorEmbed], ephemeral: true });
      } else {
        await interaction.reply({ embeds: [errorEmbed], ephemeral: true });
      }
    }
    return;
  }
  
  // Se for uma interação de botão
  if (interaction.isButton()) {
    const buttonId = interaction.customId;

    // ✅ BOTÃO CLOSE_TICKET (não precisa de deferReply)
    if (buttonId === 'close_ticket') {
      if (interaction.channel.name.startsWith('pix-')) {
        await interaction.channel.delete();
      }
      return;
    }

    // ✅ BOTÕES QUE MOSTRAM MODALS (não podem ter deferReply)
    const modalButtons = ['buy_coins_', 'buy_pix_'];
    const showsModal = modalButtons.some(prefix => buttonId.startsWith(prefix));
    
    if (showsModal) {
      // NÃO FAZER deferReply para botões que mostram modals
      if (buttonId.startsWith('buy_coins_')) {
        const { catalogHandlers } = await import('./commands/catalog.js');
        await catalogHandlers.handleCoinPurchase(interaction, discordBot);
        return;
      }
      
      if (buttonId.startsWith('buy_pix_')) {
        const { catalogHandlers } = await import('./commands/catalog.js');
        await catalogHandlers.handlePixPurchase(interaction, discordBot);
        return;
      }
    }
    
    // No interactionCreate, atualize a parte dos botões da lootbox:
    if (buttonId === 'confirm_lootbox') {
      // Já tem deferReply no handler, então está correto
      const { catalogHandlers } = await import('./commands/catalog.js');
      await catalogHandlers.handleConfirmLootbox(interaction, discordBot);
      return;
    }

    if (buttonId === 'cancel_lootbox') {
      // ✅ ADICIONE deferReply para o botão de cancelar
      await interaction.deferReply({ ephemeral: true });
      
      const cancelEmbed = createMilitaryEmbed(
        "❌ COMPRA CANCELADA",
        "**Compra da lootbox cancelada.**\n\nVocê pode comprar uma lootbox a qualquer momento usando `/lootbox`.",
        0x95A5A6
      );
      await interaction.editReply({ 
        embeds: [cancelEmbed],
        components: [] 
      });
      return;
    }

    // ✅ BOTÕES QUE PRECISAM DE deferUpdate (atualizam a mensagem)
    const updateButtons = ['catalog_refresh', 'catalog_back'];
    
    if (updateButtons.includes(buttonId)) {
      await interaction.deferUpdate();
      
      if (buttonId === 'catalog_refresh') {
        const { catalogHandlers } = await import('./commands/catalog.js');
        await catalogHandlers.handleCatalogRefresh(interaction, discordBot);
        return;
      }
      
      if (buttonId === 'catalog_back') {
        const { catalogHandlers } = await import('./commands/catalog.js');
        await catalogHandlers.handleCatalogBack(interaction, discordBot);
        return;
      }
    }

    // ✅ BOTÃO ENTREGUE ITEM - PRECISA DE deferReply ESPECÍFICO
    if (buttonId.startsWith('deliver_item_')) {
      await interaction.deferReply({ flags: MessageFlags.Ephemeral });
      
      const parts = buttonId.replace('deliver_item_', '').split('_');
      if (parts.length >= 3) {
        const userId = parts[0];
        const itemId = parts[1];
        const timestamp = parts[2];
        
        const { catalogHandlers } = await import('./commands/catalog.js');
        await catalogHandlers.handleDeliverItem(interaction, userId, itemId, timestamp, discordBot);
      } else {
        const errorEmbed = createMilitaryEmbed(
          "❌ ERRO NO BOTÃO",
          "**Formato do botão inválido.**\n\nContate um administrador.",
          0xe74c3c
        );
        await interaction.editReply({ embeds: [errorEmbed] });
      }
      return;
    }

    // ✅ BOTÕES QUE PRECISAM DE deferReply (resposta ephemeral normal)
    // ADICIONE ESTA VERIFICAÇÃO PARA EVITAR DUPLO DEFER
    if (!interaction.deferred && !interaction.replied) {
      await interaction.deferReply({ flags: MessageFlags.Ephemeral });
    }

    if (buttonId === 'cancel_remove') {
      const cancelEmbed = createMilitaryEmbed(
        "❌ REMOÇÃO CANCELADA",
        "**A remoção do item foi cancelada.**\n\nO item permanece no catálogo.",
        0x95a5a6
      );
      await interaction.editReply({ 
        embeds: [cancelEmbed],
        components: []
      });
      return;
    }
    
    // Restante dos botões...
    if (buttonId === 'catalog_check_coins') {
      const { catalogHandlers } = await import('./commands/catalog.js');
      await catalogHandlers.handleCatalogCheckCoins(interaction, discordBot);
      return;
    }
    
    switch (buttonId) {
      case 'manual_instructions':
        const manualEmbed = createMilitaryEmbed(
          "📚 MANUAL DE INSTRUÇÕES",
          "**Guia completo para verificação de conta militar**\n\nSiga os passos abaixo para se integrar às forças armadas:"
        );

        manualEmbed.addFields(
          {
            name: "🎮 PASSO 1: Obter Código no Roblox",
            value: "• Entre no jogo Roblox\n• Vá até o **Quartel General**\n• Use o comando `/gerarcodigo`\n• Anote o código de 6 dígitos",
            inline: false
          },
          {
            name: "💻 PASSO 2: Verificar no Discord",
            value: "• Use o comando `/conectar <código>`\n• Substitua `<código>` pelo código obtido\n• Aguarde a verificação automática",
            inline: false
          },
          {
            name: "✅ PASSO 3: Confirmação",
            value: "• Seu nickname será atualizado\n• Você receberá o cargo **Membro Verificado**\n• Patente militar atribuída automaticamente\n• **Username do Roblox salvo para promoções futuras**\n• Verificação concluída com sucesso!",
            inline: false
          },
          {
            name: "🎖️ PROMOÇÕES FUTURAS",
            value: "• Use `/atualizar` (apenas administradores)\n• Pré-requisito: Cargo 'Membro Verificado'\n• **Usará o username do Roblox salvo**\n• Hierarquia completa disponível em `/patentes`",
            inline: false
          },
          {
            name: "🚨 SUPORTE",
            value: "• Problemas? Contate um **Oficial**\n• Código não funciona? Gere outro\n• Erro persistente? Reporte ao comando",
            inline: false
          }
        );

        await interaction.editReply({ 
          embeds: [manualEmbed],
          ephemeral: true 
        });
        break;

      case 'verify_account':
        const verifyEmbed = createMilitaryEmbed(
          "🎮 VERIFICAÇÃO DE CONTA",
          "**Para verificar sua conta Roblox:**\n\n" +
          "1. **Entre no jogo Roblox** e vá até o Quartel General\n" +
          "2. **Use o comando** `/gerarcodigo` no chat do jogo\n" +
          "3. **Anote o código** de 6 dígitos que aparecer\n" +
          "4. **Volte para o Discord** e use o comando:\n" +
          "```/conectar codigo: SEU_CODIGO_AQUI```\n\n" +
          "📞 **Precisa de ajuda?** Contate um oficial!",
          0x3498db
        );

        await interaction.editReply({ 
          embeds: [verifyEmbed],
          ephemeral: true 
        });
        break;

      case 'suporte':
        const supportEmbed = createMilitaryEmbed(
          "📞 SUPORTE TÉCNICO",
          "**Precisa de ajuda?**\n\n" +
          "🔹 **Problemas com verificação?**\n" +
          "• Verifique se digitou o código corretamente\n" +
          "• O código expira após alguns minutos\n" +
          "• Gere um novo código se necessário\n\n" +
          "🔹 **Contate a equipe:**\n" +
          "• Procure por cargos de **Oficial** ou **Administrador**\n" +
          "• Abra um ticket no canal apropriado\n" +
          "• Descreva detalhadamente o problema\n\n" +
          "🎯 **Soluções comuns:**\n" +
          "• Use `/manual` para ver instruções detalhadas\n" +
          "• Certifique-se de estar no servidor correto do Roblox\n" +
          "• Verifique suas permissões no Discord",
          0xf39c12
        );

        await interaction.editReply({ 
          embeds: [supportEmbed],
          ephemeral: true 
        });
        break;

      // ✅ NOVOS BOTÕES DO SISTEMA DE CONVITES
      case 'create_invite':
        await handleCreateInvite(interaction);
        break;
        
      case 'check_coins':
        await handleCheckCoins(interaction);
        break;

      default:
        const unknownEmbed = createMilitaryEmbed(
          "❌ BOTÃO DESCONHECIDO",
          "Este botão não está configurado corretamente.\n\nContate um administrador para resolver o problema.",
          0xe74c3c
        );
        await interaction.editReply({ 
          embeds: [unknownEmbed],
          ephemeral: true 
        });
        break;
    }
  }

  // ✅ NOVO: Se for um menu de seleção (StringSelectMenu)
  if (interaction.isStringSelectMenu()) {
    if (interaction.customId === 'select_item') {
      // ADICIONE ESTA LINHA: deferReply para menus de seleção
      await interaction.deferReply({ ephemeral: true });
      
      const { catalogHandlers } = await import('./commands/catalog.js');
      await catalogHandlers.handleItemSelect(interaction, discordBot);
      return;
    }
  }

  // ✅ NOVO: Se for um modal (formulário)
  if (interaction.isModalSubmit()) {
    if (interaction.customId.startsWith('purchase_modal_')) {
      const { catalogHandlers } = await import('./commands/catalog.js');
      await catalogHandlers.handlePurchaseModal(interaction, discordBot);
      return;
    }
  }
});

// ============================================================
// 🎉 SISTEMA DE ANÚNCIO DE CONVITES
// ============================================================

async function sendInviteAnnouncement(guild, inviter, invited, client) {
  try {
    // Buscar o canal "🎮│・bello"
    const belloChannel = guild.channels.cache.find(channel => 
      channel.name === "🎮│・bello" ||
      channel.name.toLowerCase().includes("bello") ||
      channel.name.toLowerCase().includes("🎮")
    );
    
    if (!belloChannel) {
      console.log(`❌ Canal "🎮│・bello" não encontrado`);
      return;
    }
    
    // Verificar permissões
    if (!belloChannel.permissionsFor(client.user).has(['SendMessages', 'ViewChannel', 'EmbedLinks'])) {
      console.log(`❌ Sem permissões no canal ${belloChannel.name}`);
      return;
    }
    
    // Buscar dados atualizados do convidador
    const { getUser } = await import('./firebase.js');
    const inviterData = await getUser(inviter.id);
    
    // Criar embed militar super bonito
    const announcementEmbed = createMilitaryEmbed(
      "🎖️ NOVO RECRUTA CONVOCADO!",
      `**${inviter.tag} ACABA DE TRAZER UM NOVO SOLDADO PARA AS FILEIRAS!**\n\n` +
      `🎯 **Recruta Convocado:** ${invited.tag}\n` +
      `⚔️ **Responsável pelo Alistamento:** ${inviter.tag}\n` +
      `💰 **Recompensa por Serviço:** 100 Bellos\n` +
      `🎖️ **Total de Recrutas:** ${inviterData.invites + 1} soldados\n\n` +
      `📊 **Patrimônio Militar:** ${inviterData.coins.toLocaleString('pt-BR')} Bellos\n` +
      `🏅 **Grau de Influência:** ${getMilitaryRank(inviterData.invites + 1)}\n\n` +
      `🪖 **"Um soldado convocado é uma vitória garantida!"**`,
      0xFFD700 // Dourado
    );
    
    // Adicionar campos especiais
    announcementEmbed.addFields(
      {
        name: "🎯 MISSÃO CUMPRIDA",
        value: "✅ Recrutamento bem-sucedido\n✅ Reforços adquiridos\n✅ Recompensa distribuída",
        inline: true
      },
      {
        name: "📈 PROGRESSO MILITAR",
        value: `🪙 **Bellos:** ${inviterData.coins.toLocaleString('pt-BR')}\n👥 **Recrutas:** ${inviterData.invites + 1}\n⏰ **Serviço:** ${Math.floor(inviterData.totalTime / 60)}h`,
        inline: true
      },
      {
        name: "🎖️ PRÓXIMO OBJETIVO",
        value: getNextObjective(inviterData.invites + 1),
        inline: false
      }
    );
    
    // Configurar thumbnail e footer
    announcementEmbed.setThumbnail(inviter.displayAvatarURL({ size: 256 }));
    announcementEmbed.setImage('https://media1.giphy.com/media/v1.Y2lkPTc5MGI3NjExMDA0eGxxcjJvcGJoNzZzbHBwNXl5emdjaW1xZmJhbTBnaGQ1dzZ2ZCZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/QoPwvuCp9PRjmS8SEA/giphy.gif'); // GIF militar
    
    announcementEmbed.setFooter({ 
      text: `Sistema de Recrutamento Bellinho • ${new Date().toLocaleDateString('pt-BR')}`,
      iconURL: client.user.displayAvatarURL()
    });
    
    // Criar botão de ação
    const actionRow = new ActionRowBuilder()
      .addComponents(
        new ButtonBuilder()
          .setLabel('🎖️ Quero Recrutar Também!')
          .setStyle(ButtonStyle.Success)
          .setCustomId('create_invite'),
        new ButtonBuilder()
          .setLabel('💰 Ver Meus Bellos')
          .setStyle(ButtonStyle.Primary)
          .setCustomId('check_coins')
      );
    
    // Enviar a mensagem
    await belloChannel.send({ 
      content: `🎉 **PARABÉNS ${inviter}!** 🎉`,
      embeds: [announcementEmbed],
      components: [actionRow]
    });
    
    console.log(`✅ Anúncio de convite enviado no canal: ${belloChannel.name}`);
    
  } catch (error) {
    console.error(`❌ Erro ao enviar anúncio de convite:`, error);
  }
}

// ============================================================
// 🎖️ FUNÇÕES AUXILIARES MILITARES
// ============================================================

/**
 * Retorna o rank militar baseado no número de convites
 */
function getMilitaryRank(invites) {
  if (invites >= 20) return "🏅 **General de Recrutamento**";
  if (invites >= 15) return "⭐ **Coronel Convocador**";
  if (invites >= 10) return "🎖️ **Major de Tropas**";
  if (invites >= 5) return "⚔️ **Capitão Recrutador**";
  if (invites >= 3) return "🔰 **Sargento Convocador**";
  if (invites >= 1) return "🎯 **Cabo de Recrutas**";
  return "🪖 **Soldado Iniciante**";
}

/**
 * Retorna o próximo objetivo do usuário
 */
function getNextObjective(currentInvites) {
  const objectives = [
    { target: 1, reward: "🎖️ Primeiro recruta - 100 Bellos" },
    { target: 3, reward: "⚔️ 3 recrutas - Patente de Sargento" },
    { target: 5, reward: "🎖️ 5 recrutas - Patente de Capitão" },
    { target: 10, reward: "⭐ 10 recrutas - Patente de Major" },
    { target: 15, reward: "🏅 15 recrutas - Patente de Coronel" },
    { target: 20, reward: "🎯 20 recrutas - Patente de General" }
  ];
  
  for (const objective of objectives) {
    if (currentInvites < objective.target) {
      return `**Próxima conquista:** ${objective.target} recrutas\n**Recompensa:** ${objective.reward}`;
    }
  }
  
  return "**🎖️ MISSÃO CUMPLIDA!** Você alcançou todas as patentes!";
}

// ============================================================
// 🎯 HANDLERS DOS BOTÕES DO ANÚNCIO
// ============================================================

async function handleCreateInvite(interaction) {
  try {
    // Criar um convite temporário
    const invite = await interaction.channel.createInvite({
      maxAge: 86400, // 24 horas
      maxUses: 1,
      unique: true,
      reason: `Convite criado por ${interaction.user.tag} via botão do anúncio`
    });
    
    const inviteEmbed = createMilitaryEmbed(
      "🎖️ CONVITE DE RECRUTAMENTO CRIADO!",
      `**Aqui está seu convite especial para recrutamento:**\n\n` +
      `🔗 **Link do Convite:** ${invite.url}\n` +
      `⏰ **Validade:** 24 horas\n` +
      `👥 **Usos Máximos:** 1 pessoa\n` +
      `💰 **Recompensa:** 100 Bellos por recruta\n\n` +
      `🎯 **Compartilhe este link e ganhe Bellos!**\n` +
      `📱 **Dica:** Envie para amigos ou grupos!`,
      0x3498db
    );
    
    await interaction.editReply({ 
      embeds: [inviteEmbed],
      ephemeral: true 
    });
    
  } catch (error) {
    console.error("Erro ao criar convite:", error);
    const errorEmbed = createMilitaryEmbed(
      "❌ ERRO AO CRIAR CONVITE",
      "**Não foi possível criar um convite no momento.**\n\nTente novamente mais tarde ou contate um administrador.",
      0xe74c3c
    );
    await interaction.editReply({ embeds: [errorEmbed] });
  }
}

async function handleCheckCoins(interaction) {
  try {
    const { getUser } = await import('./firebase.js');
    const userData = await getUser(interaction.user.id);
    
    const coinsEmbed = createMilitaryEmbed(
      "💰 SEU PATRIMÔNIO MILITAR",
      `**${interaction.user.tag}, aqui está seu relatório financeiro:**\n\n` +
      `🪙 **Bellos em Caixa:** ${userData.coins.toLocaleString('pt-BR')}\n` +
      `👥 **Recrutas Convocados:** ${userData.invites}\n` +
      `🎖️ **Patente Atual:** ${getMilitaryRank(userData.invites)}\n` +
      `⏰ **Tempo de Serviço:** ${Math.floor(userData.totalTime / 60)} horas\n\n` +
      `💡 **Use \`/catalogo\` para gastar seus Bellos!**`,
      0xF1C40F
    );
    
    await interaction.editReply({ 
      embeds: [coinsEmbed],
      ephemeral: true 
    });
    
  } catch (error) {
    console.error("Erro ao verificar moedas:", error);
    const errorEmbed = createMilitaryEmbed(
      "❌ ERRO AO VERIFICAR MOEDAS",
      "**Não foi possível verificar seu saldo no momento.**\n\nTente usar o comando `/moedas`.",
      0xe74c3c
    );
    await interaction.editReply({ embeds: [errorEmbed] });
  }
}

// ============================================================
// 🎁 SISTEMA DE RECOMPENSAS POR CONVITE
// ============================================================

async function handleInviteRewards(newMember, client) {
  try {
    console.log(`🔍 Analisando convites para: ${newMember.user.tag} (${newMember.id})`);
    
    const guild = newMember.guild;
    
    // Buscar todos os convites do servidor
    const invites = await guild.invites.fetch();
    console.log(`📋 ${invites.size} convites encontrados no servidor`);
    
    // Buscar o cache anterior de convites (se existir)
    const cachedInvites = client.inviteCache || new Map();
    client.inviteCache = new Map();
    
    // Preencher o cache atual
    invites.forEach(invite => {
      client.inviteCache.set(invite.code, invite.uses);
    });
    
    // Comparar com o cache anterior para encontrar quem convidou
    for (const [code, currentUses] of client.inviteCache) {
      const previousUses = cachedInvites.get(code) || 0;
      
      if (currentUses > previousUses) {
        // Este convite foi usado!
        const invite = invites.get(code);
        
        if (invite && invite.inviter && invite.inviter.id !== client.user.id) {
          const inviter = invite.inviter;
          const invited = newMember.user;
          
          console.log(`🎯 Convite detectado: ${inviter.tag} (${inviter.id}) convidou ${invited.tag} (${invited.id})`);
          
          // Importar funções do Firebase
          const { registerInvite, hasUserBeenInvited, forceCreateUser } = await import('./firebase.js');
          
          // Verificar se é um convite válido (não é duplicata)
          const alreadyInvited = await hasUserBeenInvited(invited.id);
          
          if (alreadyInvited) {
            console.log(`🚫 ${invited.tag} já foi convidado antes - ignorando recompensa`);
          } else {
            try {
              // Garantir que o convidador existe no banco
              console.log(`👤 Garantindo que convidador existe: ${inviter.id}`);
              await forceCreateUser(inviter.id);
              
              // Registrar o convite e dar recompensa
              const result = await registerInvite(inviter.id, invited.id);
              
              if (result.success) {
                console.log(`✅ Recompensa de convite dada para: ${inviter.tag}`);
  
                // Atualizar estatística do usuário
                const { addUserInvite } = await import('./firebase.js');
                await addUserInvite(inviter.id);
                
                // 🔥 NOVO: ENVIAR MENSAGEM BONITA NO CANAL "🎮│・bello"
                await sendInviteAnnouncement(guild, inviter, invited, client);
              } else {
                console.log(`❌ Falha no registro do convite: ${result.reason}`);
              }
            } catch (inviteError) {
              console.error(`❌ Erro crítico no processamento do convite:`, inviteError);
            }
          }
        }
        break; // Encontrou o convite usado, pode parar
      }
    }
    
  } catch (error) {
    console.error(`❌ Erro no sistema de convites:`, error);
  }
}

// ============================================================
// 👋 EVENTO: Quando um membro entra no servidor (CORRIGIDO)
// ============================================================
discordBot.on("guildMemberAdd", async (member) => {
  console.log(`🆕 Novo membro entrou: ${member.user.tag} no servidor: ${member.guild.name}`);
  
  // Esperar um pouco para garantir que o membro está completamente carregado
  setTimeout(async () => {
    try {
      // ✅ CORREÇÃO: Apenas atribuir cargo Civis, NÃO Membro Verificado
      const civilAssigned = await assignCivilRole(member);
      
      if (!civilAssigned) {
        console.log(`⚠️ Não foi possível atribuir cargo Civis para: ${member.user.tag}`);
      }

      // ✅ NOVO: SISTEMA DE DETECÇÃO DE CONVITES
      await handleInviteRewards(member, discordBot);

      // ✅ CORREÇÃO: Busca mais flexível do canal de boas-vindas
      const welcomeChannel = member.guild.channels.cache.find(channel => {
        // Verificar se é canal de texto
        if (channel.type !== 0) return false;
        
        // Buscar por vários padrões de nome
        const channelName = channel.name.toLowerCase();
        return (
          channelName.includes("🚪") ||
          channelName.includes("entrada") ||
          channelName.includes("boas-vindas") ||
          channelName.includes("welcome") ||
          channelName.includes("bem-vindo") ||
          channelName === "🚪│・entrada" || // Nome exato
          channelName === "entrada" ||
          channelName === "boas-vindas"
        );
      });

      if (welcomeChannel) {
        // Verificar permissões
        const botPermissions = welcomeChannel.permissionsFor(discordBot.user);
        if (!botPermissions.has(['SendMessages', 'ViewChannel'])) {
          console.log(`❌ Sem permissões no canal ${welcomeChannel.name}`);
          return;
        }

        const welcomeEmbed = createMilitaryEmbed(
          "🎉 NOVO RECRUTA CHEGOU!",
          `**Bem-vindo às Forças Armadas, ${member.user}!**\n\n` +
          `📍 **Identificação:** ${member.user.tag}\n` +
          `🎖️ **Cargo Inicial:** Civis\n` +
          `📅 **Data de Alistamento:** <t:${Math.floor(Date.now() / 1000)}:F>\n\n` +
          `**📝 Próximos Passos:**\n` +
          `• Use \`/manual\` para ver as instruções\n` +
          `• Use \`/conectar\` para verificar sua conta Roblox\n` +
          `• Obedeça às ordens dos superiores!`,
          0x1abc9c,
          [],
          member.user.displayAvatarURL()
        );

        const welcomeRow = new ActionRowBuilder()
          .addComponents(
            new ButtonBuilder()
              .setLabel('📚 Manual de Instruções')
              .setStyle(ButtonStyle.Primary)
              .setCustomId('manual_instructions'),
            new ButtonBuilder()
              .setLabel('🎮 Verificar Conta')
              .setStyle(ButtonStyle.Success)
              .setCustomId('verify_account')
          );

        try {
          await welcomeChannel.send({ 
            content: `🎉 ${member.user} acaba de se alistar!`,
            embeds: [welcomeEmbed],
            components: [welcomeRow]
          });
          console.log(`✅ Mensagem de boas-vindas enviada no canal: ${welcomeChannel.name}`);
        } catch (error) {
          console.error(`❌ Erro ao enviar mensagem de boas-vindas:`, error);
        }
      } else {
        console.log(`❌ Canal de boas-vindas não encontrado no servidor: ${member.guild.name}`);
        console.log(`📋 Tentando encontrar qualquer canal de texto...`);
        
        // Tentar encontrar qualquer canal de texto onde o bot possa enviar mensagens
        const anyTextChannel = member.guild.channels.cache.find(channel => 
          channel.type === 0 && 
          channel.permissionsFor(discordBot.user).has(['SendMessages', 'ViewChannel'])
        );
        
        if (anyTextChannel) {
          console.log(`✅ Usando canal alternativo: ${anyTextChannel.name}`);
          
          const fallbackEmbed = createMilitaryEmbed(
            "🎉 NOVO RECRUTA CHEGOU!",
            `**Bem-vindo às Forças Armadas, ${member.user}!**\n\n` +
            `📍 **Identificação:** ${member.user.tag}\n` +
            `🎖️ **Cargo Inicial:** Civis\n` +
            `📅 **Data de Alistamento:** <t:${Math.floor(Date.now() / 1000)}:F>\n\n` +
            `**📝 Próximos Passos:**\n` +
            `• Use \`/manual\` para ver as instruções\n` +
            `• Use \`/conectar\` para verificar sua conta Roblox\n` +
            `• Obedeça às ordens dos superiores!`,
            0x1abc9c,
            [],
            member.user.displayAvatarURL()
          );

          try {
            await anyTextChannel.send({ 
              content: `🎉 ${member.user} acaba de se alistar!`,
              embeds: [fallbackEmbed]
            });
            console.log(`✅ Mensagem de boas-vindas enviada no canal alternativo: ${anyTextChannel.name}`);
          } catch (error) {
            console.error(`❌ Erro ao enviar mensagem no canal alternativo:`, error);
          }
        } else {
          console.log(`❌ Nenhum canal de texto disponível para enviar mensagem de boas-vindas`);
        }
      }

      // Canal de logs - busca flexível
      const logChannel = member.guild.channels.cache.find(channel =>
        channel.type === 0 && (
          channel.name.toLowerCase().includes("📥│・logs-gerais") ||
          channel.name.toLowerCase().includes("logs") ||
          channel.name.toLowerCase().includes("log") ||
          channel.name.toLowerCase().includes("registro") ||
          channel.name.toLowerCase().includes("📥") ||
          channel.name.toLowerCase().includes("📋")
        )
      );
      
      if (logChannel && logChannel.permissionsFor(discordBot.user).has(['SendMessages', 'ViewChannel'])) {
        const logEmbed = createMilitaryEmbed(
          "📋 NOVO ALISTAMENTO",
          `**Novo recruta chegou ao servidor:**\n\n` +
          `**Usuário:** ${member.user.tag}\n` +
          `**ID:** ${member.user.id}\n` +
          `**Servidor:** ${member.guild.name}\n` +
          `**Cargo Atribuído:** Civis\n` +
          `**Data:** <t:${Math.floor(Date.now() / 1000)}:F>`,
          0x3498db
        );
        
        try {
          await logChannel.send({ embeds: [logEmbed] });
          console.log(`✅ Log de entrada enviado no canal: ${logChannel.name}`);
        } catch (error) {
          console.error(`❌ Erro ao enviar log:`, error);
        }
      } else {
        console.log(`ℹ️ Canal de logs não encontrado ou sem permissões no servidor: ${member.guild.name}`);
      }
    } catch (error) {
      console.error(`❌ Erro no evento guildMemberAdd no servidor ${member.guild.name}:`, error);
    }
  }, 2000); // Aumentei para 2 segundos para garantir que tudo carregou
});

// ============================================================
// 🔧 Funções Globais (exportadas para outros arquivos)
// ============================================================
export async function assignCivilRole(member) {
  try {
    const guild = member.guild;
    
    // Busca flexível pelo cargo Civis
    const civilRole = guild.roles.cache.find(r => 
      r.name === "Civis" || 
      r.name.toLowerCase().includes("civil") ||
      (r.name.toLowerCase().includes("membro") && !r.name.toLowerCase().includes("verificado"))
    );
    
    if (!civilRole) {
      console.warn(`❌ Cargo 'Civis' não encontrado no servidor: ${guild.name}!`);
      return false;
    }

    // Verifica permissões do bot
    if (!guild.members.me.permissions.has(PermissionFlagsBits.ManageRoles)) {
      console.warn(`❌ Bot sem permissão para gerenciar cargos no servidor: ${guild.name}`);
      return false;
    }

    if (civilRole.position >= guild.members.me.roles.highest.position) {
      console.warn(`❌ Cargo Civis está acima do cargo do bot no servidor: ${guild.name}`);
      return false;
    }

    if (member.roles.cache.has(civilRole.id)) {
      return true;
    }

    await member.roles.add(civilRole);
    console.log(`✅ Cargo Civis atribuído automaticamente para: ${member.user.tag} no servidor: ${guild.name}`);
    
    return true;
  } catch (error) {
    console.error(`❌ Erro ao atribuir cargo Civis no servidor ${member.guild.name}:`, error);
    return false;
  }
}

export async function assignVerifiedRole(member) {
  try {
    const guild = member.guild;
    
    // Busca flexível pelo cargo verificado
    const verifiedRole = guild.roles.cache.find(r => 
      r.name === "Membro Verificado" || 
      r.name === "Verificado" ||
      r.name.toLowerCase().includes("verificado") ||
      r.name.toLowerCase().includes("verificada")
    );
    
    if (!verifiedRole) {
      console.warn(`❌ Cargo 'Membro Verificado' não encontrado no servidor: ${guild.name}!`);
      return false;
    }

    // Verifica permissões do bot
    if (!guild.members.me.permissions.has(PermissionFlagsBits.ManageRoles)) {
      console.warn(`❌ Bot sem permissão para gerenciar cargos no servidor: ${guild.name}`);
      return false;
    }

    if (verifiedRole.position >= guild.members.me.roles.highest.position) {
      console.warn(`❌ Cargo Membro Verificado está acima do cargo do bot no servidor: ${guild.name}`);
      return false;
    }

    if (member.roles.cache.has(verifiedRole.id)) {
      return true;
    }

    await member.roles.add(verifiedRole);
    console.log(`✅ Cargo Membro Verificado atribuído para: ${member.user.tag} no servidor: ${guild.name}`);
    
    return true;
  } catch (error) {
    console.error(`❌ Erro ao atribuir cargo Membro Verificado no servidor ${member.guild.name}:`, error);
    return false;
  }
}

export function isUserVerified(member) {
  const verifiedRole = member.roles.cache.find(r => 
    r.name === "Membro Verificado" || 
    r.name === "Verificado" ||
    r.name.toLowerCase().includes("verificado")
  );
  return !!verifiedRole;
}

export function getRobloxUsername(discordId) {
  return robloxUsernames.get(discordId) || null;
}

export async function updateNicknameAndRole(member, shortTag, robloxUsername = null) {
  try {
    const isCivil = shortTag === "N/A" || !shortTag;
    
    // ✅ CORREÇÃO: Priorizar o username do Roblox quando disponível
    const actualRobloxUsername = robloxUsername || getRobloxUsername(member.id);
    
    console.log(`🔍 Debug updateNicknameAndRole:`, {
      member: member.user.tag,
      shortTag,
      robloxUsername,
      storedUsername: getRobloxUsername(member.id),
      actualRobloxUsername
    });

    let finalNickname;
    
    if (isCivil) {
      // Se for civil, usar apenas o username do Discord
      const cleanNickname = member.user.username;
      finalNickname = cleanNickname.length > 32 ? cleanNickname.substring(0, 32) : cleanNickname;
    } else {
      // ✅ CORREÇÃO CRÍTICA: SEMPRE usar o username do Roblox quando disponível
      // Se não tiver username do Roblox, usar o Discord mas logar aviso
      const displayUsername = actualRobloxUsername || member.user.username;
      
      if (!actualRobloxUsername) {
        console.warn(`⚠️ Usando username do Discord (Roblox não encontrado) para: ${member.user.tag}`);
      }
      
      const newNickname = `${shortTag} ${displayUsername}`;
      finalNickname = newNickname.length > 32 ? newNickname.substring(0, 32) : newNickname;
    }

    await member.setNickname(finalNickname);

    // Remover roles antigas
    const roleNames = Object.keys(rankGroups);
    const rolesToRemove = member.roles.cache.filter((r) =>
      roleNames.includes(r.name)
    );
    
    if (rolesToRemove.size > 0) {
      await member.roles.remove(rolesToRemove);
    }

    // Adicionar nova role
    let newRoleName = "Civis";
    for (const [group, tags] of Object.entries(rankGroups)) {
      if (tags.includes(shortTag)) {
        newRoleName = group;
        break;
      }
    }

    const guild = member.guild;
    const newRole = guild.roles.cache.find((r) => r.name === newRoleName);
    
    if (newRole && !member.roles.cache.has(newRole.id)) {
      await member.roles.add(newRole);
    }

    console.log(`✅ Atualizado no servidor ${guild.name}: ${member.user.tag} → ${finalNickname} (${newRoleName})`);
    
    return { 
      newRoleName, 
      finalNickname,
      robloxUsername: actualRobloxUsername 
    };
  } catch (err) {
    console.warn(`Erro ao atualizar nickname/role no servidor ${member.guild.name}:`, err.message);
    throw err;
  }
}

// ============================================================
// 🚀 CONFIGURAÇÕES PARA DEPLOY 24/7
// ============================================================
const server = http.createServer((req, res) => {
  if (req.url === '/health' && req.method === 'GET') {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ 
      status: 'OK', 
      bot: discordBot.user?.tag || 'Starting...',
      commands: discordBot.commands?.size || 0,
      guilds: discordBot.guilds?.cache.size || 0,
      uptime: process.uptime(),
      timestamp: new Date().toISOString()
    }));
  } else {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ 
      message: 'Military Bot API - Multi Guild',
      endpoints: {
        health: 'GET /health'
      }
    }));
  }
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`🟢 Health check server running on port ${PORT}`);
});

// Tratamento de erros
process.on('unhandledRejection', (error) => {
  console.error('❌ Unhandled Promise Rejection:', error);
});

process.on('uncaughtException', (error) => {
  console.error('❌ Uncaught Exception:', error);
});

process.on('SIGTERM', () => {
  console.log('🔄 Received SIGTERM, shutting down gracefully...');
  
  if (discordBot && discordBot.destroy) {
    discordBot.destroy();
    console.log('✅ Bot Discord destroyed');
  }
  
  server.close(() => {
    console.log('✅ HTTP server closed');
    process.exit(0);
  });
});

// ============================================================
// 🔑 LOGIN DO BOT
// ============================================================
console.log('🚀 Starting Military Bot (Multi-Guild)...');
console.log('📋 Intents configuradas: Guilds, GuildMembers, GuildMessages, MessageContent');

discordBot.login(process.env.DISCORD_TOKEN)
  .then(() => {
    console.log(`✅ Bot successfully logged in as ${discordBot.user.tag}`);
    console.log('🌍 Bot agora funciona em múltiplos servidores!');
  })
  .catch((error) => {
    console.error('❌ Failed to login:', error);
    console.log('💡 Dica: Verifique as intents no Discord Developer Portal');
    process.exit(1);
  });