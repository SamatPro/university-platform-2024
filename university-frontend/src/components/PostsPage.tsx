// PostsPage.tsx
import React, { useState } from 'react';
import { useGetPostsQuery, useCreatePostMutation } from '../services/apiService';
import Header from './Header';
import Footer from './Footer';
import styles from './PostsPage.module.css';

const PostsPage: React.FC = () => {
    const { data: posts, error, isLoading } = useGetPostsQuery();
    const [createPost, { isLoading: isCreating }] = useCreatePostMutation();
    const [newPostContent, setNewPostContent] = useState('');
    const [showCreatePostForm, setShowCreatePostForm] = useState(false);

    const handleCreatePost = async () => {
        await createPost({ content: newPostContent });
        setNewPostContent('');
        setShowCreatePostForm(false);
    };

    return (
        <div className={styles.container}>
            <Header />
            <main className={styles.mainContent}>
                <h1>Публикации</h1>
                <button
                    className={styles.createPostButton}
                    onClick={() => setShowCreatePostForm(!showCreatePostForm)}
                >
                    {showCreatePostForm ? 'Отменить' : 'Создать публикацию'}
                </button>
                {showCreatePostForm && (
                    <div className={styles.createPostForm}>
                        <textarea
                            value={newPostContent}
                            onChange={(e) => setNewPostContent(e.target.value)}
                            placeholder="Введите текст публикации"
                        />
                        <button onClick={handleCreatePost} disabled={isCreating}>
                            {isCreating ? 'Публикация...' : 'Опубликовать'}
                        </button>
                    </div>
                )}
                {isLoading ? (
                    <div>Загрузка...</div>
                ) : error ? (
                    <div>Ошибка при загрузке публикаций: {error.toString()}</div>
                ) : (
                    <div className={styles.postsList}>
                        {posts && posts.length > 0 ? (
                            posts.map((post) => (
                                <div key={post.id} className={styles.post}>
                                    <h3>{post.author.username}</h3>
                                    <p>{post.content}</p>
                                    <span>{new Date(post.createdAt).toLocaleString()}</span>
                                </div>
                            ))
                        ) : (
                            <div>Нет публикаций</div>
                        )}
                    </div>
                )}
            </main>
            <Footer />
        </div>
    );
};

export default PostsPage;
