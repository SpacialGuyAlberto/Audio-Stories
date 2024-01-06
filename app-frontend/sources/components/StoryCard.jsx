import React, {useEffect, useState} from 'react';
import {View, StyleSheet, ScrollView, Image} from 'react-native';
import {useDispatch, useSelector} from 'react-redux';
import {get_audiobook, get_audiobooks} from '../redux/actions/audiobooks';
import {useNavigation, useRoute} from '@react-navigation/native';
import {Audio} from 'expo-av';
import {btoa, atob} from 'react-native-quick-base64';
import {Avatar, Text} from 'react-native-paper';
import {create_story_speech} from './../redux/actions/story';
import {Spinner} from '@ui-kitten/components';
import {Card, Block, theme, Button} from 'galio-framework';
import Ionicons from '@expo/vector-icons/Ionicons';
import materialTheme from './theme';
import {Entypo, Foundation, MaterialIcons, AntDesign} from '@expo/vector-icons';
import {LinearGradient} from 'expo-linear-gradient';
import BottomBar from './BottomBar';
import Slider from '@react-native-community/slider';


const StoryCard = ({}) => {
    const dispatch = useDispatch();
    const navigation = useNavigation();
    const [playbackPosition, setPlaybackPosition] = useState(0);
    const [playbackDuration, setPlaybackDuration] = useState(0);
    const route = useRoute();
    const audiobookId = route.params
        ?.audiobookId;

    const [storyChunks,
        setStoryChunks] = useState([]); // New state for story chunks
    const [loading,
        setLoading] = useState(false);
    const [book,
        setBook] = useState([]);
    const [books,
        setBooks] = useState([]);
    const [sound,
        setSound] = useState();
    const [audioBuffer,
        setAudioBuffer] = useState({});
    const [story,
        setStory] = useState([]);
    const [isPlaying,
        setIsPlaying] = useState(false);
    const [isPaused,
        setIsPaused] = useState(false);
    const [currentChunk,
        setCurrentChunk] = useState(0);
    const [previousBookId,
        setPreviousBookId] = useState('');
    const [nextBookId,
        setNextBookId] = useState('');

    const base64ToByteArray = (base64) => {
        const binaryString = atob(base64);
        const byteArray = new Uint8Array(binaryString.length);
        for (let i = 0; i < binaryString.length; i++) {
            byteArray[i] = binaryString.charCodeAt(i);
        }
        return byteArray;
    };

    const playSound = async(audioBuffer) => {
        try {
            console.log('Loading Sound from buffer');
            let bufferString = '';
            for (let i = 0; i < audioBuffer.length; i++) {
                bufferString += String.fromCharCode(audioBuffer[i]);
            }

            const {sound: newSound} = await Audio
                .Sound
                .createAsync({
                    uri: 'data:audio/mp3;base64,' + btoa(bufferString)
                }, {shouldPlay: true});

            setSound(newSound);
            setLoading(false);
            newSound.setOnPlaybackStatusUpdate((status) => {
                if (status.isLoaded){

                     setPlaybackPosition(status.positionMillis);
                     setPlaybackDuration(status.durationMillis);
                }
                if (status.didJustFinish && !status.isLooping) {
                    setIsPlaying(false);
                    if (currentChunk < storyChunks.length - 1) {
                        setCurrentChunk(currentChunk + 1);
                        playNextChunk();
                    }
                }
            });

            if (!isPaused) {
                await newSound.playAsync();

            }
        } catch (error) {
            console.error('Error loading or playing sound:', error);
            setLoading(false);
        }
    };


    const playNextChunk = async() => {
        if (currentChunk < storyChunks.length) {
            const chunk = storyChunks[currentChunk];
            const response = await create_story_speech(chunk);
            const audioBuffer = base64ToByteArray(response.data.audioBuffer);
            await playSound(audioBuffer);
        }
    };
    useEffect(() => {
        return sound
            ? () => {
                console.log('Unloading Sound');
                sound.unloadAsync();
            }
            : undefined;
    }, [sound]);

    const playPauseSound = async() => {
        if (!sound) {
            await handleCreateSpeech();
            setLoading(true);
        } else {
        setLoading(false)
            if (isPlaying) {
                await sound.pauseAsync();
                setIsPaused(true);

            } else {
                await sound.playAsync();
                setIsPaused(false);
            }
            setIsPlaying(!isPlaying);
        }
    };
    const clearAudiobookData = async() => {
        if (sound) {
            await sound.stopAsync();
            await sound.unloadAsync();
            setSound(null);
        }
         setIsPlaying(false);
         setIsPaused(false);
         setPlaybackPosition(0);
         setPlaybackDuration(0);
         setStoryChunks([]);
         setCurrentChunk(0);
         setBook([]);
    };

    const handleCreateSpeech = async() => {
        try {
            const storyString = String(book.textContent);
            const chunkSize = 1000;
            const chunks = [];
            let startPos = 0;

            for (let i = 0; i < storyString.length; i += chunkSize) {
                const chunk = storyString.slice(i, i + chunkSize);
                chunks.push(chunk);
            }
            setStoryChunks(chunks); // Assuming storyChunks is part of the state
            setCurrentChunk(0);
            playNextChunk();
        } catch (err) {
            console.error('Error creating story speech:', err);
        }
    };

    // GET INDIVIDUAL BOOK//
    useEffect(() => {
        dispatch(get_audiobook(audiobookId)).then((response) => {
            console.log('Fetched individual audiobook:', response.data._id);
            setBook(response.data);
            setLoading(false);
        }).catch((error) => {
            console.error('Error fetching audiobook:', error);
            setLoading(false); // Manejar el estado de carga en caso de error
        });
    }, [audiobookId]);

    //GET ALL THE BOOKS //

    useEffect(() => {
        dispatch(get_audiobooks()).then((response) => {
            console.log('Fetched audiobooks:', response.data);
            setBooks(response.data);
            setLoading(false);
        }).catch((error) => {
            console.error('Error fetching audiobooks:', error);
            setLoading(false);
        });
    }, []);

    // CREATE THE PREVIOUS BUTTON //
    const handlePreviousBook = async() => {
        for (let i = 0; i < books.length; i++) {
            if (books[i]["_id"] === audiobookId) {
                /*     const previousBookId = books[i-1]["_id"]; */
                setPreviousBookId(books[i - 1]["_id"]);
            }
        }
        console.log(previousBookId);
/*         stopSound(); */
        navigation.navigate('StoryCard', {audiobookId: previousBookId})
    }

    // CREATE THE NEXT BUTTON //
   const handleNextBook = async () => {
       let foundIndex = books.findIndex(book => book["_id"] === audiobookId);
       if (foundIndex !== -1 && foundIndex < books.length - 1) {
           const nextBookId = books[foundIndex + 1]["_id"];
           console.log("Navigating to next book with ID:", nextBookId);
           clearAudiobookData();

           navigation.navigate('StoryCard', { audiobookId: nextBookId });
       } else {
           // Handle the case when it's the last book
           console.log("This is the last book in the list.");
           // Optionally navigate to the first book or show a message
       }
   };


    const skipForward = async () => {
        if (sound){
            const status = await sound.getStatusAsync();
            const newPosition = status.positionMillis + 5000;
            if (newPosition < status.playableDurationMillis) {
            await sound.setPositionAsync(newPosition);
            }
        }
    };

    const skipBackward = async () => {
        if (sound) {
            const status = await sound.getStatusAsync();
            const newPosition = status.positionMillis - 5000; // 10 seconds backward
            if (newPosition > 0) {
                await sound.setPositionAsync(newPosition);
            } else {
                await sound.setPositionAsync(0);
            }
        }
    };

    const renderTextChunks = () => {
        return storyChunks.map((chunk, index) => (
            <Text
                key={index}
                style={index === currentChunk ? styles.highlightedText : styles.normalText}
            >
                {chunk}
            </Text>
        ));
    };

    /* const LeftContent = props => <Avatar.Icon {...props} icon="folder"/> */
    return (

        <View style={styles.container}>
        <ScrollView style={{flex: 1}}>
            <View style={styles.imageContainer}>
            <Image
                style={styles.image}
                source={{
                uri: book.cover
            }}
                contentFit="cover"/>
            </View>
            <Slider
                style={{width: '100%', height: 40}}
                minimumValue={0}
                maximumValue={playbackDuration}
                value={playbackPosition}
                onSlidingStart={() => {
                    if (sound){
                        sound.pauseAsync();
                    }
                }}
                onSlidingComplete={async value => {
                        if (sound) {
                            await sound.setPositionAsync(value);
                            if (isPlaying) {
                                sound.playAsync(); // Resume playing after sliding
                            }
                        }
                    }}
                    minimumTrackTintColor="#3085C3"
                    maximumTrackTintColor="#000000"
            />
            <View style={styles.buttonContainer}>
                <Button
                  onlyIcon
                  icon='banckward'
                  iconFamily="AntDesign"
                  iconSize={20}
                  color="#3085C3"
                  iconColor="#fff"
                  style={styles.otherButton}
                  onPress={skipBackward}/>
                <Button
                    onlyIcon
                    icon='skip-previous'
                    iconFamily="MaterialIcons"
                    iconSize={30}
                    color="#3085C3"
                    iconColor="#fff"
                    style={styles.otherButton}
                    onPress={handlePreviousBook}
                    />
                {  loading ? (
                        <View style={styles.spinnerContainer}>
                            <Spinner />
                        </View>
                    )
                    : (<Button
                        onlyIcon
                        icon={isPlaying && !isPaused
                        ? 'pause'
                        : 'caretright'}
                        iconFamily="antdesign"
                        iconSize={30}
                        color="#3085C3"
                        iconColor="#fff"
                        style={styles.playButton}
                        onPress={playPauseSound}/>)
                    }
                <Button
                    onlyIcon
                    icon='controller-next'
                    iconFamily="Entypo"
                    iconSize={30}
                    color="#3085C3"
                    iconColor="#fff"
                    style={styles.otherButton}
                    onPress={handleNextBook}/>
                <Button
                    onlyIcon
                    icon='forward'
                    iconFamily="AntDesign"
                    iconSize={20}
                    color="#3085C3"
                    iconColor="#fff"
                    style={styles.otherButton}
                    onPress={skipForward}/>

            </View>
           <Card flex borderless style={styles.card}  shadow={true}>
                <Text style={styles.bookTitle}>{book.title}</Text>
                <Text style={styles.bookInfo}>
                {book.textContent}
              </Text>

            </Card>
            <BottomBar/>
              </ScrollView>
        </View>

    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingHorizontal: 16,
        paddingTop: 24
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
        fontSize: 32,
        fontWeight: 'bold',
        marginBottom: 8
    },
    bookInfo: {
        fontSize: 25,
        color: '#6D6875'
    },
    buttonContainer: {
        flexDirection: 'row', // Aligns buttons horizontally
        justifyContent: 'center', // Centers buttons in the container
        alignItems: 'center', // Aligns buttons vertically
        padding: 10, // Add padding around the buttons
        marginTop: '5%',
        marginRight: '10%'
    },
    input: {
        height: 40,
        borderColor: 'gray',
        borderWidth: 1,
        marginBottom: 16,
        paddingHorizontal: 8
    },
    gradient: {
        flex: 1,
        borderRadius: 8,
        alignItems: 'center',
        justifyContent: 'center'
    },
      highlightedText: {
            color: 'red', // Highlight color
            // ... other styling ...
        },
    imageContainer:{
         height: 500, // Or any appropriate height
         width: '100%'
    },
    image: {
        flex: 5,
        width: '100%',
        height: 500,
        borderRadius: 18
    },
    normalText: {
            color: 'black',
            // ... other styling ...
        },
    playButton: {
        left: '50%', // Center horizontally
        transform: [
            {
                translateX: -20
            }, {
                translateY: -20
            }
        ],
        width: 70,
        height: 70
    },
    otherButton: {
        left: '50%',
        transform: [
            {
                translateX: -20
            }, {
                translateY: -20
            }
        ],
        width: 40,
        height: 40
    },
    spinnerContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: '10%'
    },
    scrollContainer: {
        /* backgroundColor: '#F3DBCE', */
        borderRadius: 13
    },
     textContainer: {
            flexDirection: 'row',
            flexWrap: 'wrap',
        },
});

// const mapStateToProps = state => ({     categories:
// state.Categories.categories,     audiobooks: state.Audiobooks.audiobooks, })

export default StoryCard;
