import { PermissionFlagsBits } from "discord.js";
import { createMilitaryEmbed } from '../utils/embeds.js';

export const commands = [
  {
    name: "anunciar",
    description: "📢 Cria um anúncio em um canal específico",
    default_member_permissions: PermissionFlagsBits.Administrator.toString(),
    options: [
      {
        name: "titulo",
        type: 3,
        description: "📝 Título do anúncio",
        required: true
      },
      {
        name: "mensagem",
        type: 3,
        description: "💬 Conteúdo do anúncio",
        required: true
      },
      {
        name: "canal",
        type: 7,
        description: "📢 Canal onde o anúncio será postado",
        required: false,
        channel_types: [0, 5] // Text channel, News channel
      },
      {
        name: "mencionar",
        type: 3,
        description: "🔔 Menção para incluir no anúncio",
        required: false,
        choices: [
          { name: "📢 @everyone", value: "@everyone" },
          { name: "📣 @here", value: "@here" },
          { name: "🎖️ @Membro Verificado", value: "@Membro Verificado" },
          { name: "🔕 Sem menção", value: "none" }
        ]
      }
    ]
  }
];

export async function execute(interaction, client) {
  const { commandName } = interaction;

  switch (commandName) {
    case "anunciar":
      await handleAnunciar(interaction, client);
      break;
  }
}

async function handleAnunciar(interaction, client) {
  if (!interaction.member.permissions.has(PermissionFlagsBits.Administrator)) {
    const deniedEmbed = createMilitaryEmbed(
      "ACESSO NEGADO",
      "🚫 **Permissão insuficiente!**\n\nApenas administradores podem usar este comando.",
      0xe74c3c
    );
    return interaction.reply({ embeds: [deniedEmbed], ephemeral: true });
  }

  const titulo = interaction.options.getString("titulo");
  const mensagem = interaction.options.getString("mensagem");
  const canalOption = interaction.options.getChannel("canal");
  const mencionar = interaction.options.getString("mencionar");

  const canal = canalOption || interaction.channel;

  await interaction.deferReply({ ephemeral: true });

  try {
    const anuncioEmbed = createMilitaryEmbed(
      `📢 ${titulo}`,
      mensagem,
      0xf39c12
    );

    anuncioEmbed
      .setFooter({ 
        text: `Anúncio por ${interaction.user.tag}`, 
        iconURL: interaction.user.displayAvatarURL() 
      })
      .setTimestamp();

    let content = "";
    if (mencionar && mencionar !== "none") {
      if (mencionar === "@Membro Verificado") {
        const role = interaction.guild.roles.cache.find(r => 
          r.name === "Membro Verificado" || r.name === "Verificado"
        );
        content = role ? role.toString() : "@everyone";
      } else {
        content = mencionar;
      }
    }

    await canal.send({ 
      content: content,
      embeds: [anuncioEmbed] 
    });

    const successEmbed = createMilitaryEmbed(
      "✅ ANÚNCIO PUBLICADO",
      `**Anúncio enviado com sucesso no canal ${canal}!**`,
      0x2ecc71,
      [
        {
          name: "📝 Título",
          value: titulo,
          inline: true
        },
        {
          name: "🔔 Menção",
          value: mencionar || "Nenhuma",
          inline: true
        },
        {
          name: "📊 Detalhes",
          value: 
            `**Canal:** ${canal}\n` +
            `**Por:** ${interaction.user.tag}\n` +
            `**Data:** <t:${Math.floor(Date.now() / 1000)}:F>`,
          inline: false
        }
      ]
    );

    await interaction.editReply({ embeds: [successEmbed] });

    // Log no canal de logs
    const logChannel = interaction.guild.channels.cache.find(
      c => c.name.toLowerCase() === "📥│・logs-gerais"
    );
    
    if (logChannel) {
      const logEmbed = createMilitaryEmbed(
        "📢 NOVO ANÚNCIO",
        `**Título:** ${titulo}\n**Autor:** ${interaction.user.tag}\n**Canal:** ${canal}\n**Menção:** ${mencionar || "Nenhuma"}`,
        0xf39c12
      );
      await logChannel.send({ embeds: [logEmbed] });
    }
  } catch (error) {
    console.error("Erro ao criar anúncio:", error);
    
    const errorEmbed = createMilitaryEmbed(
      "❌ ERRO AO ANUNCIAR",
      "**Não foi possível criar o anúncio.**\n\nVerifique:\n• Permissões do bot no canal\n• Configurações do servidor\n• Limites do Discord",
      0xe74c3c
    );
    
    await interaction.editReply({ embeds: [errorEmbed] });
  }
}