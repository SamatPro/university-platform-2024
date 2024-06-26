import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useGetProfileByUsernameQuery, useUpdateProfileMutation, useUploadAvatarMutation } from '../services/apiService';
import Header from './Header';
import Footer from './Footer';
import styles from './EditProfilePage.module.css';

const EditProfilePage: React.FC = () => {
    const { username } = useParams<{ username: string }>();
    const navigate = useNavigate();
    const { data: profile, error, isLoading } = useGetProfileByUsernameQuery(username ?? '');
    const [updateProfile, { isLoading: isUpdating }] = useUpdateProfileMutation();
    const [uploadAvatar, { isLoading: isUploading }] = useUploadAvatarMutation();

    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        university: '',
        graduationYear: '',
        bio: '',
        skills: '',
        workplaces: '',
        interests: '',
        favoriteSubjects: '',
        avatar: null as File | null,
    });

    useEffect(() => {
        if (profile) {
            setFormData({
                firstName: profile.firstName,
                lastName: profile.lastName,
                university: profile.university || '',
                graduationYear: profile.graduationYear?.toString() || '',
                bio: profile.bio || '',
                skills: profile.skills.join(', '),
                workplaces: profile.workplaces.join(', '),
                interests: profile.interests.join(', '),
                favoriteSubjects: profile.favoriteSubjects.join(', '),
                avatar: null,
            });
        }
    }, [profile]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;

        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { files } = e.target;
        if (files && files.length > 0) {
            setFormData((prev) => ({
                ...prev,
                avatar: files[0],
            }));
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (profile) {
            const updatedProfile = {
                ...profile,
                firstName: formData.firstName,
                lastName: formData.lastName,
                university: formData.university,
                graduationYear: parseInt(formData.graduationYear, 10),
                bio: formData.bio,
                skills: formData.skills.split(',').map(skill => skill.trim()),
                workplaces: formData.workplaces.split(',').map(workplace => workplace.trim()),
                interests: formData.interests.split(',').map(interest => interest.trim()),
                favoriteSubjects: formData.favoriteSubjects.split(',').map(subject => subject.trim()),
            };

            try {
                console.log('Updated Profile:', updatedProfile);
                await updateProfile({ id: profile.id, profile: updatedProfile }).unwrap();
                if (formData.avatar) {
                    const formDataAvatar = new FormData();
                    formDataAvatar.append('file', formData.avatar);
                    await uploadAvatar({ username: username!, file: formDataAvatar }).unwrap();
                }
                navigate(`/profile/${username}`);
            } catch (error) {
                console.error("Failed to update profile:", error);
            }
        }
    };

    if (isLoading) return <div>Loading...</div>;
    if (error) return <div>Error loading profile: {error.toString()}</div>;

    return (
        <div className={styles.editProfilePage}>
            <Header />
            <main className={styles.mainContent}>
                <h1>Редактирование профиля</h1>
                <form onSubmit={handleSubmit} className={styles.form}>
                    <div className={styles.formGroup}>
                        <label>Имя:</label>
                        <input
                            type="text"
                            name="firstName"
                            value={formData.firstName}
                            onChange={handleChange}
                            className={styles.input}
                        />
                    </div>
                    <div className={styles.formGroup}>
                        <label>Фамилия:</label>
                        <input
                            type="text"
                            name="lastName"
                            value={formData.lastName}
                            onChange={handleChange}
                            className={styles.input}
                        />
                    </div>
                    <div className={styles.formGroup}>
                        <label>Университет:</label>
                        <input
                            type="text"
                            name="university"
                            value={formData.university}
                            onChange={handleChange}
                            className={styles.input}
                        />
                    </div>
                    <div className={styles.formGroup}>
                        <label>Год выпуска:</label>
                        <input
                            type="text"
                            name="graduationYear"
                            value={formData.graduationYear}
                            onChange={handleChange}
                            className={styles.input}
                        />
                    </div>
                    <div className={styles.formGroup}>
                        <label>О себе:</label>
                        <textarea
                            name="bio"
                            value={formData.bio}
                            onChange={handleChange}
                            className={styles.textarea}
                        />
                    </div>
                    <div className={styles.formGroup}>
                        <label>Навыки:</label>
                        <input
                            type="text"
                            name="skills"
                            value={formData.skills}
                            onChange={handleChange}
                            className={styles.input}
                        />
                    </div>
                    <div className={styles.formGroup}>
                        <label>Места работы:</label>
                        <input
                            type="text"
                            name="workplaces"
                            value={formData.workplaces}
                            onChange={handleChange}
                            className={styles.input}
                        />
                    </div>
                    <div className={styles.formGroup}>
                        <label>Интересы:</label>
                        <input
                            type="text"
                            name="interests"
                            value={formData.interests}
                            onChange={handleChange}
                            className={styles.input}
                        />
                    </div>
                    <div className={styles.formGroup}>
                        <label>Любимые предметы:</label>
                        <input
                            type="text"
                            name="favoriteSubjects"
                            value={formData.favoriteSubjects}
                            onChange={handleChange}
                            className={styles.input}
                        />
                    </div>
                    <div className={styles.formGroup}>
                        <label>Аватар:</label>
                        <input
                            type="file"
                            name="avatar"
                            onChange={handleFileChange}
                            className={styles.input}
                        />
                    </div>
                    <button type="submit" disabled={isUpdating || isUploading} className={styles.button}>
                        Сохранить
                    </button>
                </form>
            </main>
            <Footer />
        </div>
    );
}

export default EditProfilePage;
