<template>
    <div class="goods">
        <el-tabs type="border-card" class="navTab" v-model="tabValue">
            <el-tab-pane v-for="(good,index) in goods" :label="good.name" :key="index" :name="good.name">
                <el-table :data="good.foods" style="width: 100%">
                    <el-table-column type="expand">
                        <template scope="props">
                            <el-form label-position="left" inline class="demo-table-expand">
                                <el-form-item label="商品名称">
                                    <span>{{ props.row.name }}</span>
                                </el-form-item>
                                <el-form-item label="商品現價">
                                    <span>￥{{ props.row.price }}</span>
                                </el-form-item>
                                <el-form-item label="商品描述">
                                    <span>{{ props.row.description }}</span>
                                </el-form-item>
                                <el-form-item label="商品原價">
                                    <span>{{ props.row.oldPrice === '' ? '無' : '￥' + props.row.oldPrice }}</span>
                                </el-form-item>
                                <el-form-item label="銷售數量">
                                    <span>{{ props.row.sellCount }}</span>
                                </el-form-item>
                                <el-form-item label="商品評價">
                                    <span>{{ props.row.rating }}%</span>
                                </el-form-item>
                                <el-form-item label="商品圖片">
                                    <span>
                                        <img :src="props.row.icon" alt="" class="image">
                                    </span>
                                </el-form-item>
                            </el-form>
                        </template>
                    </el-table-column>
                    <el-table-column label="商品名称" prop="name">
                    </el-table-column>
                    <el-table-column label="商品價格" prop="price">
                    </el-table-column>
                    <el-table-column label="銷售數量" prop="sellCount">
                    </el-table-column>
                    <el-table-column label="操作" width="240">
                        <template scope="scope">
                            <el-button size="small" type="primary" icon="edit" @click="modify(scope.row)">修改商品</el-button>
                            <el-button size="small" type="danger" icon="delete" @click="remove(scope.row)">刪除商品</el-button>
                        </template>
                    </el-table-column>
                </el-table>
            </el-tab-pane>
        </el-tabs>
        <el-dialog title="修改商品信息" v-model="dialogFormVisible">
            <el-form :model="form">
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
                    <el-upload ref="uploadImg" :on-success="uploadPath" :name="uploadName" action="/data/file/good" list-type="picture-card" :on-preview="handlePictureCardPreview" :on-remove="handleRemove">
                        <i class="el-icon-plus"></i>
                    </el-upload>
                    <el-dialog v-model="form.dialogVisible" size="tiny">
                        <img width="100%" :src="form.dialogImageUrl" alt="">
                    </el-dialog>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="dialogFormVisible = false">取 消</el-button>
                <el-button type="primary" @click="modifyConfirm()">确 定</el-button>
            </div>
        </el-dialog>
    </div>
</template>

<script>
const ERR_OK = 0;

export default {
    data() {
        return {
            goods: [],
            tabValue: '热销榜',
            dialogFormVisible: false,
            form: {
                name: '',
                price: '',
                oldPrice: '',
                description: '',
                info: '',
                dialogImageUrl: '',
                dialogVisible: false,
                icon: '',
                image: ''
            },
            formLabelWidth: '120px',
            oldName: '',
            uploadName: 'good'
        };
    },
    created() {
        this.$http.get('/data/goods').then((res) => {
            res = res.body;
            if (res.errno === ERR_OK) {
                this.goods = res.data;
            }
        }, () => { });
    },
    methods: {
        modify(obj) {
            this.oldName = obj.name;
            this.form.name = obj.name;
            this.form.price = obj.price;
            this.form.oldPrice = obj.oldPrice;
            this.form.description = obj.description;
            this.form.info = obj.info;
            this.dialogFormVisible = true;
        },
        uploadPath(res, file, fileList) {
            if(res.errno === ERR_OK){
                this.form.icon = res.minData;
                this.form.image = res.data;
            }
        },
        remove(obj) {
            this.$confirm('此操作将永久删除商品, 是否继续?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                this.$http.delete(`/data/delete/food?column=${this.tabValue}&name=${obj.name}`).then((res) => {
                    res = res.body;
                    if (res.errno === ERR_OK) {
                        this.refresh();
                        this.$message({
                            type: 'success',
                            message: '删除成功!'
                        });
                    }
                }, () => { });
            }).catch(() => {
                this.$message({
                    type: 'info',
                    message: '已取消删除'
                });
            });
        },
        modifyConfirm() {
            this.$http.patch('/data/modify/food', {
                'column': this.tabValue,
                'oldName': this.oldName,
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
                    this.refresh();
                    this.$notify({
                        title: '成功',
                        message: '商品信息修改成功',
                        type: 'success'
                    });
                    this.$refs.uploadImg.clearFiles();
                    this.dialogFormVisible = false;
                }
            }, () => { });
        },
        handleRemove(file, fileList) {
            console.log(file, fileList);
        },
        handlePictureCardPreview(file) {
            this.dialogImageUrl = file.url;
            this.dialogVisible = true;
        },
        refresh() {
            this.$http.get('/data/goods').then((res) => {
                res = res.body;
                if (res.errno === ERR_OK) {
                    this.goods = res.data;
                }
            }, () => { });
        }
    }
};
</script>

<style scoped lang="scss" type="text/css" rel="stylesheet/scss">
.navTab {
    height: 100%;
    .image {
        display: inline-block;
        border-radius: 2px
    }
}
</style>
