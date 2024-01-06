import React, { useState, useEffect } from 'react';
import UserProfilePage from '../containers/pages/UserProfilePage';

const UserProfileContainer = () => {
    const [user, setUser] = useState(null);

    useEffect(() => {
        // Aquí normalmente obtendrías los datos del usuario desde una API
        const fetchedUser = {
            name: 'John Doe',
            email: 'john@example.com',
            imageUrl: 'https://example.com/john.jpg'
        };
        setUser(fetchedUser);
    }, []);

    return user ? <UserProfilePage user={user} /> : <Text>Loading...</Text>;
};

export default UserProfileContainer;
