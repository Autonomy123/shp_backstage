<template>
  <div>
    <el-card>
      <div slot="header">
        <div class="category-header">
          <span>销售额占比</span>
          <el-radio-group v-model="value">
            <el-radio-button label="全部渠道"></el-radio-button>
            <el-radio-button label="线上"></el-radio-button>
            <el-radio-button label="门店"></el-radio-button>
          </el-radio-group>
        </div>
      </div>
      <div>
        <div class="charts" ref="charts"></div>
      </div>
    </el-card>
  </div>
</template>

<script>
import * as echarts from "echarts";
export default {
  data() {
    return {
      value: "全部渠道"
    };
  },
  name: "category",
  mounted() {
    let mychart = echarts.init(this.$refs.charts);
    mychart.setOption({
      title:{
        text:'视频',
        subtext:1048,
        left:'center',
        top:'center'

      },
      tooltip: {
        trigger: "item"
      },
      series: [
        {
          name: "Access From",
          type: "pie",
          radius: ["40%", "70%"],
          avoidLabelOverlap: false,
          itemStyle: {
            borderRadius: 10,
            borderColor: "#fff",
            borderWidth: 2
          },
          label: {
            show: false,
            position :'outside'
          },
          emphasis: {
            label: {
              show: true,
      
              fontWeight: "bold"
            }
          },
          labelLine: {
            show: true
          },
          data: [
            { value: 1048, name: "Search Engine" },
            { value: 735, name: "Direct" },
            { value: 580, name: "Email" },
            { value: 484, name: "Union Ads" },
            { value: 300, name: "Video Ads" }
          ]
        }
      ]
    });
    //给图表绑定事件
    mychart.on('click', (params)=>{
      //获取鼠标点击的那条数据
      const {name,value} = params.data;
      mychart.setOption({
        title:{
          text:name,
          subtext:value
        }
      })
      console.log(params)
    });
  }
};
</script>
<style scoped>
.category-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.charts {
  width: 100%;
  height: 300px;
}
</style>
