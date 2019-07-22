<template>
    <div class="columns">
        <div class="column is-1"></div>
        <div id="contentSearch" class="column">
            <h1><u>SEARCH RESULT</u></h1>
            <div class="columns">
                <div class="column is-3">
                    <h1 class="is-size-4">All Users :</h1>
                    <hr>
                    <!-- {{users}} -->
                    <ul id="userList">
                        <li v-for="user in filteredUser" :key="user._id">
                            {{user.username}} 
                            <button @click="unfollow(user._id)" v-if="user.followedStatus" class="button is-small is-danger">
                                unfollow
                            </button>
                            <button v-else @click="follow(user._id)" class="button is-small is-success">
                                follow
                            </button>
                        </li>
                    </ul>
                </div>
                <div class="column is-9">
                    <h1 class="is-size-4">All Articles :</h1>
                    <hr>
                    
                    <list-articles @goDetails="goDetails" @likesAction="likesAction" @deleteArticle="deleteArticle" :dataArticles="filteredArticle"></list-articles>
                </div>
            </div>
        </div>
        <div class="column is-1"></div>
    </div>
</template>

<script>

import axios from '../api/axios'
import ListArticles from './ListArticles.vue'
import followlist from './FollowList.vue'

export default {
    components: {
        ListArticles,
        followlist
    },
    props: ['search'],
    data(){
        return{
            articles: [],
            users : [],
        }
    },
    methods : {
        searchTag(){
            console.log('this.search: ', this.search);
            axios({
                url : `/articles/search`
            })
                .then(({data}) => {
                    
                    this.articles = data
                })
                .catch(err => {
                    console.log('err: ', err);
                })
        },
        allDataUser(){
            axios({
                url : `/users`,
                headers: {
                    access_token : localStorage.getItem('access_token')
                }
            })
                .then(({data}) => {
                    
                    this.users = data

                })
                .catch(err => {
                    console.log('err: ', err);
                })
        },
        follow(id){
            axios({
                url : `/users/follow/${id}`,
                method : 'PATCH',
                headers : {
                    access_token: localStorage.getItem('access_token')
                }
            })
                .then(({data}) => {
                    console.log('data: ', data);
                    this.users = []
                    this.allDataUser()
                })
                .catch(err => {
                    console.log('err: ', err);
                })
        },
        unfollow(id){
            axios({
                url : `/users/unfollow/${id}`,
                method : 'PATCH',
                headers : {
                    access_token: localStorage.getItem('access_token')
                }
            })
                .then(({data}) => {
                    console.log('data: ', data);
                    this.users = []
                    this.allDataUser()
                })
                .catch(err => {
                    console.log('err: ', err);
                })
        },
        goDetails(value){
            this.$emit('goDetails', value)
        },
        deleteArticle(value){
            this.$emit('deleteArticle', value)
        },
        likesAction(value){
            this.$emit('likesAction', value)
        }
    },
    created(){
        this.allDataUser()
        this.searchTag()
    },
    computed : {
        filteredUser(){
            console.log('trigger watch');
            this.users.forEach(el => {
                el.followers.forEach(ell => {
                    if(ell._id == localStorage.getItem('userId')){
                        el.followedStatus = true
                    }
                })
            });
            let filter = this.users.filter(user => {
                console.log(user, '=======')
                return user.username.toLowerCase().includes(this.search.toLowerCase())
            })
            if(filter.length === 0 && this.search === ''){
                console.log('masuk this.users')
                return this.users

            } else {
                console.log('masuk filter')
                return filter
            }
        },
        filteredArticle(){
            let filter = []
            // search articles tags that contain search
            for(let i = 0; i < this.articles.length; i++){
                let flag = false
                for(let j = 0; j < this.articles[i].tags.length; j++){
                    let array = this.articles[i].tags[j]
                    if(array.includes(this.search)) flag = true
                }

                if(flag){
                    filter.push(this.articles[i])
                }
            }
            // this.articles = []
            console.log('filter: ', filter);
            if(filter.length !== 0 && this.search === ''){
                return this.articles
            } else if(filter.length === 0){
                console.log('masuk this.articles')
                return this.articles
            } else {
                console.log('masuk filter')
                return filter
            }
        }
    }
}
</script>

<style scoped>
.columns {
    margin-top: 10px;
}
#contentSearch{
    background-color: rgba(255, 255, 255, 0.8);
    border-radius: 50px;
    padding: 20px;
}
#contentSearch .column{
    border-left: 1px dotted grey;
    border-right: 1px dotted grey;
    margin: 0;
    list-style-type: none;
}
#userList li {
    padding : 10px;
    border-bottom: 1px grey solid;
}
#userList li button {
    float: right;
}

</style>
