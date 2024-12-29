import React, { useState, useEffect } from "react";
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    StyleSheet,
    Image,
    ImageBackground,
    Keyboard,
    TouchableWithoutFeedback
} from "react-native";
import FontAwesome from "react-native-vector-icons/FontAwesome";
import { useNavigation } from '@react-navigation/native'
import { useSelector } from 'react-redux'

const BetInfosScreen = ({ route }) => {
    // Etats
    const user = useSelector(store => store.user.value)
    const navigation = useNavigation()
    const [homeData, setHomeData] = useState(null)
    const [awayData, setAwayData] = useState(null)
    const [error, setError] = useState(null)

    // Si l'utilsiateur n'est pas connecté, il est redirigé
    useEffect(() => {
        if (!user.token) {
            navigation.navigate('Login')
        }
    }, [])

    // Récupération des informations a afficher selon les paramétres de route
    useEffect(() => {
        // Récupérer les paramétres de route
        const { IdHome, IdAway } = route.params
        // Fonction de récupération
        const getInfos = async (id) => {
            const response = await fetch(`http://${process.env.EXPO_PUBLIC_IP_ADDRESS}:3000/teams/get/${id}`)
            const data = await response.json()
            if (data.result) {
                return data
            } else {
                console.log(data.error)
                setError(data.error)
            }
        }
        // Mise en place d'un environnement auto-exécuté asynchrone pour appeler la fonction
        (async () => {
            // Récupération des infos de l'équipe home
            const home = await getInfos(IdHome)
            setHomeData(home.team)
            // Récupération des infos de l'équipe away
            const away = await getInfos(IdAway)
            setAwayData(away.team)
        })()
    }, [])

    // Afficher l'historique des amtchs sous formes de cercles colorés
    const displayTeamHistory = team => {
        return team.map((fixture, index) => (
            <View key={index} style={styles.fixtureRow}>
                <Text style={styles.fixtureText}>{fixture.opponent}</Text>
                <FontAwesome name="circle" size={16} color={fixture.result === "win" ? "green" : fixture.result === "loose" ? "red" : "yellow"} style={styles.icon} />
            </View>
        ))
    }

    return (
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
            <ImageBackground source={require("../assets/background.png")} style={styles.background}>
                <View style={styles.container}>
                    {/* Retour arriére */}
                    <FontAwesome
                        name="arrow-left"
                        size={30}
                        color="white"
                        style={styles.backButton}
                        onPress={() => navigation.goBack()}
                    />
                    {/* Infos du match */}
                    {homeData && awayData &&
                    <>
                    <View style={styles.bestPlayersContainer}>
                        <View style={styles.teamColumn}>
                            <Image source={{ uri: homeData.logo }} style={styles.teamLogoLarge} />
                            <Text style={styles.playerInfo}>
                                {`Meilleur buteur : ${homeData.bestPlayer.name} (${homeData.bestPlayer.goals} buts)`}
                            </Text>
                            <Text style={styles.playerInfo}>
                            {`Meilleur passeur : ${homeData.bestAssister.name} (${homeData.bestAssister.assists} assists)`}
                            </Text>
                            <Text style={styles.playerInfo}>
                            {`Meilleure note : ${homeData.bestRatedPlayer.name} (${homeData.bestRatedPlayer.note})`}
                            </Text>
                        </View>

                        <View style={styles.teamColumn}>
                            <Image source={{ uri: awayData.logo }} style={styles.teamLogoLarge} />
                            <Text style={styles.playerInfo}>
                            {`Meilleur buteur : ${awayData.bestPlayer.name} (${awayData.bestPlayer.goals} buts)`}
                            </Text>
                            <Text style={styles.playerInfo}>
                            {`Meilleur passeur : ${awayData.bestAssister.name} (${awayData.bestAssister.assists} assists)`}
                            </Text>
                            <Text style={styles.playerInfo}>
                            {`Meilleure note : ${awayData.bestRatedPlayer.name} (${awayData.bestRatedPlayer.note})`}
                            </Text>
                        </View>
                    </View>

                    <View style={styles.lastFixturesContainer}>
                        <View style={styles.teamColumnLF}>
                            {displayTeamHistory(homeData.lastFixtures)}
                        </View>

                        <View style={styles.teamColumnLF}>
                            {displayTeamHistory(awayData.lastFixtures)}
                        </View>
                    </View>

                    </>
                    }
                </View>
            </ImageBackground>
        </TouchableWithoutFeedback >
    )
}

const styles = StyleSheet.create({
    background: {
        flex: 1,
        resizeMode: "cover",
        paddingTop: 40,
        padding: 20,
    },
    container: {
        flex: 1,
        padding: 20,
    },
    matchInfo: {
        flexDirection: "row",
        justifyContent: "space-between",
        marginTop: 50,
        backgroundColor: "grey",
    },
    teamInfo: {
        flexDirection: "row",
        alignItems: "center",
    },
    teamLogo: {
        width: 50,
        height: 50,
    },
    bestPlayersContainer: {
        flexDirection: "row",
        justifyContent: "space-around",
        marginTop: 30,
        backgroundColor: "grey",
        padding: 10,
        borderRadius: 10
      },
      teamColumn: {
        alignItems: "center",
        width: "45%",
      },
      teamLogoLarge: {
        width: 100,
        height: 100,
        marginBottom: 20,
      },
      playerInfo: {
        color: "white",
        fontSize: 14,
        marginBottom: 10,
        textAlign: "center",
      },
      lastFixturesContainer: {
        flexDirection: "row",
        justifyContent: "space-between",
        marginTop: 20,
        paddingHorizontal: 20,
        backgroundColor: 'grey',
        alignItems: "flex-start",
        padding: 10,
        borderRadius: 10
      },
      teamColumnLF: {
        width: "45%", 
        alignItems: "flex-start",
      },
      fixtureRow: {
        flexDirection: "row",
        justifyContent: "space-between", 
        alignItems: "center", 
        width: "100%", 
        marginVertical: 5, 
      },
      fixtureText: {
        color: "white",
        fontSize: 14,
        marginRight: 10,
      }
})

export default BetInfosScreen