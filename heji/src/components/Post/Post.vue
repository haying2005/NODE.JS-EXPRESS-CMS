<template>
    <div v-loading.body="loading">
        <el-form :inline="true" class="demo-form-inline">
            <el-form-item label="标题">
                <el-input placeholder="标题" v-model="queryForm.title"></el-input>
            </el-form-item>
            <el-form-item label="标签">
                <el-input placeholder="标签" v-model="queryForm.tags"></el-input>
            </el-form-item>
            <el-form-item label="类目">
                <el-cascader change-on-select :show-all-levels="true" :options="categoryOpts" v-model="queryForm.categorys">
                </el-cascader>
            </el-form-item>
            <el-form-item label="语言">
                <el-select placeholder="选择语言" v-model="queryForm.lang">
                    <el-option label="不限" :value="undefined"></el-option>
                    <el-option v-for="item in langOpts" :key="item.key" :label="item.CN_String" :value="item.key">
                    </el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="是否发布">
                <el-select placeholder="是否发布" v-model="queryForm.publish">
                    <el-option label="不限" :value="undefined"></el-option>
                    <el-option label="已发布" :value="true"></el-option>
                    <el-option label="未发布" :value="false"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="是否推荐">
                <el-select placeholder="是否推荐" v-model="queryForm.recommend">
                    <el-option label="不限" :value="undefined"></el-option>
                    <el-option label="推荐" :value="true"></el-option>
                    <el-option label="未推荐" :value="false"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item>
                <el-button type="primary" @click="handleQuery">查询</el-button>
            </el-form-item>
        </el-form>
        <div style="margin-bottom: 20px">
            <el-button @click="toAddPost" type="primary"><i class="el-icon-plus"></i> 写文章</el-button>
            <el-button @click="deleteSelection" type="danger"><i class="el-icon-delete"></i> 批量删除</el-button>
        </div>
        <el-table :data="posts" @selection-change="handleSelectionChange" style="width: 100%">
            <el-table-column type="selection" width="55">
            </el-table-column>
            <el-table-column fixed prop="title" label="标题" width="180">
            </el-table-column>
            <el-table-column prop="_id" label="ID" width="180">
            </el-table-column>

            <el-table-column label="类目" width="180">
                <template scope="scope">
                    {{getCategoryName(scope.row.category)}}
                </template>
            </el-table-column>
            <el-table-column prop="author" label="作者">
            </el-table-column>
            <el-table-column prop="by" label="添加者" width="180">
            </el-table-column>
            <el-table-column prop="lang" label="语言" width="180">
            </el-table-column>
            <el-table-column prop="publish" label="是否发布" width="180">
                <template scope="scope">
                    {{scope.row.publish ? '已发布' : '未发布'}}
                </template>
            </el-table-column>
            <el-table-column label="是否推荐" width="180">
                <template scope="scope">
                    {{scope.row.recommend ? '推荐' : '未推荐'}}
                </template>
            </el-table-column>

            <el-table-column prop="priority" label="优先级" width="180">
            </el-table-column>
            <el-table-column prop="click" label="点击次数" width="180">
            </el-table-column>
            <el-table-column label="标签" width="180">
                <template scope="scope">
                    <el-tag style="margin-right:10px" :key="tag" v-for="tag in scope.row.tags.split(',').filter(val=>val!='')">
                        {{tag}}
                    </el-tag>
                </template>
            </el-table-column>
            <el-table-column fixed="right" label="操作" width="180">
                <template scope="scope">
                    <el-button size='small' @click="onEditHandle(scope.row)"><i class="el-icon-edit"></i></el-button>
                    <el-button size='small' @click="deleteOne(scope.row._id)" type='danger'><i class="el-icon-delete"></i></el-button>
                </template>
            </el-table-column>
        </el-table>
        <br>
        <el-pagination ref="pager" @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page.sync="currentPage"
            :page-sizes="[10, 20, 30, 40]" :page-size="pageSize" layout="total, sizes, prev, pager, next, jumper" :total="total">
        </el-pagination>
    </div>
</template>
<script>
    export default {
        created() {

        },
        computed: {
            categoryOpts() {
                //console.log('-------->compute categoryOpts.')
                let array = [];
                let c = this.bus.getCategoryById(this.categoryId);
                if (c) {
                    array.push(c);
                }
                return array
            }
        },
        beforeRouteUpdate(to, from, next) {
            if (to.params.categoryId) {
                this.categoryId = to.params.categoryId;
            }
            next();
        },
        watch: {
            categoryId(val) {
                this.total = 0;
                this.queryForm.categorys = val ? [val] : [];
                this.fetchList();
            }
        },
        mounted() {
            //console.log('pager: ', this.$refs.pager.pageSize);
            if (this.$route.params.categoryId) {
                this.categoryId = this.$route.params.categoryId;
            }
            this.bus.fetchAllCategorys()
                .then(this.fetchList());

        },
        data() {
            return {
                loading: false,

                bus: this.$bus,
                categoryId: undefined,
                posts: [],

                currentPage: 1,
                pageSize: 10,
                total: 0,

                langOpts: this.$bus.langs,
                queryForm: {
                    title: '',
                    categorys: [],
                    lang: undefined,
                    recommend: undefined,
                    publish: undefined,
                },

                //选中的行
                multipleSelection: []
            }
        },
        methods: {
            toAddPost() {
                this.$router.push({ path: '/post/add' });
            },
            handleQuery() {
                this.queryForm.page = this.currentPage - 1;
                this.queryForm.pageSize = this.pageSize;
                if (this.queryForm.categorys.length) {
                    this.queryForm.category = this.queryForm.categorys[this.queryForm.categorys.length - 1];
                }
                this.$http.post('/post/query', this.queryForm)
                    .then(res => {

                        if (res.body.code == 0) {
                            //console.log(res.body.data);
                            this.posts = res.body.data.list;
                            this.total = res.body.data.total;
                        }
                        else {
                            this.$message.error(res.body.description);
                        }
                    })
                    .catch(err => this.$message.error(err.message));
            },
            getCategoryName(id) {
                let c = this.$bus.getCategoryById(id);
                if (c) {
                    return c.name;
                }
                else
                    return '';

            },
            fetchPost(page, size, categoryId) {
                //let needTotal = this.total > 0 ? 0 : 1;
                let needTotal = 1;
                this.loading = true;
                this.$http.get('/post/list', { params: { page: page, pageSize: size, categoryId: categoryId, total: needTotal } })
                    .then(res => {
                        let obj = res.body;
                        if (obj.code == 0) {
                            // console.log('获取文章列表成功.');
                            //console.log(obj);
                            this.posts = obj.data.list;
                            this.total = obj.data.total;
                        }
                        else {
                            this.$message.error(obj.description);
                        }
                    })
                    .catch(err => {
                        this.$message.error(err.message);
                    })
                    .finally(_ => {
                        this.loading = false;
                    })
            },

            handleSelectionChange(val) {
                this.multipleSelection = val;
            },

            //删除选中
            deleteSelection() {
                this._doDelete(this.multipleSelection.map(item => item._id));
            },
            //单个删除
            deleteOne(id) {
                this._doDelete([id]);
            },
            //删除
            _doDelete(ids) {
                //this.$message.success(JSON.stringify(ids));
                this.$confirm('此操作将永久删除文章, 是否继续?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                })
                    .catch(err => {
                        throw new Error('操作取消.')    //catch方法必须抛出错误，否则后面的then会执行.
                    }) 
                    .then(o => {
                        if(!ids.length) {
                            throw new Error('请选择要删除的文章.');
                        }
                        else
                            return o;
                    })
                    .then(o => this.$http.post('/post/delete', { ids: ids }))
                    .then(ids => this.$message.success('删除成功.'))
                    .then(o => this.fetchList()) //刷新列表
                    .catch(err => this.$message.error(err.message))
            },


            fetchList() {
                //this.fetchPost(this.currentPage - 1, this.pageSize, this.categoryId);
                this.handleQuery();
            },

            handleSizeChange(val) {
                //console.log(`每页 ${val} 条`);
                this.pageSize = val;
                this.fetchList();
            },
            handleCurrentChange(val) {
                //console.log(`当前页: ${val}`);
                this.fetchList();
            },

            onEditHandle(post) {
                //console.log(post);
                this.$router.push('/post/edit/' + post._id);
            }


        }
    }

</script>