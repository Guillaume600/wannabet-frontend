import React, {useEffect, useState} from 'react'
import {View, Text, TextInput, KeyboardAvoidingView} from 'react-native'
import {useSelector} from 'react-redux'

const HomeScreen = ({navigation}) => {

  // Etats
  const user = useSelector(store => store.user.value)
  const [newUsername, setNewUsername] = useState(null)
  const [newEmail, setNewEmail] = useState(null)
  const [newAvatar, setNewAvatar] = useState(null)

  // Si l'utilisateur n'est pas connecté, redirigé vers la page de connection
  useEffect(() => {
    if (!user.token) {
      navigation.replace('Login')
    }
  }, [])


  return (
    <ImageBackground style={styles.bg} source={require("../assets/background.png")}>
      <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"} style={styles.container}>
        
      </KeyboardAvoidingView>
    </ImageBackground>
  )
}

export default HomeScreen