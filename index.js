 // Dados de exemplo — substitua por chamadas reais a uma API se quiser
    const produtos = [
      { id:1, nome:'Legging Essential', categoria:'Legging', price:179.9, img:'https://images.unsplash.com/photo-1526403224743-57a25a5d9a6e?q=80&w=800&auto=format&fit=crop&ixlib=rb-4.0.3&s=placeholder' },
      { id:2, nome:'Top Support', categoria:'Top', price:99.9, img:'https://images.unsplash.com/photo-1520975681912-7b6640a29b6f?q=80&w=800&auto=format&fit=crop&ixlib=rb-4.0.3&s=placeholder' },
      { id:3, nome:'Short Run', categoria:'Legging', price:129.9, img:'https://images.unsplash.com/photo-1542291026-7eec264c27ff?q=80&w=800&auto=format&fit=crop&ixlib=rb-4.0.3&s=placeholder' },
      { id:4, nome:'Cinta Modeladora', categoria:'Acessório', price:69.9, img:'https://images.unsplash.com/photo-1483985988355-763728e1935b?q=80&w=800&auto=format&fit=crop&ixlib=rb-4.0.3&s=placeholder' },
      { id:5, nome:'Mochila Sport', categoria:'Acessório', price:249.0, img:'https://images.unsplash.com/photo-1545964570-9fc4b6ea1aee?q=80&w=800&auto=format&fit=crop&ixlib=rb-4.0.3&s=placeholder' },
      { id:6, nome:'Top Seamless', categoria:'Top', price:119.0, img:'https://images.unsplash.com/photo-1543168253-5a3e31f0d9f6?q=80&w=800&auto=format&fit=crop&ixlib=rb-4.0.3&s=placeholder' }
    ];

    const productGrid = document.getElementById('productGrid');
    const searchInput = document.getElementById('search');
    const categorySelect = document.getElementById('filterCategory');
    const sortSelect = document.getElementById('sortBy');

    // Carrinho simples em memória
    let cart = [];

    function formatPrice(n){
      return n.toLocaleString('pt-BR', { style:'currency', currency:'BRL' });
    }

    function renderProducts(list){
      productGrid.innerHTML = '';
      list.forEach(p => {
        const card = document.createElement('article');
        card.className = 'card';
        card.innerHTML = `
          <img src="${p.img}" alt="${p.nome}" loading="lazy">
          <h3>${p.nome}</h3>
          <div class="tags"><span class="tag">${p.categoria}</span></div>
          <div class="price-row">
            <div class="price">${formatPrice(p.price)}</div>
            <div>
              <button class="ghost" onclick="quickView(${p.id})">Ver</button>
              <button class="btn" onclick="addToCart(${p.id})">Adicionar</button>
            </div>
          </div>
        `;
        productGrid.appendChild(card);
      })
    }

    function applyFilters(){
      const q = searchInput.value.trim().toLowerCase();
      const cat = categorySelect.value;
      let result = produtos.filter(p => {
        const matchQ = p.nome.toLowerCase().includes(q) || p.categoria.toLowerCase().includes(q);
        const matchCat = cat ? p.categoria === cat : true;
        return matchQ && matchCat;
      });

      if(sortSelect.value === 'price_asc') result.sort((a,b)=>a.price-b.price);
      if(sortSelect.value === 'price_desc') result.sort((a,b)=>b.price-a.price);

      renderProducts(result);
    }

    // Eventos de filtros
    searchInput.addEventListener('input', applyFilters);
    categorySelect.addEventListener('change', applyFilters);
    sortSelect.addEventListener('change', applyFilters);

    // Quick view simples (usa alert pra simplicidade) — você pode trocar por modal
    function quickView(id){
      const p = produtos.find(x=>x.id===id);
      if(!p) return;
      alert(`${p.nome}\n\nCategoria: ${p.categoria}\nPreço: ${formatPrice(p.price)}`);
    }

    // Carrinho
    const cartBtn = document.getElementById('cartBtn');
    const cartDrawer = document.getElementById('cartDrawer');
    const cartCount = document.getElementById('cartCount');
    const cartItems = document.getElementById('cartItems');
    const cartTotal = document.getElementById('cartTotal');
    const closeCart = document.getElementById('closeCart');

    function updateCartUI(){
      cartCount.textContent = cart.reduce((s,i)=>s+i.qty,0);
      cartItems.innerHTML = '';
      let total = 0;
      cart.forEach(item=>{
        const p = produtos.find(x=>x.id===item.id);
        total += p.price * item.qty;
        const div = document.createElement('div');
        div.style.display='flex';div.style.justifyContent='space-between';div.style.marginBottom='8px';
        div.innerHTML = `<div>${p.nome} <small class='muted'>x${item.qty}</small></div><div>${formatPrice(p.price*item.qty)}</div>`;
        cartItems.appendChild(div);
      });
      cartTotal.textContent = formatPrice(total);
    }

    function addToCart(id){
      const found = cart.find(c=>c.id===id);
      if(found) found.qty++;
      else cart.push({id,qty:1});
      updateCartUI();
      cartDrawer.classList.add('open');
      cartDrawer.setAttribute('aria-hidden','false');
    }

    cartBtn.addEventListener('click', ()=>{
      cartDrawer.classList.toggle('open');
      const hidden = cartDrawer.getAttribute('aria-hidden') === 'true';
      cartDrawer.setAttribute('aria-hidden', String(!hidden));
    });
    closeCart.addEventListener('click', ()=>{cartDrawer.classList.remove('open');cartDrawer.setAttribute('aria-hidden','true')});

    document.getElementById('checkout').addEventListener('click', ()=>{
      if(cart.length===0){alert('Seu carrinho está vazio');return}
      alert('Obrigado pela compra — isto é apenas um mock (sem pagamento).');
      cart = [];
      updateCartUI();
      cartDrawer.classList.remove('open');
    });

    // Contact form (mock)
    document.getElementById('contactForm').addEventListener('submit', function(e){
      e.preventDefault();
      const nome = document.getElementById('nome').value;
      alert(`Obrigado, ${nome}! Recebemos sua mensagem.`);
      this.reset();
    });

    // Inicialização
    renderProducts(produtos);

    function scrollToProducts(){
      document.getElementById('produtos').scrollIntoView({behavior:'smooth'});
    }

    // Toggle filtros (apenas exemplo — abre/fecha painel básico)
    document.getElementById('toggleFilters').addEventListener('click', ()=>{
      const el = document.getElementById('filterCategory');
      el.focus();
    });