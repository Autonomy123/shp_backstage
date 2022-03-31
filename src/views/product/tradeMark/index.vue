<template>
  <div>
    <!-- 按钮 -->
    <el-button
      type="primary"
      icon="el-icon-plus"
      style="magin: 10px 0px"
      @click="showDialog"
      >添加</el-button
    >
    <!-- 表格 
            :data是表格组件将来需要展示的数据----数组类型
            border是给表格添加边框
                column属性
                label：显示标题
                width：对应列的宽度
                align：标题的对齐方式
                prop:对应列内容的字段名
                type:显示索引
            注意：elmentUI当中的table组件，展示的数据是以一列一列进行展示数据
        -->
    <el-table style="width: 100%" border :data="list">
      <el-table-column label="序号" width="80px" align="center" type="index">
      </el-table-column>
      <el-table-column
        prop="tmName"
        label="品牌的名称"
        width="width"
        align="center"
      >
      </el-table-column>
      <el-table-column
        prop="logoUrl"
        label="品牌LOGO"
        width="width"
        align="center"
      >
        <!-- row 就是对应这一行品牌的信息 怎么来的呢？首先你得在element-ui里面的
        el-table 用作用域插槽
        他会把所有列中每一行的数据一个个的回传，
        所以row就是回传的那一列数据  不用考虑太多，知道他是每一行对应的数据就行 在这里也就是每一行对象的品牌信息数据-->
        <template slot-scope="{ row, $index }">
          <img :src="row.logoUrl" style="width: 100px; height: 100px" />
        </template>
      </el-table-column>
      <el-table-column prop="prop" label="操作" width="width">
        <template slot-scope="{ row, $index }">
          <el-button
            type="warning"
            icon="el-icon-edit"
            size="mini"
            @click="updateTradeMark(row)"
            >修改</el-button
          >
          <el-button
            type="danger"
            icon="el-icon-delete"
            size="mini"
            @click="deleteTradeMark(row)"
            >删除</el-button
          >
        </template>
      </el-table-column>
    </el-table>

    <!--  分页器 
      当前第几页、数据总条数、每一页展示条数、连续页码数
      current-page:代表的是当前第几页
      total：代表分页器一共需要展示数据条数
      page-size：代表的是每一页需要展示多少条数据
      page-sizes：代表可以设置每一页展示多少条数据
      layout：可以实现分页器布局 怎么布局取决于你的顺序
      pager-count:按钮的数量  如果 9  连续页码是7
         -->
    <el-pagination
      style="margin-top: 20px; text-align: center"
      :current-page="page"
      :page-sizes="[3, 5, 10]"
      :page-count="7"
      :page-size="limit"
      layout="prev, pager, next, jumper,->,sizes,total"
      :total="total"
      @current-change="getPageList"
      @size-change="handleSizeChange"
    >
    </el-pagination>

    <!--
      对话框
      :visible.sync:控制对话框显示与隐藏用的
      Form 组件提供了表单验证的功能，只需要通过 rules 属性传入约定的验证规则，并将 Form-Item 的 prop 属性设置为需校验的字段名即可 
    -->
    <el-dialog
      :title="tmForm.id ? '修改品牌' : '添加品牌'"
      :visible.sync="dialogFormVisible"
    >
      <!-- form表单 
      :model属性，这个属性的作用是,把表单的数据收集到那个对象的身上 ，将来表单验证，也需要这个属性-->
      <el-form style="width: 80%" :model="tmForm" :rules="rules" ref="ruleForm">
        <el-form-item label="品牌名称" label-width="100px" prop="tmName"
          ><!--prop="tmName"在这的意思是需要验证的字段是tmName-->
          <el-input autocomplete="off" v-model="tmForm.tmName"></el-input>
        </el-form-item>
        <el-form-item label="品牌LOGO" label-width="100px" prop="logoUrl"
          ><!--prop="tmName"需要验证的字段是logoUrl-->
          <!-- 图片上传 
           这里收集数据：不能使用v-model，因为不是表单元素
            action:设置图片上传的地址
            :on-success:可以检测到图片上传成功，当图片上传成功，会执行一次
            :before-upload：可以在上传图片之前，会执行一次
            -->
          <el-upload
            class="avatar-uploader"
            action="/dev-api/admin/product/fileUpload"
            :show-file-list="false"
            :on-success="handleAvatarSuccess"
            :before-upload="beforeAvatarUpload"
          >
            <img v-if="tmForm.logoUrl" :src="tmForm.logoUrl" class="avatar" />
            
            <i v-else class="el-icon-plus avatar-uploader-icon"></i>
            <div slot="tip" class="el-upload__tip">
              只能上传jpg/png文件，且不超过500kb
            </div>
          </el-upload>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="AddOrUpdateTradeMark"
          >确 定</el-button
        >
      </div>
    </el-dialog>
  </div>
</template>
<script>
export default {
  name: "tradeMark",
  data() {
    return {
      page: 1, //代表分页器第几页
      limit: 3, //代表页数展示数据条数
      //接收返回来的数据
      total: 0, //总共数据条数
      list: [], //列表每一页展示的数据
      dialogFormVisible: false, //默认不显示对话框
      //收集品牌信息:对象身上的属性，不能瞎写，需要看文档的
      tmForm: {
        tmName: "",
        logoUrl: "",
      },
      //表单验证的规则
      rules: {
        //品牌名称的验证规则
        //require:必须要校验字段（前面五角星有关系）  message 提示信息    trigger:用户行为设置（事件的设置:blur(失焦)、change(变化)）
        tmName: [
          //品牌名称的校验规则
          { required: true, message: "请输入品牌名称", trigger: "blur" },
          {
            min: 2,
            max: 10,
            message: "长度在 2 到 10个字符",
            trigger: "change",
          },
        ],
        logoUrl: [
          //品牌logo的校验规则
          { required: true, message: "请选择品牌logo" },
        ],
      },
    };
  },
  //组件挂载完毕就该发请求了
  mounted() {
    this.getPageList();
  },
  methods: {
    //获取品牌列表
    async getPageList(pager = 1) {
      //pager = 1代表  没有传参的话pager=1  传了参pager就等于传的那个参数
      this.page = pager;
      const { page, limit } = this;
      let result = await this.$API.trademark.reqTradeMarkList(page, limit);
      if (result.code == 200) {
        //分别是展示数据总条数与列表展示的数据
        this.total = result.data.total;
        this.list = result.data.records;
      }
    },
    //当分页器某一页需要展示数据条数发生变化的时候会触发
    handleSizeChange(limit) {
      //整理参数
      this.limit = limit;
      this.getPageList();
    },
    //点击添加按钮
    showDialog() {
      //显示对话框
      this.dialogFormVisible = true;
      
      //清除数据 (至于为什么要清除数据，原本你点击添加品牌，对话框内是没有数据的，如果你在点击品牌之前，点击修改品牌，那么就会把修改品牌的数据
      //存储到data，你下次再点击添加品牌就会直接展示你上一个修改品牌的信息)
      this.tmForm = { tmName: "", logoUrl: "" };
    },
    //点击修改按钮
    updateTradeMark(row) {
      //显示对话框
      this.dialogFormVisible = true;
      // row就是当前用户选中的品牌信息 他那个row呢 是通过作用域插槽
      //将已有的品牌信息直接赋值给tmForm进行展示
      //也就是tmForm存储即为服务器返回的品牌信息
      // const {id,tmName,logoUrl}=row;
      // console.log(id,tmName,logoUrl)
      //  this.tmForm=row  //这样写会涉及到 你修改的值直接展示在表格上
      this.tmForm = { ...row }; //{...row }涉及到了浅拷贝，当我觉得要用深拷贝  看不太懂，工作中遇到了直接用
      //this.tmForm={...row}  this.tmForm=row 去修改产品那里试一下这两个有什么区别
    },
    //点击删除按钮
    deleteTradeMark(row) {
      //弹框
      this.$confirm(`你确定删除${row.tmName}?`, "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "waring",
      })
        .then(async () => {
          //当用户点击确定按钮的时候触发
          let result = await this.$API.trademark.reqDeleteTradeMark(row.id);
          if (result.code == 200) {
            this.$message({
              type: "success",
              message: "删除成功",
            });
            //再次获取品牌列表数据
            this.getPageList(this.list.length > 1 ? this.page : this.page - 1); //list是每一个页展示的数据
            //如果当前页数品牌数=1  那么你点击删除之后应该要回到上一页 如果>1就留在当前页面
            //什么意思呢 就是说：如果第一页有3条数据 刚好你要删除的是第二页的第1条数据 那么你删完之后是不是要回到第一页 如果说第二页数据>1就可以留在当前页
          }
        })
        .catch(() => {
          //当用户点击取消按钮的时候触发
          this.$message({
            type: "info",
            message: "取消删除",
          });
        });
    },
    //图片上传成功
    handleAvatarSuccess(res, file) {
      //res：上传成功之后返回前端数据
      //file:上传成功之后服务器返回前端数据
      //收集品牌图片数据，因为将来需要带给服务器
      this.tmForm.logoUrl = res.data; //res.data就是上传成功后 会把你本地图片变为在线的url
      console.log(res, file);
    },
    //图片上传之前
    beforeAvatarUpload(file) {
      const isJPG = file.type === "image/jpeg";
      const isLt2M = file.size / 1024 / 1024 < 2;

      if (!isJPG) {
        this.$message.error("上传头像图片只能是 JPG 格式!");
      }
      if (!isLt2M) {
        this.$message.error("上传头像图片大小不能超过 2MB!");
      }
      return isJPG && isLt2M;
    },
    //确定按钮（确定添加品牌|确定修改品牌）
    AddOrUpdateTradeMark() {
      //当表单的全部字段符合条件后
      this.$refs.ruleForm.validate(async (success) => {
        if (success) {
          //关闭对话框
          this.dialogFormVisible = false;
          let result = await this.$API.trademark.reqAddOrUpdateTradeMark(
            this.tmForm
          );
          if (result.code == 200) {
            //成功弹出一个信息 有可能是修改成功，有可能是添加成功
            // 根据id来判断 有id是修改 没有id是添加（至于后面到这很懵逼的话就去看api下的tradeMark接口）
            this.$message({
              type: "success",
              message: this.tmForm.id ? "修改成功" : "添加成功",
            }); //this.$message也是element-ui的一个  弹出框的方法
            //添加或者修改品牌成功以后，需要再次获取品牌列表进行展示
            //如果添加品牌： 停留在第一页，修改品牌应该留在当前页面
            this.getPageList(this.tmForm.id ? this.page : 1); //(有id是修改，没有id是添加)
          }
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },
  },
};
</script>
<style>
.avatar-uploader .el-upload {
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
}
.avatar-uploader .el-upload:hover {
  border-color: #409eff;
}
.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 178px;
  height: 178px;
  line-height: 178px;
  text-align: center;
}
.avatar {
  width: 178px;
  height: 178px;
  display: block;
}
</style>
 