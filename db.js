import * as SQLite from 'expo-sqlite';

let db;

export const initializeDatabase = async () => {
  try {
    db = await SQLite.openDatabaseAsync('cart');
    
    // Создание таблицы должно выполняться отдельно
    await db.execAsync(`
      CREATE TABLE IF NOT EXISTS cart (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        title TEXT NOT NULL,
        price REAL,
        description TEXT
      );
    `);
    
    // Установка режима журнала
    await db.execAsync('PRAGMA journal_mode = WAL;');
    
    console.log('Database initialized successfully');
  } catch (error) {
    console.error('Failed to initialize database:', error);
  }
};

export const addToCart = async (product) => {
  try {
    if (!db) {
      throw new Error('Database is not initialized');
    }

    const result = await db.runAsync(
      'INSERT INTO cart (title, price, description) VALUES (?, ?, ?)',
      product.title,
      product.price,
      product.description
    );
    
    console.log('Item added to cart:', result);
    return result;
  } catch (error) {
    console.error('Error adding to cart:', error);
    throw error;
  }
};

export const getCartItems = async () => {
  try {
    if (!db) {
      throw new Error('Database is not initialized');
    }

    const allRows = await db.getAllAsync('SELECT * FROM cart');
    console.log('All items in the cart:', allRows);
    return allRows;
  } catch (error) {
    console.error('Error fetching cart items:', error);
    throw error;
  }
};

export const updateCartItem = async (id, newPrice) => {
  try {
    if (!db) {
      throw new Error('Database is not initialized');
    }

    const result = await db.runAsync(
      'UPDATE cart SET price = ? WHERE id = ?',
      newPrice,
      id
    );

    if (result.changes === 0) {
      console.warn('No item found to update for id:', id);
    } else {
      console.log('Item updated successfully:', result);
    }
    
    return result;
  } catch (error) {
    console.error('Error updating cart item:', error);
    throw error;
  }
};

export const removeCartItem = async (id) => {
  try {
    if (!db) {
      throw new Error('Database is not initialized');
    }

    const result = await db.runAsync(
      'DELETE FROM cart WHERE id = ?',
      id
    );

    if (result.changes === 0) {
      console.warn('No item found to delete for id:', id);
    } else {
      console.log('Item deleted successfully:', result);
    }
    
    return result;
  } catch (error) {
    console.error('Error deleting cart item:', error);
    throw error;
  }
};

export const clearCart = async () => {
  try {
    if (!db) {
      throw new Error('Database is not initialized');
    }

    const result = await db.runAsync('DELETE FROM cart');
    
    if (result.changes === 0) {
      console.warn('No items found to clear from the cart.');
    } else {
      console.log('All items deleted successfully:', result);
    }
    
    return result;
  } catch (error) {
    console.error('Error clearing the cart:', error);
    throw error;
  }
};