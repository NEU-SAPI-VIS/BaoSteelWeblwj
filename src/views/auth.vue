<template>
  <div>
    <el-card>
      <el-row>
        <el-button type="success" size="mini" round class="add-user" @click="addAuth">
          <i class="fa fa-plus" aria-hidden="true"></i>
          添加权限
        </el-button>
      </el-row>
      <el-row>
        <el-table :data="tableData.slice( (currentPage - 1) * pageSize,currentPage * pageSize) " style="width: 100%" :default-sort="defaultSort" border>
          <el-table-column type="index" width="100" label="序号" align="center">
          </el-table-column>
          <el-table-column prop="name" label="名称" align="center">
          </el-table-column>
          <el-table-column prop="type" label="类型" align="center">
          </el-table-column>
          <el-table-column prop="router" label="路由" align="center">
          </el-table-column>
          <el-table-column prop="description" label="描述" align="center">
          </el-table-column>
          <el-table-column prop="createTime" label="创建时间" width="300" align="center">
          </el-table-column>
        </el-table>
      </el-row>
    </el-card>
    <!-- 分页 -->
    <el-pagination class="custom-pagination" align="center" @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="currentPage" :page-sizes="[10, 30, 50]" :page-size="pageSize"
      layout="total, sizes, prev, pager, next, jumper" :total="tableData.length">
    </el-pagination>
    <!-- 更新用户弹出的对话框 -->
    <!-- 添加用户弹出的对话框 -->
    <el-dialog title="添加权限" :visible.sync="addAuthVisible" width="30%">
      <el-form ref="form" :model="addAuthForm" label-width="80px">
        <el-form-item label="名称:">
          <el-input v-model="addAuthForm.name" :clearable="inputClear"></el-input>
        </el-form-item>
        <el-form-item label="类型:">
          <el-input v-model="addAuthForm.type" :clearable="inputClear"></el-input>
        </el-form-item>
        <el-form-item label="路由:">
          <el-input v-model="addAuthForm.router" :clearable="inputClear"></el-input>
        </el-form-item>
        <el-form-item label="描述:">
          <el-input v-model="addAuthForm.description" :clearable="inputClear"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button @click="addAuthVisible = !addAuthVisible">取消</el-button>
          <el-button type="primary" @click="addAuthConfirm">确定</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
  </div>
</template>

<script> 
import { authData } from 'utils/data.js'
import util from 'utils/util.js'
export default {
  name: 'user',
  data() {
    return {
      tableData: authData,
      currentPage: 1,
      pageSize: 10,
      defaultSort: { prop: 'createTime', order: 'descending' },
      addAuthVisible: false,
      inputClear: true,
      addAuthForm: {
        name: '',//名称
        type: '',//联系方式
        router: '',//描述
        description: "",
        createTime: "",
      },
    }
  },
  computed: {},
  created() { },

  methods: {
    // 删除用户
    // 改变页码
    handleSizeChange(val) {
      this.currentPage = 1;
      this.pageSize = val;
    },
    handleCurrentChange(val) {
      this.currentPage = val;
    },
    // 添加权限
    addAuth() {
      this.addAuthVisible = !this.addAuthVisible
    },
    addAuthConfirm() {
      this.addAuthVisible = !this.addAuthVisible;
      this.addAuthForm.createTime = util.timeFormat(new Date());
      this.tableData.unshift(this.addAuthForm);
    },
    getTicket() {
      this
    }
  },
  mounted() {

  },
}
</script>

<style lang="scss" scoped>
.el-card {
   margin: 20px;
  .add-user {
    float: right;
  }
}
.custom-pagination {
  margin-top: 1rem;
}
</style>
