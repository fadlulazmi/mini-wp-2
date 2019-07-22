<template>
    <div>
        <div id="landingPage" v-if="!isLogin">
            <Login @isLogin="updateLogin" :isLogin="isLogin"></Login>
        </div>
        <div id="homePage" v-if="isLogin">
            <Home @isLogin="updateLogin" :isLogin="isLogin" ></Home>
        </div>
    </div>
</template>

<script>

import Login from './components/Login.vue';
import Home from './components/Home.vue'


export default {
    components : {
        Login,
        Home
    },
    data(){
        return{
            isLogin : localStorage.getItem('access_token') ? true : false,
            
        }
    }, 
    methods : {
        
        updateLogin(event){
            console.log('event: ', event);
            this.isLogin = event
        },

    }
}
</script>

<style>
* {
    /* font-family: 'Montserrat', sans-serif; */
    font-family: 'Rambla', sans-serif;
    /* font-family: 'Yantramanav', sans-serif; */
    /* font-family: 'Julius Sans One', sans-serif; */
    /* font-weight: 500; */
    /* font-weight: 500; */
    /* font-family: 'Montserrat Alternates', sans-serif; */
    margin: 0;
    padding: 0;
}


#landingPage{
    background-image: url("https://www.grahambrown.com/dw/image/v2/BBBG_PRD/on/demandware.static/-/Sites-product-master/default/dw29de46e9/images/large/104121_1.jpg?sw=290&sh=290&sm=fit");
    min-height: 100vh;
}

#homePage{
    background-image: url("https://www.grahambrown.com/dw/image/v2/BBBG_PRD/on/demandware.static/-/Sites-product-master/default/dw29de46e9/images/large/104121_1.jpg?sw=290&sh=290&sm=fit");
    min-height: 100vh;
}

</style>
