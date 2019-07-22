<template>
  <div class="card">
    <form @submit.prevent="submitForm">
    <div class="card-content">
      <header class="card-header">
          <p class="card-header-title">
              {{formStatus.toUpperCase()}}
          </p>
      </header>
      <div class="content">
            <b-field label="Email">
                <b-input v-model="form.email" type="email" placeholder="Input Email...">
                </b-input>
            </b-field>
            <b-field v-if="formStatus === 'Register'" label="Username">
                <b-input v-model="form.username" maxlength="30" placeholder="Input Username..." ></b-input>
            </b-field>

            <b-field label="Password">
                <b-input v-model="form.password" type="password" placeholder="Input Password..." password-reveal></b-input>
            </b-field>
      </div>
    </div>
    
    <footer class="card-footer">
      <!-- <a v-if="formStatus === 'Login'"  href="" class="card-footer-item" type="submit"><b>Login</b></a>
      <a v-if="formStatus === 'Register'" href="" class="card-footer-item" type="submit"><b>Register</b></a> -->

    <input v-if="formStatus === 'Login'"  href="" class="card-footer-item button" type="submit" value="Login">
    <input v-if="formStatus === 'Register'" href="" class="card-footer-item button" type="submit" value="Register">

      <div class="g-signin2 card-footer-item" @data-onsuccess="onSignIn"></div>
    </footer>
    </form>
  </div>
</template>

<script>

import axios from '../api/axios'

export default {
    props: ['formStatus'],
    data(){
        return {
            form : {
                email: '',
                username: '',
                password: ''
            },
            
        }
    },
    mounted(){
        // gapi.signin2.render('g-signin2', {
        //   'data-onsuccess': this.onSignIn
        // })
    },
    methods: {
        success(msg) {
            this.$toast.open({
                message: msg,
                type: 'is-success'
            })
        },
        danger(msg) {
            this.$toast.open({
                duration: 5000,
                message: msg,
                position: 'is-bottom',
                type: 'is-danger'
            })
        },
        submitForm(){
            console.log('this.formStatus: ', this.formStatus);
            if(this.formStatus === 'Login'){
                
                console.log(this.form.email);
                console.log(this.form.password);
                axios({
                    url : '/users/login',
                    method : 'POST',
                    data : {
                        email : this.form.email,
                        password : this.form.password
                    }
                })
                .then(({data}) => {

                    console.log('login: ', data);
                    localStorage.setItem('access_token', data.access_token) 
                    localStorage.setItem('userId', data.userId) 
                    this.success(`sucess login !`)
                    this.form = {
                            email: '',
                            username: '',
                            password: ''
                        }
                    this.$emit('isLogin', true)
                })
                .catch(err => {
                    console.log('err: ', err);
                    this.danger(err)
                })

            }
            else if(this.formStatus === 'Register'){
                console.log(this.form);

                axios({
                    url : '/users/register',
                    method: 'POST',
                    data: {
                        email : this.form.email,
                        username: this.form.username,
                        password : this.form.password
                    }
                })
                .then(({data}) => {
                    console.log('register: ', data);
                    return axios({
                        url : '/users/login',
                        method : 'POST',
                        data : {
                            email : data.email,
                            password : this.form.password
                        }
                    })

                })
                .then(({data}) => {

                    console.log('login: ', data);
                    localStorage.setItem('access_token', data.access_token) 
                    localStorage.setItem('userId', data.userId) 
                    this.success(`sucess register & login !`)
    
                    this.form = {
                        email: '',
                        username: '',
                        password: ''
                    }
    
                    this.$emit('isLogin', true)
                })
                .catch(err => {

                    console.log('err: ', err);
                    this.danger(err)
                })
            }
        },
        onSignIn(googleUser){
            console.log('masuk component')
            var profile = googleUser.getBasicProfile();
            console.log('ID: ' + profile.getId()); // Do not send to your backend! Use an ID token instead.
            console.log('Name: ' + profile.getName());
            console.log('Image URL: ' + profile.getImageUrl());
            console.log('Email: ' + profile.getEmail()); // This is null if the 'email' scope is not present.
            this.$emit('isLogin', true)
        }
    }
};
</script>

<style>
.card-header-title{
    justify-content: center;
    text-decoration: underline;
}
.card-header{
    margin-bottom: 5px;
}
.card-footer{
    height: 100%;
}
.card-footer-item.button{
    height: 100%;
    color: blueviolet;
}


</style>
