import { PermissionFlagsBits } from "discord.js";
import { createMilitaryEmbed } from '../utils/embeds.js';
import { getUser, updateUserCoins, getLeaderboard } from '../firebase.js';

export const commands = [
  {
    name: "moedas",
    description: "💰 Mostra suas moedas ou de outro usuário",
    options: [
      {
        name: "usuario",
        type: 6,
        description: "👤 Usuário para ver moedas",
        required: false
      }
    ]
  },
  {
    name: "leaderboard",
    description: "🏆 Mostra o ranking de moedas"
  },
  {
    name: "transferir",
    description: "🔄 Transferir moedas para outro usuário",
    options: [
      {
        name: "usuario",
        type: 6,
        description: "👤 Usuário que receberá as moedas",
        required: true
      },
      {
        name: "quantidade",
        type: 4,
        description: "🔢 Quantidade de moedas para transferir",
        required: true,
        min_value: 1
      }
    ]
  }
  // Apenas Administrador
  /*
  {
    name: "darmoedas",
    description: "🎁 Dar moedas para um usuário (Apenas Administradores)",
    default_member_permissions: PermissionFlagsBits.Administrator.toString(),
    options: [
      {
        name: "usuario",
        type: 6,
        description: "👤 Usuário que receberá as moedas",
        required: true
      },
      {
        name: "quantidade",
        type: 4, // INTEGER
        description: "🔢 Quantidade de moedas",
        required: true,
        min_value: 1
      }
    ]
  },
  {
    name: "removermoedas",
    description: "❌ Remover moedas de um usuário (Apenas Administradores)",
    default_member_permissions: PermissionFlagsBits.Administrator.toString(),
    options: [
      {
        name: "usuario",
        type: 6,
        description: "👤 Usuário que perderá as moedas",
        required: true
      },
      {
        name: "quantidade",
        type: 4,
        description: "🔢 Quantidade de moedas",
        required: true,
        min_value: 1
      }
    ]
  },
  */
];

export async function execute(interaction, client) {
  const { commandName } = interaction;

  switch (commandName) {
    case "transferir":
      await handleTransferir(interaction, client);
      break;
    case "moedas":
      await handleMoedas(interaction, client);
      break;
    case "leaderboard":
      await handleLeaderboard(interaction, client);
      break;
    case "darmoedas":
      await handleDarMoedas(interaction, client);
      break;
    case "removermoedas":
      await handleRemoverMoedas(interaction, client);
      break;
  }
}

// ============================================================
// 🔄 COMANDO: /transferir
// ============================================================

async function handleTransferir(interaction, client) {
  const targetUser = interaction.options.getUser("usuario");
  const quantidade = interaction.options.getInteger("quantidade");

  await interaction.deferReply({ ephemeral: false });

  // Verificações iniciais
  if (targetUser.id === interaction.user.id) {
    const errorEmbed = createMilitaryEmbed(
      "❌ TRANSFERÊNCIA INVÁLIDA",
      "**Você não pode transferir moedas para si mesmo!**\n\nTente transferir para outro usuário.",
      0xe74c3c
    );
    return interaction.editReply({ embeds: [errorEmbed] });
  }

  if (targetUser.bot) {
    const errorEmbed = createMilitaryEmbed(
      "❌ DESTINATÁRIO INVÁLIDO",
      "**Você não pode transferir moedas para bots!**\n\nTente transferir para um usuário real.",
      0xe74c3c
    );
    return interaction.editReply({ embeds: [errorEmbed] });
  }

  try {
    // Buscar dados do remetente
    const senderData = await getUser(interaction.user.id);
    
    // Verificar se o remetente tem moedas suficientes
    if (senderData.coins < quantidade) {
      const errorEmbed = createMilitaryEmbed(
        "❌ SALDO INSUFICIENTE",
        `**Você não tem moedas suficientes para esta transferência!**\n\n` +
        `💰 **Seu saldo:** ${senderData.coins.toLocaleString('pt-BR')} Bellos\n` +
        `💸 **Transferência solicitada:** ${quantidade.toLocaleString('pt-BR')} Bellos\n` +
        `📉 **Faltam:** ${(quantidade - senderData.coins).toLocaleString('pt-BR')} Bellos`,
        0xe74c3c
      );
      return interaction.editReply({ embeds: [errorEmbed] });
    }

    // Buscar dados do destinatário (para criar se não existir)
    const receiverData = await getUser(targetUser.id);

    // Realizar a transferência
    // Remover do remetente
    await updateUserCoins(interaction.user.id, -quantidade);
    // Adicionar ao destinatário
    await updateUserCoins(targetUser.id, quantidade);

    const successEmbed = createMilitaryEmbed(
      "✅ TRANSFERÊNCIA REALIZADA!",
      `**Transferência de ${quantidade.toLocaleString('pt-BR')} Bellos realizada com sucesso!**\n\n` +
      `👤 **De:** ${interaction.user.tag}\n` +
      `🎯 **Para:** ${targetUser.tag}\n` +
      `💰 **Valor:** ${quantidade.toLocaleString('pt-BR')} Bellos\n` +
      `📊 **Seu saldo agora:** ${(senderData.coins - quantidade).toLocaleString('pt-BR')} Bellos\n` +
      `📈 **Saldo do destinatário:** ${(receiverData.coins + quantidade).toLocaleString('pt-BR')} Bellos`,
      0x2ecc71
    );

    successEmbed.setFooter({ 
      text: `Transferência realizada • ${new Date().toLocaleString('pt-BR')}`,
      iconURL: interaction.user.displayAvatarURL()
    });

    await interaction.editReply({ embeds: [successEmbed] });

    // Tentar notificar o destinatário
    try {
      const notifyEmbed = createMilitaryEmbed(
        "🎁 VOCÊ RECEBEU BELLOS!",
        `**${interaction.user.tag} transferiu moedas para você!**\n\n` +
        `💰 **Valor recebido:** ${quantidade.toLocaleString('pt-BR')} Bellos\n` +
        `📈 **Seu saldo agora:** ${(receiverData.coins + quantidade).toLocaleString('pt-BR')} Bellos\n` +
        `💬 **Mensagem do remetente:** "Aproveite os Bellos!"\n\n` +
        `✨ Use \`/catalogo\` para gastar suas moedas!`,
        0xF1C40F
      );

      await targetUser.send({ embeds: [notifyEmbed] });
    } catch (dmError) {
      console.log(`Não foi possível enviar DM para ${targetUser.tag}`);
      // Não é crítico se não conseguir enviar DM
    }

    // Log da transferência
    try {
      const logChannel = interaction.guild.channels.cache.find(channel => 
        channel.name.toLowerCase().includes("logs") || 
        channel.name.toLowerCase().includes("📥") ||
        channel.name.toLowerCase().includes("economia")
      );
      
      if (logChannel) {
        const logEmbed = createMilitaryEmbed(
          "🔄 TRANSFERÊNCIA DE MOEDAS",
          `**Nova transferência realizada:**\n\n` +
          `👤 **De:** ${interaction.user.tag} (${interaction.user.id})\n` +
          `🎯 **Para:** ${targetUser.tag} (${targetUser.id})\n` +
          `💰 **Valor:** ${quantidade.toLocaleString('pt-BR')} Bellos\n` +
          `⏰ **Data:** <t:${Math.floor(Date.now() / 1000)}:F>`,
          0x3498db
        );
        await logChannel.send({ embeds: [logEmbed] });
      }
    } catch (logError) {
      console.log("Não foi possível enviar log:", logError.message);
    }

  } catch (error) {
    console.error("Erro no comando /transferir:", error);
    const errorEmbed = createMilitaryEmbed(
      "❌ ERRO NA TRANSFERÊNCIA",
      "**Ocorreu um erro ao realizar a transferência.**\n\n" +
      "Verifique os dados e tente novamente. Se o problema persistir, contate um administrador.",
      0xe74c3c
    );
    await interaction.editReply({ embeds: [errorEmbed] });
  }
}

// ============================================================
// 💰 COMANDO: /moedas
// ============================================================

async function handleMoedas(interaction, client) {
  const targetUser = interaction.options.getUser("usuario") || interaction.user;
  
  await interaction.deferReply({ ephemeral: false });

  try {
    const userData = await getUser(targetUser.id);
    
    const moedasEmbed = createMilitaryEmbed(
      "💰 SALDO DE MOEDAS",
      `**Informações de ${targetUser.tag}:**`,
      0xF1C40F // Amarelo ouro
    );

    moedasEmbed.addFields(
      {
        name: "🪙 MOEDAS ATUAIS",
        value: `**${userData.coins.toLocaleString('pt-BR')} Bellos**`,
        inline: true
      },
      {
        name: "👥 CONVITES",
        value: `**${userData.invites} convites**`,
        inline: true
      },
      {
        name: "⏰ TEMPO NO SERVIDOR",
        value: `**${Math.floor(userData.totalTime / 60)} horas**`,
        inline: true
      },
      {
        name: "📅 DATA DE ENTRADA",
        value: `<t:${Math.floor(new Date(userData.joinedAt).getTime() / 1000)}:R>`,
        inline: false
      }
    );

    moedasEmbed.setThumbnail(targetUser.displayAvatarURL({ size: 256 }));
    
    await interaction.editReply({ embeds: [moedasEmbed] });

  } catch (error) {
    console.error("Erro no comando /moedas:", error);
    const errorEmbed = createMilitaryEmbed(
      "❌ ERRO",
      "**Ocorreu um erro ao buscar suas moedas.**\n\nTente novamente em alguns instantes.",
      0xe74c3c
    );
    await interaction.editReply({ embeds: [errorEmbed] });
  }
}

// ============================================================
// 🏆 COMANDO: /leaderboard
// ============================================================

async function handleLeaderboard(interaction, client) {
  await interaction.deferReply({ ephemeral: false });

  try {
    const leaderboard = await getLeaderboard(10);
    
    if (leaderboard.length === 0) {
      const emptyEmbed = createMilitaryEmbed(
        "🏆 LEADERBOARD",
        "**Ainda não há usuários no ranking!**\n\nSeja o primeiro a ganhar moedas!",
        0x95a5a6
      );
      return interaction.editReply({ embeds: [emptyEmbed] });
    }

    let leaderboardText = "";
    
    for (let i = 0; i < leaderboard.length; i++) {
      const user = leaderboard[i];
      const position = i + 1;
      const medal = position === 1 ? "🥇" : position === 2 ? "🥈" : position === 3 ? "🥉" : "🔹";
      
      try {
        // Tentar buscar o usuário do Discord
        const discordUser = await client.users.fetch(user.id);
        leaderboardText += `${medal} **${position}º** | ${discordUser.tag}\n💰 **${user.coins.toLocaleString('pt-BR')} Bellos**\n\n`;
      } catch {
        // Se não encontrar, usar o ID
        leaderboardText += `${medal} **${position}º** | <@${user.id}>\n💰 **${user.coins.toLocaleString('pt-BR')} Bellos**\n\n`;
      }
    }

    const leaderboardEmbed = createMilitaryEmbed(
      "🏆 RANKING DE BELLOS",
      `**Top 10 usuários com mais moedas:**\n\n${leaderboardText}`,
      0x3498db
    );

    leaderboardEmbed.setFooter({ 
      text: `Total de ${leaderboard.length} usuários no ranking • Atualizado agora`,
      iconURL: client.user.displayAvatarURL()
    });

    await interaction.editReply({ embeds: [leaderboardEmbed] });

  } catch (error) {
    console.error("Erro no comando /leaderboard:", error);
    const errorEmbed = createMilitaryEmbed(
      "❌ ERRO",
      "**Ocorreu um erro ao gerar o leaderboard.**\n\nTente novamente em alguns instantes.",
      0xe74c3c
    );
    await interaction.editReply({ embeds: [errorEmbed] });
  }
}

// ============================================================
// 🎁 COMANDO: /darmoedas (ADMIN)
// ============================================================

async function handleDarMoedas(interaction, client) {
  // VERIFICAÇÃO ESPECÍFICA PARA O USUÁRIO COM ID 1134320234388525086
  const allowedUserId = '1134320234388525086';
  
  if (interaction.user.id !== allowedUserId) {
    const deniedEmbed = createMilitaryEmbed(
      "❌ ACESSO NEGADO",
      "**Apenas o proprietário pode usar este comando!**",
      0xe74c3c
    );
    return interaction.reply({ embeds: [deniedEmbed], ephemeral: true });
  }

  const targetUser = interaction.options.getUser("usuario");
  const quantidade = interaction.options.getInteger("quantidade");

  await interaction.deferReply({ ephemeral: true });

  try {
    // Verificar se o usuário existe no banco
    await getUser(targetUser.id);
    
    // Adicionar moedas
    await updateUserCoins(targetUser.id, quantidade);

    const successEmbed = createMilitaryEmbed(
      "✅ MOEDAS ADICIONADAS",
      `**${quantidade.toLocaleString('pt-BR')} Bellos** foram adicionados para **${targetUser.tag}**!\n\n` +
      `👤 **Usuário:** ${targetUser.tag}\n` +
      `💰 **Quantidade:** ${quantidade.toLocaleString('pt-BR')} Bellos\n` +
      `⚡ **Executado por:** ${interaction.user.tag}`,
      0x2ecc71
    );

    await interaction.editReply({ embeds: [successEmbed] });

    // Enviar mensagem no canal de logs se existir
    try {
      const logChannel = interaction.guild.channels.cache.find(channel => 
        channel.name.toLowerCase().includes("logs") || 
        channel.name.toLowerCase().includes("📥")
      );
      
      if (logChannel) {
        const logEmbed = createMilitaryEmbed(
          "💰 MOEDAS DISTRIBUÍDAS",
          `**Proprietário distribuiu moedas:**\n\n` +
          `👤 **Para:** ${targetUser.tag} (${targetUser.id})\n` +
          `💰 **Quantidade:** ${quantidade.toLocaleString('pt-BR')} Bellos\n` +
          `⚡ **Por:** ${interaction.user.tag}\n` +
          `⏰ **Data:** <t:${Math.floor(Date.now() / 1000)}:F>`,
          0xF1C40F
        );
        await logChannel.send({ embeds: [logEmbed] });
      }
    } catch (logError) {
      console.log("Não foi possível enviar log:", logError.message);
    }

  } catch (error) {
    console.error("Erro no comando /darmoedas:", error);
    const errorEmbed = createMilitaryEmbed(
      "❌ ERRO",
      "**Ocorreu um erro ao dar moedas.**\n\nVerifique se o usuário existe e tente novamente.",
      0xe74c3c
    );
    await interaction.editReply({ embeds: [errorEmbed] });
  }
}

// ============================================================
// ❌ COMANDO: /removermoedas (ADMIN)
// ============================================================

async function handleRemoverMoedas(interaction, client) {
  // VERIFICAÇÃO ESPECÍFICA PARA O USUÁRIO COM ID 1134320234388525086
  const allowedUserId = '1134320234388525086';
  
  if (interaction.user.id !== allowedUserId) {
    const deniedEmbed = createMilitaryEmbed(
      "❌ ACESSO NEGADO",
      "**Apenas o proprietário pode usar este comando!**",
      0xe74c3c
    );
    return interaction.reply({ embeds: [deniedEmbed], ephemeral: true });
  }

  const targetUser = interaction.options.getUser("usuario");
  const quantidade = interaction.options.getInteger("quantidade");

  await interaction.deferReply({ ephemeral: true });

  try {
    // Verificar saldo atual do usuário
    const userData = await getUser(targetUser.id);
    
    if (userData.coins < quantidade) {
      const errorEmbed = createMilitaryEmbed(
        "❌ SALDO INSUFICIENTE",
        `**${targetUser.tag} tem apenas ${userData.coins.toLocaleString('pt-BR')} Bellos!**\n\n` +
        `Não é possível remover ${quantidade.toLocaleString('pt-BR')} Bellos.`,
        0xe74c3c
      );
      return interaction.editReply({ embeds: [errorEmbed] });
    }

    // Remover moedas (valor negativo)
    await updateUserCoins(targetUser.id, -quantidade);

    const successEmbed = createMilitaryEmbed(
      "✅ MOEDAS REMOVIDAS",
      `**${quantidade.toLocaleString('pt-BR')} Bellos** foram removidos de **${targetUser.tag}**!\n\n` +
      `👤 **Usuário:** ${targetUser.tag}\n` +
      `💰 **Quantidade removida:** ${quantidade.toLocaleString('pt-BR')} Bellos\n` +
      `📊 **Saldo anterior:** ${userData.coins.toLocaleString('pt-BR')} Bellos\n` +
      `📈 **Saldo atual:** ${(userData.coins - quantidade).toLocaleString('pt-BR')} Bellos\n` +
      `⚡ **Executado por:** ${interaction.user.tag}`,
      0xf39c12
    );

    await interaction.editReply({ embeds: [successEmbed] });

  } catch (error) {
    console.error("Erro no comando /removermoedas:", error);
    const errorEmbed = createMilitaryEmbed(
      "❌ ERRO",
      "**Ocorreu um erro ao remover moedas.**\n\nVerifique os dados e tente novamente.",
      0xe74c3c
    );
    await interaction.editReply({ embeds: [errorEmbed] });
  }
}