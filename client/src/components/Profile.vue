<template>
  <div>
    <div class="columns">
      <div class="column"></div>
      <div class="column is-three-quarters">
        <div id="headProfile">
            <div>
                <figure class="image is-96x96">
                    <img class="is-rounded" src="https://bulma.io/images/placeholders/128x128.png" />
                </figure>
            </div>
            <div id="headProfileContent">
                <h1>Name : {{myProfileData.username.toUpperCase()}}</h1>
                <h1>Following : {{myProfileData.following.length}}</h1>
                <h1>Followers : {{myProfileData.followers.length}}</h1>
            </div>
        </div>
        <hr>
        <div id="contentProfile" class="columns">
            <div class="column is-2">
                following :
                <hr>
                <ul >
                    <list-follow @followAction="followAction" v-for="following in myProfileData.following" :key="following._id" :follow="{follow : following, status : 'following'}"></list-follow>
                </ul>
            </div>
            <div class="column is-2">
                followers :
                <hr>
                <ul>
                    <list-follow @followAction="followAction" v-for="followers in myProfileData.followers" :key="followers._id" :follow="{follow: followers, status : 'followers'}"></list-follow>
                </ul>
            </div>
            <div class="column">
                My Post(s) :
                <list-articles @likesAction="likesAction" @deleteArticle="deleteArticle" @goDetails="goDetails" id="listMyPosts" :dataArticles="myPosts"></list-articles>
            </div>
        </div>
      </div>
      <div class="column"></div>
    </div>
  </div>
</template>

<script>


import axios from '../api/axios'
import ListArticles from './ListArticles.vue';
import ListFollow from './FollowList.vue'

export default {
    components: {
        ListArticles,
        ListFollow
    },
    data(){
        return {
            myPosts : [],
            myProfileData : ''
        }
    },
    methods : {
        getUserData(){
            let id = localStorage.getItem('userId')
            axios({
                url : `/articles/${id}`,
            })
                .then(({data}) => {
                    console.log('data: ', data);
                    this.myPosts = data
                })
                .catch(err => {
                    console.log('err: ', err);
                })
        },
        myProfile(){
            let id = localStorage.getItem('userId')
            axios({
                url : `/users/myProfile/${id}`
            })
                .then(({data}) => {
                    console.log('data: ', data);
                    this.myProfileData = data
                })
                .catch(err => {
                    console.log('err: ', err);
                })
        },
        goDetails(value){
            this.$emit('goDetails', value)
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
                    // this.myPosts = []
                    this.getUserData()

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
                this.myPosts = []
                this.getUserData()
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
                this.myPosts = []
                this.getUserData()
              })
              .catch(err => {
                console.log('err: ', err);
              })
          }
        },
        followAction(value){
            if(value[1] === 'follow'){
                axios({
                    url : `/users/follow/${value[0]}`,
                    method : 'PATCH',
                    headers : {
                        access_token: localStorage.getItem('access_token')
                    }
                })
                    .then(({data}) => {
                        console.log('data: ', data);
                        this.myProfileData = ''
                        this.myProfile()
                    })
                    .catch(err => {
                        console.log('err: ', err);
                    })
            } else {
                axios({
                    url : `/users/unfollow/${value[0]}`,
                    method : 'PATCH',
                    headers : {
                        access_token: localStorage.getItem('access_token')
                    }
                })
                    .then(({data}) => {
                        console.log('data: ', data);
                        this.myProfileData = ''
                        this.myProfile()
                    })
                    .catch(err => {
                        console.log('err: ', err);
                    })
            }
        }
    },
    created : function(){
        this.getUserData()
        this.myProfile()

    }
};
</script>

<style scoped>
#headProfile {
  display: flex;
  /* border: 1px green solid; */
  padding: 15px;
}
#contentProfile .column{
    margin-top: 15px;
    border-right: 1px grey dotted;
}
#contentProfile .column:last-child{
    border: none
}
#listMyPosts{
    /* border: 1px black solid; */
    padding: 0;
}
.column .is-2 button{
    float: right;
    margin: 0;
}
#headProfileContent{
    margin : 10px;
    margin-left: 30px;
    width : 100%;
}
#headProfileContent h1{
    min-width: 100;
    padding: 2px;
    /* border-bottom : 1px black dotted; */
}

</style>
