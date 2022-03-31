<template>
  <div>
       <!-- inline:代表的是行内表单，代表一行可以放置多个表单元素 -->
    <el-form :inline="true"  class="demo-form-inline" :model="cForm">
      <el-form-item label="一级分类" >
        <!-- select的双向数据绑定v-model收集到的是value的值   一般的input框v-model="xxx"  xxx就是双向数据 可是select不是 -->
        <!-- 非原生DOM的想要绑定原生事件focus、click、change一律都得加.native修饰符，否则无法触发事件
          但是像element-ui组件这种非原生dom绑定focus、click、change原生事件不用，因为它们是经过elementUI封装过的 -->
          <!-- 二级分类的数据什么时候才获取呢？当一级分类发生变化的时候，所以绑定@change事件 -->
        <el-select  placeholder="请选择"  v-model="cForm.category1Id" @change="handler1">
          <el-option :label="c1.name" :value="c1.id" v-for="(c1,index) in Category1List" :key="c1.id" :disabled="show"></el-option>
        </el-select>
      </el-form-item>
       <el-form-item label="二级分类"  >
        <el-select  placeholder="请选择" v-model="cForm.category2Id" @change="handler2">
          <el-option :label="c2.name" :value="c2.id" v-for="(c2,index) in Category2List" :key="c2.id" :disabled="show"></el-option>
        </el-select>
      </el-form-item>
       <el-form-item label="三级分类"  >
        <el-select  placeholder="请选择" v-model="cForm.category3Id" @change="handler3">
          <el-option :label="c3.name" :value="c3.id" v-for="(c3,index) in Category3List" :key="c3.id" :disabled="show"></el-option>
        </el-select>
      </el-form-item>
    </el-form>
  </div>
</template>
<script>
export default {
  name: "CategorySelect",
   props: ["show"],
  data() {
    return {
      Category1List:[],//一级分类的数据
      Category2List:[],//二级分类的数据
      Category3List:[],//三级分类的数据
       cForm: {//收集相应的一，二，三级分类的id
        category1Id: "",
        category2Id: "",
        category3Id: "",
      },

    }
  },
  mounted() {//组件挂载完毕，就获取相应的一级分类的数据
    this.getCategory1List()
  },
  methods: {
    //获取一级分类的方法
    async getCategory1List(){
      let result =await this.$API.attr.reqCategory1List()
      if(result.code==200){
        this.Category1List=result.data
      }
    },
    //获取二级分类
    async handler1(){ //当一级分类的值option发生改变的时候获取 所以handel1绑定的是@change事件事件
    //清除数据   下次再选择一级分类还会触发@change的回调 handler1，接着就把二三级分类的数据清空，清空完之后，再发请求
    // 所以清空数据一定要在发请求之前
      this.Category2List=[];
      this.Category3List=[];
      this.cForm.category2Id='';
      this.cForm.category3Id='';
      const {category1Id}=this.cForm
       //通过一级分类的id，获取二级分类的数据
       let result =await this.$API.attr.reqCategory2List(category1Id)
       if(result.code==200){
         this.Category2List=result.data
       }
    },
    //获取三级分类
    async handler2(){ //当二级分类的值option发生改变的时候获取 所以handel2绑定的是@change事件事件
    //清除数据
      this.Category3List=[];
       this.cForm.category3Id='';
      const {category2Id}=this.cForm
      //通过二级分类的id，获取三级分类的数据
       let result =await this.$API.attr.reqCategory3List(category2Id);
       if(result.code==200){
         this.Category3List=result.data
       }
    },

    handler3(){
      const{category1Id,category2Id,category3Id}=this.cForm
      this.$emit('getCategoryId',{category1Id,category2Id,category3Id})
    },
  },
};
</script>
<style lang="">
</style>