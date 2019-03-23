<template>
  <el-card class="box-card">
    <h2>
      USD $<strong>{{ finalPrice | currency(2) }}</strong>
    </h2>
    <transition name="fade">
      <h3 v-if="priceGuaranies">(Gs. {{ priceGuaranies | currency(0) }})</h3>
    </transition>
    <el-collapse>
      <el-collapse-item title="Detalles">
        <table id="price-breakdown">
          <tbody>
            <tr>
              <td><strong>Precio original 📱: </strong></td>
              <td>
                USD
                <span class="price">${{ price.itemPrice | currency(2) }}</span>
              </td>
            </tr>
            <tr>
              <td><strong>Shipping EE.UU 🇺🇸: </strong></td>
              <td>
                USD
                <span class="price"
                  >${{ price.usShippingCost | currency(2) }}</span
                >
              </td>
            </tr>
            <tr>
              <td><strong>Flete 🚛: </strong></td>
              <td>
                USD
                <span class="price"
                  >${{ price.shippingCost | currency(2) }}</span
                >
              </td>
            </tr>
            <tr>
              <td><strong>Impuestos aduaneros 💸: </strong></td>
              <td>
                USD <span class="price">${{ price.taxes | currency(2) }}</span>
              </td>
            </tr>
          </tbody>
        </table>
      </el-collapse-item>
    </el-collapse>
  </el-card>
</template>
<script lang="ts">
import Vue from "vue";
import { Card, Collapse, CollapseItem } from "element-ui";
import { PricePrediction } from "@/components/PriceForm.vue";

export default Vue.extend({
  components: {
    [Card.name]: Card,
    [Collapse.name]: Collapse,
    [CollapseItem.name]: CollapseItem
  },
  props: {
    price: {
      type: Object as () => PricePrediction,
      required: true
    },
    dollarRate: {
      type: Number,
      default: 0
    }
  },
  computed: {
    finalPrice(): number {
      return (
        this.price.itemPrice +
        this.price.usShippingCost +
        this.price.shippingCost +
        this.price.taxes
      );
    },
    priceGuaranies(): number {
      return this.finalPrice * this.dollarRate;
    }
  },
  filters: {
    currency(value: number, decimals: number) {
      return value.toLocaleString("es-PY", { maximumFractionDigits: decimals });
    }
  }
});
</script>
<style scoped>
#price-breakdown td {
  padding-right: 20px;
  text-align: left;
}

span.price {
  font-weight: 500;
}
</style>
