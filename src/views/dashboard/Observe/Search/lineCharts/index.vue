<template>
  <div>
      <div class="header">
        <span class="search-header">搜索用户数</span>
      <svg t="1637478175000" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="2179" width="26" height="26"><path d="M536 480v192a16 16 0 0 1-16 16h-16a16 16 0 0 1-16-16V480a16 16 0 0 1 16-16h16a16 16 0 0 1 16 16z m-32-128h16a16 16 0 0 1 16 16v32a16 16 0 0 1-16 16h-16a16 16 0 0 1-16-16v-32a16 16 0 0 1 16-16z m8 448c159.056 0 288-128.944 288-288s-128.944-288-288-288-288 128.944-288 288 128.944 288 288 288z m0 48c-185.568 0-336-150.432-336-336s150.432-336 336-336 336 150.432 336 336-150.432 336-336 336z" p-id="2180" fill="#8a8a8a"></path></svg>
     
      </div>
      <div class="main">
        <span class="main-title">12321</span>
        <span class="main-content">17.1</span>
         <svg t="1648191037131" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="4413" width="16" height="16"><path d="M325.456471 862.280661" p-id="4414"></path><path d="M882.057788 862.280661" p-id="4415"></path><path d="M236.028491 877.160382" p-id="4416"></path><path d="M960.132455 877.160382" p-id="4417"></path><path d="M63.683483 788.736998" p-id="4418"></path><path d="M958.469023 788.736998" p-id="4419"></path><path d="M64.77753 858.792098" p-id="4420"></path><path d="M861.417121 738.727375c41.604731 0 65.233383-54.963795 34.928639-85.258218L547.071415 304.191372c-20.029996-20.031716-49.822121-20.031716-69.853837 0L127.955275 653.469157c-31.085714 31.073673-5.136514 85.258218 35.441258 85.258218L861.417121 738.727375 861.417121 738.727375z" p-id="4421" data-spm-anchor-id="a313x.7781069.0.i5" class="selected" fill="#1afa29"></path><path d="M959.523505 858.792098" p-id="4422"></path></svg>
          <svg t="1648191059110" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="5316" width="16" height="16"><path d="M325.456471 862.280661" p-id="5317"></path><path d="M882.057788 862.280661" p-id="5318"></path><path d="M236.028491 877.160382" p-id="5319"></path><path d="M960.132455 877.160382" p-id="5320"></path><path d="M63.683483 788.736998" p-id="5321"></path><path d="M958.469023 788.736998" p-id="5322"></path><path d="M64.77753 858.792098" p-id="5323"></path><path d="M163.396533 289.168875c-40.577772 0-66.525252 54.184545-35.441258 85.258218L477.217578 723.704878c20.031716 20.031716 49.823841 20.031716 69.853837 0l349.274345-349.277785c30.304744-30.294423 6.677812-85.258218-34.928639-85.258218L163.396533 289.168875 163.396533 289.168875z" p-id="5324" data-spm-anchor-id="a313x.7781069.0.i10" class="selected" fill="#d81e06"></path><path d="M959.523505 858.792098" p-id="5325"></path></svg>
      </div>
      <div class="footer">
        <div class="charts" ref="charts"></div>
        
      </div>
  </div>
</template>

<script>
import *as echarts from "echarts";
export default {
  name:'',
   mounted() {
    //初始化echarts实例
    let lineCharts = echarts.init(this.$refs.charts);
    //配置数据
    lineCharts.setOption({
      xAxis: {
        //隐藏x轴
        show: false,
        type: "category",
      },
      yAxis: {
        //隐藏y轴
        show: false,
      },
      //系列
      series: [
        {
          type: "line",
          data: [10, 7, 33, 12, 48, 9,29,10,44],
          //拐点的样式的设置
          itemStyle: {
            opacity: 0,
          },
          //线条的样式
          lineStyle: {
            color: "blue",
          },
          //填充颜色设置
          areaStyle: {
            color: {
              type: "linear",
              x: 0,
              y: 0,
              x2: 0,
              y2: 1,
              colorStops: [
                {
                  offset: 0,
                  color: "blue", // 0% 处的颜色
                },
                {
                  offset: 1,
                  color: "#fff", // 100% 处的颜色
                },
              ],
              global: false, // 缺省为 false
            },
          },
        },
      ],
      //布局调试
      grid: {
        left: 0,
        top: 0,
        right: 0,
        bottom: 0,
      },
    });
  },
}
</script>

<style scoped>
.header{
    display:flex;
    align-items: center
  }
.search-header{
  margin-right: 20px;
}
.mian{
  margin: 10px 0px
}
.main-title{
  margin-right: 30px
}
.main-content{
  margin-right: 20px
}
.charts{
  width: 100%;
  height:50px ;
}
</style>