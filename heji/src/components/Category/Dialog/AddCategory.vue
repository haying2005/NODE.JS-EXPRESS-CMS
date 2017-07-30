<template>
    <div>
        <el-form :model="form">
            <el-form-item label="类目名称" :label-width="formLabelWidth">
                <el-input v-model="form.name" auto-complete="off"></el-input>
            </el-form-item>
            <el-form-item label="父类" :label-width="formLabelWidth">
                <el-cascader :disabled="!selectionEnable" change-on-select :show-all-levels="true" :options="bus.categorys" v-model="selectedOptions"
                    @change="handleSelectionChange">
                </el-cascader>
            </el-form-item>

             <el-form-item label="标签" :label-width="formLabelWidth">
                <el-tag style="margin-right:10px" :key="tag" v-for="tag in dynamicTags" :closable="true" :close-transition="true" @close="handleClose(tag)">
                    {{tag}}
                </el-tag>
                <el-input style="width: 70px" v-if="inputVisible" v-model="inputValue" ref="saveTagInput" size="mini" @keyup.enter.native="handleInputConfirm"
                    @blur="handleInputConfirm">
                </el-input>
                <el-button v-else class="button-new-tag" size="small" @click="showInput">+ New Tag</el-button>
            </el-form-item>

            <el-form-item label="国际化" :label-width="formLabelWidth">
                <div v-for="(item,index) in localizations">
                    <el-checkbox v-model="item.enable" @change="langCheckChange">{{item.key}}</el-checkbox>
                    <el-input v-model="item.label" :placeholder="'请输入' + item.key + '名称'"></el-input>
                </div>
            </el-form-item>

            <el-form-item :label-width="formLabelWidth">
                <el-button type="primary" @click="onSubmit">立即创建</el-button>
            </el-form-item>


        </el-form>

    </div>
</template>

<script>
    import categoryOptions from '../../Common/CategoryCascader.vue'
    export default {
        components: {
            categoryOptions: categoryOptions,
        },
        props: ['father', 'handleType'],
        computed: {
            dynamicTags: {
                get() {
                    let arr = this.form.tags.split(',').filter(val => {
                        return val != '';
                    });
                    let s = new Set(arr);
                    return [...s];

                },
                set(val) {
                    this.form.tags += ' ';
                    this.$nextTick(_ => {
                        let s = new Set(val);
                        let arr = [...s];
                        this.form.tags = arr.join(',');
                    })

                }

            },
        },
        created() {
            this.initDatas();

            // for (let i = 0; i < this.$bus.langs.length; i ++) {
            //     this.selectedLangKeys.push(false);
            // }
        },

        watch: {
            father(val) {
                this.initDatas()
            },
            handleType(val) {
                this.initDatas()
            }

        },
        data() {
            return {
                bus: this.$bus,
                formLabelWidth: '100px',
                selectedOptions: [],
                selectedCategory: undefined,
                //多语言
                // selectedLangKeys: new Array(this.$bus.langs.length),
                // selectedLangValues: new Array(this.$bus.langs.length),

                form: {
                    name: '',
                    tags: '',
                },

                //是否禁用级联选择器
                selectionEnable: false,

                localizations: [],

                //标签输入相关
                inputVisible: false,
                inputValue: '',
            }
        },
        methods: {
            //初始化数据
            initDatas() {
                //console.log('father', this.father);
                this.localizations = [];
                for (let i = 0; i < this.$bus.langs.length; i++) {
                    let lang = this.$bus.langs[i];
                    let obj = { key: lang.key, label: '', enable: false };
                    this.localizations.push(obj);
                }
                this.selectionEnable = false;
                if (this.handleType == 'addChild') {
                    if (this.father) {
                        this.selectedOptions = this.$bus.getInheritListArr(this.father._id);
                    }
                    else {
                        this.selectedOptions = [];
                        this.selectionEnable = true;
                    }

                    this.form.name = '';
                    this.form.tags = '';
                }
                else if (this.handleType == 'edit') {
                    this.form.name = this.father.name;
                    this.form.tags = this.father.tags;
                    
                    for (let i = 0; i < this.father.localizations.length; i++) {
                        let obj = this.father.localizations[i];
                        
                        for (let j = 0; j < this.localizations.length; j ++) {
                            let _obj = this.localizations[j];
                            if (obj.key == _obj.key) {
                                _obj.label = obj.label;
                                _obj.enable = obj.enable;
                                break;
                            }
                        }

                    }
                    if (this.father.father) {
                        this.selectedOptions = this.$bus.getInheritListArr(this.father.father._id);
                    }
                    else {
                        this.selectedOptions = [];
                    }
                }

                this.handleSelectionChange();
            },
            onSubmit() {
                // console.log(this.selectedCategory);
                // return;
                
                if (this.handleType == 'addChild') {
                    this.$http.post('/categorys/', { fatherId: this.selectedCategory, name: this.form.name, localizations: this.localizations, tags: this.form.tags })
                        .then(res => {
                            let obj = res.body;
                            if (obj.code == 0) {
                                //成功
                                console.log(obj.data);
                                //this.father.children.push(obj.data);
                                //this.$bus.addCategory(obj.data);
                                this.$emit('save');
                                this.form.name = '';
                                this.$message.success('添加分类成功.');
                            }
                            else {
                                console.log(obj.description);
                                this.$message.error(obj.description);
                            }
                        })
                        .catch(err => {
                            console.log(err.message);
                            this.$message.error(err.message);
                        })
                }
                else if (this.handleType == 'edit') {
                    this.$http.post('/categorys/edit', { _id: this.father._id, fatherId: this.selectedCategory, name: this.form.name, localizations: this.localizations, tags: this.form.tags })
                        .then(res => {
                            let obj = res.body;
                            if (obj.code == 0) {
                                //成功
                                this.$emit('save');
                                this.form.name = '';
                                this.$message.success('编辑分类成功.');
                            }
                            else {
                                console.log(obj.description);
                                this.$message.error(obj.description);
                            }
                        })
                        .catch(err => {
                            console.log(err.message);
                            this.$message.error(err.message);
                        })
                }

            },
            //类目选择器
            handleSelectionChange() {
                let len = this.selectedOptions.length;
                if (len) {
                    this.selectedCategory = this.selectedOptions[len - 1];
                }
                else {
                    this.selectedCategory = undefined;
                }
                // console.log(this.selectedOptions);
                // console.log('handleSelectionChange', this.selectedCategory);
            },

            //多语言checkbox
            langCheckChange(val) {
                //console.log(val);
                //console.log(this.selectedLangKeys);
                console.log(this.localizations);
            },

            //标签操作相关
            handleClose(tag) {
                this.dynamicTags.splice(this.dynamicTags.indexOf(tag), 1);
                this.dynamicTags = [].concat(this.dynamicTags);
                this.$nextTick(_ => console.log(this.form.tags))
            },
            showInput() {
                this.inputVisible = true;
                this.$nextTick(_ => {
                    this.$refs.saveTagInput.$refs.input.focus();
                });
            },
            handleInputConfirm() {
                let inputValue = this.inputValue;
                if (inputValue) {
                    this.dynamicTags.push(inputValue)
                    this.dynamicTags = [].concat(this.dynamicTags);
                    this.$nextTick(_ => console.log(this.form.tags));
                }
                this.inputVisible = false;
                this.inputValue = '';
            },
        }
    }

</script>