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
          <el-form-item label="Peso">
            <el-col :span="9">
              <el-select
                v-model="metric"
                label="Peso"
                class="metric-select"
                size="large"
              >
                <el-option label="Libras" value="pounds" />
                <el-option label="Kilos" value="kilos" />
                <el-option label="Onzas" value="ounces" />
              </el-select>
            </el-col>
            <el-col :span="15">
              <el-money-input
                size="large"
                placeholder="Peso"
                @input="weight = $event"
                :money="weightInputMoneyConfig"
                label="Peso"
                suffix-icon="el-icon-menu"
              >
              </el-money-input>
            </el-col>
          </el-form-item>
        </el-row>
      </el-col>
    </el-row>
    <el-row :gutter="40">
      <el-col :span="24">
        <el-form-item
          label="Envío e Impuestos EE.UU."
          :class="{ 'amz-disabled': secondRowDisabled }"
        >
          <el-money-input
            size="large"
            placeholder="Costo"
            @input="usShippingCost = $event"
            :money="currencyInputMoneyConfig"
            label="Envío e Impuestos EE.UU."
            suffix-icon="el-icon-tickets"
            :disabled="secondRowDisabled"
          >
            <template slot="prepend"
              >USD</template
            >
          </el-money-input>
        </el-form-item>
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
            :disabled="secondRowDisabled || taxIncludedPlan"
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
    <el-row
      :gutter="40"
      v-if="hasTaxIncludedPlanPricePerKilo && !onlyTaxIncludedPlanPricePerKilo"
    >
      <el-col :xs="12" :sm="12" :md="12">
        <el-form-item>
          <el-checkbox
            size="large"
            v-model="taxIncludedPlan"
            class="full-checkbox"
            >Plan con impuestos incluidos</el-checkbox
          >
        </el-form-item>
      </el-col>
    </el-row>
  </el-form>
</template>
<script lang="ts">
import Vue from "vue";
import { Form, FormItem, Select, Option, Row, Col, Checkbox } from "element-ui";
import { VMoney } from "v-money";
import currency from "currency.js";

import { taxCategories, couriers, ivaCasualTax, Courier } from "../data";
import ElMoneyInput from "./ElMoneyInput.vue";

export interface PricePrediction {
  itemPrice: number;
  taxes: number;
  usShippingCost: number;
  shippingCost: number;
}

export default Vue.extend({
  components: {
    [Form.name]: Form,
    [FormItem.name]: FormItem,
    [Select.name]: Select,
    [Option.name]: Option,
    [Row.name]: Row,
    [Col.name]: Col,
    [Checkbox.name]: Checkbox,
    ElMoneyInput
  },
  computed: {
    courierRecord(): Courier | undefined {
      return this.couriers.find(c => c.key === this.selectedCourier);
    },
    kilosWeight(): number {
      const kilosInPound = 0.4536;
      const kilosInOunce = 0.0283495;
      switch (this.metric) {
        case "pounds":
          return this.weight * kilosInPound;
        case "ounces":
          return this.weight * kilosInOunce;
        default:
          return this.weight;
      }
    },
    predictedPrice(): PricePrediction {
      const response = {
        itemPrice: (this.price as number) || 0,
        usShippingCost: (this.usShippingCost as number) || 0,
        taxes: (this.taxes as number) || 0
      };
      if (
        !this.selectedCourier ||
        !this.kilosWeight ||
        (!this.taxIncludedPlan && !this.taxes)
      ) {
        return { ...response, shippingCost: 0 };
      }
      const { pricePerKilo = 0, taxIncludedPlanPricePerKilo = 0 } =
        this.courierRecord || {};
      const priceToUse = this.hasTaxIncludedPlanPricePerKilo
        ? taxIncludedPlanPricePerKilo
        : pricePerKilo;
      const pyShippingCost = this.kilosWeight * priceToUse;
      return { ...response, shippingCost: pyShippingCost };
    },
    taxes(): number {
      if (this.taxIncludedPlan) {
        return 0;
      }
      if (this.price < 100 || this.taxIncludedPlan) {
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
    },
    hasTaxIncludedPlanPricePerKilo(): boolean {
      const courier = this.courierRecord;
      return Boolean(courier && courier.taxIncludedPlanPricePerKilo);
    },
    onlyTaxIncludedPlanPricePerKilo(): boolean {
      const courier = this.courierRecord;
      return Boolean(
        courier && this.hasTaxIncludedPlanPricePerKilo && !courier.pricePerKilo
      );
    }
  },
  watch: {
    predictedPrice(value: number) {
      this.$emit("predictedPrice", value);
    },
    hasTaxIncludedPlanPricePerKilo(value: boolean) {
      if (!value) {
        // reset checkbox
        this.taxIncludedPlan = false;
      } else if (this.courierRecord && !this.courierRecord.pricePerKilo) {
        this.taxIncludedPlan = true;
      }
    }
  },
  data() {
    return {
      price: 0,
      usShippingCost: 0,
      weight: 0,
      metric: "pounds",
      categories: taxCategories,
      couriers,
      selectedCategory: "",
      selectedCourier: "",
      taxIncludedPlan: false,
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

.full-checkbox {
  width: 100%;
}
</style>
