<template>
  <div>
    <div class="columns">
      <div class="column is-1"></div>
      <div id="contentDetail" class="column">
        <br />
        <div class="img">
          <img :src="details.img" alt="image" />
        </div>
        <br />
        <h1 class="is-size-1">
          {{details.title}}
          <small class="is-size-6">by: {{details.userId.username}}</small>
        </h1>
        <div>
            <a>
            <span class="icon is-small">
                <i class="fas fa-heart">  </i>
                <p>{{details.likes.length}}</p>
            </span>
            </a>
        </div>
        <small class="date">created at : {{new Date(details.date).toDateString()}}</small>
        <hr />
        <p v-html="details.text" class="is-size-5"></p>
        <hr />
        <div class="field">
          <h1 class="is-size-6">Tags :</h1>
          <b-tag
            class="tagArticle"
            v-for=" (tag, i) in details.tags"
            :key="i"
            type="is-primary"
          >{{tag}}</b-tag>
        </div>
        <br />
      </div>
      <div class="column is-1"></div>
    </div>
  </div>
</template>

<script>
export default {
  props: ["details"],
  created: function() {
    console.log(this.details);
  }
};
</script>

<style scoped>
#contentDetail {
  margin-top: 20px;
  padding: 30px;
  padding-top: 0;
  background-color: white;
  border: grey dotted 3px;
  margin-bottom: 20px;
}
#contentDetail .img {
  display: flex;
  justify-content: center;
  border-bottom: 1px grey solid;
  padding-bottom: 10px;
}

#contentDetail .date {
  float: right;
  color: brown;
}
#contentDetail .icon i{
    color : red;
    margin: 10px;
    margin-left: 10px;

}
</style>
