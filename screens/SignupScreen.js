import { ImageBackground, Image, Platform, StyleSheet, Text, View, KeyboardAvoidingView, TouchableOpacity, TextInput } from 'react-native';
import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { update } from '../reducers/user';

const EMAIL_REGEX =
/^[a-zA-Z0-9](?:[a-zA-Z0-9_%+-]*\.[a-zA-Z0-9_%+-]*){0,2}[a-zA-Z0-9]*@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}(?:\.[a-zA-Z]{2,})*$/
const PASSWORD_REGEX =
  /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])(?=.{8,})/;

export default function SignupScreen({ navigation }) {

    // Si l'utilisateur est déja connecté, on le redirige vers BetScreen
    const user = useSelector(store => store.user.value)
    useEffect(() => {
      if (user.token) {
        navigation.replace('TabNavigator', {screen: 'Bet'})
      }
    }, [])

  const dispatch = useDispatch();
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [emailError, setEmailError] = useState(false);
  const [password, setPassword] = useState('');
  const [passwordError, setPasswordError] = useState(false);
  const [duplicateError, setDuplicateError] = useState(false);

  const handleSubmit = () => {
    const isEmailValid = EMAIL_REGEX.test(email);
    const isPasswordValid = PASSWORD_REGEX.test(password);
  
    if (isEmailValid && isPasswordValid) {
      fetch(`http://${process.env.EXPO_PUBLIC_IP_ADDRESS}:3000/users/signup`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, email, password }),
      })
        .then(response => response.json())
        .then(data => {
          if (data.result) {
            console.log(data)
            dispatch(update({ token: data.token, username: data.username, email: data.email, coins: data.coins}));
            navigation.navigate('TabNavigator', {screen: 'Bet'});
          } else {
            setDuplicateError(true);
          }
        })
        .catch(err => console.log(err));
    } else {
      // Check which field is invalid
      setEmailError(!isEmailValid);
      setPasswordError(!isPasswordValid);
    }
  };

    return (
      <ImageBackground style={styles.bg} source={require('../assets/background.png')}> 
        <KeyboardAvoidingView style={styles.container} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
        <Image style={styles.logo} source={require('../assets/WannaBet_Logo.png')} />  
        <View style={styles.viewContainer}>
          <Text style={styles.title}>Username:</Text>
          <TextInput placeholder="Username" onChangeText={(value) => setUsername(value)} value={username} style={styles.input} 
                  autoCapitalize="none"
            />
          <Text style={styles.title}>Email:</Text>
          <TextInput placeholder="Email" onChangeText={(value) => setEmail(value)} value={email} style={styles.input}
                  autoCapitalize="none"
                  keyboardType="email-address"
                  textContentType="emailAddress"
                  autoComplete="email"
                   />
                   { emailError && (<Text style={styles.error}>Adresse e-mail invalide</Text> )}
                   { duplicateError && (<Text style={styles.error}>Utilisateur existe déjà</Text> )}
          <Text style={styles.title}>Mot de passe:</Text>
          <TextInput placeholder="Mot de passe" onChangeText={(value) => setPassword(value)} value={password} style={styles.input} 
                  autoCapitalize="none"
                  textContentType="password"
                  autoComplete="new-password"
            />    
                    { passwordError && (<Text style={styles.error}>Le mot de passe doit contenir au moins 8 caractères, dont un majuscule, une minuscule, un numérique et un caractère spécial.</Text> )}
          <Text style={styles.avertissement}>Avertissement: Cette application propose un service de divertissement basé sur un systéme de paris sur une ressource fictive. Cependant cela pourrait entraîner un comportement addictif chez les sujets les plus sensibles</Text>
          <TouchableOpacity onPress={() => handleSubmit()} style={styles.greenButton} activeOpacity={0.8}>
            <Text style={styles.greenButtonText}>S'inscrire</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => navigation.navigate('Login')} style={styles.textbutton} activeOpacity={0.8}>
            <Text style={styles.textButton}>J'ai déja un compte!</Text>
          </TouchableOpacity>
          </View>
        </KeyboardAvoidingView>
        </ImageBackground>
      )
    };

    const styles = StyleSheet.create({
      container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        width: '100%',
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
      marginBottom: '80',
    },
    logo: {
      marginTop: '60',
      width: 100,
      height: 100,
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
      paddingHorizontal: 15,
      alignItems: 'stretch',
      justifyContent: 'left',
      height: 40,
      borderRadius: 10,
      width: 300,
    },
    greenButton: {
      backgroundColor: '#B5E5A7',
      paddingVertical: 15,
      width: 150,
      borderRadius: 25,
      alignItems: 'center',
      justifyContent: 'center',
      marginVertical: 8,
      marginTop: 30,
    },
    greenButtonText: {
      color: '#302f30',
      fontWeight: 'bold',
      fontSize: 14,
    },
    textButton: {
      color: '#ffff',
      paddingVertical: 12,
      alignItems: 'center',
      justifyContent: 'center',
      textDecorationLine: 'underline',
    },
    avertissement: {
      color: '#ffff',
      marginTop: '40',
      fontSize: 11,
      textAlign: 'justify',
      marginHorizontal: '30',
    },
    error: {
      color: 'red',
      fontSize: 12,
      marginHorizontal: '30',
      textAlign: 'justify',
    }

  },)