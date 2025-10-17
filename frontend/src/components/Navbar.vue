<template>
  <nav class="nav">
    <router-link to="/">Lessons</router-link>
    <router-link to="/cart">Cart ({{ cart.count }})</router-link>
    <router-link to="/feedback">Feedback</router-link>
  </nav>
</template>

<script>
import { useCart } from '../stores/cart.js';
export default { computed:{ cart: () => useCart() } };
</script>

<style scoped>

.nav { 
  display:flex;
  gap:1rem; 
  padding:1rem; 
  border-bottom:1px solid #eee; }
</style>
