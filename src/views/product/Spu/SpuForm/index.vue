<template>
  <div>
    <el-form ref="form" :model="spu" label-width="80px">
      <!-- el-form-item会继承label-width="80px"这个属性 -->
      <el-form-item label="SPU名称" >
        <el-input placeholder="spu的名称" v-model="spu.spuName"></el-input>
      </el-form-item>
      <el-form-item label="品牌">
        <el-select placeholder="请选择品牌" v-model="spu.tmId">
          <!-- 把value="tm.id 收集到 v-model 的"spu.tmId"上 -->
          <el-option
            :label="tm.tmName"
            :value="tm.id"
            v-for="(tm, index) in tradeMarkList"
            :key="tm.id"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="SPU描述">
        <el-input type="textarea" rows="4" placeholder="描述" v-model="spu.description"></el-input>
      </el-form-item>
      <el-form-item label="SPU图片">
        <!-- 上传图片：action图片上传的地址  list-type: 文件列表的类型 on-preview:图片预览的时候会出发  on-remove:当删除图片的时候会出发 
         file-list：照片墙需要展示的数据  他能展示多个图片 不过要求的是 数据必须是数组的形式且
         且数组里面的元素务必要有name、url属性   记住哦，必须是name和url这几个字段哦  什么imgname和imgurl都不行
         之前在trademark组件也用过一次上传图片，不过跟这个不一样 那个是只能上传一个图片的
         on-preview：图片预览功能 预览图片触发的回调
         on-remove:删除图片的时候会触发的回调
         on-success：图片上传成功触发的回调
        -->
        <el-upload
          action="/dev-api/admin/product/fileUpload"
          list-type="picture-card"
          :file-list="spuImageList"
          :on-preview="handlePictureCardPreview"
          :on-remove="handleRemove"
          :on-success="handlerSuccess"
        >
          <i class="el-icon-plus"></i>
        </el-upload>
        <el-dialog :visible.sync="dialogVisible">
          <img width="100%" :src="dialogImageUrl" alt="" />
        </el-dialog>
      </el-form-item>
      <el-form-item label="销售属性">
        <el-select :placeholder="`还有${unSelectSaleAttr.length}未选择`" v-model="attrIdAndAttrName">
          <el-option
            :label="unSelect.name"
            v-for="(unSelect, index) in unSelectSaleAttr"
            :key="unSelect.id"
            :value="`${unSelect.id}:${unSelect.name}`"
          >
          <!-- :value="`${unSelect.id}:${unSelect.name}`"   这里是绑定了两个值，且之间用:隔开-->
          <!-- :value这里也可以直接传对象 -->
          </el-option>
        </el-select>
        <el-button type="primary" icon="le-icon-plus" :disabled="!attrIdAndAttrName" @click="addSaleAttr">添加销售属性</el-button>
      </el-form-item>
      <!-- 展示的是当前SPU属于自己的销售属性 -->
      <el-table style="width: 100%" border :data="spu.spuSaleAttrList">
        <el-table-column type="index" label="序号" width="80px" align="center">
        </el-table-column>
        <el-table-column prop="saleAttrName" label="属性名" width="width">
        </el-table-column>
        <el-table-column prop="prop" label="销售属性的属性值" width="width">
          <template slot-scope="{ row, $index }">
              <!-- el-tag:用于展示已有属性值列表的数据的
              @close点击是el-tag右上角那个x的回调事件 -->
            <el-tag :key="tag.id" v-for="(tag,index) in row.spuSaleAttrValueList" closable :disable-transitions="false"
            @close="deleteArrtValue(row,index)">
              {{ tag.saleAttrValueName}}
            </el-tag>
               <!-- 底下的el-input和el-button就类似于Attr组件中的span与input切换(焦点那)   -->
              <!--  @keyup.enter.native="handleInputConfirm" @blur="handleInputConfirm" -->
            <el-input class="input-new-tag" v-if="row.inputVisible" v-model="row.saleAttrValueName"
             ref="saveTagInput" size="small" @blur="handleInputConfirm(row)" >
              </el-input>
            <el-button v-else class="button-new-tag" size="small" @click="addSaleAttrValue(row)" >+添加</el-button>
          </template>

        </el-table-column>
        <el-table-column prop="prop" label="操作" width="width">
            <template slot-scope="{row,$index}">
                <el-button type="danger" icon="el-icon-delete" size='mini' @click="deleteArrt($index)"></el-button>
            </template>
        </el-table-column>
      </el-table>
      <el-form-item>
        <el-button type="primary" @click="addOrUpdateSpu">保存</el-button>
        <el-button @click="cancle">取消</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>
<script>
export default {
  name: "SpuForm",
  data() {
    return {
      dialogImageUrl: "",
      dialogVisible: false,
      //spu属性初始化的时候是一个空的对象,当你修改SPU的时候，会向服务器发请求，返回SPU信息（对象），在修改的时候可以利用服务器返回的这个对象收集最新的数据提交给服务器
      //添加SPU，如果是添加SPU的时候并没有向服务器发请求，数据收集到哪里呀[SPU]，收集数据的时候有哪些字段呀，看文档
      spu: {
        //存储spu信息属性
        //前面三个参数是通过上面的数据双向绑定v-model收集
        tmId: '', //品牌的id
        description: "", //描述
        spuName: "", //spu名称
        category3Id: 0, //三级分类的id是通过父组件spu传过来的
        spuImageList: [
          //收集SPU图片的信息
          {
            // imgName: "",
            // imgUrl: "",
          },
        ],
        spuSaleAttrList: [
          //平台属性与属性值收集
          // {
          //   baseSaleAttrId: 0,
          //   id: 0,
          //   saleAttrName: "string",
          //   spuId: 0,
          //   spuSaleAttrValueList: [
          //     {
          //       baseSaleAttrId: 0,
          //       id: 0,
          //       isChecked: "string",
          //       saleAttrName: "string",
          //       saleAttrValueName: "string",
          //       spuId: 0,
          //     },
          //   ],
          // }
        ],
      },
      tradeMarkList: [], //存储品牌信息
      spuImageList: [], //存储spu图标
      saleAttrList: [], //存储销售属性
      attrIdAndAttrName:'',//收集未选择的销售属性的id

    };
  },
  methods: {
    //照片墙删除某一个图片的时候会触发
    handleRemove(file, fileList) {
      //file参数:代表的是删除的那个张图片
      //fileList:照片墙删除某一张图片以后，剩余的其他的图片
      console.log(file, fileList);
      //收集照片墙图片的数据
      //对于已有的图片【照片墙中显示的图片：有name、url字段的】，因为照片墙显示数据务必要有这两个属性
      //对于服务器而言，不需要name、url字段，将来对于有的图片的数据在提交给服务器的时候，需要处理的
      this.spuImageList = fileList;
    },
    //照片墙图片预览的回调
    handlePictureCardPreview(file) {
      console.log(file);
      //将图片地址赋值给这个属性
      this.dialogImageUrl = file.url;
      //对话框显示
      this.dialogVisible = true;
    },
    //照片墙图片上传成功的参数
    handlerSuccess(response, file, fileList){
      //response 服务器返回的图片信息  里面包含在线图片转为话url的信息  我们之前写tardemark组件的时候，就是收集转化后的url 而在这里是所有照片的信息都要收集
      //file, 上传成功之后的那张图片信息 也是包含url等信息
      //fileList  上传成功之后的所有图片信息 也是包含url等信息
      
      //收集所有图片的信息
       this.spuImageList = fileList;

    },
    //点击修改spu按钮，初始化spuform数据(在父组件spu中的updataSpu调用该请求)
    async initSpuData(row) {
      //这个row是父组件中传过来的  父组件打ref标识符，调用子组件initSpuData方法的时候传的
      //获取spu信息数据
      let result = await this.$API.spu.reqSpu(row.id);
      if (result.code == 200) {
        this.spu = result.data;
        console.log(this.spu)
      }
      //获取品牌信息数据
      let result2 = await this.$API.spu.reqTradeMarkList();
      if (result2.code == 200) {
        this.tradeMarkList = result2.data;
      }
      //获取SPU图标的数据
      let result3 = await this.$API.spu.reqSpuImageList(row.id);
      if (result3.code == 200) {
        let listArr = result3.data;
        ///由于照片墙显示图片的数据需要数组，数组里面的元素需要有name与url字段
        //需要把服务器返回的数据进行修改（因为我们发请求，获取的spu图片是imgName和imgUrl字段）

        listArr.forEach((item) => {
          item.name = item.imgName;
          item.url = item.imgUrl;
        });
        //把整理好的数据赋值给
        this.spuImageList = listArr;
      }

      //获取平台全部销售属性的数据
      let result4 = await this.$API.spu.reqBaseSaleAttrList();
      if (result4.code == 200) {
        this.saleAttrList = result4.data;
      }
    },
    //添加新的销售属性
    addSaleAttr(){
       //已经收集需要添加的销售属性的信息
      //把收集到的销售属性数据进行整改，整改为发请求时，接口需要的形式
      // 我们前面是用字符串attrIdAndAttrName的形式接收的参数，现在我们要整改且把他放回info
      // 因为最后我们是要带着info去发请求的
      const[baseSaleAttrId,saleAttrName]=this.attrIdAndAttrName.split(':')
      //也可以拆分为下面的这种写法
      //  const[baseSaleAttrId]=this.attrIdAndAttrName.split(':')[0]
      //  const[saleAttrName]=this.attrIdAndAttrName.split(':')[1]

      // 把整改完的属性丢回spu.spuSaleAttrList当中 而且spuSaleAttrList数组中存的是对象
      let newSaleAttr = {baseSaleAttrId,saleAttrName,spuSaleAttrValueList:[]} //这里是用{}  因为你要push到的spuSaleAttrList[{}] 看清楚了，他是对象数据组
      this.spu.spuSaleAttrList.push(newSaleAttr);
      //点击完添加销售属性后清空 
      //把添加的那一项从select框中清空
      this.attrIdAndAttrName=''


    },
    //添加按钮的回调
    addSaleAttrValue(row){
      //点击销售属性值当中添加按钮的时候，需要有button变为input,通过当前销售属性的inputVisible控制
      //挂载在销售属性身上的响应式数据inputVisible，它控制button与input切换
      //并且还要收集新增的销售属性值
      this.$set(row,'inputVisible',true)
      //自动聚焦
      this.$nextTick(()=>{
        this.$refs.saveTagInput.focus()
      })
       //通过响应式数据saleAttrValueName字段收集新增的销售属性值
      this.$set(row,'saleAttrValueName','')//初始值肯定是空串 你给input框绑定v-model 初始值也是空串，一样的道理
    },
    //el-input失却焦点的事件
    handleInputConfirm(row){
      const{saleAttrValueName,baseSaleAttrId}=row
      //新增的销售属性值的名称不能为空
      if(saleAttrValueName.trim() ==""){
        this.$message("属性值不能为空");
        return
      }
      //属性值不能重复
      let result=row.spuSaleAttrValueList.every((item)=>{
          return item.saleAttrValueName!=saleAttrValueName
      })
      if(!result){
        this.$message("属性值重复");
        return
      }
      //当失去焦点的时候，需要整理参数
      //你前面虽然通过响应式this.$set(row,'saleAttrValueName','')把saleAttrValueName存进row 但是没有存到spuSaleAttrValueList
      //我们发请求的时候，需要把saleAttrValueName放进spuSaleAttrValueList数组里面 所以需要整理参数 并且还有一个点。前面读取数据是从
      //spuSaleAttrValueList[]里面读取的，你不把saleAttrValueName存进去，你添加的新销售属性值在table也展示不出来
      //(不知道有什么用的话，把他注释掉去看看有什么后果)
      //新增的销售属性值
      //  添加到每一个row就可以了，不需要添加到this.spu.spuSaleAttrList 
      //这里面是放所有row的 我们只要给哪一行row添加值，就收集那一行的值就行了
      let newSaleAttr ={saleAttrValueName,baseSaleAttrId}
      row.spuSaleAttrValueList.push(newSaleAttr)
      // 修改inputVisible为false，显示button
      row.inputVisible=false
    },
    //删除el-tag的属性值
    deleteArrtValue(row,index){
      //这里也是不用发请求的
      row.spuSaleAttrValueList.splice(index,1)
    },
    //删除销售属性
    deleteArrt($index){
      //这里也是不用发请求的
      //row是每一行  $index是每一行的索引  找到spu中的row删除 就是根据这个$index
      this.spu.spuSaleAttrList.splice($index,1)
    },
    //保存按钮的回调
    async addOrUpdateSpu(){
      
      //整理参数
      //1.整理照片墙数据
      //2.携带参数  携带imageName iamgeUrl

      // 点击修改，返回的图片是imageurl和imagename 而前台要展示出图片必须要name和url的字段  
      //所以在发请求获取图片数据的时候，我们就把后端返回的imageurl和imagename复制一份 给了name和url
      // 现在到点击保存了
      // 我们需要携带给服务器的图片的参数是imageurl和imagename
      //可是el-upload组件把我们本地的图片自动生成name和url字段
      //所以我们又要把他变为iamgename和imageurl字段
      // map()方法：map，映射，即原数组映射成一个新的数组；
      // map方法接受一个新参数，这个参数就是将原数组变成新数组的映射关系
      // 可以通过map方法得到某一个对象数组中特定属性的值
      //因为前面已经把老图片的imageurl和imagename复制一份 给了name和url 所以老图片既有mageurl和imagename  又有name和url且值相等
      //新增的图片也有name和url不过url是本地的图片  我们发请求要的是本地图片的url转为在线的url才能用
      //而这个url转化好的url在哪呢？el-upload组件已经把我们把转化好的在线url放在了response对象里面了 就是response.data,这个data就是妆化好的url
      // 也就是说response对象里面也有个url
       this.spu.spuImageList = this.spuImageList.map((item) => {//把整理好的参数放进spu.spuImageList
        return {
          imageName: item.name,  //新老图片都有name，这里可以不用区分开
          imageUrl: item.response ? item.response.data : item.url, //老图片的url直接在spuImageList中 
          // 新图片的URl就是spuImageList下的response.data   所以先判断有没有response，有的话就怎么是新图片，用response.data，
                                                                                //没有就说明是老图片，用item.url
        };

      });
      //发起请求
       let result = await this.$API.spu.reqAddOrUpdateSpu(this.spu);
        if (result.code == 200) {
        //提示
        this.$message({ type: "success", message: "保存成功" });
        //通知父组件回到0的场景  也就是跳回一开始的页面   我们是用scene控制页面的
        this.$emit('changeScenes', {
          scene:0,
          flag: this.spu.id ? "修改" : "添加",
        });
        //flag是用来判断  你当前点击的保存是修改的保存  还是新增的保存  有id的是修改
        //清空数据 因为你只有清空了数据，下次再点击添加spu 才没有数据展示出来
         //Object.assign:es6中新增的方法可以合并对象
        //组件实例this._data,可以操作data当中响应式数据
        //this.$options可以获取配置对象，配置对象的data函数执行，返回的响应式数据为空的
         Object.assign(this._data, this.$options.data());
      }
    },
    //点击添加spu按钮的回调(在父组件spu中的addSpu调用该请求)
    async addSpuData(category3Id){
      //添加spu的三级分类id
      //获取品牌信息数据
      this.spu.category3Id=category3Id
       let result2 = await this.$API.spu.reqTradeMarkList();
        if (result2.code == 200) {
          this.tradeMarkList = result2.data;
        }
        //获取品台全部的销售属性
        let result4 = await this.$API.spu.reqBaseSaleAttrList();
        if (result4.code == 200) {
          this.saleAttrList = result4.data;
        }
    },
    //点击取消按钮
    cancle(){
      //取消按钮的回调，通知父亲切换场景为0
      this.$emit('changeScenes', {scene:0,flag: ''})  //这个flage你看上面的保存按钮的回调   
      //虽然我们这里用不到flag  但是自定义事件changeScenes({scene,flag}) 接收参数的时候，有个flag占位
       //清理数据
      //Object.assign:es6中新增的方法可以合并对象
      //组件实例this._data,可以操作data当中响应式数据
      //this.$options可以获取配置对象，配置对象的data函数执行，返回的响应式数据为空的
      Object.assign(this._data, this.$options.data());
    },
      

  },
  
  computed:{
      unSelectSaleAttr() {
      //整个平台的销售属性一共三个：尺寸、颜色、版本 ----saleAttrList
      //当前SPU拥有的属于自己的销售属性SPU.spuSaleAttrList  ----颜色
      //数组的过滤方法，可以从已有的数组当中过滤出用户需要的元素，并未返回一个新的数据
      let result = this.saleAttrList.filter((item) => 
        //every数组的方法，会返回一个布尔值【真，假的】
          this.spu.spuSaleAttrList.every((item1) => {
          return item.name != item1.saleAttrName;
        })
      );


      //2. let result = this.saleAttrList.filter((item) => {
      //   //every数组的方法，会返回一个布尔值【真，假的】
      //   return this.spu.spuSaleAttrList.every((item1) => {
      //     return item.name != item1.saleAttrName;
      //   });
      // });

    //  3. let result = [];
    //   this.saleAttrList.forEach((item1) => {
    //     this.spu.spuSaleAttrList.forEach((item2) => {
    //       if (item1.name != item2.saleAttrName) {
    //         result.push(item1);
    //       }
    //     });
    //   });

      return result;
    },
  },
};
</script>
<style>
  .el-tag + .el-tag {
    margin-left: 10px;
  }
  .button-new-tag {
    margin-left: 10px;
    height: 32px;
    line-height: 30px;
    padding-top: 0;
    padding-bottom: 0;
  }
  .input-new-tag {
    width: 90px;
    margin-left: 10px;
    vertical-align: bottom;
  }
</style>