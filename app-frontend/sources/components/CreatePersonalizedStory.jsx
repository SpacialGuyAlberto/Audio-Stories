import React, {useEffect, useState} from 'react';
import {
    View,
    FlatList,
    StyleSheet,
    TextInput,
    TouchableOpacity,
    Pressable,
    Image
} from 'react-native';
import {useDispatch, useSelector} from 'react-redux';
import {get_categories} from '../redux/actions/categories';
import {get_audiobooks} from '../redux/actions/audiobooks';
import {create_audiobook} from '../redux/actions/audiobooks';
import {useNavigation} from '@react-navigation/native';
import {useNavigate} from 'react-router-dom';
import {LinearGradient} from 'expo-linear-gradient';
import {create_story, create_story_picture, create_story_speech} from '../redux/actions/story';
import {Audio} from 'expo-av';
import {btoa, atob} from 'react-native-quick-base64';
import axios from 'axios';
import * as eva from '@eva-design/eva';
import {ApplicationProvider, Layout} from '@ui-kitten/components';
import {Avatar, Button, ListItem, Text, Spinner} from '@ui-kitten/components';
import {StoryCard} from './StoryCard';
import TopBar from './NavBar';
import BottomBar from './BottomBar';

const CreatePersonalizedStory = ({}) => {
    const dispatch = useDispatch();
    const navigation = useNavigation();
    const [loading,
        setLoading] = useState(true);
    const [book,
        setBook] = useState([]);
    const [categories,
        setCategories] = useState([]);
    const [newBookTitle,
        setNewBookTitle] = useState('');
    const [newBookDuration,
        setNewBookDuration] = useState('');
    const [newPublication,
        setNewPublication] = useState('');
    const [newTextContent,
        setNewTextContent] = useState('');
    const [newAudioContent,
        setNewAudioContent] = useState(null);
    const [newCover,
        setNewCover] = useState('');
    const [newLanguage,
        setNewLanguage] = useState('');
    const [selectedCategories,
        setSelectedCategories] = useState([]);
    const [nameOfCategories,
        setNameOfCategories] = useState([]);
    const [story,
        setStory] = useState([]);
    const [storyPicture,
        setStoryPicture] = useState({});
    const [storyTitle,
        setStoryTitle] = useState('');
    const [sound,
        setSound] = useState();
    const [audioBuffer,
        setAudioBuffer] = useState({});

    useEffect(() => {
        dispatch(get_categories()).then((response) => {
            /* console.log('Fetched categories:', response); */
            setCategories(response.data);
            setLoading(false);
        }).catch((error) => {
            console.error('Error fetching categories:', error);
            setLoading(false);
        });
    }, []);

    /* const handleRedirect = () => {
      navigation.navigate('StoryCard/65821c2d8d5f98f290e06e86');
    }; */

    const handleAddBook = async() => {
        try {
            setLoading(true);
            const createdStory = await dispatch(create_story(nameOfCategories));
            const storyImage = await dispatch(create_story_picture(nameOfCategories));
            const sanitizedStory = createdStory.replace(/[\u0000-\u001F]+/g, "");
            const storyToJsonObject = JSON.parse(sanitizedStory);
            console.log(storyToJsonObject["title"]);

            const newBookData = {
                title: storyToJsonObject["title"],
                duration: 'duration',
                publication: 'newPublication',
                categories: ['Animals'],
                textContent: storyToJsonObject["content"],
                cover: storyImage.url,
                language: 'newLanguage'
            };
            axios
                .post(`http://192.168.178.36:8081/api/v1/books/`, newBookData)
                .then((response) => {
                    setBook([
                        ...book,
                        response.data
                    ]);
                    setNewBookTitle('');
                    setNewBookDuration('');
                    setStory([
                        ...story,
                        createdStory
                    ]);
                    dispatch(create_audiobook(response.data));
                    navigation.navigate('StoryCard', {audiobookId: response.data._id})
                })
                . finally(() => {
                    setLoading(false);
                    setSelectedCategories([]);
                    /* navigate(`StoryCard/${response.data._id}`); */
                });
        } catch (error) {
            console.error('Error creating book: ', error);
        }

    };

    const handleCategorySelect = async(item) => {
        const isSelected = selectedCategories.some((category) => category.name === item.name);
        if (isSelected) {
            setSelectedCategories((prevSelected) => prevSelected.filter((category) => category.name !== item.name));
        } else {
            setSelectedCategories((prevSelected) => [
                ...prevSelected,
                item
            ]);
        }
        const categoryNames = selectedCategories.map((category) => category.name);
        setNameOfCategories(categoryNames.toString());
        console.log(nameOfCategories);
    };

    const renderCategory = ({item}) => (
        <Pressable
            style={[
            styles.container, selectedCategories.some((category) => category.name === item.name) && {
                backgroundColor: '#637E76'
            }
        ]}
            onPress={() => handleCategorySelect(item)}>
            <Image
                style={{
                height: 55,
                width: 55
            }}
                source={{
                uri: item.uri
            }}/>
            <View
                style={{
                flex: 1,
                marginHorizontal: 8,
                justifyContent: "center"
            }}>
                <Text
                    numberOfLines={2}
                    style={{
                    fontSize: 13,
                    fontWeight: "bold",
                    color: "white"
                }}>
                    {item.name}
                </Text>
            </View>

        </Pressable>

    )
    return (
        <Layout style={[styles.container]}>
        <View style={[styles.topBar]}>
        <TopBar />
        </View>
            {loading
                ? (
                    <View style={styles.loadingContainer}>
                        <Spinner/>
                    </View>
                )
                : (
                    <View>
                        <FlatList
                            data={categories}
                            renderItem={renderCategory}
                            keyExtractor={(item) => item._id}
                            numColumns={2}/>
                        <Button style={[styles.categoryButton]} status="danger" onPress={handleAddBook}>
                            Create Story
                        </Button>
                    </View>
                )}
                <View style={styles.bottomBarContainer}>
                <BottomBar />
                </View>
        </Layout>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        paddingBottom: 12
        /* backgroundColor: '#fff', */
    },
    headerText: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 16
    },
    bookItem: {
        marginBottom: 16,
        borderColor: '#ccc',
        borderWidth: 1,
        padding: 12,
        borderRadius: 8
    },
    bookTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 8
    },
    bookInfo: {
        fontSize: 16
    },
    input: {
        height: 40,
        borderColor: 'gray',
        borderWidth: 1,
        marginBottom: 16,
        paddingHorizontal: 8
    },
    categoryButton: {
        flex: 1,
        justifyContent: 'center',
        marginHorizontal: '10%', // Adjust margin as needed
        marginVertical: '8%', // Adjust margin as needed
        backgroundColor: '#282828',
        borderRadius: 4,
        padding: 10, // Adjust padding as needed
        width: '80%', // Adjust the width as needed
        alignSelf: 'center', // Center the button horizontally
    },
    categoryButtonText: {
        fontSize: 1,
        color: '#fff', // Add your preferred text color
    },
    gradient: {
        flex: 1,
        borderRadius: 8,
        alignItems: 'center',
        justifyContent: 'center'
    },
    topBar:{
        marginTop: -250
    },
     bottomBarContainer: {
             marginBottom: '-160%'// This ensures that items are centered vertically within the container
          },
});

const mapStateToProps = state => ({categories: state.Categories.categories, audiobook: state.book.book})

/* export default() => (
    <ApplicationProvider {...eva} theme={eva.light}>
        <CreatePersonalizedStory/>
    </ApplicationProvider>
); */
export default CreatePersonalizedStory;