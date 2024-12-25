import React from 'react'
import { Dimensions, Text, View, StyleSheet, SafeAreaView, SafeAreaProvider, ImageBackground, Image, ScrollView } from 'react-native';
import Carousel from 'react-native-reanimated-carousel';
import { useSelector } from 'react-redux';

const BetScreen = () => {

  const user = useSelector(store => store.user.value)

  // Carousel
  const width = Dimensions.get('window').width
  const height = Dimensions.get('window').height
  const carousel = <Carousel
                loop
                width={width}
                height={600}
                data={[...new Array(6).keys()]}
                scrollAnimationDuration={500}
                onSnapToItem={(index) => console.log('current index:', index)}
                renderItem={({ index }) => (
                    <View
                        style={{
                            flex: 1,
                            borderWidth: 1,
                            justifyContent: 'center',
                            backgroundColor: 'grey'
                        }}
                    >
                        <Text style={{ textAlign: 'center', fontSize: 30 }}>
                            {index}
                        </Text>
                    </View>
                )}
            />

  return (
      <SafeAreaView style={styles.main}>
        <ImageBackground source={require('../assets/background.png')} style={styles.background}>
          <Image style={styles.logo} source={require('../assets/WannaBet_Logo.png')} />
          <Text style={styles.title}>
            Bonjour {user.username}, tu as {user.coins} coins
          </Text>
          <ScrollView>
            {carousel}
          </ScrollView>
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
    }
  });

export default BetScreen