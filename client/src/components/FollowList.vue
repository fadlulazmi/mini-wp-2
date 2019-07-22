<template>
    <div>
        <!-- {{follow.status}}
        {{follStatus}} -->
        <li>
            {{follow.follow.username}} 
            <button v-if="!follStatus" @click="follow" class="button is-small is-success">follow</button>
            <button v-if="follStatus" @click="unfollow" class="button is-small is-danger">unfollow</button>
        </li>
        
    </div>
</template>

<script>
export default {
    props : ['follow'],
    data(){
        return {
            follStatus : false
        }
    },
    created : function(){
        console.log('this.follow.status: ', this.follow.status);
        if(this.follow.status == 'followers'){
            this.follow.follow.following.forEach(el => {
                this.follow.follow.followers.forEach(ell => {
                    if(el._id == ell._id){
                        this.follStatus = true
                    }
                })
            });
        } 
        else if(this.follow.status == 'following'){
            this.follStatus = true
        } 
    },
    methods : {
        follow(){
            this.$emit('followAction', [this.follow.follow._id, 'follow'])
        },
        unfollow(){
            this.$emit('followAction', [this.follow.follow._id, 'unfollow'])
        }
    }
}
</script>

<style scoped>
li {
    border-bottom: 1px solid grey;
    padding: 10px;
}
li button {
    float: right;
}
</style>
