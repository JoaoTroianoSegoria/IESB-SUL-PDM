import { StatusBar } from 'expo-status-bar';
import { Button, StyleSheet, Text, View } from 'react-native';
import { titulo } from './util';
import titulo_padrao from './util.js';

export default function App() {
  return (
    <View style={styles.container}>
      <Text> {titulo_padrao}</Text>
      <Text> {titulo} </Text>
      <Button title="Clique aqui" />
      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
