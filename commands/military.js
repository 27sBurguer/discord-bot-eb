import { PermissionFlagsBits } from "discord.js";
import { 
  robloxUsernames, 
  patents, 
  rankGroups, 
  assignVerifiedRole, 
  isUserVerified, 
  getRobloxUsername, 
  updateNicknameAndRole 
} from '../index.js';
import { createMilitaryEmbed } from '../utils/embeds.js';
import fetch from 'node-fetch';

const SERVER_URL = process.env.SERVER_URL;

export const commands = [
  {
    name: "conectar",
    description: "🎖️ Verifica sua conta Roblox usando um código gerado no jogo",
    options: [
      {
        name: "codigo",
        type: 3,
        description: "🔢 Código gerado no Roblox",
        required: true,
      },
    ],
  },
  {
    name: "atualizar",
    description: "⚡ Atualiza a patente e nick de um usuário (Apenas Administradores)",
    default_member_permissions: PermissionFlagsBits.Administrator.toString(),
    options: [
      {
        name: "usuario",
        type: 6, // USER
        description: "🎯 Usuário que será atualizado",
        required: true,
      },
      {
        name: "patente",
        type: 4, // INTEGER
        description: "🎖️ Número da patente (1-20)",
        required: true,
        choices: [
          { name: "🟡 Civil (N/A)", value: 1 },
          { name: "🟢 [REC] Recruta", value: 2 },
          { name: "🟢 [SLD] Soldado", value: 3 },
          { name: "🔵 [CB] Cabo", value: 4 },
          { name: "🔵 [T-SGT] Terceiro-Sargento", value: 5 },
          { name: "🔵 [S-SGT] Segundo-Sargento", value: 6 },
          { name: "🔵 [P-SGT] Primeiro-Sargento", value: 7 },
          { name: "🔵 [S-BTN] Sub-Tenente", value: 8 },
          { name: "🔴 [AAO] Aspirante-Á-Oficial", value: 9 },
          { name: "🔴 [STN] Segundo-Tenente", value: 10 },
          { name: "🔴 [PTN] Primeiro-Tenente", value: 11 },
          { name: "🔴 [CAP] Capitão", value: 12 },
          { name: "🔴 [MAJ] Major", value: 13 },
          { name: "🔴 [TEN-C] Tenente-Coronel", value: 14 },
          { name: "🔴 [COR] Coronel", value: 15 },
          { name: "🟣 [GEN-B] General-De-Brigada", value: 16 },
          { name: "🟣 [GEN-D] General-De-Divisão", value: 17 },
          { name: "🟣 [GEN-E] General-De-Exército", value: 18 },
          { name: "🟣 [S-COM] Sub-Comandante", value: 19 },
          { name: "🟣 [COM] Comandante", value: 20 },
        ],
      },
    ],
  },
  {
    name: "patentes",
    description: "📊 Lista todas as patentes disponíveis no sistema",
  },
  {
    name: "manual",
    description: "📚 Manual de instruções para verificação de conta",
  },
  {
    name: "debug_user",
    description: "🔧 Debug: Ver informações do usuário (Apenas Administradores)",
    default_member_permissions: PermissionFlagsBits.Administrator.toString(),
    options: [
      {
        name: "usuario",
        type: 6,
        description: "🎯 Usuário para debug",
        required: true,
      },
    ],
  },
];

export async function execute(interaction, client) {
  const { commandName } = interaction;

  if (commandName === "conectar") {
    await handleConectar(interaction, client);
  } else if (commandName === "atualizar") {
    await handleAtualizar(interaction, client);
  } else if (commandName === "patentes") {
    await handlePatentes(interaction);
  } else if (commandName === "manual") {
    await handleManual(interaction);
  } else if (commandName === "debug_user") {
    await handleDebugUser(interaction);
  }
}

async function handleConectar(interaction, client) {
  const code = interaction.options.getString("codigo");
  await interaction.deferReply({ ephemeral: false });

  try {
    const loadingEmbed = createMilitaryEmbed(
      "VERIFICAÇÃO EM ANDAMENTO",
      "🔍 **Processando sua verificação...**\n\n⏳ Aguarde enquanto validamos suas credenciais.",
      0x3498db
    );
    await interaction.editReply({ embeds: [loadingEmbed] });

    const response = await fetch(`${SERVER_URL}/api/check-code`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        code,
        discordId: interaction.user.id,
      }),
    });

    const data = await response.json();
    if (!response.ok) {
      const errorEmbed = createMilitaryEmbed(
        "FALHA NA VERIFICAÇÃO",
        `❌ **Erro durante a verificação:**\n\`${data.error || "Erro desconhecido"}\`\n\n📞 Caso o problema persista, contate o comando.`,
        0xe74c3c
      );
      return interaction.editReply({ embeds: [errorEmbed] });
    }

    // ✅ USAR O GUILD DA INTERAÇÃO ATUAL
    const guild = interaction.guild;
    const member = interaction.member;

    let shortTag;
    if (data.shortTag) {
      shortTag = data.shortTag;
    } else if (data.patent) {
      shortTag = data.patent.split(" ")[0];
    } else {
      shortTag = "";
    }

    const username = data.username;
    
    if (username) {
      robloxUsernames.set(interaction.user.id, username);
      console.log(`💾 Username do Roblox salvo: ${interaction.user.id} → ${username}`);
    }

    const { newRoleName, finalNickname, robloxUsername } = await updateNicknameAndRole(member, shortTag, username);

    // ✅ CORREÇÃO: Apenas atribuir Membro Verificado se a verificação for bem-sucedida
    const verifiedAssigned = await assignVerifiedRole(member);

    const successEmbed = createMilitaryEmbed(
      "VERIFICAÇÃO CONCLUÍDA",
      `✅ **Verificação militar concluída com sucesso!**\n\n🎯 Suas credenciais foram validadas e seu perfil foi atualizado.`,
      0x2ecc71,
      [
        { name: "🔹 Identificação", value: `\`${finalNickname}\``, inline: true },
        { name: "🔹 Patente", value: `\`${shortTag}\``, inline: true },
        { name: "🔹 Cargo", value: `\`${newRoleName}\``, inline: true },
        { name: "🎮 Roblox", value: `\`${robloxUsername || username}\``, inline: true },
        { name: "✅ Status", value: verifiedAssigned ? "`Verificado`" : "`Pendente`", inline: true },
        { name: "🔹 Data", value: `<t:${Math.floor(Date.now() / 1000)}:F>`, inline: false },
      ],
      member.user.displayAvatarURL()
    );

    // ✅ CANAL DE LOGS FLEXÍVEL
    const logChannel = guild.channels.cache.find(channel =>
      channel.name.toLowerCase().includes("📥│・logs-gerais")
    );
    
    if (logChannel && logChannel.permissionsFor(guild.members.me).has(['SendMessages', 'ViewChannel'])) {
      const logEmbed = createMilitaryEmbed(
        "NOVA VERIFICAÇÃO",
        `**Soldado verificado no servidor ${guild.name}:**\n` +
        `**Usuário:** ${member.user.tag}\n` +
        `**Identificação:** ${finalNickname}\n` +
        `**Roblox:** ${robloxUsername || username}\n` +
        `**Cargo:** ${newRoleName}\n` +
        `**Status:** ${verifiedAssigned ? "Verificado" : "Pendente"}`,
        0x00ff00
      );
      await logChannel.send({ embeds: [logEmbed] });
    }

    return interaction.editReply({ embeds: [successEmbed] });
  } catch (err) {
    console.error("Erro ao verificar:", err);
    const errorEmbed = createMilitaryEmbed(
      "ERRO INTERNO",
      "❌ **Ocorreu um erro interno durante a verificação.**\n\n📞 Contate o comando imediatamente.",
      0xe74c3c
    );
    return interaction.editReply({ embeds: [errorEmbed] });
  }
}

async function handleAtualizar(interaction, client) {
  if (!interaction.member.permissions.has(PermissionFlagsBits.Administrator)) {
    const deniedEmbed = createMilitaryEmbed(
      "ACESSO NEGADO",
      "🚫 **Permissão insuficiente!**\n\nApenas oficiais autorizados podem executar este comando.",
      0xe74c3c
    );
    return interaction.reply({ embeds: [deniedEmbed], ephemeral: true });
  }

  const target = interaction.options.getUser("usuario");
  const patenteNumber = interaction.options.getInteger("patente");
  const newTagFull = patents[patenteNumber];

  if (!newTagFull) {
    const errorEmbed = createMilitaryEmbed(
      "PATENTE INVÁLIDA",
      "❌ **Número de patente inválido!**\n\nUse `/patentes` para ver a lista completa.",
      0xe74c3c
    );
    return interaction.reply({ embeds: [errorEmbed], ephemeral: true });
  }

  await interaction.deferReply({ ephemeral: false });

  try {
    const newTag = newTagFull.split(" ")[0];
    
    // ✅ USAR O GUILD DA INTERAÇÃO ATUAL
    const guild = interaction.guild;
    const member = await guild.members.fetch(target.id);

    // ✅ DEBUG: Verificar dados do usuário
    console.log(`🔍 Debug /atualizar:`, {
      target: target.tag,
      targetId: target.id,
      patente: newTagFull,
      storedRobloxUsername: getRobloxUsername(target.id),
      memberNickname: member.nickname,
      memberUsername: member.user.username
    });

    if (!isUserVerified(member)) {
      const notVerifiedEmbed = createMilitaryEmbed(
        "USUÁRIO NÃO VERIFICADO",
        `❌ **O usuário ${target.tag} não está verificado!**\n\n` +
        `📋 **Pré-requisito necessário:**\n` +
        `• O usuário deve usar \`/conectar\` primeiro\n` +
        `• Deve ter o cargo "Membro Verificado"\n` +
        `• Apenas usuários verificados podem receber patentes militares`,
        0xe74c3c
      );
      return interaction.editReply({ embeds: [notVerifiedEmbed] });
    }

    const robloxUsername = getRobloxUsername(target.id);
    
    if (!robloxUsername) {
      const noUsernameEmbed = createMilitaryEmbed(
        "USERNAME NÃO ENCONTRADO",
        `❌ **Não foi possível encontrar o username do Roblox para ${target.tag}!**\n\n` +
        `📋 **Solução:**\n` +
        `• O usuário deve usar \`/conectar\` novamente\n` +
        `• Isso irá registrar o username do Roblox corretamente\n` +
        `• Ou contate um desenvolvedor do sistema`,
        0xe74c3c
      );
      return interaction.editReply({ embeds: [noUsernameEmbed] });
    }

    // ✅ FORÇAR o uso do username do Roblox
    console.log(`🎯 Atualizando com username do Roblox: ${robloxUsername}`);
    
    const { newRoleName, finalNickname } = await updateNicknameAndRole(member, newTag, robloxUsername);

    const successEmbed = createMilitaryEmbed(
      "ATUALIZAÇÃO CONCLUÍDA",
      `⚡ **Atualização militar realizada com sucesso!**\n\nO perfil do soldado foi atualizado conforme ordens superiores.`,
      0x9b59b6,
      [
        { name: "🎯 Soldado", value: `${target.tag}`, inline: true },
        { name: "🎖️ Nova Patente", value: `\`${newTagFull}\``, inline: true },
        { name: "🔹 Identificação", value: `\`${finalNickname}\``, inline: true },
        { name: "🎮 Roblox", value: `\`${robloxUsername}\``, inline: true },
        { name: "⚡ Executado por", value: `${interaction.user.tag}`, inline: true },
        { name: "✅ Status", value: "`Verificado`", inline: true },
        { name: "📅 Data/Hora", value: `<t:${Math.floor(Date.now() / 1000)}:F>`, inline: false },
      ],
      target.displayAvatarURL()
    );

    // ✅ CANAL DE LOGS FLEXÍVEL
    const logChannel = guild.channels.cache.find(channel =>
      channel.name.toLowerCase().includes("📥│・logs-gerais")
    );
    
    if (logChannel && logChannel.permissionsFor(guild.members.me).has(['SendMessages', 'ViewChannel'])) {
      const logEmbed = createMilitaryEmbed(
        "ATUALIZAÇÃO DE PATENTE",
        `**Servidor:** ${guild.name}\n` +
        `**Soldado:** ${target.tag}\n` +
        `**Roblox:** ${robloxUsername}\n` +
        `**Nova patente:** ${newTagFull}\n` +
        `**Identificação:** ${finalNickname}\n` +
        `**Executado por:** ${interaction.user.tag}`,
        0xf39c12
      );
      await logChannel.send({ embeds: [logEmbed] });
    }

    return interaction.editReply({ embeds: [successEmbed] });
  } catch (err) {
    console.error("Erro ao atualizar:", err);
    const errorEmbed = createMilitaryEmbed(
      "ERRO NA ATUALIZAÇÃO",
      "❌ **Falha ao atualizar o soldado.**\n\nVerifique as permissões e tente novamente.",
      0xe74c3c
    );
    return interaction.editReply({ embeds: [errorEmbed] });
  }
}

async function handlePatentes(interaction) {
  const patentesEmbed = createMilitaryEmbed(
    "📊 LISTA DE PATENTES MILITARES",
    "**Hierarquia completa das forças armadas:**\n\nCada patente representa um degrau na carreira militar."
  );

  Object.entries(rankGroups).forEach(([group, tags]) => {
    const patentesList = tags.map(tag => {
      const patenteInfo = Object.entries(patents).find(([key, value]) => value.startsWith(tag));
      return patenteInfo ? `• ${patenteInfo[1]}` : `• ${tag}`;
    }).join('\n');

    patentesEmbed.addFields({
      name: `🔹 ${group}`,
      value: patentesList,
      inline: true
    });
  });

  patentesEmbed.addFields({
    name: "📝 INSTRUÇÕES",
    value: "• Use `/conectar <código>` para verificar sua conta\n• Use `/manual` para ajuda detalhada\n• **Pré-requisito:** Cargo 'Membro Verificado'",
    inline: false
  });

  await interaction.reply({ embeds: [patentesEmbed], ephemeral: true });
}

async function handleManual(interaction) {
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

  const { ActionRowBuilder, ButtonBuilder, ButtonStyle } = await import('discord.js');
  const row = new ActionRowBuilder()
    .addComponents(
      new ButtonBuilder()
        .setLabel('🎮 Jogar Roblox')
        .setStyle(ButtonStyle.Link)
        .setURL('https://www.roblox.com/games/4753194980/NOVO-EB-Ex-rcito-Brasileiro'),
    );

  await interaction.reply({ 
    embeds: [manualEmbed], 
    components: [row],
    ephemeral: false
  });
}

async function handleDebugUser(interaction) {
  if (!interaction.member.permissions.has(PermissionFlagsBits.Administrator)) {
    return interaction.reply({ content: "❌ Acesso negado.", ephemeral: true });
  }

  const target = interaction.options.getUser("usuario");
  const robloxUsername = getRobloxUsername(target.id);
  
  const debugEmbed = createMilitaryEmbed(
    "🔧 DEBUG USER INFO",
    `**Informações do usuário ${target.tag}:**`,
    0x3498db,
    [
      { name: "🆔 Discord ID", value: `\`${target.id}\``, inline: true },
      { name: "📛 Discord Tag", value: `\`${target.tag}\``, inline: true },
      { name: "🎮 Roblox Username", value: robloxUsername ? `\`${robloxUsername}\`` : "`Não encontrado`", inline: true },
      { name: "💾 Storage Key", value: `\`${target.id}\``, inline: true },
      { name: "📊 Total Saved", value: `\`${robloxUsernames.size} usuários\``, inline: true },
    ]
  );

  await interaction.reply({ embeds: [debugEmbed], ephemeral: true });
}