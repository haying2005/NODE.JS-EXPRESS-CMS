<template>
    <div>
        <div>
            <el-button @click="newCategory" type="primary"><i class="el-icon-plus"></i> 新增</el-button>
        </div>
        <br>
        <div>
            <el-tree :data="bus.categorys" :props="defaultProps" node-key="_id" default-expand-all :expand-on-click-node="false" @node-click="handleClick"
                :render-content="renderContent">
            </el-tree>
        </div>
        <div>
            <el-dialog :title="dialogTitle" :visible.sync="isDialogShow">
                <add-category :handleType="currentHandle" :father="currentClick" ref="addCategory" @save="handleSave()"></add-category>
            </el-dialog>
        </div>
    </div>

</template>

<script>
    import addCategory from './Dialog/AddCategory.vue'
    export default {
        components: {
            addCategory: addCategory,
        },
        data() {
            return {
                isDialogShow: false,
                currentClick: undefined,
                currentHandle: '',
                //categorys: [],
                bus: this.$bus,
                defaultProps: {
                    children: 'children',
                    label: 'name'
                },
            }
        },
        computed: {
            dialogTitle() {
                if (this.currentHandle == 'addChild') {
                    return '新增类目';
                }
                else if (this.currentHandle = 'edit') {
                    return '编辑类目';
                }
            }
        },

        methods: {
            newCategory() {
                this.currentHandle = 'addChild';
                this.currentClick = undefined;
                this.isDialogShow = true;
                if (this.$refs.addCategory) {
                    //this.$refs.addCategory.initDatas();
                }

            },
            handleSave() {
                this.isDialogShow = false;
                this.$bus.reloadAllCategorys();
            },
            onDialogClose() {
                console.log('dialog closed.')
            },

            append(store, data) {
                this.currentHandle = 'addChild';
                this.currentClick = data;
                this.isDialogShow = true;
                if (this.$refs.addCategory) {
                    //this.$refs.addCategory.initDatas();
                }
            },
            edit(store, data) {
                this.currentHandle = 'edit';
                this.currentClick = data;
                this.isDialogShow = true;
                if (this.$refs.addCategory) {
                    //this.$refs.addCategory.initDatas();
                }
            },
            remove(store, data) {
                console.log(store, data);
                this.$confirm('此操作将永久删除该类目, 是否继续?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                })
                    .then(_ => {
                        this.currentClick = data;
                        //console.log(data._id);
                        return this.$http.post('/categorys/delete', { id: data._id })
                            .then(response => {
                                //console.log(response.body);
                                let obj = response.body;
                                if (obj.code == 0) {
                                    console.log('删除成功.');
                                    //this.$bus.fetchAllCategorys();
                                    this.$bus.deleteCategory(data);
                                    this.$message.success({
                                        message: '删除分类成功!'
                                    });
                                }

                                else {
                                    console.log(obj.description);
                                    this.$message.error({
                                        message: obj.description
                                    });
                                }
                            })
                            .catch(err => {
                                console.log(err.message);
                                this.$message.error({
                                    message: err.message
                                });
                            })
                    })
                    .catch(err => {
                        this.$message.info({
                            message: '操作取消.'
                        });
                    });


            },
            handleClick(data) {
                //console.log(data._id)
            },
            fetchAll() {
                this.$http.get('/categorys/list', { credentials: true })
                    .then(response => {
                        var obj = response.body;
                        if (obj.code == 0) {
                            //console.log(obj.data);
                            this.sortAll(obj.data);
                        }
                        else {
                            throw new Error(obj.description);
                        }
                    })
                    .catch(err => {
                        console.log(err.message);
                    })
                    .finally(() => {
                        console.log('请求所有类目完毕.');
                    });


            },
            sortAll(arr) {
                this.categorys = [];
                for (let i = 0; i < arr.length; i++) {
                    let father = arr[i];
                    father.children = [];
                    for (let j = 0; j < arr.length; j++) {
                        let child = arr[j];
                        if (child.fatherId == father._id) {
                            father.children.push(child);
                        }
                    }
                }
                for (let i = 0; i < arr.length; i++) {
                    if (arr[i].level == 0) {
                        this.categorys.push(arr[i]);
                    }
                }
                //console.log(this.categorys)
            },

            renderContent(h, { node, data, store }) {
                return (
                    <span>
                        <span>
                            <span>{node.label}</span>
                            <span>  [{data.tags}]</span>
                        </span>
                        <span>
                        </span>
                        <span style="float: right; margin-right: 20px">
                            <el-button type="primary" size="mini" on-click={() => this.append(store, data)}>添加子类</el-button>
                            <el-button type="success" size="mini" on-click={() => this.edit(store, data)}>编辑</el-button>
                            <el-button type="danger" size="mini" on-click={() => this.remove(store, data)}>删除</el-button>
                        </span>
                        

                    </span >);
            }


        },

    };

</script>