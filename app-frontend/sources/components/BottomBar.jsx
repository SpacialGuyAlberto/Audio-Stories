import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { Ionicons } from '@expo/vector-icons';
import * as Font from 'expo-font';
import { useNavigation } from '@react-navigation/native';
import { CreatePersonalizedStory } from './CreatePersonalizedStory';
import {HomeScreen} from './../containers/pages/HomeScreen';
import FontAwesome from '@expo/vector-icons/FontAwesome'
const BottomBar = () => {
  const [selectedTab, setSelectedTab] = useState('users');
  const navigation = useNavigation();

  useEffect(() => {
    async function loadFonts() {
      await Font.loadAsync({
        ...Ionicons.font,
        'FontAwesome': FontAwesome.font['FontAwesome'],
        // Add any other custom fonts you need to load here
      });
    }

    loadFonts();
  }, []);

  return (
    <View style={styles.container}>
      <TouchableOpacity
              style={styles.tab}
              onPress={() => setSelectedTab('reproduction-library')}
            >
              <Icon
                name={selectedTab === 'reproduction-library' ? 'list-circle' : 'list-circle-outline'}
                size={30}
                color={selectedTab === 'users' ? '#000' : '#888'}
              />
              <Text style={selectedTab === 'users' ? styles.activeTabText : styles.tabText}>
                Library
              </Text>
            </TouchableOpacity>
      <TouchableOpacity
                    style={styles.tab}
                    onPress={() => setSelectedTab('home')}
                    onPress={() => navigation.navigate('HomeScreen')}
                  >
                    <Icon
                      name={selectedTab === 'home' ? 'home' : 'home-outline'}
                      size={30}
                      color={selectedTab === 'home' ? '#000' : '#888'}
                    />
                    <Text style={selectedTab === 'users' ? styles.activeTabText : styles.tabText}>
                      Home
                    </Text>
     </TouchableOpacity>
        <TouchableOpacity
                         style={styles.tab}
                         onPress={() => setSelectedTab('new-story')}
                         onPress={() => navigation.navigate('CreatePersonalizedStory')}
                       >
                         <FontAwesome
                           name={selectedTab === 'new-story' ? 'plus-square' : 'plus-square-o'}
                           size={30}
                           color={selectedTab === 'new-story' ? '#000' : '#888'}
                         />
                         <Text style={selectedTab === 'new-story' ? styles.activeTabText : styles.tabText}>
                           New
                         </Text>
                       </TouchableOpacity>
      <TouchableOpacity
              style={styles.tab}
              onPress={() => setSelectedTab('profil')}
            >
              <Icon
                name={selectedTab === 'profil' ? 'person' : 'person-outline'}
                size={30}
                color={selectedTab === 'profil' ? '#000' : '#888'}
              />
              <Text style={selectedTab === 'profil' ? styles.activeTabText : styles.tabText}>
                User
              </Text>
            </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: '#ddd',
    paddingBottom: 7,
    paddingTop: 7,
  },
  tab: {
    alignItems: 'center',
  },
  tabText: {
    color: '#888',
    fontSize: 12,
  },
  activeTabText: {
    color: '#000',
    fontSize: 12,
  },
});

export default BottomBar;
