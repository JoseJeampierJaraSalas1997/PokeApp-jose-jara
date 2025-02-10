import { View, Text, Animated, Pressable, Image, StyleSheet, Dimensions, TextInput, ScrollView } from 'react-native';
import { useEffect, useState, useRef } from 'react';
import axios from 'axios';
import { Ionicons } from '@expo/vector-icons';

// Interfaces mejoradas
interface PokemonBasic {
  name: string;
  url: string;
}

interface PokemonDetail {
  id: number;
  name: string;
  types: Array<{type: {name: string}}>;
  height: number;
  weight: number;
  stats: Array<{
    base_stat: number;
    stat: {name: string};
  }>;
}

export default function EnhancedExploreScreen() {
  const [pokemons, setPokemons] = useState<PokemonDetail[]>([]);
  const [filteredPokemons, setFilteredPokemons] = useState<PokemonDetail[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.9)).current;

  // Animación de entrada
  const animateIn = () => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 1000,
        useNativeDriver: true,
      }),
      Animated.spring(scaleAnim, {
        toValue: 1,
        friction: 8,
        tension: 40,
        useNativeDriver: true,
      })
    ]).start();
  };

  // Función para obtener detalles de un Pokémon
  const fetchPokemonDetails = async (url: string): Promise<PokemonDetail> => {
    const response = await axios.get(url);
    return response.data;
  };

  // Carga inicial de datos
  useEffect(() => {
    const loadPokemons = async () => {
      try {
        setLoading(true);
        const response = await axios.get('https://pokeapi.co/api/v2/pokemon?limit=50');
        const basicPokemons: PokemonBasic[] = response.data.results;
        
        // Obtener detalles de cada Pokémon
        const detailedPokemons = await Promise.all(
          basicPokemons.map(pokemon => fetchPokemonDetails(pokemon.url))
        );
        
        setPokemons(detailedPokemons);
        setFilteredPokemons(detailedPokemons);
        animateIn();
      } catch (err) {
        setError('Error al cargar los Pokémon. Intenta de nuevo más tarde.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    loadPokemons();
  }, []);

  // Filtro de búsqueda
  useEffect(() => {
    const filtered = pokemons.filter(pokemon => 
      pokemon.name.toLowerCase().includes(searchQuery.toLowerCase())
    );
    setFilteredPokemons(filtered);
  }, [searchQuery, pokemons]);

  // Componente para la tarjeta de Pokémon con animación
  const PokemonCard = ({ pokemon }: { pokemon: PokemonDetail }) => {
    const pressAnim = useRef(new Animated.Value(1)).current;
    
    const onPressIn = () => {
      Animated.spring(pressAnim, {
        toValue: 0.95,
        useNativeDriver: true,
      }).start();
    };

    const onPressOut = () => {
      Animated.spring(pressAnim, {
        toValue: 1,
        friction: 3,
        useNativeDriver: true,
      }).start();
    };

    return (
      <Pressable onPressIn={onPressIn} onPressOut={onPressOut}>
        <Animated.View 
          style={[
            styles.card,
            {
              transform: [{ scale: pressAnim }],
              opacity: fadeAnim,
            }
          ]}
        >
          <View style={styles.cardContent}>
            <Animated.Image
              source={{ 
                uri: `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/home/${pokemon.id}.png` 
              }}
              style={[styles.image, { transform: [{ scale: scaleAnim }] }]}
            />
            <View style={styles.infoContainer}>
              <Text style={styles.name}>{pokemon.name.toUpperCase()}</Text>
              <View style={styles.typeContainer}>
                {pokemon.types.map((type, index) => (
                  <View 
                    key={index} 
                    style={[styles.typeTag, { backgroundColor: getTypeColor(type.type.name) }]}
                  >
                    <Text style={styles.typeText}>{type.type.name}</Text>
                  </View>
                ))}
              </View>
              <View style={styles.statsContainer}>
                {pokemon.stats.slice(0, 3).map((stat, index) => (
                  <View key={index} style={styles.statItem}>
                    <Text style={styles.statLabel}>{formatStatName(stat.stat.name)}</Text>
                    <View style={styles.statBarContainer}>
                      <Animated.View 
                        style={[
                          styles.statBar, 
                          { 
                            width: `${(stat.base_stat / 255) * 100}%`,
                            backgroundColor: getStatColor(stat.stat.name)
                          }
                        ]} 
                      />
                    </View>
                    <Text style={styles.statValue}>{stat.base_stat}</Text>
                  </View>
                ))}
              </View>
            </View>
          </View>
        </Animated.View>
      </Pressable>
    );
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <Text style={styles.loadingText}>Cargando Pokémon...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>{error}</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Pokédex</Text>
      <View style={styles.searchContainer}>
        <Ionicons name="search" size={20} color="#666" style={styles.searchIcon} />
        <TextInput
          style={styles.searchInput}
          placeholder="Buscar Pokémon..."
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
      </View>
      <Animated.FlatList
        data={filteredPokemons}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => <PokemonCard pokemon={item} />}
        contentContainerStyle={styles.list}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
}

// Utilidades para colores y formato
const getTypeColor = (type: string): string => {
  const colors: {[key: string]: string} = {
    normal: '#A8A878',
    fire: '#F08030',
    water: '#6890F0',
    electric: '#F8D030',
    grass: '#78C850',
    ice: '#98D8D8',
    fighting: '#C03028',
    poison: '#A040A0',
    ground: '#E0C068',
    flying: '#A890F0',
    psychic: '#F85888',
    bug: '#A8B820',
    rock: '#B8A038',
    ghost: '#705898',
    dragon: '#7038F8',
    dark: '#705848',
    steel: '#B8B8D0',
    fairy: '#EE99AC'
  };
  return colors[type] || '#777777';
};

const getStatColor = (statName: string): string => {
  const colors: {[key: string]: string} = {
    hp: '#FF0000',
    attack: '#F08030',
    defense: '#F8D030',
    'special-attack': '#6890F0',
    'special-defense': '#78C850',
    speed: '#F85888'
  };
  return colors[statName] || '#777777';
};

const formatStatName = (statName: string): string => {
  const formats: {[key: string]: string} = {
    hp: 'HP',
    attack: 'ATK',
    defense: 'DEF',
    'special-attack': 'SP.ATK',
    'special-defense': 'SP.DEF',
    speed: 'SPD'
  };
  return formats[statName] || statName;
};

const { width } = Dimensions.get('window');

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#f5f5f5',
  },
  list: {
    padding: 8,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#333',
    textAlign: 'center',
    marginVertical: 20,
    textShadowColor: 'rgba(0, 0, 0, 0.1)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 8,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: '#333',
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 20,
    marginBottom: 16,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  cardContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  image: {
    width: width * 0.3,
    height: width * 0.3,
    marginRight: 16,
  },
  infoContainer: {
    flex: 1,
  },
  name: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
  },
  typeContainer: {
    flexDirection: 'row',
    marginBottom: 12,
  },
  typeTag: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
    marginRight: 8,
  },
  typeText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: 'bold',
    textTransform: 'uppercase',
  },
  statsContainer: {
    marginTop: 8,
  },
  statItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  statLabel: {
    width: 60,
    fontSize: 12,
    color: '#666',
    fontWeight: 'bold',
  },
  statBarContainer: {
    flex: 1,
    height: 6,
    backgroundColor: '#f0f0f0',
    borderRadius: 3,
    marginHorizontal: 8,
  },
  statBar: {
    height: '100%',
    borderRadius: 3,
  },
  statValue: {
    width: 30,
    fontSize: 12,
    color: '#666',
    textAlign: 'right',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    fontSize: 18,
    color: '#666',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  errorText: {
    fontSize: 16,
    color: '#ff0000',
    textAlign: 'center',
  },
});