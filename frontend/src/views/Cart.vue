<template>
  <main class="page">
    <ul>
      <li v-for="it in cart.items" :key="it.id">
        {{ it.title }} x {{ it.qty }} — £{{ (it.price*it.qty).toFixed(2) }}
        <button @click="remove(it.id)">Remove</button>
      </li>
    </ul>
    <p>Total: £{{ cart.total.toFixed(2) }}</p>
  </main>
</template>
<script>
import { useCart } from '../stores/cart';
export default {
  computed:{ cart:()=>useCart() },
  methods:{ remove(id){ this.cart.remove(id); } }
};
</script>