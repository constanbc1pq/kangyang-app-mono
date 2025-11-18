/**
 * 财产管理服务
 * 提供财产清单管理、资产/负债管理、净资产计算等功能
 */

import {
  PropertyInventory,
  Asset,
  Liability,
  LEGAL_SERVICE_STORAGE_KEYS,
} from '../types/legalService';
import {
  getPropertyInventories,
  getPropertyInventoryById as getLegalPropertyInventoryById,
  createPropertyInventory as createLegalPropertyInventory,
  updatePropertyInventory as updateLegalPropertyInventory,
} from './legalService';

/**
 * 创建财产清单
 */
export const createPropertyInventory = async (userId: string): Promise<PropertyInventory> => {
  const inventoryData: Omit<PropertyInventory, 'id' | 'createdAt' | 'updatedAt'> = {
    userId,
    assets: [],
    liabilities: [],
    totalAssets: 0,
    totalLiabilities: 0,
    netWorth: 0,
    lastUpdated: new Date().toISOString(),
  };

  return createLegalPropertyInventory(inventoryData);
};

/**
 * 获取用户的财产清单
 */
export const getPropertyInventory = async (userId: string): Promise<PropertyInventory | null> => {
  try {
    const inventories = await getPropertyInventories();
    return inventories.find(inventory => inventory.userId === userId) || null;
  } catch (error) {
    console.error('Error getting property inventory:', error);
    return null;
  }
};

/**
 * 根据ID获取财产清单
 */
export const getPropertyInventoryById = async (inventoryId: string): Promise<PropertyInventory | null> => {
  return getLegalPropertyInventoryById(inventoryId);
};

/**
 * 添加资产
 */
export const addAsset = async (inventoryId: string, assetData: Omit<Asset, 'id'>): Promise<PropertyInventory | null> => {
  try {
    const inventory = await getLegalPropertyInventoryById(inventoryId);
    if (!inventory) {
      throw new Error('财产清单不存在');
    }

    // 生成资产ID
    const newAsset: Asset = {
      ...assetData,
      id: `asset_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    };

    // 添加资产到清单
    const updatedAssets = [...inventory.assets, newAsset];

    // 重新计算总资产和净资产
    const totalAssets = updatedAssets.reduce((sum, asset) => sum + asset.value, 0);
    const netWorth = totalAssets - inventory.totalLiabilities;

    // 更新清单
    const updatedInventory = await updateLegalPropertyInventory(inventoryId, {
      assets: updatedAssets,
      totalAssets,
      netWorth,
      lastUpdated: new Date().toISOString(),
    });

    return updatedInventory;
  } catch (error) {
    console.error('Error adding asset:', error);
    throw error;
  }
};

/**
 * 更新资产
 */
export const updateAsset = async (
  inventoryId: string,
  assetId: string,
  data: Partial<Omit<Asset, 'id'>>
): Promise<PropertyInventory | null> => {
  try {
    const inventory = await getLegalPropertyInventoryById(inventoryId);
    if (!inventory) {
      throw new Error('财产清单不存在');
    }

    // 找到要更新的资产
    const assetIndex = inventory.assets.findIndex(asset => asset.id === assetId);
    if (assetIndex === -1) {
      throw new Error('资产不存在');
    }

    // 更新资产
    const updatedAssets = [...inventory.assets];
    updatedAssets[assetIndex] = {
      ...updatedAssets[assetIndex],
      ...data,
    };

    // 重新计算总资产和净资产
    const totalAssets = updatedAssets.reduce((sum, asset) => sum + asset.value, 0);
    const netWorth = totalAssets - inventory.totalLiabilities;

    // 更新清单
    const updatedInventory = await updateLegalPropertyInventory(inventoryId, {
      assets: updatedAssets,
      totalAssets,
      netWorth,
      lastUpdated: new Date().toISOString(),
    });

    return updatedInventory;
  } catch (error) {
    console.error('Error updating asset:', error);
    throw error;
  }
};

/**
 * 删除资产
 */
export const deleteAsset = async (inventoryId: string, assetId: string): Promise<PropertyInventory | null> => {
  try {
    const inventory = await getLegalPropertyInventoryById(inventoryId);
    if (!inventory) {
      throw new Error('财产清单不存在');
    }

    // 过滤掉要删除的资产
    const updatedAssets = inventory.assets.filter(asset => asset.id !== assetId);

    if (updatedAssets.length === inventory.assets.length) {
      throw new Error('资产不存在');
    }

    // 重新计算总资产和净资产
    const totalAssets = updatedAssets.reduce((sum, asset) => sum + asset.value, 0);
    const netWorth = totalAssets - inventory.totalLiabilities;

    // 更新清单
    const updatedInventory = await updateLegalPropertyInventory(inventoryId, {
      assets: updatedAssets,
      totalAssets,
      netWorth,
      lastUpdated: new Date().toISOString(),
    });

    return updatedInventory;
  } catch (error) {
    console.error('Error deleting asset:', error);
    throw error;
  }
};

/**
 * 添加负债
 */
export const addLiability = async (
  inventoryId: string,
  liabilityData: Omit<Liability, 'id'>
): Promise<PropertyInventory | null> => {
  try {
    const inventory = await getLegalPropertyInventoryById(inventoryId);
    if (!inventory) {
      throw new Error('财产清单不存在');
    }

    // 生成负债ID
    const newLiability: Liability = {
      ...liabilityData,
      id: `liability_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    };

    // 添加负债到清单
    const updatedLiabilities = [...inventory.liabilities, newLiability];

    // 重新计算总负债和净资产
    const totalLiabilities = updatedLiabilities.reduce((sum, liability) => sum + liability.amount, 0);
    const netWorth = inventory.totalAssets - totalLiabilities;

    // 更新清单
    const updatedInventory = await updateLegalPropertyInventory(inventoryId, {
      liabilities: updatedLiabilities,
      totalLiabilities,
      netWorth,
      lastUpdated: new Date().toISOString(),
    });

    return updatedInventory;
  } catch (error) {
    console.error('Error adding liability:', error);
    throw error;
  }
};

/**
 * 更新负债
 */
export const updateLiability = async (
  inventoryId: string,
  liabilityId: string,
  data: Partial<Omit<Liability, 'id'>>
): Promise<PropertyInventory | null> => {
  try {
    const inventory = await getLegalPropertyInventoryById(inventoryId);
    if (!inventory) {
      throw new Error('财产清单不存在');
    }

    // 找到要更新的负债
    const liabilityIndex = inventory.liabilities.findIndex(liability => liability.id === liabilityId);
    if (liabilityIndex === -1) {
      throw new Error('负债不存在');
    }

    // 更新负债
    const updatedLiabilities = [...inventory.liabilities];
    updatedLiabilities[liabilityIndex] = {
      ...updatedLiabilities[liabilityIndex],
      ...data,
    };

    // 重新计算总负债和净资产
    const totalLiabilities = updatedLiabilities.reduce((sum, liability) => sum + liability.amount, 0);
    const netWorth = inventory.totalAssets - totalLiabilities;

    // 更新清单
    const updatedInventory = await updateLegalPropertyInventory(inventoryId, {
      liabilities: updatedLiabilities,
      totalLiabilities,
      netWorth,
      lastUpdated: new Date().toISOString(),
    });

    return updatedInventory;
  } catch (error) {
    console.error('Error updating liability:', error);
    throw error;
  }
};

/**
 * 删除负债
 */
export const deleteLiability = async (inventoryId: string, liabilityId: string): Promise<PropertyInventory | null> => {
  try {
    const inventory = await getLegalPropertyInventoryById(inventoryId);
    if (!inventory) {
      throw new Error('财产清单不存在');
    }

    // 过滤掉要删除的负债
    const updatedLiabilities = inventory.liabilities.filter(liability => liability.id !== liabilityId);

    if (updatedLiabilities.length === inventory.liabilities.length) {
      throw new Error('负债不存在');
    }

    // 重新计算总负债和净资产
    const totalLiabilities = updatedLiabilities.reduce((sum, liability) => sum + liability.amount, 0);
    const netWorth = inventory.totalAssets - totalLiabilities;

    // 更新清单
    const updatedInventory = await updateLegalPropertyInventory(inventoryId, {
      liabilities: updatedLiabilities,
      totalLiabilities,
      netWorth,
      lastUpdated: new Date().toISOString(),
    });

    return updatedInventory;
  } catch (error) {
    console.error('Error deleting liability:', error);
    throw error;
  }
};

/**
 * 计算净资产
 */
export const calculateNetWorth = async (inventoryId: string): Promise<number> => {
  try {
    const inventory = await getLegalPropertyInventoryById(inventoryId);
    if (!inventory) {
      throw new Error('财产清单不存在');
    }

    // 计算总资产
    const totalAssets = inventory.assets.reduce((sum, asset) => sum + asset.value, 0);

    // 计算总负债
    const totalLiabilities = inventory.liabilities.reduce((sum, liability) => sum + liability.amount, 0);

    // 计算净资产
    const netWorth = totalAssets - totalLiabilities;

    // 更新清单
    await updateLegalPropertyInventory(inventoryId, {
      totalAssets,
      totalLiabilities,
      netWorth,
      lastUpdated: new Date().toISOString(),
    });

    return netWorth;
  } catch (error) {
    console.error('Error calculating net worth:', error);
    throw error;
  }
};

/**
 * 获取资产分类统计
 */
export const getAssetStatistics = async (inventoryId: string) => {
  try {
    const inventory = await getLegalPropertyInventoryById(inventoryId);
    if (!inventory) {
      throw new Error('财产清单不存在');
    }

    // 按类型分组统计资产
    const assetsByType = inventory.assets.reduce((acc, asset) => {
      if (!acc[asset.type]) {
        acc[asset.type] = {
          count: 0,
          totalValue: 0,
        };
      }
      acc[asset.type].count += 1;
      acc[asset.type].totalValue += asset.value;
      return acc;
    }, {} as Record<string, { count: number; totalValue: number }>);

    // 按类型分组统计负债
    const liabilitiesByType = inventory.liabilities.reduce((acc, liability) => {
      if (!acc[liability.type]) {
        acc[liability.type] = {
          count: 0,
          totalAmount: 0,
        };
      }
      acc[liability.type].count += 1;
      acc[liability.type].totalAmount += liability.amount;
      return acc;
    }, {} as Record<string, { count: number; totalAmount: number }>);

    return {
      assets: assetsByType,
      liabilities: liabilitiesByType,
      totalAssets: inventory.totalAssets,
      totalLiabilities: inventory.totalLiabilities,
      netWorth: inventory.netWorth,
    };
  } catch (error) {
    console.error('Error getting asset statistics:', error);
    throw error;
  }
};

export default {
  createPropertyInventory,
  getPropertyInventory,
  getPropertyInventoryById,
  addAsset,
  updateAsset,
  deleteAsset,
  addLiability,
  updateLiability,
  deleteLiability,
  calculateNetWorth,
  getAssetStatistics,
};
