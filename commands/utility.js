import { PermissionFlagsBits } from "discord.js";
import { createMilitaryEmbed } from '../utils/embeds.js';
// ✅ NOVO IMPORT
import { statusList, profileDescriptions } from '../utils/statusManager.js';

export const commands = [
  {
    name: "ajuda",
    description: "📋 Mostra todos os comandos disponíveis do bot"
  },
  {
    name: "status",
    description: "🟢 Verifica o status do bot e informações do servidor"
  },
  // ✅ NOVO COMANDO
  {
    name: "botinfo",
    description: "🤖 Mostra informações detalhadas sobre o bot"
  },
  {
    name: "falar",
    description: "📢 Faz o bot enviar uma mensagem em um canal",
    default_member_permissions: PermissionFlagsBits.Administrator.toString(),
    options: [
      {
        name: "mensagem",
        type: 3,
        description: "💬 Mensagem que o bot vai enviar",
        required: true
      },
      {
        name: "canal",
        type: 7,
        description: "📝 Canal onde a mensagem será enviada (opcional)",
        required: false,
        channel_types: [0, 5, 11]
      }
    ]
  },
  {
    name: "embed",
    description: "🎨 Cria uma embed personalizada",
    default_member_permissions: PermissionFlagsBits.Administrator.toString(),
    options: [
      {
        name: "titulo",
        type: 3,
        description: "📝 Título da embed",
        required: true
      },
      {
        name: "descricao",
        type: 3,
        description: "📄 Descrição da embed",
        required: true
      },
      {
        name: "cor",
        type: 3,
        description: "🎨 Cor da embed (hexadecimal)",
        required: false
      },
      {
        name: "canal",
        type: 7,
        description: "📝 Canal onde a embed será enviada",
        required: false,
        channel_types: [0, 5, 11]
      }
    ]
  },
  // ✅ NOVOS COMANDOS PARA COMUNIDADE
  {
    name: "serverinfo",
    description: "🌐 Mostra informações detalhadas sobre o servidor"
  },
  {
    name: "userinfo",
    description: "👤 Mostra informações sobre um usuário",
    options: [
      {
        name: "usuario",
        type: 6,
        description: "👤 Usuário para ver informações",
        required: false
      }
    ]
  },
  {
    name: "avatar",
    description: "🖼️ Mostra o avatar de um usuário",
    options: [
      {
        name: "usuario",
        type: 6,
        description: "👤 Usuário para ver o avatar",
        required: false
      }
    ]
  },
  {
    name: "calc",
    description: "🧮 Calculadora simples",
    options: [
      {
        name: "expressao",
        type: 3,
        description: "🔢 Expressão matemática (ex: 2+2, 10*5)",
        required: true
      }
    ]
  },
  {
    name: "emoji",
    description: "😊 Mostra informações sobre um emoji",
    options: [
      {
        name: "emoji",
        type: 3,
        description: "😊 Emoji para analisar",
        required: true
      }
    ]
  },
  // ✅ NOVOS COMANDOS PARA MODERAÇÃO
  {
    name: "limpar",
    description: "🧹 Limpa mensagens de um canal",
    default_member_permissions: PermissionFlagsBits.ManageMessages.toString(),
    options: [
      {
        name: "quantidade",
        type: 4,
        description: "🔢 Número de mensagens para limpar (1-100)",
        required: true,
        min_value: 1,
        max_value: 100
      },
      {
        name: "usuario",
        type: 6,
        description: "👤 Limpar apenas mensagens de um usuário",
        required: false
      }
    ]
  },
  {
    name: "slowmode",
    description: "🐌 Configura o modo lento em um canal",
    default_member_permissions: PermissionFlagsBits.ManageChannels.toString(),
    options: [
      {
        name: "segundos",
        type: 4,
        description: "⏰ Segundos de delay (0 para desativar)",
        required: true,
        min_value: 0,
        max_value: 21600
      },
      {
        name: "canal",
        type: 7,
        description: "📝 Canal para configurar (atual se vazio)",
        required: false,
        channel_types: [0, 5]
      }
    ]
  },
  {
    name: "lock",
    description: "🔒 Trava um canal para @everyone",
    default_member_permissions: PermissionFlagsBits.ManageChannels.toString(),
    options: [
      {
        name: "canal",
        type: 7,
        description: "📝 Canal para travar (atual se vazio)",
        required: false,
        channel_types: [0, 5]
      }
    ]
  },
  {
    name: "unlock",
    description: "🔓 Destrava um canal para @everyone",
    default_member_permissions: PermissionFlagsBits.ManageChannels.toString(),
    options: [
      {
        name: "canal",
        type: 7,
        description: "📝 Canal para destravar (atual se vazio)",
        required: false,
        channel_types: [0, 5]
      }
    ]
  }
];

export async function execute(interaction, client) {
  const { commandName } = interaction;

  switch (commandName) {
    case "ajuda":
      await handleAjuda(interaction, client);
      break;
    case "status":
      await handleStatus(interaction, client);
      break;
    case "botinfo":
      await handleBotInfo(interaction, client);
      break;
    case "falar":
      await handleFalar(interaction, client);
      break;
    case "embed":
      await handleEmbed(interaction, client);
      break;
    case "serverinfo":
      await handleServerInfo(interaction, client);
      break;
    case "userinfo":
      await handleUserInfo(interaction, client);
      break;
    case "avatar":
      await handleAvatar(interaction, client);
      break;
    case "calc":
      await handleCalc(interaction, client);
      break;
    case "emoji":
      await handleEmoji(interaction, client);
      break;
    case "limpar":
      await handleLimpar(interaction, client);
      break;
    case "slowmode":
      await handleSlowmode(interaction, client);
      break;
    case "lock":
      await handleLock(interaction, client);
      break;
    case "unlock":
      await handleUnlock(interaction, client);
      break;
  }
}

// ✅ FUNÇÃO AJUDA CORRIGIDA
async function handleAjuda(interaction, client) {
  const ajudaEmbed = createMilitaryEmbed(
    "📋 CENTRAL DE AJUDA - COMANDOS DISPONÍVEIS",
    "**Lista completa de todos os comandos do sistema militar:**\n\nSelecione a categoria desejada para ver os comandos específicos.",
    0x0099ff
  );

  // Comandos Militares
  const militaryCommands = client.commands.filter(cmd => cmd.category === 'military');
  const militaryList = Array.from(militaryCommands.values()).map(cmd => 
    `• \`/${cmd.data.name}\` - ${cmd.data.description}`
  ).join('\n');

  // Comandos Utilitários
  const utilityCommands = client.commands.filter(cmd => cmd.category === 'utility');
  const utilityList = Array.from(utilityCommands.values()).map(cmd => 
    `• \`/${cmd.data.name}\` - ${cmd.data.description}`
  ).join('\n');

  // Comandos Administrativos
  const adminCommands = client.commands.filter(cmd => cmd.category === 'admin');
  const adminList = Array.from(adminCommands.values()).map(cmd => 
    `• \`/${cmd.data.name}\` - ${cmd.data.description}`
  ).join('\n');

  ajudaEmbed.addFields(
    {
      name: "🎖️ COMANDOS MILITARES",
      value: militaryList || "• Nenhum comando disponível",
      inline: false
    },
    {
      name: "🔧 COMANDOS UTILITÁRIOS",
      value: utilityList || "• Nenhum comando disponível",
      inline: false
    },
    {
      name: "⚡ COMANDOS ADMINISTRATIVOS",
      value: adminList || "• Nenhum comando disponível",
      inline: false
    },
    {
      name: "📝 COMO USAR",
      value: "• Use `/comando` para executar\n• Alguns comandos requerem permissões\n• Use `/manual` para instruções detalhadas",
      inline: false
    }
  );

  ajudaEmbed.setFooter({ 
    text: `Total de ${client.commands.size} comandos disponíveis • Solicitado por ${interaction.user.tag}`,
    iconURL: interaction.user.displayAvatarURL()
  });

  await interaction.reply({ embeds: [ajudaEmbed], ephemeral: false });
}

// ✅ FUNÇÃO FALAR CORRIGIDA
async function handleFalar(interaction, client) {
  const mensagem = interaction.options.getString("mensagem");
  const canal = interaction.options.getChannel("canal") || interaction.channel;

  // Verificar permissões no canal de destino
  if (!canal.permissionsFor(client.user).has(['SendMessages', 'ViewChannel'])) {
    const errorEmbed = createMilitaryEmbed(
      "ERRO DE PERMISSÃO",
      `❌ **Não tenho permissão para enviar mensagens em ${canal}**\n\nVerifique as permissões do bot no canal.`,
      0xe74c3c
    );
    return interaction.reply({ embeds: [errorEmbed], ephemeral: true });
  }

  try {
    await canal.send(mensagem);
    
    const successEmbed = createMilitaryEmbed(
      "✅ MENSAGEM ENVIADA",
      `**Mensagem enviada com sucesso em ${canal}!**\n\n📝 **Conteúdo:**\n${mensagem}`,
      0x2ecc71
    );
    
    await interaction.reply({ embeds: [successEmbed], ephemeral: true });
  } catch (error) {
    console.error("Erro ao enviar mensagem:", error);
    const errorEmbed = createMilitaryEmbed(
      "❌ ERRO AO ENVIAR",
      "**Ocorreu um erro ao enviar a mensagem.**\n\nVerifique as permissões e tente novamente.",
      0xe74c3c
    );
    await interaction.reply({ embeds: [errorEmbed], ephemeral: true });
  }
}

async function handleEmbed(interaction, client) {
  const titulo = interaction.options.getString("titulo");
  const descricao = interaction.options.getString("descricao");
  const cor = interaction.options.getString("cor") || "0099ff";
  const canal = interaction.options.getChannel("canal") || interaction.channel;

  // Validar cor hexadecimal
  const hexColor = cor.startsWith('#') ? cor.slice(1) : cor;
  const isValidColor = /^[0-9A-F]{6}$/i.test(hexColor);

  if (!isValidColor) {
    const errorEmbed = createMilitaryEmbed(
      "COR INVÁLIDA",
      "❌ **A cor fornecida não é um hexadecimal válido!**\n\nUse o formato: `FF0000` ou `#FF0000`",
      0xe74c3c
    );
    return interaction.reply({ embeds: [errorEmbed], ephemeral: true });
  }

  // Verificar permissões
  if (!canal.permissionsFor(client.user).has(['SendMessages', 'ViewChannel'])) {
    const errorEmbed = createMilitaryEmbed(
      "ERRO DE PERMISSÃO",
      `❌ **Não tenho permissão para enviar mensagens em ${canal}**`,
      0xe74c3c
    );
    return interaction.reply({ embeds: [errorEmbed], ephemeral: true });
  }

  try {
    const customEmbed = createMilitaryEmbed(titulo, descricao, parseInt(hexColor, 16));
    
    await canal.send({ embeds: [customEmbed] });
    
    const successEmbed = createMilitaryEmbed(
      "✅ EMBED CRIADA",
      `**Embed enviada com sucesso em ${canal}!**\n\n**Título:** ${titulo}\n**Cor:** #${hexColor}`,
      0x2ecc71
    );
    
    await interaction.reply({ embeds: [successEmbed], ephemeral: true });
  } catch (error) {
    console.error("Erro ao criar embed:", error);
    const errorEmbed = createMilitaryEmbed(
      "❌ ERRO AO CRIAR EMBED",
      "**Ocorreu um erro ao criar a embed.**\n\nVerifique os dados e tente novamente.",
      0xe74c3c
    );
    await interaction.reply({ embeds: [errorEmbed], ephemeral: true });
  }
}

async function handleStatus(interaction, client) {
  const uptime = process.uptime();
  const days = Math.floor(uptime / 86400);
  const hours = Math.floor(uptime / 3600) % 24;
  const minutes = Math.floor(uptime / 60) % 60;
  const seconds = Math.floor(uptime % 60);

  // ✅ STATUS ATUAL DO BOT
  const currentActivity = client.user.presence.activities[0];
  const statusText = currentActivity 
    ? `${currentActivity.type === 4 ? '' : '🎮 '}${currentActivity.name}`
    : 'Nenhuma atividade';

  const statusEmbed = createMilitaryEmbed(
    "🟢 STATUS DO SISTEMA",
    "**Informações técnicas do bot militar:**\n\n📊 **Status em tempo real do sistema**",
    0x2ecc71
  );

  statusEmbed.addFields(
    {
      name: "🤖 BOT",
      value: 
        `**Nome:** ${client.user.tag}\n` +
        `**ID:** ${client.user.id}\n` +
        `**Comandos:** ${client.commands.size}\n` +
        `**Status Atual:** ${statusText}`,
      inline: true
    },
    {
      name: "⏰ TEMPO DE ATIVIDADE",
      value: 
        `**Online há:**\n` +
        `${days}d ${hours}h ${minutes}m ${seconds}s\n` +
        `**Desde:** <t:${Math.floor((Date.now() - (uptime * 1000)) / 1000)}:R>`,
      inline: true
    },
    {
      name: "📊 ESTATÍSTICAS",
      value: 
        `**Servidores:** ${client.guilds.cache.size}\n` +
        `**Usuários:** ${client.users.cache.size}\n` +
        `**Canais:** ${client.channels.cache.size}`,
      inline: true
    },
    {
      name: "💻 SISTEMA",
      value: 
        `**Node.js:** ${process.version}\n` +
        `**Plataforma:** ${process.platform}\n` +
        `**Memória:** ${(process.memoryUsage().rss / 1024 / 1024).toFixed(2)}MB`,
      inline: true
    },
    {
      name: "🎯 SERVIÇOS",
      value: 
        `**Roblox:** 🔗 ${process.env.SERVER_URL ? 'Conectado' : 'Configurar'}\n` +
        `**Database:** 💾 Ativo\n` +
        `**API:** 🌐 Online\n` +
        `**Status:** 🟢 Rotativo Ativo`,
      inline: true
    },
    {
      name: "🔄 SISTEMA DE STATUS",
      value: 
        `**Status Rotativo:** ✅ Ativo\n` +
        `**Status Temático:** ✅ Ativo\n` +
        `**Eventos Especiais:** ✅ Ativo\n` +
        `**Total de Status:** ${statusList ? statusList.length : 'N/A'} variações`,
      inline: false
    }
  );

  await interaction.reply({ embeds: [statusEmbed], ephemeral: true });
}

// ✅ NOVA FUNÇÃO: Informações detalhadas do bot
async function handleBotInfo(interaction, client) {
  const botInfoEmbed = createMilitaryEmbed(
    "🤖 INFORMAÇÕES DO BOT MILITAR",
    "**Detalhes técnicos e configurações do sistema automatizado**",
    0x3498db
  );

  // Informações de desenvolvimento
  const devInfo = {
    name: "👨‍💻 DESENVOLVIMENTO",
    value: 
      `**Versão:** 2.0.0\n` +
      `**Discord.js:** 14.14.1\n` +
      `**Node.js:** ${process.version}\n` +
      `**Sistema:** ${process.platform}`,
    inline: true
  };

  // Sistema de status
  const statusInfo = {
    name: "🎮 SISTEMA DE STATUS",
    value: 
      `**Rotativo:** A cada 2min\n` +
      `**Temático:** Por horário\n` +
      `**Variações:** ${statusList ? statusList.length : 'N/A'}\n` +
      `**Descrições:** ${profileDescriptions ? profileDescriptions.length : 'N/A'}`,
    inline: true
  };

  // Comandos por categoria
  const militaryCommandsCount = client.commands.filter(cmd => cmd.category === 'military').size;
  const utilityCommandsCount = client.commands.filter(cmd => cmd.category === 'utility').size;
  const adminCommandsCount = client.commands.filter(cmd => cmd.category === 'admin').size;

  const commandsInfo = {
    name: "📋 COMANDOS",
    value: 
      `**Militares:** ${militaryCommandsCount}\n` +
      `**Utilitários:** ${utilityCommandsCount}\n` +
      `**Administrativos:** ${adminCommandsCount}\n` +
      `**Total:** ${client.commands.size}`,
    inline: true
  };

  // Estatísticas em tempo real
  const statsInfo = {
    name: "📊 ESTATÍSTICAS",
    value: 
      `**Servidores:** ${client.guilds.cache.size}\n` +
      `**Usuários:** ${client.users.cache.size}\n` +
      `**Uptime:** ${Math.floor(process.uptime() / 3600)}h`,
    inline: true
  };

  // Recursos do sistema
  const featuresInfo = {
    name: "⚡ RECURSOS",
    value: 
      "✅ Verificação Roblox\n" +
      "✅ Sistema de Patentes\n" +
      "✅ Status Automático\n" +
      "✅ Comandos Slash\n" +
      "✅ Logs Detalhados\n" +
      "✅ Sistema 24/7",
    inline: true
  };

  botInfoEmbed.addFields(
    devInfo,
    statusInfo,
    commandsInfo,
    statsInfo,
    featuresInfo
  );

  botInfoEmbed.setFooter({ 
    text: `Solicitado por ${interaction.user.tag}`, 
    iconURL: interaction.user.displayAvatarURL() 
  });

  await interaction.reply({ embeds: [botInfoEmbed], ephemeral: true });
}

// ✅ NOVAS FUNÇÕES PARA COMUNIDADE
async function handleServerInfo(interaction, client) {
  const guild = interaction.guild;
  
  const serverInfoEmbed = createMilitaryEmbed(
    "🌐 INFORMAÇÕES DO SERVIDOR",
    `**Detalhes sobre ${guild.name}**`,
    0x9b59b6
  );

  const members = await guild.members.fetch();
  const onlineMembers = members.filter(m => m.presence?.status === 'online').size;
  const bots = members.filter(m => m.user.bot).size;
  const humans = guild.memberCount - bots;

  serverInfoEmbed.addFields(
    {
      name: "📊 ESTATÍSTICAS",
      value: 
        `**Membros:** ${guild.memberCount}\n` +
        `**Humanos:** ${humans}\n` +
        `**Bots:** ${bots}\n` +
        `**Online:** ${onlineMembers}`,
      inline: true
    },
    {
      name: "📅 CRIAÇÃO",
      value: 
        `**Data:** <t:${Math.floor(guild.createdTimestamp / 1000)}:F>\n` +
        `**Idade:** <t:${Math.floor(guild.createdTimestamp / 1000)}:R>`,
      inline: true
    },
    {
      name: "📝 DETALHES",
      value: 
        `**Dono:** ${(await guild.fetchOwner()).user.tag}\n` +
        `**Cargos:** ${guild.roles.cache.size}\n` +
        `**Emojis:** ${guild.emojis.cache.size}\n` +
        `**Boost:** Nível ${guild.premiumTier}`,
      inline: true
    },
    {
      name: "📁 CANAIS",
      value: 
        `**Texto:** ${guild.channels.cache.filter(c => c.type === 0).size}\n` +
        `**Voz:** ${guild.channels.cache.filter(c => c.type === 2).size}\n` +
        `**Categorias:** ${guild.channels.cache.filter(c => c.type === 4).size}`,
      inline: true
    }
  );

  serverInfoEmbed.setThumbnail(guild.iconURL({ size: 256 }));
  
  await interaction.reply({ embeds: [serverInfoEmbed], ephemeral: false });
}

async function handleUserInfo(interaction, client) {
  const user = interaction.options.getUser("usuario") || interaction.user;
  const member = interaction.guild.members.cache.get(user.id);

  const userInfoEmbed = createMilitaryEmbed(
    "👤 INFORMAÇÕES DO USUÁRIO",
    `**Detalhes sobre ${user.tag}**`,
    0xe67e22
  );

  const roles = member?.roles.cache
    .filter(role => role.id !== interaction.guild.id)
    .sort((a, b) => b.position - a.position)
    .map(role => role.toString())
    .slice(0, 10)
    .join(', ') || 'Nenhum cargo';

  userInfoEmbed.addFields(
    {
      name: "🔹 IDENTIFICAÇÃO",
      value: 
        `**Tag:** ${user.tag}\n` +
        `**ID:** ${user.id}\n` +
        `**Bot:** ${user.bot ? '🤖 Sim' : '👤 Não'}`,
      inline: true
    },
    {
      name: "📅 DATAS",
      value: 
        `**Conta criada:** <t:${Math.floor(user.createdTimestamp / 1000)}:R>\n` +
        `**Entrou no servidor:** ${member ? `<t:${Math.floor(member.joinedTimestamp / 1000)}:R>` : 'N/A'}`,
      inline: true
    },
    {
      name: "🎖️ CARGOS",
      value: roles.length > 1024 ? roles.slice(0, 1020) + '...' : roles,
      inline: false
    }
  );

  userInfoEmbed.setThumbnail(user.displayAvatarURL({ size: 256 }));
  
  await interaction.reply({ embeds: [userInfoEmbed], ephemeral: false });
}

async function handleAvatar(interaction, client) {
  const user = interaction.options.getUser("usuario") || interaction.user;

  const avatarEmbed = createMilitaryEmbed(
    "🖼️ AVATAR DO USUÁRIO",
    `**Avatar de ${user.tag}**\n\n[🔗 Link do Avatar](${user.displayAvatarURL({ size: 4096 })})`,
    0x1abc9c
  );

  avatarEmbed.setImage(user.displayAvatarURL({ size: 4096, dynamic: true }));
  
  await interaction.reply({ embeds: [avatarEmbed], ephemeral: false });
}

async function handleCalc(interaction, client) {
  const expressao = interaction.options.getString("expressao");
  
  // Validar expressão para segurança
  const validChars = /^[0-9+\-*/().\s]+$/;
  if (!validChars.test(expressao)) {
    const errorEmbed = createMilitaryEmbed(
      "❌ EXPRESSÃO INVÁLIDA",
      "**Use apenas números e operadores básicos:** `+ - * / ( )`\n\nExemplos: `2+2`, `10*5`, `(5+3)/2`",
      0xe74c3c
    );
    return interaction.reply({ embeds: [errorEmbed], ephemeral: true });
  }

  try {
    // Avaliar expressão de forma segura
    const resultado = eval(expressao);
    
    if (typeof resultado !== 'number' || !isFinite(resultado)) {
      throw new Error("Resultado inválido");
    }

    const calcEmbed = createMilitaryEmbed(
      "🧮 RESULTADO DA CALCULADORA",
      `**Expressão:** \`${expressao}\`\n**Resultado:** \`${resultado}\``,
      0x3498db
    );
    
    await interaction.reply({ embeds: [calcEmbed], ephemeral: false });
  } catch (error) {
    const errorEmbed = createMilitaryEmbed(
      "❌ ERRO NA CALCULAÇÃO",
      "**Não foi possível calcular a expressão.**\n\nVerifique a sintaxe e tente novamente.",
      0xe74c3c
    );
    await interaction.reply({ embeds: [errorEmbed], ephemeral: true });
  }
}

async function handleEmoji(interaction, client) {
  const emojiInput = interaction.options.getString("emoji");
  
  // Extrair ID do emoji se for custom
  const customEmojiMatch = emojiInput.match(/<a?:(\w+):(\d+)>/);
  
  if (customEmojiMatch) {
    const [, emojiName, emojiId] = customEmojiMatch;
    const isAnimated = emojiInput.startsWith('<a:');
    
    const emojiEmbed = createMilitaryEmbed(
      "😊 INFORMAÇÕES DO EMOJI",
      `**Emoji Customizado**\n\n**Nome:** \`${emojiName}\`\n**ID:** \`${emojiId}\`\n**Animado:** ${isAnimated ? '✅ Sim' : '❌ Não'}`,
      0xf39c12
    );
    
    emojiEmbed.setThumbnail(`https://cdn.discordapp.com/emojis/${emojiId}.${isAnimated ? 'gif' : 'png'}`);
    
    await interaction.reply({ embeds: [emojiEmbed], ephemeral: false });
  } else {
    // Emoji padrão
    const emojiEmbed = createMilitaryEmbed(
      "😊 EMOJI PADRÃO",
      `**Emoji:** ${emojiInput}\n\nEste é um emoji padrão do Unicode.`,
      0xf39c12
    );
    
    await interaction.reply({ embeds: [emojiEmbed], ephemeral: false });
  }
}

// ✅ NOVAS FUNÇÕES PARA MODERAÇÃO
async function handleLimpar(interaction, client) {
  const quantidade = interaction.options.getInteger("quantidade");
  const usuario = interaction.options.getUser("usuario");
  
  await interaction.deferReply({ ephemeral: true });

  try {
    const messages = await interaction.channel.messages.fetch({ limit: 100 });
    let messagesToDelete = messages;
    
    if (usuario) {
      messagesToDelete = messages.filter(msg => msg.author.id === usuario.id);
    }
    
    messagesToDelete = messagesToDelete.first(quantidade);
    
    if (messagesToDelete.length === 0) {
      const errorEmbed = createMilitaryEmbed(
        "❌ NENHUMA MENSAGEM",
        "**Não foram encontradas mensagens para deletar.**\n\nVerifique os filtros e tente novamente.",
        0xe74c3c
      );
      return interaction.editReply({ embeds: [errorEmbed] });
    }
    
    await interaction.channel.bulkDelete(messagesToDelete, true);
    
    const successEmbed = createMilitaryEmbed(
      "✅ MENSAGENS LIMPAS",
      `**${messagesToDelete.length} mensagens foram deletadas com sucesso!**\n\n${usuario ? `Filtrado por: ${usuario.tag}` : ''}`,
      0x2ecc71
    );
    
    await interaction.editReply({ embeds: [successEmbed] });
  } catch (error) {
    console.error("Erro ao limpar mensagens:", error);
    const errorEmbed = createMilitaryEmbed(
      "❌ ERRO AO LIMPAR",
      "**Ocorreu um erro ao deletar as mensagens.**\n\nVerifique as permissões e tente novamente.",
      0xe74c3c
    );
    await interaction.editReply({ embeds: [errorEmbed] });
  }
}

async function handleSlowmode(interaction, client) {
  const segundos = interaction.options.getInteger("segundos");
  const canal = interaction.options.getChannel("canal") || interaction.channel;
  
  if (!canal.isTextBased()) {
    const errorEmbed = createMilitaryEmbed(
      "❌ CANAL INVÁLIDO",
      "**Este comando só funciona em canais de texto.**",
      0xe74c3c
    );
    return interaction.reply({ embeds: [errorEmbed], ephemeral: true });
  }
  
  try {
    await canal.setRateLimitPerUser(segundos);
    
    const successEmbed = createMilitaryEmbed(
      "✅ SLOWMODE CONFIGURADO",
      `**Modo lento configurado em ${canal}!**\n\n**Delay:** ${segundos} segundos\n${segundos === 0 ? '🐰 **Modo lento desativado**' : '🐌 **Modo lento ativado**'}`,
      0x2ecc71
    );
    
    await interaction.reply({ embeds: [successEmbed], ephemeral: true });
  } catch (error) {
    console.error("Erro ao configurar slowmode:", error);
    const errorEmbed = createMilitaryEmbed(
      "❌ ERRO AO CONFIGURAR",
      "**Não foi possível configurar o modo lento.**\n\nVerifique as permissões e tente novamente.",
      0xe74c3c
    );
    await interaction.reply({ embeds: [errorEmbed], ephemeral: true });
  }
}

async function handleLock(interaction, client) {
  const canal = interaction.options.getChannel("canal") || interaction.channel;
  
  if (!canal.isTextBased()) {
    const errorEmbed = createMilitaryEmbed(
      "❌ CANAL INVÁLIDO",
      "**Este comando só funciona em canais de texto.**",
      0xe74c3c
    );
    return interaction.reply({ embeds: [errorEmbed], ephemeral: true });
  }
  
  try {
    await canal.permissionOverwrites.edit(interaction.guild.roles.everyone, {
      SendMessages: false
    });
    
    const successEmbed = createMilitaryEmbed(
      "🔒 CANAL TRAVADO",
      `**${canal} foi travado com sucesso!**\n\nApenas administradores podem enviar mensagens.`,
      0xf39c12
    );
    
    await interaction.reply({ embeds: [successEmbed], ephemeral: true });
  } catch (error) {
    console.error("Erro ao travar canal:", error);
    const errorEmbed = createMilitaryEmbed(
      "❌ ERRO AO TRAVAR",
      "**Não foi possível travar o canal.**\n\nVerifique as permissões e tente novamente.",
      0xe74c3c
    );
    await interaction.reply({ embeds: [errorEmbed], ephemeral: true });
  }
}

async function handleUnlock(interaction, client) {
  const canal = interaction.options.getChannel("canal") || interaction.channel;
  
  if (!canal.isTextBased()) {
    const errorEmbed = createMilitaryEmbed(
      "❌ CANAL INVÁLIDO",
      "**Este comando só funciona em canais de texto.**",
      0xe74c3c
    );
    return interaction.reply({ embeds: [errorEmbed], ephemeral: true });
  }
  
  try {
    await canal.permissionOverwrites.edit(interaction.guild.roles.everyone, {
      SendMessages: null
    });
    
    const successEmbed = createMilitaryEmbed(
      "🔓 CANAL DESTRAVADO",
      `**${canal} foi destravado com sucesso!**\n\nTodos os membros podem enviar mensagens novamente.`,
      0x2ecc71
    );
    
    await interaction.reply({ embeds: [successEmbed], ephemeral: true });
  } catch (error) {
    console.error("Erro ao destravar canal:", error);
    const errorEmbed = createMilitaryEmbed(
      "❌ ERRO AO DESTRAVAR",
      "**Não foi possível destravar o canal.**\n\nVerifique as permissões e tente novamente.",
      0xe74c3c
    );
    await interaction.reply({ embeds: [errorEmbed], ephemeral: true });
  }
}