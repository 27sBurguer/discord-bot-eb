// firebase.js
import { initializeApp } from 'firebase/app';
import { 
  getFirestore, 
  collection, 
  doc, 
  getDoc, 
  getDocs, 
  setDoc, 
  updateDoc, 
  deleteDoc, // ← ADICIONE ESTE IMPORT
  query, 
  where, 
  orderBy, 
  limit, 
  addDoc,
  increment,
} from 'firebase/firestore';

// ✅ SUAS CREDENCIAIS DO FIREBASE - SUBSTITUA COM AS SUAS!
const firebaseConfig = {
  apiKey: process.env.FIREBASE_API_KEY,
  authDomain: process.env.FIREBASE_AUTH_DOMAIN,
  projectId: process.env.FIREBASE_PROJECT_ID,
  storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.FIREBASE_APP_ID
};

// Inicializar Firebase
const app = initializeApp(firebaseConfig);

// Inicializar Firestore
const db = getFirestore(app);

// ============================================================
// 👤 FUNÇÕES DE USUÁRIO
// ============================================================

/**
 * Busca ou cria um usuário no banco de dados - CORRIGIDA
 */
export async function getUser(userId) {
  try {
    const userRef = doc(db, 'users', userId);
    const userSnap = await getDoc(userRef);
    
    if (userSnap.exists()) {
      const userData = userSnap.data();
      console.log(`✅ Usuário ${userId} encontrado: ${userData.coins} Bellos`);
      return userData;
    } else {
      // Criar usuário se não existir
      console.log(`🆕 Criando novo usuário: ${userId}`);
      const defaultUser = {
        username: '',
        coins: 0,
        invites: 0,
        joinedAt: new Date(),
        totalTime: 0, // minutos
        purchases: [],
        lastDaily: null,
        createdAt: new Date()
      };
      await setDoc(userRef, defaultUser);
      console.log(`✅ Novo usuário criado: ${userId}`);
      return defaultUser;
    }
  } catch (error) {
    console.error('❌ Erro crítico ao buscar/criar usuário:', error);
    // Em caso de erro, retornar um usuário padrão
    return {
      username: '',
      coins: 0,
      invites: 0,
      joinedAt: new Date(),
      totalTime: 0,
      purchases: [],
      lastDaily: null
    };
  }
}

/**
 * Atualiza as moedas de um usuário - CORRIGIDA
 */
export async function updateUserCoins(userId, amount) {
  try {
    // PRIMEIRO garantir que o usuário existe
    await getUser(userId);
    
    // DEPOIS atualizar as moedas
    const userRef = doc(db, 'users', userId);
    await updateDoc(userRef, {
      coins: increment(amount)
    });
    
    console.log(`💰 Moedas atualizadas: ${userId} -> ${amount}`);
    
    // Buscar dados atualizados para log
    const updatedUser = await getUser(userId);
    console.log(`📊 Saldo atualizado: ${updatedUser.coins} Bellos`);
    
  } catch (error) {
    console.error('❌ Erro ao atualizar moedas:', error);
    throw error;
  }
}

/**
 * Adiciona um convite para o usuário (função legada - manter para compatibilidade)
 */
export async function addUserInvite(userId) {
  try {
    const userRef = doc(db, 'users', userId);
    await updateDoc(userRef, {
      invites: increment(1)
      // REMOVEMOS A RECOMPENSA DAQUI - agora é gerenciada pelo registerInvite
    });
    console.log(`📊 Estatística de convite atualizada para: ${userId}`);
  } catch (error) {
    console.error('❌ Erro ao atualizar estatística de convite:', error);
    throw error;
  }
}

/**
 * Atualiza o tempo do usuário no servidor
 */
export async function updateUserTime(userId, minutes) {
  try {
    const userRef = doc(db, 'users', userId);
    await updateDoc(userRef, {
      totalTime: increment(minutes),
      coins: increment(minutes * 0.1) // 0.1 moeda por minuto
    });
    console.log(`⏰ Tempo atualizado: ${userId} -> ${minutes} minutos`);
  } catch (error) {
    console.error('❌ Erro ao atualizar tempo:', error);
    throw error;
  }
}

// ============================================================
// 🛍️ FUNÇÕES DE CATÁLOGO
// ============================================================

/**
 * Busca todos os itens disponíveis no catálogo
 */
export async function getCatalogItems() {
  try {
    const itemsRef = collection(db, 'items');
    const q = query(itemsRef, where('available', '==', true));
    const querySnapshot = await getDocs(q);
    
    const items = [];
    querySnapshot.forEach((doc) => {
      items.push({ 
        id: doc.id, 
        ...doc.data() 
      });
    });
    
    console.log(`📦 ${items.length} itens encontrados no catálogo`);
    return items;
  } catch (error) {
    console.error('❌ Erro ao buscar itens do catálogo:', error);
    return [];
  }
}

/**
 * Busca um item específico pelo ID
 */
// firebase.js - Melhorar a função getItem para debug
export async function getItem(itemId) {
  try {
    const { doc, getDoc } = await import('firebase/firestore');
    
    const itemRef = doc(db, 'items', itemId);
    const itemSnap = await getDoc(itemRef);
    
    if (itemSnap.exists()) {
      const itemData = itemSnap.data();
      console.log('🔍 Item encontrado no Firebase:', { // DEBUG
        id: itemSnap.id,
        ...itemData,
        discountCoupons: itemData.discountCoupons || []
      });
      return {
        id: itemSnap.id,
        ...itemData,
        discountCoupons: itemData.discountCoupons || [] // Garantir array vazio se não existir
      };
    } else {
      console.log('❌ Item não encontrado no Firebase:', itemId);
      return null;
    }
  } catch (error) {
    console.error('❌ Erro ao buscar item:', error);
    throw error;
  }
}

// firebase.js - Função de debug para ver todos os itens
export async function debugCatalogItems() {
  try {
    const { collection, getDocs } = await import('firebase/firestore');
    
    const itemsCollection = collection(db, 'items');
    const itemsSnapshot = await getDocs(itemsCollection);
    const items = [];
    
    itemsSnapshot.forEach(doc => {
      const data = doc.data();
      items.push({
        id: doc.id,
        ...data,
        discountCoupons: data.discountCoupons || []
      });
    });
    
    console.log('📋 TODOS OS ITENS NO CATÁLOGO (DEBUG):');
    items.forEach(item => {
      console.log(`🛍️ ${item.image} ${item.name} (ID: ${item.id})`);
      console.log(`   Cupons:`, item.discountCoupons);
      console.log(`   ---`);
    });
    
    return items;
  } catch (error) {
    console.error('❌ Erro ao buscar itens para debug:', error);
    throw error;
  }
}

// firebase.js - Adicione esta função
export async function savePurchaseInfo(messageId, purchaseData) {
  try {
    console.log('📝 Salvando informações da compra no Firebase...');
    console.log('Message ID:', messageId);
    console.log('Dados da compra:', purchaseData);
    
    const purchaseRef = doc(db, 'purchaseMessages', messageId);
    await setDoc(purchaseRef, {
      ...purchaseData,
      createdAt: new Date(),
      status: 'pending_delivery'
    });
    
    console.log('✅ Informações da compra salvas com sucesso!');
    return true;
  } catch (error) {
    console.error('❌ Erro ao salvar informações da compra:', error);
    return false;
  }
}

// Função para marcar compra como entregue
export async function markAsDelivered(messageId) {
  try {
    const purchaseRef = doc(db, 'purchaseMessages', messageId);
    const purchaseSnap = await getDoc(purchaseRef);
    
    if (!purchaseSnap.exists()) {
      console.log('Compra não encontrada para messageId:', messageId);
      return null;
    }

    const purchaseData = purchaseSnap.data();
    
    // Atualizar status para entregue
    await updateDoc(purchaseRef, {
      status: 'delivered',
      deliveredAt: new Date(),
      deliveredBy: purchaseData.deliveredBy || 'system' // Você pode passar quem entregou
    });

    console.log('Compra marcada como entregue:', messageId);
    return purchaseData;
    
  } catch (error) {
    console.error('Erro ao marcar compra como entregue:', error);
    throw error;
  }
}

// Função para obter todas as compras pendentes de entrega
export async function getPendingDeliveries() {
  try {
    const purchasesRef = collection(db, 'purchaseMessages');
    const q = query(purchasesRef, where('status', '==', 'pending_delivery'));
    const querySnapshot = await getDocs(q);
    
    const pendingDeliveries = [];
    querySnapshot.forEach((doc) => {
      pendingDeliveries.push({
        id: doc.id,
        ...doc.data()
      });
    });
    
    return pendingDeliveries;
  } catch (error) {
    console.error('Erro ao buscar entregas pendentes:', error);
    return [];
  }
}

/**
 * Adiciona um novo item ao catálogo
 */
export async function addCatalogItem(itemData) {
  try {
    const { collection, addDoc, serverTimestamp } = await import('firebase/firestore');
    
    console.log('📝 Adicionando item ao catálogo:', itemData); // DEBUG
    
    const itemToAdd = {
      name: itemData.name,
      description: itemData.description,
      coinPrice: itemData.coinPrice,
      pixPrice: itemData.pixPrice,
      category: itemData.category,
      image: itemData.image,
      available: itemData.available !== undefined ? itemData.available : true,
      discountCoupons: itemData.discountCoupons || [], // GARANTIR que seja um array
      createdAt: serverTimestamp ? serverTimestamp() : new Date(),
      updatedAt: serverTimestamp ? serverTimestamp() : new Date()
    };

    console.log('📦 Item preparado para salvar:', itemToAdd); // DEBUG
    
    const itemsCollection = collection(db, 'items');
    const docRef = await addDoc(itemsCollection, itemToAdd);
    
    console.log('✅ Item adicionado com ID:', docRef.id);
    console.log('🎫 Cupons salvos:', itemToAdd.discountCoupons); // DEBUG
    
    return docRef.id;
  } catch (error) {
    console.error('❌ Erro ao adicionar item:', error);
    throw error;
  }
}

// ============================================================
// 💰 FUNÇÕES DE COMPRAS
// ============================================================

/**
 * Cria uma nova compra
 */
// Atualize a função createPurchase existente ou adicione esta versão melhorada
export async function createPurchase(purchaseData) {
  try {
    const purchasesRef = collection(db, 'purchases');
    const purchaseDoc = await addDoc(purchasesRef, {
      ...purchaseData,
      createdAt: new Date(),
      updatedAt: new Date()
    });

    console.log('Compra registrada com ID:', purchaseDoc.id);
    return purchaseDoc.id;
  } catch (error) {
    console.error('Erro ao registrar compra:', error);
    throw error;
  }
}

// Função para buscar informações da compra pelo messageId
export async function getPurchaseInfo(messageId) {
  try {
    console.log('🔍 Buscando informações da compra para messageId:', messageId);
    
    const purchaseRef = doc(db, 'purchaseMessages', messageId);
    const purchaseSnap = await getDoc(purchaseRef);
    
    if (purchaseSnap.exists()) {
      const data = purchaseSnap.data();
      console.log('✅ Informações encontradas:', data);
      return data;
    } else {
      console.log('❌ Nenhuma informação encontrada para messageId:', messageId);
      return null;
    }
  } catch (error) {
    console.error('❌ Erro ao buscar informações da compra:', error);
    return null;
  }
}

// ============================================================
// 🏆 FUNÇÕES DE RANKING
// ============================================================

/**
 * Busca o leaderboard de moedas
 */
export async function getLeaderboard(limitCount = 10) {
  try {
    const usersRef = collection(db, 'users');
    const q = query(usersRef, orderBy('coins', 'desc'), limit(limitCount));
    const querySnapshot = await getDocs(q);
    
    const leaderboard = [];
    querySnapshot.forEach((doc) => {
      leaderboard.push({ 
        id: doc.id, 
        ...doc.data() 
      });
    });
    
    console.log(`🏆 Leaderboard gerado: ${leaderboard.length} usuários`);
    return leaderboard;
  } catch (error) {
    console.error('❌ Erro ao buscar leaderboard:', error);
    return [];
  }
}

// ============================================================
// 🎯 FUNÇÃO DE TESTE
// ============================================================

/**
 * Função para testar a conexão com o Firebase
 */
export async function testFirebaseConnection() {
  try {
    console.log('🔗 Testando conexão com Firebase...');
    
    // Tentar acessar uma coleção qualquer
    const testRef = collection(db, 'test');
    await getDocs(testRef);
    
    console.log('✅ Conexão com Firebase estabelecida com sucesso!');
    return true;
  } catch (error) {
    console.error('❌ Falha na conexão com Firebase:', error);
    return false;
  }
}

// ============================================================
// 👥 FUNÇÕES DE CONVITES
// ============================================================

/**
 * Registra um convite e verifica se é válido - CORRIGIDA
 */
export async function registerInvite(inviterId, invitedId) {
  try {
    console.log(`🔍 Verificando convite: ${inviterId} -> ${invitedId}`);
    
    // PRIMEIRO garantir que ambos os usuários existem
    console.log(`👤 Criando/verificando convidador: ${inviterId}`);
    await getUser(inviterId);
    
    console.log(`👤 Criando/verificando convidado: ${invitedId}`);
    await getUser(invitedId);
    
    // Verificar se o convidado já foi registrado antes
    const inviteRef = doc(db, 'invites', `${inviterId}_${invitedId}`);
    const inviteSnap = await getDoc(inviteRef);
    
    if (inviteSnap.exists()) {
      console.log(`❌ Convite já registrado: ${inviterId} -> ${invitedId}`);
      return { success: false, reason: 'already_registered' };
    }
    
    // Registrar o convite
    console.log(`📝 Registrando novo convite...`);
    await setDoc(inviteRef, {
      inviterId,
      invitedId,
      createdAt: new Date(),
      rewarded: true
    });
    
    // Dar recompensa ao convidador
    console.log(`🎁 Dando recompensa de 100 moedas...`);
    await updateUserCoins(inviterId, 100);
    
    console.log(`✅ Convite registrado: ${inviterId} -> ${invitedId} (+100 moedas)`);
    return { success: true };
    
  } catch (error) {
    console.error('❌ Erro ao registrar convite:', error);
    return { success: false, reason: 'error' };
  }
}

/**
 * Verifica se um usuário já foi convidado por alguém
 */
export async function hasUserBeenInvited(userId) {
  try {
    const invitesRef = collection(db, 'invites');
    const q = query(invitesRef, where('invitedId', '==', userId));
    const querySnapshot = await getDocs(q);
    
    return !querySnapshot.empty;
  } catch (error) {
    console.error('❌ Erro ao verificar convites:', error);
    return false;
  }
}

/**
 * Busca todos os convites de um usuário
 */
export async function getUserInvites(userId) {
  try {
    const invitesRef = collection(db, 'invites');
    const q = query(invitesRef, where('inviterId', '==', userId));
    const querySnapshot = await getDocs(q);
    
    const invites = [];
    querySnapshot.forEach((doc) => {
      invites.push({ id: doc.id, ...doc.data() });
    });
    
    return invites;
  } catch (error) {
    console.error('❌ Erro ao buscar convites:', error);
    return [];
  }
}

/**
 * Força a criação de um usuário no banco (útil para testes)
 */
export async function forceCreateUser(userId, userData = {}) {
  try {
    const userRef = doc(db, 'users', userId);
    const defaultData = {
      username: '',
      coins: 0,
      invites: 0,
      joinedAt: new Date(),
      totalTime: 0,
      purchases: [],
      lastDaily: null,
      createdAt: new Date(),
      ...userData
    };
    
    await setDoc(userRef, defaultData);
    console.log(`✅ Usuário forçado criado: ${userId}`);
    return defaultData;
  } catch (error) {
    console.error('❌ Erro ao forçar criação de usuário:', error);
    throw error;
  }
}

// ============================================================
// 🛍️ FUNÇÕES DE INICIALIZAÇÃO DO CATÁLOGO
// ============================================================

/**
 * Inicializa o catálogo com itens padrão
 */
export async function initializeCatalog() {
  try {
    console.log('🛍️ Inicializando catálogo...');
    
    const defaultItems = [
      // {
      //   name: "R$ 150,00 no Jogo",
      //   description: "Obtenha R$ 150,00 em dinheiro do jogo",
      //   coinPrice: 1250,
      //   pixPrice: 15.00,
      //   category: "dinheiro",
      //   available: true,
      //   image: "💰",
      //   discountCoupons: [
      //     { code: "PRIMEIRACOMPRA", discount: 0.10, description: "10% off primeira compra" },
      //     { code: "BELLINHO50", discount: 0.05, description: "5% off cupom Bellinho" }
      //   ]
      // },
    ];

    let itemsCreated = 0;
    
    for (const item of defaultItems) {
      // Verificar se o item já existe
      const itemsRef = collection(db, 'items');
      const q = query(itemsRef, where('name', '==', item.name));
      const querySnapshot = await getDocs(q);
      
      if (querySnapshot.empty) {
        await addDoc(itemsRef, {
          ...item,
          createdAt: new Date(),
          updatedAt: new Date()
        });
        itemsCreated++;
        console.log(`✅ Item criado: ${item.name}`);
      }
    }
    
    console.log(`🛍️ Catálogo inicializado: ${itemsCreated} novos itens criados`);
    return itemsCreated;
    
  } catch (error) {
    console.error('❌ Erro ao inicializar catálogo:', error);
    return 0;
  }
}

// firebase.js - Adicione estas funções

// Função para deletar item do catálogo
export async function deleteCatalogItem(itemId) {
  try {
    const itemRef = doc(db, 'items', itemId);
    await deleteDoc(itemRef);
    console.log(`✅ Item ${itemId} deletado com sucesso`);
    return true;
  } catch (error) {
    console.error("❌ Erro ao deletar item:", error);
    throw error;
  }
}

// Função para atualizar item do catálogo (se necessário para edititem também)
export async function updateCatalogItem(itemId, updateData) {
  try {
    const itemRef = doc(db, 'items', itemId);
    await updateDoc(itemRef, {
      ...updateData,
      updatedAt: new Date()
    });
    console.log(`✅ Item ${itemId} atualizado com sucesso`);
    return true;
  } catch (error) {
    console.error("❌ Erro ao atualizar item:", error);
    throw error;
  }
}

// ============================================================
// 🎯 SISTEMA DE RECOMPENSA DIÁRIA
// ============================================================

// Função para obter informações da recompensa diária do usuário
export async function getDailyReward(userId) {
  try {
    const rewardRef = doc(db, 'dailyRewards', userId);
    const rewardSnap = await getDoc(rewardRef);
    
    if (rewardSnap.exists()) {
      return rewardSnap.data();
    } else {
      // Criar registro inicial
      const initialData = {
        userId: userId,
        lastClaim: null,
        streak: 0,
        totalClaims: 0,
        totalCoinsEarned: 0,
        createdAt: new Date()
      };
      await setDoc(rewardRef, initialData);
      return initialData;
    }
  } catch (error) {
    console.error('Erro ao buscar recompensa diária:', error);
    return null;
  }
}

// Função para claim da recompensa diária
export async function claimDailyReward(userId) {
  try {
    const rewardRef = doc(db, 'dailyRewards', userId);
    const rewardData = await getDailyReward(userId);
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    
    // Verificar se já claim hoje
    if (rewardData.lastClaim) {
      const lastClaimDate = new Date(rewardData.lastClaim.seconds * 1000);
      const lastClaimDay = new Date(lastClaimDate.getFullYear(), lastClaimDate.getMonth(), lastClaimDate.getDate());
      
      if (lastClaimDay.getTime() === today.getTime()) {
        return { 
          success: false, 
          message: 'Você já resgatou sua recompensa diária hoje!',
          nextClaim: getNextClaimTime(lastClaimDate)
        };
      }
      
      // Verificar streak (se claim foi ontem)
      const yesterday = new Date(today);
      yesterday.setDate(yesterday.getDate() - 1);
      
      if (lastClaimDay.getTime() === yesterday.getTime()) {
        // Mantém o streak
        rewardData.streak += 1;
      } else if (lastClaimDay.getTime() < yesterday.getTime()) {
        // Quebrou o streak
        rewardData.streak = 1;
      }
    } else {
      // Primeira vez
      rewardData.streak = 1;
    }
    
    // Calcular recompensa base + bônus de streak
    const baseReward = 100; // 1.000 Bellos base
    const streakBonus = Math.min(rewardData.streak * 50, 500); // +50 por dia, máximo 500
    const totalReward = baseReward + streakBonus;
    
    // Atualizar dados
    const updateData = {
      lastClaim: new Date(),
      streak: rewardData.streak,
      totalClaims: rewardData.totalClaims + 1,
      totalCoinsEarned: rewardData.totalCoinsEarned + totalReward,
      updatedAt: new Date()
    };
    
    await updateDoc(rewardRef, updateData);
    
    // Adicionar coins ao usuário
    await updateUserCoins(userId, totalReward);
    
    return {
      success: true,
      reward: totalReward,
      baseReward: baseReward,
      streakBonus: streakBonus,
      streak: rewardData.streak,
      nextClaim: getNextClaimTime(new Date())
    };
    
  } catch (error) {
    console.error('Erro ao claim recompensa diária:', error);
    return { success: false, message: 'Erro ao processar recompensa.' };
  }
}

// Função auxiliar para calcular próximo claim
function getNextClaimTime(lastClaim) {
  const nextClaim = new Date(lastClaim);
  nextClaim.setDate(nextClaim.getDate() + 1);
  nextClaim.setHours(0, 0, 0, 0);
  return nextClaim;
}

// Função para obter ranking de streaks - CORRIGIDA
export async function getStreakRanking(limitCount = 10) {
  try {
    const rewardsRef = collection(db, 'dailyRewards');
    
    // ✅ CORREÇÃO: Usar limitCount como variável, não a função diretamente
    const q = query(
      rewardsRef, 
      orderBy('streak', 'desc'), 
      orderBy('totalClaims', 'desc'), // Ordem secundária
      limit(limitCount) // ✅ CORRETO: função limit com o parâmetro
    );
    
    const querySnapshot = await getDocs(q);
    
    const ranking = [];
    querySnapshot.forEach((doc) => {
      const data = doc.data();
      // Filtrar usuários com streak válido
      if (data.streak > 0) {
        ranking.push({
          userId: doc.id,
          ...data
        });
      }
    });
    
    console.log(`✅ Ranking encontrado: ${ranking.length} usuários`);
    return ranking;
    
  } catch (error) {
    console.error('❌ Erro ao buscar ranking:', error);
    
    // Se der erro no orderBy, tentar sem ordenação
    try {
      console.log('🔄 Tentando busca alternativa...');
      const rewardsRef = collection(db, 'dailyRewards');
      const querySnapshot = await getDocs(rewardsRef);
      
      const allUsers = [];
      querySnapshot.forEach((doc) => {
        const data = doc.data();
        if (data.streak > 0) {
          allUsers.push({
            userId: doc.id,
            ...data
          });
        }
      });
      
      // Ordenar manualmente
      allUsers.sort((a, b) => b.streak - a.streak);
      return allUsers.slice(0, limitCount);
      
    } catch (fallbackError) {
      console.error('❌ Erro na busca alternativa:', fallbackError);
      return [];
    }
  }
}

// ============================================================
// 🎁 SISTEMA DE LOOTBOX
// ============================================================

// Função para comprar e abrir lootbox
// Função para comprar e abrir lootbox - COM RARIDADES CORRIGIDAS
export async function openLootbox(userId) {
  try {
    const userData = await getUser(userId);
    
    // Verificar se tem Bellos suficientes
    if (userData.coins < 30) {
      return { 
        success: false, 
        message: 'Bellos insuficientes! Você precisa de 30 Bellos para comprar uma lootbox.' 
      };
    }

    // Lista de códigos e itens com raridades CORRIGIDAS
    const lootboxItems = [
      { code: 'exb-fsedmkci', item: 'Dino Rosa', rarity: 'Comum' },
      { code: 'exb-rgfxcv', item: 'Dino Verde', rarity: 'Comum' },
      { code: 'exb-wasedko', item: 'Dominus Branco', rarity: 'Raro' },
      { code: 'exb-ekrgopl', item: 'Dominus Vermelho', rarity: 'Épico' },
      { code: 'exb-kerfopdil', item: 'Dominus Esqueleto', rarity: 'Lendário' },
      { code: 'exb-kemiosdf', item: 'Esqueleto Branco', rarity: 'Épico' },
      { code: 'exb-eikorfdgms', item: 'Esqueleto Vermelho', rarity: 'Épico' }
    ];

    // Sistema de raridade (probabilidades) ATUALIZADO
    const getRandomItem = () => {
      const random = Math.random() * 100;
      
      if (random < 60) { // 60% - Comum (2 itens)
        return lootboxItems.filter(item => item.rarity === 'Comum');
      } else if (random < 85) { // 25% - Raro (1 item)
        return lootboxItems.filter(item => item.rarity === 'Raro');
      } else if (random < 98) { // 13% - Épico (3 itens)
        return lootboxItems.filter(item => item.rarity === 'Épico');
      } else { // 2% - Lendário (1 item)
        return lootboxItems.filter(item => item.rarity === 'Lendário');
      }
    };

    // Selecionar item aleatório
    const availableItems = getRandomItem();
    const wonItem = availableItems[Math.floor(Math.random() * availableItems.length)];

    // Verificar se o usuário já tem esse código
    const userCodes = userData.lootboxCodes || [];
    const hasDuplicate = userCodes.some(code => code.code === wonItem.code);

    // Deduzir Bellos
    await updateUserCoins(userId, -30);

    // Salvar código no usuário
    const newCode = {
      code: wonItem.code,
      item: wonItem.item,
      rarity: wonItem.rarity,
      obtainedAt: new Date(),
      isDuplicate: hasDuplicate
    };

    userCodes.push(newCode);
    await updateDoc(doc(db, 'users', userId), {
      lootboxCodes: userCodes,
      totalLootboxes: (userData.totalLootboxes || 0) + 1
    });

    return {
      success: true,
      item: wonItem,
      isDuplicate: hasDuplicate,
      userCoins: userData.coins - 30,
      totalLootboxes: (userData.totalLootboxes || 0) + 1
    };

  } catch (error) {
    console.error('Erro ao abrir lootbox:', error);
    return { success: false, message: 'Erro ao processar lootbox.' };
  }
}

// Função para ver códigos do usuário
export async function getUserLootboxCodes(userId) {
  try {
    const userData = await getUser(userId);
    return userData.lootboxCodes || [];
  } catch (error) {
    console.error('Erro ao buscar códigos:', error);
    return [];
  }
}

// Função para ver estatísticas de lootbox
export async function getLootboxStats(userId) {
  try {
    const userData = await getUser(userId);
    const codes = userData.lootboxCodes || [];
    
    const stats = {
      totalOpened: userData.totalLootboxes || 0,
      totalCodes: codes.length,
      uniqueCodes: [...new Set(codes.map(c => c.code))].length,
      duplicates: codes.filter(c => c.isDuplicate).length,
      rarityCount: {
        Comum: codes.filter(c => c.rarity === 'Comum').length,
        Raro: codes.filter(c => c.rarity === 'Raro').length,
        Épico: codes.filter(c => c.rarity === 'Épico').length,
        Lendário: codes.filter(c => c.rarity === 'Lendário').length
      }
    };

    return stats;
  } catch (error) {
    console.error('Erro ao buscar estatísticas:', error);
    return null;
  }
}

// ============================================================
// 🎥 SISTEMA DE MONITORAMENTO DE LINKS DE VÍDEOS
// ============================================================

// Função para verificar e registrar link de vídeo
export async function checkAndRegisterVideoLink(userId, userTag, videoUrl, messageId) {
  try {
    console.log('🔍 Verificando link de vídeo:', videoUrl);
    
    // Verificar se é uma URL válida
    if (!isValidUrl(videoUrl)) {
      return { success: false, reason: 'URL inválida' };
    }

    // Verificar se é de uma plataforma de vídeo suportada
    if (!isSupportedVideoPlatform(videoUrl)) {
      return { success: false, reason: 'Plataforma não suportada' };
    }

    // Verificar se o link já foi postado (em qualquer data)
    const videosRef = collection(db, 'videoLinks');
    const q = query(videosRef, where('videoUrl', '==', videoUrl));
    const querySnapshot = await getDocs(q);
    
    if (!querySnapshot.empty) {
      console.log('❌ Link duplicado encontrado:', videoUrl);
      return { success: false, reason: 'Link duplicado' };
    }

    // Registrar o link
    const videoDoc = await addDoc(videosRef, {
      userId: userId,
      userTag: userTag,
      videoUrl: videoUrl,
      messageId: messageId,
      postedAt: new Date(),
      rewardGiven: false,
      platform: getVideoPlatform(videoUrl)
    });

    console.log('✅ Link registrado com sucesso:', videoDoc.id);
    return { 
      success: true, 
      videoId: videoDoc.id,
      platform: getVideoPlatform(videoUrl)
    };

  } catch (error) {
    console.error('❌ Erro ao verificar link de vídeo:', error);
    return { success: false, reason: 'Erro interno' };
  }
}

// Função para dar recompensa por link válido
export async function rewardVideoLink(videoId, userId) {
  try {
    const videoRef = doc(db, 'videoLinks', videoId);
    const videoSnap = await getDoc(videoRef);
    
    if (!videoSnap.exists()) {
      return { success: false, reason: 'Link não encontrado' };
    }

    const videoData = videoSnap.data();
    
    // Verificar se já foi recompensado
    if (videoData.rewardGiven) {
      return { success: false, reason: 'Recompensa já dada' };
    }

    // Dar 50 Bellos para o usuário
    await updateUserCoins(userId, 50);

    // Marcar como recompensado
    await updateDoc(videoRef, {
      rewardGiven: true,
      rewardedAt: new Date(),
      rewardAmount: 50
    });

    // Atualizar estatísticas do usuário
    const userRef = doc(db, 'users', userId);
    const userSnap = await getDoc(userRef);
    
    if (userSnap.exists()) {
      const userData = userSnap.data();
      await updateDoc(userRef, {
        totalVideosPosted: (userData.totalVideosPosted || 0) + 1,
        totalVideoRewards: (userData.totalVideoRewards || 0) + 50,
        lastVideoPosted: new Date()
      });
    }

    console.log('✅ Recompensa de 50 Bellos dada para usuário:', userId);
    return { success: true, reward: 50 };

  } catch (error) {
    console.error('❌ Erro ao dar recompensa:', error);
    return { success: false, reason: 'Erro interno' };
  }
}

// Função para obher estatísticas de vídeos do usuário
export async function getUserVideoStats(userId) {
  try {
    const videosRef = collection(db, 'videoLinks');
    const q = query(videosRef, where('userId', '==', userId));
    const querySnapshot = await getDocs(q);
    
    const videos = [];
    let totalRewards = 0;
    
    querySnapshot.forEach((doc) => {
      const data = doc.data();
      videos.push(data);
      if (data.rewardGiven) {
        totalRewards += data.rewardAmount || 50;
      }
    });

    return {
      totalVideos: videos.length,
      totalRewards: totalRewards,
      videos: videos.sort((a, b) => new Date(b.postedAt) - new Date(a.postedAt))
    };

  } catch (error) {
    console.error('Erro ao buscar estatísticas de vídeos:', error);
    return { totalVideos: 0, totalRewards: 0, videos: [] };
  }
}

// Funções auxiliares
function isValidUrl(string) {
  try {
    const url = new URL(string);
    return url.protocol === 'http:' || url.protocol === 'https:';
  } catch (_) {
    return false;
  }
}

function isSupportedVideoPlatform(url) {
  const supportedPlatforms = [
    'youtube.com',
    'youtu.be',
    'twitch.tv',
    'tiktok.com',
    'instagram.com',
    'twitter.com',
    'x.com',
    'facebook.com',
    'fb.watch',
    'vm.tiktok.com',
    'vt.tiktok.com'
  ];
  
  return supportedPlatforms.some(platform => url.includes(platform));
}

function getVideoPlatform(url) {
  if (url.includes('youtube.com') || url.includes('youtu.be')) return 'YouTube';
  if (url.includes('twitch.tv')) return 'Twitch';
  if (url.includes('tiktok.com') || url.includes('vt.tiktok.com') || url.includes('vm.tiktok.com')) return 'TikTok';
  if (url.includes('instagram.com')) return 'Instagram';
  if (url.includes('twitter.com') || url.includes('x.com')) return 'Twitter';
  if (url.includes('facebook.com') || url.includes('fb.watch')) return 'Facebook';
  return 'Outro';
}

export default db;