<template>
  <div id="editorPage">
    <form>
      <b-field label="Title : ">
        <b-input v-model="form.title" type="title" placeholder="Input Title..."></b-input>
      </b-field>
      <b-field class="file" label="image Thumbnail : ">
        <b-upload v-model="form.img">
            <a class="button is-warning">
                <b-icon icon="upload"></b-icon>
                <span>Click to upload</span>
            </a>
        </b-upload>
        <span class="file-name" v-if="form.img">
            {{ form.img.name }}
        </span>
    </b-field>
      <b-field label="Content : ">
        <wysiwyg v-model="form.text" id="editor"></wysiwyg>
      </b-field>
      <b-field label="Tags : ">
        
        
        <b-input v-model="form.tags" type="tags" placeholder="Input Tags...(use comma ',' to sparate tags)"></b-input>
        <!-- <div class="field"> -->
        <!-- </div> -->
      </b-field>
        <small>(use comma (,) to seperate multiple tags)</small>
      <b-field id="tagInput">
            <b-tag
            class="tags"
            v-for="(tag, i) in form.tags"
            :key="i"
            type="is-primary"            
            >{{tag}}</b-tag>
      </b-field>
        <br>
      <input @click.prevent="createNewArticle" type="submit" class="button is-link" value="SUBMIT"/>
      <!-- <p v-html="form.text"></p> -->
    </form>
  </div>
</template>

<script>

import axios from '../api/axios'

export default {
  data() {
    return {
      form: {
        title: "",
        img: "",
        text: "",
        date: "",
        tags: ""
      }
    };
  },
  methods: {
    createNewArticle() {
      this.form.date = new Date()
      console.log(this.form);
      let formData = new FormData()
      let formKeys = Object.keys(this.form)
      formKeys.forEach(el => {
        formData.append(el, this.form[el])
      })
        console.log('formData: ', formData);
      axios({
        url : '/articles/add',
        method : 'POST',
        data: formData,
        headers : {
          access_token : localStorage.getItem('access_token')
        }
      })
        .then(({data}) => {
          console.log('data: ', data);
          this.$emit('changePage', 'home')

        })
        .catch(err => {
          console.log('err: ', err);
        })

    }
  },
  watch : {
      'form.tags'(value){
          if(value){
            this.form.tags = this.form.tags.split(',')
          } else {
            this.form.tags = []
          }

      },
  }
};
</script>

<style scoped>
#editorPage {
  display: flex;
  justify-content: center;
  border: 1px red solid;
  align-items: center;
  flex-direction: column;
  margin-top: 10px;
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
