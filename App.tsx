import React from 'react';
import { View, Text} from 'react-native';
import Routes from './src/routes';
import { useFonts } from 'expo-font';
import { Roboto_300Light, Roboto_500Medium} from '@expo-google-fonts/roboto';

export default function App() {
  const [fontsLoaded] = useFonts({
    roboto_300: Roboto_300Light,
    roboto_500: Roboto_500Medium
  })
  
  if(!fontsLoaded){
    return <View><Text>Carregando fontes</Text></View>
  }

  return (
    <Routes />
  );
}

