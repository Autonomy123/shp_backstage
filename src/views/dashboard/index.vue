<template>
  <div>
    <Card></Card>
    <Sale></Sale>
    <Observe></Observe>
  </div>
</template>

<script>
import Card from './Card'
import Sale from './Sale'
import Observe from './Observe'
export default {
  name: '',
    components:{
      Card,
      Sale,
      Observe
    },
    mounted(){
        //派发action 获取echarts图表数据
       this.$store.dispatch('getData');
    },
}
</script>

<style lang="scss" scoped>
</style>
