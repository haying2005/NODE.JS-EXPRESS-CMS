<template>
    <div>
        <el-upload ref="upload" :action="uploadUrl" :data="uploadData" :before-upload="onBeforeUpload" :on-success="uploadSuccHandle"
            :on-remove="onRemoveHandle" list-type="picture-card">
            <i class="el-icon-plus"></i>
        </el-upload>
        <div class="footer">
            <el-button type="primary" @click="onSubmit">确认</el-button>
            <el-button @click="clearAll">清空</el-button>
        </div>
    </div>
</template>

<script>
    export default {
        created() {
            this.init();
        },
        data() {
            return {
                //bus: this.$bus,
                uploadUrl: '',
                uploadToken: '',
                picHost: '',
                isInit: false,
            }
        },
        props: {

        },
        computed: {
            uploadData() {
                let obj = {
                    'x:album': 'post',
                    'x:bucketHost': this.picHost,
                    'token': this.uploadToken,
                }
                return obj;
            },
            fileList() {
                //console.log(this.$refs.upload);
                return this.$refs.upload.uploadFiles;
            }
        },
        methods: {
            init() {
                this.$http.get('/qiniu/token')
                    .then(res => {
                        let obj = res.body;
                        console.log(obj);
                        if (obj.code == 0) {
                            let data = obj.data;
                            this.uploadUrl = data.url;
                            this.picHost = data.bucketHost;
                            this.uploadToken = data.token;

                            this.isInit = true;
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
            onRemoveHandle(file, fileList) {
                if (file && file._id) {
                    this.$message.info('移除: ' + file._id);
                }
            },
            onBeforeUpload(file) {
                //console.log(file);
                if (file.type.indexOf('image/') == 0) {
                    if (file.size && file.size > 500 * 1024) {
                        this.$message.error('文件大小不能超过500k.');
                        return false
                    }
                    return true;
                }
                else {
                    this.$message.error('只能上传图片.');
                    return false
                }

            },
            onSubmit() {

                this.$emit('save', this.fileList);
                this.$refs.upload.clearFiles();
                //console.log(this.$refs.upload);
            },
            clearAll() {
                this.$refs.upload.clearFiles();
            }
        }
    }

</script>

<style scoped>
    .footer {
        margin-top: 20px;
    }
</style>