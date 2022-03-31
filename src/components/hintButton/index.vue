<template>
    <a :title="title" style="margin:0 10px">
        <el-button v-bind="$attrs" v-on="$listeners"></el-button>
    </a>
</template>
<script>
export default {
    name:'hintButton',
    props:['title']
}
</script>
<style lang="">
    
</style>