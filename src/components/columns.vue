<template>
    <div id="columns">
        <el-tabs v-model="activeName">
            <el-tab-pane label="欄目列表" name="first">
                <el-row>
                    <el-col :span='16' :offset='2'>
                        <el-table :data="tableData" stripe style="width: 100%">
                            <el-table-column prop="type" label="欄目類型" width="180" align='center'>
                            </el-table-column>
                            <el-table-column prop="name" label="欄目名稱" width="180" align='center'>
                            </el-table-column>
                            <el-table-column prop="foods.length" label="商品總數" align='center'>
                            </el-table-column>
                            <el-table-column label="操作" width="240">
                                <template scope="scope">
                                    <el-button size="small" type="primary" icon="edit" @click="modify(scope.row)">修改欄目</el-button>
                                    <el-button size="small" type="danger" icon="delete" @click="remove(scope.row)">刪除欄目</el-button>
                                </template>
                            </el-table-column>
                        </el-table>
                    </el-col>
                </el-row>
            </el-tab-pane>
        </el-tabs>
        <el-dialog title="修改欄目信息" v-model="dialogFormVisible">
            <el-form :model="column">
                <el-form-item label="欄目名稱">
                    <el-input v-model="column.name"></el-input>
                </el-form-item>
                <el-form-item label="欄目類型">
                    <el-input v-model="column.type"></el-input>
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
            activeName: 'first',
            tableData: [],
            typeName: ["一般", "滿減", "折扣", "特價", "發票", "保證"],
            column: {
                name: '',
                type: ''
            },
            dialogFormVisible: false
        };
    },
    methods: {
        modify(obj) {
            this.oldName = obj.name;
            this.column.name = obj.name;
            this.column.type = obj.type;
            this.dialogFormVisible = true;
        },
        modifyConfirm() {
            this.$http.patch('/data/modify/column', {
                'oldName': this.oldName,
                'name': this.column.name,
                'type': this.column.type,
            }, { emulateJSON: true }).then((res) => {
                res = res.body;
                if (res.errno === ERR_OK) {
                    this.refresh();
                    this.$notify({
                        title: '成功',
                        message: '欄目信息修改成功',
                        type: 'success'
                    });
                    this.dialogFormVisible = false;
                }
            }, () => { });
        },
        remove(obj) {
            this.$confirm('此操作将永久删除欄目以及下列所有商品, 是否继续?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                this.$http.delete(`/data/delete/column?column=${obj.name}`).then((res) => {
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
        refresh() {
            this.$http.get('/data/goods').then((res) => {
                res = res.body;
                if (res.errno === ERR_OK) {
                    this.tableData = res.data;
                }
            }, () => { });
        }
    },
    created() {
        this.$http.get('/data/goods').then((res) => {
            res = res.body;
            if (res.errno === ERR_OK) {
                this.tableData = res.data;
            }
        }, () => { });
    }
};
</script>

<style scoped lang="scss" type="text/css" rel="stylesheet/scss">

</style>
