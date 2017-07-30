<template>
    <div>
        <el-menu :router="true"  default-open='1' class="el-menu-vertical-demo" @open="handleOpen" @close="handleClose"
            @select="handleSelect">
            <el-submenu index="1">
                <template slot="title"><i class="el-icon-message"></i>内容管理</template>
                <el-menu-item 
                v-for="(item,index) in bus.categorys" 
                :index="'1-' + index" 
                :key="index"
                :route="{path:'/post/' + item._id}"
                >{{item.name}}</el-menu-item>
            </el-submenu>
            <el-menu-item index="2" :route="{path:'/category'}"><i class="el-icon-menu"></i>类目管理</el-menu-item>
            <el-menu-item index="3" :route="{path:'/pic'}"><i class="el-icon-picture"></i>图片库</el-menu-item>
        </el-menu>

    </div>
</template>

<script>
    export default {
        computed: {
        
        },
        filters: {
            level1Categorys(arr) {
                if (arr && arr instanceof Array) {
                    return arr.filter(item => {
                        return item.level == 0;
                    });
                }
            }
        },
        data () {
            return {
                bus: this.$bus,
            }
        },
        methods: {
            handleOpen(key, keyPath) {
                console.log(key, keyPath);
            },
            handleClose(key, keyPath) {
                console.log(key, keyPath);
            },
            handleSelect(indexPath) {
                console.log(indexPath);
            }
        }
    }

</script>

<style scoped>
    .el-menu-vertical-demo {
        min-height: 600px;
    }
    .sidebar {
        display: block;
        position: absolute;
        width: 250px;
        left: 0;
        top: 70px;
        bottom: 0;
        background: #2E363F;
    }

    .sidebar>ul {
        height: 100%;
    }
</style>