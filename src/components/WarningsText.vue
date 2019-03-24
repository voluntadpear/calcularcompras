<template>
  <div>
    <transition name="fade">
      <p class="warning" v-for="warning of warnings" :key="warning">
        <small>{{ warning }}</small>
      </p>
    </transition>
  </div>
</template>
<script>
export default {
  props: {
    courier: {
      type: Object,
      required: false
    },
    taxIncludedPlan: {
      type: Boolean,
      default: false
    }
  },
  computed: {
    warnings() {
      if (
        this.courier &&
        this.courier.key === "paraguaybox" &&
        this.taxIncludedPlan
      ) {
        return [
          "ParaguayBox ofree esta tarifa para compras de hasta USD 500 que no sean celulares, tablets, computadoras o smart watches."
        ];
      }
      return [];
    }
  }
};
</script>
<style scoped>
.warning {
  text-align: start;
  color: red;
}
</style>
