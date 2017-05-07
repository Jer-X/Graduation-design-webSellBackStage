<template>
    <div class="login">
        <el-row>
            <el-col class='header' :offset='10'>
                <div class="name">訂單商品管理系統</div>
            </el-col>
            <el-col :span='4' :offset='10'>
                <el-card>
                    <el-form ref="form" :model="form" label-width="80px">
                        <el-form-item>
                            <el-radio class="radio" v-model="radio" label="1">登录</el-radio>
                            <el-radio class="radio" v-model="radio" label="2">注册</el-radio>
                        </el-form-item>
                        <el-form-item label="账号">
                            <el-input v-model="form.name"></el-input>
                        </el-form-item>
                        <el-form-item label="密码">
                            <div class="el-input">
                                <input v-model="form.pwd" type="password" class="el-input__inner"></input>
                            </div>
                        </el-form-item>
                        <el-form-item>
                            <el-button type="primary" @click="onSubmit">{{btn_text}}</el-button>
                            <el-button>取消</el-button>
                        </el-form-item>
                    </el-form>
                </el-card>
            </el-col>
        </el-row>
    </div>
</template>

<script>
const ERR_OK = 0;

export default {
    data() {
        return {
            form: {
                name: '',
                pwd: ''
            },
            radio: '1'
        };
    },
    created() {
        this.$http.get('/data/user/loginState').then((res) => {
            res = res.body;
            if (res.errno === ERR_OK) {
                this.$router.push({ path: '/home/orders' });
            } else {
                this.$message({
                    message: '请登录！',
                    type: 'warning'
                });
            }
        }, () => { });
    },
    methods: {
        onSubmit() {
            if (this.radio === '1') {
                this.$http.post('/data/user/login', {
                    'user_name': this.form.name,
                    'pwd': this.form.pwd
                }, { emulateJSON: true }).then((res) => {
                    res = res.body;
                    if (res.errno === ERR_OK) {
                        this.$message({
                            message: '登录成功！',
                            type: 'success'
                        });
                        this.$router.push({ 'path': '/home/orders' });
                    } else {
                        this.$message.error('密码错误,请重新输入！');
                        this.form.pwd = '';
                    }
                }, () => { });
            } else if (this.radio === '2') {
                this.$http.post('/data/user/register', {
                    'user_name': this.form.name,
                    'pwd': this.form.pwd
                }, { emulateJSON: true }).then((res) => {
                    res = res.body;
                    if (res.errno === ERR_OK) {
                        this.radio = '1';
                        this.form = {
                            name: '',
                            pwd: ''
                        };
                        this.$message({
                            message: '恭喜你，注册成功！请登录',
                            type: 'success'
                        });
                    }
                }, () => { });
            }
        }
    },
    computed: {
        btn_text() {
            if (this.radio === '1') {
                return '登录';
            } else {
                return '注册';
            }
        }
    }
};
</script>

<style scoped lang="scss" type="text/css" rel="stylesheet/scss">
.login {
    position: absolute;
    left: 0;
    top: 0;
    right: 0;
    bottom: 0;
    background: #324057;
    .el-row {
        margin-top: 12%;
        .header {
            color: #F9FAFC;
            font-size: 30px;
            line-height: 30px;
            height: 30px;
            margin-bottom: 20px;
            padding-left: 20px;
        }
        .el-form-item:last-child {
            margin-bottom: 0;
        }
    }
}
</style>
