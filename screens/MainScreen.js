import React, {useEffect} from 'react';
import { View, TouchableOpacity, StyleSheet, Text, Image, ImageBackground, KeyboardAvoidingView, Platform } from 'react-native';
import { useSelector } from 'react-redux';

const MainScreen = ({ navigation }) => {

  // Si l'utilisateur est déja connecté, on le redirige vers BetScreen
  const user = useSelector(store => store.user.value)
  useEffect(() => {
    if (user.token) {
      navigation.replace('TabNavigator', {screen: 'BetScreen'})
    }
  }, [])

  return (
    <ImageBackground
      style={styles.bg}
      source={require("../assets/background.png")}
    >
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.container}
      >
        <View style={styles.bg}>
          <Text style={[styles.title, { fontFamily: 'Freeman-Regular' }]}>WANNABET</Text>
          <Image source={require("../assets/WannaBet_Logo.png")} />
          <TouchableOpacity
            style={styles.button}
            onPress={() => navigation.navigate("Login")}
            activeOpacity={0.8}
          >
            <Text style={styles.textButton}>Login</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.button}
            onPress={() => navigation.navigate("Signup")}
            activeOpacity={0.8}
          >
            <Text style={styles.textButton}>Signup</Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  bg: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontWeight: 'bold',
    fontSize: 65,
    color: 'white',
  },
  button: {
    backgroundColor: '#B5E5A7',
    paddingVertical: 12,
    width: 300,
    borderRadius: 25,
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 8,
    width: 100,
  },
  textButton: {
    color: '#302f30',          
    fontFamily: 'Freeman-Regular', 
    fontSize: 16,    
    fontWeight: 'bold',          
  },
});

export default MainScreen;