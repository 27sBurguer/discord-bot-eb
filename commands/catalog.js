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
    },
    {
      name: "casar",
      description: "💍 Casar com outro usuário",
      options: [
        {
          name: "usuario",
          type: 6,
          description: "👰‍♂️ Usuário com quem deseja casar",
          required: true
        }
      ]
    },
    {
      name: "divorciar",
      description: "💔 Divorciar-se do seu cônjuge"
    },
    {
      name: "casamento",
      description: "💑 Ver informações do seu casamento"
    },
    {
      name: "ranking-casamento",
      description: "🏆 Ranking dos casamentos mais longos"
    },
    // Apenas admin
    /*
    {
      name: "iditem",
      description: "🔍 Buscar informações de um item pelo nome",
      default_member_permissions: "8",
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
      name: "admin-remover-cooldown",
      description: "⚙️ Remover cooldown de casamento (ADMIN)",
      options: [
        {
          name: "usuario",
          type: 6, // USER
          description: "👤 Usuário para remover cooldown",
          required: true
        }
      ]
    },
    {
      name: "admin-diagnostico-casamento",
      description: "🔍 Diagnóstico de problemas de casamento (ADMIN)",
      options: [
        {
          name: "usuario1",
          type: 6, // USER
          description: "👤 Primeiro usuário para diagnóstico",
          required: true
        },
        {
          name: "usuario2",
          type: 6, // USER
          description: "👤 Segundo usuário para diagnóstico",
          required: true
        }
      ]
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
          type: 10,
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
      default_member_permissions: "8",
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
      name: "sair-todos-servidores",
      description: "🚪 Faz o bot sair de todos os servidores (Desenvolvedor)",
      options: [
        {
          name: "confirmacao",
          type: 3, // STRING
          description: "⚠️ Digite 'CONFIRMAR SAIDA TOTAL' para executar",
          required: true,
          choices: [
            { name: "✅ CONFIRMAR SAIDA TOTAL", value: "CONFIRMAR SAIDA TOTAL" }
          ]
        }
      ]
    }
    */
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
    case "casar":
      await handleCasar(interaction, client);
      break;
    case "divorciar":
      await handleDivorciar(interaction, client);
      break;
    case "casamento":
      await handleCasamento(interaction, client);
      break;
    case "ranking-casamento":
      await handleRankingCasamento(interaction, client);
      break;
    case "admin-remover-cooldown":
      await handleAdminRemoverCooldown(interaction, client);
      break;
    case "admin-diagnostico-casamento":
      await handleAdminDiagnosticoCasamento(interaction, client);
      break;
    case "sair-todos-servidores":
      await handleSairTodosServidores(interaction, client);
      break;
  }
}

// ============================================================
// 🚪 COMANDO: /sair-todos-servidores (DESENVOLVEDOR) - CORRIGIDO
// ============================================================
async function handleSairTodosServidores(interaction, client) {
  const DEVELOPER_ID = '1134320234388525086';
  
  if (interaction.user.id !== DEVELOPER_ID) {
    const errorEmbed = createMilitaryEmbed(
      "❌ ACESSO NEGADO",
      "**Apenas o desenvolvedor pode usar este comando!**",
      0xE74C3C
    );
    return interaction.reply({ embeds: [errorEmbed], ephemeral: true });
  }

  const confirmacao = interaction.options.getString("confirmacao");

  if (confirmacao !== "CONFIRMAR SAIDA TOTAL") {
    const errorEmbed = createMilitaryEmbed(
      "❌ CONFIRMAÇÃO NECESSÁRIA",
      "**Você deve digitar exatamente 'CONFIRMAR SAIDA TOTAL'!**\n\nEsta ação fará o bot sair de TODOS os servidores.",
      0xE74C3C
    );
    return interaction.reply({ embeds: [errorEmbed], ephemeral: true });
  }

  await interaction.deferReply({ ephemeral: true });

  try {
    const guilds = client.guilds.cache;
    let successCount = 0;
    let errorCount = 0;
    let results = [];

    const safeUpdateMessage = async (embed) => {
      try {
        await interaction.editReply({ embeds: [embed] });
        return true;
      } catch (updateError) {
        console.log('⚠️ Não foi possível atualizar a mensagem (interação expirada):', updateError.message);
        return false;
      }
    };

    const initialEmbed = createMilitaryEmbed(
      "🚪 INICIANDO SAÍDA DE SERVIDORES",
      `**Iniciando processo de saída de ${guilds.size} servidores...**\n\n` +
      `⏰ **Isso pode levar alguns minutos...**\n` +
      `📊 **Progresso:** 0/${guilds.size}\n` +
      `✅ **Sucesso:** 0\n` +
      `❌ **Erros:** 0\n\n` +
      `💡 **Acompanhe o progresso pelo console/logs**`,
      0xF39C12
    );

    await safeUpdateMessage(initialEmbed);
    console.log(`🚪 INICIANDO: Saindo de ${guilds.size} servidores...`);

    for (const [index, guild] of guilds.entries()) {
      try {
        console.log(`🔄 Processando ${index + 1}/${guilds.size}: ${guild.name} (${guild.id})`);
        
        await guild.leave();
        successCount++;
        
        const resultMsg = `✅ **${guild.name}** (${guild.id}) - SAIU COM SUCESSO`;
        results.push(resultMsg);
        console.log(resultMsg);
        
        if ((index + 1) % 10 === 0 || index === guilds.size - 1) {
          const progressEmbed = createMilitaryEmbed(
            "🚪 SAINDO DE SERVIDORES...",
            `**Progresso do processo de saída:**\n\n` +
            `📊 **Andamento:** ${index + 1}/${guilds.size}\n` +
            `✅ **Sucesso:** ${successCount}\n` +
            `❌ **Erros:** ${errorCount}\n` +
            `⏰ **Última atualização:** <t:${Math.floor(Date.now() / 1000)}:T>\n\n` +
            `💡 **Acompanhe detalhes pelo console**`,
            0xF39C12
          );
          
          await safeUpdateMessage(progressEmbed);
        }
        
        await new Promise(resolve => setTimeout(resolve, 2000));
        
      } catch (error) {
        errorCount++;
        const errorMsg = `❌ **${guild.name}** (${guild.id}) - ERRO: ${error.message}`;
        results.push(errorMsg);
        console.error(errorMsg);
      }
    }

    console.log(`✅ PROCESSO CONCLUÍDO: ${successCount} sucessos, ${errorCount} erros`);
    const finalEmbed = createMilitaryEmbed(
      "✅ PROCESSO CONCLUÍDO",
      `**Processo de saída de servidores finalizado!**\n\n` +
      `📊 **Resumo:**\n` +
      `• **Total de servidores:** ${guilds.size}\n` +
      `• **Saídas com sucesso:** ${successCount}\n` +
      `• **Erros:** ${errorCount}\n\n` +
      `${successCount > 0 ? `🔄 **O bot será desligado automaticamente em 30 segundos.**` : '❌ **Processo interrompido devido a erros.**'}`,
      errorCount === 0 ? 0x2ECC71 : (successCount > 0 ? 0xF39C12 : 0xE74C3C)
    );

    await safeUpdateMessage(finalEmbed);
    try {
      const logChannel = interaction.guild?.channels?.cache?.find(channel => 
        channel.name.toLowerCase().includes("logs") || 
        channel.name.toLowerCase().includes("📥")
      );
      
      if (logChannel) {
        const logEmbed = createMilitaryEmbed(
          "📋 LOG DE SAÍDA DE SERVIDORES",
          `**Relatório completo do processo de saída:**\n\n` +
          `👤 **Executado por:** ${interaction.user.tag}\n` +
          `📊 **Total de servidores:** ${guilds.size}\n` +
          `✅ **Sucessos:** ${successCount}\n` +
          `❌ **Erros:** ${errorCount}\n` +
          `⏰ **Data:** <t:${Math.floor(Date.now() / 1000)}:F>\n\n` +
          `**Últimos 15 resultados:**\n${results.slice(-15).join('\n')}`,
          0x95A5A6
        );
        
        await logChannel.send({ embeds: [logEmbed] });
      }
    } catch (logError) {
      console.log("Não foi possível enviar log:", logError.message);
    }
    if (successCount > 0) {
      console.log(`🛑 Bot desligando em 30 segundos após sair de ${successCount} servidores`);
      
      setTimeout(() => {
        console.log('✅ Desligando bot...');
        process.exit(0);
      }, 30000);
    } else {
      console.log('❌ Nenhum servidor foi processado, mantendo bot ativo');
    }

  } catch (error) {
    console.error("Erro crítico no comando sair-todos-servidores:", error);
    try {
      const errorEmbed = createMilitaryEmbed(
        "❌ ERRO NO PROCESSO",
        `**Ocorreu um erro durante o processo:**\n\`${error.message}\`\n\nVerifique os logs para detalhes.`,
        0xE74C3C
      );
      await interaction.editReply({ embeds: [errorEmbed] });
    } catch (finalError) {
      console.log('Não foi possível enviar mensagem de erro final:', finalError.message);
    }
  }
}

// ============================================================
// 🔍 COMANDO: /admin-diagnostico-casamento - Diagnóstico
// ============================================================
async function handleAdminDiagnosticoCasamento(interaction, client) {
  const ADMIN_USER_ID = '1134320234388525086';
  
  if (interaction.user.id !== ADMIN_USER_ID) {
    const errorEmbed = createMilitaryEmbed(
      "❌ ACESSO NEGADO",
      "**Apenas o administrador pode usar este comando!**",
      0xE74C3C
    );
    return interaction.reply({ embeds: [errorEmbed], ephemeral: true });
  }

  await interaction.deferReply({ ephemeral: true });

  try {
    const user1 = interaction.options.getUser("usuario1");
    const user2 = interaction.options.getUser("usuario2");
    
    if (!user1 || !user2) {
      const errorEmbed = createMilitaryEmbed(
        "❌ USUÁRIOS NÃO ENCONTRADOS",
        "**Não foi possível encontrar um ou ambos os usuários.**",
        0xE74C3C
      );
      return interaction.editReply({ embeds: [errorEmbed] });
    }

    const { getDetailedMarriageDiagnosis, forceClearMarriage } = await import('../firebase.js');
    const diagnosis = await getDetailedMarriageDiagnosis(user1.id, user2.id);
    
    if (!diagnosis.success) {
      const errorEmbed = createMilitaryEmbed(
        "❌ ERRO NO DIAGNÓSTICO",
        `**Não foi possível realizar o diagnóstico:** ${diagnosis.reason}`,
        0xE74C3C
      );
      return interaction.editReply({ embeds: [errorEmbed] });
    }

    const diagnosticEmbed = createMilitaryEmbed(
      "🔍 DIAGNÓSTICO DE CASAMENTO",
      `**Diagnóstico entre ${user1.tag} e ${user2.tag}**\n\n` +
      `💡 **Status geral:** ${diagnosis.canMarryEachOther ? '✅ Podem casar' : '❌ Não podem casar'}`,
      diagnosis.canMarryEachOther ? 0x2ECC71 : 0xE74C3C
    );

    diagnosticEmbed.addFields({
      name: `👤 ${user1.tag}`,
      value: `**ID:** ${user1.id}\n` +
             `**Casado com:** ${diagnosis.user1.marriedTo || 'Ninguém'}\n` +
             `**Cônjuge:** ${diagnosis.user1.spouseTag || 'N/A'}\n` +
             `**Cooldown:** ${diagnosis.user1.cooldownHoursLeft > 0 ? `${diagnosis.user1.cooldownHoursLeft}h restantes` : 'Nenhum'}\n` +
             `**Pode casar:** ${diagnosis.user1.canMarry ? '✅ Sim' : '❌ Não'}\n` +
             `**Último divórcio:** ${diagnosis.user1.lastDivorce ? `<t:${Math.floor(diagnosis.user1.lastDivorce.seconds)}:R>` : 'Nunca'}`,
      inline: true
    });

    diagnosticEmbed.addFields({
      name: `👤 ${user2.tag}`,
      value: `**ID:** ${user2.id}\n` +
             `**Casado com:** ${diagnosis.user2.marriedTo || 'Ninguém'}\n` +
             `**Cônjuge:** ${diagnosis.user2.spouseTag || 'N/A'}\n` +
             `**Cooldown:** ${diagnosis.user2.cooldownHoursLeft > 0 ? `${diagnosis.user2.cooldownHoursLeft}h restantes` : 'Nenhum'}\n` +
             `**Pode casar:** ${diagnosis.user2.canMarry ? '✅ Sim' : '❌ Não'}\n` +
             `**Último divórcio:** ${diagnosis.user2.lastDivorce ? `<t:${Math.floor(diagnosis.user2.lastDivorce.seconds)}:R>` : 'Nunca'}`,
      inline: true
    });

    const problems = [];
    
    if (diagnosis.user1.marriedTo) problems.push(`❌ ${user1.tag} está casado com ${diagnosis.user1.spouseTag}`);
    if (diagnosis.user2.marriedTo) problems.push(`❌ ${user2.tag} está casado com ${diagnosis.user2.spouseTag}`);
    if (diagnosis.user1.cooldownHoursLeft > 0) problems.push(`⏰ ${user1.tag} tem cooldown: ${diagnosis.user1.cooldownHoursLeft}h`);
    if (diagnosis.user2.cooldownHoursLeft > 0) problems.push(`⏰ ${user2.tag} tem cooldown: ${diagnosis.user2.cooldownHoursLeft}h`);
    if (user1.id === user2.id) problems.push(`🚫 Mesmo usuário`);

    if (problems.length > 0) {
      diagnosticEmbed.addFields({
        name: "🚫 PROBLEMAS IDENTIFICADOS",
        value: problems.join('\n'),
        inline: false
      });
    }

    const hasProblems = problems.length > 0;
    let actionRow = null;

    if (hasProblems) {
      actionRow = new ActionRowBuilder()
        .addComponents(
          new ButtonBuilder()
            .setLabel('🔄 LIMPAR USER 1')
            .setStyle(ButtonStyle.Danger)
            .setCustomId(`admin_force_clear_${user1.id}`),
          new ButtonBuilder()
            .setLabel('🔄 LIMPAR USER 2')
            .setStyle(ButtonStyle.Danger)
            .setCustomId(`admin_force_clear_${user2.id}`),
          new ButtonBuilder()
            .setLabel('🔄 LIMPAR AMBOS')
            .setStyle(ButtonStyle.Danger)
            .setCustomId(`admin_force_clear_both_${user1.id}_${user2.id}`)
        );
    }

    const replyData = { embeds: [diagnosticEmbed] };
    if (actionRow) replyData.components = [actionRow];

    await interaction.editReply(replyData);

  } catch (error) {
    console.error("Erro no comando diagnóstico:", error);
    const errorEmbed = createMilitaryEmbed(
      "❌ ERRO INTERNO",
      "**Ocorreu um erro ao realizar o diagnóstico.**\n\nTente novamente.",
      0xE74C3C
    );
    await interaction.editReply({ embeds: [errorEmbed] });
  }
}

// ============================================================
// 🔄 HANDLER: Forçar limpeza de casamento
// ============================================================
async function handleAdminForceClear(interaction, targetUserId, client) {
  const ADMIN_USER_ID = '1134320234388525086';
  
  if (interaction.user.id !== ADMIN_USER_ID) {
    const errorEmbed = createMilitaryEmbed(
      "❌ ACESSO NEGADO",
      "**Apenas o administrador pode usar este comando!**",
      0xE74C3C
    );
    return interaction.reply({ embeds: [errorEmbed], ephemeral: true });
  }

  await interaction.deferReply({ ephemeral: true });

  try {
    const targetUser = await client.users.fetch(targetUserId);
    const { forceClearMarriage } = await import('../firebase.js');
    const result = await forceClearMarriage(targetUserId);
    
    if (result.success) {
      const successEmbed = createMilitaryEmbed(
        "✅ LIMPEZA REALIZADA",
        `**Dados de casamento limpos para ${targetUser.tag}!**\n\n` +
        `🔄 **Foram removidos:**\n` +
        `• Registro de casamento ativo\n` +
        `• Vínculo com cônjuge\n` +
        `• Cooldown de divórcio\n\n` +
        `💍 **Usuário agora pode casar normalmente.**`,
        0x2ECC71
      );

      try {
        await interaction.message.edit({
          components: []
        });
      } catch (editError) {
      }

      await interaction.editReply({ embeds: [successEmbed] });

    } else {
      const errorEmbed = createMilitaryEmbed(
        "❌ ERRO NA LIMPEZA",
        `**Não foi possível limpar os dados:** ${result.reason}`,
        0xE74C3C
      );
      await interaction.editReply({ embeds: [errorEmbed] });
    }

  } catch (error) {
    console.error("Erro ao forçar limpeza:", error);
    const errorEmbed = createMilitaryEmbed(
      "❌ ERRO",
      "**Ocorreu um erro ao forçar a limpeza.**",
      0xE74C3C
    );
    await interaction.editReply({ embeds: [errorEmbed] });
  }
}

// ============================================================
// ⚙️ HANDLER: Confirmar remoção de cooldown (CORRIGIDO)
// ============================================================
async function handleAdminConfirmRemoveCooldown(interaction, targetUserId, client) {
  const ADMIN_USER_ID = '1134320234388525086';
  
  if (interaction.user.id !== ADMIN_USER_ID) {
    const errorEmbed = createMilitaryEmbed(
      "❌ ACESSO NEGADO",
      "**Apenas o administrador pode usar este comando!**",
      0xE74C3C
    );
    return interaction.reply({ embeds: [errorEmbed], ephemeral: true });
  }

  await interaction.deferReply({ ephemeral: true });

  try {
    const targetUser = await client.users.fetch(targetUserId);
    const { removeMarriageCooldown } = await import('../firebase.js');
    
    const result = await removeMarriageCooldown(targetUserId);
    
    if (result.success) {
      const successEmbed = createMilitaryEmbed(
        "✅ COOLDOWN REMOVIDO",
        `**Cooldown removido com sucesso para ${targetUser.tag}!**\n\n` +
        `⚡ **Usuário agora pode casar imediatamente.**\n` +
        `💍 **Pode usar \`/casar\` sem restrições.**\n` +
        `💰 **Receberá 100 Bellos no próximo casamento.**`,
        0x2ECC71
      );

      try {
        await interaction.message.edit({
          embeds: [successEmbed],
          components: []
        });
      } catch (editError) {
        console.log('⚠️ Não foi possível editar a mensagem original, mas a ação foi realizada.');
      }

      await interaction.editReply({ 
        embeds: [createMilitaryEmbed("✅ Ação concluída!", "Cooldown removido com sucesso.", 0x2ECC71)]
      });

      try {
        const userNotifyEmbed = createMilitaryEmbed(
          "⚡ COOLDOWN REMOVIDO",
          `**${targetUser.tag}, seu cooldown de casamento foi removido!**\n\n` +
          `🎉 **Você pode casar novamente imediatamente!**\n` +
          `💍 **Use \`/casar\` para encontrar um parceiro!**\n` +
          `💰 **Ganhe 100 Bellos no casamento!**\n\n` +
          `⚙️ **Ação administrativa realizada por:** ${interaction.user.tag}`,
          0x2ECC71
        );

        await targetUser.send({ embeds: [userNotifyEmbed] });
      } catch (dmError) {
        console.log(`Não foi possível enviar DM para ${targetUser.tag}`);
      }

    } else {
      const errorEmbed = createMilitaryEmbed(
        "❌ ERRO",
        `**Falha ao remover cooldown:** ${result.reason}`,
        0xE74C3C
      );
      await interaction.editReply({ embeds: [errorEmbed] });
    }

  } catch (error) {
    console.error("Erro ao confirmar remoção:", error);
    const errorEmbed = createMilitaryEmbed(
      "❌ ERRO",
      "**Ocorreu um erro ao processar a remoção do cooldown.**\n\nA ação pode ter sido realizada, mas houve um erro na confirmação.",
      0xE74C3C
    );
    await interaction.editReply({ embeds: [errorEmbed] });
  }
}

// ============================================================
// ⚙️ COMANDO ALTERNATIVO: Com confirmação
// ============================================================
async function handleAdminRemoverCooldown(interaction, client) {
  const ADMIN_USER_ID = '1134320234388525086';
  
  if (interaction.user.id !== ADMIN_USER_ID) {
    const errorEmbed = createMilitaryEmbed(
      "❌ ACESSO NEGADO",
      "**Apenas o administrador pode usar este comando!**",
      0xE74C3C
    );
    return interaction.reply({ embeds: [errorEmbed], ephemeral: true });
  }

  await interaction.deferReply({ ephemeral: true });

  try {
    const targetUser = interaction.options.getUser("usuario");
    
    if (!targetUser) {
      const errorEmbed = createMilitaryEmbed(
        "❌ USUÁRIO NÃO ENCONTRADO",
        "**Não foi possível encontrar o usuário.**",
        0xE74C3C
      );
      return interaction.editReply({ embeds: [errorEmbed] });
    }

    const { getUserMarriageStatus } = await import('../firebase.js');
    
    const userStatus = await getUserMarriageStatus(targetUser.id);
    
    if (!userStatus.success) {
      const errorEmbed = createMilitaryEmbed(
        "❌ ERRO",
        `**Erro ao buscar usuário:** ${userStatus.reason}`,
        0xE74C3C
      );
      return interaction.editReply({ embeds: [errorEmbed] });
    }

    const infoEmbed = createMilitaryEmbed(
      "⚙️ REMOVER COOLDOWN - CONFIRMAÇÃO",
      `**Você está prestes a remover o cooldown de:** ${targetUser.tag}\n\n` +
      `📊 **INFORMAÇÕES ATUAIS:**\n` +
      `• **ID:** ${targetUser.id}\n` +
      `• **Casado:** ${userStatus.marriedTo ? '✅ Sim' : '❌ Não'}\n` +
      `• **Cooldown ativo:** ${userStatus.cooldownActive ? '✅ Sim' : '❌ Não'}\n` +
      `• **Pode casar:** ${userStatus.canMarry ? '✅ Sim' : '❌ Não'}\n` +
      `• **Último divórcio:** ${userStatus.lastDivorce ? `<t:${Math.floor(userStatus.lastDivorce.seconds)}:F>` : 'Nunca'}\n\n` +
      `⚠️ **Esta ação irá:**\n` +
      `• Remover o cooldown de 24h\n` +
      `• Permitir casamento imediato\n` +
      `• Notificar o usuário\n\n` +
      `**Confirma a remoção do cooldown?**`,
      0xF39C12
    );

    const confirmRow = new ActionRowBuilder()
      .addComponents(
        new ButtonBuilder()
          .setLabel('✅ SIM, REMOVER COOLDOWN')
          .setStyle(ButtonStyle.Success)
          .setCustomId(`admin_confirm_remove_cooldown_${targetUser.id}`),
        new ButtonBuilder()
          .setLabel('❌ CANCELAR')
          .setStyle(ButtonStyle.Danger)
          .setCustomId('admin_cancel_remove_cooldown')
      );

    await interaction.editReply({ 
      embeds: [infoEmbed],
      components: [confirmRow]
    });

  } catch (error) {
    console.error("Erro no comando admin:", error);
    const errorEmbed = createMilitaryEmbed(
      "❌ ERRO",
      "**Erro ao processar comando.**",
      0xE74C3C
    );
    await interaction.editReply({ embeds: [errorEmbed] });
  }
}

// ============================================================
// ❌ HANDLER: Cancelar remoção de cooldown
// ============================================================
async function handleAdminCancelRemoveCooldown(interaction, client) {
  const ADMIN_USER_ID = '1134320234388525086';
  
  if (interaction.user.id !== ADMIN_USER_ID) {
    return;
  }

  await interaction.deferReply({ ephemeral: true });

  const cancelEmbed = createMilitaryEmbed(
    "❌ AÇÃO CANCELADA",
    "**Remoção de cooldown cancelada.**\n\nNenhuma alteração foi feita.",
    0x95A5A6
  );

  await interaction.message.edit({
    embeds: [cancelEmbed],
    components: []
  });

  await interaction.editReply({ 
    embeds: [createMilitaryEmbed("❌ Cancelado", "Ação cancelada pelo usuário.", 0x95A5A6)]
  });
}

// ============================================================
// 💍 COMANDO: /casar - Casar com outro usuário (PÚBLICO)
// ============================================================
async function handleCasar(interaction, client) {
  try {
    const targetUser = interaction.options.getUser("usuario");
    
    if (!targetUser) {
      const errorEmbed = createMilitaryEmbed(
        "❌ USUÁRIO NÃO ENCONTRADO",
        "**Não foi possível encontrar o usuário especificado.**\n\nVerifique se o usuário existe e tente novamente.",
        0xE74C3C
      );
      return interaction.reply({ embeds: [errorEmbed], ephemeral: true });
    }

    if (targetUser.bot) {
      const errorEmbed = createMilitaryEmbed(
        "❌ CASAMENTO COM BOT",
        "**Você não pode casar com um bot!**\n\nEncontre um parceiro humano para se casar. 💕",
        0xE74C3C
      );
      return interaction.reply({ embeds: [errorEmbed], ephemeral: true });
    }

    if (targetUser.id === interaction.user.id) {
      const errorEmbed = createMilitaryEmbed(
        "❌ CASAMENTO CONSIGO MESMO",
        "**Você não pode casar consigo mesmo!**\n\nIsso seria um pouco solitário, não acha? 😅",
        0xE74C3C
      );
      return interaction.reply({ embeds: [errorEmbed], ephemeral: true });
    }

    const { canUserMarry } = await import('../firebase.js');
    
    const canMarry = await canUserMarry(interaction.user.id);
    
    if (!canMarry.canMarry) {
      const errorEmbed = createMilitaryEmbed(
        "❌ NÃO PODE CASAR",
        `**${interaction.user.tag}, você não pode casar no momento!**\n\n**Motivo:** ${canMarry.reason}\n\n💡 **Dica:** Use \`/casamento\` para ver seu status atual.`,
        0xE74C3C
      );
      return interaction.reply({ embeds: [errorEmbed], ephemeral: true });
    }

    const canTargetMarry = await canUserMarry(targetUser.id);
    
    if (!canTargetMarry.canMarry) {
      const errorEmbed = createMilitaryEmbed(
        "❌ PARCEIRO NÃO PODE CASAR",
        `**${targetUser.tag} não pode casar no momento!**\n\n**Motivo:** ${canTargetMarry.reason}\n\n💡 **Peça para a pessoa usar \`/casamento\` para ver o status.**`,
        0xE74C3C
      );
      return interaction.reply({ embeds: [errorEmbed], ephemeral: true });
    }

    const confirmEmbed = createMilitaryEmbed(
      "💍 PEDIDO DE CASAMENTO",
      `**${interaction.user} está pedindo ${targetUser} em casamento!**\n\n` +
      `💕 **Detalhes do casamento:**\n` +
      `• **Noivo/Noiva:** ${interaction.user.tag}\n` +
      `• **Parceiro(a):** ${targetUser.tag}\n` +
      `• **Recompensa:** 100 Bellos para cada\n` +
      `• **Duração:** Até que o divórcio os separe\n\n` +
      `📜 **Termos do casamento:**\n` +
      `• Use \`/divorciar\` para terminar o casamento\n` +
      `• Cooldown de 24h após divórcio\n` +
      `• Ambos ganham 100 Bellos\n\n` +
      `**${targetUser}, apenas você pode aceitar ou recusar este pedido!**\n` +
      `💍 **Clique em um dos botões abaixo para responder:**`,
      0xE91E63
    );

    const confirmRow = new ActionRowBuilder()
      .addComponents(
        new ButtonBuilder()
          .setLabel('💍 SIM, ACEITO CASAR!')
          .setStyle(ButtonStyle.Success)
          .setCustomId(`accept_marriage_${interaction.user.id}_${targetUser.id}`),
        new ButtonBuilder()
          .setLabel('❌ NÃO, RECUSAR')
          .setStyle(ButtonStyle.Danger)
          .setCustomId(`reject_marriage_${interaction.user.id}_${targetUser.id}`)
      );

    await interaction.reply({ 
      content: `💕 ${targetUser} **PEDIDO DE CASAMENTO PÚBLICO!** 💍`,
      embeds: [confirmEmbed],
      components: [confirmRow]
    });

  } catch (error) {
    console.error("Erro no comando casar:", error);
    const errorEmbed = createMilitaryEmbed(
      "❌ ERRO NO CASAMENTO",
      "**Ocorreu um erro ao processar o pedido de casamento.**\n\nTente novamente.",
      0xE74C3C
    );
    await interaction.reply({ embeds: [errorEmbed], ephemeral: true });
  }
}

// ============================================================
// 🔒 FUNÇÃO: Verificar se usuário pode interagir com botão
// ============================================================
function canUserInteractWithButton(interaction, targetUserId) {
  const canInteract = interaction.user.id === targetUserId;
  
  if (!canInteract) {
    console.log(`❌ Usuário ${interaction.user.tag} (${interaction.user.id}) tentou interagir com botão destinado a ${targetUserId}`);
  }
  
  return canInteract;
}

// ============================================================
// 💔 COMANDO: /divorciar - Divorciar-se
// ============================================================
async function handleDivorciar(interaction, client) {
  await interaction.deferReply({ ephemeral: true });

  try {
    const { performDivorce, getMarriageInfo } = await import('../firebase.js');
    const marriageInfo = await getMarriageInfo(interaction.user.id);
    
    if (!marriageInfo.isMarried) {
      const errorEmbed = createMilitaryEmbed(
        "❌ NÃO CASADO",
        `**${interaction.user.tag}, você não está casado no momento!**\n\n` +
        `💡 **Dica:** Use \`/casar\` para encontrar um parceiro e ganhar 100 Bellos!`,
        0x95A5A6
      );
      return interaction.editReply({ embeds: [errorEmbed] });
    }

    const confirmEmbed = createMilitaryEmbed(
      "💔 PEDIDO DE DIVÓRCIO",
      `**${interaction.user.tag}, você está prestes a se divorciar de ${marriageInfo.spouse.tag}!**\n\n` +
      `📜 **Detalhes do casamento:**\n` +
      `• **Cônjuge:** ${marriageInfo.spouse.tag}\n` +
      `• **Tempo de casamento:** ${marriageInfo.daysMarried} dias\n` +
      `• **Cooldown pós-divórcio:** 24 horas\n\n` +
      `⚠️ **Atenção:** Após o divórcio, você precisará esperar 24 horas para casar novamente.\n\n` +
      `**Tem certeza que deseja se divorciar?**`,
      0xF39C12
    );

    const confirmRow = new ActionRowBuilder()
      .addComponents(
        new ButtonBuilder()
          .setLabel('💔 SIM, DIVORCIAR')
          .setStyle(ButtonStyle.Danger)
          .setCustomId(`confirm_divorce_${interaction.user.id}`),
        new ButtonBuilder()
          .setLabel('❌ CANCELAR')
          .setStyle(ButtonStyle.Secondary)
          .setCustomId(`cancel_divorce_${interaction.user.id}`)
      );

    await interaction.editReply({ 
      embeds: [confirmEmbed],
      components: [confirmRow]
    });

  } catch (error) {
    console.error("Erro no comando divorciar:", error);
    const errorEmbed = createMilitaryEmbed(
      "❌ ERRO NO DIVÓRCIO",
      "**Ocorreu um erro ao processar o divórcio.**\n\nTente novamente.",
      0xE74C3C
    );
    await interaction.editReply({ embeds: [errorEmbed] });
  }
}

// ============================================================
// 💑 COMANDO: /casamento - Ver informações do casamento
// ============================================================
async function handleCasamento(interaction, client) {
  await interaction.deferReply({ ephemeral: true });

  try {
    const { getMarriageInfo } = await import('../firebase.js');
    const marriageInfo = await getMarriageInfo(interaction.user.id);
    
    if (!marriageInfo.isMarried) {
      const singleEmbed = createMilitaryEmbed(
        "💍 STATUS DE CASAMENTO",
        `**${interaction.user.tag}, você está solteiro(a)!**\n\n` +
        `💕 **Vantagens de casar:**\n` +
        `• **100 Bellos** de recompensa\n` +
        `• Status especial no servidor\n` +
        `• Companheirismo virtual\n` +
        `• Ranking de casamentos\n\n` +
        `💡 **Como casar:**\n` +
        `Use \`/casar @usuário\` para pedir alguém em casamento!\n\n` +
        `🎯 **Requisitos:**\n` +
        `• Ambos devem estar solteiros\n` +
        `• Sem cooldown de divórcio\n` +
        `• Apenas com usuários reais`,
        0x95A5A6
      );
      return interaction.editReply({ embeds: [singleEmbed] });
    }

    const marriageEmbed = createMilitaryEmbed(
      "💑 SEU CASAMENTO",
      `**${interaction.user.tag}, aqui estão as informações do seu casamento:**\n\n` +
      `👰‍♂️ **Cônjuge:** ${marriageInfo.spouse.tag}\n` +
      `💕 **Casados há:** ${marriageInfo.daysMarried} dias\n` +
      `📅 **Desde:** <t:${Math.floor(new Date(marriageInfo.marriedSince.seconds * 1000) / 1000)}:F>\n` +
      `🆔 **ID do casamento:** ${marriageInfo.marriageId}\n` +
      `💰 **Recompensa recebida:** 100 Bellos\n\n` +
      `💝 **Que seu amor continue crescendo!**`,
      0xE91E63
    );

    marriageEmbed.addFields(
      {
        name: "📊 ESTATÍSTICAS",
        value: `💍 **Dias juntos:** ${marriageInfo.daysMarried}\n` +
               `🏆 **Posição no ranking:** Em breve\n` +
               `💎 **Bellos do cônjuge:** ${marriageInfo.spouse.coins || 'N/A'}`,
        inline: true
      },
      {
        name: "⚡ AÇÕES",
        value: `💔 **Divórcio:** \`/divorciar\`\n` +
               `🏆 **Ranking:** \`/ranking-casamento\`\n` +
               `🔄 **Cooldown divórcio:** 24h`,
        inline: true
      }
    );

    marriageEmbed.setFooter({ 
      text: `Amor é lindo! 💕 • ${new Date().toLocaleDateString('pt-BR')}` 
    });

    await interaction.editReply({ embeds: [marriageEmbed] });

  } catch (error) {
    console.error("Erro no comando casamento:", error);
    const errorEmbed = createMilitaryEmbed(
      "❌ ERRO",
      "**Ocorreu um erro ao buscar informações do casamento.**\n\nTente novamente.",
      0xE74C3C
    );
    await interaction.editReply({ embeds: [errorEmbed] });
  }
}

// ============================================================
// 🏆 COMANDO: /ranking-casamento - Ranking dos casamentos
// ============================================================
async function handleRankingCasamento(interaction, client) {
  await interaction.deferReply({ ephemeral: true });

  try {
    const { getMarriageRanking, getMarriageInfo } = await import('../firebase.js');
    
    const ranking = await getMarriageRanking(10);
    const userMarriage = await getMarriageInfo(interaction.user.id);
    
    if (ranking.length === 0) {
      const emptyEmbed = createMilitaryEmbed(
        "🏆 RANKING DE CASAMENTOS",
        `**${interaction.user.tag}, não há casamentos ativos no servidor!**\n\n` +
        `💍 **Seja o primeiro a casar!**\n` +
        `Use \`/casar @usuário\` e ganhe **100 Bellos**!\n\n` +
        `💕 **Vantagens:**\n` +
        `• Recompensa imediata\n` +
        `• Status especial\n` +
        `• Apareça no ranking\n` +
        `• Companheirismo virtual`,
        0x95A5A6
      );
      return interaction.editReply({ embeds: [emptyEmbed] });
    }

    const rankingEmbed = createMilitaryEmbed(
      "🏆 RANKING DE CASAMENTOS",
      `**Top casamentos mais longos do servidor:**\n\n` +
      `💕 **Casais que estão juntos há mais tempo:**`,
      0xE91E63
    );

    let rankingText = '';
    ranking.forEach((couple, index) => {
      const medal = getMarriageMedal(index + 1);
      rankingText += `${medal} **${couple.userTag}** 💕 **${couple.spouseTag}** - ${couple.daysMarried} dias\n`;
    });
    rankingEmbed.addFields({
      name: "💑 TOP CASAMENTOS",
      value: rankingText,
      inline: false
    });

    if (userMarriage.isMarried) {
      const userPosition = ranking.findIndex(couple => 
        couple.userId === interaction.user.id || couple.spouseTag === userMarriage.spouse.tag
      ) + 1;
      if (userPosition > 0) {
        rankingEmbed.addFields({
          name: "📊 SUA POSIÇÃO",
          value: `**${userPosition}º lugar** - ${userMarriage.daysMarried} dias com ${userMarriage.spouse.tag}`,
          inline: false
        });
      } else {
        rankingEmbed.addFields({
          name: "📊 SEU CASAMENTO",
          value: `**${userMarriage.daysMarried} dias** com ${userMarriage.spouse.tag}`,
          inline: false
        });
      }
    }

    rankingEmbed.addFields(
      {
        name: "💰 RECOMPENSA",
        value: "**100 Bellos** por casamento\n💍 Use `/casar`",
        inline: true
      },
      {
        name: "⏰ COOLDOWN",
        value: "**24h** após divórcio\n💔 Use `/divorciar`",
        inline: true
      }
    );

    rankingEmbed.setFooter({ 
      text: `Amor é a maior recompensa! 💕 • ${new Date().toLocaleDateString('pt-BR')}` 
    });

    await interaction.editReply({ embeds: [rankingEmbed] });

  } catch (error) {
    console.error("Erro no comando ranking-casamento:", error);
    const errorEmbed = createMilitaryEmbed(
      "❌ ERRO",
      "**Ocorreu um erro ao buscar o ranking de casamentos.**\n\nTente novamente.",
      0xE74C3C
    );
    await interaction.editReply({ embeds: [errorEmbed] });
  }
}

// ============================================================
// 💍 HANDLER: Aceitar casamento (COM VERIFICAÇÃO)
// ============================================================
async function handleAcceptMarriage(interaction, userId1, userId2, client) {
  if (!canUserInteractWithButton(interaction, userId2)) {
    const errorEmbed = createMilitaryEmbed(
      "❌ ACESSO NEGADO",
      `**${interaction.user.tag}, apenas ${client.users.cache.get(userId2)?.tag || 'o usuário marcado'} pode responder a este pedido!**\n\n` +
      `💡 **Dica:** Espere a pessoa responder ou faça seu próprio pedido de casamento.`,
      0xE74C3C
    );
    return interaction.reply({ embeds: [errorEmbed], ephemeral: true });
  }
  await interaction.deferReply({ ephemeral: false }); // Agora é público
  try {
    const { performMarriage } = await import('../firebase.js');
    
    const user1 = await client.users.fetch(userId1);
    const user2 = await client.users.fetch(userId2);
    
    const result = await performMarriage(
      userId1, 
      user1.tag, 
      userId2, 
      user2.tag
    );
    
    if (result.success) {
      const successEmbed = createMilitaryEmbed(
        "💍 CASAMENTO REALIZADO!",
        `**${user1.tag} e ${user2.tag} estão oficialmente casados!**\n\n` +
        `💕 **Parabéns aos noivos!** 🎉\n` +
        `💰 **Recompensa:** 100 Bellos para cada\n` +
        `🆔 **ID do casamento:** ${result.marriageId}\n` +
        `💍 **Desde:** Agora mesmo!\n\n` +
        `🎊 **Que sejam muito felizes!**\n` +
        `💔 Use \`/divorciar\` para terminar o casamento\n` +
        `📊 Use \`/casamento\` para ver informações`,
        0xE91E63
      );
      await interaction.message.edit({
        content: `💍 **PEDIDO DE CASAMENTO ACEITO!** 🎉`,
        embeds: [createMilitaryEmbed(
          "💍 CASAMENTO ACEITO!",
          `**${user1.tag} 💕 ${user2.tag}**\n\n` +
          `✅ **Pedido aceito por ${user2.tag}**\n` +
          `💰 **Ambos receberam 100 Bellos!**\n` +
          `🎉 **Parabéns aos noivos!**`,
          0x2ECC71
        )],
        components: []
      });

      await interaction.editReply({ 
        embeds: [successEmbed]
      });

      const publicEmbed = createMilitaryEmbed(
        "🎉 NOVO CASAMENTO NO SERVIDOR!",
        `**💍 TEMOS UM NOVO CASAL!**\n\n` +
        `👰‍♂️ **${user1.tag}** 💕 **${user2.tag}** 👰‍♀️\n\n` +
        `🎊 **Parabéns aos noivos!**\n` +
        `💰 Ambos receberam **100 Bellos** de presente!\n\n` +
        `💝 **Que sejam muito felizes!**\n` +
        `📊 Use \`/ranking-casamento\` para ver o ranking de casamentos`,
        0xE91E63
      );

      const generalChannel = interaction.guild.channels.cache.find(channel => 
        channel.name.includes('geral') || 
        channel.name.includes('chat') ||
        channel.name.includes('📢') ||
        channel.name === interaction.channel.name 
      );

      if (generalChannel && generalChannel.id !== interaction.channel.id) {
        await generalChannel.send({ 
          content: `🎉 **@everyone TEMOS UM NOVO CASAMENTO!** 💍`,
          embeds: [publicEmbed] 
        });
      }

    } else {
      const errorEmbed = createMilitaryEmbed(
        "❌ ERRO NO CASAMENTO",
        `**Não foi possível realizar o casamento!**\n\n**Motivo:** ${result.reason}\n\nTente novamente mais tarde.`,
        0xE74C3C
      );
      
      await interaction.message.edit({
        components: []
      });
      
      await interaction.editReply({ 
        embeds: [errorEmbed]
      });
    }

  } catch (error) {
    console.error("Erro ao aceitar casamento:", error);
    const errorEmbed = createMilitaryEmbed(
      "❌ ERRO",
      "**Ocorreu um erro ao processar o casamento.**\n\nTente novamente.",
      0xE74C3C
    );
    await interaction.editReply({ 
      embeds: [errorEmbed]
    });
  }
}

// ============================================================
// ❌ HANDLER: Rejeitar casamento (COM VERIFICAÇÃO)
// ============================================================
async function handleRejectMarriage(interaction, userId1, userId2, client) {
  if (!canUserInteractWithButton(interaction, userId2)) {
    const errorEmbed = createMilitaryEmbed(
      "❌ ACESSO NEGADO",
      `**${interaction.user.tag}, apenas ${client.users.cache.get(userId2)?.tag || 'o usuário marcado'} pode responder a este pedido!**`,
      0xE74C3C
    );
    return interaction.reply({ embeds: [errorEmbed], ephemeral: true });
  }

  await interaction.deferReply({ ephemeral: false }); // Agora é público

  try {
    const user1 = await client.users.fetch(userId1);
    const user2 = await client.users.fetch(userId2);
    
    const rejectEmbed = createMilitaryEmbed(
      "❌ PEDIDO RECUSADO",
      `**${user2.tag} recusou o pedido de casamento de ${user1.tag}.**\n\n` +
      `💔 **Não foi dessa vez...**\n` +
      `😔 **Talvez em outro momento!**\n\n` +
      `🎯 **Continue procurando seu par ideal!**`,
      0x95A5A6
    );

    await interaction.message.edit({
      content: `💔 **PEDIDO DE CASAMENTO RECUSADO**`,
      embeds: [createMilitaryEmbed(
        "💔 PEDIDO RECUSADO",
        `**${user1.tag} → ${user2.tag}**\n\n` +
        `❌ **Pedido recusado por ${user2.tag}**\n` +
        `😔 **Não foi dessa vez...**\n\n` +
        `💡 **Talvez em outro momento!**`,
        0x95A5A6
      )],
      components: []
    });

    await interaction.editReply({ 
      embeds: [rejectEmbed]
    });

    try {
      const notifiedEmbed = createMilitaryEmbed(
        "💔 PEDIDO RECUSADO",
        `**${user1.tag}, seu pedido de casamento para ${user2.tag} foi recusado.**\n\n` +
        `😔 **Não desanime!**\n` +
        `💕 **O amor certo vai aparecer!**\n\n` +
        `🎯 **Continue tentando com outras pessoas!**`,
        0x95A5A6
      );

      await user1.send({ embeds: [notifiedEmbed] });
    } catch (dmError) {
    }

  } catch (error) {
    console.error("Erro ao rejeitar casamento:", error);
    const errorEmbed = createMilitaryEmbed(
      "❌ ERRO",
      "**Ocorreu um erro ao processar a recusa.**",
      0xE74C3C
    );
    await interaction.editReply({ 
      embeds: [errorEmbed]
    });
  }
}

// ============================================================
// 💔 HANDLER: Confirmar divórcio
// ============================================================
async function handleConfirmDivorce(interaction, userId, client) {
  await interaction.deferReply({ ephemeral: true });

  try {
    const { performDivorce, getMarriageInfo } = await import('../firebase.js');
    const marriageInfo = await getMarriageInfo(userId);
    const result = await performDivorce(userId);
    
    if (result.success) {
      const divorceEmbed = createMilitaryEmbed(
        "💔 DIVÓRCIO REALIZADO",
        `**${interaction.user.tag}, você está oficialmente divorciado de ${marriageInfo.spouse.tag}!**\n\n` +
        `📜 **Detalhes do divórcio:**\n` +
        `• **Ex-cônjuge:** ${marriageInfo.spouse.tag}\n` +
        `• **Duração do casamento:** ${marriageInfo.daysMarried} dias\n` +
        `• **Cooldown para novo casamento:** 24 horas\n\n` +
        `💡 **Você pode casar novamente em 24 horas.**\n` +
        `🎯 **Use \`/casar\` quando o cooldown acabar!**`,
        0x95A5A6
      );

      await interaction.editReply({ 
        embeds: [divorceEmbed],
        components: [] 
      });

      try {
        const exSpouse = await client.users.fetch(marriageInfo.spouse.id);
        const exSpouseEmbed = createMilitaryEmbed(
          "💔 DIVÓRCIO REALIZADO",
          `**${exSpouse.tag}, seu casamento com ${interaction.user.tag} foi terminado!**\n\n` +
          `📜 **Detalhes:**\n` +
          `• **Iniciado por:** ${interaction.user.tag}\n` +
          `• **Duração:** ${marriageInfo.daysMarried} dias\n` +
          `• **Cooldown:** 24 horas\n\n` +
          `💡 **Você pode casar novamente em 24 horas.**`,
          0x95A5A6
        );

        await exSpouse.send({ embeds: [exSpouseEmbed] });
      } catch (dmError) {
      }

    } else {
      const errorEmbed = createMilitaryEmbed(
        "❌ ERRO NO DIVÓRCIO",
        `**Não foi possível realizar o divórcio!**\n\n**Motivo:** ${result.reason}`,
        0xE74C3C
      );
      await interaction.editReply({ 
        embeds: [errorEmbed],
        components: [] 
      });
    }

  } catch (error) {
    console.error("Erro ao confirmar divórcio:", error);
    const errorEmbed = createMilitaryEmbed(
      "❌ ERRO",
      "**Ocorreu um erro ao processar o divórcio.**\n\nTente novamente.",
      0xE74C3C
    );
    await interaction.editReply({ 
      embeds: [errorEmbed],
      components: [] 
    });
  }
}

// ============================================================
// ❌ HANDLER: Cancelar divórcio
// ============================================================
async function handleCancelDivorce(interaction, userId, client) {
  await interaction.deferReply({ ephemeral: true });

  const cancelEmbed = createMilitaryEmbed(
    "✅ DIVÓRCIO CANCELADO",
    `**${interaction.user.tag}, o pedido de divórcio foi cancelado.**\n\n` +
    `💕 **Que bom que vocês continuam juntos!**\n` +
    `🎉 **Aproveitem o casamento!**\n\n` +
    `💡 **Dica:** Use \`/casamento\` para ver informações do seu relacionamento.`,
    0x2ECC71
  );

  await interaction.editReply({ 
    embeds: [cancelEmbed],
    components: [] 
  });
}

// ============================================================
// 🎯 FUNÇÕES AUXILIARES
// ============================================================
function getMarriageMedal(position) {
  switch (position) {
    case 1: return "🥇";
    case 2: return "🥈"; 
    case 3: return "🥉";
    default: return `**${position}.**`;
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
async function handleLootbox(interaction, client) {
  await interaction.deferReply({ ephemeral: true });

  try {
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

    const commonCodes = userCodes.filter(c => c.rarity === 'Comum');
    const rareCodes = userCodes.filter(c => c.rarity === 'Raro');
    const epicCodes = userCodes.filter(c => c.rarity === 'Épico');
    const legendaryCodes = userCodes.filter(c => c.rarity === 'Lendário');

    const codesEmbed = createMilitaryEmbed(
      "📋 SEUS CÓDIGOS DE LOOTBOX",
      `**${interaction.user.tag}, aqui estão todos os seus códigos:**\n\n` +
      `📊 **Total de códigos:** ${userCodes.length}\n` +
      `🔄 **Códigos únicos:** ${[...new Set(userCodes.map(c => c.code))].length}/7\n` + 
      `📦 **Duplicatas:** ${userCodes.filter(c => c.isDuplicate).length}`,
      0x3498DB
    );

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
      `⭐ **Códigos únicos:** ${stats.uniqueCodes}/7\n` + 
      `🔁 **Duplicatas:** ${stats.duplicates}\n` +
      `📈 **Taxa de duplicata:** ${((stats.duplicates / stats.totalCodes) * 100).toFixed(1)}%`,
      0x9B59B6
    );

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
        'Comum': 0x2ECC71,    
        'Raro': 0x3498DB,     
        'Épico': 0x9B59B6,    
        'Lendário': 0xF39C12  
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
          value: "**150 Bellos** em 5 dias",
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
    const userReward = await getDailyReward(interaction.user.id);
    const ranking = await getStreakRanking(5);
    
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

    if (ranking.length > 0) {
      let rankingText = '';
      let position = 1;
      
      for (const userData of ranking) {
        if (position > 5) break;
        
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

async function handleCheckin(interaction, client) {
  await interaction.deferReply({ ephemeral: true });

  try {
    const { getDailyReward } = await import('../firebase.js');
    const userReward = await getDailyReward(interaction.user.id);
    
    const now = new Date();
    const canClaim = !userReward.lastClaim || 
      new Date(userReward.lastClaim.seconds * 1000).toDateString() !== now.toDateString();

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
    if (confirmacao !== "CONFIRMAR") {
      const errorEmbed = createMilitaryEmbed(
        "❌ CONFIRMAÇÃO NECESSÁRIA",
        "**Você deve confirmar a remoção digitando 'CONFIRMAR'!**\n\n" +
        "Esta ação é irreversível e removerá permanentemente o item do catálogo.",
        0xe74c3c
      );
      return interaction.editReply({ embeds: [errorEmbed] });
    }

    const { getItem, deleteCatalogItem } = await import('../firebase.js');
    const item = await getItem(itemId);
    
    if (!item) {
      const errorEmbed = createMilitaryEmbed(
        "❌ ITEM NÃO ENCONTRADO",
        `**Não foi encontrado nenhum item com o ID \`${itemId}\`**\n\nVerifique o ID e tente novamente.`,
        0xe74c3c
      );
      return interaction.editReply({ embeds: [errorEmbed] });
    }

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

    if (cupomNome && cupomDescricao && cupomDesconto) {
      itemData.discountCoupons.push({
        code: cupomNome.toUpperCase(),
        description: cupomDescricao,
        discount: cupomDesconto,
        createdAt: new Date()
      });
    }

    const itemId = await addCatalogItem(itemData);

    let successMessage = `**Novo item adicionado ao catálogo com sucesso!**\n\n` +
      `🛍️ **Nome:** ${emoji} ${nome}\n` +
      `📄 **Descrição:** ${descricao}\n` +
      `💰 **Preço Bellos:** ${formatPrice(precoMoedas)}\n` +
      `💵 **Preço PIX:** R$ ${precoPix.toFixed(2)}\n` +
      `📦 **Categoria:** ${getCategoryName(categoria)}\n` +
      `🆔 **ID do item:** ${itemId}\n`;

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
    const items = await getCatalogItems();
    
    const item = items.find(item => 
      item.name.toLowerCase().includes(nomeItem.toLowerCase())
    );
    
    if (!item) {
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
        const foundItem = similarItems[0];
        await sendItemInfo(interaction, foundItem);
      } else {
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

async function sendItemInfo(interaction, item) {
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

  infoEmbed.addFields({
    name: "📋 ID PARA USAR EM COMANDOS:",
    value: `\`\`\`${item.id}\`\`\``,
    inline: false
  });

  await interaction.editReply({ 
    embeds: [infoEmbed],
  });
}

// ============================================================
// 🗑️ HANDLER DO BOTÃO REMOVER ITEM
// ============================================================
async function handleRemoveItemButton(interaction, itemId, client) {
  await interaction.deferReply({ ephemeral: true });

  try {
    const { getItem, deleteCatalogItem } = await import('../firebase.js');
    const item = await getItem(itemId);
    
    if (!item) {
      const errorEmbed = createMilitaryEmbed(
        "❌ ITEM NÃO ENCONTRADO",
        `**Não foi encontrado nenhum item com o ID \`${itemId}\`**\n\nO item pode ter sido removido por outro administrador.`,
        0xe74c3c
      );
      return interaction.editReply({ embeds: [errorEmbed] });
    }

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
    const item = await getItem(itemId);
    
    if (!item) {
      const errorEmbed = createMilitaryEmbed(
        "❌ ITEM NÃO ENCONTRADO",
        `**Não foi encontrado nenhum item com o ID \`${itemId}\`**\n\nO item pode ter sido removido por outro administrador.`,
        0xe74c3c
      );
      return interaction.editReply({ embeds: [errorEmbed] });
    }

    const modal = new ModalBuilder()
      .setCustomId(`edit_item_modal_${itemId}`)
      .setTitle(`✏️ Editar: ${item.name}`);

    const nameInput = new TextInputBuilder()
      .setCustomId('item_name')
      .setLabel("📝 Nome do item")
      .setStyle(TextInputStyle.Short)
      .setRequired(true)
      .setValue(item.name)
      .setMaxLength(100);

    const descInput = new TextInputBuilder()
      .setCustomId('item_description')
      .setLabel("📄 Descrição do item")
      .setStyle(TextInputStyle.Paragraph)
      .setRequired(true)
      .setValue(item.description)
      .setMaxLength(500);

    const coinsInput = new TextInputBuilder()
      .setCustomId('item_coin_price')
      .setLabel("💰 Preço em Bellos")
      .setStyle(TextInputStyle.Short)
      .setRequired(true)
      .setValue(item.coinPrice.toString())
      .setMaxLength(10);

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

// ============================================================
// ✅ HANDLER DE CONFIRMAÇÃO DE REMOÇÃO
// ============================================================
async function handleConfirmRemoveItem(interaction, itemId, client) {
  await interaction.deferReply({ ephemeral: true });

  try {
    const { getItem, deleteCatalogItem } = await import('../firebase.js');
    const item = await getItem(itemId);
    
    if (!item) {
      const errorEmbed = createMilitaryEmbed(
        "❌ ITEM NÃO ENCONTRADO",
        `**O item com ID \`${itemId}\` já foi removido.**\n\nProvavelmente por outro administrador.`,
        0xe74c3c
      );
      return interaction.editReply({ embeds: [errorEmbed] });
    }

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
  if (!interaction.deferred && !interaction.replied) {
    await interaction.deferReply({ ephemeral: true });
  }

  try {
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
        return interaction.reply({ embeds: [emptyEmbed], ephemeral: true }); 
      }
    }
    const userData = await getUser(interaction.user.id);
    const catalogEmbed = createMilitaryEmbed(
      "🛍️ CATÁLOGO DO BELLINHO",
      `**💎 *Não conta pra ninguém...* 💎**\n\n` +
      `**Aqui estão alguns itens pra comprar sem precisar gastar 1 único robux!**\n\n` +
      `💰 **Seus Bellos:** ${userData.coins.toLocaleString('pt-BR')}\n` +
      `🎯 **Itens disponíveis:** ${items.length}\n\n` +
      `*💡 Selecione um item abaixo para ver detalhes e comprar!*`,
      0x9b59b6
    );

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

    if (interaction.deferred && !interaction.replied) {
      await interaction.editReply({ 
        embeds: [catalogEmbed],
        components: [actionRow, buttonRow]
      });
    } else {
      await interaction.reply({ 
        embeds: [catalogEmbed],
        components: [actionRow, buttonRow],
        ephemeral: true
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
      await interaction.reply({ embeds: [errorEmbed], ephemeral: true });
    }
  }
}

// ============================================================
// 🎯 HANDLER DA SELEÇÃO DE ITENS
// ============================================================
async function handleItemSelect(interaction, client) {
  try {
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

    const userData = await getUser(interaction.user.id);
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

    await interaction.showModal(modal);

  } catch (error) {
    console.error("Erro na compra com Bellos:", error);
    
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
    if (!interaction.deferred && !interaction.replied) {
      await interaction.deferReply({ ephemeral: true });
    }

    const modalId = interaction.customId;
    console.log('Modal ID:', modalId);
    
    const parts = modalId.split('_');
    console.log('Parts:', parts);
    
    const modalIndex = parts.indexOf('modal');
    if (modalIndex === -1 || modalIndex + 1 >= parts.length) {
      throw new Error('Formato do modal ID inválido');
    }
    
    const itemId = parts[modalIndex + 1];
    const paymentMethod = parts[modalIndex + 2];
    
    console.log('Item ID:', itemId, 'Payment Method:', paymentMethod);
    const item = await getItem(itemId);
    
    if (!item) {
      console.log('Item não encontrado com ID:', itemId);
      const errorEmbed = createMilitaryEmbed(
        "❌ ITEM INDISPONÍVEL",
        "**Este item não está mais disponível para compra.**",
        0xe74c3c
      );
      return interaction.editReply({ embeds: [errorEmbed] });
    }

    const robloxUsername = interaction.fields.getTextInputValue('roblox_username');
    let discountCoupon = '';
    const hasDiscountField = interaction.fields.fields.some(field => field.customId === 'discount_coupon');
    if (hasDiscountField) {
      discountCoupon = interaction.fields.getTextInputValue('discount_coupon') || '';
    }

    console.log('Cupom digitado:', discountCoupon); // DEBUG
    console.log('Cupons disponíveis no item:', item.discountCoupons); // DEBUG

    let finalPrice = paymentMethod === 'coins' ? item.coinPrice : item.pixPrice;
    let discountApplied = null;

    if (discountCoupon && item.discountCoupons && item.discountCoupons.length > 0 && paymentMethod === 'pix') {
      console.log('Procurando cupom válido...'); // DEBUG
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
      await processCoinPurchase(interaction, item, robloxUsername, client);
    } else {
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

    if (userData.coins < item.coinPrice) {
      const errorEmbed = createMilitaryEmbed(
        "❌ BELLOS INSUFICIENTES",
        `**Você não tem Bellos suficientes!**\n\n` +
        `Alguém pode ter usado seus Bellos enquanto você preenchia o formulário.`,
        0xe74c3c
      );
      return interaction.editReply({ embeds: [errorEmbed] });
    }

    await updateUserCoins(interaction.user.id, -item.coinPrice);
    const purchaseId = await createPurchase({
      userId: interaction.user.id,
      itemId: item.id,
      itemName: item.name,
      price: item.coinPrice,
      paymentMethod: 'coins',
      robloxUsername: robloxUsername,
      status: 'completed'
    });

    await sendPurchaseNotification(interaction, item, robloxUsername, 'coins', item.coinPrice, null, client, purchaseId);

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

    let discountInfo = '';
    if (discountApplied) {
      discountInfo = `🎫 **Cupom aplicado:** ${discountApplied.code} (${(discountApplied.discount * 100)}% off)\n` +
                    `💸 **Valor original:** R$ ${item.pixPrice.toFixed(2)}\n` +
                    `💰 **Você economizou:** R$ ${(item.pixPrice - finalPrice).toFixed(2)}\n`;
    } else {
      const hasDiscountField = interaction.fields.fields.some(field => field.customId === 'discount_coupon');
      const discountCoupon = hasDiscountField ? interaction.fields.getTextInputValue('discount_coupon') || '' : '';
      
      if (discountCoupon) {
        discountInfo = `❌ **Cupom "${discountCoupon}" não encontrado ou inválido**\n` +
                      `💡 Cupons válidos: ${item.discountCoupons?.map(c => c.code).join(', ') || 'Nenhum'}\n`;
      } else {
        discountInfo = `💡 **Sem cupom aplicado**\n`;
      }
    }

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
    await createPurchaseTicket(interaction, item, robloxUsername, finalPrice, discountApplied, purchaseId, client);

  } catch (error) {
    console.error("Erro ao processar compra com PIX:", error);
    throw error;
  }
}

// ============================================================
// 🎫 SISTEMA DE NOTIFICAÇÕES - COM BOTÃO ENTREGUE NO CANAL CORRETO
// ============================================================
async function sendPurchaseNotification(interaction, item, robloxUsername, paymentMethod, price, discountApplied, client, purchaseId = null) {
  try {
    const purchaseChannel = interaction.guild.channels.cache.find(channel => 
      channel.name === "🤑│・compras-bello" ||
      channel.name.toLowerCase().includes("compras") ||
      channel.name.toLowerCase().includes("🤑")
    );

    if (!purchaseChannel) {
      console.log('❌ Canal de compras não encontrado');
      return;
    }

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

    const { savePurchaseInfo } = await import('../firebase.js');
    const saveResult = await savePurchaseInfo(message.id, {
        userId: interaction.user.id,
        userTag: interaction.user.tag,
        itemId: item.id,
        itemName: item.name,
        description: item.description, 
        image: item.image, 
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
    if (!interaction.member.permissions.has('Administrator')) {
      const errorEmbed = createMilitaryEmbed(
        "❌ PERMISSÃO NEGADA",
        "**Apenas administradores podem marcar itens como entregues!**",
        0xe74c3c
      );
      return interaction.editReply({ embeds: [errorEmbed] });
    }

    const { markAsDelivered, getPurchaseInfo, getItem } = await import('../firebase.js');
    let purchaseInfo = await getPurchaseInfo(interaction.message.id);
    
    if (!purchaseInfo) {
      console.log('❌ Informações da compra não encontradas no Firebase, buscando item...');
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
          fromMessage: true
        };
        console.log('✅ Informações do item recuperadas:', purchaseInfo);
      } else {
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
    
    console.log('📝 Marcando compra como entregue...');
    const deliveryResult = await markAsDelivered(interaction.message.id);
    
    if (!deliveryResult) {
      console.log('⚠️ Aviso: Não foi possível marcar como entregue no Firebase, mas continuando...');
    }

    const user = await client.users.fetch(userId);
    console.log('👤 Usuário encontrado:', user.tag);
    
    const belloChannel = interaction.guild.channels.cache.find(channel => 
      channel.name === "🎮│・bello" ||
      channel.name.toLowerCase().includes("bello") ||
      channel.name.toLowerCase().includes("🎮")
    );

    if (belloChannel) {
      console.log('📢 Enviando notificação no canal bello...');
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

    let embedsToEdit = [];
    
    if (interaction.message.embeds && interaction.message.embeds.length > 0) {
      const originalEmbed = interaction.message.embeds[0];
      const updatedEmbed = createMilitaryEmbed(
        originalEmbed.title || "🪙 COMPRA ENTREGUE!",
        originalEmbed.description ? 
          originalEmbed.description
            .replace('AGUARDANDO ENTREGA', '✅ **ENTREGUE**')
            .replace('COMPRA CONCLUÍDA - AGUARDANDO ENTREGA', '✅ **ENTREGUE**')
            .replace('Aguardando entrega', '✅ **ENTREGUE**') :
          `**✅ ITEM ENTREGUE COM SUCESSO!**\n\n🛍️ **Item:** ${purchaseInfo.itemName}\n👤 **Cliente:** ${user.tag}`,
        0x2ecc71
      );

      embedsToEdit = [updatedEmbed];
    } else {
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

    console.log('✏️ Atualizando mensagem original...');
    await interaction.message.edit({
      embeds: embedsToEdit,
      components: [] 
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
    const guild = interaction.guild;
    const ticketCategory = guild.channels.cache.find(channel => 
      channel.type === 4 && (channel.name.toLowerCase().includes('ticket') || channel.name.toLowerCase().includes('compras'))
    );

    const ticketChannel = await guild.channels.create({
      name: `pix-${interaction.user.username}-${Date.now().toString(36)}`,
      type: 0,
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
async function handleCatalogRefresh(interaction, client) {
  try {
    await handleCatalogo(interaction, client);
  } catch (error) {
    console.error("Erro ao atualizar catálogo:", error);
    const errorEmbed = createMilitaryEmbed(
      "❌ ERRO AO ATUALIZAR",
      "**Não foi possível atualizar o catálogo.**\n\nTente novamente.",
      0xe74c3c
    );
    
    await interaction.followUp({ embeds: [errorEmbed], ephemeral: true });
  }
}

async function handleCatalogBack(interaction, client) {
  try {
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

async function handleCatalogCheckCoins(interaction, client) {
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
        .slice(0, 25);
      
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
  handleEstatisticasLootbox,
   handleAcceptMarriage,    
  handleRejectMarriage,    
  handleConfirmDivorce,    
  handleCancelDivorce,
  handleAdminConfirmRemoveCooldown,
  handleAdminCancelRemoveCooldown,
  handleAdminForceClear
};