<template>
    <div class="add">
        <el-tabs v-model="activeName">
            <el-tab-pane label="增加商品" name="addFood">
                <el-row class="row">
                    <el-col :span="12" :offset="6">
                        <el-card>
                            <el-form ref="form" :model="form" label-width="80px">
                                <el-form-item label="所屬欄目">
                                    <el-select v-model="form.column" multiple :multiple-limit="this.limit" placeholder="请选择商品所屬欄目">
                                        <el-option v-for="(item,index) in columns" :key="index" :label="item" :value="item"></el-option>
                                    </el-select>
                                </el-form-item>
                                <el-form-item label="商品名稱">
                                    <el-input v-model="form.name"></el-input>
                                </el-form-item>
                                <el-form-item label="商品現價">
                                    <el-input v-model="form.price"></el-input>
                                </el-form-item>
                                <el-form-item label="商品原價">
                                    <el-input v-model="form.oldPrice"></el-input>
                                </el-form-item>
                                <el-form-item label="商品標籤">
                                    <el-input v-model="form.description"></el-input>
                                </el-form-item>
                                <el-form-item label="商品描述">
                                    <el-input placeholder="请输入内容" type="textarea" autosize v-model="form.info"></el-input>
                                </el-form-item>
                                <el-form-item label="商品圖片">
                                    <el-upload ref="uploadImg" action="/data/file/good" :on-success="uploadPath" :name="uploadName" list-type="picture-card" :on-preview="handlePictureCardPreview" :on-remove="handleRemove">
                                        <i class="el-icon-plus"></i>
                                    </el-upload>
                                    <el-dialog v-model="form.dialogVisible" size="tiny">
                                        <img width="100%" :src="form.dialogImageUrl" alt="">
                                    </el-dialog>
                                </el-form-item>
                                <el-form-item>
                                    <el-button type="primary" @click="addFood">立即创建</el-button>
                                    <el-button>取消</el-button>
                                </el-form-item>
                            </el-form>
                        </el-card>
                    </el-col>
                </el-row>
            </el-tab-pane>
            <el-tab-pane label="增加欄目" name="allColumn">
                <el-row class="row">
                    <el-col :span="12" :offset="6">
                        <el-card>
                            <el-form ref="form" :model="column" label-width="80px">
                                <el-form-item label="商品名稱">
                                    <el-input v-model="column.name"></el-input>
                                </el-form-item>
                                <el-form-item label="欄目類型">
                                    <el-select v-model="column.type" multiple :multiple-limit="this.limit" placeholder="请选择欄目類型">
                                        <el-option label="一般" value="-1"></el-option>
                                        <el-option label="滿減" value="0"></el-option>
                                        <el-option label="折扣" value="1"></el-option>
                                        <el-option label="特價" value="2"></el-option>
                                        <el-option label="發票" value="3"></el-option>
                                        <el-option label="保證" value="4"></el-option>
                                    </el-select>
                                </el-form-item>
                                <el-form-item>
                                    <el-button type="primary" @click="addColumn">立即创建</el-button>
                                    <el-button>取消</el-button>
                                </el-form-item>
                            </el-form>
                        </el-card>
                    </el-col>
                </el-row>
            </el-tab-pane>
        </el-tabs>
    </div>
</template>

<script>
const ERR_OK = 0;

export default {
    data() {
        return {
            limit: 1,
            activeName: 'addFood',
            form: {
                column: [],
                name: '',
                price: '',
                oldPrice: '',
                description: '',
                info: '',
                icon: '',
                image: '',
                dialogImageUrl: '',
                dialogVisible: false
            },
            columns: [],
            column: {
                name: '',
                type: [],
                foods: []
            },
            uploadName: 'good'
        };
    },
    methods: {
        handleRemove(file, fileList) {
            console.log(file, fileList);
        },
        handlePictureCardPreview(file) {
            this.form.dialogImageUrl = file.url;
            this.form.dialogVisible = true;
        },
        uploadPath(res, file, fileList) {
            if(res.errno === ERR_OK){
                this.form.icon = res.minData;
                this.form.image = res.data;
            }
        },
        addFood() {
            this.$http.post('/data/add/food', {
                'column': this.form.column[0],
                'name': this.form.name,
                'price': this.form.price,
                'oldPrice': this.form.oldPrice,
                'description': this.form.description,
                'info': this.form.info,
                'icon': this.form.icon,
                'image': this.form.image
            }, { emulateJSON: true }).then((res) => {
                res = res.body;
                if (res.errno === ERR_OK) {
                    this.$notify({
                        title: '成功',
                        message: '商品添加成功',
                        type: 'success'
                    });
                    this.$refs.uploadImg.clearFiles();
                    this.form = {
                        column: [],
                        name: '',
                        price: '',
                        oldPrice: '',
                        description: '',
                        info: '',
                        dialogImageUrl: '',
                        dialogVisible: false
                    };
                }
            }, () => { });
        },
        addColumn() {
            this.$http.post('/data/add/column', {
                'name': this.column.name,
                'type': this.column.type[0],
                'foods': this.column.foods
            }, { emulateJSON: true }).then((res) => {
                res = res.body;
                if (res.errno === ERR_OK) {
                    this.$notify({
                        title: '成功',
                        message: '欄目添加成功',
                        type: 'success'
                    });
                    this.column = {
                        name: '',
                        type: '',
                        foods: []
                    };
                    this.getColumn();
                }
            });
        },
        getColumn() {
            this.$http.get('/data/goods/column').then((res) => {
                res = res.body;
                if (res.errno === ERR_OK) {
                    this.columns = res.data;
                }
            }, () => { });
        }
    },
    created() {
        this.$http.get('/data/goods/column').then((res) => {
            res = res.body;
            if (res.errno === ERR_OK) {
                this.columns = res.data;
            }
        }, () => { });
    }
};
</script>

<style scoped lang="scss" type="text/css" rel="stylesheet/scss">
.row {
    margin-top: 30px
}
</style>
