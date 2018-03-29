<template>
    <div class="login-wrap">
        <div class="ms-title">管理后台</div>
        <div class="ms-login">
            <el-form label-width="0px" class="demo-ruleForm">
                <el-form-item>
                    <el-input placeholder="username" v-model="userName"></el-input>
                </el-form-item>
                <el-form-item>
                    <el-input type="password" placeholder="password" v-model="password"></el-input>
                </el-form-item>
                <div class="login-btn">
                    <el-button @click="login" type="primary">登录</el-button>
                </div>
                <p style="font-size:12px;line-height:30px;color:#999;">Tips : 请正确填写账号密码</p>
            </el-form>
        </div>
    </div>
</template>

<script>
    export default {
        data () {
            return {
                userName: '',
                password: '',
            }
        },
        methods: {
            login() {
                this.$http.post('/public/login', { loginName: this.userName, password: this.password })
                .then(res => {
                    var obj = res.body;
                    if (obj.code == 0) {
                        this.isLogin = true;
                        console.log('登录成功');
                        console.log(obj);
                        this.$message.success('登录成功');

                        this.$bus.$emit('login', obj.data);
                        this.$bus.user = obj.data;
                        this.$bus.fetchAllCategorys();
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
                
            },
        }
    }
</script>

<style scoped>
.login-wrap {
    position: relative;
    width: 100%;
    height: 100%;
}

.ms-title {
    position: absolute;
    top: 50%;
    width: 100%;
    margin-top: -230px;
    text-align: center;
    font-size: 30px;
    color: #fff;
}

.ms-login {
    position: absolute;
    left: 50%;
    top: 50%;
    width: 300px;
    height: 160px;
    margin: -150px 0 0 -190px;
    padding: 40px;
    border-radius: 5px;
    background: #fff;
}

.login-btn {
    text-align: center;
}

.login-btn button {
    width: 100%;
    height: 36px;
}
</style>