<template>
    <div>
        <!-- {{follow.follow}} -->
        <li>{{follow.follow.username}} <button v-if="!follStatus" @click="follow" class="button is-small is-danger">follow</button><button v-if="follStatus" @click="unfollow" class="button is-small is-danger">unfollow</button></li>
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
        if(this.follow.status === 'followers'){
            this.follow.follow.following.forEach(el => {
                this.follow.follow.followers.forEach(ell => {
                    if(el._id === ell._id){
                        this.follStatus = true
                    }
                })
            });
        } else {
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
}
</style>
