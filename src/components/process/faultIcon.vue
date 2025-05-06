<template>
  <div class="faultKindIcon" :key="tableUpid">
    <div :id="'color' + tableUpid" class="circleDiv"></div>
  </div>
</template>
<script>
export default {
  props: {
    tableUpid: {
      type: String,
    },
    faultTag: {
      type: Number
    }
  },
  data() {
    return {

    }
  },
  methods: {
    setColor() {
      ['#c65b24', '#94a7b7', '#71797e']; // [bad, good, noflag]
      const colors = {
        "0": "#eb5429",//bad
        "1": "#06d25d",//good
        "404": "#acb0ac"//noFlag
      }
      document.getElementById("color" + this.tableUpid).style.background = colors[this.faultTag]
    }
  },
  mounted() {
    // console.log("index", this.tableIndex);
    // console.log(this.faultTag);
    this.setColor();
  },
  updated() {
    this.setColor()
  },

}
</script>
<style lang="scss" scoped>
.faultKindIcon {
  // height: 29px;
  // width: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
}
.circleDiv {
  // align-items: center;
  border: 1px solid grey;
  width: 15px;
  padding: 0px;
  height: 15px;
  // width: 15px;
  // border-radius: 7px;
  border-radius: 50%;
  // margin-left: 5px;
  // margin-right: 3px;
}
</style>