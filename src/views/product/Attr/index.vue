<template>
  <div>
  
    <el-card style="margin: 20px 0px">
      <CategorySelect @getCategoryId="getCategoryId" :show="!isShowTable"></CategorySelect>
    </el-card>
    <el-card>
      <div v-show="isShowTable">
        <!-- disabled属性来定义按钮是否可用，它接受一个Boolean值 -->
        <el-button
          type="primary"
          icon="el-icon-plus"
          :disabled="!category3Id"
          @click="addAttr"
          >添加属性</el-button
        >
        <!-- 表格，展示平台属性 -->
        <el-table style="width: 100%" border :data="attrList">
          <el-table-column
            label="序号"
            width="80px"
            type="index"
            align="center"
          >
          </el-table-column>
          <el-table-column prop="attrName" label="属性名称" width="150px">
          </el-table-column>
          <el-table-column prop="prop" label="属性值列表" width="width">
            <template slot-scope="{ row, $index }">
              <!-- row代表每一行平台的属性 -->
              <el-tag
                type="success"
                v-for="attrvalue in row.attrValueList"
                :key="attrvalue.id"
                style="margin: 0px 10px"
                >{{ attrvalue.valueName }}</el-tag
              >
            </template>
          </el-table-column>
          <el-table-column prop="prop" label="操作" width="150px">
            <template slot-scope="{ row, $index }">
              <el-button
                type="warning"
                icon="el-icon-edit"
                size="mini"
                @click="updateAttr(row)"
              ></el-button>
              <el-button
                type="primary"
                icon="el-icon-delete"
                size="mini"
              ></el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <!-- 添加属性||修改属性的表格 -->
      <div v-show="!isShowTable">
        <el-form :inline="true" ref="form" label-width="80px" :model="attrInfo">
          <el-form-item label="属性名">
            <el-input
              placeholder="请输入属性名"
              v-model="attrInfo.attrName"
              ref="inputTitle2"
            ></el-input>
          </el-form-item>
        </el-form>
        <el-button
          type="primary"
          icon="el-icon-plus"
          @click="addAttrValue"
          :disabled="!attrInfo.attrName"
          >添加属性值</el-button
        >
        <el-button @click="isShowTable = true">取消</el-button>
        <el-table
          style="width: 100%; margin: 20px 0px"
          border
          :data="attrInfo.attrValueList"
        >
          <el-table-column type="index" label="序号" width="80" align="center">
          </el-table-column>
          <el-table-column prop="prop" label="属性值名称" width="width">
            <template slot-scope="{ row, $index }">
              <!-- 这里结构需要用到span与input进行来回的切换 -->
              <el-input
                v-model="row.valueName"
                placeholder="请输入属性值"
                size="mini"
                v-if="row.flag"
                @blur="toLook(row)"
                @keyup.native.enter="toLook(row)"
                ref="inputTitle"
              ></el-input>
              <span v-else @click="toEdit(row)" style="display: block">{{
                row.valueName
              }}</span>
              <!-- 因为sapn是行内元素，没有宽高，所以要把他变为块元素display:block -->
            </template>
          </el-table-column>
          <el-table-column prop="prop" label="操作" width="width">
            <template slot-scope="{ row, index }">
              <!-- 气泡确认框 -->
              <el-popconfirm :title="`确定删除${row.valueName}吗？`" @onConfirm="deleteAttrValue(index)" >
                <el-button type="danger" size="mini" slot="reference">删除</el-button>
              </el-popconfirm>
            </template>
          </el-table-column>
        </el-table>
        <el-button type="primary" @click="AddOrUpdateAttr" :disabled="attrInfo.attrValueList.length<1">保存</el-button>
        <el-button @click="isShowTable = true">取消</el-button>
      </div>
    </el-card>
  </div>
</template>
<script>
export default {
  name:'Attr',
  //按需引入lodash当中的深拷贝
  // import cloneDeep from "lodash/cloneDeep";
  data() {
    return {
      category1Id: "",
      category2Id: "",
      category3Id: "",
      //接收平台属性
      attrList: [],
      isShowTable: true, //控制展示属性的table表格的显示与隐藏 默认显示
      //收集新增属性|修改属性使用的
      attrInfo: {
        attrName: "", //属性名
        attrValueList: [
          //属性值，因为属性值可以有多个，因此用数组，每一个属性值都是一个对象需要attrId，valueName
          // {
          //   .valueName:"",
          //   attrId:0
          // }
        ],
        categoryId: 0, //三级分类的id  别在这直接收集三面的三级分类id  因为data存储数据是无序的
        categoryLevel: 3, //因为服务器也需要区分几级id
      },
    };
  },
  methods: {
    // 三级联动的自定义回调事件
    getCategoryId({ category1Id, category2Id, category3Id }) {
      this.category1Id = category1Id;
      this.category2Id = category2Id;
      this.category3Id = category3Id;
      if (this.category3Id) {
        //获取平台属性进行展示
        this.getAttrList();
      }
    },
    // 获取品台属性数据
    async getAttrList() {
      const { category1Id, category2Id, category3Id } = this;
      console.log(category1Id, category2Id, category3Id);
      const result = await this.$API.attr.reqAttrList(
        category1Id,
        category2Id,
        category3Id
      );
      if (result.code == 200) {
        this.attrList = result.data;
        console.log(result);
        console.log(this.attrList);
      }
    },
    //添加属性值的回调
    addAttrValue() {
      //向属性值的数组里面添加元素
      //attrId：是你相应的属性的id，目前而言我们是添加属性的操作，还没有相应的属性的id，目前而言带给服务器的id为undefined
      //valueName:相应的属性值的名称
      this.attrInfo.attrValueList.push({
        // 添加新属性值的时候 attrId:undefined,
        attrId: this.attrInfo.id,
        //当我是添新属性的时候，this.attrInfo.attrId就是undefined，因为这时候attrInfo是没有值的
        //当我是点击修改的时候，在原有的属性值上添加新属性的时候，.attrInfo才有值，这时候才有属性attrId(属性id和属性值id要区分开，这时候还是没有属性值id的)
        //修改某一个属性的时候，
        //也可以在已有的属性值的基础之上 新增新的属性值 ，（新增属性值，需要把已有的属性的attrId带上，因为要根据这个id知道要修改的是属性的属性值嘛）
        //
        //增删改查 增不用id 查也不用id 删和改要id
        //当我增和改用用一个接口的时候，因为增不用id，改要id 所以你发请求可以带上id  只是增的时候id为undefined 这不会影响到增的请求的
        valueName: "",
        flag: true,
        //当前flag属性，响应式数据（数据变化视图跟着变化）
      });
      //自动聚焦
      this.$nextTick(() => {
        this.$refs.inputTitle.focus();
      });
    },
    //添加属性按钮的回调
    addAttr() {
      //切换table的显示与隐藏
      this.isShowTable = false;
      //清空数据
      //并且收集三级分类id 因为添加属性值的按钮是在有三级分类id后，才能点击，在此之前一直被禁用。所以这时你可以保证已经有三级分类id了
      //前面不在data中，直接把三级分类id赋值给categoryId，因为data存储数据是无序的
      //清空数据
      this.attrInfo = {
        attrName: "", //属性名
        attrValueList: [
          //属性值，因为属性值可以有多个，因此用数组，每一个属性值都是一个对象需要attrId，valueName
          // {
          //   valueName:"",
          //   attrId:0
          // }
        ],
        categoryId: this.category3Id, //三级分类的id
        categoryLevel: 3, //因为服务器也需要区分几级id
      };
      //自动聚焦
      this.$nextTick(() => {
        this.$refs.inputTitle2.focus();
      });
    },
    //修改某一个属性
    updateAttr(row) {
      //isShowTable变为false
      this.isShowTable = false;
      //将选中的属性赋值给attrInfo
      //由于数据结构当中存在对象里面套数组，数组里面有套对象，因此需要使用深拷贝解决这类问题
      //深拷贝，浅拷贝在面试的时候出现频率很高，切记达到手写深拷贝与浅拷贝
      // 项目中用到lodash下的cloneDeep 但是我这里用到了JSON对象来实现深拷贝
      // this.attrInfo = cloneDeep(row);
      //深拷贝
      this.attrInfo = JSON.parse(JSON.stringify(row));
      this.attrInfo.attrValueList.forEach((item) => {
        // item.flag=false  这样书写也可以给属性值添加flag，但是会发现视图不会跟着变化（因为flag不是响应式数据）

        this.$set(item, "flag", false);
        //因为我的flag只是给添加新属性值的时候，添加的标识符，而我想修改原有的属性，再给原属性添加新的属性值的时候，
        //没有加flag，点击修改属性值的时候，给那些原属性添加属性值，没办法做到span和input的切换，
        //我们可以在修改原属性的回调里通过$set给它添加flag
        //因为的添加属性值的回调里添加flag是因为用到push所以才不用$set
        //$set用法 this.$set(this.data,'key',value)
      });
    },
    //失却焦点的事件---切换为查看模式，展示span
    toLook(row) {
      //row最新新增的属性值【数组的最后一项元素】
      // 如果属性值为空不能作为新的属性值，需要给用户提示，让他输入一个其他的属性值
      if (row.valueName.trim() == "") {
        //trim()去掉前后空格
        this.$message("属性值不能为空");
        return;
      }
      //新增的属性值不能与原有的属性值重复
      let isrepate = this.attrInfo.attrValueList.some((item) => {
        if (row !== item) {
          //需要将row从数组里面判断的时候去除
          //首先row是最后添加的属性值，所以他是attrValueList的最后一个元素
          //其次 if (row !== item)就是 不等于row也就是不等于attrValueList最后一个元素才能进入if语句
          //比如说：attrValueList有三个元素，也就是除了最后一个外，前2个进入到if里做判断
          //这样也就等于将row从数组里面判断的时候去除
          return row.valueName == item.valueName; //当前2个的valueName等于最后一个元素的valueName的时候（这时候代表重复了），退出if语句，返回true，
          //如果前2个中的valueName没有与最后一个valueName相等的 (就说明没重复)，返回false
        }
      });
      if (isrepate) {
        this.$message("属性值重复");
        return;
      }
      // row：形参是当前用户添加的最新的属性值
      // 当前编辑模式变为查看模式【让input消失，显示span】
      row.flag = false;
    },
    //点击编辑，自动获取焦点
    toEdit(row) {
      // 当前查看模式变为编辑模式【让消span失，显示input】
      row.flag = true;
      //自动聚焦
      //获取input节点，实现自动聚焦
      //需要注意：点击span的时候，切换为input变为编辑模式，但是需要注意，对于浏览器而言，页面重绘与重拍耗时间的
      //点击span的时候，重绘重拍一个input它是需要耗费事件，因此我们不可能一点击span立马获取到input
      //$nextTick,当节点渲染完毕了，会执行一次
      this.$nextTick(() => {
        this.$refs.inputTitle.focus();
      });
    },
    //气泡确认框的确认删除回调
    deleteAttrValue(index){
      //当前删除属性值的操作是不需要发请求的
      //你只需要把data里面的数据清空就行
      //为什么说不用发请求呢？因为你点击删除后不需要马上展示数据
      //你是删除完后，点击保存再发请求的，获取数据展示的
      //而点击保存的时候，他是带着data里面的数据去发的请求 既然你已经把对应的属性值全部从data删了，那发完请求后获得的数据，就自然没有对应的数据了
      
      this.attrInfo.attrValueList.splice(index,1)
    },
    //保存按钮，添加属性或修改属性的操作
    async AddOrUpdateAttr(){
      //整理参数:1,如果用户添加很多属性值，且属性值为空的不应该提交给服务器
      //提交给服务器数据当中不应该出现flag字段
      this.attrInfo.attrValueList = this.attrInfo.attrValueList.filter(item=>{
          //过滤掉属性值不是空的
          if(item.valueName!=''){
            //删除掉flag属性
            // delete 操作符用于删除对象的某个属性
            delete item.flag;
            return true;
          }
      })
      try {
         //发请求
        await this.$API.attr.reqAddOrUpdateAttr(this.attrInfo);
        //展示平台属性的信号量进行切换
        this.isShowTable = true;
        //提示消失
        this.$message({type:'success',message:'保存成功'});
        //保存成功以后需要再次获取平台属性进行展示
        this.getAttrList();
      } catch (error) {
        // this.$message('保存失败')
      }

    },
  },
  mounted() {},
};
</script>
<style lang="">
</style>