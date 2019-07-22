<template>
  <div>
    <div class="columns">
      <div class="column">
      </div>
      <div class="column">
        <h1>MINI WP</h1>
        <p>A professional writer is an amateur who didn’t quit.” </p>
        <p id="quotesAuth"> — Richard Bach — </p>
        
        <card id="LoginFormTemplate" :formStatus="formStatus" @isLogin="updateLogin" :isLogin="isLogin"></card>
        <a v-if="formStatus === 'Login'" class="switchForm" @click.prevent="changeForm('Register')" href="">didn't have an account ?</a>
        <a v-if="formStatus === 'Register'" class="switchForm" @click.prevent="changeForm('Login')" href="">already have an account ?</a>
      </div>
      <div class="column">
        
      </div>
    </div>
    
  </div>
</template>

<script>

import Card from './Card.vue';



export default {
  props: ['isLogin'],
  components: {
    Card
  },
  data() {
    return {
      formStatus : 'Login'
    };
  },
  watch: {
    content: function(value) {
      console.log(value);
    }
  },
  methods: {
    changeForm(form){
      this.formStatus = form
    },
    updateLogin(event){
      console.log('event: ', event);
      this.$emit('isLogin', event)
    }
  }
};
</script>

<style scoped>
.columns{
  min-height: 100vh;
  /* border: red 1px solid; */
}
.columns a {
  background-color: rgba(255, 255, 255, 0.5);
  width: 80%;
  text-align: center;
  color: crimson;
}
.column {
  /* border: 1px black solid; */
  min-height: 100%;
  display: flex;
  flex-direction: column;
  flex-wrap: wrap;
  align-content: center;
  align-items: center;
  justify-content: center;
}
.column h1 {
  text-align: center;
  font-size: 34px;
  font-family: 'Delius Unicase', cursive;
}
.column p {
  background-color: rgba(255, 255, 255, 0.7);
  text-align: center;
  font-size: 14px;
  font-family: 'Merienda One', cursive;
}
#quotesAuth {
  font-size: 10px;
  margin-bottom: 15px
}
#LoginFormTemplate{
  background-color: rgba(255, 255, 255, 1);
  max-width: 80%;
  background-image: url("https://media.giphy.com/media/fnpxlTvPhdLfIu9ZIa/giphy.gif");
}
.switchForm{
  margin-top:15px;
}

</style>
