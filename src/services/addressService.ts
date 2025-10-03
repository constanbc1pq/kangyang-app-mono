/**
 * 收货地址服务
 * 管理用户收货地址的增删改查
 */

import AsyncStorage from '@react-native-async-storage/async-storage';
import { Address, AddressList } from '@/types/commerce';

const ADDRESS_STORAGE_KEY = '@kangyang_addresses';

/**
 * 初始化默认地址数据
 */
const initializeDefaultAddress = (): Address => {
  const now = new Date().toISOString();
  return {
    id: 'addr_default_001',
    receiverName: '王健康',
    receiverPhone: '13800138000',
    province: '北京市',
    city: '北京市',
    district: '朝阳区',
    address: '望京SOHO T3座 2008室',
    isDefault: true,
    label: 'home',
    createdAt: now,
    updatedAt: now,
  };
};

/**
 * 获取地址列表
 */
export const getAddresses = async (): Promise<Address[]> => {
  try {
    const jsonValue = await AsyncStorage.getItem(ADDRESS_STORAGE_KEY);

    if (jsonValue !== null) {
      const addressList: AddressList = JSON.parse(jsonValue);
      return addressList.addresses;
    } else {
      // 首次使用，初始化默认地址
      const defaultAddress = initializeDefaultAddress();
      const addressList: AddressList = {
        addresses: [defaultAddress],
        defaultAddressId: defaultAddress.id,
        lastModified: new Date().toISOString(),
      };
      await AsyncStorage.setItem(ADDRESS_STORAGE_KEY, JSON.stringify(addressList));
      console.log('✅ 地址数据初始化完成');
      return [defaultAddress];
    }
  } catch (error) {
    console.error('获取地址列表失败:', error);
    return [initializeDefaultAddress()];
  }
};

/**
 * 保存地址列表
 */
const saveAddressList = async (addresses: Address[], defaultAddressId?: string): Promise<boolean> => {
  try {
    const addressList: AddressList = {
      addresses,
      defaultAddressId,
      lastModified: new Date().toISOString(),
    };
    await AsyncStorage.setItem(ADDRESS_STORAGE_KEY, JSON.stringify(addressList));
    return true;
  } catch (error) {
    console.error('保存地址列表失败:', error);
    return false;
  }
};

/**
 * 获取默认地址
 */
export const getDefaultAddress = async (): Promise<Address | null> => {
  try {
    const addresses = await getAddresses();
    const defaultAddress = addresses.find((addr) => addr.isDefault);
    return defaultAddress || (addresses.length > 0 ? addresses[0] : null);
  } catch (error) {
    console.error('获取默认地址失败:', error);
    return null;
  }
};

/**
 * 根据ID获取地址
 */
export const getAddressById = async (addressId: string): Promise<Address | null> => {
  try {
    const addresses = await getAddresses();
    return addresses.find((addr) => addr.id === addressId) || null;
  } catch (error) {
    console.error('获取地址失败:', error);
    return null;
  }
};

/**
 * 添加新地址
 */
export const addAddress = async (address: Omit<Address, 'id' | 'createdAt' | 'updatedAt'>): Promise<Address | null> => {
  try {
    const addresses = await getAddresses();
    const now = new Date().toISOString();

    // 生成新ID
    const newId = `addr_${Date.now()}`;

    const newAddress: Address = {
      ...address,
      id: newId,
      createdAt: now,
      updatedAt: now,
    };

    // 如果设置为默认地址，取消其他地址的默认状态
    if (newAddress.isDefault) {
      addresses.forEach((addr) => {
        addr.isDefault = false;
      });
    }

    addresses.push(newAddress);

    const defaultAddressId = newAddress.isDefault ? newId : addresses.find((addr) => addr.isDefault)?.id;
    const success = await saveAddressList(addresses, defaultAddressId);

    if (success) {
      console.log('✅ 地址添加成功');
      return newAddress;
    } else {
      return null;
    }
  } catch (error) {
    console.error('添加地址失败:', error);
    return null;
  }
};

/**
 * 更新地址
 */
export const updateAddress = async (
  addressId: string,
  updates: Partial<Omit<Address, 'id' | 'createdAt' | 'updatedAt'>>
): Promise<boolean> => {
  try {
    const addresses = await getAddresses();
    const addressIndex = addresses.findIndex((addr) => addr.id === addressId);

    if (addressIndex === -1) {
      return false;
    }

    // 如果设置为默认地址，取消其他地址的默认状态
    if (updates.isDefault) {
      addresses.forEach((addr, index) => {
        if (index !== addressIndex) {
          addr.isDefault = false;
        }
      });
    }

    addresses[addressIndex] = {
      ...addresses[addressIndex],
      ...updates,
      updatedAt: new Date().toISOString(),
    };

    const defaultAddressId = addresses.find((addr) => addr.isDefault)?.id;
    return await saveAddressList(addresses, defaultAddressId);
  } catch (error) {
    console.error('更新地址失败:', error);
    return false;
  }
};

/**
 * 删除地址
 */
export const deleteAddress = async (addressId: string): Promise<boolean> => {
  try {
    const addresses = await getAddresses();
    const addressToDelete = addresses.find((addr) => addr.id === addressId);

    if (!addressToDelete) {
      return false;
    }

    const filteredAddresses = addresses.filter((addr) => addr.id !== addressId);

    // 如果删除的是默认地址，设置第一个地址为默认
    if (addressToDelete.isDefault && filteredAddresses.length > 0) {
      filteredAddresses[0].isDefault = true;
    }

    const defaultAddressId = filteredAddresses.find((addr) => addr.isDefault)?.id;
    return await saveAddressList(filteredAddresses, defaultAddressId);
  } catch (error) {
    console.error('删除地址失败:', error);
    return false;
  }
};

/**
 * 设置默认地址
 */
export const setDefaultAddress = async (addressId: string): Promise<boolean> => {
  try {
    const addresses = await getAddresses();

    // 取消所有地址的默认状态
    addresses.forEach((addr) => {
      addr.isDefault = addr.id === addressId;
      if (addr.id === addressId) {
        addr.updatedAt = new Date().toISOString();
      }
    });

    return await saveAddressList(addresses, addressId);
  } catch (error) {
    console.error('设置默认地址失败:', error);
    return false;
  }
};

/**
 * 清除所有地址数据（用于测试或重置）
 */
export const clearAddresses = async (): Promise<boolean> => {
  try {
    await AsyncStorage.removeItem(ADDRESS_STORAGE_KEY);
    console.log('✅ 地址数据已清除');
    return true;
  } catch (error) {
    console.error('清除地址数据失败:', error);
    return false;
  }
};
