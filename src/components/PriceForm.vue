<template>
  <el-form label-position="top" :inline="true">
    <el-form-item label="Precio">
      <el-input placeholder="Precio" v-model.number="price" suffix-icon="el-icon-goods">
        <template slot="prepend">USD</template>
      </el-input>
    </el-form-item>
    <el-form-item label="Peso">
      <el-input placeholder="Peso" v-model.number="weight" suffix-icon="el-icon-menu">
        <el-select v-model="metric" slot="prepend" class="input-with-select">
          <el-option label="Libras" value="pounds" /> 
          <el-option label="Kilos" value="kilos" /> 
        </el-select>
      </el-input>
    </el-form-item>
    <el-form-item label="Categoría">
      <el-select v-model="selectedCategory" filterable>
        <el-option 
          v-for="category of categories"
          :key="category.key"
          :label="category.label"
          :value="category.key"
        />
      </el-select>
    </el-form-item>
  </el-form>
</template>
<script lang="ts">
import Vue from 'vue';
import {Form, FormItem, Input, Select, Option} from 'element-ui';

import {taxCategories} from '../data';

export default Vue.extend({
  components: {
    [Form.name]: Form,
    [FormItem.name]: FormItem,
    [Input.name]: Input,
    [Select.name]: Select,
    [Option.name]: Option,
  },
  computed: {
    predictedPrice(): number {
      return this.price * this.weight;
    },
  },
  watch: {
    predictedPrice(value: number) {
      this.$emit('predictedPrice', value);
    },
  },
  data() {
    return {
      price: 0,
      weight: 0,
      metric: 'pounds',
      categories: taxCategories,
      selectedCategory: '',
    };
  },
});
</script>
<style scoped>
.input-with-select {
  width: 90px;
}
</style>
