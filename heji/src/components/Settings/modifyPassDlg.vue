<template>
    <div>
        <el-form :model="form">
            <el-form-item label="旧密码" :label-width="'80px'">
                <el-input type="password" placeholder="请输入旧密码" v-model="form.old" auto-complete="off"></el-input>
            </el-form-item>

            <el-form-item label="新密码" :label-width="'80px'">
                <el-input type="password" placeholder="请输入新密码" v-model="form.new" auto-complete="off"></el-input>
            </el-form-item>

            <el-form-item label="确认密码" :label-width="'80px'">
                <el-input type="password" placeholder="再次输入新密码" v-model="form.confirm" auto-complete="off"></el-input>
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
                form: {
                    old: '',
                    new: '',
                    confirm: '',
                }
            }
        },
        methods: {
            onSubmit() {
                let form = this.form;
                let oldPass = form.old;
                let newPass = form.new;
                let confirmPass = form.confirm;

                this.$http.post('/users/modify-pass', { oldPass, newPass, confirmPass })
                    .then(response => {
                        let obj = response.body;
                        if (obj.code == 0) {
                            this.$emit('save');
                            this.$message.success({
                                message: '修改密码成功!'
                            });
                        } else {
                            this.$message.error({
                                message: obj.description
                            });
                        }
                    })

                console.log(this.form);
            }
        }
    }
</script>