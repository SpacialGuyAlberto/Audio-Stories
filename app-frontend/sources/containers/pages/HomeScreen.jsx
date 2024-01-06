import React, { useEffect, useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
/* import { ListItem } from 'react-native-paper'; */
import StoryList from './StoryList';
import { useNavigation } from '@react-navigation/native'; // Import the useNavigation hook
import * as eva from '@eva-design/eva';
import { ApplicationProvider, Layout } from '@ui-kitten/components';
import { Avatar, Button, ListItem, Text, TopNavigation } from '@ui-kitten/components';
import { LinearGradient } from 'expo-linear-gradient';
import  TopBar  from '../../components/NavBar';
import BottomBar from '../../components/BottomBar';

const HomeScreen = () => {
  const dispatch = useDispatch();
  const navigation = useNavigation(); // Get the navigation object using the hook

  const RenderBook = ({ item }) => (
    <View >
      <ListItem
        title={item.title}
        description='A set of React Native components'
        onPress={() => navigation.navigate('StoryCard', { audiobookId: item._id })}
      />
    </View>
  );
  return (
  <Layout style={{flex: 1,  paddingHorizontal: 5}}>
    <TopBar/>
    <View style={styles.content}>
      <Text style={styles.headerText}>Welcome to Chiky tales</Text>
       <Text style={styles.headerText}>
            Guten Morgen, Luis.
       </Text>
      <StoryList/>
    </View>
         <BottomBar style={styles.bottomNavigation}/>
   </Layout>

  );
};

const styles = StyleSheet.create({
   button: {
      margin: 2,
    },
  container: {
    flex: 1,
    paddingHorizontal: 16,
  },
  content:{
    flex: 1,
  },
  headerText: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
  },
   bottomNavigation: {
      position: 'absolute',
      left: 0,
      right: 0,
      bottom: 0,
    },
});

export default HomeScreen;
