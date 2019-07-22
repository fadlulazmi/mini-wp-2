<template>
  <div>
    <nav id="navbar" class="navbar" role="navigation" aria-label="main navigation">
      <div class="navbar-brand">
        <a @click.prevent="changePage('home')" class="navbar-item" href="">
            <img src="https://www.raghwendra.com/blog/wp-content/uploads/2015/11/dWordpress.png" alt="W" width="30" height="50">
          MINI WP
        </a>

        <a
          role="button"
          class="navbar-burger burger"
          aria-label="menu"
          aria-expanded="false"
          data-target="navbarBasicExample"
        >
          <span aria-hidden="true"></span>
          <span aria-hidden="true"></span>
          <span aria-hidden="true"></span>
        </a>
      </div>

      <div id="navbarBasicExample" class="navbar-menu">
         <!-- search bar -->

        <div class="navbar-end">
          <div class="navbar-item">
            <div class="buttons">
              <a @click.prevent="changePage('profile')" href="">
                <figure class="image is-32x32">
                    <img class="is-rounded" src="https://bulma.io/images/placeholders/128x128.png">
                </figure>
              </a>
              <a @click="changePage('newArticle')" class="button is-light">
                <strong>+ Article</strong>
              </a>
              <a @click="signOut" class="button is-warning">Log Out</a>
            </div>
          </div>
        </div>
      </div>
    </nav>
    <list-articles @likesAction="likesAction" @deleteArticle="deleteArticle" @goDetails="goDetails" v-if="currentPage === 'home'" :dataArticles="dataArticles"></list-articles>
    <create-article v-if="currentPage === 'newArticle'" @changePage="changePage"></create-article>
    <profile @goDetails="goDetails" v-if="currentPage === 'profile'"></profile>
    <details-vue :details="currDetails" v-if="currentPage === 'details'"></details-vue>

  </div>
</template>

<script>

import ListArticles from './ListArticles.vue'
import CreateArticle from './CreateArticle.vue'
import Profile from './Profile.vue'
import DetailsVue from './Details.vue';
import axios from '../api/axios'

export default {
    components : {
        ListArticles,
        CreateArticle,
        Profile,
        DetailsVue
    },
    props : ['isLogin'],
    data(){
      return {
        dataArticles : [],
        currentPage : 'home',
        currDetails : ''
      }
    },
    methods : {
        signOut() {
            localStorage.clear()
            this.$emit('isLogin', false)
            // var auth2 = gapi.auth2.getAuthInstance();
            // auth2.signOut()
            // .then(() => {
            //     console.log('User signed out.');
            //     localStorage.clear()
            // });
        },
        goDetails(value){
          this.currDetails = value
          this.currentPage = 'details'
        },
        getAllArticles(){
          axios({
            url : '/articles',
            headers : {
              access_token : localStorage.getItem('access_token')
            }
          })
          .then(({data}) => {
            this.dataArticles = []
            this.dataArticles = data            
            console.log('this.dataArticles: ', this.dataArticles);
          })
          .catch(err => {
            console.log('err: ', err);  
          })
        },
        changePage(page){
          if(page === 'home'){
            this.getAllArticles()
          }
          this.currentPage = page
        },
        deleteArticle(value){
          axios({
            url: `/articles/${value}`,
                method : 'DELETE',
                headers : {
                  access_token : localStorage.getItem('access_token')
                }
            })
                .then(({data}) => {
                    console.log('data: ', data);
                    this.success()
                    // this.dataArticles = []
                    this.getAllArticles()
                })
                .catch(err => {
                    console.log('err: ', err);
                })
        },
        success() {
            this.$toast.open({
                message: 'deleted !',
                type: 'is-warning'
            })
        },
        likesAction(value){
          if(value[0]){
            axios({
              url: `/articles/like/${value[1]}`,
              method: 'PATCH',
              headers : {
                access_token : localStorage.getItem('access_token')
              }
            })
              .then(({data}) => {
                console.log('data: ', data);
                this.dataArticles = []
                this.getAllArticles()
              })
              .catch(err => {
                console.log('err: ', err);
              })
          } else {
            axios({
              url: `/articles/unlike/${value[1]}`,
              method: 'PATCH',
              headers : {
                access_token : localStorage.getItem('access_token')
              }
            })
              .then(({data}) => {
                console.log('data: ', data);
                this.dataArticles = []
                this.getAllArticles()
              })
              .catch(err => {
                console.log('err: ', err);
              })
          }
        }
    },
    created: function(){
      this.dataArticles = []
      this.getAllArticles()
    }

};
</script>

<style>

#navbar {
    background-color: rgba(151, 168, 173, 0.6);
}

.navbar-brand .navbar-item {
    font-size: 30px;
    font-family: 'Delius Unicase', cursive;
}
.navbar-item figure {
    margin-right: 10px;
    margin-top: -8px;
    border: black 2px solid;
    border-radius: 50%;
}

</style>
