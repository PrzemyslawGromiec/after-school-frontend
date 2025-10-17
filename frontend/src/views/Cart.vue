<template>
  <main class="page">
    <h1>Cart</h1>

    <section v-if="!items.length" class="empty">
      <p>Your cart is empty.</p>
      <router-link to="/">Browse lessons →</router-link>
    </section>

    <section v-else class="cart-wrap">
      <ul class="cart-list">
        <li v-for="it in items" :key="it.id" class="row">
          <div class="title">{{ it.title }}</div>
          <div class="price">£{{ it.price }}</div>

          <div class="qty">
            <button type="button" class="pill" @click="dec(it)" aria-label="Decrease quantity">−</button>
            <input type="number" min="1" v-model.number="it.qty" @change="onQtyChange(it)" aria-label="Quantity" />
            <button type="button" class="pill" @click="inc(it)" aria-label="Increase quantity">+</button>
          </div>

          <div class="subtotal">£{{ (it.price * it.qty).toFixed(2) }}</div>
          <button type="button" class="remove" @click="remove(it.id)" aria-label="Remove item">×</button>
        </li>
      </ul>

      <aside class="summary">
        <div class="line">
          <span>Items</span><strong>{{ count }}</strong>
        </div>
        <div class="line total">
          <span>Total</span><strong>£{{ total.toFixed(2) }}</strong>
        </div>
        <button class="primary wfull" type="button" @click="checkout">Checkout</button>
        <button class="secondary wfull" type="button" @click="clear">Clear cart</button>
      </aside>
    </section>
  </main>
</template>

<script>
import { useCart } from '@/stores/cart';
import { api } from '@/api/http';

export default {
  name: 'Cart',
  computed: {
    cart() { return useCart(); },
    items() { return this.cart.items || []; },
    count() { return this.cart.count ?? this.items.reduce((a, i) => a + i.qty, 0); },
    total() { return this.cart.total ?? this.items.reduce((a, i) => a + i.qty * i.price, 0); },
  },
  methods: {
    inc(it) {
      if (typeof this.cart.add === 'function') {
        this.cart.add({ id: it.id, title: it.title, price: it.price });
      } else {
        it.qty = (it.qty || 1) + 1;
      }
    },
    dec(it) {
      const idx = this.items.findIndex(x => x.id === it.id);
      if (idx === -1) return;
      if ((this.items[idx].qty || 1) > 1) this.items[idx].qty--;
      else this.items.splice(idx, 1);
    },
    remove(id) {
      const idx = this.items.findIndex(x => x.id === id);
      if (idx > -1) this.items.splice(idx, 1);
    },
    onQtyChange(it) {
      if (!it.qty || it.qty < 1) it.qty = 1;
    },
    clear() {
      if (typeof this.cart.clear === 'function') this.cart.clear();
      else this.cart.items = [];
    },
    async checkout() {
      const payload = {
        items: this.items.map(i => ({ id: i.id, qty: i.qty, price: i.price, title: i.title }))
      };
      try {
        const res = await api('/orders', { method: 'POST', body: JSON.stringify(payload) });
        alert(`Order placed! ID: ${res.orderId || 'OK'}`);
        this.clear();
        this.$router.push('/');
      } catch (e) {
        alert('Checkout failed: ' + (e.message || e));
      }
    }
  }
};
</script>

<style scoped>
.page {
  max-width: 900px;
  margin: 0 auto;
  padding: 1rem;
}

h1 {
  font-size: 2rem;
  font-weight: 700;
  text-align: center;
  margin-bottom: 1.5rem;
  color: #1e3a8a;
  letter-spacing: -.5px;
  position: relative;
}

h1::after {
  content: "";
  display: block;
  width: 60px;
  height: 3px;
  background: #2563eb;
  margin: .5rem auto 0;
  border-radius: 2px;
}

.empty {
  text-align: center;
  background: #f9fafb;
  border: 1px solid #e5e7eb;
  border-radius: .5rem;
  padding: 2rem;
}

.empty a {
  color: #2563eb;
}

.cart-wrap {
  display: grid;
  grid-template-columns: 1fr 280px;
  gap: 1rem;
}

@media (max-width: 840px) {
  .cart-wrap {
    grid-template-columns: 1fr;
  }
}

.cart-list {
  list-style: none;
  margin: 0;
  padding: 0;
  display: grid;
  gap: .75rem;
}

.row {
  display: grid;
  grid-template-columns: 1fr 90px 140px 110px 36px;
  /* title | price | qty | subtotal | remove */
  gap: .5rem;
  align-items: center;
  background: #fff;
  border: 1px solid #e5e7eb;
  border-radius: .5rem;
  padding: .75rem 1rem;
}

@media (max-width: 640px) {
  .row {
    grid-template-columns: 1fr 80px 1fr 36px;
    grid-template-areas:
      "title  price  qty  remove"
      "title  subtotal subtotal remove";
  }

  .title {
    grid-area: title;
  }

  .subtotal {
    grid-area: subtotal;
  }
}

.title {
  font-weight: 600;
  color: #111827;
}

.price,
.subtotal {
  color: #111827;
  white-space: nowrap;
}

.qty {
  display: inline-grid;
  grid-template-columns: auto 56px auto;
  gap: .25rem;
  align-items: center;
}

.qty input {
  width: 56px;
  text-align: center;
  padding: .35rem .25rem;
  border: 1px solid #d1d5db;
  border-radius: .375rem;
  background: #fff;
  color: #111827;
}

.pill {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  border: 1px solid #c7d2fe;
  background: #eef2ff;
  border-radius: 999px;
  cursor: pointer;
  transition: background .15s, transform .1s;
  color: #1e3a8a;
  font-size: 18px;
  font-weight: 600;
}

.pill:hover {
  background: #e0e7ff;
}

.pill:active {
  transform: translateY(1px);
}

input[type="number"]::-webkit-inner-spin-button,
input[type="number"]::-webkit-outer-spin-button {
  -webkit-appearance: none;
  margin: 0;
}

input[type="number"] {
  -moz-appearance: textfield;
}

.remove {
  border: none;
  background: transparent;
  color: #b91c1c;
  font-size: 1.25rem;
  cursor: pointer;
  line-height: 1;
}

.remove:hover {
  color: #7f1d1d;
}

.summary {
  position: sticky;
  top: 1rem;
  background: #f9fafb;
  border: 1px solid #e5e7eb;
  border-radius: .5rem;
  padding: 1rem;
  display: grid;
  gap: .5rem;
}

.line {
  display: flex;
  justify-content: space-between;
}

.total span {
  font-weight: 600;
}

.total strong {
  font-size: 1.125rem;
}

.primary,
.secondary {
  display: inline-block;
  text-align: center;
  padding: .6rem .9rem;
  border-radius: .5rem;
  border: 1px solid transparent;
  cursor: pointer;
  transition: background .15s, transform .1s;
}

.primary {
  background: #2563eb;
  color: #fff;
}

.primary:hover {
  background: #1e40af;
}

.secondary {
  background: #fff;
  border-color: #d1d5db;
  color: #111827;
}

.secondary:hover {
  background: #f3f4f6;
}

.wfull {
  width: 100%;
}
</style>