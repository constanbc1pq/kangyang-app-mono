/**
 * 全局购物车服务
 * 支持多种商品类型：套餐、服务、商品等
 */

import AsyncStorage from '@react-native-async-storage/async-storage';
import { Cart, CartItem, ItemType } from '@/types/commerce';

const CART_STORAGE_KEY = '@kangyang_cart';

/**
 * 初始化空购物车
 */
const initializeEmptyCart = (): Cart => {
  return {
    items: [],
    totalAmount: 0,
    totalDiscount: 0,
    lastModified: new Date().toISOString(),
  };
};

/**
 * 计算购物车总额
 */
const calculateCartTotals = (items: CartItem[]): { totalAmount: number; totalDiscount: number } => {
  let totalAmount = 0;
  let totalDiscount = 0;

  items.forEach(item => {
    const itemTotal = item.price * item.quantity;
    totalAmount += itemTotal;

    // 计算周期折扣
    if (item.cycleDiscount) {
      const discount = itemTotal * (1 - item.cycleDiscount);
      totalDiscount += discount;
    }
  });

  return {
    totalAmount: totalAmount - totalDiscount,
    totalDiscount,
  };
};

/**
 * 获取购物车
 */
export const getCart = async (): Promise<Cart> => {
  try {
    const jsonValue = await AsyncStorage.getItem(CART_STORAGE_KEY);

    if (jsonValue !== null) {
      return JSON.parse(jsonValue);
    } else {
      return initializeEmptyCart();
    }
  } catch (error) {
    console.error('获取购物车失败:', error);
    return initializeEmptyCart();
  }
};

/**
 * 保存购物车
 */
const saveCart = async (cart: Cart): Promise<boolean> => {
  try {
    cart.lastModified = new Date().toISOString();
    await AsyncStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cart));
    return true;
  } catch (error) {
    console.error('保存购物车失败:', error);
    return false;
  }
};

/**
 * 添加商品到购物车
 */
export const addToCart = async (item: Omit<CartItem, 'id' | 'addedAt'>): Promise<boolean> => {
  try {
    const cart = await getCart();

    // 检查是否已存在相同商品（相同商品ID和类型）
    const existingItemIndex = cart.items.findIndex(
      cartItem => cartItem.itemId === item.itemId && cartItem.itemType === item.itemType
    );

    if (existingItemIndex > -1) {
      // 已存在，增加数量
      cart.items[existingItemIndex].quantity += item.quantity;
    } else {
      // 不存在，添加新商品
      const newItem: CartItem = {
        ...item,
        id: `cart_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        addedAt: new Date().toISOString(),
      };
      cart.items.push(newItem);
    }

    // 重新计算总额
    const totals = calculateCartTotals(cart.items);
    cart.totalAmount = totals.totalAmount;
    cart.totalDiscount = totals.totalDiscount;

    return await saveCart(cart);
  } catch (error) {
    console.error('添加到购物车失败:', error);
    return false;
  }
};

/**
 * 更新购物车商品数量
 */
export const updateCartItemQuantity = async (cartItemId: string, quantity: number): Promise<boolean> => {
  try {
    const cart = await getCart();
    const itemIndex = cart.items.findIndex(item => item.id === cartItemId);

    if (itemIndex === -1) {
      return false;
    }

    if (quantity <= 0) {
      // 数量为0或负数，删除商品
      cart.items.splice(itemIndex, 1);
    } else {
      // 更新数量
      cart.items[itemIndex].quantity = quantity;
    }

    // 重新计算总额
    const totals = calculateCartTotals(cart.items);
    cart.totalAmount = totals.totalAmount;
    cart.totalDiscount = totals.totalDiscount;

    return await saveCart(cart);
  } catch (error) {
    console.error('更新购物车商品数量失败:', error);
    return false;
  }
};

/**
 * 从购物车移除商品
 */
export const removeFromCart = async (cartItemId: string): Promise<boolean> => {
  try {
    const cart = await getCart();
    cart.items = cart.items.filter(item => item.id !== cartItemId);

    // 重新计算总额
    const totals = calculateCartTotals(cart.items);
    cart.totalAmount = totals.totalAmount;
    cart.totalDiscount = totals.totalDiscount;

    return await saveCart(cart);
  } catch (error) {
    console.error('从购物车移除商品失败:', error);
    return false;
  }
};

/**
 * 清空购物车
 */
export const clearCart = async (): Promise<boolean> => {
  try {
    const emptyCart = initializeEmptyCart();
    return await saveCart(emptyCart);
  } catch (error) {
    console.error('清空购物车失败:', error);
    return false;
  }
};

/**
 * 获取购物车商品数量
 */
export const getCartItemCount = async (): Promise<number> => {
  try {
    const cart = await getCart();
    return cart.items.reduce((total, item) => total + item.quantity, 0);
  } catch (error) {
    console.error('获取购物车商品数量失败:', error);
    return 0;
  }
};

/**
 * 检查商品是否在购物车中
 */
export const isInCart = async (itemId: string, itemType: ItemType): Promise<boolean> => {
  try {
    const cart = await getCart();
    return cart.items.some(item => item.itemId === itemId && item.itemType === itemType);
  } catch (error) {
    console.error('检查购物车失败:', error);
    return false;
  }
};

/**
 * 获取购物车中指定类型的商品
 */
export const getCartItemsByType = async (itemType: ItemType): Promise<CartItem[]> => {
  try {
    const cart = await getCart();
    return cart.items.filter(item => item.itemType === itemType);
  } catch (error) {
    console.error('获取购物车指定类型商品失败:', error);
    return [];
  }
};

/**
 * 更新购物车商品元数据
 */
export const updateCartItemMetadata = async (
  cartItemId: string,
  metadata: Record<string, any>
): Promise<boolean> => {
  try {
    const cart = await getCart();
    const itemIndex = cart.items.findIndex(item => item.id === cartItemId);

    if (itemIndex === -1) {
      return false;
    }

    cart.items[itemIndex].metadata = {
      ...cart.items[itemIndex].metadata,
      ...metadata,
    };

    return await saveCart(cart);
  } catch (error) {
    console.error('更新购物车商品元数据失败:', error);
    return false;
  }
};