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
          <el-form-item label="Peso" style="width: 100%;">
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
      <el-col :xs="24" :sm="12" :md="12">
        <el-form-item
          label="Envío e Impuestos EE.UU."
          class="opacity-transition"
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
      <el-col :xs="24" :sm="12" :md="12">
        <el-form-item
          label="Courier"
          class="opacity-transition"
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
    </el-row>
    <el-row :gutter="40" type="flex" class="wrap">
      <el-col :xs="24" :sm="12" :md="12" class="push-bottom">
        <el-form-item
          class="opacity-transition"
          :class="{ 'amz-disabled': secondRowDisabled }"
        >
          <el-checkbox
            aria-label="Plan con impuestos incluidos"
            size="large"
            v-model="taxIncludedPlan"
            class="full-checkbox"
            :disabled="
              onlyTaxIncludedPlanPricePerKilo || !hasTaxIncludedPlanPricePerKilo
            "
            border
            >Plan con impuestos incluidos</el-checkbox
          >
        </el-form-item>
      </el-col>
      <transition name="fade">
        <el-col :xs="24" :sm="12" :md="12" v-if="needsCategory">
          <el-form-item
            label="Categoría"
            class="opacity-transition"
            :class="{ 'amz-disabled': secondRowDisabled }"
          >
            <el-select v-model="selectedCategory" size="large" name="Categoría">
              <el-option
                v-for="category of sortedCategories"
                :key="category.key"
                :label="category.label"
                :value="category.key"
              />
            </el-select>
          </el-form-item>
        </el-col>
      </transition>
    </el-row>
    <el-row>
      <warnings-text
        :courier="courierRecord"
        :taxIncludedPlan="taxIncludedPlan"
      />
    </el-row>
  </el-form>
</template>
<script lang="ts">
import Vue from "vue";
import { VMoney } from "v-money";
import currency from "currency.js";

import {
  taxCategories,
  couriers,
  ivaCasualTax,
  Courier,
  Category
} from "../data";
import ElMoneyInput from "./ElMoneyInput.vue";
import WarningsText from "./WarningsText.vue";

export interface PricePrediction {
  itemPrice: number;
  taxes: number;
  usShippingCost: number;
  shippingCost: number;
}

export default Vue.extend({
  components: {
    ElMoneyInput,
    WarningsText
  },
  directives: { money: VMoney },
  data() {
    const commonMoneyConfig = {
      decimal: ",",
      thousands: ".",
      precision: 2,
      masked: false /* doesn't work with directive */
    };
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
        ...commonMoneyConfig,
        prefix: "$ "
      },
      weightInputMoneyConfig: commonMoneyConfig
    };
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
        (this.needsCategory && !this.taxes)
      ) {
        return { ...response, shippingCost: 0 };
      }
      const { pricePerKilo = 0, taxIncludedPlanPricePerKilo = 0 } =
        this.courierRecord || {};
      const priceToUse = this.taxIncludedPlan
        ? taxIncludedPlanPricePerKilo
        : pricePerKilo;
      const pyShippingCost = this.kilosWeight * priceToUse;
      return { ...response, shippingCost: pyShippingCost };
    },
    taxes(): number {
      if (
        this.taxIncludedPlan ||
        (this.price >= 100 && !this.selectedCategory)
      ) {
        return 0;
      }
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
    },
    hasTaxIncludedPlanPricePerKilo(): boolean {
      const courier = this.courierRecord;
      if (courier) {
        const hasIt = Boolean(courier.taxIncludedPlanPricePerKilo);
        const isAboveLimit = Boolean(
          courier.taxIncludedPlanLimit &&
            this.price > courier.taxIncludedPlanLimit
        );
        return hasIt && !isAboveLimit;
      }
      return false;
    },
    onlyTaxIncludedPlanPricePerKilo(): boolean {
      const courier = this.courierRecord;
      return Boolean(
        courier && this.hasTaxIncludedPlanPricePerKilo && !courier.pricePerKilo
      );
    },
    needsCategory(): boolean {
      return Boolean(
        !this.secondRowDisabled &&
          !this.taxIncludedPlan &&
          this.selectedCourier &&
          this.price > 100
      );
    },
    sortedCategories(): Category[] {
      return this.categories.sort((a, b) => (a.label > b.label ? 1 : -1));
    }
  },
  watch: {
    predictedPrice(value: object) {
      this.$emit("predictedPrice", value);
    },
    hasTaxIncludedPlanPricePerKilo(value: boolean) {
      if (!value) {
        // reset checkbox
        this.taxIncludedPlan = false;
      } else {
        // use as preferred option
        this.taxIncludedPlan = true;
      }
    }
  }
});
</script>
<style scoped>
.el-select {
  display: block;
}

.amz-disabled {
  opacity: 0.25;
}

.opacity-transition {
  transition: opacity 0.5s;
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

.push-bottom {
  align-self: flex-end;
}

.wrap {
  flex-wrap: wrap;
}
</style>
