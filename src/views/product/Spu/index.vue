<template>
  <div>
    <el-card style="margin: 20px 0">
      <!-- 三级联动已经组成为全局组件了 -->
      <CategorySelect
        @getCategoryId="getCategoryId"
        :show="scene!=0"
      ></CategorySelect>
    </el-card>
    <el-card>
      <div v-show="scene == 0">
        <!-- 展示spk列表的结构 -->
        <el-button type="primary" icon="el-icon-plus" :disabled="!category3Id" @click="addSpu">添加SPU</el-button>
        <el-table style="width: 100%" border :data="records">
          <el-table-column
            prop="prop"
            label="序号"
            width="80px"
            align="center"
            type="index"
          >
          </el-table-column>
          <el-table-column prop="spuName" label="spu的名称" width="width">
          </el-table-column>
          <el-table-column prop="description" label="spu的描述" width="width">
          </el-table-column>
          <el-table-column prop="prop" label="操作" width="width">
            <template slot-scope="{ row, $index }">
              <!-- 这里的按钮将来全部用hintButton替换 -->
              <hintButton title="添加sku" type="success" icon="el-icon-plus" size="mini" @click="addSku(row)"> </hintButton>
              <hintButton  title="修改spu" type="warning"  icon="el-icon-edit" size="mini" @click="updataSpu(row)"></hintButton>
              <hintButton title="查看当前spu全部sku列表" type="info" icon="el-icon-info" size="mini" @click="toLookSku(row)"></hintButton>
              <el-dialog :title="`${spu.spuName}的sku列表`" :visible.sync="dialogTableVisible" :before-close="close">
                <!-- table展示sku列表-->
                <el-table :data="skuList" border v-loading="loading" >
                  <!-- 注意看文档 虽然:before-close是一个参数 但是后面接的是function(done)，done 用于关闭 Dialog -->
                  <el-table-column prop="skuName" label="名称" width="150"></el-table-column>
                  <el-table-column prop="price" label="价格" width="200"></el-table-column>
                  <el-table-column prop="weight" label="重量"></el-table-column>
                  <el-table-column label="默认图片">
                    <template slot-scope="{row,$index}">
                        <img :src="row.skuDefaultImg" style="width:100px;height:100px">
                    </template>
                  </el-table-column>
                </el-table>
              </el-dialog>
              <el-popconfirm title="确定删除吗？" @onConfirm="deleteSpu(row)">
                  <hintButton title="删除spu" type="danger" icon="el-icon-delete" size="mini"  slot="reference"></hintButton>
              </el-popconfirm>             
            </template>
          </el-table-column>
        </el-table>
        <el-pagination
          :current-page="page"
          :page-sizes="[3, 5, 10]"
          :page-size="limit"
          layout="prev, pager, next, jumper,->,sizes,total"
          :total="total"
          style="text-align: center"
          @size-change="handleSizeChange"
          @current-change="getSpuList"
        >
        </el-pagination>
      </div>
      <SpuForm v-show="scene == 1" @changeScenes="changeScenes" ref="spu">添加spu||修改spu </SpuForm>
      <SkuForm v-show="scene == 2" @changeScene="changeScene" ref="sku">添加sku</SkuForm>
    </el-card>
  </div>
</template>
<script>
//引入子组件
import SpuForm from './SpuForm'
import SkuForm from "./SkuForm";
export default {
  name:'Spu',
  components: {
    SpuForm,
    SkuForm,
  },
  data() {
    return {
      dialogTableVisible: false,//控制显示sku对话框的显示与隐藏
      category1Id: "",//收集一级分类id
      category2Id: "",//收集二级分类id
      category3Id: "",//收集三级分类id
      data: [],
      page:1,//分页器当前第几页
      limit:3,//每一页需要展示多少条数组
      records:[],//spu列表的数据
      total:0,//分页器一共需要展示的数据条数
      scene:0,//0代表展示spu列表的数据   1代表添加spu||修改spu  2代表添加sku
      spu:{},//存储查看的spu信息
      skuList:[],//存储查看的spu的sku信息
      loading: true
    };
  },
  methods: {
    // 三级联动的自定义事件
    getCategoryId({ category1Id, category2Id, category3Id }) {
      this.category1Id = category1Id;
      this.category2Id = category2Id;
      this.category3Id = category3Id;
      if (this.category3Id) {
        //获取spu列表进行展示
        this.getSpuList();
      }
    },
    //获取spu列表的数据
    async getSpuList(pages=1){
      this.page=pages
      const{page,limit,category3Id}=this
       //携带三个参数:page 第几页  limit 每一页需要展示多少条数据  三级分类id
      let result= await this.$API.spu.reqSpuList(page,limit,category3Id)
      console.log(result)
      if(result.code==200){
        this.records=result.data.records;
        this.total=result.data.total;
      }
    },
      //当分页器的某一个展示数据条数发生变化的回调
    handleSizeChange(limit) {
      //修改参数
      this.limit = limit;
      //再发请求
      this.getSpuList();
    },
    //添加sku按钮的回调
    addSku(row){
      //切换场景为2
      this.scene =2;
      //父组件调用子组件的方法 ，让子组件发请求  3个请求
      this.$refs.sku.getData(this.category1Id, this.category2Id,this.category3Id, row)
    },
   //修改某一个spu
   updataSpu(row){
      //切换场景为1
      this.scene =1;
      // 父组件获取子组件SpuForm的数据和方法
      //在父组件中，可以通过ref或者$children获取子组件的数据或方法  。
      //子组件也可以通过$parent 获取父组件的数据+方法
      // 第一步，给子组件用ref大表示
      // 第二步，通过this.$refs获取到
      this.$refs.spu.initSpuData(row);//调用子组件的initSpuData方法 调用的时候，把row传给子组件的initSpuData
   },
   //（SpuForm）通知父组件修改的自定义事件
    changeScenes({scene,flag}) {
      //切换场景
      //flag是用来区分是修改数据的保存 还是添加数据的保存
      //如果是修改数据的保存  那么你修改的是那一页的数据  保存后，获取spu列表就应该去到哪一页展示数据
      //如果是添加的保存 统一去到第一页
      this.scene = scene;
      if(flag=='修改'){
        //场景切换为之后，应该要再次发请求，获取spu列表数据进行展示
         this.getSpuList(this.page);
      }else{
        this.getSpuList();//没有参数就是1  因为上面的获取spu列表 有个page=1
      }
    },
     //skuform通知父组件修改场景
    changeScene(scene) {
      this.scene = scene;
    },
    //添加一个spu
    addSpu(){
       //切换场景为2
        this.scene =1;
        this.$refs.spu.addSpuData(this.category3Id)//调用子组件的addSpuData方法 调用的时候，把三级分类传给子组件
    },
    //删除Spu
    async deleteSpu(row){
      let result = await this.$API.spu.reqDeleteSpu(row.id)
      if(result.code==200){
        this.$message({type:'success',message:'删除成功'})
         //代表SPU个数大于1删除的时候停留在当前页，如果SPU个数小于1 回到上一页
        this.getSpuList(this.records.length>1?this.page:this.page-1)
      }
    },
    //查看spu的sku按钮的回调
    async toLookSku(row){
      this.dialogTableVisible = true
      this.spu=row;
      let result = await this.$API.sku.reqSkuList(row.id)
      if(result.code==200){
        this.skuList=result.data
        this.loading= false//请求成功让lodding隐藏
      }
    },
    close(done){
      //loading属性再次变为真
      this.loading = true;
      //清除sku列表的数据
      this.skuList = [];
      //管理对话框
      done();
    },
  },
};
</script>
<style lang="">
</style>