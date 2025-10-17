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
} from "discord.js";
import http from 'http';
import fetch from 'node-fetch';

// Importar comandos
import * as militaryCommands from './commands/military.js';
import * as utilityCommands from './commands/utility.js';
import * as adminCommands from './commands/admin.js';
import * as eventCommands from './commands/events.js'; // ✅ NOVO

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
  ...eventCommands.commands // ✅ NOVO
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
    await interaction.deferReply({ ephemeral: true });
    
    const buttonId = interaction.customId;
    
    switch (buttonId) {
      case 'manual_instructions':
        const manualEmbed = createMilitaryEmbed(
          "📚 MANUAL DE INSTRUÇões",
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
});

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