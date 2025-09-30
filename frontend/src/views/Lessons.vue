<template>
  <main class="page">
    <header class="toolbar">
      <input v-model="q" placeholder="Search…" @input="load"/>
      <select v-model="sortKey" @change="applySort">
        <option value="subject">Subject</option>
        <option value="location">Location</option>
        <option value="price">Price</option>
        <option value="spaces">Spaces</option>
      </select>
      <button @click="toggleDir">{{ dir }}</button>
      <router-link to="/cart">Cart ({{ cartCount }})</router-link>
    </header>
    <section class="grid">
      <LessonCard v-for="l in view" :key="l._id" :lesson="l" @add="add"/>
    </section>
  </main>
</template>

<script>
import { getLessons } from '../api/lessons';
import { useCart } from '../stores/cart';
import LessonCard from '../components/LessonCard.vue';

export default {
  components:{ LessonCard },
  data:() => ({ 
    items:[], view:[], q:'', sortKey:'subject', dir:'ASC' 
  }),
  computed:{ cartCount(){ 
    return useCart().count; 
  } 
},
  async mounted(){ 
    await this.load(); 
  },
  methods:{
    async load(){ 
      this.items = await getLessons(this.q ? {q:this.q} : {});
      this.view = [...this.items]; this.applySort();
    },

    add(l){ 
      useCart().add({ id:l._id, title:l.subject, price:l.price }); 
      if(l.spaces > 0) {
        l.spaces--; 
      }
    },

    applySort(){ 
      const k = this.sortKey, d = this.dir === 'ASC' ? 1 : -1;
      this.view.sort((a,b) => (a[k] > b[k] ? 1 : a[k] < b[k] ? -1 : 0) * d); 
    },

    toggleDir(){ 
      this.dir = this.dir === 'ASC' ? 'DESC' : 'ASC'; 
      this.applySort(); 
    }
  }
};
</script>

<style scoped>
.page{
  padding:1rem;
  max-width:1100px;
  margin:0 auto
}
.toolbar{
  display:flex;
  gap:.5rem;
  flex-wrap:wrap;
  margin-bottom:1rem
}
.grid{
  display:grid
  ;gap:1rem;
  grid-template-columns:repeat(auto-fill,minmax(240px,1fr))
  }
</style>