<!--
 * @Author: 'DBC' '13230910115@163.com'
 * @Date: 2023-02-16 17:50:05
 * @LastEditors: 'DBC' '13230910115@163.com'
 * @LastEditTime: 2023-04-02 16:27:47
 * @FilePath: \vue_graduation\src\components\process\formsearch.vue
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
-->
<template>
  <div class="search-div">
    <el-form ref="ruleForm" :model="searchForm" label-width="120px" label-position="left">
      <el-form-item label="时间选择:">
        <el-date-picker v-model="searchForm.time" type="datetimerange" range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期" size="large">
        </el-date-picker>
      </el-form-item>
      <el-form-item label="聚类模式选择：">
        <el-radio v-model="searchForm.radio" label="1">HDBSCAN</el-radio>
        <el-radio v-model="searchForm.radio" label="2">网格划分</el-radio>
      </el-form-item>
      <el-form-item label="厚度精度选择：">
        <el-radio v-model="searchForm.thickRule" label="0.3">0.3mm</el-radio>
        <el-radio v-model="searchForm.thickRule" label="0.5">0.5mm</el-radio>
      </el-form-item>
      <el-form-item label="聚类规则选择：">
        <el-select v-model="searchForm.catRule">
          <el-option label="A" value="A"></el-option>
          <el-option label="B" value="B"></el-option>
          <el-option label="C" value="C"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="resetForm">重置</el-button>
        <el-button type="primary" @click="confirmForm">确定</el-button>
      </el-form-item>
      
    </el-form>
  </div>
</template>
<script>
export default {
  data() {
    return {
      searchForm: {
        time:  [new Date(2020, 6, 2, 1, 55), new Date(2020, 6, 2, 2, 50)],
        radio: "2",
        thickRule: "0.3",
        catRule: "A",
      },
      searchFormCopy: {
        time: ["", ""],
        radio: "",
        catRule: "",
      },
     

    }
  },
  methods: {
    confirmForm() {
      this.$emit("clickSearch", this.searchForm)
    },
    resetForm() {
      this.searchForm = Object.assign(this.searchForm, this.searchFormCopy);
    },
  },
  mounted() {
  },
}
</script>
<style lang="scss" scoped>
.search-div {
  font-weight: bold;
  display: flex;
  .el-form {
    margin: 20px auto;
    // border: 2px solid ;
    .el-form-item__label {
      font-size: 24px;
    }
  }
  // .el-col-8 {
  //   margin-left: 100px;
  // }
}
</style>