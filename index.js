import "dotenv/config";
import {
  Client,
  GatewayIntentBits,
  REST,
  Routes,
  PermissionFlagsBits,
  EmbedBuilder,
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
} from "discord.js";
import fetch from "node-fetch";

const discordBot = new Client({
  intents: [
    GatewayIntentBits.Guilds, 
    GatewayIntentBits.GuildMembers,
    GatewayIntentBits.GuildPresences
  ],
});

const SERVER_URL = process.env.SERVER_URL;
const GUILD_ID = process.env.GUILD_ID;
const CLIENT_ID = process.env.CLIENT_ID;

// ============================================================
// 📜 Patentes e Cargos Correspondentes
// ============================================================
const rankGroups = {
  Civis: ["N/A"],
  Praças: ["[REC]", "[SLD]"],
  Graduados: ["[CB]", "[T-SGT]", "[S-SGT]", "[P-SGT]", "[S-BTN]"],
  Oficiais: ["[AAO]", "[STN]", "[PTN]", "[CAP]", "[MAJ]", "[TEN-C]", "[COR]"],
  Generais: ["[GEN-B]", "[GEN-D]", "[GEN-E]", "[S-COM]", "[COM]"],
};

const patents = {
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

// ============================================================
// 🗃️ Armazenamento de usernames do Roblox
// ============================================================
const robloxUsernames = new Map(); // Map<discordId, robloxUsername>

// ============================================================
// 🎨 Cores para os Embeds
// ============================================================
const embedColors = {
  SUCCESS: 0x2ecc71,    // Verde
  ERROR: 0xe74c3c,      // Vermelho
  WARNING: 0xf39c12,    // Laranja
  INFO: 0x3498db,       // Azul
  MILITARY: 0x2c3e50,   // Azul militar
  PROMOTION: 0x9b59b6,  // Roxo para promoções
  WELCOME: 0x1abc9c,    // Verde água para boas-vindas
  VERIFIED: 0x00ff00,   // Verde para verificação
};

// ============================================================
// 💬 Registrar Comandos
// ============================================================
const commands = [
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
];

const rest = new REST({ version: "10" }).setToken(process.env.DISCORD_TOKEN);

(async () => {
  try {
    console.log("📦 Registrando comandos...");
    await rest.put(
      Routes.applicationGuildCommands(CLIENT_ID, GUILD_ID),
      { body: commands }
    );
    console.log("✅ Comandos registrados com sucesso!");
  } catch (err) {
    console.error("Erro ao registrar comandos:", err);
  }
})();

// ============================================================
// 🚀 Inicializa o bot
// ============================================================
discordBot.once("ready", () => {
  console.log(`🤖 Bot do Discord logado como ${discordBot.user.tag}`);
  
  // Definir status do bot
  discordBot.user.setActivity("Comandos Militares | /manual", { type: "WATCHING" });
});

// ============================================================
// 🎯 EVENTO: Interações de Botões
// ============================================================
discordBot.on("interactionCreate", async (interaction) => {
  // Se for um comando de chat, já tratamos em outro lugar
  if (interaction.isChatInputCommand()) return;
  
  // Se for uma interação de botão
  if (interaction.isButton()) {
    await interaction.deferReply({ ephemeral: true });
    
    const buttonId = interaction.customId;
    
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
          embedColors.INFO
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
          embedColors.WARNING
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
          embedColors.ERROR
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
// 🎯 Função para criar embed militar
// ============================================================
function createMilitaryEmbed(title, description, color = embedColors.MILITARY, fields = [], thumbnail = null) {
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

// ============================================================
// 🔧 Função para atribuir cargo Civis automaticamente
// ============================================================
async function assignCivilRole(member) {
  try {
    const guild = member.guild;
    const civilRole = guild.roles.cache.find(r => r.name === "Civis");
    
    if (!civilRole) {
      console.warn("❌ Cargo 'Civis' não encontrado no servidor!");
      return false;
    }

    // Verificar se o membro já tem o cargo Civis
    if (member.roles.cache.has(civilRole.id)) {
      return true;
    }

    // Atribuir o cargo Civis
    await member.roles.add(civilRole);
    console.log(`✅ Cargo Civis atribuído automaticamente para: ${member.user.tag}`);
    
    return true;
  } catch (error) {
    console.error("❌ Erro ao atribuir cargo Civis:", error);
    return false;
  }
}

// ============================================================
// ✅ Função para atribuir cargo Membro Verificado
// ============================================================
async function assignVerifiedRole(member) {
  try {
    const guild = member.guild;
    const verifiedRole = guild.roles.cache.find(r => 
      r.name === "Membro Verificado" || r.name === "Verificado"
    );
    
    if (!verifiedRole) {
      console.warn("❌ Cargo 'Membro Verificado' não encontrado no servidor!");
      return false;
    }

    // Verificar se o membro já tem o cargo
    if (member.roles.cache.has(verifiedRole.id)) {
      return true;
    }

    // Atribuir o cargo Membro Verificado
    await member.roles.add(verifiedRole);
    console.log(`✅ Cargo Membro Verificado atribuído para: ${member.user.tag}`);
    
    return true;
  } catch (error) {
    console.error("❌ Erro ao atribuir cargo Membro Verificado:", error);
    return false;
  }
}

// ============================================================
// 🔧 Função para verificar se usuário é verificado
// ============================================================
function isUserVerified(member) {
  const verifiedRole = member.roles.cache.find(r => 
    r.name === "Membro Verificado" || r.name === "Verificado"
  );
  return !!verifiedRole;
}

// ============================================================
// 🔧 Função para obter username do Roblox
// ============================================================
function getRobloxUsername(discordId) {
  return robloxUsernames.get(discordId) || null;
}

// ============================================================
// 🔧 Função para atualizar nickname e cargo (CORRIGIDA)
// ============================================================
async function updateNicknameAndRole(member, shortTag, robloxUsername = null) {
  try {
    const isCivil = shortTag === "N/A" || !shortTag;
    
    // 🔍 Tentar obter o username do Roblox se não foi fornecido
    const actualRobloxUsername = robloxUsername || getRobloxUsername(member.id);
    
    if (isCivil) {
      // Se for Civil: limpar qualquer tag militar e manter apenas o username do Discord
      const cleanNickname = member.user.username;
      const finalNickname = cleanNickname.length > 32 ? cleanNickname.substring(0, 32) : cleanNickname;
      await member.setNickname(finalNickname);
    } else {
      // Se for Militar: usar a tag militar + username do Roblox (se disponível) ou username do Discord
      const displayUsername = actualRobloxUsername || member.user.username;
      const newNickname = `${shortTag} ${displayUsername}`;
      const finalNickname = newNickname.length > 32 ? newNickname.substring(0, 32) : newNickname;
      await member.setNickname(finalNickname);
    }

    // Gerenciar cargos militares
    const roleNames = Object.keys(rankGroups);
    const rolesToRemove = member.roles.cache.filter((r) =>
      roleNames.includes(r.name)
    );
    await member.roles.remove(rolesToRemove);

    let newRoleName = "Civis";
    for (const [group, tags] of Object.entries(rankGroups)) {
      if (tags.includes(shortTag)) {
        newRoleName = group;
        break;
      }
    }

    const guild = member.guild;
    const newRole = guild.roles.cache.find((r) => r.name === newRoleName);
    if (newRole) await member.roles.add(newRole);

    console.log(`✅ Atualizado: ${member.user.tag} → ${member.nickname || member.user.username} (${newRoleName})`);
    return { 
      newRoleName, 
      finalNickname: member.nickname || member.user.username,
      robloxUsername: actualRobloxUsername 
    };
  } catch (err) {
    console.warn("Erro ao atualizar nickname/role:", err.message);
    throw err;
  }
}

// ============================================================
// 👋 EVENTO: Quando um membro entra no servidor
// ============================================================
discordBot.on("guildMemberAdd", async (member) => {
  console.log(`🆕 Novo membro entrou: ${member.user.tag}`);
  
  // Atribuir cargo Civis automaticamente
  const success = await assignCivilRole(member);
  
  // Canal de boas-vindas (opcional)
  const welcomeChannel = member.guild.channels.cache.find(
    channel => channel.name.toLowerCase().includes("boas-vindas") || 
               channel.name.toLowerCase().includes("welcome") ||
               channel.name.toLowerCase().includes("entrada")
  );

  if (welcomeChannel) {
    try {
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
        embedColors.WELCOME,
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

      await welcomeChannel.send({ 
        content: `🎉 ${member.user} acaba de se alistar!`,
        embeds: [welcomeEmbed],
        components: [welcomeRow]
      });
    } catch (error) {
      console.error("❌ Erro ao enviar mensagem de boas-vindas:", error);
    }
  }

  // Canal de logs
  const logChannel = member.guild.channels.cache.find(
    c => c.name.toLowerCase() === "logs"
  );
  
  if (logChannel && success) {
    const logEmbed = createMilitaryEmbed(
      "📋 NOVO ALISTAMENTO",
      `**Novo recruta chegou ao servidor:**\n\n` +
      `**Usuário:** ${member.user.tag}\n` +
      `**ID:** ${member.user.id}\n` +
      `**Cargo Atribuído:** Civis\n` +
      `**Data:** <t:${Math.floor(Date.now() / 1000)}:F>`,
      embedColors.INFO
    );
    
    await logChannel.send({ embeds: [logEmbed] });
  }
});

// ============================================================
// 🧠 Interações (Comandos)
// ============================================================
discordBot.on("interactionCreate", async (interaction) => {
  if (!interaction.isChatInputCommand()) return;
  const { commandName } = interaction;

  // ========================================================
  // /conectar
  // ========================================================
  if (commandName === "conectar") {
    const code = interaction.options.getString("codigo");
    await interaction.deferReply({ ephemeral: true });

    try {
      const loadingEmbed = createMilitaryEmbed(
        "VERIFICAÇÃO EM ANDAMENTO",
        "🔍 **Processando sua verificação...**\n\n⏳ Aguarde enquanto validamos suas credenciais.",
        embedColors.INFO
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
          embedColors.ERROR
        );
        return interaction.editReply({ embeds: [errorEmbed] });
      }

      const guild = await discordBot.guilds.fetch(GUILD_ID);
      const member = await guild.members.fetch(interaction.user.id);

      let shortTag;
      if (data.shortTag) {
        shortTag = data.shortTag;
      } else if (data.patent) {
        shortTag = data.patent.split(" ")[0];
      } else {
        shortTag = "";
      }

      const username = data.username;
      
      // 💾 SALVAR USERNAME DO ROBLOX PARA USO FUTURO
      if (username) {
        robloxUsernames.set(interaction.user.id, username);
        console.log(`💾 Username do Roblox salvo: ${interaction.user.id} → ${username}`);
      }

      const { newRoleName, finalNickname, robloxUsername } = await updateNicknameAndRole(member, shortTag, username);

      // ✅ Atribuir cargo Membro Verificado após verificação bem-sucedida
      const verifiedAssigned = await assignVerifiedRole(member);

      const successEmbed = createMilitaryEmbed(
        "VERIFICAÇÃO CONCLUÍDA",
        `✅ **Verificação militar concluída com sucesso!**\n\n🎯 Suas credenciais foram validadas e seu perfil foi atualizado.`,
        embedColors.SUCCESS,
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

      // Canal de logs
      const logChannel = guild.channels.cache.find(
        (c) => c.name.toLowerCase() === "logs"
      );
      if (logChannel) {
        const logEmbed = createMilitaryEmbed(
          "NOVA VERIFICAÇÃO",
          `**Soldado verificado:** ${member.user.tag}\n**Identificação:** ${finalNickname}\n**Roblox:** ${robloxUsername || username}\n**Cargo:** ${newRoleName}\n**Status:** ${verifiedAssigned ? "Verificado" : "Pendente"}`,
          embedColors.VERIFIED
        );
        logChannel.send({ embeds: [logEmbed] });
      }

      return interaction.editReply({ embeds: [successEmbed] });
    } catch (err) {
      console.error("Erro ao verificar:", err);
      const errorEmbed = createMilitaryEmbed(
        "ERRO INTERNO",
        "❌ **Ocorreu um erro interno durante a verificação.**\n\n📞 Contate o comando imediatamente.",
        embedColors.ERROR
      );
      return interaction.editReply({ embeds: [errorEmbed] });
    }
  }

  // ========================================================
  // /atualizar
  // ========================================================
  if (commandName === "atualizar") {
    if (!interaction.member.permissions.has(PermissionFlagsBits.Administrator)) {
      const deniedEmbed = createMilitaryEmbed(
        "ACESSO NEGADO",
        "🚫 **Permissão insuficiente!**\n\nApenas oficiais autorizados podem executar este comando.",
        embedColors.ERROR
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
        embedColors.ERROR
      );
      return interaction.reply({ embeds: [errorEmbed], ephemeral: true });
    }

    await interaction.deferReply({ ephemeral: true });

    try {
      const newTag = newTagFull.split(" ")[0];
      const guild = await discordBot.guilds.fetch(GUILD_ID);
      const member = await guild.members.fetch(target.id);

      // ✅ VERIFICAR SE O USUÁRIO É MEMBRO VERIFICADO
      if (!isUserVerified(member)) {
        const notVerifiedEmbed = createMilitaryEmbed(
          "USUÁRIO NÃO VERIFICADO",
          `❌ **O usuário ${target.tag} não está verificado!**\n\n` +
          `📋 **Pré-requisito necessário:**\n` +
          `• O usuário deve usar \`/conectar\` primeiro\n` +
          `• Deve ter o cargo "Membro Verificado"\n` +
          `• Apenas usuários verificados podem receber patentes militares`,
          embedColors.ERROR
        );
        return interaction.editReply({ embeds: [notVerifiedEmbed] });
      }

      // 🔍 OBTER USERNAME DO ROBLOX SALVO
      const robloxUsername = getRobloxUsername(target.id);
      
      if (!robloxUsername) {
        const noUsernameEmbed = createMilitaryEmbed(
          "USERNAME NÃO ENCONTRADO",
          `❌ **Não foi possível encontrar o username do Roblox para ${target.tag}!**\n\n` +
          `📋 **Solução:**\n` +
          `• O usuário deve usar \`/conectar\` novamente\n` +
          `• Isso irá registrar o username do Roblox corretamente\n` +
          `• Ou contate um desenvolvedor do sistema`,
          embedColors.ERROR
        );
        return interaction.editReply({ embeds: [noUsernameEmbed] });
      }

      const { newRoleName, finalNickname } = await updateNicknameAndRole(member, newTag, robloxUsername);

      const successEmbed = createMilitaryEmbed(
        "ATUALIZAÇÃO CONCLUÍDA",
        `⚡ **Atualização militar realizada com sucesso!**\n\nO perfil do soldado foi atualizado conforme ordens superiores.`,
        embedColors.PROMOTION,
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

      // Canal de logs
      const logChannel = guild.channels.cache.find(
        (c) => c.name.toLowerCase() === "logs"
      );
      if (logChannel) {
        const logEmbed = createMilitaryEmbed(
          "ATUALIZAÇÃO DE PATENTE",
          `**Soldado:** ${target.tag}\n**Roblox:** ${robloxUsername}\n**Nova patente:** ${newTagFull}\n**Identificação:** ${finalNickname}\n**Executado por:** ${interaction.user.tag}`,
          embedColors.WARNING
        );
        logChannel.send({ embeds: [logEmbed] });
      }

      return interaction.editReply({ embeds: [successEmbed] });
    } catch (err) {
      console.error("Erro ao atualizar:", err);
      const errorEmbed = createMilitaryEmbed(
        "ERRO NA ATUALIZAÇÃO",
        "❌ **Falha ao atualizar o soldado.**\n\nVerifique as permissões e tente novamente.",
        embedColors.ERROR
      );
      return interaction.editReply({ embeds: [errorEmbed] });
    }
  }

  // ========================================================
  // /patentes
  // ========================================================
  if (commandName === "patentes") {
    const patentesEmbed = createMilitaryEmbed(
      "📊 LISTA DE PATENTES MILITARES",
      "**Hierarquia completa das forças armadas:**\n\nCada patente representa um degrau na carreira militar."
    );

    // Adicionar grupos de patentes
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

  // ========================================================
  // /manual
  // ========================================================
  if (commandName === "manual") {
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
      ephemeral: true 
    });
  }
});

// ============================================================
// 🔑 Login
// ============================================================
// ============================================================
// 🚀 CONFIGURAÇÕES PARA DEPLOY 24/7 NO RENDER
// ============================================================

import http from 'http';

// Health check server para o Render
const server = http.createServer((req, res) => {
  if (req.url === '/health' && req.method === 'GET') {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ 
      status: 'OK', 
      bot: discordBot.user?.tag || 'Starting...',
      uptime: process.uptime(),
      timestamp: new Date().toISOString()
    }));
  } else {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ 
      message: 'Military Bot API',
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

// Tratamento de erros para evitar crashes
process.on('unhandledRejection', (error) => {
  console.error('❌ Unhandled Promise Rejection:', error);
});

process.on('uncaughtException', (error) => {
  console.error('❌ Uncaught Exception:', error);
});

// Graceful shutdown - importante para o Render
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
// 🌐 Keep-Alive Ping — evita que o Render desligue o servidor
// ============================================================
const express = require("express");
const app = express();

app.get("/ping", (req, res) => {
  res.status(200).send("pong");
});

app.listen(PORT, () => {
  console.log(`💓 KeepAlive ativo na porta ${PORT}`);
});

// ============================================================
// 🔑 LOGIN DO BOT (SEU CÓDIGO ORIGINAL - MANTENHA)
// ============================================================
console.log('🚀 Starting Military Bot...');

discordBot.login(process.env.DISCORD_TOKEN)
  .then(() => {
    console.log(`✅ Bot successfully logged in as ${discordBot.user.tag}`);
    console.log('🎯 Bot is now online 24/7!');
  })
  .catch((error) => {
    console.error('❌ Failed to login:', error);
    process.exit(1);
  });
