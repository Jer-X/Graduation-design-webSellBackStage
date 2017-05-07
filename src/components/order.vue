<template>
    <el-tabs type="border-card">
        <el-tab-pane label="未完成訂單">
            <el-table :data="unfinishedOrders" style="width: 100%">
                <el-table-column type="expand">
                    <template scope="props">
                        <el-form label-position="left" inline class="demo-table-expand">
                            <div v-for="(food,index) in props.row.foods" :key="index">
                                <el-form-item label="商品名稱">
                                    <span>{{ food.name }}</span>
                                </el-form-item>
                                <el-form-item label="商品數量">
                                    <span>{{ food.count }}</span>
                                </el-form-item>
                            </div>
                        </el-form>
                    </template>
                </el-table-column>
                <el-table-column label="顧客座位" prop="desk">
                </el-table-column>
                <el-table-column label="訂單狀態" prop="progress">
                </el-table-column>
                <el-table-column label="是否付款" prop="pay">
                </el-table-column>
                <el-table-column label="操作">
                    <template scope="scope">
                        <el-button size="small" type="success" icon="check" @click="finished(scope.row)">已完成</el-button>
                    </template>
                </el-table-column>
            </el-table>
        </el-tab-pane>
        <el-tab-pane label="已完成訂單">
            <el-table :data="finishedOrders" style="width: 100%">
                <el-table-column type="expand">
                    <template scope="props">
                        <el-form label-position="left" inline class="demo-table-expand">
                            <div v-for="(food,index) in props.row.foods" :key="index">
                                <el-form-item label="商品名稱">
                                    <span>{{ food.name }}</span>
                                </el-form-item>
                                <el-form-item label="商品數量">
                                    <span>{{ food.count }}</span>
                                </el-form-item>
                            </div>
                        </el-form>
                    </template>
                </el-table-column>
                <el-table-column label="顧客座位" prop="desk">
                </el-table-column>
                <el-table-column label="訂單狀態" prop="progress">
                </el-table-column>
                <el-table-column label="是否付款" prop="pay">
                </el-table-column>
            </el-table>
        </el-tab-pane>
        <el-tab-pane label="全部訂單">
            <el-table :data="orders" style="width: 100%">
                <el-table-column type="expand">
                    <template scope="props">
                        <el-form label-position="left" inline class="demo-table-expand">
                            <div v-for="(food,index) in props.row.foods" :key="index">
                                <el-form-item label="商品名稱">
                                    <span>{{ food.name }}</span>
                                </el-form-item>
                                <el-form-item label="商品數量">
                                    <span>{{ food.count }}</span>
                                </el-form-item>
                            </div>
                        </el-form>
                    </template>
                </el-table-column>
                <el-table-column label="顧客座位" prop="desk">
                </el-table-column>
                <el-table-column label="訂單狀態" prop="progress">
                </el-table-column>
                <el-table-column label="是否付款" prop="pay">
                </el-table-column>
                <el-table-column label="操作">
                    <template scope="scope">
                        <el-button v-if="scope.row.progress === 'unfinished'" size="small" type="success" icon="check">已完成</el-button>
                    </template>
                </el-table-column>
            </el-table>
        </el-tab-pane>
    </el-tabs>
</template>

<script>
const ERR_OK = 0;

export default {
    data() {
        return {
            orders: []
        };
    },
    created() {
        this.$http.get('/data/order').then((res) => {
            res = res.body;
            if (res.errno === ERR_OK) {
                this.orders = res.data;
            }
        });
    },
    methods: {
        finished(obj) {
            this.$confirm('此操作将完成訂單, 是否確定?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                this.$http.patch('/data/modify/order', {
                    'id': obj._id,
                    'progress': '已完成'
                }, { emulateJSON: true }).then((res) => {
                    res = res.body;
                    if (res.errno === ERR_OK) {
                        this.refresh();
                        this.$notify({
                            title: '成功',
                            message: '訂單已完成',
                            type: 'success'
                        });
                    }
                }, () => { });
            }).catch(() => {
                this.$message({
                    type: 'info',
                    message: '訂單未完成'
                });
            });
        },
        refresh() {
            this.$http.get('/data/order').then((res) => {
                res = res.body;
                if (res.errno === ERR_OK) {
                    this.orders = res.data;
                }
            });
        }
    },
    computed: {
        finishedOrders() {
            let tmp = [];
            this.orders.forEach((order) => {
                if (order.progress === '已完成') {
                    tmp.push(order);
                }
            });
            return tmp;
        },
        unfinishedOrders() {
            let tmp = [];
            this.orders.forEach((order) => {
                if (order.progress === 'unfinished') {
                    tmp.push(order);
                }
            });
            return tmp;
        }
    }
};
</script>

<style scoped lang="scss" type="text/css" rel="stylesheet/scss">

</style>
