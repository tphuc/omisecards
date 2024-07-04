import React, { useContext, useState } from 'react';
import { View, TextInput, ScrollView, SafeAreaView, Alert, Text, StyleSheet, useColorScheme, ColorSchemeName } from 'react-native';
import { useForm, Controller, SubmitHandler } from 'react-hook-form';
import { CardContext } from '@/contexts/CardContext';
import { Card } from '@/interfaces/card'
import { Colors } from '@/constants/Colors';
import { ThemedButton } from '@/components/ThemedButton';
import ParallaxScrollView from '@/components/ParallaxScrollView';
import { useThemeColors } from '@/hooks/useThemeColor';
import CardPreview from '@/components/CardPreview';
import { useNavigation, useRouter } from 'expo-router';

type FormData = {
  cardNumber: string;
  expiryMonth: string;
  expiryYear: string;
  cvc: string;
  holderName: string;
  cardColor: string;
};

const cardColors = [
  "#FFF07C",
  "#8DE683",
  "#7EE8FA",
  "#COC2ED",
  "#E58C8A",
  '#EDEFDE',
  '#808F87',
  '#F4B266'
];


function getRandomCardColor() {
  return cardColors[Math.floor(Math.random() * cardColors.length)];
}

export default function AddCard() {
  const colorScheme = useColorScheme() as 'light' | 'dark';
  const { backgroundSecondary, background } = useThemeColors();
  const router = useRouter()
  // const [cardColor, setCardColor] = useState(getRandomCardColor())
  const styles = makeStyles(colorScheme);

  const { addCard } = useContext(CardContext);
  const { control, handleSubmit, setValue, watch, formState: { errors } } = useForm<FormData>({
    defaultValues: {
      cardNumber: '',
      expiryMonth: '',
      expiryYear: '',
      cvc: '',
      holderName: '',
      cardColor: getRandomCardColor()
    },
  });
  const [loading, setLoading] = useState(false);

  const cardData: Card = {
    id: '', // This will be set after tokenization
    holderName: watch('holderName'),
    number: watch('cardNumber'),
    expiryMonth: watch('expiryMonth'),
    expiryYear: watch('expiryYear'),
    cvc: watch('cvc'),
    cardColor:watch('cardColor')  ?? getRandomCardColor()
  };

  const onSubmit: SubmitHandler<FormData> = async (data) => {
    setLoading(true);
    try {
      const tokenResponse = await fetch('https://vault.omise.co/tokens', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Basic ${btoa('pkey_test_60a360cyuf6v5zshchv')}`,
        },
        body: JSON.stringify({
          card: {
            name: data.holderName,
            number: data.cardNumber,
            expiration_month: parseInt(data.expiryMonth),
            expiration_year: parseInt(data.expiryYear),
            security_code: data.cvc,
          },
        }),
      });

      const tokenData = await tokenResponse.json();
     

      if (tokenResponse.ok && tokenData.id) {
        const newCard: Card = {
          id: tokenData.id,
          holderName: data.holderName,
          number: data.cardNumber,
          expiryMonth: data.expiryMonth,
          expiryYear: data.expiryYear,
          cvc: data.cvc,
          cardColor: data.cardColor,
        };

        const chargeSuccessful = true;

        if (chargeSuccessful) {
          addCard(newCard);
          router.replace('/')
        } else {
          Alert.alert('Error', 'Add card failed. Please try again.');
        }
      } else {
        Alert.alert('Error', tokenData.message);
      }
    } catch (error: any) {
      Alert.alert('Error', error?.message);
    } finally {
      setLoading(false);
    }
  };


  const handleMonthChange = (text: string) => {
    const formattedText = text.replace(/[^0-9]/g, '').slice(0, 2);
    setValue('expiryMonth', formattedText);
  };

  const handleYearChange = (text: string) => {
    const formattedText = text.replace(/[^0-9]/g, '').slice(0, 2);
    setValue('expiryYear', formattedText);
  };

  const handleCVCChange = (text: string) => {
    const formattedText = text.replace(/[^0-9]/g, '').slice(0, 3);
    setValue('cvc', formattedText);
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ParallaxScrollView
        headerBackgroundColor={{ light: '#D0D0D0', dark: '#353636' }}

        headerImage={<View style={{ paddingVertical: 40, paddingHorizontal: 32, backgroundColor: background, height: 300 }}>
          <View style={{ height: 220, marginTop: -25 }}>
            <CardPreview card={cardData} />
          </View>
        </View>}>
        {/* <ScrollView style={styles.scrollView}> */}
        <View style={styles.formContainer}>
          <Controller
            control={control}
            rules={{ required: 'Card number is required' }}
            render={({ field: { onChange, onBlur, value } }) => (
              <TextInput
                style={styles.input}
                placeholder="Card Number"
                placeholderTextColor={Colors[colorScheme].textMuted}
                onBlur={onBlur}
                onChangeText={(text) => {
                  // Ensure only numeric characters and limit to 16 characters
                  const numericText = text.replace(/[^\d]/g, ''); // Remove non-numeric characters
                  const truncatedText = numericText.slice(0, 16); // Limit to 16 characters
                  onChange(truncatedText);
                }}
                value={value}
              />
            )}
            name="cardNumber"
          />
          {errors.cardNumber && <Text style={styles.errorText}>{errors.cardNumber.message}</Text>}

          <Controller
            control={control}
            rules={{ required: 'Holder name is required' }}
            render={({ field: { onChange, onBlur, value } }) => (
              <TextInput
                autoCapitalize={"characters"}
                style={styles.input}
                placeholder="Holder Name"
                placeholderTextColor={Colors[colorScheme].textMuted}
                onBlur={onBlur}
                onChangeText={(text) => {
                  // Ensure uppercase and no numeric characters
                  const upperCaseText = text.toUpperCase();
                  const filteredText = upperCaseText.replace(/[0-9]/g, '');
                  onChange(filteredText);
                }}
                value={value}
              />
            )}
            name="holderName"
          />
          {errors.holderName && <Text style={styles.errorText}>{errors.holderName.message}</Text>}



          <View style={{ display: "flex", flexDirection: "row", gap: 8 }}>
            <View style={{ flex: 2 }}>
              <View style={[{ display: 'flex', flexDirection: "row", alignItems: "center", gap: 4 }, styles.input]}>
                <Controller
                  control={control}
                  rules={{ required: 'Expiry month is required' }}
                  render={({ field: { onChange, onBlur, value } }) => (
                    <TextInput
                      placeholder="MM"
                      placeholderTextColor={Colors[colorScheme].textMuted}
                      onBlur={onBlur}
                      onChangeText={handleMonthChange}
                      value={value}
                    />
                  )}
                  name="expiryMonth"
                />
                <Text>/</Text>
                <Controller
                  control={control}
                  rules={{ required: 'Expiry year is required' }}
                  render={({ field: { onChange, onBlur, value } }) => (
                    <TextInput
                      placeholder="YY"
                      placeholderTextColor={Colors[colorScheme].textMuted}
                      onBlur={onBlur}
                      onChangeText={handleYearChange}
                      value={value}
                    />
                  )}
                  name="expiryYear"
                />
              </View>
              {errors.expiryMonth && <Text style={styles.errorText}>{errors.expiryMonth.message}</Text>}
              {errors.expiryYear && <Text style={styles.errorText}>{errors.expiryYear.message}</Text>}
            </View>

            <View style={{ flex: 1 }}>
              <Controller
                control={control}
                rules={{ required: 'CVC is required' }}
                render={({ field: { onChange, onBlur, value } }) => (
                  <TextInput
                    style={styles.input}
                    placeholder="CVC"
                    placeholderTextColor={Colors[colorScheme].textMuted}
                    onBlur={onBlur}
                    onChangeText={handleCVCChange}
                    value={value}
                  />
                )}
                name="cvc"
              />
              {errors.cvc && <Text style={styles.errorText}>{errors.cvc.message}</Text>}
            </View>
          </View>

          <ThemedButton variant="primary" title="Add Card" onPress={handleSubmit(onSubmit)} disabled={loading} />
        </View>
        {/* </ScrollView> */}
      </ParallaxScrollView>
    </SafeAreaView>
  );
}

const makeStyles = (theme: ColorSchemeName) => {
  let themeName: 'dark' | 'light' = theme == 'dark' ? theme : 'light';
  let colors = Colors[themeName];
  return StyleSheet.create({
    safeArea: {
      flex: 1,
    },
    scrollView: {
      padding: 16,
      backgroundColor: colors.background,
    },
    formContainer: {
      flex: 1,
      justifyContent: 'center',
    },
    input: {
      height: 46,
      backgroundColor: colors.backgroundSecondary,
      borderWidth: 0,
      marginBottom: 12,
      paddingLeft: 10,
      borderRadius: 8,
    },
    errorText: {
      color: 'red',
      marginBottom: 12,
    },
  });
};
