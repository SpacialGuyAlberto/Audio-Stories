import React, { useEffect, useState } from 'react';
import { View, FlatList, StyleSheet , TextInput, ImageProps, TouchableOpacity, ListRenderItemInfo} from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { get_audiobooks } from '../../redux/actions/audiobooks';
import { useNavigation } from '@react-navigation/native';
import { Navigate } from 'react-router-dom';
import ImagePicker from 'react-native-image-picker';
import axios from 'axios';
import CreatePersonalizedStory from '../../components/CreatePersonalizedStory';
import StoryCard from '../../components/StoryCard';
import { LinearGradient } from 'expo-linear-gradient';
import { create_story } from '../../redux/actions/story';
/* import { List } from 'react-native-paper'; */
import * as eva from '@eva-design/eva';
import { ApplicationProvider, Layout } from '@ui-kitten/components';
import { Avatar, Button, ListItem, Text, Card, List } from '@ui-kitten/components';
import Carousel from 'react-native-snap-carousel';
import { Dimensions } from 'react-native';

const InstallButton = (): React.ReactElement => (
  <Button size='tiny'>
    PLAY PREVIEW OF STORY
  </Button>
);

const ItemImage = (props: ImageProps): React.ReactElement => (
  <Avatar
    {...props}
    style={[props.style, styles.itemImage]}
  />
);

const StoryList = ({}) => {
  const dispatch = useDispatch();
  const navigation = useNavigation();
  const [loading, setLoading] = useState(true);
  const [books, setBooks] = useState([]);
  const screenWidth = Dimensions.get('window').width;
  const sliderWidth = screenWidth;
  const itemWidth = screenWidth * 0.75; // For example, 75% of the screen width


    useEffect(() => {
      dispatch(get_audiobooks())
        .then((response) => {
        /*   console.log('Fetched audiobooks:', response.data); */
          setBooks(response.data);
          setLoading(false);
        })
        .catch((error) => {
          console.error('Error fetching audiobooks:', error);
          setLoading(false);
        });
    }, []);

    const RenderBook = ({ item }) => (
             <ListItem
                title={(evaProps) => <Text {...evaProps} style={styles.bookTitle}>{item.title}</Text>}
                description={(evaProps) => <Text {...evaProps} style={styles.bookInfo}>A set of React Native components</Text>}
                accessoryLeft={() => <ItemImage source={{ uri: String(item.cover) }} />}
                onPress={() => navigation.navigate('StoryCard', { audiobookId: item._id })}
              />
     );
    return (
      <View >
         <Text style={styles.subHeaderText}>
         Explore these new titles.
         </Text>
         <Carousel
             data={books}
             renderItem={RenderBook}
             sliderWidth={sliderWidth}
             itemWidth={itemWidth}
             keyExtractor={(item) => item._id}
             windowSize={5}
             style={styles.carouselContainer}
         />
         <Text style={styles.subHeaderText} >
         Suggested for you based on your tastes.
         </Text>
         <Carousel
           data={books}
           renderItem={RenderBook}
           sliderWidth={sliderWidth}
           itemWidth={itemWidth}
           keyExtractor={(item) => item._id}
           windowSize={5}
         />
          <Text style={styles.subHeaderText} >
           More like...
          </Text>
          <Carousel
           data={books}
           renderItem={RenderBook}
           sliderWidth={sliderWidth}
           itemWidth={itemWidth}
           keyExtractor={(item) => item._id}
           windowSize={5}
           />
          <Text style={styles.subHeaderText} >
            Try something new
          </Text>
          <Carousel
            data={books}
            renderItem={RenderBook}
            sliderWidth={sliderWidth}
            itemWidth={itemWidth}
            keyExtractor={(item) => item._id}
            windowSize={5}
             />
  </View>
    );
  };

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 30,
    backgroundColor: '#fff',
  },
  carouselContainer:{
  marginBottom: 10
  },
  subHeaderText: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 16,
    marginBottom: -1,
    marginTop: 5
  },
  bookItem: {
    marginBottom: 20,
    borderColor: '#ccc',
    borderWidth: 1,
    padding: 15,
    borderRadius: 8,
  },
  bookTitle: {
    fontSize: 19,
    fontWeight: 'bold',
    marginBottom: 10,
    marginLeft: 5
  },
  bookInfo: {
    fontSize: 15,
    marginLeft: 5
  },
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 16,
    paddingHorizontal: 8,
  },
    gradient: {
        flex: 1,
        borderRadius: 8,
        alignItems: 'center',
        justifyContent: 'center',
      },
     link: {
        color: 'blue',
        textDecorationLine: 'underline',
      },
       itemImage: {
          tintColor: null,
          width: 80,
          borderRadius: 5,
          height: 90
        },
});

const mapStateToProps = state => ({
     categories: state.Categories.categories,
     books: state.Books.Books,
})

{/* export default () => (
     <ApplicationProvider {...eva} theme={eva.light}>
        <StoryList />
      </ApplicationProvider>
); */}
export default StoryList;
