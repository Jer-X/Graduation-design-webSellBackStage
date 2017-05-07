<template>
    <div id="seller">
        <el-row class="row">
            <el-col :span="12" :offset="6">
                <el-card>
                    <el-form ref="seller" :model="form" label-width="100px">
                        <el-form-item label="商店名稱">
                            <el-input v-model="form.name" :disabled="disableValue"></el-input>
                        </el-form-item>
                        <el-form-item label="商店地址">
                            <el-input v-model="form.address" :disabled="disableValue"></el-input>
                        </el-form-item>
                        <el-form-item label="商店配送">
                            <el-input v-model="form.description" :disabled="disableValue"></el-input>
                        </el-form-item>
                        <el-form-item label="商店起送價">
                            <el-input v-model="form.minPrice" :disabled="disableValue"></el-input>
                        </el-form-item>
                        <el-form-item label="商店公告">
                            <el-input placeholder="请输入内容" type="textarea" autosize v-model="form.bulletin" :disabled="disableValue"></el-input>
                        </el-form-item>
                        <el-form-item label="商店圖片" :class="{hide:disableValue}">
                            <el-upload ref="uploadImg" class="upload-demo" action="/data/file/seller" :on-success="uploadPath" :name='uploadName' list-type="picture">
                                <el-button size="small" type="primary">点击上传</el-button>
                            </el-upload>
                        </el-form-item>
                        <el-form-item>
                            <el-button type="primary" size="small" icon="edit" @click="changeValue()">{{this.buttonText}}</el-button>
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
            seller: {},
            fileList: [],
            disableValue: true,
            form: {
                name: '',
                address: '',
                description: '',
                minPrice: '',
                bulletin: ''
            },
            uploadName: 'seller'
        };
    },
    methods: {
        uploadPath(res, file, fileList) {
            if(res.errno === ERR_OK){
                this.fileList.push(res.data);
            }
            console.log(res,file,fileList);
        },
        changeValue() {
            if (this.disableValue === true) {
                this.disableValue = false;
            } else {
                this.$http.patch('/data/modify/seller', {
                    'name': this.form.name,
                    'address': this.form.address,
                    'description': this.form.description,
                    'minPrice': this.form.minPrice,
                    'bulletin': this.form.bulletin,
                    'pics': this.fileList
                }, { emulateJSON: true }).then((res) => {
                    res = res.body;
                    if (res.errno === ERR_OK) {
                        this.refresh();
                        this.$notify({
                            title: '成功',
                            message: '商家信息修改成功',
                            type: 'success'
                        });
                        this.$refs.uploadImg.clearFiles();
                        this.disableValue = true;
                    }
                }, () => { });
            }
        },
        refresh() {
            this.$http.get('/data/seller').then((res) => {
                res = res.body;
                if (res.errno === ERR_OK) {
                    this.seller = res.data[0];
                    this.form.name = this.seller.name;
                    this.form.address = this.seller.address;
                    this.form.description = this.seller.description;
                    this.form.minPrice = this.seller.minPrice;
                    this.form.bulletin = this.seller.bulletin;
                }
            }, () => { });
        }
    },
    computed: {
        buttonText() {
            if (this.disableValue === true) {
                return '編輯';
            } else {
                return '確認';
            }
        }
    },
    created() {
        this.$http.get('/data/seller').then((res) => {
            res = res.body;
            if (res.errno === ERR_OK) {
                this.seller = res.data[0];
                this.form.name = this.seller.name;
                this.form.address = this.seller.address;
                this.form.description = this.seller.description;
                this.form.minPrice = this.seller.minPrice;
                this.form.bulletin = this.seller.bulletin;
            }
        }, () => { });
    }
};
</script>

<style scoped lang="scss" type="text/css" rel="stylesheet/scss">
.row {
    margin-top: 60px;
    .hide {
        display: none;
    }
}
</style>
