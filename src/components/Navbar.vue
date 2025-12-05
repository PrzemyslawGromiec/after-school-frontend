<template>
  <nav class="bar nav">
    <div class="wrap">
      <router-link to="/">Lessons</router-link>
      <router-link to="/cart" class="cart" :class="{ 'has-items': cart.count > 0 }">
        Cart <span class="badge">{{ cart.count }}</span>
      </router-link>
      <router-link to="/feedback">Feedback</router-link>
    </div>
  </nav>
</template>

<script>
import { useCart } from '../stores/cart.js';
export default { computed: { cart: () => useCart() } };
</script>
