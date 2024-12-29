import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import FontAwesome from 'react-native-vector-icons/FontAwesome'
import BetScreen from './screens/BetScreen'
import BetInfosScreen from './screens/BetInfosScreen';
import RankScreen from './screens/RankScreen'
import HomeScreen from './screens/HomeScreen'
import MainScreen from './screens/MainScreen'
import SignupScreen from './screens/SignupScreen'
import LoginScreen from './screens/LoginScreen'
import ForgotPasswordScreen from './screens/ForgotPasswordScreen'
import { configureStore } from '@reduxjs/toolkit';
import { Provider } from 'react-redux';
import user from './reducers/user'
import { GestureHandlerRootView } from 'react-native-gesture-handler';

const Stack = createNativeStackNavigator()
const Tab = createBottomTabNavigator()

const TabNavigator = () => {
  return(
    <Tab.Navigator screenOptions={({route}) => ({
      tabBarIcon: ({color, size}) => {
        let iconName
        if (route.name === 'Bet') {
          iconName = 'soccer-ball-o'
        } else if (route.name === 'Rank') {
          iconName = 'trophy'
        } else if (route.name === 'Home') {
          iconName = 'gear'
        }
        return <FontAwesome name={iconName} size={size} color={color} />
      },
      tabBarActiveTintColor: '#2196f3',
      tabBarInactiveTintColor: 'gray',
      headerShown: false,
      // Démontage le composant au changement d'onglet
      unmountOnBlur: true
    })}>
      <Tab.Screen name='Bet' component={BetScreen} />
      <Tab.Screen name='Rank' component={RankScreen} />
      <Tab.Screen name='Home' component={HomeScreen} />
    </Tab.Navigator>
  )
}

const store = configureStore({
  reducer: {user}
})

export default function App() {

  return (
   <Provider store={store}>
    <GestureHandlerRootView>
    <NavigationContainer>
      <Stack.Navigator screenOptions={{headerShown: false}}>
        <Stack.Screen name='Main' component={MainScreen} />
        <Stack.Screen name='Login' component={LoginScreen} />
        <Stack.Screen name='Signup' component={SignupScreen} />
        <Stack.Screen name='ForgotPassword' component={ForgotPasswordScreen} />
        <Stack.Screen name='BetInfos' component={BetInfosScreen} />
        <Stack.Screen name='TabNavigator' component={TabNavigator} />
      </Stack.Navigator>
    </NavigationContainer>
    </GestureHandlerRootView>
   </Provider>
  );
}
