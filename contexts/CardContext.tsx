import React, { createContext, useState, useEffect, ReactElement } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Card, CardState } from '../interfaces/card';

export interface CardContextType extends CardState {
  addCard: (card: Card) => void;
  removeCard: (cardId: string) => void;
  loadCards: () => void;
}

// Initial state with type CardState
const initialState: CardState = {
  cards: [],
};

// Create context with default value of CardContextType
const CardContext = createContext<CardContextType>({
  ...initialState,
  addCard: () => {},
  removeCard: () => {},
  loadCards: () => {},
});

// Props type for CardProvider
interface CardProviderProps {
  children: ReactElement;
}

// Ensure CardProvider returns valid JSX
function CardProvider({ children }: CardProviderProps) {
  const [cards, setCards] = useState<Card[]>(initialState.cards);

  const addCard = async (card: Card) => {
    const updatedCards = [...cards, card];
    setCards(updatedCards);
    await AsyncStorage.setItem('cards', JSON.stringify(updatedCards));
  };

  const removeCard = async (cardId: string) => {
    const updatedCards = cards.filter(card => card.id !== cardId);
    setCards(updatedCards);
    await AsyncStorage.setItem('cards', JSON.stringify(updatedCards));
  };

  const loadCards = async () => {
    const storedCards = await AsyncStorage.getItem('cards');
    if (storedCards) {
      setCards(JSON.parse(storedCards));
    }
  };

  useEffect(() => {
    loadCards();
  }, []);

  return (
    <CardContext.Provider value={{ cards, addCard, removeCard, loadCards }}>
      {children}
    </CardContext.Provider>
  );
}

export { CardContext, CardProvider };
