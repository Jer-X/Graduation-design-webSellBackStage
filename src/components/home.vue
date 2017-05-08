<template>
  <div class="home">
    <header class="header">
      <div class="logo">
        <img src="" alt="">
      </div>
      <div class="name">訂單商品管理系統</div>
      <div class="user">
        <span>{{this.user.user_name}}</span>
        <el-button size="small" type="danger" @click="loginOut()">退出</el-button>
      </div>
    </header>
    <div class="container">
      <div class="nav">
        <el-menu :default-active="activePath" :router=this.route class="el-menu-vertical-demo">
          <el-menu-item index="/home/orders">
            <i class="el-icon-edit"></i>訂單詳情</el-menu-item>
          <el-menu-item index="/home/goods">
            <i class="el-icon-date"></i>商品列表</el-menu-item>
          <el-menu-item index="/home/columns">
            <i class="el-icon-menu"></i>欄目列表</el-menu-item>
          <el-menu-item index="/home/add">
            <i class="el-icon-setting"></i>新增操作</el-menu-item>
          <el-menu-item index="/home/seller">
            <i class="el-icon-document"></i>商家信息</el-menu-item>
        </el-menu>
      </div>
      <router-view class="content"></router-view>
    </div>
  </div>
</template>

<script>
const ERR_OK = 0;

export default {
  name: 'hello',
  data() {
    return {
      route: true,
      activePath: '/home/orders',
      user: {}
    };
  },
  methods: {
    loginOut() {
      this.$http.post('/data/user/loginOut', {}).then((res) => {
        res = res.body;
        if (res.errno === ERR_OK) {
          this.$message({
            message: '退出成功！',
            type: 'success'
          });
          this.user = {};
          this.$router.push({ path: '/login' });
        }
      }, () => { });
    }
  },
  created() {
    this.$http.get('/data/user/loginState').then((res) => {
      res = res.body;
      if (res.errno === ERR_OK) {
        this.user = res.data;
      } else {
        this.$router.push({ path: '/login' });
      }
    }, () => { });
  },
  beforeRouteEnter(to, from, next) {
    next(
      vm => {
        // 通过 `vm` 访问组件实例
        vm.activePath = `/home/${to.matched[1].name}`;
      }
    );
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss" type="text/css" rel="stylesheet/scss">
.home {
  position: absolute;
  left: 0;
  top: 0;
  right: 0;
  bottom: 0;
  min-width: 1100px;
  overflow: auto;
  .header {
    color: #F9FAFC;
    background: #324057;
    height: 50px;
    line-height: 50px;
    .logo {
      padding: 5px;
      display: inline-block;
    }
    .name {
      display: inline-block;
      margin-left: 10px;
      font-size: 20px
    }
    .user {
      float: right;
      display: block;
      line-height: 50px;
      margin-right: 30px;
      span {
        display: inline-block;
        margin-right: 10px;
        line-height: 50px;
        font-size: 16px;
      }
    }
  }

  .container {
    display: flex;
    width: 100%;
    height: 100%;
    .nav {
      flex: 0 0 200px;
      width: 200px;
      height: 100%;
      overflow: auto;
      background: #EFF2F7;
    }
    .content {
      flex: 1 1 auto;
      width: 100%;
      height: 100%;
      overflow: auto;
    }
  }
}
</style>
