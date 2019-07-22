<template>
    <div>
        <div class="columns">
            <div class="column"></div>
            <div class="column is-three-quarters">
                <div v-if="dataArticles.length > 0">
                    <card-articles @editArticle="editArticle" @likesAction="likesAction" @deleteArticle="deleteArticle" @goDetails="goDetails" v-for="article in dataArticles.reverse()" :key="article._id" :article="article"></card-articles>
                </div>
                <div v-if="dataArticles.length === 0 && fromHome" id="emptyArticles">
                    <h1>GO FOLLOW SOMEONE ! </h1>
                </div>
                <div v-if="dataArticles.length === 0 && fromProfile" id="emptyArticles">
                    <h1>GO POST YOUR FIRST ARTICLE ! </h1>
                </div>
            </div>
            <div class="column"></div>
        </div>
    </div>
</template>

<script>

import CardArticles from './CardArticles.vue'

export default {
    props : ['dataArticles', 'fromHome', 'fromProfile'],
    components : {
        CardArticles
    },
    methods : {
        goDetails(value){
            this.$emit('goDetails', value)
        },
        deleteArticle(value){
            this.$emit('deleteArticle', value)
        },
        likesAction(value){
            this.$emit('likesAction', value)
        },
        editArticle(value){
            this.$emit('editArticle', value)
        }
    }
}
</script>

<style>

.column.is-three-quarters{
    margin-top: 25px;
    /* border: red solid 1px; */
    display: flex;
    flex-direction: column;
    /* flex-wrap: wrap; */
    justify-content: center;
    background-color: rgba(255, 255, 255, 0.9);
    border-radius: 30px;
    padding: 30px;
    /* height: 20vh; */
}
#emptyArticles {
    text-align: center;
}

</style>
