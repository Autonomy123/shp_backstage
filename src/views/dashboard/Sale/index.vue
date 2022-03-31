<template>
  <div>
    <el-card class="box-card" style="margin: 10px 0px">
      <div slot="header" class="clearfix">
        <!-- 头部左侧内容 -->
        <el-tabs class="tab" v-model="activeName">
          <el-tab-pane label="销售额" name="sale"></el-tab-pane>
          <el-tab-pane label="访问量" name="visit"></el-tab-pane>
        </el-tabs>
        <!-- 头部右侧内容 -->
        <div class="right">
           <span @click="setDay">今日</span>
          <span @click="setWeek">本周</span>
          <span @click="setMonth">本月</span>
          <span @click="setYear">本年</span>
            <el-date-picker
            class='date'
            size='mini'
            v-model="date"
            type="daterange"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            value-format='yyyy-MM-dd'>
    </el-date-picker>
        </div>
      </div>
      <!-- 内容区域 -->
      <div>
        <el-row :gutter="10">
          <el-col :span="18">
            <!-- echarts的容器  -->
            <div class="charts" ref="charts"></div>
          </el-col>
          <el-col :span="6" class="right">
          <h3>门店{{title}}排名</h3>
          <ul>
            <li>
              <span class="rindex">1</span>
              <span>肯德基</span>
              <span class="rvalue">123456</span>
            </li>
            <li>
              <span class="rindex">2</span>
              <span>肯德基</span>
              <span class="rvalue">123456</span>
            </li>
            <li>
              <span class="rindex">3</span>
              <span>肯德基</span>
              <span class="rvalue">123456</span>
            </li>
            <li>
              <span class="rindex2">4</span>
              <span>肯德基</span>
              <span class="rvalue">123456</span>
            </li>
            <li>
              <span class="rindex2">5</span>
              <span>肯德基</span>
              <span class="rvalue">123456</span>
            </li>
            <li>
              <span class="rindex2">6</span>
              <span>肯德基</span>
              <span class="rvalue">123456</span>
            </li>
            <li>
              <span class="rindex2">7</span>
              <span>肯德基</span>
              <span class="rvalue">123456</span>
            </li>
          </ul>
        </el-col>
        </el-row>
      </div>
    </el-card>
  </div>
</template>

<script>
//引入echarts
import * as echarts from "echarts";
import dayjs from "dayjs";
import { mapState } from "vuex";
export default {
  name: "Sale",
  data() {
    return {
      //默认是销售额
      activeName: "sale",
      mycharts: null,
      //收集日历数据
      date: [],
    };
  },
  mounted() {
    //初始化echarts实例
    this.mycharts = echarts.init(this.$refs.charts);
    //配置数据
    this.mycharts.setOption({
      title: {
        text: "销售额趋势",
      },
      tooltip: {
        trigger: "axis",
        axisPointer: {
          type: "shadow",
        },
      },
      grid: {
        left: "3%",
        right: "4%",
        bottom: "3%",
        containLabel: true,
      },
      xAxis: [
        {
          type: "category",
          data: [],
          axisTick: {
            alignWithLabel: true,
          },
        },
      ],
      yAxis: [
        {
          type: "value",
        },
      ],
      series: [
        {
          name: "Direct",
          type: "bar",
          barWidth: "60%",
          data: [],
          color: "#5470c6",
        },
      ],
    });

    //顶部是mounted：为什么第一次没有数据，因为data没有数据因此不显示
    //解决，在watch监听listState，只要listState改变，也就是只要listState一有值，就能监听到就，给他加上mycharts，立马展示
    //不要疑惑为什么在这里没看见派发的action  我们在他的父组件里面派发了
  },
  computed:{
    //计算标题属性
    title() {
      
      //重新设置配置项
       //图标配置数据可以再次修改，如果有新的数值，新的数值，没有新的数值，还是用以前的
      return this.activeName == "sale" ? "销售额" : "访问量";
    },
    ...mapState({
      listState: (state) => state.home.list,
    }),
  },
  watch:{
    //当title发生变化的时候 也就是当你切换tab栏的时候
     title(){
       this.mycharts.setOption({
         title: {//修改bar柱状图的标题
          text: this.title,
        },
         xAxis: {
          data:
            this.title == "销售额" //判断是否切换到销售额的图表 是的话x轴用orderFullYearAxis数据 否则用userFullYearAxis
              ? this.listState.orderFullYearAxis
              : this.listState.userFullYearAxis,
        },
         series: [
        {
          name: "Direct",
          type: "bar",
          barWidth: "60%",
          data:
              this.title == "销售额"
                ? this.listState.orderFullYear//判断是否切换到销售额的图表 是的话y轴用orderFullYear数据 否则用userFullYear
                : this.listState.userFullYear,
          color: "#5470c6",
        },
         ],
       })
     },
     //第一次初始化的时候，展示图表
     listState(){
     this.mycharts.setOption({
      title: {
        text: this.title + "趋势",
      },
      tooltip: {
        trigger: "axis",
        axisPointer: {
          type: "shadow",
        },
      },
      grid: {
        left: "3%",
        right: "4%",
        bottom: "3%",
        containLabel: true,
      },
      xAxis: [
        {
          type: "category",
          data: this.listState.orderFullYearAxis,
          axisTick: {
            alignWithLabel: true,
          },
        },
      ],
      yAxis: [
        {
          type: "value",
        },
      ],
      series: [
        {
          name: "Direct",
          type: "bar",
          barWidth: "60%",
          data: this.listState.orderFullYear,
          color: "yellowgreen",
        },
      ],
    });

    }
    
  },
  methods: {
    //本日
    setDay(){
      const day = dayjs().format("YYYY-MM-DD");//format是编码日期格式
      this.date =[day,day]
    },
    //本周
    setWeek() {
      const start = dayjs().day(1).format("YYYY-MM-DD");
      const end = dayjs().day(7).format("YYYY-MM-DD");
      this.date = [start, end];
    },
    //本月
    setMonth() {
      const start = dayjs().startOf("month").format("YYYY-MM-DD");
      const end = dayjs().endOf("month").format("YYYY-MM-DD");
      this.date = [start, end];
    },
     //本年
    setYear() {
      const start = dayjs().startOf("year").format("YYYY-MM-DD");
      const end = dayjs().endOf("year").format("YYYY-MM-DD");
      this.date = [start, end];
    },
  },
};
</script>

<style scoped>
.el-card >>> .el-card__header {
  border-bottom: none;
}
.clearfix {
  display: flex;
  position: relative;
  justify-content: space-between;
}
.tab {
  width: 100%;
}
.date {
  width: 250px;
  margin: 0 20px;
}
.right {
  position: absolute;
  right: 0px;
}
.right span {
  margin: 0 10px;
  cursor:pointer
}
.charts {
  width: 100%;
  height: 300px; 
}
 ul{
  list-style: none;
  width: 100%;
  height: 300px;
  padding: 0px;
}
ul li{
  height:8%;
  margin:10px 0px;
}
 .rindex{
    display: block;
    background-color: black;
    border-radius: 50%;
    width: 20px;
    height: 20px;
    color: white;
    text-align: center;
    float: left;
}
 .rindex2{
    display: block;
    border-radius: 50%;
    width: 20px;
    height: 20px;
    text-align: center;
    float: left;
}
.rvalue {
  float: right;
}


</style>