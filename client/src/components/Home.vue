<template>
  <div>
    <nav id="navbar" class="navbar" role="navigation" aria-label="main navigation">
      <div class="navbar-brand">
        <a @click.prevent="changePage('home')" class="navbar-item" href>
          <img
            src="https://www.raghwendra.com/blog/wp-content/uploads/2015/11/dWordpress.png"
            alt="W"
            width="30"
            height="50"
          />
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
              <a id="searchBar" @click="searchSubmit">
                <form @submit.prevent="searchSubmit">
                  <b-field>
                    <i class="fas fa-search"></i>
                    <b-input
                      v-model="searchInput"
                      id="searchInput"
                      type="text"
                      placeholder="Search..."
                    ></b-input>
                  </b-field>
                </form>
              </a>
              <a @click.prevent="changePage('profile')" href>
                <figure class="image is-32x32">
                  <img class="is-rounded" src="https://bulma.io/images/placeholders/128x128.png" />
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
    <list-articles
      @editArticle="editArticle"
      :fromHome="true"
      @likesAction="likesAction"
      @deleteArticle="deleteArticle"
      @goDetails="goDetails"
      v-if="currentPage === 'home'"
      :dataArticles="dataArticles"
    ></list-articles>
    <create-article v-if="currentPage === 'newArticle'" @changePage="changePage"></create-article>
    <profile @goDetails="goDetails" v-if="currentPage === 'profile'"></profile>
    <details-vue :details="currDetails" v-if="currentPage === 'details'"></details-vue>
    <search-page
      @deleteArticle="deleteArticle"
      @likesAction="likesAction"
      @goDetails="goDetails"
      v-if="currentPage === 'search'"
      :search="searchInput"
    ></search-page>
    <edit-page @changePage="changePage" :dataArticle="currEdit" v-if="currentPage === 'editArticle'"></edit-page>
    <g-signin-button
          :params="googleSignInParams"
          @success="onSignInSuccess"
          @error="onSignInError"
          style="display:none"
        ><i class="fab fa-google"></i> Sign in</g-signin-button>
  </div>
</template>

<script>
import ListArticles from "./ListArticles.vue";
import CreateArticle from "./CreateArticle.vue";
import Profile from "./Profile.vue";
import DetailsVue from "./Details.vue";
import SearchPage from "./SearchPage.vue";
import EditPage from "./EditArticle.vue";
import axios from "../api/axios";

export default {
  components: {
    ListArticles,
    CreateArticle,
    Profile,
    DetailsVue,
    SearchPage,
    EditPage
  },
  props: ["isLogin"],
  data() {
    return {
      dataArticles: [],
      currentPage: "home",
      currDetails: "",
      searchInput: "",
      currEdit: "",
      googleSignInParams: {
        client_id: '987680761320-rtt80qrlbdevi4a6pb5a163rhrlqoghc.apps.googleusercontent.com'
      }
    };
  },
  methods: {
    onSignInSuccess (googleUser) {
      // `googleUser` is the GoogleUser object that represents the just-signed-in user.
      // See https://developers.google.com/identity/sign-in/web/reference#users
      const profile = googleUser.getBasicProfile() // etc etc
      var id_token = googleUser.getAuthResponse().id_token;
      axios({
          url : '/users/loginGoogle',
          method: 'POST',
          headers : {
              access_token : id_token
          }
      })
        .then(({data}) => {
            console.log('data: ', data);
            localStorage.setItem("access_token", data.access_token);
            localStorage.setItem("userId", data.userId);
            this.success(`sucess login !`);
            this.$emit("isLogin", true);
        })
        .catch(err => {
            console.log('err: ', err);

        })

    },
    onSignInError (error) {
      // `error` contains any error occurred.
      console.log('OH NOES', error)
    },
    signOut() {
      // localStorage.clear()
      var auth2 = gapi.auth2.getAuthInstance();
      auth2.signOut().then(() => {
        console.log("User signed out.");
        localStorage.clear();
        this.danger('thank you !')
        this.$emit("isLogin", false);
      });
    },
    goDetails(value) {
      this.currDetails = value;
      this.currentPage = "details";
    },
    getAllArticles() {
      axios({
        url: "/articles",
        headers: {
          access_token: localStorage.getItem("access_token")
        }
      })
        .then(({ data }) => {
          this.dataArticles = [];
          this.dataArticles = data;
          console.log("this.dataArticles: ", this.dataArticles);
        })
        .catch(err => {
          console.log("err: ", err);
        });
    },
    changePage(page) {
      if (page === "home") {
        this.dataArticles = [];
        this.getAllArticles();
      }
      this.currentPage = page;
    },
    deleteArticle(value) {
      axios({
        url: `/articles/${value}`,
        method: "DELETE",
        headers: {
          access_token: localStorage.getItem("access_token")
        }
      })
        .then(({ data }) => {
          console.log("data: ", data);
          this.success('article successfully deleted !');
          // this.dataArticles = []
          this.getAllArticles();
        })
        .catch(err => {
          this.danger('fail to delete article !');
          console.log("err: ", err);
        });
    },
    success(msg) {
      this.$toast.open({
        message: msg,
        type: "is-success"
      });
    },
    danger(msg) {
      this.$toast.open({
        duration: 5000,
        message: msg,
        position: "is-bottom",
        type: "is-danger"
      });
    },
    likesAction(value) {
      if (value[0]) {
        axios({
          url: `/articles/like/${value[1]}`,
          method: "PATCH",
          headers: {
            access_token: localStorage.getItem("access_token")
          }
        })
          .then(({ data }) => {
            console.log("data: ", data);
            this.success('thank you for the likes !')
            this.dataArticles = [];
            this.getAllArticles();
          })
          .catch(err => {
            this.danger('fail to give a like !')
            console.log("err: ", err);
          });
      } else {
        axios({
          url: `/articles/unlike/${value[1]}`,
          method: "PATCH",
          headers: {
            access_token: localStorage.getItem("access_token")
          }
        })
          .then(({ data }) => {
            console.log("data: ", data);
            this.dataArticles = [];
            this.danger('hope you like my article later :") ...')
            this.getAllArticles();
          })
          .catch(err => {
            this.danger('fail to unlike !')
            console.log("err: ", err);
          });
      }
    },
    searchSubmit() {
      // this.currentPage = 'home'
      console.log(this.searchInput);
      this.currentPage = "search";
    },
    editArticle(value) {
      this.currEdit = value;
      this.currentPage = "editArticle";
    }
  },
  created: function() {
    this.dataArticles = [];
    this.getAllArticles();
  },
  watch: {
    searchInput: function(value) {
      this.searchSubmit();
    }
  }
};
</script>

<style>
#navbar {
  background-color: rgba(151, 168, 173, 0.6);
}

.navbar-brand .navbar-item {
  font-size: 30px;
  font-family: "Delius Unicase", cursive;
}
.navbar-item figure {
  margin-right: 10px;
  margin-top: -8px;
  border: black 2px solid;
  border-radius: 50%;
}
#searchBar {
  margin-right: 40px;
  font-size: 24px;
  float: left;
}
#searchBar i {
  margin-right: 5px;
  color: black;
  margin-top: -2px;
}
#searchInput {
  padding: 15px;
  margin-top: -8px;
  border-radius: 30px;
}
</style>
