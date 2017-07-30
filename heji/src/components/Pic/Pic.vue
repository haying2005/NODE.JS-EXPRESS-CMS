<template>
    <div>
        <el-tabs v-model="activeName" @tab-click="onTabSwitch">
            <el-tab-pane label="图片列表" name="first">
                <pic-list></pic-list>
            </el-tab-pane>
            <el-tab-pane label="上传图片" name="second">
                <pic-uploader></pic-uploader>
            </el-tab-pane>
        </el-tabs>
        <div>
            
        </div>
    </div>
</template>

<script>
    import picList from './PicList.vue';
    import picUploader from '../Common/PicUploader.vue'
    export default {
        components: {
            picList: picList,
            picUploader:picUploader,
        },
        data() {
            return {
                activeName: 'first',
                

            }
        },
        methods: {
            fetchList() {
                //this.$http.get('');
            },
            onTabSwitch(tab, event) {
                console.log(tab, event);
            }
        }
    }

</script>