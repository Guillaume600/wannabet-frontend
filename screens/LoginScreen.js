import { ImageBackground, Image, Platform, StyleSheet, Text, View, KeyboardAvoidingView, TouchableOpacity, TextInput } from 'react-native';
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { update } from '../reducers/user';

const EMAIL_REGEX =
/^[a-zA-Z0-9](?:[a-zA-Z0-9_%+-]*\.[a-zA-Z0-9_%+-]*){0,2}[a-zA-Z0-9]*@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}(?:\.[a-zA-Z]{2,})*$/

export default function LoginScreen({ navigation }) {

  // Si l'utilisateur est déja connecté, on le redirige vers BetScreen
  const user = useSelector(store => store.user.value)
  useEffect(() => {
    if (user.token) {
      navigation.replace('TabNavigator', {screen: 'Bet'})
    }
  }, [])

  const dispatch = useDispatch();
  const [email, setEmail] = useState('');
  const [emailError, setEmailError] = useState(false);
  const [password, setPassword] = useState('');
  const [nonExistant, setNonExistant] = useState(false);

  const handleSubmit = () => {
    if (EMAIL_REGEX.test(email)) {

    fetch(`http://${process.env.EXPO_PUBLIC_IP_ADDRESS}:3000/users/signin`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    }).then(response => response.json())
      .then(data => {
        if (data.result) {
          console.log('ok')
          dispatch(update({ token: data.token, email: data.email, username: data.username, coins: data.coins }));
          navigation.navigate('TabNavigator', { screen: 'Bet' })
        } else {
          setNonExistant(true);
        }
    }) 
    .catch(err => console.log(err))
    
    } else {
    setEmailError(true);
    }
    };

return (
    <ImageBackground style={styles.bg} source={require('../assets/background.png')}>
    <KeyboardAvoidingView style={styles.container} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
    <Image style={styles.logo} source={require('../assets/WannaBet_Logo.png')} />
    <View style={styles.viewContainer}>
      <Text style={styles.title}>Email:</Text>
      <TextInput placeholder="Email" onChangeText={(value) => setEmail(value)} value={email} style={styles.input} 
        autoCapitalize="none"
        keyboardType="email-address"
        textContentType="emailAddress"
        autoComplete="email"
        />
         { emailError && (<Text style={styles.error}>Adresse e-mail invalide</Text> )}
      <Text style={styles.title}>Mot de passe:</Text>
      <TextInput placeholder="Mot de passe" onChangeText={(value) => setPassword(value)} value={password} style={styles.input}
        textContentType="password"
        autoComplete="current-password"
      />
      <TouchableOpacity onPress={() => navigation.navigate('ForgotPassword')} style={styles.textButtonbutton} activeOpacity={0.8}>
        <Text style={styles.textButton}>Mot de passe oublié?</Text>
      </TouchableOpacity>
      { nonExistant && (<Text style={styles.error}>Utilisateur n'existe pas</Text> )}
      <TouchableOpacity onPress={() => handleSubmit()} style={styles.greenbutton} activeOpacity={0.8}>
        <Text style={styles.greenButtonText}>Se Connecter</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => navigation.navigate('Signup')} style={styles.textButton} activeOpacity={0.8}>
        <Text style={styles.textButton}>Pas de compte? Inscrivez-vous!</Text>
      </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
    </ImageBackground>
)
    }
    

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  bg: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 400,
    },
   viewContainer: {
      justifyContent: 'center',
      alignItems: 'center',
      marginBottom: 200,
    },
  logo: {
    marginTop: 150,
    },
  title: {
    fontFamily: 'Freeman-Regular',
    fontSize: 20, 
    fontWeight: 'bold',
    color: '#ffff',
    justifyContent: 'center',
    alignItems: 'center',   
    paddingVertical: 12,
  },
  input: {
    backgroundColor: '#ffff',
    fontSize: 15,
    alignItems: 'stretch',
    justifyContent: 'left',
    height: 40,
    paddingHorizontal: 15,
    borderRadius: 10,
    width: 300,
  },
  textButton: {
    color: '#ffff',
    paddingVertical: 12,
    alignItems: 'center',
    justifyContent: 'center',
    textDecorationLine: 'underline',
  },
  greenbutton: {
    backgroundColor: '#B5E5A7',
    paddingVertical: 12,
    width: 150,
    borderRadius: 25,
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 8,
    color: '#ffff',
    marginTop: 50,
  },
  greenButtonText: {
    color: '#302f30',
    fontWeight: 'bold',
    fontSize: 14,
  },
  error: {
    color: 'red',
    fontSize: 12,
  }
});