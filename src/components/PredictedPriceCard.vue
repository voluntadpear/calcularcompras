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
        <ul id="price-breakdown">
          <li>
            <strong>Precio original: </strong>USD ${{
              price.itemPrice | currency(2)
            }}
          </li>
          <li>
            <strong>Shipping hasta casilla en EE.UU: </strong>USD ${{
              price.usShippingCost | currency(2)
            }}
          </li>
          <li>
            <strong>Flete: </strong>USD ${{ price.shippingCost | currency(2) }}
          </li>
          <li>
            <strong>Impuestos Aduaneros: </strong>USD ${{
              price.taxes | currency(2)
            }}
          </li>
        </ul>
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
    }
  },
  data() {
    return {
      rate: 0
    };
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
      return this.finalPrice * this.rate;
    }
  },
  async created() {
    const {
      dolarpy: {
        cambioschaco: { venta: rate }
      }
    } = await (await fetch("https://dolar.melizeche.com/api/1.0/")).json();
    this.rate = rate;
  },
  filters: {
    currency(value: number, decimals: number) {
      return value.toLocaleString("es-PY", { maximumFractionDigits: decimals });
    }
  }
});
</script>
<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.8s;
}
.fade-enter,
.fade-leave-to {
  opacity: 0;
}

#price-breakdown {
  text-align: start;
}
</style>
