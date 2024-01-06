import React from 'react';
import { View } from 'react-native';
import ProfileHeader from '../../components/ProfileHeader';
import UserInfo from '../../components/UserInfo';


const UserProfilePage = ({ user }) => (
    <View>
        <ProfileHeader />
        {/* <ProfilePicture imageUrl={user.imageUrl} /> */}
        <UserInfo name={user.name} email={user.email} />
    </View>
);

export default UserProfilePage;
