<template>
  <div>
    <el-form ref="form"  label-width="80px">
      <el-form-item label="SPU名称"> {{spu.spuName}} </el-form-item>
      <el-form-item label="SKU名称">
        <el-input v-model="skuInfo.skuName" placeholder="SKU名称"></el-input>
      </el-form-item>
      <el-form-item label="价格(元)" >
        <el-input type="number" v-model="skuInfo.price" placeholder="价格(元素)" ></el-input>
      </el-form-item>
      <el-form-item label="重量(千克)">
        <el-input v-model="skuInfo.weight" placeholder="重量(千克)"></el-input>
      </el-form-item>
      <el-form-item label="规格描述">
        <el-input
          type="textarea"
          v-model="skuInfo.skuDesc"
          placeholder="规格描述"
          rows="4"
        ></el-input>
      </el-form-item>
      <el-form-item label="平台属性">
        <el-form :inline="true" ref="form"  label-width="80px">
          <el-form-item :label="attr.attrName" v-for="(attr,index) in attrInfoList" :key="attr.id">
            <el-select v-model="attr.attrIdAndValueId" placeholder="请选择">
                <!-- 不能直接收集到skuInfo.skuAttrValueList 因为"`${attr.id}:${attrvalue.id}`"是字符串  skuInfo.skuAttrValueList是数组 
                到时候发请求之前整理  我之前是想着，在data里面声明一个字符串，把收集到的id放在里面 但是这样收集一个数据还可以，要是收集多个属性就会出错
                收集多个不但后面数据的会把前面的覆盖，而且每次只能收集一个平台的属性  应该借用上面的for循环，把每一个收集到的id，
                放到对应的每一项attrInfoList里面  当初我们收集spuform的attrIdAndAttrName的时候  他就只有一个销售属性 ，没有多个属性可以收集
                -->
              <el-option :label="attrvalue.valueName" :value="`${attr.id}:${attrvalue.id}`" v-for="(attrvalue,index) in attr.attrValueList" :key="attrvalue.id"></el-option>
            </el-select>
          </el-form-item>
          
        </el-form>
      </el-form-item>
      <el-form-item label="销售属性">
        <el-form :inline="true" ref="form"  label-width="80px">
          <el-form-item :label="sale.saleAttrName" v-for="(sale,index) in spuSaleAttrList" :key="sale.id">
              <!-- 跟上面一样，也是不能直接收集到skuInfo.skuSaleAttrValueList 
              到时候发请求之前整理-->
            <el-select v-model="sale.attrIdAndValueId" placeholder="请选择"  >
              <el-option :label="salevalue.saleAttrValueName" :value="`${sale.id}:${salevalue.id}`" v-for="(salevalue,index) in sale.spuSaleAttrValueList" :key="salevalue.id"></el-option>
            </el-select>
          </el-form-item>
        </el-form>
      </el-form-item>
      <el-form-item label="图片列表">
        <el-table :data="spuImageList" style="width: 100%" border @selection-change='handleSelectChange'>
          <el-table-column prop="prop" width="80px" type="selection" >
          </el-table-column>
          <el-table-column prop="prop" label="图片" width="width">
              <template slot-scope="{row,$index}" >
                  <img :src="row.imgUrl" alt="" style="width:100px;height:100px">
              </template>
          </el-table-column>
          <el-table-column prop="imgName" label="图片名称" width="width">
          </el-table-column>
          <el-table-column prop="prop" label="操作" width="width">
              <template  slot-scope="{row,$index}">
                  <el-button type="primary" v-if="row.isDefault==0" @click="changeDefault(row)"> 设置默认</el-button>
                  <el-button v-else>默认</el-button>
              </template>
          </el-table-column>
        </el-table>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="save">保存</el-button>
        <el-button @click="cancel">取消</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>
<script>
export default {
  name: "skuForm",
  data() {
    return {
      spuImageList: [], //存储图片的信息
      spuSaleAttrList: [], //存储销售是属性
      attrInfoList: [], //存储平台属性的数据
       skuInfo: {
        //第一类收集的数据：父组件给的数据
        category3Id: 0,
        spuId: 0,
        tmId: 0,
        //第二类：需要通过数据双向绑定v-model收集
        skuName: "",
        price: '',
        weight: "",
        skuDesc: "",
        //第三类：需要自己书写代码
        //默认图片
        skuDefaultImg: "",
        //收集图片的字段
        skuImageList: [
          // {
          //   imgName: "string",
          //   imgUrl: "string",
          //   isDefault: "string",
          //   spuImgId:"0"
          // },
        ],
        //平台属性
        skuAttrValueList: [
          // {
          //   attrId: 0,
          //   valueId: 0,
          // },
        ],
        //销售属性
        skuSaleAttrValueList: [
          // {
          //   saleAttrId: 0,
          //   saleAttrValueId: 0,
          // },
        ],
      },
       //收集图片的数据字段:但是需要注意，收集的数据目前缺少isDefault字段，将来提交给服务器数据的时候，需要整理参数
        imageList:[],
        spu:{},//收集父组件传过来的row
    };
  },
  methods: {
    //获取skuForm数据 要发三个请求
    async getData(category1Id, category2Id, category3Id, row) {
        //收集父组件给予的数据
      this.skuInfo.category3Id = category3Id;
      this.skuInfo.spuId = row.id;
      this.skuInfo.tmId = row.tmId;
      this.spu = row;
      //获取图片的数据
      let result = await this.$API.sku.reqSpuImageList(row.id);
      if (result.code == 200) {
       let list = result.data;
       list.forEach(item => {
           item.isDefault = 0;//0代表设置默认  1代表默认
       });
       this.spuImageList=list
       //这样spuImageList的每一个元素就多了一个isDefault字段

      }
      //获取销售属性的数据
      let result1 = await this.$API.sku.reqSpuSaleAttrList(row.id);
      if (result1.code == 200) {
        this.spuSaleAttrList = result1.data;
        console.log(this.spuSaleAttrList);
      }
      //获取平台属性的数据
      let result2 = await this.$API.sku.reqAttrInfoList(
        category1Id,
        category2Id,
        category3Id
      );
      if (result2.code == 200) {
        this.attrInfoList = result2.data;
      }
    },
    //el-table表格复选款的事件
    handleSelectChange(params){
        //获取到用户选中图片的信息数据，但是需要注意，当前收集的数据当中，缺少isDefault字段
        //我们用isDefault字段来区分点击的是默认还是设置默认
       
        this.imageList=params
    },
    //排他操作
    changeDefault(row){
        //图片列表的数据的所有isDefault字段都变为 0
      this.spuImageList.forEach(item=>{
          item.isDefault = 0;
      });
      //只有点击的那个图片的数据变为1
      row.isDefault = 1;
      //收集点击默认图片的地址
      this.skuInfo.skuDefaultImg = row.imgUrl;
    },
    //点击取消按钮
    cancel(){
        //取消按钮的回调，通知父亲切换场景为0
        this.$emit('changeScene',0)
        //清理数据
      //Object.assign:es6中新增的方法可以合并对象
      //组件实例this._data,可以操作data当中响应式数据
      //this.$options可以获取配置对象，配置对象的data函数执行，返回的响应式数据为空的
      Object.assign(this._data, this.$options.data());
    },
    //点击保存按钮
    async save(){
        
        //整理参数
        //整理平台属性
        const {attrInfoList,skuInfo,spuSaleAttrList,imageList}=this;
         //整理平台属的数据
        attrInfoList.forEach(item=>{
           if(item.attrIdAndValueId){//筛选出attrInfoList的item里面有attrIdAndValueId的
            const[attrId,valueId]=item.attrIdAndValueId.split(':');
            let obj={attrId,valueId};
            this.skuInfo.skuAttrValueList.push(obj)
           }
        });
        //整理销售属性
        spuSaleAttrList.forEach(item=>{
            if(item.attrIdAndValueId){//筛选出spuSaleAttrList的item里面有attrIdAndValueId的
             const[saleAttrId,saleAttrValueId]=item.attrIdAndValueId.split(':'); 
              let obj={saleAttrId,saleAttrValueId};
              this.skuInfo.skuSaleAttrValueList.push(obj)
            }
        });
        //整理图片的数据  
        //你可能回觉得  我没有把isDefault添加到imageList也有isDefault  你别忘记了你在点击复选款handleSelectChange的时候，
        //复选款的@selection-change事件会接受一个参数 params  params会把你勾选的那一整行数据返回来
         // 而你在复选款el-select绑定的data是spuImageList 所以就是他会把你勾选的spuImageList的那行图片数据返回
        // 又应为你在发请求接收图片数据的时候，又通过foreach循环，给每个spuImageList添加了isDefault
        //params也有isDefault了    又在复选框里加了这么一句this.imageList=params  imageList也有isDefault
        skuInfo.skuImageList=imageList.map(item=>{ //把imageList的数据 映射给skuInfo.skuImageList
            return{
                imgName: item.imgName,
                imgUrl:item.imgUrl,
                isDefault:item.isDefault,
                spuImgId: item.id,
            }
        })
        let result  = await this.$API.sku.reqAddSku(skuInfo);
        if(result.code==200){
        this.$message({type:'success',message:'添加SKU成功'})
        //成功后，回到页面0
        this.$emit('changeScene',0);
     }
    },
  },
};
</script>
<style lang="">
</style>