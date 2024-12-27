import React from 'react'
import {View, Text, StyleSheet} from 'react-native'

const UserRank = (props) => {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>{props.username}</Text>
      <Text style={styles.text}>{props.index + 1}</Text>
      <Text style={styles.text}>{props.points}</Text>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#dcdcdc',
    padding: 10,
  },
  text: {
    flex: 1,
    fontSize: 14,
    textAlign: 'center',
    color: 'white',
  },
})

export default UserRank