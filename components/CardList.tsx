import React, { useContext, useRef, useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, Alert, StyleSheet, SectionList } from 'react-native';
import { Card } from '@/interfaces/card';
import CardPreview from './CardPreview';
import { Colors } from '@/constants/Colors';
import { CardContext } from '@/contexts/CardContext';
import { ThemedText } from './ThemedText';
import { Link } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useThemeColors } from '@/hooks/useThemeColor';
import BottomSheet, { BottomSheetModal, BottomSheetModalProvider, BottomSheetView } from '@gorhom/bottom-sheet';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { ThemedButton } from './ThemedButton';

const CardList: React.FC = () => {
    const { cards, removeCard } = useContext(CardContext);
    const { background } = useThemeColors();
    const [loading, setLoading] = useState<boolean>(false)
    const bottomSheetRef = useRef<BottomSheetModal>(null);
    const [selectedCard, setSelectedCard] = useState<Card | null>(null);

    const handleCardPress = (card: Card) => {
        setSelectedCard(card);
        bottomSheetRef.current?.present();
    };

    const handlePayRandomAmount = async (card: Card) => {
        setLoading(true)
        try {
            const tokenResponse = await fetch('https://vault.omise.co/tokens', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Basic ${btoa('pkey_test_60a360cyuf6v5zshchv')}`,
                },
                body: JSON.stringify({
                    card: {
                        name: card.holderName,
                        number: card.number,
                        expiration_month: parseInt(card.expiryMonth),
                        expiration_year: parseInt(card.expiryYear),
                        security_code: card.cvc,
                    },
                }),
            });

            const tokenData = await tokenResponse.json();
            console.log(tokenData);

            if (tokenResponse.ok && tokenData.id) {
                // Use the token to perform payment
                const paymentResponse = await fetch('https://api.omise.co/charges', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Basic ${btoa('skey_test_60a360e9np1fn5dbrvl')}`, // Replace with your secret key
                    },
                    body: JSON.stringify({
                        amount: Math.floor(Math.random() * 10) + 2000, // Random amount in the smallest currency unit (e.g., cents for USD)
                        currency: 'thb',
                        card: tokenData.id,
                    }),
                });

                const paymentData = await paymentResponse.json();
                console.log(63, paymentData)

                if (paymentResponse.ok) {
                    Alert.alert('Success', 'Payment successful!');
                } else {
                    Alert.alert('Error', paymentData.message);
                }
            } else {
                Alert.alert('Error', tokenData.message);
            }
        } catch (error: any) {
            Alert.alert('Error', error.message);
        }
        setLoading(false)
    };

    const handleRemoveCard = (cardId: string) => {
        removeCard(cardId);
        bottomSheetRef.current?.close();
    };

    const renderCard = ({ item }: { item: Card }) => (
        <TouchableOpacity activeOpacity={0.88} style={{ height: 220, marginVertical: 5 }} onPress={() => handleCardPress(item)}>
            <CardPreview card={item} />
        </TouchableOpacity>
    );

    return (
        <GestureHandlerRootView style={{ flex: 1 }}>
            <View style={styles.container}>
                <SectionList
                    sections={[
                        {
                            title: '',
                            data: cards,
                        },
                    ]}
                    keyExtractor={(item, index) => `${item.id + index}`}
                    renderItem={renderCard}
                    renderSectionHeader={({ section: { title } }) => (
                        <View style={{ flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 20 }}>
                            <ThemedText type="title">Welcome!</ThemedText>
                            <Link href="/add_card" asChild>
                                <TouchableOpacity style={{ display: 'flex', flexDirection: 'row', backgroundColor: background, borderRadius: 10, paddingHorizontal: 12, paddingVertical: 6, alignItems: 'center', gap: 2 }} activeOpacity={0.9}  >
                                    <Text style={{ fontSize: 20 }}>Add</Text>
                                    <Ionicons size={26} name="add" />
                                </TouchableOpacity>
                            </Link>
                        </View>
                    )}
                />

            </View>
            <BottomSheetModalProvider>
                <BottomSheetModal
                    ref={bottomSheetRef}
                    index={1}
                    snapPoints={['15%', '20%']}
                    onChange={() => { }}
                >
                    <BottomSheetView style={styles.contentContainer}>
                        <ThemedButton loading={loading} disabled={loading} variant="primary" title='Pay random amount' style={{ width: "100%" }} onPress={() => handlePayRandomAmount(selectedCard!)} />
                        <ThemedButton disabled={loading} variant="destructive" title='Remove card' style={{ width: "100%" }} onPress={() => handleRemoveCard(selectedCard!.id)} />
                    </BottomSheetView>
                </BottomSheetModal>
            </BottomSheetModalProvider>


        </GestureHandlerRootView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        backgroundColor: Colors.light.backgroundSecondary,
    },
    contentContainer: {
        flex: 1,
        alignItems: 'center',
        gap: 5,
        paddingHorizontal: 40,
        paddingVertical: 10
    },
    option: {
        padding: 20,
        alignItems: 'center',
    },
    optionText: {
        fontSize: 18,
    },
});

export default CardList;
