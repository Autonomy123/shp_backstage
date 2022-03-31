<template>
    <div>
        <el-row :gutter="10">
            <el-col :span="6">
                <el-card>
                <!-- 第一个card -->
                    <Detail  title='总销售额' count="¥ 126560">
                        <template slot="charts">
                            <span>
                                周同比&nbsp;&nbsp;56.67%&nbsp;
                                <svg t="1648191037131" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="4413" width="16" height="16"><path d="M325.456471 862.280661" p-id="4414"></path><path d="M882.057788 862.280661" p-id="4415"></path><path d="M236.028491 877.160382" p-id="4416"></path><path d="M960.132455 877.160382" p-id="4417"></path><path d="M63.683483 788.736998" p-id="4418"></path><path d="M958.469023 788.736998" p-id="4419"></path><path d="M64.77753 858.792098" p-id="4420"></path><path d="M861.417121 738.727375c41.604731 0 65.233383-54.963795 34.928639-85.258218L547.071415 304.191372c-20.029996-20.031716-49.822121-20.031716-69.853837 0L127.955275 653.469157c-31.085714 31.073673-5.136514 85.258218 35.441258 85.258218L861.417121 738.727375 861.417121 738.727375z" p-id="4421" data-spm-anchor-id="a313x.7781069.0.i5" class="selected" fill="#1afa29"></path><path d="M959.523505 858.792098" p-id="4422"></path></svg>
                              </span>
                              <span>
                                  &nbsp;日同比 &nbsp; &nbsp;56.67%&nbsp;
                                  <svg t="1648191059110" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="5316" width="16" height="16"><path d="M325.456471 862.280661" p-id="5317"></path><path d="M882.057788 862.280661" p-id="5318"></path><path d="M236.028491 877.160382" p-id="5319"></path><path d="M960.132455 877.160382" p-id="5320"></path><path d="M63.683483 788.736998" p-id="5321"></path><path d="M958.469023 788.736998" p-id="5322"></path><path d="M64.77753 858.792098" p-id="5323"></path><path d="M163.396533 289.168875c-40.577772 0-66.525252 54.184545-35.441258 85.258218L477.217578 723.704878c20.031716 20.031716 49.823841 20.031716 69.853837 0l349.274345-349.277785c30.304744-30.294423 6.677812-85.258218-34.928639-85.258218L163.396533 289.168875 163.396533 289.168875z" p-id="5324" data-spm-anchor-id="a313x.7781069.0.i10" class="selected" fill="#d81e06"></path><path d="M959.523505 858.792098" p-id="5325"></path></svg>
                              </span>
                        </template>
                        <template slot="footer">
                           <span>日销售额￥12423</span>
                        </template>
                    </Detail>
                </el-card>
            </el-col>
             <el-col :span="6">
                 <el-card>
                  <!-- 第二个card -->
                    <Detail title='访问量' count="88460">
                        <template slot="charts">
                            <lineCharts></lineCharts>
                        </template>
                        <template slot="footer">
                           <span>日访问量12423</span>
                        </template>
                    </Detail>
                </el-card>
             </el-col>
              <el-col :span="6">
                  <el-card>
                   <!-- 第三个card -->
                    <Detail title='支付笔数' count="88460">
                        <template slot="charts">
                            <barCharts></barCharts>
                        </template>
                        <template slot="footer">
                           <span>转化率65%</span>
                        </template>
                    </Detail>
                </el-card>
              </el-col>
               <el-col :span="6">
                   <el-card>
                    <!-- 第四个card -->
                    <Detail title='运营活动效果' count="78%">
                        <template slot="charts">
                            <progressCharts></progressCharts>
                        </template>
                        <template slot="footer">
                            <span>
                                周同比&nbsp;&nbsp;56.67%&nbsp;
                                <svg t="1648191037131" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="4413" width="16" height="16"><path d="M325.456471 862.280661" p-id="4414"></path><path d="M882.057788 862.280661" p-id="4415"></path><path d="M236.028491 877.160382" p-id="4416"></path><path d="M960.132455 877.160382" p-id="4417"></path><path d="M63.683483 788.736998" p-id="4418"></path><path d="M958.469023 788.736998" p-id="4419"></path><path d="M64.77753 858.792098" p-id="4420"></path><path d="M861.417121 738.727375c41.604731 0 65.233383-54.963795 34.928639-85.258218L547.071415 304.191372c-20.029996-20.031716-49.822121-20.031716-69.853837 0L127.955275 653.469157c-31.085714 31.073673-5.136514 85.258218 35.441258 85.258218L861.417121 738.727375 861.417121 738.727375z" p-id="4421" data-spm-anchor-id="a313x.7781069.0.i5" class="selected" fill="#1afa29"></path><path d="M959.523505 858.792098" p-id="4422"></path></svg>
                              </span>
                              <span>
                                  &nbsp;日同比 &nbsp; &nbsp;56.67%&nbsp;
                                  <svg t="1648191059110" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="5316" width="16" height="16"><path d="M325.456471 862.280661" p-id="5317"></path><path d="M882.057788 862.280661" p-id="5318"></path><path d="M236.028491 877.160382" p-id="5319"></path><path d="M960.132455 877.160382" p-id="5320"></path><path d="M63.683483 788.736998" p-id="5321"></path><path d="M958.469023 788.736998" p-id="5322"></path><path d="M64.77753 858.792098" p-id="5323"></path><path d="M163.396533 289.168875c-40.577772 0-66.525252 54.184545-35.441258 85.258218L477.217578 723.704878c20.031716 20.031716 49.823841 20.031716 69.853837 0l349.274345-349.277785c30.304744-30.294423 6.677812-85.258218-34.928639-85.258218L163.396533 289.168875 163.396533 289.168875z" p-id="5324" data-spm-anchor-id="a313x.7781069.0.i10" class="selected" fill="#d81e06"></path><path d="M959.523505 858.792098" p-id="5325"></path></svg>
                              </span>
                        </template>
                    </Detail>
                </el-card>
               </el-col>
        </el-row>
        

    </div>
</template>

<script>
import Detail from "./Detail";
//引入lineChart组件
import lineCharts from './lineChart';
import barCharts from './barCharts';
import progressCharts from './progressCharts'
export default {
    name:'',
    components:{
        Detail,
        lineCharts,
        barCharts,
        progressCharts
        
    }
}
</script>

<style>

</style>