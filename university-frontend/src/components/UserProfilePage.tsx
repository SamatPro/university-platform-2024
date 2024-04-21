import React, {useEffect} from 'react';
import {useNavigate, useParams} from 'react-router-dom';
import {useGetProfileByUsernameQuery, useUpdateProfileMutation} from '../services/apiService';

const UserProfilePage: React.FC = () => {
    const { username } = useParams<{ username: string }>();
    const navigate = useNavigate();

    const [updateProfile, { isLoading }] = useUpdateProfileMutation();

    const handleUpdate = async () => {
        if (profile) {
            const updatedProfile = { ...profile, bio: 'Updated bio...' };
            await updateProfile({ id: profile.id, profile: updatedProfile });
        }
    };
    useEffect(() => {
        const token = localStorage.getItem('token');
        if (!token || !username) {
            navigate('/login');
        } else {

        }
    }, [navigate]);

    const { data: profile, error } = useGetProfileByUsernameQuery(username ?? 'defaultUsername');

    if (error) return <div>Error loading profile: </div>;
    if (!profile) return <div>No profile data available.</div>;

    return (
        <div>
            <h1>{profile.user.username}'s Profile</h1>
            <p>Name: {profile.firstName} {profile.lastName}</p>
            <p>University: {profile.university}</p>
            <p>Graduation Year: {profile.graduationYear}</p>
            <p>Bio: {profile.bio}</p>
            <button onClick={handleUpdate} disabled={isLoading}>Update Bio</button>
        </div>
    );
};

export default UserProfilePage;
