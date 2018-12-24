<template>
  <el-form label-position="top" size="medium" lang="es-PY">
    <el-row :gutter="40">
      <el-col :xs="24" :sm="12" :md="12">
        <el-form-item label="Precio">
          <el-money-input
            size="large"
            placeholder="Precio"
            @input="price = $event"
            :money="currencyInputMoneyConfig"
            label="Precio"
            suffix-icon="el-icon-goods"
          >
            <template slot="prepend"
              >USD</template
            >
          </el-money-input>
        </el-form-item>
      </el-col>
      <el-col :xs="24" :sm="12" :md="12">
        <el-row type="flex" align="bottom">
          <el-col :span="9">
            <el-form-item>
              <el-select
                v-model="metric"
                label="Peso"
                class="metric-select"
                size="large"
              >
                <el-option label="Libras" value="pounds" />
                <el-option label="Kilos" value="kilos" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="15">
            <el-form-item label="Peso">
              <el-money-input
                size="large"
                placeholder="Peso"
                @input="weight = $event"
                :money="weightInputMoneyConfig"
                label="Peso"
                suffix-icon="el-icon-menu"
              >
              </el-money-input>
            </el-form-item>
          </el-col>
        </el-row>
      </el-col>
    </el-row>
    <el-row :gutter="40">
      <el-col :xs="24" :sm="12" :md="12">
        <el-form-item
          label="Courier"
          :class="{ 'amz-disabled': secondRowDisabled }"
        >
          <el-select
            v-model="selectedCourier"
            size="large"
            name="Courier"
            :disabled="secondRowDisabled"
          >
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
        <el-form-item
          label="Categoría"
          :class="{ 'amz-disabled': secondRowDisabled }"
        >
          <el-select
            v-model="selectedCategory"
            size="large"
            name="Categoría"
            :disabled="secondRowDisabled"
          >
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
import { Form, FormItem, Select, Option, Row, Col } from "element-ui";
import { VMoney } from "v-money";
import currency from "currency.js";

import { taxCategories, couriers, ivaCasualTax } from "../data";
import ElMoneyInput from "./ElMoneyInput.vue";

export default Vue.extend({
  components: {
    [Form.name]: Form,
    [FormItem.name]: FormItem,
    [Select.name]: Select,
    [Option.name]: Option,
    [Row.name]: Row,
    [Col.name]: Col,
    ElMoneyInput
  },
  computed: {
    kilosWeight(): number {
      return this.metric === "kilos" ? this.weight : this.weight * 0.454;
    },
    predictedPrice(): number {
      if (!this.selectedCourier || !this.kilosWeight || !this.taxes) {
        return 0;
      }
      const { pricePerKilo = 0 } =
        this.couriers.find(c => c.key === this.selectedCourier) || {};
      const shippingCost = this.kilosWeight * pricePerKilo;
      return this.price + shippingCost + this.taxes;
    },
    taxes(): number {
      if (this.price < 100) {
        return this.price * ivaCasualTax;
      }
      const category = this.categories.find(
        ({ key }) => key === this.selectedCategory
      );
      if (category) {
        return this.price * (category.tax / 100);
      }
      return 0;
    },
    secondRowDisabled(): boolean {
      return !this.price || !this.weight;
    }
  },
  watch: {
    predictedPrice(value: number) {
      this.$emit("predictedPrice", value);
    }
  },
  data() {
    return {
      price: 0,
      weight: 0,
      metric: "pounds",
      categories: taxCategories,
      couriers,
      selectedCategory: "",
      selectedCourier: "",
      currencyInputMoneyConfig: {
        decimal: ",",
        thousands: ".",
        prefix: "$ ",
        precision: 2,
        masked: false /* doesn't work with directive */
      },
      weightInputMoneyConfig: {
        decimal: ",",
        thousands: ".",
        precision: 2,
        masked: false /* doesn't work with directive */
      }
    };
  },
  directives: { money: VMoney }
});
</script>
<style scoped>
.el-select {
  display: block;
}

.amz-disabled {
  opacity: 0.25;
}

.metric-select {
  margin-bottom: 3px;
}

.metric-select >>> .el-input__inner {
  background-color: #f5f7fa;
  color: #909399;
}
</style>
