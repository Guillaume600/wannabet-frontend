import React, { useEffect, useState } from 'react'
import { View, Text, Image, StyleSheet, FlatList, ImageBackground, SafeAreaView } from 'react-native'
import UserRank from '../components/UserRank'
import FontAwesome from 'react-native-vector-icons/FontAwesome'
import { useSelector } from 'react-redux'

const RankScreen = ({ navigation }) => {

  // Etats
  const user = useSelector(store => store.user.value)
  const [userCoins, setUserCoins] = useState(null)
  const [userRank, setUserRank] = useState(null)
  const [userList, setUserList] = useState([])

  // Effet de bord au montage du composant
  useEffect(() => {
    // Si l'utilisateur n'est pas connecté, on le redirige vers l'écran de connexion
    if (!user.token) {
      navigation.replace('Login')
    }
    // Récupération des utilisateurs
    const getUserList = async () => {
      const response = await fetch(`http://${process.env.EXPO_PUBLIC_IP_ADDRESS}:3000/users/byPoints`)
      const data = await response.json()
      // Récupérer les données de l'utilisateur courant
      const currentUser = data.users.find(e => e.token === user.token)
      setUserCoins(currentUser.coins)
      setUserRank(data.users.indexOf(currentUser) + 1)
      setUserList(data.users)
    }
    getUserList()
  }, [])

  return (
    <ImageBackground style={styles.bg} source={require("../assets/background.png")}>
      <SafeAreaView style={styles.container}>
        <View style={styles.imageContainer}>
          <Image style={styles.image} source={require('../assets/WannaBet_Logo.png')} />
        </View>
        <View style={styles.banner}>
          <View style={styles.bannerLeft}>
            <FontAwesome name="user" size={24} color="black" style={styles.userIcon} />
            <Text style={styles.bannerText}>Rank: {userRank}</Text>
          </View>
          <Text style={styles.bannerText}>Coins: {userCoins}</Text>
        </View>
        {/* Affichage de la liste des users classés par rang */}
        <View style={styles.headerContainer}>
          <Text style={styles.headerText}>Username</Text>
          <Text style={styles.headerText}>Rank</Text>
          <Text style={styles.headerText}>Points</Text>
        </View>
        <FlatList
          data={userList}
          renderItem={({ item, index }) => (
            <UserRank {...item} index={index} />
          )}
          keyExtractor={item => item._id}
        />
      </SafeAreaView>
    </ImageBackground>
  )
}

const styles = StyleSheet.create({
  bg: {
    width: '100%',
    height: '100%',
  },
  container: {
    flex: 1,
  },
  imageContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  image: {
    width: '50%',
    height: 200,
    resizeMode: 'cover',
  },
  spacer: {
    height: 40,
  },
  banner: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#d3d3d3',
    padding: 10,
    marginBottom: 40
  },
  bannerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  userIcon: {
    marginRight: 8,
  },
  bannerText: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  headerContainer: {
    flexDirection: 'row',
    backgroundColor: '#e0e0e0',
    padding: 10,
  },
  headerText: {
    flex: 1,
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
  },
})

export default RankScreen