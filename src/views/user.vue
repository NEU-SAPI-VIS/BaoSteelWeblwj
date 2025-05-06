<template>
  <div>
    <el-card>
      <el-row>
        <el-button type="success" size="mini" round class="add-user" @click="addUser">
          <i class="fa fa-plus" aria-hidden="true"></i>
          添加用户
        </el-button>
      </el-row>
      <el-row>

        <el-table :data="tableData" style="width: 100%" :default-sort="defaultSort" border>
          <el-table-column type="index" width="100" label="序号"  align="center">
          </el-table-column>
          <el-table-column prop="name" label="名称" align="center">
          </el-table-column>
          <el-table-column prop="phoneNum" label="联系方式" align="center">
          </el-table-column>
          <el-table-column prop="ascription" label="所属项目" align="center">
          </el-table-column>
          <el-table-column prop="description" label="描述" align="center">
          </el-table-column>
          <el-table-column prop="roles" label="角色" width="300" align="center">
          </el-table-column>
          <el-table-column prop="createTime" label="创建时间" width="300" align="center">
          </el-table-column>
          <el-table-column fixed="right" label="操作" align="center">
            <template slot-scope="scope">
              <el-button type="primary" icon="el-icon-edit" circle @click="handleEdit(scope.$index, scope.row)"></el-button>
              <el-button type="danger" icon="el-icon-delete" circle @click="handleDelete(scope.$index, scope.row)"></el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-row>
    </el-card>
    <!-- 分页 -->
    <el-pagination class="custom-pagination" align="center" @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="currentPage" :page-sizes="[10, 30, 50]" :page-size="pageSize"
      layout="total, sizes, prev, pager, next, jumper" :total="tableData.length">
    </el-pagination>
    <!-- 更新用户弹出的对话框 -->
    <el-dialog title="更新用户" :visible.sync="ediDialogVisible" width="30%">
      <el-form ref="form" :model="editForm" label-width="80px">
        <el-form-item label="名称:">
          <el-input v-model="editForm.name" :clearable="inputClear"></el-input>
        </el-form-item>
        <el-form-item label="联系方式:">
          <el-input v-model="editForm.phoneNum" :clearable="inputClear"></el-input>
        </el-form-item>
        <el-form-item label="描述:">
          <el-input v-model="editForm.ascription" :clearable="inputClear"></el-input>
        </el-form-item>
        <el-form-item label="角色:">
          <el-select v-model="editForm.roles" placeholder="请选择角色">
            <el-option label="superadmin" value="superadmin"></el-option>
            <el-option label="admin" value="admin"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button @click="ediDialogVisible = !ediDialogVisible">取消</el-button>
          <el-button type="primary" @click="updateUser">确定</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
    <!-- 添加用户弹出的对话框 -->
    <el-dialog title="添加用户" :visible.sync="addUserVisible" width="30%">
      <el-form ref="form" :model="addUserForm" label-width="80px">
        <el-form-item label="名称:">
          <el-input v-model="addUserForm.name" :clearable="inputClear"></el-input>
        </el-form-item>
        <el-form-item label="联系方式:">
          <el-input v-model="addUserForm.phoneNum" :clearable="inputClear"></el-input>
        </el-form-item>
        <el-form-item label="所属项目:">
          <el-input v-model="addUserForm.ascription" :clearable="inputClear"></el-input>
        </el-form-item>
        <el-form-item label="描述:">
          <el-input v-model="addUserForm.description" :clearable="inputClear"></el-input>
        </el-form-item>
        <el-form-item label="角色:">
          <el-select v-model="addUserForm.roles" placeholder="请选择角色">
            <el-option label="superadmin" value="superadmin"></el-option>
            <el-option label="admin" value="admin"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button @click="addUserVisible = !addUserVisible">取消</el-button>
          <el-button type="primary" @click="addUserConfirm">确定</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
  </div>
</template>

<script> 
import { userData } from 'utils/data.js'
import util from 'utils/util.js'
export default {
  name: 'user',
  data() {
    return {
      selectIndex: null,
      tableData: userData,
      currentPage: 1,
      pageSize: 10,
      defaultSort: { prop: 'createTime', order: 'descending' },
      ediDialogVisible: false,
      inputClear: true,
      editForm: {
        name: '',//名称
        phoneNum: '',//联系方式
        ascription: '',//描述
        roles: '',
        description: "",
        createTime: "",
      },
      selectIndex: null,
      // 添加用户
      addUserVisible: false,
      addUserForm: {
        name: '',//名称
        phoneNum: '',//联系方式
        ascription: '',//描述
        roles: '',
        description: "",
        createTime: "",
      },
    }
  },
  computed: {},
  created() { },

  methods: {
    // 删除用户
    handleDelete(index) {
      this.$confirm('此操作将永久该角色, 是否继续?', '提示', {
        confirmButtonText: '确定', cancelButtonText: '取消', type: 'warning', center: true
      })
        .then(() => {
          this.tableData.splice(index, 1)
          this.$message({
            type: 'success',
            message: '删除成功!'
          });
        })
        .catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          });
        });
    },
    // 改变页码
    handleSizeChange(val) {
      this.pageSizes = val;
    },
    handleCurrentChange(val) {
      this.currentPage = val;
    },
    // 更新用户
    handleEdit(index, val) {
      this.ediDialogVisible = !this.ediDialogVisible
      console.log('tableData', this.tableData[index]);
      this.editForm = { ...this.tableData[index] }
      console.log('editForm', this.editForm);
      this.selectIndex = index;
    },
    updateUser() {
      this.tableData[this.selectIndex] = Object.assign(this.tableData[this.selectIndex], this.editForm);
      this.ediDialogVisible = !this.ediDialogVisible
      this.$message({
        type: 'success',
        message: '更新成功!'
      });
    },
    // 添加用户
    addUser() {
      this.addUserVisible = true
    },
    addUserConfirm() {
      console.log(util.timeFormat);
      this.addUserVisible = !this.addUserVisible;
      this.addUserForm.createTime = util.timeFormat(new Date());
      this.tableData.unshift(this.addUserForm);
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
