import { ActivityType } from 'discord.js';
export const statusList = [
  {
    name: 'Sistema Militar | /ajuda',
    type: ActivityType.Watching,
    status: 'online'
  },
  {
    name: 'Verificações de Contas',
    type: ActivityType.Watching,
    status: 'online'
  },
  {
    name: 'Patentes Militares',
    type: ActivityType.Playing,
    status: 'online'
  },
  {
    name: `${Math.floor(Math.random() * 1000)} soldados ativos`,
    type: ActivityType.Watching,
    status: 'online'
  },
  {
    name: 'Roblox Integration',
    type: ActivityType.Playing,
    status: 'online'
  },
  {
    name: 'Comandos Slash',
    type: ActivityType.Listening,
    status: 'online'
  },
  {
    name: 'Desenvolvido com ❤️',
    type: ActivityType.Playing,
    status: 'online'
  },
  {
    name: 'Online 24/7',
    type: ActivityType.Streaming,
    status: 'online',
    url: 'https://www.twitch.tv/directory/game/Roblox'
  },
  {
    name: 'Forças Armadas',
    type: ActivityType.Competing,
    status: 'online'
  },
  {
    name: 'Serviço Ativo',
    type: ActivityType.Custom,
    status: 'online'
  }
];

export const profileDescriptions = [
  "🎖️ Bot oficial do sistema militar",
  "🔗 Integração Roblox-Discord",
  "⚡ Verificação automática de contas",
  "📊 Gerenciamento de patentes",
  "🛡️ Servindo as forças armadas",
  "🌐 Conectando Roblox e Discord",
  "🔐 Sistema seguro de verificação",
  "🚀 Tecnologia de ponta militar",
  "💂 Bot de recrutamento militar",
  "🎯 Precisão e eficiência"
];

export function getRandomStatus() {
  const randomIndex = Math.floor(Math.random() * statusList.length);
  return statusList[randomIndex];
}

export function getRandomDescription() {
  const randomIndex = Math.floor(Math.random() * profileDescriptions.length);
  return profileDescriptions[randomIndex];
}

export function setupRotatingStatus(client, interval = 2 * 60 * 1000) {
  console.log('🔄 Iniciando sistema de status rotativo...');
  
  const updateStatus = () => {
    try {
      const randomStatus = getRandomStatus();
      
      client.user.setPresence({
        activities: [{
          name: randomStatus.name,
          type: randomStatus.type,
          url: randomStatus.url || null
        }],
        status: randomStatus.status
      });
      
      const activityType = getActivityTypeName(randomStatus.type);
      console.log(`🎮 Status atualizado: ${randomStatus.name} [${activityType}]`);
      
    } catch (error) {
      console.error('❌ Erro ao atualizar status:', error);
    }
  };
  
  updateStatus();
  const statusInterval = setInterval(updateStatus, interval);
  
  console.log(`✅ Status rotativo configurado (${interval / 60000} minutos)`);
  
  return statusInterval;
}

export function cycleStatusTypes(client) {
  const statusTypes = [
    {
      name: `📊 ${client.guilds.cache.size} servidores`,
      type: ActivityType.Watching
    },
    {
      name: `👥 ${client.users.cache.size} usuários`,
      type: ActivityType.Watching
    },
    {
      name: `🎖️ ${client.commands?.size || 0} comandos`,
      type: ActivityType.Playing
    },
    {
      name: '🟢 Online 24/7',
      type: ActivityType.Streaming,
      url: 'https://www.twitch.tv/directory/game/Roblox'
    },
    {
      name: '🔗 Conectando Roblox',
      type: ActivityType.Custom
    }
  ];
  
  let currentIndex = 0;
  
  return setInterval(() => {
    try {
      const status = statusTypes[currentIndex];
      client.user.setPresence({
        activities: [{
          name: status.name,
          type: status.type,
          url: status.url || null
        }],
        status: 'online'
      });
      
      console.log(`🔄 Status cíclico: ${status.name}`);
      currentIndex = (currentIndex + 1) % statusTypes.length;
      
    } catch (error) {
      console.error('❌ Erro no status cíclico:', error);
    }
  }, 3 * 60 * 1000);
}

function getActivityTypeName(type) {
  const typeNames = {
    [ActivityType.Playing]: 'Jogando',
    [ActivityType.Streaming]: 'Transmitindo',
    [ActivityType.Listening]: 'Ouvindo',
    [ActivityType.Watching]: 'Assistindo',
    [ActivityType.Custom]: 'Personalizado',
    [ActivityType.Competing]: 'Competindo'
  };
  
  return typeNames[type] || 'Desconhecido';
}

export function setupThemedStatus(client) {
  const updateThemedStatus = () => {
    const now = new Date();
    const hour = now.getHours();
    
    let themedStatus;
    
    if (hour >= 6 && hour < 12) {
      themedStatus = {
        name: '☀️ Treinamento Matinal',
        type: ActivityType.Playing
      };
    } else if (hour >= 12 && hour < 18) {
      themedStatus = {
        name: '🎖️ Operações Diárias',
        type: ActivityType.Watching
      };
    } else if (hour >= 18 && hour < 22) {
      themedStatus = {
        name: '🌙 Patrulha Noturna',
        type: ActivityType.Streaming,
        url: 'https://www.twitch.tv/directory/game/Roblox'
      };
    } else {
      themedStatus = {
        name: '🌜 Vigília Noturna',
        type: ActivityType.Watching
      };
    }
    
    try {
      client.user.setPresence({
        activities: [{
          name: themedStatus.name,
          type: themedStatus.type,
          url: themedStatus.url || null
        }],
        status: 'online'
      });
      
      console.log(`🎭 Status temático: ${themedStatus.name} (${getActivityTypeName(themedStatus.type)})`);
    } catch (error) {
      console.error('❌ Erro no status temático:', error);
    }
  };
  
  updateThemedStatus();
  const themedInterval = setInterval(updateThemedStatus, 60 * 60 * 1000);
  
  console.log('✅ Status temático configurado (atualiza a cada hora)');
  return themedInterval;
}

export function setupSpecialEventsStatus(client) {
  const now = new Date();
  const month = now.getMonth() + 1;
  const day = now.getDate();
  
  let specialStatus = null;
  
  if (month === 1 && day === 1) {
    specialStatus = { name: '🎉 Feliz Ano Novo!', type: ActivityType.Celebrating };
  } else if (month === 9 && day === 7) {
    specialStatus = { name: '🇧🇷 Independência do Brasil', type: ActivityType.Competing };
  } else if (month === 12 && day === 25) {
    specialStatus = { name: '🎄 Feliz Natal!', type: ActivityType.Custom };
  } else if (month === 4 && day === 1) {
    specialStatus = { name: '🎭 Dia da Mentira Militar', type: ActivityType.Playing };
  } else if (month === 5 && day === 1) {
    specialStatus = { name: '🛠️ Dia do Trabalho', type: ActivityType.Custom };
  }
  
  if (specialStatus) {
    try {
      client.user.setPresence({
        activities: [{
          name: specialStatus.name,
          type: specialStatus.type
        }],
        status: 'online'
      });
      
      console.log(`🎪 Status especial: ${specialStatus.name}`);
      return true;
    } catch (error) {
      console.error('❌ Erro no status especial:', error);
    }
  }
  
  return false;
}