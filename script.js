// MercadoChat PWA - Complete, Stabilized & Professional Script
(function() {
    console.log('MercadoChat script.js: Initializing Complete System...');

    // --- 1. Global State Management ---
    const loadState = () => {
        try {
            window.buyerOrders = JSON.parse(localStorage.getItem('buyerOrders')) || [];
            window.favorites = JSON.parse(localStorage.getItem('favorites')) || [];
            
            // Seller Data
            let store = JSON.parse(localStorage.getItem('myStoreData'));
            if (!store || !store.phone || store.phone === "") {
                store = { name: "Tienda de Prueba", phone: "04140000000", password: "1234", paymentMethods: [] };
                localStorage.setItem('myStoreData', JSON.stringify(store));
            }
            window.myStoreData = store;
            window.myStorePaymentMethods = store.paymentMethods || [];
            window.myStorePaymentMethods = store.paymentMethods || [];

            window.currentStoreExcelItems = JSON.parse(localStorage.getItem('currentStoreExcelItems')) || [];
            window.sellerOrders = JSON.parse(localStorage.getItem('sellerOrders')) || [];
            window.sellerLoggedIn = localStorage.getItem('sellerLoggedIn') === 'true';
            window.allGlobalOrders = JSON.parse(localStorage.getItem('allGlobalOrders')) || [];
            window.allRatings = JSON.parse(localStorage.getItem('allRatings')) || [];
            window.currentBuyer = JSON.parse(localStorage.getItem('currentBuyer')) || null;
            window.allRegisteredStores = JSON.parse(localStorage.getItem('allRegisteredStores')) || [
                { name: 'iTech Store', category: 'Tecnología', description: 'Expertos en Apple y accesorios.', phone: '584140000000', logo: 'https://images.unsplash.com/photo-1695048133142-1a20484d256e?auto=format&fit=crop&w=150&q=80', verified: true, paymentMethods: [] },
                { name: 'SportCenter', category: 'Moda', description: 'Ropa deportiva de alta calidad.', phone: '584140000000', logo: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=150&q=80', verified: true, paymentMethods: [] }
            ];

            // Buyer Data
            let buyers = JSON.parse(localStorage.getItem('registeredBuyers')) || [];
            if (buyers.length === 0) {
                buyers = [{ name: "Usuario Prueba", phone: "04141112233", password: "1234" }];
                localStorage.setItem('registeredBuyers', JSON.stringify(buyers));
            }
            window.registeredBuyers = buyers;

            window.currentBuyer = JSON.parse(localStorage.getItem('currentBuyer')) || null;
            window.exchangeRate = parseFloat(localStorage.getItem('exchangeRate')) || 36.50;
            window.mediationRequests = JSON.parse(localStorage.getItem('mediationRequests')) || [];
            window.supportRatings = JSON.parse(localStorage.getItem('supportRatings')) || [];
            window.supportAdmins = JSON.parse(localStorage.getItem('supportAdmins')) || [
                { user: 'Master', pass: 'M@t302414**', role: 'master' }
            ];
            window.currentSupportAdmin = null;
            window.supportLoggedIn = false;
            window.cart = [];

            // --- SEED DATA FOR TESTING ---
            if (window.mediationRequests.length === 0) {
                window.mediationRequests = [
                    { id: 1001, orderId: 501, reason: 'pago_no_reconocido', details: 'El comprador envió un capture falso.', status: 'pendiente', date: '30/4/2026, 10:00:00', requestedBy: 'vendedor' },
                    { id: 1002, orderId: 502, reason: 'producto_no_recibido', details: 'Ya pasaron 3 días y el vendedor no responde.', status: 'pendiente', date: '30/4/2026, 11:30:00', requestedBy: 'comprador' }
                ];
                localStorage.setItem('mediationRequests', JSON.stringify(window.mediationRequests));
            }

            if (window.allGlobalOrders.length === 0) {
                window.allGlobalOrders = [
                    { id: 501, storePhone: '04120000000', storeName: 'Tienda Demo', buyerPhone: '04141112233', buyerName: 'Juan Perez', total: 45.00, status: 'verificando', date: '30/4/2026' },
                    { id: 502, storePhone: '04120000000', storeName: 'Tienda Demo', buyerPhone: '04141112233', buyerName: 'Juan Perez', total: 12.50, status: 'pagado', date: '30/4/2026' }
                ];
                localStorage.setItem('allGlobalOrders', JSON.stringify(window.allGlobalOrders));
            }

            if (window.allRegisteredStores.length < 2) {
                const demoStore = { name: "Tienda Demo", phone: "04120000000", password: "1234", category: "Ropa", description: "Tienda de prueba", logo: "", ratings: [], verified: false };
                if (!window.allRegisteredStores.find(s => s.phone === demoStore.phone)) {
                    window.allRegisteredStores.push(demoStore);
                    localStorage.setItem('allRegisteredStores', JSON.stringify(window.allRegisteredStores));
                }
            }

            if (window.registeredBuyers.length < 2) {
                const demoBuyer = { name: "Juan Perez", phone: "04141112233", password: "1234", ratings: [] };
                if (!window.registeredBuyers.find(b => b.phone === demoBuyer.phone)) {
                    window.registeredBuyers.push(demoBuyer);
                    localStorage.setItem('registeredBuyers', JSON.stringify(window.registeredBuyers));
                }
            }
            // -----------------------------
        } catch (e) {
            console.error("State load error:", e);
            window.buyerOrders = []; window.favorites = []; window.cart = [];
        }
    };
    loadState();

    // --- 2. Helper Utilities ---
    window.getEl = (id) => document.getElementById(id);
    const getEl = window.getEl; // Maintain local reference for script performance
    const safeSetText = (id, text) => { const el = getEl(id); if (el) el.innerText = text; };
    
    window.showToast = function (title, desc) {
        const toast = getEl('toast-notification');
        if (!toast) return;
        safeSetText('toast-title', title);
        safeSetText('toast-desc', desc);
        toast.style.top = '20px';
        setTimeout(() => { toast.style.top = '-100px'; }, 3500);
    };

    // --- 3. Navigation System ---
    window.updateNavVisibility = function () {
        const isLogged = window.sellerLoggedIn || window.currentBuyer;
        if (getEl('nav-vender')) getEl('nav-vender').style.display = window.sellerLoggedIn ? 'none' : 'flex';
        if (getEl('nav-profile')) getEl('nav-profile').style.display = window.sellerLoggedIn ? 'flex' : 'none';
        if (getEl('header-avatar')) getEl('header-avatar').style.display = isLogged ? 'flex' : 'none';
        
        window.renderBottomNav();
    };

    window.renderBottomNav = function() {
        const nav = getEl('bottom-nav');
        if (!nav) return;

        if (!window.sellerLoggedIn && !window.currentBuyer) {
            nav.style.display = 'none';
            return;
        }

        nav.style.display = 'flex';
        nav.innerHTML = '';

        if (window.currentBuyer) {
            // Buyer Nav
            nav.innerHTML = `
                <a class="nav-item ${window.currentActiveView === 'home-view' ? 'active' : ''}" onclick="switchMainView('home-view')">
                    <i class="fa-solid fa-house"></i><span>Inicio</span>
                </a>
                <a class="nav-item ${window.currentActiveView === 'favorites-view' ? 'active' : ''}" onclick="switchMainView('favorites-view')">
                    <i class="fa-solid fa-heart"></i><span>Favoritos</span>
                </a>
                <a class="nav-item ${window.currentActiveView === 'buyer-profile-view' ? 'active' : ''}" onclick="switchMainView('buyer-profile-view')">
                    <i class="fa-solid fa-bag-shopping"></i><span>Mis Pedidos</span>
                </a>`;
        } else if (window.sellerLoggedIn) {
            // Seller Nav
            nav.innerHTML = `
                <a class="nav-item ${window.currentActiveView === 'home-view' ? 'active' : ''}" onclick="switchMainView('home-view')">
                    <i class="fa-solid fa-house"></i><span>Inicio</span>
                </a>
                <a class="nav-item" onclick="showToast('Mi Banco', 'Próximamente: Gestión de pagos y billetera')">
                    <i class="fa-solid fa-building-columns"></i><span>Mi Banco</span>
                </a>
                <a class="nav-item ${window.currentActiveView === 'dashboard-view' ? 'active' : ''}" onclick="window.openMyProfile()">
                    <i class="fa-solid fa-chart-line"></i><span>Pedidos</span>
                </a>
                <a class="nav-item ${window.currentActiveView === 'dashboard-view' ? 'active' : ''}" onclick="window.openMyProfile()">
                    <i class="fa-solid fa-boxes-stacked"></i><span>Inventario</span>
                </a>`;
        }
    };

    window.currentActiveView = 'home-view';
    window.switchMainView = function (viewId) {
        console.log('Navigating to:', viewId);
        window.currentActiveView = viewId;
        const views = ['home-view', 'store-view', 'create-profile-view', 'dashboard-view', 'favorites-view', 'buyer-profile-view', 'support-view'];
        views.forEach(v => {
            const el = getEl(v);
            if (el) el.style.display = (v === viewId) ? 'block' : 'none';
        });

        if (viewId === 'buyer-profile-view') window.renderBuyerOrders();
        if (viewId === 'favorites-view') window.renderFavorites();
        if (viewId === 'dashboard-view') {
            window.renderDashboardInventory();
            window.renderSellerOrders();
            window.renderStorePaymentMethods();
        }
        if (viewId === 'support-view') {
            window.renderSupportRequests();
            window.renderSupportUsers();
            if (window.currentSupportAdmin?.role === 'master') window.renderSupportAgents();
        }
        window.updateHeaderNames();
        window.renderBottomNav();
        window.scrollTo(0, 0);
    };

    window.updateHeaderNames = function() {
        const sName = getEl('header-seller-name');
        const bName = getEl('header-buyer-name');
        if (sName) sName.innerText = (window.sellerLoggedIn && window.myStoreData) ? window.myStoreData.name : '';
        if (bName) bName.innerText = (window.currentBuyer) ? window.currentBuyer.name : '';
    };

    // --- 4. Main Feed & Categorías ---
    const categories = [
        { name: 'Inmuebles', icon: 'fa-house-chimney' },
        { name: 'Vehículos', icon: 'fa-car' },
        { name: 'Moda', icon: 'fa-shirt' },
        { name: 'Hogar', icon: 'fa-couch' },
        { name: 'Tecnología', icon: 'fa-laptop' },
        { name: 'Servicios', icon: 'fa-tools' }
    ];

    const products = [
        { id: 1, title: 'iPhone 15 Pro Max', price: 1200, image: 'https://images.unsplash.com/photo-1695048133142-1a20484d256e?auto=format&fit=crop&w=300&q=80', store: 'iTech Store', location: 'Chacao', phone: '584140000000', category: 'Tecnología' },
        { id: 2, title: 'Zapatos Nike Air', price: 95, image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=300&q=80', store: 'SportCenter', location: 'Las Mercedes', phone: '584140000000', category: 'Moda' },
        { id: 3, title: 'Laptop MacBook Air', price: 950, image: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&w=300&q=80', store: 'MacVentas', location: 'El Hatillo', phone: '584140000000', category: 'Tecnología' },
        { id: 4, title: 'Apartamento Lujo', price: 150000, image: 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=300&q=80', store: 'RealEstate Pro', location: 'Chacao', phone: '584140000000', category: 'Inmuebles' },
        { id: 5, title: 'Toyota Corolla 2024', price: 32000, image: 'https://images.unsplash.com/photo-1621007947382-bb3c3994e3fb?auto=format&fit=crop&w=300&q=80', store: 'AutoVentas', location: 'Las Mercedes', phone: '584140000000', category: 'Vehículos' }
    ];

    const services = [
        { name: 'Juan Pérez', category: 'Servicios', specialty: 'Electricista', rating: 4.8, reviews: 124, image: 'https://i.pravatar.cc/100?img=12', phone: '584140000000' },
        { name: 'Dra. Ana Sosa', category: 'Servicios', specialty: 'Odontóloga', rating: 4.9, reviews: 89, image: 'https://i.pravatar.cc/100?img=45', phone: '584140000000' },
        { name: 'TechFix', category: 'Tecnología', specialty: 'Reparación PC', rating: 4.7, reviews: 56, image: 'https://images.unsplash.com/photo-1597733336794-12d05021d510?auto=format&fit=crop&w=300&q=80', phone: '584140000000' }
    ];

    window.currentCategory = 'Todas';
    window.currentTab = 'products';
    window.currentSearchQuery = '';

    window.initFeed = function () {
        // Render Categories
        const catContainer = getEl('categories-container');
        if (catContainer) {
            catContainer.innerHTML = '';
            // Add "Todas" category
            const allChip = document.createElement('div');
            allChip.className = `category-chip ${window.currentCategory === 'Todas' ? 'active' : ''}`;
            allChip.onclick = () => window.filterByCategory('Todas');
            allChip.innerHTML = `<div class="category-icon"><i class="fa-solid fa-list"></i></div><span>Todas</span>`;
            catContainer.appendChild(allChip);

            categories.forEach(cat => {
                const chip = document.createElement('div');
                chip.className = `category-chip ${window.currentCategory === cat.name ? 'active' : ''}`;
                chip.onclick = () => window.filterByCategory(cat.name);
                chip.innerHTML = `<div class="category-icon"><i class="fa-solid ${cat.icon}"></i></div><span>${cat.name}</span>`;
                catContainer.appendChild(chip);
            });
        }

        const query = window.currentSearchQuery.toLowerCase();

        // Filter and Render Products
        const prodContainer = getEl('products-container');
        if (prodContainer) {
            prodContainer.innerHTML = '';
            const filteredProducts = products.filter(p => {
                const matchesCat = window.currentCategory === 'Todas' || p.category === window.currentCategory;
                const matchesSearch = !query || 
                    p.title.toLowerCase().includes(query) || 
                    p.category.toLowerCase().includes(query) ||
                    p.store.toLowerCase().includes(query);
                return matchesCat && matchesSearch;
            });
            
            if (filteredProducts.length === 0) {
                prodContainer.innerHTML = '<div class="empty-cart-msg" style="grid-column: 1/-1;">No se encontraron productos.</div>';
            } else {
                filteredProducts.forEach(p => {
                    const card = document.createElement('div');
                    card.className = 'product-card';
                    card.innerHTML = `
                        <div style="position: relative;">
                            <img src="${p.image}" class="product-image">
                            <button class="favorite-btn ${window.favorites.includes(p.id) ? 'active' : ''}" onclick="window.toggleFavorite(${p.id}, event)">
                                <i class="fa-${window.favorites.includes(p.id) ? 'solid' : 'regular'} fa-heart"></i>
                            </button>
                        </div>
                        <div class="product-info">
                            <h3>${p.title}</h3>
                            <div class="product-price">$${p.price}</div>
                            <div class="product-store"><i class="fa-solid fa-store"></i> ${p.store}</div>
                            <button class="btn-primary" onclick="window.openProfile('${p.store}', 'Tienda Verificada', '${p.phone}', 'Expertos en Apple', true, '${p.image}')">Ver Tienda</button>
                        </div>`;
                    prodContainer.appendChild(card);
                });
            }
        }

        // Filter and Render Stores
        const storesContainer = getEl('stores-container');
        if (storesContainer) {
            storesContainer.innerHTML = '';
            const filteredStores = window.allRegisteredStores.filter(s => {
                const matchesCat = window.currentCategory === 'Todas' || s.category === window.currentCategory;
                const matchesSearch = !query || 
                    s.name.toLowerCase().includes(query) || 
                    s.category.toLowerCase().includes(query) ||
                    (s.description && s.description.toLowerCase().includes(query));
                return matchesCat && matchesSearch;
            });

            if (filteredStores.length === 0) {
                storesContainer.innerHTML = '<div class="empty-cart-msg" style="grid-column: 1/-1;">No hay tiendas en esta categoría.</div>';
            } else {
                filteredStores.forEach(s => {
                    const card = document.createElement('div');
                    card.className = 'product-card';
                    card.innerHTML = `
                        <div style="padding: 20px; text-align: center; border-bottom: 1px solid var(--border-color);">
                            <img src="${s.logo || 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&w=150&q=80'}" style="width: 80px; height: 80px; border-radius: 50%; object-fit: cover; border: 3px solid var(--primary-color);">
                        </div>
                        <div class="product-info">
                            <h3 style="text-align: center;">${s.name}</h3>
                            <div style="font-size: 0.75rem; color: var(--text-secondary); text-align: center; margin-bottom: 8px;">${s.category}</div>
                            <p style="font-size: 0.8rem; color: var(--text-secondary); text-align: center; margin-bottom: 15px; display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden;">${s.description || 'Tienda oficial en MercadoChat.'}</p>
                            <button class="btn-primary" onclick="window.openProfile('${s.name}', '${s.category}', '${s.phone}', '${s.description}', true, '${s.logo}')">Visitar Tienda</button>
                        </div>`;
                    storesContainer.appendChild(card);
                });
            }
        }

        // Filter and Render Services
        const servContainer = getEl('services-container');
        if (servContainer) {
            servContainer.innerHTML = '';
            const filteredServices = services.filter(s => {
                const matchesCat = window.currentCategory === 'Todas' || s.category === window.currentCategory;
                const matchesSearch = !query || 
                    s.name.toLowerCase().includes(query) || 
                    (s.specialty && s.specialty.toLowerCase().includes(query)) ||
                    s.category.toLowerCase().includes(query);
                return matchesCat && matchesSearch;
            });

            if (filteredServices.length === 0) {
                servContainer.innerHTML = '<div class="empty-cart-msg">No se encontraron servicios.</div>';
            } else {
                filteredServices.forEach(s => {
                    const card = document.createElement('div');
                    card.className = 'service-card';
                    card.innerHTML = `
                        <div style="display: flex; gap: 15px; align-items: center;">
                            <img src="${s.image}" class="service-image">
                            <div style="flex: 1;">
                                <h3 class="product-title">${s.name}</h3>
                                <div style="font-size: 0.8rem; color: var(--text-secondary); margin-bottom: 5px;">${s.specialty || s.category}</div>
                                <div style="display: flex; align-items: center; gap: 4px; font-size: 0.8rem; color: #fbbf24;">
                                    <i class="fa-solid fa-star"></i> ${s.rating} (${s.reviews})
                                </div>
                            </div>
                        </div>
                        <div style="margin-top: 12px;">
                            <button class="btn-primary" style="width: 100%;" onclick="window.openProfile('${s.name}', '${s.category}', '${s.phone}', 'Profesional con amplia trayectoria.', false, '${s.image}')">Ver Perfil</button>
                        </div>`;
                    servContainer.appendChild(card);
                });
            }
        }
    };

    window.switchTab = function (tabName) {
        window.currentTab = tabName;
        window.currentCategory = 'Todas'; // Reset category on tab switch
        
        // Update button UI
        const btns = document.querySelectorAll('.tab-btn');
        btns.forEach(btn => {
            btn.classList.remove('active');
            if (btn.getAttribute('onclick').includes(tabName)) btn.classList.add('active');
        });

        if (tabName === 'products') {
            getEl('products-view').style.display = 'block';
            getEl('stores-view').style.display = 'none';
            getEl('services-view').style.display = 'none';
        } else if (tabName === 'stores') {
            getEl('products-view').style.display = 'none';
            getEl('stores-view').style.display = 'block';
            getEl('services-view').style.display = 'none';
        } else {
            getEl('products-view').style.display = 'none';
            getEl('stores-view').style.display = 'none';
            getEl('services-view').style.display = 'block';
        }
        window.initFeed();
    };

    window.filterByCategory = function (category) {
        window.currentCategory = category;
        window.initFeed();
        window.showToast("Filtro Aplicado", `Mostrando ${category}`);
    };

    // --- 5. Cart Logic ---
    window.toggleCart = function () {
        const panel = getEl('cart-panel');
        const overlay = getEl('cart-overlay');
        if (panel) panel.classList.toggle('active');
        if (overlay) overlay.style.display = (overlay.style.display === 'flex') ? 'none' : 'flex';
    };

    window.addToCart = function (product) {
        const existing = window.cart.find(it => it.title === product.title);
        if (existing) { existing.quantity++; } else { window.cart.push({ ...product, quantity: 1 }); }
        window.updateCartUI();
        window.showToast("Carrito", "Añadido al pedido");
    };

    window.updateCartUI = function () {
        const container = getEl('cart-items-container');
        if (!container) return;
        
        container.innerHTML = window.cart.length ? '' : '<div class="empty-cart-msg">Tu carrito está vacío</div>';
        let total = 0;
        window.cart.forEach((it, idx) => {
            const p = parseFloat(String(it.price).replace(/[^0-9.-]+/g, '')) || 0;
            total += p * it.quantity;
            const item = document.createElement('div');
            item.className = 'cart-item';
            item.innerHTML = `
                <img src="${it.image}" class="cart-item-img">
                <div class="cart-item-details">
                    <h4 class="cart-item-title">${it.title}</h4>
                    <div class="cart-item-price">$${p.toFixed(2)}</div>
                    <div class="cart-item-actions">
                        <button class="qty-btn" onclick="window.changeQty(${idx}, -1)"><i class="fa-solid fa-minus"></i></button>
                        <span class="qty-number">${it.quantity}</span>
                        <button class="qty-btn" onclick="window.changeQty(${idx}, 1)"><i class="fa-solid fa-plus"></i></button>
                    </div>
                </div>`;
            container.appendChild(item);
        });
        
        safeSetText('cart-total-price', `$${total.toFixed(2)}`);
        const badge = getEl('cart-badge');
        if (badge) {
            badge.innerText = window.cart.length;
            badge.style.display = window.cart.length ? 'flex' : 'none';
        }
    };

    window.changeQty = (idx, delta) => {
        window.cart[idx].quantity += delta;
        if (window.cart[idx].quantity < 1) window.cart.splice(idx, 1);
        window.updateCartUI();
    };

    // --- 6. Checkout & WhatsApp ---
    window.openCheckoutForm = function() {
        if (!window.cart.length) return;
        window.toggleCart();
        
        let subtotal = 0;
        window.cart.forEach(it => {
            const p = parseFloat(String(it.price).replace(/[^0-9.-]+/g, '')) || 0;
            subtotal += p * it.quantity;
        });
        
        window.currentSubtotal = subtotal;
        safeSetText('checkout-subtotal', `$${subtotal.toFixed(2)}`);
        
        getEl('checkout-modal').style.display = 'flex';
        window.updateDeliveryUI();
    };

    window.closeCheckoutForm = function() { getEl('checkout-modal').style.display = 'none'; };

    window.updateDeliveryUI = function() {
        const method = document.querySelector('input[name="delivery-method"]:checked').value;
        const details = getEl('delivery-details');
        const costDisplay = getEl('delivery-cost-display');
        const finalTotal = getEl('checkout-final-total');
        
        let deliveryCost = 0;
        if (method === 'delivery') {
            details.style.display = 'block';
            // Simulated calculation: 2.50 base + random distance factor (0 to 5$)
            deliveryCost = 2.50 + (Math.random() * 5);
            costDisplay.innerText = `$${deliveryCost.toFixed(2)}`;
        } else {
            details.style.display = 'none';
        }
        
        window.currentDeliveryCost = deliveryCost;
        const total = window.currentSubtotal + deliveryCost;
        finalTotal.innerText = `$${total.toFixed(2)}`;
    };

    window.processFinalCheckout = function() {
        const nameInput = getEl('checkout-name');
        const phoneInput = getEl('checkout-phone');
        const name = nameInput ? nameInput.value.trim() : "";
        const phone = phoneInput ? phoneInput.value.trim() : "";
        const methodEl = document.querySelector('input[name="delivery-method"]:checked');
        const method = methodEl ? methodEl.value : "pickup";
        const address = getEl('checkout-address') ? getEl('checkout-address').value.trim() : "";

        if (!name || !phone) { alert("Por favor, completa tu nombre y WhatsApp"); return; }
        if (method === 'delivery' && !address) { alert("Por favor, indica la dirección de entrega"); return; }
        
        const storePhone = window.cart[0].phone || '584140000000';
        const storeName = window.cart[0].store || 'Tienda';
        const orderId = Math.floor(Math.random() * 90000) + 10000;
        
        // Create Order Object
        const newOrder = {
            id: orderId,
            buyerName: name,
            buyerPhone: phone,
            storeName: storeName,
            storePhone: storePhone,
            items: [...window.cart],
            subtotal: window.currentSubtotal,
            deliveryCost: window.currentDeliveryCost,
            total: window.currentSubtotal + window.currentDeliveryCost,
            method: method,
            address: address,
            status: 'esperando_pago',
            date: new Date().toLocaleString(),
            timeline: [
                { status: 'recibido', title: 'Pedido Recibido', date: new Date().toLocaleString(), active: true }
            ],
            payment: null
        };

        window.allGlobalOrders.unshift(newOrder);
        localStorage.setItem('allGlobalOrders', JSON.stringify(window.allGlobalOrders));
        
        // Auto-identify buyer
        window.currentBuyer = { name: name, phone: phone };
        localStorage.setItem('currentBuyer', JSON.stringify(window.currentBuyer));

        const methodText = method === 'delivery' ? `🚚 ENVÍO A DOMICILIO\n📍 Dirección: ${address}\nCosto Envío: $${window.currentDeliveryCost.toFixed(2)}` : `🏪 RETIRO EN TIENDA`;
        const itemsText = window.cart.map(i => `• ${i.quantity}x ${i.title} ($${i.price})`).join('\n');
        const totalText = newOrder.total.toFixed(2);

        const msg = encodeURIComponent(
            `*MERCADOCHAT - NUEVO PEDIDO #${orderId}*\n\n` +
            `👤 Cliente: ${name}\n` +
            `📱 WhatsApp: ${phone}\n` +
            `--------------------------\n` +
            `${methodText}\n` +
            `--------------------------\n` +
            `📦 PRODUCTOS:\n${itemsText}\n` +
            `--------------------------\n` +
            `*TOTAL A PAGAR: $${totalText}*`
        );
        
        window.open(`https://wa.me/${storePhone}?text=${msg}`, '_blank');
        
        getEl('checkout-modal').style.display = 'none';
        window.cart = [];
        window.updateCartUI();
        window.showToast("Pedido Enviado", "Tu pedido ha sido registrado");
        window.switchMainView('buyer-profile-view');
    };

    // --- 7. Order Rendering & Logic ---
    window.renderBuyerOrders = function() {
        const container = getEl('buyer-orders-container');
        if (!container) return;
        
        const buyer = window.currentBuyer || JSON.parse(localStorage.getItem('currentBuyer'));
        const myOrders = window.allGlobalOrders.filter(o => o.buyerPhone === buyer?.phone);
        
        if (!buyer) {
            container.innerHTML = '<div class="empty-cart-msg">Identifícate realizando una compra para ver tus pedidos.</div>';
            return;
        }
        
        container.innerHTML = myOrders.length ? '' : '<div class="empty-cart-msg">No tienes pedidos recientes con el número ' + buyer.phone + '</div>';
        
        myOrders.forEach(o => {
            const card = document.createElement('div');
            // Auto-collapse if delivered
            const isCollapsed = o.status === 'entregado';
            card.className = `order-card ${isCollapsed ? 'collapsed' : ''}`;
            card.id = `order-buyer-${o.id}`;
            card.style.marginBottom = '20px';
            
            const statuses = [
                { id: 'recibido', title: 'Recibido' },
                { id: 'esperando_pago', title: 'Esperando Pago' },
                { id: 'verificando', title: 'Verificando Pago' },
                { id: 'pagado', title: 'Pagado' },
                { id: 'enviado', title: 'Enviado' },
                { id: 'entregado', title: 'Entregado' }
            ];

            const currentIdx = statuses.findIndex(s => s.id === o.status);

            let timelineHTML = '';
            statuses.forEach((s, idx) => {
                const isCompleted = idx < currentIdx;
                const isActive = idx === currentIdx;
                timelineHTML += `
                    <div class="timeline-item ${isCompleted ? 'completed' : ''} ${isActive ? 'active' : ''}">
                        <div class="timeline-content">
                            <div class="timeline-title">${s.title}</div>
                        </div>
                    </div>`;
            });

            card.innerHTML = `
                <div class="order-header" onclick="window.toggleOrderCard('order-buyer-${o.id}')">
                    <div>
                        <div class="order-id">Orden #${o.id}</div>
                        <div style="font-size: 0.75rem; color: var(--text-secondary);">${o.date}</div>
                    </div>
                    <div style="display: flex; align-items: center; gap: 10px;">
                        <span class="order-status-badge status-${o.status.replace('_','-')}">
                            ${o.status === 'enviado' && o.method === 'pickup' ? 'Listo para retirar' : o.status.replace('_',' ')}
                        </span>
                        <i class="fa-solid fa-chevron-down" style="color: var(--text-secondary);"></i>
                    </div>
                </div>
                <div class="order-body">
                    <div class="order-info-row" style="margin-top: 15px;">
                        <span class="order-info-label">Tienda:</span>
                        <span class="order-info-value">${o.storeName}</span>
                    </div>
                    <div class="order-info-row">
                        <span class="order-info-label">Total:</span>
                        <span class="order-info-value">$${o.total.toFixed(2)}</span>
                    </div>
                    
                    <div class="order-timeline">
                        ${timelineHTML}
                    </div>

                    ${o.paymentRejected ? `
                        <div style="background: rgba(239, 68, 68, 0.1); border: 1px solid #ef4444; border-radius: 8px; padding: 12px; margin-bottom: 15px; border-left: 4px solid #ef4444;">
                            <div style="color: #ef4444; font-weight: bold; font-size: 0.85rem; display: flex; align-items: center; gap: 8px; margin-bottom: 5px;">
                                <i class="fa-solid fa-circle-xmark"></i> PAGO RECHAZADO
                            </div>
                            <p style="font-size: 0.75rem; color: var(--text-primary); margin: 0;">Motivo: ${o.rejectionReason || 'No especificado'}</p>
                            <p style="font-size: 0.7rem; color: var(--text-secondary); margin-top: 5px;">Por favor, verifique sus datos y suba un nuevo comprobante válido.</p>
                        </div>
                    ` : ''}

                    <div class="order-actions">
                        ${o.status === 'esperando_pago' ? `
                            <button class="btn-primary" style="flex: 1; padding: 10px;" onclick="window.openPaymentModal(${o.id})">Pagar Ahora</button>
                        ` : ''}
                        ${o.status === 'enviado' ? `
                            <button class="btn-primary" style="flex: 1; padding: 10px; background: var(--secondary-color); border: none;" onclick="window.updateOrderStatus(${o.id}, 'entregado')">
                                ${o.method === 'pickup' ? 'Confirmar Retiro' : 'Confirmar Recepción'}
                            </button>
                        ` : ''}
                        ${o.status === 'entregado' && !o.buyerRated ? `
                            <button class="btn-primary" style="flex: 1; padding: 10px; background: #fbbf24; color: #000; border: none;" onclick="window.openRatingModal(${o.id}, 'store')">Calificar Vendedor <i class="fa-solid fa-star"></i></button>
                        ` : ''}
                        ${o.status === 'cancelado' ? `<p style="font-size: 0.85rem; color: #ef4444; text-align: center; width: 100%; border: 1px dashed #ef4444; padding: 10px; border-radius: 8px;"><i class="fa-solid fa-circle-exclamation"></i> Tu orden ha sido cancelada por falta de pago. Te invitamos a iniciar un nuevo proceso.</p>` : ''}
                        
                        <!-- Mediation Status -->
                        ${window.mediationRequests.find(r => r.orderId === o.id && r.status === 'en_atencion') ? `
                            <div style="background: rgba(96, 165, 250, 0.1); border: 1px solid #60a5fa; border-radius: 8px; padding: 10px; margin-bottom: 10px; text-align: center; color: #60a5fa; font-size: 0.8rem;">
                                <i class="fa-solid fa-headset"></i> Soporte está atendiendo tu caso. En breve recibirás indicaciones.
                            </div>
                        ` : ''}

                        ${window.mediationRequests.find(r => r.orderId === o.id && r.status === 'resuelto' && !r.userRatedService) ? `
                            <div style="background: rgba(16, 185, 129, 0.1); border: 1px solid #10b981; border-radius: 8px; padding: 10px; margin-bottom: 10px; text-align: center;">
                                <p style="color: #10b981; font-size: 0.8rem; margin-bottom: 8px;"><i class="fa-solid fa-circle-check"></i> Soporte ha resuelto tu caso.</p>
                                <button class="btn-primary" style="background: #10b981; border: none; font-size: 0.75rem; padding: 6px 12px;" onclick="window.openSupportRatingModal(${o.id})">Calificar Servicio</button>
                            </div>
                        ` : ''}
                        
                        ${o.status === 'recibido' ? `
                            <button class="btn-primary" onclick="window.openPaymentModal(${o.id})">Reportar Pago</button>
                            <button class="btn-text-primary" style="color: #ef4444; margin-top: 5px;" onclick="window.cancelOrder(${o.id}, 'comprador')"><i class="fa-solid fa-xmark"></i> Cancelar Pedido</button>
                        ` : ''}
                        ${o.status === 'verificando' ? `
                            <p style="font-size: 0.8rem; color: var(--secondary-color); text-align: center; width: 100%;"><i class="fa-solid fa-clock"></i> Esperando verificación...</p>
                            <button class="btn-text-primary" style="color: #ef4444; margin-top: 5px;" onclick="window.cancelOrder(${o.id}, 'comprador')">Cancelar Solicitud</button>
                        ` : ''}
                        ${o.status === 'pagado' ? `<p style="font-size: 0.8rem; color: var(--secondary-color); text-align: center; width: 100%;"><i class="fa-solid fa-box"></i> Pago verificado. Preparando envío...</p>` : ''}
                        ${o.status === 'entregado' && o.buyerRated ? `<p style="font-size: 0.8rem; color: var(--secondary-color); text-align: center; width: 100%;"><i class="fa-solid fa-check-double"></i> Compra Finalizada</p>` : ''}
                        <button class="btn-text-primary" style="width: 100%; margin-top: 10px; font-size: 0.75rem; color: #94a3b8;" onclick="window.openMediationModal(${o.id})">
                            <i class="fa-solid fa-headset"></i> Solicitar Soporte / Mediación
                        </button>
                    </div>
                </div>
            `;
            container.appendChild(card);
        });
    };

    window.renderSellerOrders = function() {
        const container = getEl('seller-orders-container');
        if (!container) return;
        
        const myStoreOrders = window.allGlobalOrders.filter(o => o.storePhone === window.myStoreData?.phone && !o.deletedBySeller);
        container.innerHTML = myStoreOrders.length ? '' : '<div class="empty-cart-msg">No has recibido pedidos aún</div>';
        
        myStoreOrders.forEach(o => {
            const card = document.createElement('div');
            const isCollapsed = o.status === 'entregado' || o.status === 'cancelado';
            card.className = `order-card ${isCollapsed ? 'collapsed' : ''}`;
            card.id = `order-seller-${o.id}`;
            card.innerHTML = `
                <div class="order-header" onclick="window.toggleOrderCard('order-seller-${o.id}')">
                    <div>
                        <div class="order-id">Orden #${o.id}</div>
                        <div style="font-size: 0.75rem; color: var(--text-secondary);">${o.buyerName} - ${o.date}</div>
                    </div>
                    <div style="display: flex; align-items: center; gap: 10px;">
                        <span class="order-status-badge status-${o.status.replace('_','-')}">
                            ${o.status === 'enviado' && o.method === 'pickup' ? 'Por Retirar' : o.status.replace('_',' ')}
                        </span>
                        <i class="fa-solid fa-chevron-down" style="color: var(--text-secondary);"></i>
                    </div>
                </div>
                <div class="order-body">
                    <div class="order-info-row" style="margin-top: 15px;">
                        <span class="order-info-label">Items:</span>
                        <span class="order-info-value">${o.items.length} productos</span>
                    </div>
                    <div class="order-info-row">
                        <span class="order-info-label">Monto:</span>
                        <span class="order-info-value">$${o.total.toFixed(2)}</span>
                    </div>
                    <div class="order-actions">
                        ${o.status === 'verificando' ? `
                            <button class="btn-primary" style="flex: 1; padding: 8px;" onclick="window.openVerifyPaymentModal(${o.id})">Ver Reporte</button>
                        ` : ''}
                        ${o.status === 'pagado' ? `
                            <button class="btn-primary" style="background: var(--primary-color); border: none;" onclick="window.updateOrderStatus(${o.id}, 'enviado')">
                                ${o.method === 'pickup' ? 'Listo para Retiro' : 'Marcar como Enviado'}
                            </button>
                        ` : ''}
                        ${(o.status === 'esperando_pago' || o.status === 'verificando') ? `
                            <button class="btn-text-primary" style="color: #ef4444; border: 1px solid #ef4444; padding: 8px; border-radius: 8px;" onclick="window.updateOrderStatus(${o.id}, 'cancelado')">Cancelar Orden</button>
                        ` : ''}
                        ${o.status === 'cancelado' || o.status === 'entregado' ? `
                            <button class="btn-text-primary" style="color: var(--text-secondary);" onclick="window.deleteOrderForSeller(${o.id})"><i class="fa-solid fa-trash"></i> Eliminar Historial</button>
                        ` : ''}
                        ${o.status === 'entregado' && !o.sellerRated ? `
                            <button class="btn-primary" style="background: #60a5fa; color: #fff; border: none; margin-bottom: 10px;" onclick="window.openRatingModal(${o.id}, 'Comprador')">
                                <i class="fa-solid fa-star"></i> Calificar Comprador
                            </button>
                        ` : ''}
                        ${o.status === 'entregado' && o.sellerRated ? `<p style="font-size: 0.8rem; color: #60a5fa; text-align: center; width: 100%;"><i class="fa-solid fa-star"></i> Comprador calificado</p>` : ''}
                        ${o.status === 'recibido' || o.status === 'verificando' ? `
                            <button class="btn-text-primary" style="color: #ef4444;" onclick="window.cancelOrder(${o.id}, 'vendedor')"><i class="fa-solid fa-ban"></i> Cancelar</button>
                        ` : ''}
                        <button class="btn-text-primary" onclick="window.contactBuyer('${o.buyerPhone}')"><i class="fa-brands fa-whatsapp"></i> Chat</button>
                        <button class="btn-text-primary" style="font-size: 0.75rem; color: #94a3b8;" onclick="window.openMediationModal(${o.id})">
                            <i class="fa-solid fa-headset"></i> Solicitar Soporte
                        </button>
                    </div>

                    ${o.paymentRejected ? `
                        <div style="background: rgba(239, 68, 68, 0.05); border: 1px dashed #ef4444; border-radius: 8px; padding: 10px; margin-top: 10px; display: flex; justify-content: space-between; align-items: center;">
                            <span style="font-size: 0.75rem; color: #ef4444; font-weight: bold;"><i class="fa-solid fa-triangle-exclamation"></i> Pago Rechazado</span>
                            <button class="btn-text-primary" style="font-size: 0.7rem; padding: 4px 8px; border: 1px solid #ef4444; color: #ef4444;" onclick="window.openVerifyPaymentModal(${o.id})">Ver Anterior</button>
                        </div>
                    ` : ''}

                    ${o.mediationActive ? `
                        <div style="margin-top: 15px; padding: 12px; background: rgba(239, 68, 68, 0.1); border: 1px solid rgba(239, 68, 68, 0.3); border-radius: 8px; border-left: 4px solid #ef4444;">
                            <div style="display: flex; align-items: center; gap: 10px; color: #f87171; font-weight: bold; font-size: 0.85rem; margin-bottom: 8px;">
                                <i class="fa-solid fa-triangle-exclamation" style="font-size: 1.1rem;"></i>
                                Su Comprador ha solicitado la intervención de Soporte
                            </div>
                            <button class="support-action-btn primary" style="padding: 8px; font-size: 0.75rem; background: #ef4444; color: #fff;" onclick="window.viewDisputeDetails(${o.id})">
                                <i class="fa-solid fa-file-invoice"></i> Ver Reporte / Ticket
                            </button>
                        </div>
                    ` : ''}
                </div>
            `;
            container.appendChild(card);
        });
    };

    window.toggleOrderCard = function(cardId) {
        getEl(cardId).classList.toggle('collapsed');
    };

    // --- 8. Payment & Verification Flow ---
    window.openPaymentModal = function(orderId) {
        window.activePaymentOrder = orderId;
        const order = window.allGlobalOrders.find(o => o.id === orderId);
        if (!order) return;
        const store = window.allRegisteredStores.find(s => s.phone === order.storePhone);
        
        // --- 1. Populate Summary ---
        safeSetText('pm-summary-id', `Orden #${order.id}`);
        safeSetText('pm-summary-total', `$${order.total.toFixed(2)}`);
        
        const detailsContainer = getEl('pm-summary-details');
        detailsContainer.innerHTML = order.items.map(it => `<div>• ${it.quantity}x ${it.title}</div>`).join('');
        
        // --- 2. Reset Modal State ---
        getEl('payment-options-container').style.display = 'block';
        getEl('report-payment-fields').style.display = 'none';
        getEl('pm-cancel-btn').style.display = 'block';
        getEl('pm-preview').style.display = 'none';
        getEl('pm-upload-ui').style.display = 'block';
        getEl('pm-ref').value = '';
        
        const container = getEl('payment-options-container');
        container.innerHTML = '';

        const methods = (store && store.paymentMethods && store.paymentMethods.length > 0) ? store.paymentMethods : [];

        if (methods.length === 0) {
            container.innerHTML = `<div style="text-align:center; padding:20px; font-size:0.9rem; color:var(--text-secondary);">
                Esta tienda aún no ha configurado métodos de pago automáticos.<br><br>
                <button class="btn-whatsapp" onclick="window.contactBuyer('${order.storePhone}')">Contactar por WhatsApp</button>
            </div>`;
        } else {
            methods.forEach(m => {
                const btn = document.createElement('button');
                btn.className = 'support-action-btn primary'; // Using the new professional class
                btn.style.cssText = "margin-bottom: 10px; background: rgba(255,255,255,0.05); border: 1px solid var(--border-color); color: var(--text-primary); text-align: left; justify-content: flex-start; padding: 15px;";
                
                let icon = "fa-money-bill";
                let title = m.type.replace('_', ' ').toUpperCase();
                let subtitle = "";

                if (m.type === 'pago_movil') { icon = "fa-mobile-screen"; subtitle = `${m.banco}`; }
                else if (m.type === 'binance') { icon = "fa-bitcoin-sign"; subtitle = `ID: ${m.binanceId}`; }
                else if (m.type === 'airtm') { icon = "fa-envelope"; subtitle = m.email; }
                else if (m.type === 'efectivo') { icon = "fa-hand-holding-dollar"; subtitle = "Entrega personal"; }

                btn.innerHTML = `<i class="fa-solid ${icon}" style="font-size:1.2rem; color:var(--primary-color);"></i>
                    <div style="flex:1;">
                        <div style="font-weight:bold; font-size: 0.9rem;">${title}</div>
                        <div style="font-size:0.7rem; color:var(--text-secondary);">${subtitle}</div>
                    </div>`;
                
                btn.onclick = () => window.selectPaymentMethod(m);
                container.appendChild(btn);
            });
        }

        getEl('payment-modal').style.display = 'flex';
    };

    window.selectPaymentMethod = function(method) {
        getEl('pm-method-val').value = method.type;
        getEl('report-payment-fields').style.display = 'block';
        getEl('payment-options-container').style.display = 'none';
        getEl('pm-cancel-btn').style.display = 'none'; // Hide general cancel
        
        let infoHtml = "";
        if (method.type === 'pago_movil') {
            infoHtml = `Banco: ${method.banco}<br>Tel: ${method.phone}<br>ID: ${method.rif || '---'}`;
        } else if (method.type === 'binance') {
            infoHtml = `Binance ID: ${method.binanceId}`;
        } else if (method.type === 'airtm') {
            infoHtml = `Airtm Email: ${method.email}`;
        } else {
            infoHtml = `Metodo: ${method.type.toUpperCase()}`;
        }
        
        getEl('pm-selected-method-info').innerHTML = infoHtml;
        window.currentSelectedMethodData = method;
    };

    window.backToPaymentMethods = function() {
        getEl('report-payment-fields').style.display = 'none';
        getEl('payment-options-container').style.display = 'block';
        getEl('pm-cancel-btn').style.display = 'block';
    };

    window.previewPaymentReceipt = function(event) {
        const reader = new FileReader();
        reader.onload = () => {
            getEl('pm-preview').src = reader.result;
            window.currentPaymentCapture = reader.result;
            getEl('pm-preview').style.display = 'block';
            getEl('pm-upload-ui').style.display = 'none';
        };
        reader.readAsDataURL(event.target.files[0]);
    };

    window.submitPaymentReport = function() {
        try {
            const orderId = window.activePaymentOrder;
            const method = getEl('pm-method-val').value;
            const ref = getEl('pm-ref').value;
            
            if (!ref) { alert("Por favor ingresa el número de referencia"); return; }
            if (!window.currentPaymentCapture) { alert("Por favor sube una imagen del comprobante"); return; }
            
            const idx = window.allGlobalOrders.findIndex(o => o.id === orderId);
            if (idx !== -1) {
                window.allGlobalOrders[idx].status = 'verificando';
                window.allGlobalOrders[idx].paymentRejected = false; // Clear rejection on re-submit
                window.allGlobalOrders[idx].payment = {
                    method: method,
                    reference: ref,
                    image: window.currentPaymentCapture || ''
                };
                
                // Try saving to localStorage
                try {
                    localStorage.setItem('allGlobalOrders', JSON.stringify(window.allGlobalOrders));
                } catch (storageError) {
                    console.error("Storage error:", storageError);
                    alert("La imagen es demasiado pesada para el navegador. Intenta con una captura de pantalla más pequeña o comprímela.");
                    return;
                }

                window.showToast("Pago Reportado", "El vendedor verificará tu pago pronto.");
                getEl('payment-modal').style.display = 'none';
                
                // Refresh UI
                if (window.renderBuyerOrders) window.renderBuyerOrders();
                if (window.renderSellerOrders) window.renderSellerOrders();
                if (window.initFeed) window.initFeed();
            } else {
                alert("Error: No se encontró la orden activa.");
            }
        } catch (globalError) {
            console.error("Global submit error:", globalError);
            alert("Ocurrió un error al procesar el reporte. Por favor refresca la página e intenta de nuevo.");
        }
    };

    window.openVerifyPaymentModal = function(orderId) {
        window.currentOrderId = orderId;
        const order = window.allGlobalOrders.find(o => o.id === orderId);
        if (order && order.payment) {
            getEl('vr-info').innerHTML = `Orden #${order.id}<br>Referencia: <strong>${order.payment.reference || order.payment.ref}</strong><br>Monto: <strong>$${order.total.toFixed(2)}</strong>`;
            getEl('vr-img').src = order.payment.image || '';
            getEl('view-receipt-modal').style.display = 'flex';
        }
    };

    window.verifyOrderPayment = function(approved) {
        const orderId = window.currentOrderId;
        const idx = window.allGlobalOrders.findIndex(o => o.id === orderId);
        if (idx !== -1) {
            if (approved) {
                window.allGlobalOrders[idx].status = 'pagado';
                window.allGlobalOrders[idx].paymentRejected = false;
                window.showToast("Pago Verificado", "La orden ha sido marcada como pagada.");
            } else {
                const reason = prompt("Indique el motivo del rechazo para informar al cliente:") || "Datos del pago incorrectos o capture ilegible.";
                window.allGlobalOrders[idx].status = 'esperando_pago';
                window.allGlobalOrders[idx].paymentRejected = true;
                window.allGlobalOrders[idx].rejectionReason = reason;
                window.showToast("Pago Rechazado", "Se ha notificado al cliente.");
            }
            localStorage.setItem('allGlobalOrders', JSON.stringify(window.allGlobalOrders));
            getEl('view-receipt-modal').style.display = 'none';
            window.renderSellerOrders();
            window.renderBuyerOrders();
            window.updateDashboardStats();
        }
    };

    window.updateOrderStatus = function(orderId, nextStatus) {
        const idx = window.allGlobalOrders.findIndex(o => o.id === orderId);
        if (idx !== -1) {
            window.allGlobalOrders[idx].status = nextStatus;
            localStorage.setItem('allGlobalOrders', JSON.stringify(window.allGlobalOrders));
            
            if (nextStatus === 'entregado') {
                window.showToast("Venta Cerrada", "¡Compra finalizada con éxito!");
                // Open rating modal for whichever side just clicked it
                const type = window.sellerLoggedIn ? 'buyer' : 'store';
                window.openRatingModal(orderId, type);
            } else {
                window.showToast("Estado Actualizado", `La orden ahora está: ${nextStatus}`);
            }
            
            window.renderSellerOrders();
            window.renderBuyerOrders();
            window.updateDashboardStats();
        }
    };

    window.deleteOrderForSeller = function(orderId) {
        if (!confirm("¿Deseas eliminar permanentemente esta orden de tu historial?")) return;
        const idx = window.allGlobalOrders.findIndex(o => o.id === orderId);
        if (idx !== -1) {
            window.allGlobalOrders[idx].deletedBySeller = true;
            localStorage.setItem('allGlobalOrders', JSON.stringify(window.allGlobalOrders));
            window.renderSellerOrders();
            window.showToast("Historial Limpio", "La orden ha sido removida de tu panel.");
        }
    };

    // --- 9. Reputation System ---
    window.currentRatingValue = 0;
    window.openRatingModal = function(orderId, type) {
        window.ratingTargetOrder = orderId;
        window.ratingType = type; // 'store' (buyer rating seller) or 'buyer' (seller rating buyer)
        window.currentRatingValue = 0;
        
        getEl('rm-title').innerText = type === 'store' ? 'Calificar Vendedor' : 'Calificar Comprador';
        getEl('rm-desc').innerText = type === 'store' ? '¿Cómo calificarías la atención de la tienda?' : '¿Cómo calificarías la puntualidad del cliente?';
        getEl('rm-comment').value = '';
        
        // Reset stars
        document.querySelectorAll('#star-rating-container i').forEach(s => {
            s.className = 'fa-regular fa-star';
        });

        getEl('rating-modal').style.display = 'flex';
    };

    window.setRating = function(val) {
        window.currentRatingValue = val;
        document.querySelectorAll('#star-rating-container i').forEach(s => {
            const sVal = parseInt(s.getAttribute('data-value'));
            s.className = sVal <= val ? 'fa-solid fa-star' : 'fa-regular fa-star';
        });
    };

    window.submitRating = function() {
        if (window.currentRatingValue === 0) { alert("Por favor elige una puntuación"); return; }
        
        const order = window.allGlobalOrders.find(o => o.id === window.ratingTargetOrder);
        const comment = getEl('rm-comment').value;

        const newRating = {
            orderId: window.ratingTargetOrder,
            type: window.ratingType,
            stars: window.currentRatingValue,
            comment: comment,
            toPhone: window.ratingType === 'store' ? order.storePhone : order.buyerPhone,
            date: new Date().toLocaleString()
        };

        window.allRatings.push(newRating);
        localStorage.setItem('allRatings', JSON.stringify(window.allRatings));

        // Mark order as rated
        const oIdx = window.allGlobalOrders.findIndex(o => o.id === window.ratingTargetOrder);
        if (window.ratingType === 'store') window.allGlobalOrders[oIdx].buyerRated = true;
        else window.allGlobalOrders[oIdx].sellerRated = true;
        localStorage.setItem('allGlobalOrders', JSON.stringify(window.allGlobalOrders));

        getEl('rating-modal').style.display = 'none';
        window.showToast("Gracias", "Tu calificación ha sido registrada");
        
        window.renderSellerOrders();
        window.renderBuyerOrders();
        window.updateDashboardStats();
    };

    window.updateDashboardStats = function() {
        if (!window.myStoreData) return;
        
        const myStoreOrders = window.allGlobalOrders.filter(o => o.storePhone === window.myStoreData.phone && o.status === 'entregado');
        const myStoreRatings = window.allRatings.filter(r => r.toPhone === window.myStoreData.phone && r.type === 'store');
        
        safeSetText('stats-orders', myStoreOrders.length);
        
        if (myStoreRatings.length > 0) {
            const sum = myStoreRatings.reduce((acc, r) => acc + r.stars, 0);
            const avg = (sum / myStoreRatings.length).toFixed(1);
            const ratingEl = document.querySelector('.stat-box:nth-child(2) .stat-value');
            if (ratingEl) ratingEl.innerText = avg;
        }
    };

    window.updateDashboardStats(); // Initial run

    window.switchDashTab = function(tab) {
        getEl('dash-inventory').style.display = (tab === 'inventory') ? 'block' : 'none';
        getEl('dash-orders').style.display = (tab === 'orders') ? 'block' : 'none';
        getEl('dash-bank').style.display = (tab === 'bank') ? 'block' : 'none';
        if (tab === 'bank') window.renderBankHistory();
    };

    window.renderBankHistory = function() {
        const container = getEl('bank-history-container');
        if (!container) return;
        
        const bankOrders = window.allGlobalOrders.filter(o => 
            o.storePhone === window.myStoreData?.phone && 
            (o.status === 'pagado' || o.status === 'enviado' || o.status === 'entregado') &&
            o.payment && !o.archivedByBank
        );

        container.innerHTML = bankOrders.length ? '' : '<div class="empty-cart-msg">No hay pagos verificados para mostrar.</div>';

        bankOrders.forEach(o => {
            const card = document.createElement('div');
            card.style.cssText = "background: rgba(255,255,255,0.03); border: 1px solid var(--border-color); border-radius: 12px; padding: 12px; display: flex; justify-content: space-between; align-items: center;";
            const ref = (o.payment && o.payment.reference) ? o.payment.reference : 'N/A';
            const img = (o.payment && o.payment.image) ? o.payment.image : '';
            
            card.innerHTML = `
                <div>
                    <div style="font-weight: bold; color: var(--primary-color); font-size: 0.9rem;">Orden #${o.id}</div>
                    <div style="font-size: 0.7rem; color: var(--text-secondary);">${o.date}</div>
                    <div style="font-size: 0.8rem; margin-top: 4px;"><i class="fa-solid fa-receipt"></i> Ref: ${ref}</div>
                </div>
                <div style="text-align: right;">
                    <div style="font-weight: bold; color: var(--secondary-color);">$${o.total.toFixed(2)}</div>
                    ${img ? `
                    <button class="icon-btn" onclick="window.viewPaymentCapture('${img}')" style="font-size: 0.8rem; margin-top: 5px;" title="Ver Capture">
                        <i class="fa-solid fa-eye"></i>
                    </button>` : ''}
                </div>
            `;
            container.appendChild(card);
        });
    };

    window.viewPaymentCapture = function(url) {
        const win = window.open("", "_blank");
        win.document.write(`<html><body style="margin:0; background:#000; display:flex; align-items:center; justify-content:center;"><img src="${url}" style="max-width:100%; max-height:100%;"></body></html>`);
    };

    window.generateBankPDF = function() {
        const bankOrders = window.allGlobalOrders.filter(o => 
            o.storePhone === window.myStoreData?.phone && 
            (o.status === 'pagado' || o.status === 'enviado' || o.status === 'entregado') &&
            o.payment && !o.archivedByBank
        );

        if (bankOrders.length === 0) { alert("No hay datos para exportar."); return; }

        let tableRows = bankOrders.map(o => `
            <tr>
                <td style="padding: 10px; border-bottom: 1px solid #ddd;">#${o.id}</td>
                <td style="padding: 10px; border-bottom: 1px solid #ddd;">${o.date}</td>
                <td style="padding: 10px; border-bottom: 1px solid #ddd;">${o.buyerName}</td>
                <td style="padding: 10px; border-bottom: 1px solid #ddd;">${o.payment.reference}</td>
                <td style="padding: 10px; border-bottom: 1px solid #ddd; font-weight: bold;">$${o.total.toFixed(2)}</td>
            </tr>
        `).join('');

        const totalSum = bankOrders.reduce((acc, o) => acc + o.total, 0);

        const printWin = window.open("", "_blank");
        printWin.document.write(`
            <html>
            <head>
                <title>Relación de Pagos - ${window.myStoreData.name}</title>
                <style>
                    body { font-family: sans-serif; padding: 40px; color: #333; }
                    .header { text-align: center; margin-bottom: 40px; border-bottom: 2px solid var(--primary-color); padding-bottom: 20px; }
                    table { width: 100%; border-collapse: collapse; margin-top: 20px; }
                    th { background: #f8f9fa; text-align: left; padding: 12px; border-bottom: 2px solid #eee; }
                    .footer { margin-top: 40px; text-align: right; font-size: 1.2rem; font-weight: bold; }
                </style>
            </head>
            <body>
                <div class="header">
                    <h1>MercadoChat - Relación de Pagos</h1>
                    <h2>Tienda: ${window.myStoreData.name}</h2>
                    <p>Fecha de Reporte: ${new Date().toLocaleString()}</p>
                </div>
                <table>
                    <thead>
                        <tr>
                            <th>Orden</th>
                            <th>Fecha</th>
                            <th>Cliente</th>
                            <th>Referencia</th>
                            <th>Monto</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${tableRows}
                    </tbody>
                </table>
                <div class="footer">
                    Total Conciliado: $${totalSum.toFixed(2)}
                </div>
                <script>window.onload = function() { window.print(); }</script>
            </body>
            </html>
        `);
        printWin.document.close();
    };

    window.clearBankHistory = function() {
        if (!confirm("¿Deseas archivar este periodo? Se limpiará la vista pero las órdenes se mantienen en el sistema.")) return;
        
        window.allGlobalOrders.forEach(o => {
            if (o.storePhone === window.myStoreData?.phone && o.payment) {
                o.archivedByBank = true;
            }
        });
        
        localStorage.setItem('allGlobalOrders', JSON.stringify(window.allGlobalOrders));
        window.renderBankHistory();
        window.showToast("Historial Archivado", "Tu periodo contable ha sido cerrado.");
    };

    window.contactBuyer = function(phone) {
        window.open(`https://wa.me/${phone}?text=Hola, te contacto por tu pedido en MercadoChat`, '_blank');
    };

    // --- 10. Seller Auth & Dashboard ---
    window.openLoginModal = function() {
        if (window.sellerLoggedIn) window.openMyProfile();
        else getEl('login-modal').style.display = 'flex';
    };

    window.closeLoginModal = function() { getEl('login-modal').style.display = 'none'; };

    window.processLogin = function() {
        const phone = getEl('login-phone').value.trim();
        const pass = getEl('login-password').value.trim();
        
        // Check if suspended
        const store = window.myStoreData;
        if (store && store.phone === phone && store.password === pass) {
            if (store.suspended) {
                alert("TU TIENDA HA SIDO SUSPENDIDA TEMPORALMENTE por incumplimiento de normas. Contacta a Soporte.");
                return;
            }
            window.sellerLoggedIn = true;
            localStorage.setItem('sellerLoggedIn', 'true');
            window.closeLoginModal();
            window.updateNavVisibility();
            window.updateHeaderNames();
            window.openMyProfile();
        } else { alert("Datos incorrectos. Prueba con: 04140000000 / 1234"); }
    };

    window.logoutSeller = function() {
        if (confirm("¿Cerrar sesión de vendedor?")) {
            localStorage.setItem('sellerLoggedIn', 'false');
            window.sellerLoggedIn = false;
            window.updateHeaderNames();
            location.reload();
        }
    };

    window.openMyProfile = function() {
        if (!window.myStoreData) {
            if (confirm("¿Crear tienda?")) window.switchMainView('create-profile-view');
            return;
        }
        window.switchMainView('dashboard-view');
        safeSetText('dashboard-title', window.myStoreData.name);
        window.renderDashboardInventory();
    };

    const getVal = (obj, keys) => {
        const foundKey = Object.keys(obj).find(k => keys.map(x => x.toLowerCase().trim()).includes(k.toLowerCase().trim()));
        return foundKey ? obj[foundKey] : null;
    };

    window.renderDashboardInventory = function() {
        const container = getEl('dashboard-inventory-container');
        if (!container) return;
        
        if (window.currentStoreExcelItems.length === 0) {
            container.innerHTML = `
                <div style="grid-column: 1/-1; text-align: center; padding: 40px; color: var(--text-secondary);">
                    <i class="fa-solid fa-box-open" style="font-size: 3rem; margin-bottom: 15px; opacity: 0.5;"></i>
                    <p>No tienes productos registrados.</p>
                    <button class="btn-primary" onclick="window.openAddProduct()" style="margin-top: 15px;">Añadir mi primer producto</button>
                </div>`;
            return;
        }

        container.innerHTML = '';
        window.currentStoreExcelItems.forEach((it, idx) => {
            const card = document.createElement('div');
            card.className = 'product-card';
            
            // Robust mapping using helper
            const title = getVal(it, ['Descripcion', 'Descripción', 'Nombre', 'Product']) || 'Producto';
            const detail = getVal(it, ['Detalle', 'Detalles', 'Info']) || '';
            const rawPriceBs = getVal(it, ['Precio', 'PrecioBS', 'Bolivares', 'Bs']);
            const rawPriceUsd = getVal(it, ['$', 'USD', 'Dolar', 'PrecioUSD']);

            let priceUSD = parseFloat(rawPriceUsd) || 0;
            let priceBS = parseFloat(String(rawPriceBs || 0).replace(/[^\d.]/g, '')) || 0;
            
            if (priceUSD === 0 && priceBS > 0) {
                priceUSD = priceBS / window.exchangeRate;
            } else if (priceBS === 0 && priceUSD > 0) {
                priceBS = priceUSD * window.exchangeRate;
            }

            card.innerHTML = `
                <div style="position: relative;">
                    <img src="${it.Imagen || 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&w=300&q=80'}" class="product-image">
                    <div style="position: absolute; top: 8px; right: 8px; display: flex; gap: 5px;">
                        <button class="icon-btn" onclick="window.editDashboardProduct(${idx})" style="background: rgba(255,255,255,0.9); color: var(--bg-color); width: 32px; height: 32px;">
                            <i class="fa-solid fa-pen"></i>
                        </button>
                        <button class="icon-btn" onclick="window.deleteDashboardProduct(${idx})" style="background: rgba(239, 68, 68, 0.9); color: white; width: 32px; height: 32px;">
                            <i class="fa-solid fa-trash"></i>
                        </button>
                    </div>
                </div>
                <div class="product-info">
                    <h3 class="product-title" style="margin-bottom: 2px;">${title}</h3>
                    <p style="font-size: 0.75rem; color: var(--text-secondary); margin-bottom: 8px;">${detail}</p>
                    <div style="display: flex; flex-direction: column; gap: 2px;">
                        <div class="product-price" style="color: var(--secondary-color); font-size: 1.1rem;">$${priceUSD.toFixed(2)}</div>
                        <div style="font-size: 0.8rem; color: var(--text-secondary);">Bs. ${priceBS.toLocaleString('es-VE', { minimumFractionDigits: 2 })}</div>
                    </div>
                </div>`;
            container.appendChild(card);
        });
    };

    window.openAddProduct = function() {
        getEl('edit-product-modal-title').innerText = "Añadir Producto";
        getEl('edit-product-index').value = "-1";
        getEl('edit-product-name').value = "";
        getEl('edit-product-detail').value = "";
        getEl('edit-product-price-bs').value = "";
        getEl('edit-product-price-usd').value = "";
        getEl('edit-product-image').value = "";
        
        // Reset preview
        getEl('p-img-preview').style.display = 'none';
        getEl('p-img-icon').style.display = 'block';
        getEl('p-img-text').style.display = 'block';
        getEl('p-img-preview').src = "";

        getEl('edit-product-modal').style.display = 'flex';
    };
    window.openEditProductModal = window.openAddProduct;

    window.editDashboardProduct = function(idx) {
        const item = window.currentStoreExcelItems[idx];
        getEl('edit-product-modal-title').innerText = "Editar Producto";
        getEl('edit-product-index').value = idx;
        getEl('edit-product-name').value = item.Descripcion || item.Descripción || item.Nombre || "";
        getEl('edit-product-detail').value = item.Detalle || item.Detalles || "";
        getEl('edit-product-price-bs').value = parseFloat(String(item.Precio || 0).replace(/[^\d.]/g, '')) || "";
        getEl('edit-product-price-usd').value = item['$'] || "";
        getEl('edit-product-image').value = item.Imagen || "";
        
        // Setup preview
        if (item.Imagen) {
            getEl('p-img-preview').src = item.Imagen;
            getEl('p-img-preview').style.display = 'block';
            getEl('p-img-icon').style.display = 'none';
            getEl('p-img-text').style.display = 'none';
        } else {
            getEl('p-img-preview').style.display = 'none';
            getEl('p-img-icon').style.display = 'block';
            getEl('p-img-text').style.display = 'block';
        }

        getEl('edit-product-modal').style.display = 'flex';
    };

    window.previewProductImage = function(event) {
        const reader = new FileReader();
        reader.onload = () => {
            getEl('p-img-preview').src = reader.result;
            getEl('p-img-preview').style.display = 'block';
            getEl('p-img-icon').style.display = 'none';
            getEl('p-img-text').style.display = 'none';
        };
        reader.readAsDataURL(event.target.files[0]);
    };

    window.deleteDashboardProduct = function(idx) {
        if (confirm("¿Estás seguro de eliminar este producto?")) {
            window.currentStoreExcelItems.splice(idx, 1);
            localStorage.setItem('currentStoreExcelItems', JSON.stringify(window.currentStoreExcelItems));
            window.renderDashboardInventory();
            window.showToast("Eliminado", "Producto borrado del catálogo");
        }
    };

    window.saveProductData = function() {
        const idx = parseInt(getEl('edit-product-index').value);
        const name = getEl('edit-product-name').value.trim();
        const detail = getEl('edit-product-detail').value.trim();
        const priceBs = getEl('edit-product-price-bs').value.trim();
        const priceUsd = getEl('edit-product-price-usd').value.trim();
        const urlImage = getEl('edit-product-image').value.trim();
        const uploadImage = getEl('p-img-preview').src;
        
        if (!name || (!priceBs && !priceUsd)) { alert("Completa la descripción y al menos un precio"); return; }
        
        // Prioritize uploaded image (DataURL) over URL input
        let finalImage = urlImage;
        if (uploadImage && uploadImage.startsWith('data:image')) {
            finalImage = uploadImage;
        }

        const newItem = {
            Descripcion: name,
            Detalle: detail,
            Precio: priceBs,
            '$': priceUsd,
            Imagen: finalImage || 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&w=300&q=80'
        };

        if (idx === -1) {
            window.currentStoreExcelItems.unshift(newItem);
        } else {
            window.currentStoreExcelItems[idx] = { ...window.currentStoreExcelItems[idx], ...newItem };
        }

        localStorage.setItem('currentStoreExcelItems', JSON.stringify(window.currentStoreExcelItems));
        getEl('edit-product-modal').style.display = 'none';
        window.renderDashboardInventory();
        window.showToast("Guardado", "Catálogo actualizado");
    };

    window.openCreateProfile = function() {
        window.closeLoginModal();
        window.switchMainView('create-profile-view');
    };

    window.closeCreateProfile = function() {
        window.switchMainView('home-view');
    };

    window.submitProfile = function() {
        const name = getEl('cp-name').value.trim();
        const cat = getEl('cp-category').value;
        const phone = getEl('cp-phone').value.trim();
        const desc = getEl('cp-desc').value.trim();
        const logo = getEl('logo-img-preview').src;
        const pass = getEl('cp-password').value.trim();
        
        if (!name || !phone || !pass) { alert("Completa todos los campos obligatorios"); return; }
        
        const newStore = { 
            name, 
            category: cat || 'General', 
            description: desc || 'Nueva tienda oficial.', 
            phone, 
            password: pass,
            logo: logo && logo.startsWith('data:image') ? logo : null,
            verified: true 
        };

        window.myStoreData = newStore;
        localStorage.setItem('myStoreData', JSON.stringify(window.myStoreData));
        
        // Add to global store registry
        window.allRegisteredStores.unshift(newStore);
        localStorage.setItem('allRegisteredStores', JSON.stringify(window.allRegisteredStores));

        window.sellerLoggedIn = true;
        localStorage.setItem('sellerLoggedIn', 'true');
        
        window.updateNavVisibility();
        window.openMyProfile();
        window.showToast("Tienda Creada", "¡Bienvenido a MercadoChat!");
    };

    // --- 8. Buyer Auth ---
    window.handleBuyerNavClick = function() {
        if (window.currentBuyer) window.switchMainView('buyer-profile-view');
        else getEl('buyer-login-modal').style.display = 'flex';
    };
    window.closeBuyerLogin = function() { getEl('buyer-login-modal').style.display = 'none'; };

    window.processBuyerLogin = function() {
        const phone = getEl('buyer-login-phone').value.trim();
        const pass = getEl('buyer-login-password').value.trim();
        const b = window.registeredBuyers.find(u => u.phone === phone && u.password === pass);
        if (b) {
            if (b.suspended) {
                alert("TU CUENTA HA SIDO SUSPENDIDA TEMPORALMENTE. Contacta a Soporte.");
                return;
            }
            window.currentBuyer = b;
            localStorage.setItem('currentBuyer', JSON.stringify(b));
            window.closeBuyerLogin();
            window.updateNavVisibility();
            window.switchMainView('home-view');
            window.showToast("Bienvenido", `Hola, ${b.name}`);
        } else { alert("Acceso denegado. Prueba con: 04141112233 / 1234"); }
    };
    window.openBuyerRegister = function() {
        window.closeBuyerLogin();
        getEl('buyer-register-modal').style.display = 'flex';
    };

    window.processBuyerRegister = function() {
        const name = getEl('reg-buyer-name').value.trim();
        const phone = getEl('reg-buyer-phone').value.trim();
        const pass = getEl('reg-buyer-password').value.trim();
        
        if (!name || !phone || !pass) { alert("Completa tus datos básicos"); return; }
        
        const newBuyer = { name, phone, password: pass };
        window.registeredBuyers.push(newBuyer);
        localStorage.setItem('registeredBuyers', JSON.stringify(window.registeredBuyers));
        
        window.currentBuyer = newBuyer;
        localStorage.setItem('currentBuyer', JSON.stringify(newBuyer));
        
        getEl('buyer-register-modal').style.display = 'none';
        window.updateNavVisibility();
        window.updateHeaderNames();
        window.switchMainView('home-view');
        window.showToast("Cuenta Creada", `¡Hola, ${name}!`);
    };

    window.logoutBuyer = function() {
        if (confirm("¿Cerrar sesión de comprador?")) {
            localStorage.removeItem('currentBuyer');
            window.currentBuyer = null;
            window.updateHeaderNames();
            location.reload();
        }
    };

    // --- 9. Recovery & Security ---
    window.openRecoveryModal = function(role) {
        window.currentRecoveryRole = role;
        getEl('login-modal').style.display = 'none';
        getEl('buyer-login-modal').style.display = 'none';
        getEl('recovery-modal').style.display = 'flex';
        getEl('recovery-step-1').style.display = 'block';
        getEl('recovery-step-2').style.display = 'none';
        getEl('recovery-step-3').style.display = 'none';
    };

    window.sendRecoveryCode = function() {
        getEl('recovery-step-1').style.display = 'none';
        getEl('recovery-step-2').style.display = 'block';
        window.showToast("Código Enviado", "Verifica tu WhatsApp");
    };

    window.verifyRecoveryCode = function() {
        const code = getEl('recovery-code-input').value;
        if (code === '123456') {
            getEl('recovery-step-2').style.display = 'none';
            getEl('recovery-step-3').style.display = 'block';
        } else { alert("Código errado"); }
    };

    window.updatePasswordFinal = function() {
        const pass = getEl('recovery-new-pass').value;
        if (pass.length < 4) { alert("Mínimo 4 letras"); return; }
        alert("Contraseña cambiada");
        getEl('recovery-modal').style.display = 'none';
    };

    // --- 10. Initialization ---
    document.addEventListener('DOMContentLoaded', () => {
        window.initFeed();
        window.updateNavVisibility();
        window.updateHeaderNames();
        
        // Final event wiring
        getEl('store-cart-btn')?.addEventListener('click', window.toggleCart);
        getEl('close-cart-btn')?.addEventListener('click', window.toggleCart);
        getEl('cart-overlay')?.addEventListener('click', window.toggleCart);
        getEl('checkout-btn')?.addEventListener('click', window.openCheckoutForm);

        // Search listener
        getEl('main-search')?.addEventListener('input', (e) => {
            window.currentSearchQuery = e.target.value;
            window.initFeed();
        });

        // Populate Category Selects
        const catSelect = getEl('cp-category');
        if (catSelect) {
            catSelect.innerHTML = '<option value="">Selecciona una categoría</option>';
            categories.forEach(c => {
                const opt = document.createElement('option');
                opt.value = c.name;
                opt.innerText = c.name;
                catSelect.appendChild(opt);
            });
        }
        
        console.log('MercadoChat System: ONLINE');
    });

    // Final UI Helpers
    window.openProfile = function(name, cat, phone, desc, verified, img) {
        window.switchMainView('store-view');
        safeSetText('profile-name', name);
        safeSetText('profile-category', cat);
        safeSetText('profile-description', desc);
        getEl('profile-avatar-img').src = img || 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&w=150&q=80';

        // Render products for this store
        const container = getEl('store-products-grid');
        if (!container) return;
        container.innerHTML = '';

        // If it's the current merchant's store, show their real inventory
        let storeItems = [];
        if (window.myStoreData && window.myStoreData.phone === phone) {
            storeItems = window.currentStoreExcelItems;
        } else {
            // Demo products for other stores
            storeItems = products.filter(p => p.store === name);
        }

        if (storeItems.length === 0) {
            container.innerHTML = '<div class="empty-cart-msg" style="grid-column: 1/-1;">Esta tienda aún no tiene productos públicos.</div>';
        } else {
            storeItems.forEach(it => {
                const title = getVal(it, ['Descripcion', 'Descripción', 'Nombre', 'Product', 'title']) || 'Producto';
                const price = getVal(it, ['$', 'USD', 'Dolar', 'PrecioUSD', 'price']) || '0';
                const image = it.Imagen || it.image || 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&w=300&q=80';
                
                const card = document.createElement('div');
                card.className = 'product-card';
                card.innerHTML = `
                    <img src="${image}" class="product-image">
                    <div class="product-info">
                        <h3 class="product-title">${title}</h3>
                        <div class="product-price">$${price}</div>
                        <button class="btn-whatsapp" onclick="window.addToCart({title: '${title}', price: '${price}', image: '${image}', phone: '${phone}'})">
                            <i class="fa-solid fa-cart-plus"></i> Añadir
                        </button>
                    </div>`;
                container.appendChild(card);
            });
        }
    };

    window.toggleFavorite = function (id, event) {
        if (event) event.stopPropagation();
        const index = window.favorites.indexOf(id);
        if (index === -1) {
            window.favorites.push(id);
            window.showToast("Favoritos", "Añadido a favoritos");
        } else {
            window.favorites.splice(index, 1);
            window.showToast("Favoritos", "Eliminado de favoritos");
        }
        localStorage.setItem('favorites', JSON.stringify(window.favorites));
        window.initFeed();
        if (window.currentActiveView === 'favorites-view') window.renderFavorites();
    };

    window.renderFavorites = function() {
        const container = getEl('favorites-container');
        if (!container) return;
        
        const favProducts = products.filter(p => window.favorites.includes(p.id));
        container.innerHTML = favProducts.length ? '' : '<div class="empty-cart-msg">Aún no tienes productos favoritos</div>';
        
        favProducts.forEach(p => {
            const card = document.createElement('div');
            card.className = 'product-card';
            card.innerHTML = `
                <div style="position: relative;">
                    <img src="${p.image}" class="product-image">
                    <button class="favorite-btn active" onclick="window.toggleFavorite(${p.id}, event)">
                        <i class="fa-solid fa-heart"></i>
                    </button>
                </div>
                <div class="product-info">
                    <h3>${p.title}</h3>
                    <div class="product-price">$${p.price}</div>
                    <div class="product-store"><i class="fa-solid fa-store"></i> ${p.store}</div>
                    <button class="btn-primary" onclick="window.openProfile('${p.store}', 'Tienda Verificada', '${p.phone}', 'Expertos en Apple', true, '${p.image}')">Ver Tienda</button>
                </div>`;
            container.appendChild(card);
        });
    };

    window.selectProfileFocus = function(el, focus) {
        document.querySelectorAll('.type-card').forEach(c => c.classList.remove('active'));
        el.classList.add('active');
        window.currentProfileFocus = focus;
    };

    window.previewLogo = function(event) {
        const reader = new FileReader();
        reader.onload = () => {
            getEl('logo-img-preview').src = reader.result;
            getEl('logo-img-preview').style.display = 'block';
            getEl('logo-icon').style.display = 'none';
            getEl('logo-text').style.display = 'none';
        };
        reader.readAsDataURL(event.target.files[0]);
    };

    window.previewID = function(event, role) {
        const reader = new FileReader();
        const prefix = role === 'buyer' ? 'id-buyer-' : 'id-';
        reader.onload = () => {
            getEl(`${prefix}img-preview`).src = reader.result;
            getEl(`${prefix}img-preview`).style.display = 'block';
            getEl(`${prefix}icon`).style.display = 'none';
            getEl(`${prefix}text`).style.display = 'none';
        };
        reader.readAsDataURL(event.target.files[0]);
    };

    window.generateAIName = function(e) {
        if(e) e.preventDefault();
        const names = ["ElectroFast", "ModaVibe", "TechGenius", "HomeStyle", "AutoElite"];
        getEl('cp-name').value = names[Math.floor(Math.random() * names.length)];
        window.showToast("IA Generada", "Sugerencia aplicada");
    };

    window.closeCreateProfile = function() {
        window.switchMainView('home-view');
    };

    window.procesarExcel = function() {
        const file = getEl('excel-upload')?.files[0];
        if(!file) return;
        const reader = new FileReader();
        reader.onload = (e) => {
            const workbook = XLSX.read(new Uint8Array(e.target.result), {type: 'array'});
            const json = XLSX.utils.sheet_to_json(workbook.Sheets[workbook.SheetNames[0]]);
            
            if (window.currentStoreExcelItems.length > 0) {
                if (confirm(`Tienes ${window.currentStoreExcelItems.length} productos. ¿Deseas AÑADIR estos ${json.length} nuevos (Aceptar) o REEMPLAZAR todo el catálogo (Cancelar)?`)) {
                    window.currentStoreExcelItems = window.currentStoreExcelItems.concat(json);
                } else {
                    window.currentStoreExcelItems = json;
                }
            } else {
                window.currentStoreExcelItems = json;
            }

            localStorage.setItem('currentStoreExcelItems', JSON.stringify(window.currentStoreExcelItems));
            window.showToast("Inventario Actualizado", `${json.length} productos procesados`);
            window.renderDashboardInventory();
        };
        reader.readAsArrayBuffer(file);
    };

    window.generateAIProductImage = function() {
        const name = getEl('edit-product-name').value || "producto";
        window.showToast("IA Generando", `Creando imagen para ${name}...`);
        
        // Simulating AI generation with high-quality random Unsplash images based on keywords
        const keywords = name.split(' ').join(',');
        const aiUrl = `https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=600&q=80&sig=${Math.random()}`;
        
        setTimeout(() => {
            getEl('p-img-preview').src = aiUrl;
            getEl('p-img-preview').style.display = 'block';
            getEl('p-img-icon').style.display = 'none';
            getEl('p-img-text').style.display = 'none';
            window.showToast("IA Lista", "Imagen generada correctamente");
        }, 1500);
    };

    // --- 11. Store Profile Management ---
    window.openEditStoreModal = function() {
        const s = window.myStoreData;
        getEl('es-name').value = s.name || "";
        getEl('es-desc').value = s.description || "";
        
        // Populate category select
        const sel = getEl('es-category');
        sel.innerHTML = categories.map(c => `<option value="${c.name}" ${s.category === c.name ? 'selected' : ''}>${c.name}</option>`).join('');

        if (s.logo) {
            getEl('es-logo-preview').src = s.logo;
            getEl('es-logo-preview').style.display = 'block';
            getEl('es-logo-text').style.display = 'none';
        } else {
            getEl('es-logo-preview').style.display = 'none';
            getEl('es-logo-text').style.display = 'block';
        }

        getEl('edit-store-modal').style.display = 'flex';
    };

    window.previewEditStoreLogo = function(event) {
        const reader = new FileReader();
        reader.onload = () => {
            getEl('es-logo-preview').src = reader.result;
            getEl('es-logo-preview').style.display = 'block';
            getEl('es-logo-text').style.display = 'none';
        };
        reader.readAsDataURL(event.target.files[0]);
    };

    window.togglePaymentFields = function() {
        const type = getEl('new-payment-type').value;
        getEl('pago-movil-fields').style.display = (type === 'pago_movil') ? 'flex' : 'none';
        getEl('binance-fields').style.display = (type === 'binance') ? 'block' : 'none';
        getEl('airtm-fields').style.display = (type === 'airtm') ? 'block' : 'none';
    };

    window.addPaymentMethod = function() {
        const type = getEl('new-payment-type').value;
        if (!type) return;

        let method = { type: type, id: Date.now() };

        if (type === 'pago_movil') {
            method.banco = getEl('pm-banco').value;
            method.rif = getEl('pm-id').value;
            method.phone = getEl('pm-phone').value;
            if (!method.banco || !method.rif || !method.phone) { alert("Completa los datos de Pago Móvil"); return; }
        } else if (type === 'binance') {
            method.binanceId = getEl('binance-id').value;
            if (!method.binanceId) { alert("Ingresa tu Binance ID"); return; }
        } else if (type === 'airtm') {
            method.email = getEl('airtm-email').value;
            if (!method.email) { alert("Ingresa tu correo de Airtm"); return; }
        }

        window.myStorePaymentMethods.push(method);
        window.renderStorePaymentMethods();
        
        // Reset fields
        getEl('new-payment-type').value = '';
        window.togglePaymentFields();
    };

    window.renderStorePaymentMethods = function() {
        const container = getEl('payment-methods-list');
        if (!container) return;
        container.innerHTML = '';
        
        window.myStorePaymentMethods.forEach(m => {
            const item = document.createElement('div');
            item.style.cssText = "background: rgba(255,255,255,0.05); padding: 10px; border-radius: 8px; display: flex; justify-content: space-between; align-items: center; font-size: 0.8rem; margin-bottom: 5px;";
            let text = "";
            if (m.type === 'pago_movil') text = `<b>Pago Móvil:</b> ${m.banco}`;
            else if (m.type === 'binance') text = `<b>Binance:</b> ${m.binanceId}`;
            else if (m.type === 'airtm') text = `<b>Airtm:</b> ${m.email}`;
            else if (m.type === 'efectivo') text = `<b>Efectivo</b>`;
            
            item.innerHTML = `<span>${text}</span><button class="icon-btn" onclick="window.removePaymentMethod(${m.id})" style="color: #ef4444;"><i class="fa-solid fa-trash"></i></button>`;
            container.appendChild(item);
        });
    };

    window.removePaymentMethod = function(id) {
        window.myStorePaymentMethods = window.myStorePaymentMethods.filter(m => m.id !== id);
        window.renderStorePaymentMethods();
    };

    window.updateStoreProfile = function() {
        const name = getEl('es-name').value.trim();
        const cat = getEl('es-category').value;
        const desc = getEl('es-desc').value.trim();
        const logo = getEl('es-logo-preview').src;

        if (!name) { alert("El nombre es obligatorio"); return; }
        
        // SECURITY REQUIREMENT: At least one payment method
        if (!window.myStorePaymentMethods || window.myStorePaymentMethods.length === 0) {
            alert("REQUISITO DE SEGURIDAD: Debes configurar al menos un método de pago donde seas el TITULAR para poder operar la tienda.");
            return;
        }

        const updatedStore = {
            ...window.myStoreData,
            name,
            category: cat,
            description: desc,
            paymentMethods: window.myStorePaymentMethods,
            logo: (logo && logo.startsWith('data:image')) ? logo : window.myStoreData.logo
        };

        window.myStoreData = updatedStore;
        localStorage.setItem('myStoreData', JSON.stringify(window.myStoreData));

        const idx = window.allRegisteredStores.findIndex(s => s.phone === updatedStore.phone);
        if (idx !== -1) {
            window.allRegisteredStores[idx] = { ...window.allRegisteredStores[idx], ...updatedStore };
        } else {
            window.allRegisteredStores.unshift(updatedStore);
        }
        localStorage.setItem('allRegisteredStores', JSON.stringify(window.allRegisteredStores));

        getEl('edit-store-modal').style.display = 'none';
        safeSetText('dashboard-title', name);
        window.showToast("Perfil Actualizado", "Tu ficha pública y pagos han sido sincronizados");
        window.initFeed();
    };

    // --- 12. Support & Mediation Logic ---
    window.openMediationModal = function(orderId) {
        getEl('mediation-order-id').value = orderId;
        getEl('mediation-details').value = '';
        getEl('mediation-modal').style.display = 'flex';
    };

    window.submitMediationRequest = function() {
        const orderId = parseInt(getEl('mediation-order-id').value);
        const reason = getEl('mediation-reason').value;
        const details = getEl('mediation-details').value.trim();
        
        if (!details) { alert("Por favor explica el motivo del reporte."); return; }

        const request = {
            id: Date.now(),
            orderId: orderId,
            reason: reason,
            details: details,
            status: 'pendiente',
            date: new Date().toLocaleString(),
            requestedBy: window.sellerLoggedIn ? 'vendedor' : 'comprador'
        };

        window.mediationRequests.unshift(request);
        localStorage.setItem('mediationRequests', JSON.stringify(window.mediationRequests));
        
        // Flag the order so the seller sees the warning
        const oIdx = window.allGlobalOrders.findIndex(o => o.id === orderId);
        if (oIdx !== -1) {
            window.allGlobalOrders[oIdx].mediationActive = true;
            localStorage.setItem('allGlobalOrders', JSON.stringify(window.allGlobalOrders));
        }
        
        getEl('mediation-modal').style.display = 'none';
        window.showToast("Reporte Enviado", "Soporte revisará tu caso en breve.");
        
        if (window.sellerLoggedIn) window.renderSellerOrders();
        else window.renderBuyerOrders();
    };

    window.viewDisputeDetails = function(orderId) {
        const req = window.mediationRequests.find(r => r.orderId === orderId);
        if (!req) { alert("No se encontró el detalle del ticket."); return; }
        
        const detailsHtml = `
            <div style="text-align: left;">
                <div style="margin-bottom: 15px; color: #94a3b8; font-size: 0.85rem;">Ticket #${req.id} - ${req.date}</div>
                <div style="margin-bottom: 15px;">
                    <label style="display: block; color: #60a5fa; font-size: 0.7rem; text-transform: uppercase; font-weight: bold; margin-bottom: 5px;">Motivo del Reporte</label>
                    <div style="color: #f3f4f6; font-size: 1rem; font-weight: bold;">${req.reason.replace(/_/g, ' ').toUpperCase()}</div>
                </div>
                <div style="margin-bottom: 20px;">
                    <label style="display: block; color: #60a5fa; font-size: 0.7rem; text-transform: uppercase; font-weight: bold; margin-bottom: 5px;">Detalles del Comprador</label>
                    <div style="background: rgba(0,0,0,0.2); padding: 15px; border-radius: 8px; color: #cbd5e1; font-size: 0.9rem; border: 1px solid #1f2937; font-style: italic;">
                        "${req.details}"
                    </div>
                </div>
                <div style="background: rgba(251, 191, 36, 0.1); border: 1px solid rgba(251, 191, 36, 0.2); padding: 12px; border-radius: 8px; font-size: 0.8rem; color: #fbbf24;">
                    <i class="fa-solid fa-circle-info"></i> El equipo de Soporte está revisando esta solicitud. Te contactarán por WhatsApp si requieren más información para la mediación.
                </div>
            </div>
        `;
        
        getEl('dispute-details-content').innerHTML = detailsHtml;
        getEl('dispute-details-modal').style.display = 'flex';
    };

    window.switchSupportTab = function(tab) {
        getEl('support-disputes-section').style.display = (tab === 'disputes') ? 'block' : 'none';
        getEl('support-users-section').style.display = (tab === 'users') ? 'block' : 'none';
        const adminSec = getEl('support-admin-section');
        if (adminSec) adminSec.style.display = (tab === 'admin') ? 'block' : 'none';
        
        getEl('tab-disputes').className = `tab-btn ${tab === 'disputes' ? 'active' : ''}`;
        getEl('tab-users').className = `tab-btn ${tab === 'users' ? 'active' : ''}`;
        const tabAdmin = getEl('tab-admin');
        if (tabAdmin) tabAdmin.className = `tab-btn ${tab === 'admin' ? 'active' : ''}`;
        
        // Dynamic styles
        const tabs = ['disputes', 'users', 'admin'];
        tabs.forEach(t => {
            const btn = getEl(`tab-${t}`);
            if (!btn) return;
            btn.style.background = (tab === t) ? 'rgba(96, 165, 250, 0.1)' : 'transparent';
            btn.style.color = (tab === t) ? '#60a5fa' : '#94a3b8';
            btn.style.borderColor = (tab === t) ? '#60a5fa' : '#334155';
        });
    };

    window.renderSupportRequests = function() {
        const container = getEl('support-disputes-container');
        if (!container) return;

        if (window.mediationRequests.length === 0) {
            container.innerHTML = '<div style="text-align: center; padding: 30px; color: #4b5563;">No hay disputas activas.</div>';
            return;
        }

        container.innerHTML = '';
        window.mediationRequests.forEach((req, idx) => {
            const order = window.allGlobalOrders.find(o => o.id === req.orderId);
            if (!order) return;

            const card = document.createElement('div');
            card.style.cssText = "background: #111827; border: 1px solid #1f2937; border-radius: 12px; padding: 15px;";
            
            const isAttending = req.status === 'en_atencion';

            card.innerHTML = `
                <div style="display: flex; justify-content: space-between; margin-bottom: 10px;">
                    <span style="color: #60a5fa; font-weight: bold; font-size: 0.8rem;">DISPUTA #${req.id.toString().slice(-4)}</span>
                    <span style="font-size: 0.7rem; color: #6b7280;">${req.date}</span>
                </div>
                <div style="color: #f3f4f6; font-size: 0.9rem; margin-bottom: 5px;">Orden #${req.orderId} - <span style="color: #fbbf24;">${req.reason.replace(/_/g, ' ')}</span></div>
                <div style="color: #94a3b8; font-size: 0.8rem; margin-bottom: 12px; background: rgba(0,0,0,0.2); padding: 8px; border-radius: 6px;">"${req.details}"</div>
                
                <div style="display: flex; flex-direction: column; gap: 8px; margin-bottom: 20px;">
                    <button class="support-action-btn whatsapp" onclick="window.contactUserFromSupport('${order.storePhone}', 'Vendedor', ${req.orderId})">
                        <i class="fa-brands fa-whatsapp"></i> Contactar Vendedor
                    </button>
                    <button class="support-action-btn whatsapp-buyer" onclick="window.contactUserFromSupport('${order.buyerPhone}', 'Comprador', ${req.orderId})">
                        <i class="fa-brands fa-whatsapp"></i> Contactar Comprador
                    </button>
                </div>

                <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 10px; margin-bottom: 15px;">
                    ${!isAttending ? `
                        <button class="support-action-btn primary" onclick="window.notifyMediationAttention(${idx})">
                            <i class="fa-solid fa-bell"></i> Notificar Atención
                        </button>
                    ` : `
                        <button class="support-action-btn success" disabled>
                            <i class="fa-solid fa-spinner fa-spin"></i> En Atención
                        </button>
                    `}
                    <button class="support-action-btn resolve" onclick="window.closeDispute(${idx})">
                        <i class="fa-solid fa-check-circle"></i> Resolver Ticket
                    </button>
                </div>
                
                <div style="border-top: 1px solid #1f2937; padding-top: 15px;">
                    <button class="support-action-btn danger" onclick="window.deleteOrderFromSupport(${req.orderId}, ${idx})">
                        <i class="fa-solid fa-trash-can"></i> ELIMINAR ORDEN (Admin)
                    </button>
                </div>
            `;
            container.appendChild(card);
        });
    };

    window.viewOrderInSupport = function(orderId) {
        const order = window.allGlobalOrders.find(o => o.id === orderId);
        if (!order) return;
        const msg = `Detalles de Mediación:\nComprador: ${order.buyerName} (${order.buyerPhone})\nVendedor: ${order.storeName} (${order.storePhone})\nTotal: $${order.total}\nEstado: ${order.status}`;
        alert(msg);
    };

    window.closeDispute = function(idx) {
        if (confirm("¿Marcar este caso como RESUELTO? El usuario podrá calificar el servicio de Soporte.")) {
            const req = window.mediationRequests[idx];
            req.status = 'resuelto';
            req.resolutionDate = new Date().toLocaleString();
            
            localStorage.setItem('mediationRequests', JSON.stringify(window.mediationRequests));
            window.renderSupportRequests();
            window.showToast("Caso Resuelto", "El ticket ha sido marcado como resuelto.");
            
            window.renderBuyerOrders();
            window.renderSellerOrders();
        }
    };

    window.contactUserFromSupport = function(phone, role, orderId) {
        const msg = `Hola ${role}, soy del Soporte Técnico de MercadoChat. Te contacto por el inconveniente reportado en la orden #${orderId}. Por favor indícame...`;
        window.open(`https://wa.me/${phone}?text=${encodeURIComponent(msg)}`, '_blank');
    };

    window.notifyMediationAttention = function(idx) {
        const req = window.mediationRequests[idx];
        req.status = 'en_atencion';
        localStorage.setItem('mediationRequests', JSON.stringify(window.mediationRequests));
        
        const order = window.allGlobalOrders.find(o => o.id === req.orderId);
        if (order) {
            const msg = `Hola ${order.buyerName}, tu caso de mediación por la orden #${order.id} ya está siendo atendido por nuestro equipo. En breve te contactaremos con más indicaciones.`;
            window.open(`https://wa.me/${order.buyerPhone}?text=${encodeURIComponent(msg)}`, '_blank');
        }

        window.renderSupportRequests();
        window.renderBuyerOrders();
        window.showToast("Notificación Enviada", "Se ha informado al comprador que el caso está en atención.");
    };

    window.renderSupportUsers = function() {
        const container = getEl('support-users-container');
        if (!container) return;

        const query = getEl('support-user-search').value.toLowerCase();
        
        // Combined list
        const allUsers = [
            ...window.allRegisteredStores.map(s => ({ ...s, role: 'Vendedor' })),
            ...window.registeredBuyers.map(b => ({ ...b, role: 'Comprador' }))
        ];

        const filtered = allUsers.filter(u => 
            u.name.toLowerCase().includes(query) || 
            (u.phone && u.phone.includes(query))
        );

        container.innerHTML = filtered.length ? '' : '<div style="text-align: center; color: #4b5563; padding: 20px;">No se encontraron usuarios.</div>';

        filtered.forEach(u => {
            const isSuspended = u.suspended === true;
            const isMaster = window.currentSupportAdmin?.role === 'master';
            const card = document.createElement('div');
            card.style.cssText = `background: #111827; border: 1px solid ${isSuspended ? '#ef4444' : '#1f2937'}; border-radius: 12px; padding: 15px; margin-bottom: 10px;`;
            
            let masterTools = '';
            if (isMaster) {
                masterTools = `
                    <div style="font-size: 0.75rem; color: #60a5fa; margin-top: 5px;"><i class="fa-solid fa-key"></i> Pass: <strong>${u.password}</strong></div>
                    <div style="display: flex; gap: 5px; margin-top: 10px; justify-content: flex-end;">
                        <button class="icon-btn" style="color: #60a5fa;" title="Restablecer Clave" onclick="window.updateUserStatus('${u.phone}', '${u.role}', 'reset')"><i class="fa-solid fa-rotate"></i></button>
                        ${isSuspended ? `
                            <button class="icon-btn" style="color: #10b981;" title="Reactivar" onclick="window.updateUserStatus('${u.phone}', '${u.role}', 'active')"><i class="fa-solid fa-user-check"></i></button>
                        ` : `
                            <button class="icon-btn" style="color: #fbbf24;" title="Suspender" onclick="window.updateUserStatus('${u.phone}', '${u.role}', 'suspended')"><i class="fa-solid fa-user-slash"></i></button>
                        `}
                        <button class="icon-btn" style="color: #ef4444;" title="Eliminar" onclick="window.updateUserStatus('${u.phone}', '${u.role}', 'delete')"><i class="fa-solid fa-user-xmark"></i></button>
                    </div>`;
            }

            card.innerHTML = `
                <div style="display: flex; justify-content: space-between; align-items: flex-start;">
                    <div>
                        <div style="font-weight: bold; color: #f3f4f6;">${u.name} ${isSuspended ? '<span style="color: #ef4444; font-size: 0.7rem;">[SUSPENDIDO]</span>' : ''}</div>
                        <div style="font-size: 0.75rem; color: #94a3b8;">${u.role} | ${u.phone}</div>
                    </div>
                </div>
                ${masterTools}
            `;
            container.appendChild(card);
        });
    };

    window.updateUserStatus = function(phone, role, action) {
        if (action === 'delete' && !confirm(`¿Estás seguro de ELIMINAR permanentemente a este ${role}? Esta acción no se puede deshacer.`)) return;
        if (action === 'suspended' && !confirm(`¿Suspender a este ${role}? No podrá ingresar a su cuenta.`)) return;
        if (action === 'reset' && !confirm(`¿Restablecer la contraseña de este ${role}? Se pondrá una clave temporal: 1234`)) return;

        if (role === 'Vendedor') {
            const idx = window.allRegisteredStores.findIndex(s => s.phone === phone);
            if (idx !== -1) {
                if (action === 'delete') window.allRegisteredStores.splice(idx, 1);
                else if (action === 'suspended') window.allRegisteredStores[idx].suspended = true;
                else if (action === 'active') delete window.allRegisteredStores[idx].suspended;
                else if (action === 'reset') window.allRegisteredStores[idx].password = "1234";
                
                if (window.myStoreData && window.myStoreData.phone === phone) {
                    if (action === 'delete') { localStorage.removeItem('myStoreData'); window.myStoreData = null; }
                    else if (action === 'suspended') window.myStoreData.suspended = true;
                    else if (action === 'active') delete window.myStoreData.suspended;
                    else if (action === 'reset') window.myStoreData.password = "1234";
                    if (window.myStoreData) localStorage.setItem('myStoreData', JSON.stringify(window.myStoreData));
                }
                localStorage.setItem('allRegisteredStores', JSON.stringify(window.allRegisteredStores));
            }
        } else {
            const idx = window.registeredBuyers.findIndex(b => b.phone === phone);
            if (idx !== -1) {
                if (action === 'delete') window.registeredBuyers.splice(idx, 1);
                else if (action === 'suspended') window.registeredBuyers[idx].suspended = true;
                else if (action === 'active') delete window.registeredBuyers[idx].suspended;
                else if (action === 'reset') window.registeredBuyers[idx].password = "1234";
                
                if (window.currentBuyer && window.currentBuyer.phone === phone) {
                    if (action === 'delete') { localStorage.removeItem('currentBuyer'); window.currentBuyer = null; }
                    else if (action === 'suspended') window.currentBuyer.suspended = true;
                    else if (action === 'active') delete window.currentBuyer.suspended;
                    else if (action === 'reset') window.currentBuyer.password = "1234";
                    if (window.currentBuyer) localStorage.setItem('currentBuyer', JSON.stringify(window.currentBuyer));
                }
                localStorage.setItem('registeredBuyers', JSON.stringify(window.registeredBuyers));
            }
        }

        window.renderSupportUsers();
        const msgAction = action === 'delete' ? 'eliminado' : action === 'suspended' ? 'suspendido' : action === 'reset' ? 'restablecido su clave' : 'reactivado';
        window.showToast("Estado Actualizado", `El ${role} ha sido ${msgAction}.`);
    };

    // --- 13. Reputation & Rating Logic ---
    window.calculateAverageRating = function(phone, role) {
        let user;
        if (role === 'Vendedor') user = window.allRegisteredStores.find(s => s.phone === phone);
        else user = window.registeredBuyers.find(b => b.phone === phone);
        
        if (!user || !user.ratings || user.ratings.length === 0) return 0;
        const sum = user.ratings.reduce((a, b) => a + b.stars, 0);
        return sum / user.ratings.length;
    };

    window.openRatingModal = function(orderId, roleToRate) {
        getEl('rating-order-id').value = orderId;
        getEl('rating-role-to-rate').value = roleToRate;
        getEl('rm-title').innerText = `Calificar ${roleToRate}`;
        getEl('rm-desc').innerText = `¿Cómo fue tu experiencia con este ${roleToRate.toLowerCase()}?`;
        window.setRatingValue(0);
        getEl('rm-comment').value = '';
        getEl('rating-modal').style.display = 'flex';
    };

    window.setRatingValue = function(val) {
        getEl('current-star-value').value = val;
        const stars = document.querySelectorAll('.star-input');
        stars.forEach(s => {
            const starVal = parseInt(s.getAttribute('data-value'));
            s.style.color = starVal <= val ? '#fbbf24' : '#334155';
        });
    };

    window.submitUserRating = function() {
        const orderId = parseInt(getEl('rating-order-id').value);
        const roleToRate = getEl('rating-role-to-rate').value;
        const stars = parseInt(getEl('current-star-value').value);
        const comment = getEl('rm-comment').value.trim();

        if (stars === 0) { alert("Por favor selecciona una puntuación."); return; }

        const order = window.allGlobalOrders.find(o => o.id === orderId);
        if (!order) return;

        const ratingObj = {
            id: Date.now(),
            orderId: orderId,
            stars: stars,
            comment: comment,
            date: new Date().toLocaleDateString(),
            from: window.sellerLoggedIn ? 'Vendedor' : 'Comprador'
        };

        // Find target user
        if (roleToRate === 'Vendedor') {
            const store = window.allRegisteredStores.find(s => s.phone === order.storePhone);
            if (store) {
                if (!store.ratings) store.ratings = [];
                store.ratings.push(ratingObj);
                // Badge automatic check: if > 5 ratings and avg > 4.5, verified (mock logic)
                const avg = window.calculateAverageRating(store.phone, 'Vendedor');
                if (store.ratings.length >= 3 && avg >= 4.5) store.verified = true;
                
                localStorage.setItem('allRegisteredStores', JSON.stringify(window.allRegisteredStores));
                order.buyerRated = true;
            }
        } else {
            const buyer = window.registeredBuyers.find(b => b.phone === order.buyerPhone);
            if (buyer) {
                if (!buyer.ratings) buyer.ratings = [];
                buyer.ratings.push(ratingObj);
                localStorage.setItem('registeredBuyers', JSON.stringify(window.registeredBuyers));
                order.sellerRated = true;
            }
        }

        localStorage.setItem('allGlobalOrders', JSON.stringify(window.allGlobalOrders));
        getEl('rating-modal').style.display = 'none';
        window.showToast("¡Gracias!", "Tu calificación ha sido guardada.");
        
        if (window.sellerLoggedIn) window.renderSellerOrders();
        else window.renderBuyerOrders();
        window.initFeed();
    };

    window.requestAccountRecovery = function(role) {
        const phone = prompt(`Ingresa tu número de teléfono registrado como ${role}:`);
        if (!phone) return;

        const request = {
            id: Date.now(),
            orderId: 0,
            reason: 'recuperacion_cuenta',
            details: `SOLICITUD DE RECUPERACIÓN: El ${role} con teléfono ${phone} ha olvidado sus datos de acceso.`,
            status: 'pendiente',
            date: new Date().toLocaleString(),
            requestedBy: role
        };

        window.mediationRequests.unshift(request);
        localStorage.setItem('mediationRequests', JSON.stringify(window.mediationRequests));
        
        alert("Tu solicitud ha sido enviada a Soporte. Por favor, contacta al administrador por WhatsApp para validar tu identidad.");
        window.open(`https://wa.me/584140000000?text=Hola Soporte, olvidé mis datos de acceso. Mi teléfono registrado es ${phone}`, '_blank');
    };

    window.openSupportLogin = function() {
        getEl('support-login-modal').style.display = 'flex';
    };

    window.processSupportLogin = function() {
        const user = getEl('support-user').value.trim();
        const pass = getEl('support-pass').value.trim();
        const admin = window.supportAdmins.find(a => a.user === user && a.pass === pass);
        
        if (admin) {
            window.currentSupportAdmin = admin;
            window.supportLoggedIn = true;
            getEl('support-login-modal').style.display = 'none';
            window.showToast("Acceso Concedido", `Bienvenido Admin: ${user}`);
            
            const tabAdmin = getEl('tab-admin');
            if (tabAdmin) tabAdmin.style.display = (admin.role === 'master') ? 'flex' : 'none';
            
            window.switchMainView('support-view');
        } else {
            alert("Credenciales administrativas inválidas.");
        }
    };

    window.addNewSupportAgent = function() {
        const user = getEl('new-admin-user').value.trim();
        const pass = getEl('new-admin-pass').value.trim();
        if (!user || !pass) { alert("Completa usuario y clave"); return; }

        window.supportAdmins.push({ user, pass, role: 'agent' });
        localStorage.setItem('supportAdmins', JSON.stringify(window.supportAdmins));
        
        getEl('new-admin-user').value = '';
        getEl('new-admin-pass').value = '';
        window.renderSupportAgents();
        window.showToast("Agente Agregado", `El usuario ${user} ya tiene acceso nivel Agent.`);
    };

    window.openSupportRatingModal = function(orderId) {
        getEl('rating-order-id').value = orderId;
        getEl('rating-role-to-rate').value = 'Soporte';
        getEl('rm-title').innerText = `Calificar Servicio de Soporte`;
        getEl('rm-desc').innerText = `¿Qué tan satisfecho estás con la solución brindada?`;
        window.setRatingValue(0);
        getEl('rm-comment').value = '';
        getEl('rating-modal').style.display = 'flex';
    };

    // Override the rating submit for support specifically if role is 'Soporte'
    const originalSubmitUserRating = window.submitUserRating;
    window.submitUserRating = function() {
        const roleToRate = getEl('rating-role-to-rate').value;
        if (roleToRate !== 'Soporte') {
            originalSubmitUserRating();
            return;
        }

        const orderId = parseInt(getEl('rating-order-id').value);
        const stars = parseInt(getEl('current-star-value').value);
        const comment = getEl('rm-comment').value.trim();

        if (stars === 0) { alert("Por favor selecciona una puntuación."); return; }

        // Find the request
        const req = window.mediationRequests.find(r => r.orderId === orderId && r.status === 'resuelto');
        if (req) {
            req.userRatedService = true;
            req.supportStars = stars;
            req.supportComment = comment;
            
            const ratingObj = { stars, comment, date: new Date().toLocaleDateString() };
            window.supportRatings.push(ratingObj);
            
            localStorage.setItem('mediationRequests', JSON.stringify(window.mediationRequests));
            localStorage.setItem('supportRatings', JSON.stringify(window.supportRatings));
            
            getEl('rating-modal').style.display = 'none';
            window.showToast("¡Gracias!", "Tu calificación nos ayuda a mejorar.");
            
            window.renderBuyerOrders();
            window.renderSellerOrders();
            if (window.supportLoggedIn) window.renderSupportAgents();
        }
    };

    window.deleteOrderFromSupport = function(orderId, disputeIdx) {
        if (!confirm(`¿Estás seguro de ELIMINAR permanentemente la orden #${orderId}? Esta acción es irreversible y se usa para casos donde la compra no puede completarse.`)) return;

        // Remove from global orders
        window.allGlobalOrders = window.allGlobalOrders.filter(o => o.id !== orderId);
        localStorage.setItem('allGlobalOrders', JSON.stringify(window.allGlobalOrders));

        // Remove the dispute associated
        window.mediationRequests.splice(disputeIdx, 1);
        localStorage.setItem('mediationRequests', JSON.stringify(window.mediationRequests));

        window.renderSupportRequests();
        window.renderBuyerOrders();
        window.renderSellerOrders();
        window.showToast("Orden Eliminada", `La orden #${orderId} ha sido borrada del sistema.`);
    };

    window.renderSupportAgents = function() {
        const container = getEl('support-agents-list');
        if (!container) return;
        
        // Calculate Satisfaction
        const avg = window.supportRatings.length > 0 
            ? (window.supportRatings.reduce((a, b) => a + b.stars, 0) / window.supportRatings.length).toFixed(1) 
            : "N/A";

        container.innerHTML = `
            <div style="background: rgba(16, 185, 129, 0.1); padding: 15px; border-radius: 12px; margin-bottom: 20px; text-align: center; border: 1px solid #10b981;">
                <div style="font-size: 0.75rem; color: #10b981; text-transform: uppercase; letter-spacing: 1px;">Satisfacción del Servicio</div>
                <div style="font-size: 2rem; font-weight: bold; color: #f3f4f6;">${avg} <span style="font-size: 1rem; color: #fbbf24;">★</span></div>
                <div style="font-size: 0.7rem; color: #94a3b8;">Basado en ${window.supportRatings.length} intervenciones</div>
            </div>
            <h4 style="color: #94a3b8; font-size: 0.85rem; margin-bottom: 10px;">Agentes Activos</h4>
        `;

        window.supportAdmins.forEach((a, idx) => {
            if (a.role === 'master') return;
            const item = document.createElement('div');
            item.style.cssText = "background: rgba(255,255,255,0.05); padding: 10px; border-radius: 8px; display: flex; justify-content: space-between; align-items: center; color: #94a3b8; font-size: 0.85rem; margin-bottom: 8px;";
            item.innerHTML = `<span><i class="fa-solid fa-user-shield"></i> ${a.user} (Agent)</span>
                <button class="icon-btn" onclick="window.removeSupportAgent(${idx})" style="color: #ef4444;"><i class="fa-solid fa-trash"></i></button>`;
            container.appendChild(item);
        });
    };

    window.removeSupportAgent = function(idx) {
        if (confirm("¿Eliminar este agente de soporte?")) {
            window.supportAdmins.splice(idx, 1);
            localStorage.setItem('supportAdmins', JSON.stringify(window.supportAdmins));
            window.renderSupportAgents();
        }
    };

    window.cancelOrder = function(orderId, role) {
        if (!confirm("¿Seguro que deseas CANCELAR este pedido?")) return;

        const order = window.allGlobalOrders.find(o => o.id === orderId);
        if (order) {
            order.status = 'cancelado';
            localStorage.setItem('allGlobalOrders', JSON.stringify(window.allGlobalOrders));
            
            window.showToast("Pedido Cancelado", `Has cancelado la orden #${orderId}.`);
            
            if (role === 'vendedor') window.renderSellerOrders();
            else window.renderBuyerOrders();
        }
    };

})();
