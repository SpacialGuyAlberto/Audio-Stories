import React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import Signup from './sources/containers/auth/Signup';
import Activation from './sources/containers/auth/Activation';
import { Provider } from 'react-redux';
import store from './sources/redux/store'; // Importa tu store de Redux
import Login from './sources/containers/auth/Login';
import HomeScreen from './sources/containers/pages/HomeScreen';
import CreatePersonalizedStory from './sources/components/CreatePersonalizedStory';
import StoryCard from './sources/components/StoryCard';
const Stack = createStackNavigator();
import * as eva from '@eva-design/eva';
import { ApplicationProvider, Layout, IconRegistry, Text } from '@ui-kitten/components';
import { EvaIconsPack } from '@ui-kitten/eva-icons';


const App = () => {
  return (
    <Provider store={store}>
      <NavigationContainer>
        <Stack.Navigator initialRouteName='Login'>
         <Stack.Screen name="HomeScreen" component={HomeScreen} />
         <Stack.Screen name="CreatePersonalizedStory" component={CreatePersonalizedStory} />
         <Stack.Screen name="StoryCard" component={StoryCard} />
        
          <Stack.Screen name="SignUp" component={Signup}/>
          <Stack.Screen name="Activation" component={Activation} options={{title: 'Activation'}}/>
          <Stack.Screen name="Login" component={Login} options={{title: 'Login'}}/>
        </Stack.Navigator>
      </NavigationContainer>
    </Provider>
  );
};

export default () => (
<>
 <IconRegistry icons={EvaIconsPack} />
 <ApplicationProvider {...eva} theme={eva.dark}>
    <App />

  </ApplicationProvider>
</>
);
