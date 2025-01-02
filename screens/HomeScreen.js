import React, { useEffect, useState } from 'react'
import { View, Text, TextInput, KeyboardAvoidingView, Image, TouchableOpacity, StyleSheet, ImageBackground, Platform, Alert, Keyboard, TouchableWithoutFeedback } from 'react-native'
import { useSelector, useDispatch } from 'react-redux'
import { update, logout } from '../reducers/user'
import * as DocumentPicker from 'expo-document-picker'

const HomeScreen = ({ navigation }) => {

  // Etats
  const user = useSelector(store => store.user.value)
  const dispatch = useDispatch()
  const [newUsername, setNewUsername] = useState(null)
  const [newEmail, setNewEmail] = useState(null)
  const [newAvatar, setNewAvatar] = useState(user.avatar)

  // Si l'utilisateur n'est pas connecté, redirigé vers la page de connection
  useEffect(() => {
    if (!user.token) {
      navigation.replace('Login')
    }
  }, [])

  // DocumentPIcker pour aller chercher un fichier dans la mémoire du telephone
  const changeAvatar = async () => {
    try {
      // On ne prends que les images et on copie en cache pour un accés rapide
      const result = await DocumentPicker.getDocumentAsync({
        type: 'image/*',
        copyToCacheDirectory: true
      })
      if (!result.canceled) {
        setNewAvatar(result.assets[0].uri)
      } else {
        console.log(`Erreur dans la réponse : ${result}`)
      }
    } catch (err) {
      console.log(err.message)
    }
  }

  // Handler d'envoi des changements en BDD et dans le store
  const handleUpdateProfile = async () => {
    const response = await fetch(`http://${process.env.EXPO_PUBLIC_IP_ADDRESS}:3000/users/update/${user.token}`, { method: 'PUT', headers: { "Content-Type": 'application/json' }, body: JSON.stringify({ email: newEmail, username: newUsername, avatar: newAvatar }) })
    const data = await response.json()
    if (data.result) {
      Alert.alert('Succés', data.message, [{
        text: 'OK', onPress: () => {
          dispatch(update({ username: newUsername, email: newEmail, avatar: newAvatar }))
          setNewEmail(null)
          setNewUsername(null)
          setNewAvatar(null)
          navigation.replace('TabNavigator', { screen: 'Bet' })
        }
      }])
    } else {
      Alert.alert('Erreur', data.error)
    }
  }

  // Handler de déconnexion
  const handleLogout = () => {
    dispatch(logout())
    navigation.replace('Main')
  }

  const showAvatar = newAvatar ?
    <Image source={{ uri: newAvatar }} style={styles.avatar} /> :
    <Image source={require('../assets/WannaBet_Logo.png')} style={styles.avatar} />

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
    <ImageBackground style={styles.bg} source={require("../assets/background.png")}>
        <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"} style={styles.container}>
          <View style={styles.mainContainer}>
            {showAvatar}
            <View style={styles.container}>
              <TouchableOpacity style={styles.button}
                onPress={() => changeAvatar()}>
                <Text style={styles.buttonText} >Choisir un avatar</Text>
              </TouchableOpacity>

              <TextInput
                placeholder="Username"
                style={styles.input}
                value={newUsername}
                onChangeText={setNewUsername}
              />
              <TextInput
                placeholder="Email"
                style={styles.input}
                value={newEmail}
                onChangeText={setNewEmail}
              />
              <TouchableOpacity style={styles.button}
                onPress={() => handleUpdateProfile()}>
                <Text style={styles.buttonText}>Mettre à jour le profil</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.logout}
                onPress={() => handleLogout()}>
                <Text style={styles.buttonText}>Se deconnecter</Text>
              </TouchableOpacity>
            </View>
          </View>
        </KeyboardAvoidingView>
      </ImageBackground>
    </TouchableWithoutFeedback>
  )
}

const styles = StyleSheet.create({
  bg: {
    width: "100%",
    height: "100%",
    justifyContent: "center",
    alignItems: "center",
  },
  mainContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  container: {
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 60,
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: 20,
  },
  button: {
    backgroundColor: "#B5E5A7",
    paddingVertical: 12,
    width: 200,
    borderRadius: 25,
    alignItems: "center",
    justifyContent: "center",
    marginVertical: 8,
  },
  logout: {
    backgroundColor: "#ba0707",
    paddingVertical: 12,
    width: 200,
    borderRadius: 25,
    alignItems: "center",
    justifyContent: "center",
    marginVertical: 8,
  },
  buttonText: {
    color: "#302f30",
    fontFamily: "Freeman-Regular",
    fontSize: 16,
    fontWeight: "bold",
  },
  input: {
    backgroundColor: "white",
    paddingVertical: 12,
    width: 300,
    height: 40,
    borderRadius: 10,
    textAlign: "center",
    marginVertical: 8,
  },
})

export default HomeScreen