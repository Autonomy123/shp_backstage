<template>
  <div>
    <el-card>
      <div slot="header">
        <div class="search-header">
          <span>线上热门搜索</span>
          <el-dropdown>
            <span class="el-dropdown-link">
              <i class="el-icon-more"></i>
            </span>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item>黄金糕</el-dropdown-item>
              <el-dropdown-item>狮子头</el-dropdown-item>
              <el-dropdown-item>螺蛳粉</el-dropdown-item>
              <el-dropdown-item >双皮奶</el-dropdown-item>
              <el-dropdown-item >蚵仔煎</el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
        </div>
      </div>
      <div>
        <el-row :gutter="10">
          <el-col :span="12">
            <LineCharts></LineCharts>
          </el-col>
          <el-col :span="12">
            <LineCharts></LineCharts>
          </el-col>
        </el-row>
        <!-- table表格 -->
        <el-table style="width: 100%" border >
          <el-table-column prop="date" label="排名" width="80" type="index" align="center">
          </el-table-column>
          <el-table-column prop="name" label="搜索关键字"  width="180">
          </el-table-column>
          <el-table-column prop="address"  label="用户数"  sortable >
          </el-table-column>
          <el-table-column prop="address"  label="周涨幅"   sortable>
          </el-table-column>
       </el-table>
       <!-- 分页器 -->
       <el-pagination
        class='pagination'
         layout="prev, pager, next"
         :total="1000">
       </el-pagination>
      </div>
    </el-card>
  </div>
</template>

<script>
import LineCharts from "./lineCharts";
export default {
  name: "search",
  components: {
    LineCharts,
  },
};
</script>
<style scoped>
.search-header {
  display: flex;
  justify-content: space-between;
}
.search-header i {
  cursor: pointer;
}
.pagination{
  float:right
}
</style>
