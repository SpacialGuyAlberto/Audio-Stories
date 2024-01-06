import React from 'react';
import { View, Text, Image } from 'react-native';

const UserInfo = ({ name, email }) => (
    <View>
        <Text>Name: {name}</Text>
        <Text>Email: {email}</Text>
        <Image 
            source={{ uri: imageUrl }}
            style={{ width: 100, height: 100 }}
        />
    </View>
    
);

export default UserInfo;
