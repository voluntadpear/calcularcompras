<template>
  <el-form label-position="top" size="medium">
    <el-row :gutter="40">
      <el-col :xs="24" :sm="12" :md="12">
        <el-form-item label="Precio">
          <el-input
            size="large"
            placeholder="Precio"
            v-model.lazy="price"
            v-money="money"
            suffix-icon="el-icon-goods"
          >
            <template slot="prepend"
              >USD</template
            >
          </el-input>
        </el-form-item>
      </el-col>
      <el-col :xs="24" :sm="12" :md="12">
        <el-form-item label="Peso">
          <el-input
            size="large"
            placeholder="Peso"
            v-model.number="weight"
            suffix-icon="el-icon-menu"
          >
            <el-select
              v-model="metric"
              slot="prepend"
              class="input-with-select"
            >
              <el-option label="Libras" value="pounds" />
              <el-option label="Kilos" value="kilos" />
            </el-select>
          </el-input>
        </el-form-item>
      </el-col>
    </el-row>
    <el-row :gutter="40">
      <el-col :xs="24" :sm="12" :md="12">
        <el-form-item label="Courier">
          <el-select v-model="selectedCourier" filterable size="large">
            <el-option
              v-for="courier of couriers"
              :key="courier.key"
              :label="courier.label"
              :value="courier.key"
            />
          </el-select>
        </el-form-item>
      </el-col>
      <el-col :xs="24" :sm="12" :md="12">
        <el-form-item label="Categoría">
          <el-select v-model="selectedCategory" filterable size="large">
            <el-option
              v-for="category of categories"
              :key="category.key"
              :label="category.label"
              :value="category.key"
            />
          </el-select>
        </el-form-item>
      </el-col>
    </el-row>
  </el-form>
</template>
<script lang="ts">
import Vue from "vue";
import { Form, FormItem, Input, Select, Option, Row, Col } from "element-ui";
import { VMoney } from "v-money";

import { taxCategories, couriers } from "../data";

export default Vue.extend({
  components: {
    [Form.name]: Form,
    [FormItem.name]: FormItem,
    [Input.name]: Input,
    [Select.name]: Select,
    [Option.name]: Option,
    [Row.name]: Row,
    [Col.name]: Col
  },
  computed: {
    kilosWeight(): number {
      return this.metric === "kilos" ? this.weight : this.weight * 0.454;
    },
    predictedPrice(): number {
      const { pricePerKilo = 0 } =
        this.couriers.find(c => c.key === this.selectedCourier) || {};
      return this.rawPrice + this.kilosWeight * pricePerKilo;
    },
    rawPrice(): number {
      return Number(this.price.replace(/[^0-9.-]+/g, ""));
    }
  },
  watch: {
    predictedPrice(value: number) {
      this.$emit("predictedPrice", value);
    }
  },
  data() {
    return {
      price: "0",
      weight: 0,
      metric: "pounds",
      categories: taxCategories,
      couriers,
      selectedCategory: "",
      selectedCourier: "",
      money: {
        decimal: ".",
        thousands: ",",
        prefix: "$ ",
        precision: 2,
        masked: false /* doesn't work with directive */
      }
    };
  },
  directives: { money: VMoney }
});
</script>
<style scoped>
.input-with-select {
  width: 120px;
}

.el-select {
  display: block;
}
</style>
