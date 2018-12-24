<template>
  <el-input v-model.lazy="inputValue" v-money="money" v-bind="$attrs">
    <!-- Let's pass any named slot to the el-input -->
    <slot
      v-for="(content, slotName) of $slots"
      :name="slotName"
      :slot="slotName"
    />
  </el-input>
</template>
<script lang="ts">
import Vue from "vue";
import { Input } from "element-ui";
import { VMoney } from "v-money";
import currency from "currency.js";

export default Vue.extend({
  components: {
    [Input.name]: Input
  },
  props: {
    money: {
      type: Object,
      required: true
    }
  },
  data() {
    return {
      inputValue: "0"
    };
  },
  computed: {
    parsedValue(): number {
      return currency(this.inputValue, { separator: ".", decimal: "," }).value;
    }
  },
  watch: {
    parsedValue(value) {
      this.$emit("input", value);
    }
  },
  directives: {
    money: VMoney
  }
});
</script>
