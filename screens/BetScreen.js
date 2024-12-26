import React, { useEffect, useState } from 'react';
import {
  Dimensions,
  Text,
  View,
  StyleSheet,
  SafeAreaView,
  ImageBackground,
  Image,
  ScrollView,
  FlatList,
  Button,
  Pressable,
  TouchableOpacity
} from 'react-native';
import Carousel from 'react-native-reanimated-carousel';
import { useSelector } from 'react-redux';
import Match from '../components/Match'

const BetScreen = () => {
  const user = useSelector((store) => store.user.value);
  const [rounds, setRounds] = useState([])
  const [currentRound, setCurrentRound] = useState(null)
  const [matchs, setMatchs] = useState([]);

  // Récupération des rounds et mise en état du round selectionné
  useEffect(() => {
    // Récupérer les rounds
    const getRounds = async () => {
      const response = await fetch(`http://${process.env.EXPO_PUBLIC_IP_ADDRESS}:3000/matchs/rounds`)
      const data = await response.json()
      if (data.rounds.length > 0) {
        setRounds(data.rounds)
        setCurrentRound(data.rounds[1])
      }
    }
    getRounds()
  }, [])

  // Récupération des amtchs en fonction du round selectionné
  useEffect(() => {
    const getMatchs = async () => {
      if (currentRound) {
        const response = await fetch(`http://${process.env.EXPO_PUBLIC_IP_ADDRESS}:3000/matchs/get/${currentRound}`)
        const data = await response.json()
        if (data.matchs.length > 0) {
          setMatchs(data.matchs)
        }
      }
    }
    getMatchs()
  }, [currentRound])

  return (
    <SafeAreaView style={styles.main}>
      <ImageBackground
        source={require('../assets/background.png')}
        style={styles.background}
      >
        <Image
          style={styles.logo}
          source={require('../assets/WannaBet_Logo.png')}
        />
        <Text style={styles.title}>
          Bonjour {user.username}, tu as {user.coins} coins
        </Text>
        {/* Selection du round */}
        <ScrollView horizontal style={{maxHeight: 40, marginBottom: 10}}>
          {
            rounds.map((round, index) => (
              <TouchableOpacity key={index} onPress={() => setCurrentRound(round)}
                style={[styles.btnRound, {backgroundColor: round === currentRound ? 'green' : 'grey'}]} >
                  <Text style={{color: round === currentRound ? 'white' : 'black'}}>{round}</Text>
                </TouchableOpacity>
            ))
          }
        </ScrollView>
        {/* Liste des matchs */}
        <FlatList 
          data={matchs}
          keyExtractor={(item, index) => index}
          renderItem={({item}) => (
            <Match {...item} />
          )}
        />
      </ImageBackground>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  main: {
    flex: 1,
  },
  background: {
    flex: 1,
    resizeMode: 'cover',
    justifyContent: 'center',
  },
  logo: {
    width: 75,
    height: 75,
    alignSelf: 'center',
    marginBottom: 10,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: 'white',
    textAlign: 'center',
    marginBottom: 10,
  },
  roundTitle: {
    color: 'white',
    textAlign: 'center',
    fontSize: 17,
    marginBottom: 10
  },
  btnRound: {
    padding: 5,
    height: 30,
    marginRight: 10,
    marginBottom: 10,
    borderRadius: 5,
  },
  matchList: {
    flex: 1,
    alignItems: 'center'
  }
});

export default BetScreen;
