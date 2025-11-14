<template>
  <main class="page">
    <h1 class="page-title">
      <img src="@/images/academic.png" alt="" class="title-icon" />
      After School Lessons
    </h1>
    <header class="toolbar" role="search">
      <div class="search">
        <input type="search" v-model="qInput" @input="onSearchInput" placeholder="Search lessons…"
          aria-label="Search lessons" />
        <button v-if="qInput" class="icon-btn" type="button" @click="clearSearch" aria-label="Clear search">×</button>
      </div>

      <label class="visually-hidden" for="sortKey">Sort by</label>
      <select id="sortKey" v-model="sortKey" @change="applySort" aria-label="Sort by">
        <option value="subject">Subject</option>
        <option value="location">Location</option>
        <option value="price">Price</option>
        <option value="spaces">Spaces</option>
      </select>

      <button class="icon-btn" type="button" @click="toggleDir"
        :aria-label="`Sort ${dir === 'ASC' ? 'descending' : 'ascending'}`">
        {{ dir === 'ASC' ? '⬆️' : '⬇️' }}
      </button>

    </header>

    <section class="grid">
      <LessonCard v-for="l in view" :key="l._id" :lesson="l" @add="add" />
    </section>
  </main>
</template>

<script>
import { getLessons } from '../api/lessons';
import { useCart } from '../stores/cart';
import LessonCard from '../components/LessonCard.vue';

export default {
  components: { LessonCard },
  data: () => ({
    items: [], view: [],
    q: '',              // current query used to fetch
    qInput: '',         // what user is typing
    sortKey: 'subject',
    dir: 'ASC',
    _qTimer: null
  }),
  computed: {
    cartCount() {
      return useCart().count;
    }
  },
  async mounted() {
    this.load();
  },
  methods: {
    async load() {
      this.items = await getLessons(this.q ? { q: this.q } : {});
      console.log('LESSONS FROM BACKEND:', this.items);
      this.view = [...this.items];
      this.applySort();
    },

    onSearchInput() {
      clearTimeout(this._qTimer);
      this._qTimer = setTimeout(async () => {
        this.q = this.qInput.trim();
        this.load();
      }, 300);
    },

    clearSearch() {
      this.qInput = '';
      this.q = '';
      this.load();
    },

    add(l) {
      useCart().add({ id: l._id, title: l.subject, price: l.price });
      if (l.spaces > 0) {
        l.spaces--;
      }
    },

    applySort() {
      const k = this.sortKey, d = this.dir === 'ASC' ? 1 : -1;
      this.view.sort((a, b) => (a[k] > b[k] ? 1 : a[k] < b[k] ? -1 : 0) * d);
    },

    toggleDir() {
      this.dir = this.dir === 'ASC' ? 'DESC' : 'ASC';
      this.applySort();
    }
  }
};
</script>

<style scoped>
.page {
  padding: 1rem;
  max-width: 1400px;
  margin: 0 auto;
}

.page-title {
  font-size: 2rem;
  font-weight: 700;
  text-align: center;
  margin-bottom: 1.5rem;
  color: #1e3a8a;
  letter-spacing: -0.5px;
  position: relative;
}

.page-title::after {
  content: "";
  display: block;
  width: 60px;
  height: 3px;
  background: #2563eb;
  margin: 0.5rem auto 0;
  border-radius: 2px;
}

.title-icon {
  width: 36px;
  height: 36px;
  object-fit: contain;
}

.visually-hidden {
  position: absolute !important;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0 0 0 0);
  white-space: nowrap;
  border: 0;
}

.toolbar {
  position: sticky;
  top: 0;
  z-index: 10;
  display: grid;
  grid-template-columns: 1fr auto auto auto;
  gap: .5rem;
  align-items: center;
  padding: .75rem 1rem;
  color: #111827;
  backdrop-filter: blur(6px);
  background: rgba(255, 255, 255, .7);
  border-bottom: 1px solid #e5e7eb;
  margin-bottom: 1rem;
}


.search {
  display: grid;
  grid-template-columns: 1fr auto;
  gap: .25rem;
  align-items: center;
  background: #f9fafb;
  border: 1px solid #d1d5db;
  border-radius: .5rem;
  padding: .25rem .5rem;
}

.search input {
  border: 0;
  background: transparent;
  padding: .5rem;
  outline: none;
  font-size: 1rem;
  color: #111827;
  caret-color: #111827;
}

.search input:focus {
  background: #fff;
  box-shadow: 0 0 0 3px rgba(37, 99, 235, .15);
}

.icon-btn {
  background: #eef2ff;
  border: 1px solid #c7d2fe;
  padding: .4rem .6rem;
  border-radius: .375rem;
  cursor: pointer;
  transition: background .15s, transform .1s;
}

.icon-btn:hover {
  background: #e0e7ff;
}

.icon-btn:active {
  transform: translateY(1px);
}

.badge {
  display: inline-block;
  min-width: 1.5rem;
  text-align: center;
  padding: .1rem .4rem;
  border-radius: 999px;
  background: #fff;
  color: #1e3a8a;
  font-weight: 700;
}

@media (max-width: 640px) {
  .toolbar {
    grid-template-columns: 1fr auto auto;
  }

}

select {
  background: #f9fafb;
  border: 1px solid #d1d5db;
  border-radius: .5rem;
  padding: .45rem .75rem;
  font-size: 1rem;
  color: #111827;
  cursor: pointer;
  transition: background .15s, border-color .15s;
}

select:focus {
  background: #fff;
  border-color: #2563eb;
  outline: none;
}

select:hover {
  background: #f3f4f6;
}

.grid {
  display: grid;
  gap: 1rem;
  grid-template-columns: repeat(5, 1fr);
}
</style>