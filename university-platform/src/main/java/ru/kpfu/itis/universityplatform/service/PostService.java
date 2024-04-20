package ru.kpfu.itis.universityplatform.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import ru.kpfu.itis.universityplatform.entity.Post;
import ru.kpfu.itis.universityplatform.repository.PostRepository;

import java.util.List;
import java.util.Optional;

@Service
public class PostService {

    @Autowired
    private PostRepository postRepository;

    public List<Post> findAllPosts() {
        return postRepository.findAll();
    }

    public Optional<Post> findPostById(Long id) {
        return postRepository.findById(id);
    }

    public Post savePost(Post post) {
        return postRepository.save(post);
    }

    public Optional<Post> updatePost(Long id, Post postDetails) {
        return postRepository.findById(id)
                .map(post -> {
                    post.setContent(postDetails.getContent());
                    return postRepository.save(post);
                });
    }

    public void deletePost(Long id) {
        postRepository.deleteById(id);
    }
}
