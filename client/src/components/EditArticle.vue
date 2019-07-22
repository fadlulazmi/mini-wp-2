<template>
  <div id="editorPage">
    <form>
      <b-field label="Title : ">
        <b-input v-model="dataArticle.title" type="title" placeholder="Input Title..."></b-input>
      </b-field>
      <b-field class="file" label="image Thumbnail : ">
        <b-upload v-model="dataArticle.img">
            <a class="button is-warning">
                <b-icon icon="upload"></b-icon>
                <span>Click to upload</span>
            </a>
        </b-upload>
        <span class="file-name" v-if="dataArticle.img">
            {{ dataArticle.img.name || dataArticle.img  }}
        </span>
    </b-field>
      <b-field label="Content : ">
        <wysiwyg v-model="dataArticle.text" id="editor"></wysiwyg>
      </b-field>
      <b-field label="Tags : ">
        
        
        <b-input v-model="dataArticle.tags" type="tags" placeholder="Input Tags...(use comma ',' to sparate tags)"></b-input>
        <!-- <div class="field"> -->
        <!-- </div> -->
      </b-field>
        <small>(use comma (,) to seperate multiple tags)</small>
      <b-field id="tagInput">
            <!-- <b-tag
            class="tags"
            v-for="(tag, i) in dataArticle.tags"
            :key="i"
            type="is-primary"            
            ></b-tag> -->
      </b-field>
        <br>
      <input @click.prevent="updateArticle" type="submit" class="button is-link" value="SUBMIT"/>
      <!-- <p v-html="form.text"></p> -->
    </form>
  </div>
</template>

<script>

import axios from '../api/axios'

export default {
  props : ['dataArticle'],
  data() {
    return {
      
    };
  },
  methods: {
    updateArticle() {
      this.dataArticle.date = new Date(this.dataArticle.date)
      console.log(this.dataArticle);
      let formData = new FormData()
      let formKeys = Object.keys(this.dataArticle)
      formKeys.forEach(el => {
        formData.append(el, this.dataArticle[el])
      })
        console.log('formData: ', formData);
      axios({
        url : `/articles/${this.dataArticle._id}`,
        method : 'PATCH',
        data: formData,
        headers : {
          access_token : localStorage.getItem('access_token')
        }
      })
        .then(({data}) => {
          console.log('data: ', data);
          this.success('article updated !')
          this.$emit('changePage', 'home')

        })
        .catch(err => {
          this.danger('fail to update article !')
          console.log('err: ', err);
        })
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
  },
  created(){
    this.dataArticles.tags = this.dataArticles.tags.join('')
  },
  watch : {
    'dataArticles.tags'(value){
        this.dataArticles.tags = this.dataArticles.tags.join(',')
        if(value){
          this.dataArticles.tags = this.dataArticles.tags.split(',')
        } else {
          this.dataArticles.tags = []
        }
    },
  }
};
</script>

<style scoped>
#editorPage {
  display: flex;
  justify-content: center;
  /* border: 1px red solid; */
  align-items: center;
  flex-direction: column;
  margin-top: 10px;
  padding: 30px;
}
#editor {
  width: 100%;
  background-color: rgba(255, 255, 255, 0.8);
}
.button {
  margin-top: 20px;
  margin-bottom: 20px;
}
#tagInput .tags {
    margin: 1px;
}
.file .button{
  margin-top: 30px;
  display: flex;
  justify-content: left;
  align-content: left;
  flex-direction: row;
}
.file-name{
  margin-top: 30px;
  background-color: rgba(238, 235, 79, 0.5);
}
</style>
