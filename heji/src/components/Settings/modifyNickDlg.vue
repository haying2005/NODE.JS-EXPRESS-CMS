<template>
    <div>
        <el-form :model="form">
            <el-form-item label="昵称" :label-width="'80px'">
                <el-input placeholder="请输入昵称" v-model="nick" auto-complete="off"></el-input>
            </el-form-item>
            <el-form-item :label-width="'80px'">
                <el-button type="primary" @click="onSubmit">保存</el-button>
            </el-form-item>
        </el-form>
    </div>
</template>

<script>
    export default {
        data() {
            return {
                form: {},
                nick: '',
            }
        },
        mounted () {
            this.nick = this.$bus.user.Nick;
        },
        methods: {
            onSubmit() {

                this.$http.post('/users/modify-nick', { nick: this.nick })
                    .then(response => {
                        let obj = response.body;
                        if (obj.code == 0) {
                            this.$emit('save');
                            this.$bus.user.Nick = this.nick;
                            this.$message.success({
                                message: '修改昵称码成功!'
                            });
                        } else {
                            this.$message.error({
                                message: obj.description
                            });
                        }
                    })
            }
        }
    }
</script>