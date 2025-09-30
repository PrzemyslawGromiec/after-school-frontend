import { defineStore } from 'pinia';
export const useCart = defineStore('cart', {
  state: () => ({ items: [] }), // [{id,title,price,qty}]
  getters: {
    total: s => s.items.reduce((a,i)=>a+i.price*i.qty,0),
    count: s => s.items.reduce((a,i)=>a+i.qty,0)
  },
  actions: {
    add(item){ const f=this.items.find(x=>x.id===item.id); f?f.qty++:this.items.push({...item,qty:1}); },
    remove(id){ this.items = this.items.filter(i=>i.id!==id); },
    clear(){ this.items = []; }
  }
});