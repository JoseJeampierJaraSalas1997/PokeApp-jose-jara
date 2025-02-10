import { Image, StyleSheet, Linking, TouchableOpacity, Animated } from 'react-native';
import { useEffect, useRef } from 'react';
import { HelloWave } from '@/components/HelloWave';
import ParallaxScrollView from '@/components/ParallaxScrollView';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';

export default function HomeScreen() {
  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 1000,
      useNativeDriver: true,
    }).start();
  }, [fadeAnim]);

  return (
    <ParallaxScrollView
      headerBackgroundColor={{ light: '#A1CEDC', dark: '#1D3D47' }}
      headerImage={
        <Image
          source={require('@/assets/images/partial-react-logo.png')}
          style={styles.reactLogo}
        />
      }>
      <Animated.View style={[styles.cardContainer, { opacity: fadeAnim }]}> 
        <ThemedText type="title">Bienvenido a mi Aplicación</ThemedText>
        <HelloWave />
      </Animated.View>
      <ThemedView style={styles.cardContainer}>
        <ThemedText type="subtitle">Sobre esta Aplicación</ThemedText>
        <ThemedText>
          Esta aplicación ha sido desarrollada utilizando <ThemedText type="defaultSemiBold">React Native</ThemedText>,
          siguiendo principios de <ThemedText type="defaultSemiBold">modularidad, escalabilidad y eficiencia</ThemedText>.
        </ThemedText>
      </ThemedView>
      <ThemedView style={styles.cardContainer}>
        <ThemedText type="subtitle">Características Clave</ThemedText>
        <ThemedText>
          - <ThemedText type="defaultSemiBold">Modularidad:</ThemedText> Componentes reutilizables.
          {'\n'}
          - <ThemedText type="defaultSemiBold">Consumo de Datos:</ThemedText> API REST optimizada.
          {'\n'}
          - <ThemedText type="defaultSemiBold">Funcionalidad:</ThemedText> Navegación fluida.
          {'\n'}
          - <ThemedText type="defaultSemiBold">Escalabilidad:</ThemedText> Expansión sin pérdida de rendimiento.
        </ThemedText>
      </ThemedView>
      <ThemedView style={styles.cardContainer}>
        <ThemedText type="subtitle">Tecnologías y Librerías Utilizadas</ThemedText>
        <ThemedText>
          - React Native, Expo, Axios, React Navigation.
        </ThemedText>
      </ThemedView>
      <ThemedView style={styles.cardContainer}>
        <ThemedText type="subtitle">Contacto</ThemedText>
        <TouchableOpacity onPress={() => Linking.openURL('tel:+51968097419')}>
          <ThemedText type="defaultSemiBold">📞 Llamar: +51 968097419</ThemedText>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => Linking.openURL('mailto:jjeampierjs97@gmail.com')}>
          <ThemedText type="defaultSemiBold">📧 Enviar Email</ThemedText>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => Linking.openURL('https://pe.linkedin.com/in/jose-jeampier-jara-salas-882a03236')}>
          <ThemedText type="defaultSemiBold">🔗 LinkedIn</ThemedText>
        </TouchableOpacity>
      </ThemedView>
    </ParallaxScrollView>
  );
}

const styles = StyleSheet.create({
  cardContainer: {
    margin: 16,
    padding: 16,
    borderRadius: 12,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 5,
  },
  reactLogo: {
    height: 178,
    width: 290,
    bottom: 0,
    left: 0,
    position: 'absolute',
  },
});
