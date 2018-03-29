<template>
  <div>
    <div v-if="isLogin">
      <el-row class="tac">
        <el-col :span="24">
          <el-menu theme="dark" class="el-menu-demo" mode="horizontal">
            <el-menu-item index="1">处理中心</el-menu-item>
            <el-submenu index="2">
              <template slot="title">我的工作台</template>
              <el-menu-item index="2-1" @click="isModifyPassShow=true">修改密码</el-menu-item>
              <el-menu-item index="2-2" @click="isModifyNickShow=true">修改昵称</el-menu-item>
              <el-menu-item index="2-3" @click="logOut">退出登录</el-menu-item>
            </el-submenu>
            <el-menu-item index="3">登录</el-menu-item>
          </el-menu>
        </el-col>

      </el-row>
      <el-row :gutter="10" class="tac">
        <el-col :span="4">
          <left-nav></left-nav>
        </el-col>
        <el-col :span="20">
          <div class="content">
            <div class="breadcrumb">
              <!--面包屑导航-->
              <el-breadcrumb separator="/">
                <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
                <el-breadcrumb-item>活动管理</el-breadcrumb-item>
                <el-breadcrumb-item>活动列表</el-breadcrumb-item>
                <el-breadcrumb-item>活动详情</el-breadcrumb-item>
              </el-breadcrumb>
            </div>
            <div>
              <router-view></router-view>
            </div>
          </div>

        </el-col>
      </el-row>
    </div>
    <div id="login" v-if="!isLogin">
      <login ref="login"></login>
    </div>
    <!-- 对话框 -->
    <div>
      <el-dialog :title="'修改密码'" :visible.sync="isModifyPassShow">
        <modify-pass ref="modifyPassDlg" @save="passSave()"></modify-pass>
      </el-dialog>
      <el-dialog :title="'修改密码'" :visible.sync="isModifyNickShow">
        <modify-nick ref="modifyNickDlg" @save="nickSave()"></modify-nick>
      </el-dialog>
    </div>
  </div>

</template>

<script>
  import leftNav from './components/LeftNav.vue';
  import login from './Login.vue';
  import ModifyPassDia from './components/Settings/modifyPassDlg.vue';
  import ModifyNickDia from './components/Settings/modifyNickDlg.vue';
  export default {
    name: 'app',
    created() {
      console.log(this.$bus);
      this.$bus.$on('login', user => {
        console.log('登录成功!', user);
        this.isLogin = true;
      });
      this.$bus.$on('logout', _ => {
        console.log('登出');
        this.isLogin = false;
      })
    },
    data() {
      return {
        isLogin: true,
        routeName: this.$route.name,
        bus: this.$bus,
        isModifyPassShow: false,
        isModifyNickShow: false,
      }
    },
    methods: {
      passSave() {
        this.isModifyPassShow = false;
        console.log('password modified!');
      },
      nickSave() {
        this.isModifyNickShow = false;
        console.log('nick saved');
      },
      logOut() {
        this.$confirm('确定退出登录?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        })
          .catch(err => {
            throw new Error('操作取消.')    //catch方法必须抛出错误，否则后面的then会执行.
          })
          .then(o => this.$http.post('/users/logout'))
          .then(ids => {
            this.$bus.$emit('logout');
            this.$message.success('退出登录成功.')
          })
          .catch(err => this.$message.error(err.message))
      }
    },
    computed: {
      pathsArr: function () {
        if (this.routeName == 'home') {
          return ['Home'];
        }
        if (this.routeName == 'user') {
          return ['Home', 'User'];
        }
        if (this.routeName == 'userList') {
          return ['Home', 'User'];
        }
        if (this.routeName == 'userDetail') {
          return ['Home', 'User', 'UserDetail'];
        }

        else {
          return ['Home', 'xxxx'];
        }
      }
    },
    components: {
      leftNav: leftNav,
      login: login,
      modifyPass: ModifyPassDia,
      modifyNick: ModifyNickDia,
    },
    watch: {
      '$route': function () {
        //console.log(this.$route.name);
        this.routeName = this.$route.name;
      }
    }
  }

</script>

<style scoped>
  .content {
    padding-top: 20px;
    padding-right: 20px;
    margin-bottom: 20px;
  }

  .breadcrumb {
    padding-top: 10px;
    padding-bottom: 10px;
    margin-bottom: 20px;
  }

  .el-menu-demo {
    padding-right: 20px;
  }

  .el-menu-demo li {
    float: right;
  }

  #login {
    /*margin-top: 200px;*/
    height: 100%;
    width: 100%;
    position: relative;
    padding-top: 300px;
    background-color: #324157;
  }
</style>