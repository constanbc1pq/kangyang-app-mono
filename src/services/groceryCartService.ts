import AsyncStorage from '@react-native-async-storage/async-storage';

const CART_STORAGE_KEY = '@kangyang_grocery_cart';

export interface GroceryCartItem {
  id: number;
  name: string;
  price: number;
  unit: string;
  image: string;
  quantity: number;
}

export interface GroceryCart {
  [productId: string]: number; // productId -> quantity
}

/**
 * 生鲜商城购物车服务
 * 管理生鲜商品购物车数据的持久化存储
 */
class GroceryCartService {
  /**
   * 获取购物车数据
   */
  async getCart(): Promise<GroceryCart> {
    try {
      const cartData = await AsyncStorage.getItem(CART_STORAGE_KEY);
      return cartData ? JSON.parse(cartData) : {};
    } catch (error) {
      console.error('获取购物车数据失败:', error);
      return {};
    }
  }

  /**
   * 保存购物车数据
   */
  async saveCart(cart: GroceryCart): Promise<void> {
    try {
      await AsyncStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cart));
    } catch (error) {
      console.error('保存购物车数据失败:', error);
    }
  }

  /**
   * 添加商品到购物车
   */
  async addToCart(productId: number, quantity: number = 1): Promise<GroceryCart> {
    const cart = await this.getCart();
    const currentQuantity = cart[productId] || 0;
    cart[productId] = currentQuantity + quantity;
    await this.saveCart(cart);
    return cart;
  }

  /**
   * 从购物车移除商品（减少数量）
   */
  async removeFromCart(productId: number): Promise<GroceryCart> {
    const cart = await this.getCart();
    if (cart[productId]) {
      if (cart[productId] > 1) {
        cart[productId]--;
      } else {
        delete cart[productId];
      }
      await this.saveCart(cart);
    }
    return cart;
  }

  /**
   * 更新商品数量
   */
  async updateQuantity(productId: number, quantity: number): Promise<GroceryCart> {
    const cart = await this.getCart();
    if (quantity <= 0) {
      delete cart[productId];
    } else {
      cart[productId] = quantity;
    }
    await this.saveCart(cart);
    return cart;
  }

  /**
   * 清空购物车
   */
  async clearCart(): Promise<void> {
    try {
      await AsyncStorage.removeItem(CART_STORAGE_KEY);
    } catch (error) {
      console.error('清空购物车失败:', error);
    }
  }

  /**
   * 获取购物车商品总数
   */
  async getCartItemCount(): Promise<number> {
    const cart = await this.getCart();
    return Object.values(cart).reduce((sum, count) => sum + count, 0);
  }

  /**
   * 获取购物车总价
   */
  getCartTotal(cart: GroceryCart, products: Array<{ id: number; price: number }>): number {
    return Object.entries(cart).reduce((sum, [id, count]) => {
      const product = products.find((p) => p.id === Number(id));
      return sum + (product?.price || 0) * count;
    }, 0);
  }
}

export const groceryCartService = new GroceryCartService();
