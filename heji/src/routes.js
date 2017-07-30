import Category from './components/Category/Category.vue'
import Post from './components/Post/Post.vue'
import NewPost from './components/Post/NewPost.vue'
import pic from './components/Pic/Pic.vue'
export const routes = [
    {
        path: '/category', component: Category, name: 'category',
        children: [
            
        ]
    },
    {
        path: '/post', component: Post, name: 'post'
    },
    {
        path: '/post/add', component: NewPost, name: 'addPost'
    },
    {
        path: '/post/:categoryId', component: Post, name: 'post'
    },
    
    {
        path: '/post/edit/:id', component: NewPost, name: 'editPost'
    },
    {
        path: '/pic', component: pic, name: 'pic'
    }
];
