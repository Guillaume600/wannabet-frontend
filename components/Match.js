import React, { useState } from 'react'
import { Text, View, Pressable, TextInput, KeyboardAvoidingView, SafeAreaView, Modal, Platform, StyleSheet, Dimensions, TouchableOpacity, Image } from 'react-native'
import { useSelector, useDispatch } from 'react-redux'
import { update } from '../reducers/user'
import {useNavigation} from '@react-navigation/native'

const Match = (props) => {
    // Destructuration des données
    const { name: nameHome, logo: logoHome } = props.teamHome
    const { name: nameAway, logo: logoAway } = props.teamAway
    const { home: goalsHome, away: goalsAway} = props.score

    // Etats
    const [showModal, setShowModal] = useState(false)
    const [scoreHome, setScoreHome] = useState(null)
    const [scoreAway, setScoreAway] = useState(null)
    const [stake, setStake] = useState(null)
    const user = useSelector(store => store.user.value)
    const dispatch = useDispatch()
    const navigation = useNavigation()

    // Handler cancel modal
    const handleCancelModal = () => {
        setShowModal(false)
        setScoreHome(null)
        setScoreAway(null)
        setStake(null)
    }

    // Handler d'envoi du pari
    const handlePress = async () => {
        if (scoreHome && scoreAway && stake) {
            const response = await fetch(`http://${process.env.EXPO_PUBLIC_IP_ADDRESS}:3000/bets/new`, {method: 'POST', headers:{"Content-Type":"application/json"}, body: JSON.stringify({token: user.token, matchId: props._id, predictedScore: {home: scoreHome, away: scoreAway}, stake})})
            const data = await response.json()
            if (data.result) {
                dispatch(update({coins: user.coins - stake}))
            } else {
                console.log(data)
            }
            handleCancelModal()
        }
    }

    // Handler de navigation vers la page More Infos
    const handleMoreInfo = () => {
      navigation.navigate('BetInfos', {IdHome: props.teamHome.teamId, IdAway: props.teamAway.teamId})
    }

    // Afficher le bouton bet ou le score
    const displayBtnOrScore = 
    props.status === 'Terminé' && goalsHome !== null && goalsAway !== null ? 
    <Text style={{fontSize: 30, color: 'white', marginBottom: 10}}>{goalsHome} - {goalsAway}</Text> :
    <TouchableOpacity style={styles.btn} onPress={() => setShowModal(!showModal)}>
      <Text style={styles.textBtn}>Bet</Text>
    </TouchableOpacity>

    return (
        <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
            <SafeAreaView>
                <View style={styles.match}>
                    {/* Modal */}
                    <Modal
                        animationType='fade'
                        transparent={true}
                        visible={showModal}
                        onRequestClose={() => setShowModal(false)}>
                        <TouchableOpacity onPress={() => setShowModal(!showModal)}>
                            <View style={styles.modal}>
                                <View style={styles.modalContainer}>
                                    <View style={styles.modalHeader}>
                                        <TouchableOpacity style={styles.modalBtn} onPress={() => handlePress()}>
                                            <Text>Bet</Text>
                                        </TouchableOpacity>
                                        <TouchableOpacity style={styles.modalBtn} onPress={() => handleCancelModal()}>
                                            <Text>Cancel</Text>
                                        </TouchableOpacity>
                                    </View>
                                    <View style={styles.modalMain}>
                                        <View style={styles.team}>
                                            <Image source={{ uri: logoHome }} style={styles.teamLogo} />
                                            <Text style={styles.textMatch}>{nameHome}</Text>
                                        </View>
                                        <View style={styles.inputContainer}>
                                            <View style={styles.inputScoreContainer}>
                                                <TextInput
                                                    style={styles.scoreInput}
                                                    value={scoreHome}
                                                    keyboardType='numeric'
                                                    onChangeText={value => setScoreHome(value)} />
                                                <Text style={{ alignItems: 'center', paddingTop: 12, color: 'white' }}>-</Text>
                                                <TextInput
                                                    style={styles.scoreInput}
                                                    value={scoreAway}
                                                    keyboardType='numeric'
                                                    onChangeText={value => setScoreAway(value)} />
                                            </View>
                                            <TextInput
                                                style={styles.putting}
                                                value={stake}
                                                keyboardType='numeric'
                                                onChangeText={value => setStake(value)}
                                            />
                                        </View>
                                        <View style={styles.team}>
                                            <Image source={{ uri: logoAway }} style={styles.teamLogo} />
                                            <Text style={styles.textMatch}>{nameAway}</Text>
                                        </View>
                                    </View>
                                </View>
                            </View>
                        </TouchableOpacity>
                    </Modal>
                    {/* End Modal */}
                    <View style={styles.teamContainer}>
                        <View style={styles.team}>
                            <Image source={{ uri: logoHome }} style={styles.teamLogo} />
                            <Text style={styles.textMatch}>{nameHome}</Text>
                        </View>
                        <View style={styles.inputContainer}>
                            {/* display Bet button if match is NS or TBD or score if it FT */}
                            {displayBtnOrScore}
                            <TouchableOpacity style={styles.btn} onPress={() => handleMoreInfo()}>
                                <Text style={styles.textBtn}>More infos</Text>
                            </TouchableOpacity>
                        </View>
                        <View style={styles.team}>
                            <Image source={{ uri: logoAway }} style={styles.teamLogo} />
                            <Text style={styles.textMatch}>{nameAway}</Text>
                        </View>
                    </View>
                </View>
            </SafeAreaView>
        </KeyboardAvoidingView >
    )
}

const styles = StyleSheet.create({
    match: {
      width: Dimensions.get('window').width - 40,
      backgroundColor: 'grey',
      margin: 10,
      borderWidth: 3,
      borderColor: 'grey',
      borderRadius: 20,
      padding: 10,
      justifyContent: 'center',
      alignItems: 'center'
    },
    textMatch: {
      marginTop: 5,
      color: 'white',
      textAlign: 'center'
    },
    teamLogo: {
      height: 70,
      width: 70
    },
    team: {
      width: 90,
      justifyContent: 'center',
      alignItems: 'center',
    },
    matchDate: {
      fontSize: 20,
      margin: 5,
      color: 'white'
    },
    inputContainer: {
      justifyContent: 'center',
      alignItems: 'center'
    },
    inputScoreContainer: {
      flexDirection: 'row',
    },
    putting: {
      margin: 5,
      borderWidth: 2,
      borderRadius: 10,
      borderColor: '#4d4949',
      height: 40,
      width: 60,
      backgroundColor: 'white',
      color: 'black',
      textAlign: 'center'
    },
    scoreInput: {
      margin: 5,
      borderWidth: 2,
      borderRadius: 10,
      borderColor: '#4d4949',
      height: 40,
      width: 40,
      backgroundColor: 'white',
      color: 'black',
      textAlign: 'center'
    },
    teamContainer: {
      padding: 5,
      width: '100%',
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center'
    },
    btn: {
      borderWidth: 1,
      borderColor: '#75C87B',
      borderRadius: 10,
      alignItems: 'center',
      backgroundColor: '#75C87B',
      padding: 5,
      marginBottom: 5,
    },
    modal: {
      height: Dimensions.get('window').height,
      width: Dimensions.get('window').width,
      paddingTop: 180,
      flexDirection: 'row',
      justifyContent: 'center',
      backgroundColor: 'rgba(0,0,0,0.5)'
    },
    modalMain: {
      marginTop: 20,
      flexDirection: 'row',
      justifyContent: 'space-around'
    },
    modalContainer: {
      backgroundColor: 'grey',
      height: '30%',
      width: '80%',
      borderRadius: 20,
    },
    modalHeader: {
      width: '100%',
      flexDirection: 'row',
      justifyContent: 'space-around'
    },
    modalBtn: {
      borderWidth: 1,
      borderColor: '#75C87B',
      borderRadius: 10,
      alignItems: 'center',
      backgroundColor: '#75C87B',
      padding: 5,
      marginTop: 10
    }
  })

export default Match