<template>
  <article class="media">
    <figure class="media-left">
      <p class="image is-96x96">
        <img :src="article.img" />
      </p>
    </figure>
    <div class="media-content">
      <div class="content">
        <p>
          <strong><a>{{article.title}}</a></strong><br>
          <small>@{{article.userId.username}}</small>
          <small id="articleDate">({{new Date(article.date).toDateString()}})</small>
          
        </p>
        <div class="field">
            <b-tag class="tagArticle" v-for=" (tag, i) in article.tags" :key="i" type="is-primary">
                {{tag}}
            </b-tag>
        </div>
      </div>
      <nav class="level is-mobile">
        <div class="level-left">           
          <a @click="unlike" v-if="likeStatus" class="level-item" style="color:red">
            <span class="icon is-small">
              <i class="fas fa-heart" ></i>
            </span>
          </a>
          <a @click="like" v-if="!likeStatus" class="level-item" style="color:grey">
            <span class="icon is-small">
              <i class="fas fa-heart" ></i>
            </span>
          </a>
          <p>{{article.likes.length}}</p>
        </div>
          <button @click="changePage" class="button is-small is-warning">details</button>
          <button @click="deleteArticle" v-if="article.userId._id === myId" class="button is-small is-danger">delete</button>
      </nav>
    </div>
    
  </article>
</template>

<script>
// new Date().
export default {
    props : ['article'],
    data(){
        return {
          myId : localStorage.getItem('userId'),
          likeStatus : false
        }
    },
    methods : {
      changePage(){
        this.$emit('goDetails', this.article)
      },
      deleteArticle(){
        this.$emit('deleteArticle', this.article._id)
      },
      unlike(){
        console.log('wait unlike');
        this.$emit('likesAction', [false, this.article._id])
      },
      like(){
        console.log('wait like');
        this.$emit('likesAction', [true, this.article._id])
      }
    },
    created(){
      this.article.likes.forEach(el => {
        if(el.toString() === localStorage.getItem('userId').toString()){
          this.likeStatus = true
        }
      });
    }
};
</script>

<style>
.tagArticle{
    margin-right: 5px;
    margin-bottom: 5px
}

#articleDate{
  color: green;
  float: right;
}
.level button {
  margin-top: 0px;
}
.media img {
  max-height: 120px;
  max-width: 120px;
}
</style>
