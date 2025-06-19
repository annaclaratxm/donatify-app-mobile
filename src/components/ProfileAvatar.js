import React from 'react';
import { TouchableOpacity } from 'react-native';
import { Avatar } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';
import { useUser } from '../context/UserContext'; 

const ProfileAvatar = () => {
    const { user } = useUser(); 
    const navigation = useNavigation();

    const userInitial = user?.nickname?.charAt(0).toUpperCase() || '?';

    return (
        <TouchableOpacity onPress={() => navigation.navigate('Perfil')}>
            <Avatar.Text size={32} label={userInitial} style={{ backgroundColor: '#3D8B6D' }} />
        </TouchableOpacity>
    );
};

export default ProfileAvatar;