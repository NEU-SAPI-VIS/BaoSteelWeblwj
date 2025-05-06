<template>
  <div>
    <el-card>
      <el-row>
        <el-button type="success" size="mini" round class="add-user" @click="addRecordVisible = !addRecordVisible">
          <i class="fa fa-plus" aria-hidden="true"></i>
          添加报警信息
        </el-button>
      </el-row>
      <el-row>
        <el-table :data="alarmData.slice( (currentPage - 1) * pageSize,currentPage * pageSize) " style="width: 100%" :default-sort="defaultSort" border>
          <el-table-column type="index" width="100" label="序号" align="center">
          </el-table-column>
          <el-table-column prop="type" label="报警类型" align="center">
          </el-table-column>
          <el-table-column prop="details" label="报警详情" width="300" align="center">
          </el-table-column>
          <el-table-column prop="alarmTime" label="报警时间" align="center">
          </el-table-column>
          <el-table-column prop="handleTime" label="处理时间" align="center">
          </el-table-column>
          <el-table-column prop="handleType" label="处理方式" align="center">
          </el-table-column>
          <el-table-column prop="handlePerson" label="处理人" align="center">
          </el-table-column>
          <el-table-column prop="phoneNum" label="联系方式" align="center">
          </el-table-column>
          <el-table-column label="操作" align="center">
            <template slot-scope="scope">
              <el-button type="primary" icon="el-icon-edit" circle @click="handleEdit(scope.$index, scope.row)"></el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-row>
    </el-card>
    <!-- 分页 -->
    <el-pagination class="custom-pagination" align="center" @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="currentPage" :page-sizes="[10, 30, 50]" :page-size="pageSize"
      layout="total, sizes, prev, pager, next, jumper" :total="alarmData.length">
    </el-pagination>
    <!-- 更新报警弹出的对话框 -->
    <el-dialog title="更新报警" :visible.sync="editAlarmFormVisible" width="30%">
      <el-form ref="form" :model="editForm" label-width="80px">
        <el-form-item label="报警类型:">
          <el-input v-model="editForm.type" :clearable="inputClear"></el-input>
        </el-form-item>
        <el-form-item label="报警详情:">
          <el-input v-model="editForm.details" :clearable="inputClear"></el-input>
        </el-form-item>
        <el-form-item label="报警时间:">
          <el-input v-model="editForm.alarmTime" :clearable="inputClear"></el-input>
        </el-form-item>
        <el-form-item label="处理时间:">
          <el-input v-model="editForm.handleTime" :clearable="inputClear"></el-input>
        </el-form-item>
        <el-form-item label="处理方式:">
          <el-input v-model="editForm.handleType" :clearable="inputClear"></el-input>
        </el-form-item>
        <el-form-item label="处理人:">
          <el-input v-model="editForm.handlePerson" :clearable="inputClear"></el-input>
        </el-form-item>
        <el-form-item label="联系方式:">
          <el-input v-model="editForm.phoneNum" :clearable="inputClear"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button @click="editAlarmFormVisible = !editAlarmFormVisible">取消</el-button>
          <el-button type="primary" @click="updateRecord">确定</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
    <!-- 添加报警信息弹出的对话框 -->
    <el-dialog title="添加报警信息" :visible.sync="addRecordVisible" width="30%">
      <el-form ref="form" :model="addRecordForm" label-width="80px">
        <el-form-item label="报警类型:">
          <el-input v-model="addRecordForm.type" :clearable="inputClear"></el-input>
        </el-form-item>
        <el-form-item label="报警详情:">
          <el-input v-model="addRecordForm.details" :clearable="inputClear"></el-input>
        </el-form-item>
        <el-form-item label="报警时间:">
          <el-input v-model="addRecordForm.alarmTime" :clearable="inputClear"></el-input>
        </el-form-item>
        <el-form-item label="处理时间:">
          <el-input v-model="addRecordForm.handleTime" :clearable="inputClear"></el-input>
        </el-form-item>
        <el-form-item label="处理方式:">
          <el-input v-model="addRecordForm.handleType" :clearable="inputClear"></el-input>
        </el-form-item>
        <el-form-item label="处理人:">
          <el-input v-model="addRecordForm.handlePerson" :clearable="inputClear"></el-input>
        </el-form-item>
        <el-form-item label="联系方式:">
          <el-input v-model="addRecordForm.phoneNum" :clearable="inputClear"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button @click="addRecordVisible = !addRecordVisible">取消</el-button>
          <el-button type="primary" @click="addRecordConfirm">确定</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
  </div>
</template>

<script> 
import { alarmData } from 'utils/data.js'
import util from 'utils/util.js'
export default {
  name: 'user',
  data() {
    return {
      alarmData: alarmData,
      currentPage: 1,
      pageSize: 10,
      selectIndex: null,
      defaultSort: { prop: 'createTime', order: 'descending' },
      addAuthVisible: false,
      inputClear: true,
      editAlarmFormVisible: false,
      editForm: {
        type: "",
        details: "",
        alarmTime: "",
        handleTime: "",
        handleType: "",
        handlePerson: "",
        phoneNum: "",
      },
      // this.ediDialogVisible = !this.ediDialogVisible
      addRecordVisible: false,
      addRecordForm: {
        type: "",
        details: "",
        alarmTime: "",
        handleTime: "",
        handleType: "",
        handlePerson: "",
        phoneNum: "",
      },
    }
  },
  computed: {
  },


  methods: {
    // ...mapMutations(
    //   ['changeAlarmData']
    // ),
    // 删除用户
    // 改变页码
    handleSizeChange(val) {
      this.currentPage = 1;
      this.pageSize = val;
    },
    handleCurrentChange(val) {
      this.currentPage = val;
    },
    // 更新报警记录
    handleEdit(index, val) {
      this.editAlarmFormVisible = !this.editAlarmFormVisible
      this.editForm = { ...this.alarmData[index] }
      this.selectIndex = index;
    },
    updateRecord() {
      console.log(this.tableData);
      this.alarmData[this.selectIndex] = Object.assign(this.alarmData[this.selectIndex], this.editForm);
      this.editAlarmFormVisible = !this.editAlarmFormVisible
      this.$message({
        type: 'success',
        message: '更新成功!'
      });
    },
    // 添加record
    addRecordConfirm() {
      this.addRecordVisible = !this.addRecordVisible;
      this.addRecordForm.handleTime = util.timeFormat(new Date());
      this.alarmData.unshift(this.addRecordForm);
    },
  },
  watch: {
    getTestData: function () {
      this.changeTestData()
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
