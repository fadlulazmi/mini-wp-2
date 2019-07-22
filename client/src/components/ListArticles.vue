<template>
    <div>
        <div class="columns">
            <div class="column"></div>
            <div class="column is-three-quarters">
                <card-articles @likesAction="likesAction" @deleteArticle="deleteArticle" @goDetails="goDetails" v-for="article in dataArticles.reverse()" :key="article._id" :article="article"></card-articles>
            </div>
            <div class="column"></div>
        </div>
    </div>
</template>

<script>

import CardArticles from './CardArticles.vue'

export default {
    props : ['dataArticles'],
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

</style>
