/* ═══════════════════════════════════════════════════════
   js/products.js
   Render categories, products grid, offers strip
═══════════════════════════════════════════════════════ */

var activeCategory = 'all';

/* ── Render the offers ticker ── */
function renderOffers() {
  var track = document.getElementById('offersTrack');
  if (!track) return;
  // Duplicate list for seamless loop
  var pills = OFFERS.concat(OFFERS).map(function (o) {
    return '<div class="offer-pill"><span>' + o.split(' ')[0] + '</span>' + o.split(' ').slice(1).join(' ') + '</div>';
  }).join('');
  track.innerHTML = pills;
}

/* ── Render category chips ── */
function renderCategories() {
  var grid = document.getElementById('catsGrid');
  if (!grid) return;
  grid.innerHTML = CATEGORIES.map(function (c) {
    return '<div class="cat-card' + (c.id === activeCategory ? ' active' : '') + '" onclick="filterCat(\'' + c.id + '\')">' +
      '<span class="cat-emoji">' + c.emoji + '</span>' +
      '<div class="cat-name">' + c.name + '</div>' +
    '</div>';
  }).join('');
}

/* ── Filter products by category and re-render ── */
function filterCat(catId) {
  activeCategory = catId;

  // Update active chip
  document.querySelectorAll('.cat-card').forEach(function (el, i) {
    el.classList.toggle('active', CATEGORIES[i] && CATEGORIES[i].id === catId);
  });

  // Update section title
  var titleEl = document.getElementById('productsTitle');
  if (catId === 'all') {
    titleEl.innerHTML = '🔥 Top <span>Picks</span>';
  } else {
    var cat = CATEGORIES.find(function (c) { return c.id === catId; });
    titleEl.innerHTML = cat ? cat.emoji + ' ' + cat.name : '🛒 Products';
  }

  var filtered = catId === 'all' ? PRODUCTS : PRODUCTS.filter(function (p) { return p.cat === catId; });
  renderProducts(filtered);
}

/* ── Render product cards ── */
function renderProducts(products) {
  var grid = document.getElementById('productsGrid');
  if (!grid) return;

  if (!products.length) {
    grid.innerHTML =
      '<div style="grid-column:1/-1;text-align:center;padding:60px 20px;color:var(--gray-light);">' +
        '<div style="font-size:3rem;margin-bottom:12px;">🛒</div>' +
        '<div style="font-weight:700;">No products found</div>' +
        '<div style="font-size:.85rem;margin-top:4px;">Try a different category</div>' +
      '</div>';
    return;
  }

  grid.innerHTML = products.map(function (p) {
    var discount = Math.round((1 - p.price / p.mrp) * 100);
    var qty      = cart[p.id] || 0;

    var badgeHtml = p.badge
      ? '<div class="prod-badge' +
          (p.badge === 'New' ? ' new-badge' : p.badge === 'Organic' || p.badge === 'Season' ? ' offer' : '') +
          '">' + p.badge + '</div>'
      : '';

    var addBtnHtml = qty > 0
      ? '<div class="add-btn in-cart" data-pid="' + p.id + '">' +
          '<button class="minus" onclick="changeQty(' + p.id + ',-1);event.stopPropagation()">−</button>' +
          '<span class="qty">' + qty + '</span>' +
          '<button class="plus"  onclick="changeQty(' + p.id + ', 1);event.stopPropagation()">+</button>' +
        '</div>'
      : '<button class="add-btn" data-pid="' + p.id + '" onclick="addToCart(' + p.id + ')">+ Add</button>';

    return '<div class="product-card">' +
      '<div class="prod-img-wrap">' +
        '<img src="' + p.img + '" alt="' + p.name + '" loading="lazy" onerror="this.style.display=\'none\'">' +
        badgeHtml +
        '<div class="prod-time">⚡ ' + p.time + '</div>' +
      '</div>' +
      '<div class="prod-info">' +
        '<div class="prod-weight">' + p.weight + '</div>' +
        '<div class="prod-name">'   + p.name   + '</div>' +
        '<div class="prod-footer">' +
          '<div>' +
            '<span class="prod-price">₹' + p.price + '</span>' +
            '<span class="prod-mrp">₹'   + p.mrp   + '</span>' +
            '<div class="prod-discount">' + discount + '% OFF</div>' +
          '</div>' +
          '<div class="add-btn-wrap">' + addBtnHtml + '</div>' +
        '</div>' +
      '</div>' +
    '</div>';
  }).join('');
}
