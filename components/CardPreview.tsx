import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Card } from '@/interfaces/card';
import { Colors } from '@/constants/Colors';

type CardPreviewProps = {
  card: Card;
};

const CardPreview: React.FC<CardPreviewProps> = ({ card }) => {
  const renderCardNumber = (cardNumber: string) => {
    const blocks = [cardNumber.slice(0, 4), cardNumber.slice(4, 8), cardNumber.slice(8, 12), cardNumber.slice(-4)];
    return blocks.map((block, index) => (
      <Text key={index} style={[styles.cardNumber, { opacity: cardNumber.length >= (index + 1)*4 ? 1 : 0.5 }]}>
        {index>2 && cardNumber.length === 16 ? block : '●●●●'}
      </Text>
    ));
  };

  return (
    <View style={[styles.card, { backgroundColor: card.cardColor }]}>
      <Text style={[styles.cardText, { opacity: card.holderName ? 1 : 0.5 }]}>{card.holderName?.toUpperCase() || "JOHN DOE"}</Text>
      <View style={styles.cardNumberContainer}>
        {renderCardNumber(card.number)}
      </View>
      <View style={styles.cardDetails}>
        <Text style={[styles.cardDetailText, { opacity: card.expiryMonth ? 1: 0.5}]}>{card.expiryMonth || 'MM'} / {card.expiryYear || 'YY'}</Text>
        <Text style={[styles.cardDetailText, { opacity: card.cvc ? 1: 0.5}]}>{card.cvc || 'CVC'}</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    height: '100%',
    borderRadius: 12,
    padding: 30,
    justifyContent: 'space-between',
  },
  cardText: {
    fontSize: 20,
    fontWeight: '700',
    marginBottom: 10,
  },
  cardNumberContainer: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  cardNumber: {
    flex: 1,
    textAlign: 'center',
    fontSize: 18,
    fontWeight: 'bold',
  },
  cardDetails: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
  },
  cardDetailText: {
    fontWeight: '600',
    fontSize: 16,
  },
});

export default CardPreview;
