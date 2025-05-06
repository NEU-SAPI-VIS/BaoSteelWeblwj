<template>
  <div class="my-table">
    <el-table :data="tableData.slice( (currentPage - 1) * pageSize,currentPage * pageSize) " ref="dragTable" border height="calc(500px 48px)">
      <el-table-column type="index" width="50"></el-table-column>
      <el-table-column v-for="column in tableHead" :key="column.en" :prop="column.en" :label="column.ch" align="center" :width="column.width">
        <el-table-column v-for="child in column.children" :key="child.en" :label="child.ch" :prop="child.en" align="center" :width="child.width" />
      </el-table-column>
      <el-table-column width="100px" label="规格" align="center" prop="steelspec">
        <template slot-scope="{ row }">
          <el-tag size="small" :color="row.steelSpec.color" style="color: #000">{{row.steelSpec.name}}</el-tag>
        </template>
      </el-table-column>
      <!-- 错误信息 -->
      <el-table-column width="60" label="异常" align="center" prop="tg_flag">
        <template slot-scope="scope">
          <fault-icon :tableUpid="scope.row.upid" :faultTag="scope.row.tg_flag" />
        </template>
      </el-table-column>
      <!-- 详情页 -->
      <el-table-column label="详情" id="actionCol" width="75" align="center">
        <template slot-scope="scope">
          <el-button type="text" size="mini" @click="handleClick(scope.row, $event)">S</el-button>
          <!-- <el-button v-for="item in detailForm" @click="handleClick(scope.row, item)" :key="item" type="text" size="mini">{{ item }}</el-button> -->
        </template>
      </el-table-column>
    </el-table>
    <!-- 分页 -->
    <el-pagination class="custom-pagination" align="center" @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="currentPage" :page-sizes="[20, 50, 100]" :page-size="pageSize"
      layout="total, sizes, prev, pager, next, jumper" :total="tableData.length">
    </el-pagination>
  </div>
</template>
<script>
// import tableData from './data.json'
import faultIcon from './faultIcon.vue'
export default {
  components: {
    faultIcon
  },
  props: {
    tableData: {
      type: Array,
      default: function () {
        return [];
      },
    },
    tableHead: {
      type: Array,
      default: function () {
        return [];
      },
    },

  },
  data() {
    return {
      currentPage: 1,
      pageSize: 20,
    }
  },
  methods: {
    handleCurrentChange(val) {
      this.currentPage = val;
    },
    handleSizeChange(val) {
      this.currentPage = 1;
      this.pageSize = val;
    },
    handleClick(row, event) {
      this.$emit("show-detail", row, event.target.innerHTML);
    }
  },
  mounted() {
    this.$forceUpdate();
  }
}
</script>
<style lang="scss">
.my-table {
  .el-table {
    // margin-left: 20px;
    // 标题
    thead.has-gutter th {
      font-size: 12px;
      font-weight: 700;
      color: #000;
      padding: 6px;
      // border: false;
      // white-space: pre-wrap;
      // background: white;
    }
    // 表格页面
    .el-table__body-wrapper {
      .el-table__body {
        .el-table__row {
          td {
            padding: 5px 0;
            .cell {
              font-weight: 400;
              font-size: 12px;
              font-weight: 200;
              opacity: 0.9;
            }
          }
        }
      }
    }
  }
  .custom-pagination {
    margin-top: 1rem;
  }
}
</style>
