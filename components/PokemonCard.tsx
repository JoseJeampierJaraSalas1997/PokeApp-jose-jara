import { View, Text, Image } from 'react-native';

interface PokemonCardProps {
  name: string;
  index: number;
}

export default function PokemonCard({ name, index }: PokemonCardProps) {
  return (
    <View className="flex flex-row items-center bg-white p-3 mb-3 rounded-xl shadow-md">
      <Image 
        source={{ uri: `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${index + 1}.png` }} 
        className="w-12 h-12 mr-3"
      />
      <Text className="text-lg font-bold">{name.toUpperCase()}</Text>
    </View>
  );
}
