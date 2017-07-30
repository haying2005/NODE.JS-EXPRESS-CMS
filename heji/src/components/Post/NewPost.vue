<template>
    <div>
        <el-form ref="form" :model="form" label-width="80px">
            <el-form-item label="标题">
                <el-input v-model="form.title"></el-input>
            </el-form-item>
            <el-form-item label="作者">
                <el-input v-model="form.author"></el-input>
            </el-form-item>
            <el-form :inline="true" label-width="80px">
                <el-form-item label="类目">
                    <el-cascader change-on-select :show-all-levels="true" :options="bus.categorys" v-model="selectedOptions" @change="handleCategorySelectChange">
                    </el-cascader>
                </el-form-item>
                <el-form-item label="语言">
                    <!--<el-cascader change-on-select :show-all-levels="true" :options="bus.categorys" v-model="selectedOptions" @change="handleCategorySelectChange">
                    </el-cascader>-->

                    <el-select v-model="form.lang" placeholder="请选择">
                        <el-option v-for="item in bus.langs" :key="item.key" :label="item.CN_String" :value="item.key">
                        </el-option>
                    </el-select>
                </el-form-item>
            </el-form>

            <el-form-item label="缩略图">
                <el-upload ref="upload" :action="uploadUrl" :data="uploadData" :before-upload="onBeforeUpload" :on-success="uploadSuccHandle"
                    :on-remove="onRemoveHandle" list-type="picture-card">
                    <i class="el-icon-plus"></i>
                </el-upload>
            </el-form-item>

            <el-form-item label="摘要">
                <el-input type="textarea" v-model="form.brief"></el-input>
            </el-form-item>
            <el-form :inline="true" label-width="80px">
                <el-form-item label="发布">
                    <el-switch on-text="" off-text="" v-model="form.publish"></el-switch>
                </el-form-item>
                <el-form-item label="推荐">
                    <el-switch on-text="" off-text="" v-model="form.recommend"></el-switch>
                </el-form-item>
            </el-form>

            <el-form-item label="标签">
                <el-tag style="margin-right:10px" :key="tag" v-for="tag in dynamicTags" :closable="true" :close-transition="true" @close="handleClose(tag)">
                    {{tag}}
                </el-tag>
                <el-input style="width: 70px" v-if="inputVisible" v-model="inputValue" ref="saveTagInput" size="mini" @keyup.enter.native="handleInputConfirm"
                    @blur="handleInputConfirm">
                </el-input>
                <el-button v-else class="button-new-tag" size="small" @click="showInput">+ New Tag</el-button>
            </el-form-item>

            <el-form-item label="优先级">
                <el-slider v-model="form.priority"></el-slider>
            </el-form-item>
            <el-form-item label="正文" prop="content">
                <p-editor ref="editor" v-model="form.content" @upload="invokeUpload"></p-editor>
            </el-form-item>
            <el-form-item>
                <el-button type="primary" @click="onSubmit">立即创建</el-button>
                <el-button>取消</el-button>
            </el-form-item>
        </el-form>

        <el-dialog title="图片上传" :visible.sync="isDialogShow">
            <pic-uploader @save="onInsertPicHandle"></pic-uploader>
        </el-dialog>
    </div>
</template>

<script>
    import picUploader from '../Common/PicUploader.vue';
    export default {
        created() {
            this.getUploadtoken();
            //console.log(this.$route.params);
            if (this.$route.path.indexOf('/post/edit') >= 0) {
                this.isUpdate = true;
                this.postId = this.$route.params.id;

                this.bus.fetchAllCategorys().then(this.fetchPostById());
            }

        },
        components: {
            picUploader: picUploader,
        },
        data() {
            return {
                isUpdate: false,
                postId: '',
                bus: this.$bus,
                selectedOptions: [],
                uploadUrl: '',
                uploadToken: '',
                picHost: '',

                //标签输入相关
                inputVisible: false,
                inputValue: '',

                isDialogShow: false,
                form: {
                    title: '',
                    brief: '',
                    category: '',
                    author: '',
                    content: '',
                    publish: true,
                    recommend: false,
                    priority: 0,
                    thumbnails: [],
                    lang: this.$bus.langs[0].key,

                    tags: '',
                },

            }
        },
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
            uploadData() {
                let obj = {
                    'x:album': 'post',
                    'x:bucketHost': this.picHost,
                    'token': this.uploadToken,
                }
                return obj;
            }
        },
        methods: {
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


            onSubmit() {
                console.log(this.form);

                let arr = this.$refs.upload.uploadFiles;
                this.form.thumbnails = [];
                for (let i = 0; i < arr.length; i++) {
                    this.form.thumbnails.push(arr[i]._id)
                }

                console.log(this.$refs.upload.uploadFiles);

                if (this.isUpdate) {
                    this.form._id = this.postId;
                    this.$http.post('/post/edit', this.form)
                        .then(res => {
                            let obj = res.body;
                            if (obj.code == 0) {
                                this.$message.success('修改文章成功.');
                                this.$router.go(-1);
                            }
                            else {
                                this.$message.error(obj.description);
                            }
                        })
                        .catch(err => {
                            this.$message.error(err.message);
                        })
                }
                else {
                    this.$http.post('/post/add', this.form)
                        .then(res => {

                            let obj = res.body;
                            console.log(obj);
                            if (obj.code == 0) {
                                this.$message.success('添加文章成功.');
                                this.$router.go(-1);
                            }
                            else {
                                this.$message.error(obj.description);
                            }

                        })
                        .catch(err => {
                            //console.log(err)
                            this.$message.error(err.message);
                        });
                }

            },
            //类目选择器
            handleCategorySelectChange() {
                //console.log(this.selectedOptions);
                let len = this.selectedOptions.length;
                if (len) {
                    this.form.category = this.selectedOptions[len - 1];
                }
            },
            getUploadtoken() {
                this.$http.get('/qiniu/token')
                    .then(res => {
                        let obj = res.body;
                        console.log(obj);
                        if (obj.code == 0) {
                            let data = obj.data;
                            this.uploadUrl = data.url;
                            this.picHost = data.bucketHost;
                            this.uploadToken = data.token;
                        }
                        else {
                            this.$message.error('获取上传token失败: ' + obj.description);
                        }

                    })
                    .catch(err => {
                        console.log(err.message);
                    })
            },
            uploadSuccHandle(response, file, fileList) {
                console.log(response, file, fileList);
                this.$http.post('/qiniu/save', response)
                    .then(res => {
                        let obj = res.body;
                        if (obj.code == 0) {
                            //保存图片成功.
                            console.log(obj.data);
                            file._id = obj.data._id;
                        }
                        else {
                            this.$message(obj.description);
                        }
                    })
                    .catch(err => {
                        this.$message.error('保存失败.')
                        console.log(err.message);
                    })

            },
            //缩略图移除
            onRemoveHandle(file, fileList) {
                if (file && file._id) {
                    this.$message.info('移除: ' + file._id);
                }
            },
            onBeforeUpload(file) {
                console.log(file);
                if (file.size && file.size > 500 * 1024) {
                    this.$message.error('文件大小不能超过500k');
                    return false
                }
            },
            invokeUpload() {
                //this.$message.info('上传图片.');
                this.isDialogShow = true;
            },
            onInsertPicHandle(files) {
                //console.log(files);
                for (let i = 0; i < files.length; i++) {
                    let f = files[i];
                    let res = f.response;
                    let url = res.bucketHost + res.key;
                    let w = parseInt(res.imgW);
                    let h = parseInt(res.imgH);
                    this.$refs.editor.insertImage(url, res.fname, w, h);
                }
                this.isDialogShow = false;
            },
            fetchPostById() {
                let id_ = this.postId;
                this.$http.get('/post/' + id_)
                    .then(res => {
                        let obj = res.body;
                        if (obj.code == 0) {
                            console.log('---------------->post: ', obj.data);
                            let post = obj.data;
                            this.form.title = post.title;
                            this.form.brief = post.brief;
                            this.form.author = post.author;
                            this.form.content = post.content;
                            //编辑器赋初内容
                            this.$refs.editor.setContent(post.content);
                            this.form.publish = post.publish;
                            this.form.recommend = post.recommend;
                            this.form.priority = post.priority;
                            this.form.lang = post.lang;
                            this.form.tags = post.tags;

                            //类目
                            //console.log('-------------------->' + post.category);
                            this.selectedOptions = this.$bus.getInheritListArr(post.category);
                            this.handleCategorySelectChange();

                            //缩略图
                            if (post.thumbnails.length) {
                                this.$http.get('/qiniu/pics', { params: { ids: post.thumbnails } })
                                    .then(res => {
                                        //console.log(res.body);
                                        let obj = res.body;
                                        if (obj.code == 0) {
                                            let pics = obj.data;
                                            for (let i = 0; i < pics.length; i++) {
                                                let pic = pics[i];
                                                this.$refs.upload.uploadFiles.push({ response: pic, _id: pic._id, url: pic.bucketHost + pic.key });
                                            }
                                        }
                                        else {
                                            this.$message.error(obj.description);
                                        }
                                    })
                                    .catch(err => {
                                        console.log(err);
                                        this.$message.error(err.message);
                                    })
                            }

                        }
                        else {
                            this.$message.error(obj.description);
                        }
                    })
                    .catch(err => {
                        console.log(err);
                        this.$message.error(err.message);
                    });
            }
        }
    }

</script>

<style scoped>
    .input-new-tag {
        width: 100px;
    }
</style>