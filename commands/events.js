import { PermissionFlagsBits, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } from "discord.js";
import { createMilitaryEmbed } from '../utils/embeds.js';

// Armazenamento de eventos ativos
export const activeEvents = new Map();

export const commands = [
  {
    name: "evento",
    description: "⏰ Cria um sistema de contagem regressiva para eventos",
    default_member_permissions: PermissionFlagsBits.Administrator.toString(),
    options: [
      {
        name: "nome",
        type: 3,
        description: "🎯 Nome do evento",
        required: true
      },
      {
        name: "data",
        type: 3,
        description: "📅 Data do evento (DD/MM/AAAA HH:MM:SS)",
        required: true
      },
      {
        name: "descricao",
        type: 3,
        description: "📝 Descrição do evento",
        required: false
      },
      {
        name: "canal",
        type: 7,
        description: "📝 Canal onde o evento será postado",
        required: false,
        channel_types: [0]
      },
      {
        name: "cor",
        type: 3,
        description: "🎨 Cor do evento (hexadecimal)",
        required: false
      }
    ]
  },
  {
    name: "eventos",
    description: "📋 Lista todos os eventos ativos",
    default_member_permissions: PermissionFlagsBits.Administrator.toString()
  },
  {
    name: "cancelar_evento",
    description: "❌ Cancela um evento ativo",
    default_member_permissions: PermissionFlagsBits.Administrator.toString(),
    options: [
      {
        name: "id",
        type: 3,
        description: "🆔 ID do evento para cancelar",
        required: true
      }
    ]
  }
];

export async function execute(interaction, client) {
  const { commandName } = interaction;

  switch (commandName) {
    case "evento":
      await handleEvento(interaction, client);
      break;
    case "eventos":
      await handleEventos(interaction, client);
      break;
    case "cancelar_evento":
      await handleCancelarEvento(interaction, client);
      break;
  }
}

async function handleEvento(interaction, client) {
  const nome = interaction.options.getString("nome");
  const dataInput = interaction.options.getString("data");
  const descricao = interaction.options.getString("descricao") || "Um evento incrível está chegando!";
  const canal = interaction.options.getChannel("canal") || interaction.channel;
  const cor = interaction.options.getString("cor") || "FF0000";

  await interaction.deferReply({ ephemeral: true });

  try {
    // Validar e parsear a data
    const eventDate = parseCustomDate(dataInput);
    if (!eventDate || eventDate <= new Date()) {
      const errorEmbed = createMilitaryEmbed(
        "❌ DATA INVÁLIDA",
        "**A data fornecida é inválida ou já passou!**\n\nUse o formato: `DD/MM/AAAA HH:MM:SS`\nExemplo: `27/07/2024 18:30:00`",
        0xe74c3c
      );
      return interaction.editReply({ embeds: [errorEmbed] });
    }

    // Verificar permissões no canal
    if (!canal.permissionsFor(client.user).has(['SendMessages', 'ViewChannel', 'EmbedLinks'])) {
      const errorEmbed = createMilitaryEmbed(
        "❌ PERMISSÕES INSUFICIENTES",
        `**Não tenho permissão para enviar mensagens em ${canal}**\n\nNecessário: Enviar Mensagens, Ver Canal, Embed Links`,
        0xe74c3c
      );
      return interaction.editReply({ embeds: [errorEmbed] });
    }

    // Criar ID único para o evento
    const eventId = generateEventId();
    
    // Enviar mensagem inicial do evento
    const initialEmbed = createEventEmbed(nome, descricao, eventDate, cor, eventId, "initial");
    const eventMessage = await canal.send({ embeds: [initialEmbed] });

    // Salvar informações do evento
    const eventInfo = {
      id: eventId,
      nome,
      descricao,
      eventDate,
      canalId: canal.id,
      messageId: eventMessage.id,
      cor,
      criador: interaction.user.tag,
      criadorId: interaction.user.id,
      startTime: new Date()
    };

    activeEvents.set(eventId, eventInfo);

    // Iniciar atualização em tempo real
    startEventCountdown(eventId, client);

    const successEmbed = createMilitaryEmbed(
      "✅ EVENTO CRIADO!",
      `**Evento "${nome}" criado com sucesso!**\n\n` +
      `**ID do Evento:** \`${eventId}\`\n` +
      `**Data:** ${formatDate(eventDate)}\n` +
      `**Canal:** ${canal}\n` +
      `**Atualização:** A cada 1 segundo\n\n` +
      `Use \`/eventos\` para ver todos os eventos ativos.`,
      0x2ecc71
    );

    await interaction.editReply({ embeds: [successEmbed] });

  } catch (error) {
    console.error("Erro ao criar evento:", error);
    const errorEmbed = createMilitaryEmbed(
      "❌ ERRO AO CRIAR EVENTO",
      "**Ocorreu um erro ao criar o evento.**\n\nVerifique os dados e tente novamente.",
      0xe74c3c
    );
    await interaction.editReply({ embeds: [errorEmbed] });
  }
}

async function handleEventos(interaction, client) {
  await interaction.deferReply({ ephemeral: true });

  if (activeEvents.size === 0) {
    const noEventsEmbed = createMilitaryEmbed(
      "📋 EVENTOS ATIVOS",
      "**Não há eventos ativos no momento.**\n\nUse `/evento` para criar um novo evento!",
      0x95a5a6
    );
    return interaction.editReply({ embeds: [noEventsEmbed] });
  }

  const eventsList = Array.from(activeEvents.values()).map(event => 
    `• **${event.nome}** (\`${event.id}\`)\n` +
    `  ⏰ ${formatDate(event.eventDate)}\n` +
    `  👤 ${event.criador}\n` +
    `  📝 ${event.descricao.substring(0, 50)}${event.descricao.length > 50 ? '...' : ''}`
  ).join('\n\n');

  const eventsEmbed = createMilitaryEmbed(
    "📋 EVENTOS ATIVOS",
    `**${activeEvents.size} evento(s) ativo(s):**\n\n${eventsList}`,
    0x3498db
  );

  await interaction.editReply({ embeds: [eventsEmbed] });
}

async function handleCancelarEvento(interaction, client) {
  const eventId = interaction.options.getString("id");
  
  await interaction.deferReply({ ephemeral: true });

  const event = activeEvents.get(eventId);
  if (!event) {
    const errorEmbed = createMilitaryEmbed(
      "❌ EVENTO NÃO ENCONTRADO",
      `**Não foi encontrado nenhum evento com o ID \`${eventId}\`**\n\nUse \`/eventos\` para ver a lista de eventos ativos.`,
      0xe74c3c
    );
    return interaction.editReply({ embeds: [errorEmbed] });
  }

  try {
    // Cancelar job do evento
    if (scheduledJobs[eventId]) {
      cancelJob(eventId);
    }

    // Remover do mapa
    activeEvents.delete(eventId);

    // Tentar atualizar a mensagem do evento
    try {
      const canal = await client.channels.fetch(event.canalId);
      if (canal) {
        const message = await canal.messages.fetch(event.messageId);
        const cancelledEmbed = createEventEmbed(
          event.nome, 
          event.descricao, 
          event.eventDate, 
          event.cor, 
          eventId, 
          "cancelled"
        );
        await message.edit({ embeds: [cancelledEmbed] });
      }
    } catch (error) {
      console.log("Não foi possível atualizar a mensagem do evento:", error.message);
    }

    const successEmbed = createMilitaryEmbed(
      "✅ EVENTO CANCELADO",
      `**Evento "${event.nome}" foi cancelado com sucesso!**\n\n` +
      `**ID:** \`${eventId}\`\n` +
      `**Criador:** ${event.criador}\n` +
      `**Data original:** ${formatDate(event.eventDate)}`,
      0xf39c12
    );

    await interaction.editReply({ embeds: [successEmbed] });

  } catch (error) {
    console.error("Erro ao cancelar evento:", error);
    const errorEmbed = createMilitaryEmbed(
      "❌ ERRO AO CANCELAR",
      "**Ocorreu um erro ao cancelar o evento.**\n\nTente novamente.",
      0xe74c3c
    );
    await interaction.editReply({ embeds: [errorEmbed] });
  }
}

// ============================================================
// 🕐 SISTEMA DE CONTAGEM REGRESSIVA
// ============================================================

function startEventCountdown(eventId, client) {
  // Atualizar a cada segundo
  const updateInterval = setInterval(async () => {
    const event = activeEvents.get(eventId);
    if (!event) {
      clearInterval(updateInterval);
      return;
    }

    const now = new Date();
    const timeLeft = event.eventDate - now;

    // Se o evento acabou
    if (timeLeft <= 0) {
      clearInterval(updateInterval);
      await finalizeEvent(eventId, client);
      return;
    }

    // Atualizar a mensagem
    try {
      const canal = await client.channels.fetch(event.canalId);
      const message = await canal.messages.fetch(event.messageId);
      
      const updatedEmbed = createEventEmbed(
        event.nome, 
        event.descricao, 
        event.eventDate, 
        event.cor, 
        eventId, 
        "countdown"
      );
      
      await message.edit({ embeds: [updatedEmbed] });
    } catch (error) {
      console.error(`Erro ao atualizar evento ${eventId}:`, error);
      // Se não conseguir atualizar, para o intervalo
      clearInterval(updateInterval);
    }
  }, 1000); // Atualizar a cada 1 segundo
}

async function finalizeEvent(eventId, client) {
  const event = activeEvents.get(eventId);
  if (!event) return;

  try {
    const canal = await client.channels.fetch(event.canalId);
    const message = await canal.messages.fetch(event.messageId);
    
    // Embed final explosiva!
    const finalEmbed = createEventEmbed(
      event.nome, 
      event.descricao, 
      event.eventDate, 
      event.cor, 
      eventId, 
      "final"
    );

    await message.edit({ embeds: [finalEmbed] });

    // Enviar mensagem especial de comemoração
    const celebrationEmbed = createMilitaryEmbed(
      "🎉🎊🎆 EVENTO COMEÇOU! 🎆🎊🎉",
      `# **${event.nome.toUpperCase()} COMEÇOU!**\n\n` +
      `🚀 **É AGORA! O MOMENTO CHEGOU!** 🚀\n\n` +
      `✨ **${event.descricao}** ✨\n\n` +
      `🎯 **Não perca tempo! Participe agora!**\n` +
      `⏰ **Iniciado em:** <t:${Math.floor(Date.now() / 1000)}:F>\n` +
      `👤 **Organizado por:** ${event.criador}`,
      0xFFD700, // Dourado
      [],
      client.user.displayAvatarURL()
    );

    celebrationEmbed.setImage('https://media.giphy.com/media/xT0xeuOy2Fcl9vDGiA/giphy.gif'); // GIF de fogos de artifício

    await canal.send({ 
      content: `🎉 @here **O EVENTO ${event.nome.toUpperCase()} COMEÇOU!** 🎉`,
      embeds: [celebrationEmbed] 
    });

    // Remover evento da lista ativa
    activeEvents.delete(eventId);

  } catch (error) {
    console.error(`Erro ao finalizar evento ${eventId}:`, error);
  }
}

// ============================================================
// 🎨 FUNÇÕES AUXILIARES
// ============================================================

function createEventEmbed(nome, descricao, eventDate, cor, eventId, status) {
  const now = new Date();
  const timeLeft = eventDate - now;
  
  let title, description, color, footerText;
  let showCountdown = true;

  switch (status) {
    case "initial":
      title = `⏰ EVENTO: ${nome}`;
      description = `📝 **${descricao}**\n\n` +
                   `🎯 **O evento está programado!**\n` +
                   `📅 **Data:** ${formatDate(eventDate)}\n` +
                   `⏳ **Iniciando em:** ${formatTimeLeft(timeLeft)}`;
      color = parseInt(cor, 16);
      footerText = `ID: ${eventId} • Atualização em tempo real • Iniciado em ${formatTime(now)}`;
      break;

    case "countdown":
      title = `⏰ EVENTO: ${nome}`;
      description = `📝 **${descricao}**\n\n` +
                   `🎯 **Contagem regressiva ativa!**\n` +
                   `📅 **Data:** ${formatDate(eventDate)}\n` +
                   `⏳ **Tempo restante:** ${formatTimeLeft(timeLeft)}\n\n` +
                   `🚀 **Prepare-se! O evento está chegando!**`;
      color = parseInt(cor, 16);
      footerText = `ID: ${eventId} • Atualizado em ${formatTime(now)} • Próxima atualização em 1 segundo`;
      break;

    case "final":
      title = `🎉 EVENTO INICIADO: ${nome}`;
      description = `📝 **${descricao}**\n\n` +
                   `🎊 **O EVENTO COMEÇOU!** 🎊\n` +
                   `📅 **Data programada:** ${formatDate(eventDate)}\n` +
                   `⏰ **Iniciado em:** <t:${Math.floor(now.getTime() / 1000)}:F>\n\n` +
                   `🚀 **PARTICIPE AGORA MESMO!** 🚀`;
      color = 0xFFD700; // Dourado
      footerText = `ID: ${eventId} • Evento finalizado em ${formatTime(now)}`;
      showCountdown = false;
      break;

    case "cancelled":
      title = `❌ EVENTO CANCELADO: ${nome}`;
      description = `📝 **${descricao}**\n\n` +
                   `🚫 **Este evento foi cancelado.**\n` +
                   `📅 **Data original:** ${formatDate(eventDate)}\n` +
                   `⏰ **Cancelado em:** <t:${Math.floor(now.getTime() / 1000)}:F>`;
      color = 0x95a5a6; // Cinza
      footerText = `ID: ${eventId} • Evento cancelado`;
      showCountdown = false;
      break;
  }

  const embed = new EmbedBuilder()
    .setTitle(title)
    .setDescription(description)
    .setColor(color)
    .setFooter({ text: footerText })
    .setTimestamp();

  // Adicionar campo de contagem regressiva se necessário
  if (showCountdown && timeLeft > 0) {
    embed.addFields({
      name: "📊 DETALHES DA CONTAGEM",
      value: `**Dias:** ${Math.floor(timeLeft / (1000 * 60 * 60 * 24))}\n` +
             `**Horas:** ${Math.floor((timeLeft % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))}\n` +
             `**Minutos:** ${Math.floor((timeLeft % (1000 * 60 * 60)) / (1000 * 60))}\n` +
             `**Segundos:** ${Math.floor((timeLeft % (1000 * 60)) / 1000)}`,
      inline: true
    });
  }

  return embed;
}

function parseCustomDate(dateString) {
  // Formato: DD/MM/AAAA HH:MM:SS
  const regex = /^(\d{2})\/(\d{2})\/(\d{4}) (\d{2}):(\d{2}):(\d{2})$/;
  const match = dateString.match(regex);
  
  if (!match) return null;
  
  const [, day, month, year, hours, minutes, seconds] = match;
  const date = new Date(`${year}-${month}-${day}T${hours}:${minutes}:${seconds}`);
  
  return date.toString() !== 'Invalid Date' ? date : null;
}

function formatDate(date) {
  return `<t:${Math.floor(date.getTime() / 1000)}:F>`;
}

function formatTime(date) {
  return `<t:${Math.floor(date.getTime() / 1000)}:T>`;
}

function formatTimeLeft(milliseconds) {
  if (milliseconds <= 0) return "**AGORA!**";
  
  const days = Math.floor(milliseconds / (1000 * 60 * 60 * 24));
  const hours = Math.floor((milliseconds % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  const minutes = Math.floor((milliseconds % (1000 * 60 * 60)) / (1000 * 60));
  const seconds = Math.floor((milliseconds % (1000 * 60)) / 1000);
  
  if (days > 0) {
    return `**${days}d ${hours}h ${minutes}m ${seconds}s**`;
  } else if (hours > 0) {
    return `**${hours}h ${minutes}m ${seconds}s**`;
  } else if (minutes > 0) {
    return `**${minutes}m ${seconds}s**`;
  } else {
    return `**${seconds}s**`;
  }
}

function generateEventId() {
  return `EVT_${Date.now()}_${Math.random().toString(36).substr(2, 5).toUpperCase()}`;
}

// ============================================================
// 🔄 INICIALIZAÇÃO DO SISTEMA
// ============================================================

export function initializeEventSystem(client) {
  console.log('🎯 Sistema de eventos inicializado!');
  
  // Limpar eventos antigos ao iniciar
  activeEvents.clear();
  
  console.log(`✅ Sistema de eventos pronto! Comandos: ${commands.length}`);
}