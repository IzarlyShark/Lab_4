import React, { useState } from 'react';
import { View, Text, FlatList, StyleSheet, ActivityIndicator, Button, Alert, TouchableOpacity } from 'react-native';
import { getCartItems, clearCart, removeCartItem } from '../db'; 
import { useFocusEffect } from '@react-navigation/native';

export default function CartScreen() {
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchCartItems = async () => {
    try {
      setLoading(true);
      const items = await getCartItems();
      setCartItems(items);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching cart items:', error);
      setLoading(false);
    }
  };

  const handleClearCart = async () => {
    try {
      await clearCart();
      setCartItems([]);
    } catch (error) {
      console.error('Error clearing cart:', error);
    }
  };

  const handleIncreaseQuantity = (item) => {
    const updatedItems = cartItems.map(cartItem => 
      cartItem.id === item.id ? { ...cartItem, quantity: (cartItem.quantity || 1) + 1 } : cartItem
    );
    setCartItems(updatedItems);
  };

  const handleDecreaseQuantity = (item) => {
    const updatedItems = cartItems.map(cartItem => 
      cartItem.id === item.id ? { ...cartItem, quantity: Math.max((cartItem.quantity || 1) - 1, 1) } : cartItem
    );
    setCartItems(updatedItems);
  };

  const handleRemoveItem = async (itemId) => {
    try {
      await removeCartItem(itemId); // Удаляем товар из базы данных
      // После успешного удаления обновляем список товаров в корзине
      fetchCartItems();
    } catch (error) {
      console.error('Error removing item from cart:', error);
    }
  };

  const handleCheckout = () => {
    Alert.alert("Оформление заказа", "Продолжение следует...");
  };

  useFocusEffect(
    React.useCallback(() => {
      fetchCartItems();
    }, [])
  );

  if (loading) {
    return <ActivityIndicator size="large" color="#ff69b4" />;
  }

  if (cartItems.length === 0) {
    return (
      <View style={styles.emptyContainer}>
        <Text style={styles.emptyText}>Ваша корзина пуста</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Button title="Очистить корзину" onPress={handleClearCart} color="#ff69b4" />
      <FlatList
        data={cartItems}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <TouchableOpacity onPress={() => handleRemoveItem(item.id)} style={styles.removeButton}>
              <Text style={styles.removeButtonText}>✖</Text>
            </TouchableOpacity>
            <Text style={styles.title}>{item.title}</Text>
            <Text style={styles.price}>${item.price}</Text>
            <View style={styles.quantityContainer}>
              <Button title="-" onPress={() => handleDecreaseQuantity(item)} />
              <Text style={styles.quantityText}>{item.quantity || 1}</Text>
              <Button title="+" onPress={() => handleIncreaseQuantity(item)} />
            </View>
          </View>
        )}
      />
      <Button title="Оформить заказ" onPress={handleCheckout} color="#ff69b4" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  card: {
    padding: 16,
    borderWidth: 1,
    borderColor: '#ccc',
    marginBottom: 10,
    borderRadius: 5,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  price: {
    fontSize: 16,
    color: '#ff69b4',
  },
  quantityContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  quantityText: {
    marginHorizontal: 10,
    fontSize: 16,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 18,
    color: '#777',
  },
  removeButton: {
    position: 'absolute',
    top: 10,
    right: 10,
  },
  removeButtonText: {
    fontSize: 20,
    color: '#ff0000',
  },
});