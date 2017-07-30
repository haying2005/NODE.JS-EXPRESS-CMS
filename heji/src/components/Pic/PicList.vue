<template>
    <div id="list">
        <el-row :gutter="20">
            <el-col style="margin-bottom:20px" :span="6" v-for="(item,index) in pics" :key="item._id">
                <el-card :body-style="{ padding: '0px', }">
                    <!--<div class="divImg" >
                    </div>-->
                    <img :src="item.bucketHost + item.key" :alt="item.fname" class="image">
                </el-card>
            </el-col>
        </el-row>
        <br>
        <el-pagination ref="pager" 
            @size-change="handleSizeChange" 
            @current-change="handleCurrentChange" 
            :current-page.sync="currentPage" 
            :page-sizes="[10, 20, 30, 40]"
            :page-size="pageSize"
            layout="total, sizes, prev, pager, next, jumper" 
            :total="total">
        </el-pagination>
    </div>
</template>

<script>
    export default {
        data() {
            return {
                pics: [],

                currentPage: 1,
                pageSize: 10,
                total: 0,
            }
        },
        mounted() {
            this.fetchList();
        },
        methods: {
            fetchPics(page, size, album) {
                let needTotal = this.total > 0 ? 0 : 1;
                this.$http.get('/qiniu/piclist', { params: { page: page, pageSize: size, total: needTotal } })
                    .then(res => {
                        let obj = res.body;
                        if (obj.code == 0) {
                            console.log(res.body);
                            this.pics = obj.data.list;
                            this.total = obj.data.total || this.total;
                        }
                        else {
                            this.$message.error(res.description);
                        }

                    })
                    .catch(err => {
                        this.$message.error(err.message);
                    });
            },

            fetchList() {
                this.fetchPics(this.currentPage - 1, this.pageSize);
            },

            handleSizeChange(val) {
                //console.log(`每页 ${val} 条`);
                this.pageSize = val;
                this.fetchList();
            },
            handleCurrentChange(val) {
                //console.log(`当前页: ${val}`);
                this.fetchList();
            }
        }
    }

</script>

<style scoped>
    .time {
        font-size: 13px;
        color: #999;
    }

    .bottom {
        margin-top: 13px;
        line-height: 12px;
    }

    .button {
        padding: 0;
        float: right;
    }

    .image {
        width: 100%;
        display: block;
    }
    .divImg {
        background-color:blue; 
        height:200px;

    }

    .clearfix:before,
    .clearfix:after {
        display: table;
        content: "";
    }

    .clearfix:after {
        clear: both
    }
</style>