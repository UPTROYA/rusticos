/**
 * RUSTICOS CORE
 */

const CONFIG = {
    whatsappNumber: '5561910181201',
    anotaAiLink: 'https://pedido.anota.ai/loja/_rustico_burguer?f=ms',
    defaultCategory: 'burger',
    currency: 'BRL',
    locale: 'pt-BR',
    heroParallaxDelay: 1200
};

// DADOS
const menuItems = [
    { id: 1, type: "burger", price: 29.99, name: "Clássico", cat: "Signature", desc: "O clássico pão brioche, hambúrguer 180g, queijo, bacon de respeito e maionese da casa pra fechar com chave de ouro.", img: "img/Clássico.webp", badges: ["Clássico"], isBestSeller: false },
    { id: 2, type: "burger", price: 35.99, name: "Rústico", cat: "Best Seller", desc: "Pão brioche, Hambúrguer artesanal 180g, coberto com American Cheese, cebola caramelizada, farofa de bacon e Doritos.", img: "img/Rustico.webp", badges: ["Mais Vendido", "Crocante"], isBestSeller: true },
    { id: 3, type: "burger", price: 32.99, name: "Sistemático", cat: "Concept", desc: "Um hambúrguer que é puro sistema: pão brioche fofinho, carne artesanal 180g suculenta, cheddar derretido, bacon caramelizado no melaço de cana (aquele docinho irresistível) e o molho especial da casa com uma picância de leve.", img: "img/sistematico.webp", badges: ["Picante"], isBestSeller: false },
    { id: 4, type: "burger", price: 37.99, name: "Sertanejo", cat: "Special", desc: "Pão brioche, blend 250g, 4 queijos, ovo, bacon e molhos da casa.", img: "img/sertanejo.webp", badges: ["Exclusivo"], isBestSeller: false },
    { id: 5, type: "burger", price: 42.99, name: "Bruto", cat: "Monster", desc: "Pão brioche com gergelim, dois hambúrgueres de 180g, cheddar derretido, tiras crocantes de bacon, maionese da casa e cebola crispy.", img: "img/Bruto.webp", badges: ["Para Fome Grande"], isBestSeller: false },
    { id: 6, type: "burger", price: 32.99, name: "Doce Burger", cat: "Sweet", desc: "Pão brioche macio, burger de 180g selado na chapa, duas fatias de queijo prato derretido, doce de leite cremoso e farofa crocante de bacon. Uma combinação marcante de doce, salgado e crocância.", img: "img/Doce.webp", badges: ["Sobremesa"], isBestSeller: false },
    { id: 7, type: "burger", price: 29.99, name: "Pit - O podrão à moda Goiâna", cat: "Local", desc: "A nossa releitura do clássico goiano: pão macio, abacaxi selado na chapa, carne artesanal de 100g, queijo mussarela derretido, ovo na chapa, alface crocante, tomate fresco, bacon dourado, milho verde e uma chuva de batata palha pra fechar no estilo.", img: "img/pit.webp", badges: [], isBestSeller: false },
    { id: 8, type: "burger", price: 32.99, name: "Salada Bacon", cat: "Fresh", desc: "Pão brioche, alface americana crocante, tomate em fatias, blend artesanal 180g, mussarela derretida e bacon crocante.", img: "img/salada.webp", badges: ["Leve"], isBestSeller: false },
    { id: 9, type: "burger", price: 31.99, name: "Galo Bravo", cat: "Chicken", desc: "Pão brioche fofinho abraçando 180g de peito de frango empanado, suculento e recheado com queijo. Por cima, duas fatias de queijo derretendo, bacon crocante e aquela maionese que fecha o combo com chave de ouro. Um sanduíche ousado, crocante e carregado de sabor.", img: "img/galo.webp", badges: ["Frango"], isBestSeller: false },
    { id: 10, type: "portion", price: 20.00, name: "Batata 500g", cat: "Acompanhamento", desc: "500g de batata in natura.", img: "img/batata500.webp", badges: ["Compartilhar"], isBestSeller: true },
    { id: 11, type: "portion", price: 6.00, name: "Batata 150g", cat: "Acompanhamento", desc: "150g de batata In natura.", img: "img/batata150.webp", badges: [], isBestSeller: false },
    { id: 12, type: "portion", price: 20.00, name: "Discos Rústicos", cat: "Entrada", desc: "100g de carne moída moldada no formato de um disquinho, recheada com 3 fatias de queijo bem derretido e duplamente empanada pra ficar crocante de verdade. Por fora, casquinha dourada; por dentro, queijo transbordando. Um petisco simples, rústico e viciante.", img: "img/discos.webp", badges: ["Entrada"], isBestSeller: false },
];

/* --- UTILS --- */
const Utils = {
    formatPrice: (value) => {
        return value.toLocaleString(CONFIG.locale, {
            style: 'currency',
            currency: CONFIG.currency
        });
    },

    // Apenas para strings simples, não para HTML estruturado
    sanitize: (str) => {
        const div = document.createElement('div');
        div.textContent = str;
        return div.innerHTML;
    },

    renderBadges: (badges) => {
        if (!badges || badges.length === 0) return '';
        return badges.map(badge => {
            let badgeClass = 'bg-black';
            if (badge === 'Mais Vendido' || badge === 'Picante') badgeClass = 'bg-red';
            if (badge === 'Exclusivo' || badge === 'Clássico') badgeClass = 'bg-gold';
            // Usamos sanitize aqui pois isso será injetado via innerHTML no grid
            return `<span class="badge-item ${badgeClass}">${Utils.sanitize(badge)}</span>`;
        }).join('');
    }
};

/* --- STATE MANAGEMENT --- */
const AppState = {
    currentCategory: CONFIG.defaultCategory,
    isModalOpen: false,
    heroVisible: true, 
    allowParallax: false 
};

/* --- DOM ELEMENTS --- */
const DOM = {
    grid: document.getElementById('menuGrid'),
    filters: document.getElementById('filterContainer'),
    modal: {
        overlay: document.getElementById('productModal'),
        close: document.querySelector('#productModal .modal-close'),
        content: document.getElementById('modalContent'),
        img: document.getElementById('modalImg'),
        title: document.getElementById('modalTitle'),
        desc: document.getElementById('modalDesc'),
        price: document.getElementById('modalPrice'),
        cat: document.getElementById('modalCat'),
        btn: document.getElementById('modalBtnAction'), 
        badges: document.getElementById('modalBadges')
    },
    choice: {
        overlay: document.getElementById('choiceModal'),
        close: document.querySelector('#choiceModal .choice-close'),
        btnAnota: document.getElementById('btnChoiceAnotaAi'),
        btnWpp: document.getElementById('btnChoiceWhatsapp')
    },
    hero: {
        section: document.getElementById('hero'),
        img: document.querySelector('.hero-img-floating'),
    },
    navBtn: document.getElementById('navOrderBtn'),
    mobileBtn: document.getElementById('mobileOrderBtn')
};

/* --- SYSTEM: MENU --- */
const MenuSystem = {
    init() {
        this.renderFilters();
        this.renderGrid(CONFIG.defaultCategory);
        this.setupDelegation();
    },

    renderFilters() {
        const categories = [
            { id: 'burger', label: 'Burgers', icon: 'fa-burger' },
            { id: 'portion', label: 'Porções', icon: 'fa-bowl-food' },
        ];

        DOM.filters.innerHTML = categories.map(cat => `
            <button class="filter-btn ${cat.id === CONFIG.defaultCategory ? 'active' : ''}" 
                    data-id="${cat.id}" type="button" aria-pressed="${cat.id === CONFIG.defaultCategory}">
                <i class="fa-solid ${cat.icon}"></i> ${cat.label}
            </button>
        `).join('');
    },

    renderGrid(category) {
        let items = category === 'all' ? menuItems : menuItems.filter(i => i.type === category);
        items.sort((a, b) => (b.isBestSeller === true) - (a.isBestSeller === true));

        if (items.length === 0) {
            DOM.grid.innerHTML = `<p class="text-center" style="grid-column:1/-1; padding:40px; color:#888">Novidades em breve.</p>`;
            return;
        }

        // Mantido innerHTML para performance de renderização de lista, mas usamos sanitize e lazy loading
        DOM.grid.innerHTML = items.map(item => `
            <article class="menu-card" data-id="${item.id}" role="button" tabindex="0">
                ${item.isBestSeller ? '<span class="card-badge-best" style="position:absolute; top:10px; right:10px; color:#DAA520;"><i class="fa-solid fa-star"></i></span>' : ''}
                <div class="card-img">
                    <div class="card-badges">${Utils.renderBadges(item.badges)}</div>
                    <img src="${item.img}" alt="${Utils.sanitize(item.name)}" loading="lazy" 
                           onerror="this.src='https://images.unsplash.com/photo-1568901346375-23c9450c58cd?q=80&w=600'">
                </div>
                <div class="card-content">
                    <span class="card-cat">${Utils.sanitize(item.cat)}</span>
                    <h3 class="card-title">${Utils.sanitize(item.name)}</h3>
                    <p class="card-desc">${Utils.sanitize(item.desc)}</p>
                    <div class="card-footer">
                        <span class="card-price-mini">${Utils.formatPrice(item.price)}</span>
                        <div class="btn-add-mini"><i class="fa-solid fa-plus"></i></div>
                    </div>
                </div>
            </article>
        `).join('');

        if(window.gsap) {
            gsap.fromTo(DOM.grid.children, 
                { y: 20, opacity: 0 }, 
                { y: 0, opacity: 1, duration: 0.4, stagger: 0.05, ease: "power2.out", clearProps: "all" }
            );
        }
    },

    setupDelegation() {
        DOM.filters.addEventListener('click', (e) => {
            const btn = e.target.closest('.filter-btn');
            if(!btn) return;
            
            document.querySelectorAll('.filter-btn').forEach(b => {
                b.classList.remove('active');
                b.setAttribute('aria-pressed', 'false');
            });
            btn.classList.add('active');
            btn.setAttribute('aria-pressed', 'true');
            
            AppState.currentCategory = btn.dataset.id;
            this.renderGrid(AppState.currentCategory);
        });

        DOM.grid.addEventListener('click', (e) => {
            const card = e.target.closest('.menu-card');
            if(card) ModalSystem.open(Number(card.dataset.id));
        });

        DOM.grid.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
                const card = e.target.closest('.menu-card');
                if(card) {
                    e.preventDefault();
                    ModalSystem.open(Number(card.dataset.id));
                }
            }
        });
    }
};

/* --- SYSTEM: CHOICE MODAL --- */
const ChoiceSystem = {
    previousActiveElement: null,

    init() {
        DOM.choice.close.addEventListener('click', () => this.close());
        
        DOM.choice.overlay.addEventListener('click', (e) => {
            if(e.target === DOM.choice.overlay) this.close();
        });

        DOM.choice.overlay.addEventListener('keydown', (e) => {
             if (e.key === 'Tab') this.handleTab(e);
             if (e.key === 'Escape') this.close();
        });

        // Configurar Anota AI (Link fixo)
        DOM.choice.btnAnota.href = CONFIG.anotaAiLink;

        // Configurar Botões que abrem este modal
        const openHandler = (e) => {
            e.preventDefault();
            this.open(null);
        };

        if(DOM.navBtn) DOM.navBtn.addEventListener('click', openHandler);
        if(DOM.mobileBtn) DOM.mobileBtn.addEventListener('click', openHandler);
    },

    open(product = null) {
        this.previousActiveElement = document.activeElement;
        let waLink = '';
        
        if (product) {
            const message = `Olá Rústicos! Gostaria de pedir o *${product.name}*`;
            waLink = `https://wa.me/${CONFIG.whatsappNumber}?text=${encodeURIComponent(message)}`;
        } else {
            const message = `Olá Rústicos! Gostaria de fazer um pedido.`;
            waLink = `https://wa.me/${CONFIG.whatsappNumber}?text=${encodeURIComponent(message)}`;
        }

        DOM.choice.btnWpp.href = waLink;
        
        DOM.choice.overlay.classList.add('active');
        DOM.choice.overlay.setAttribute('aria-hidden', 'false');
        if(!AppState.isModalOpen) document.body.style.overflow = 'hidden';

        // Focus Trap
        setTimeout(() => DOM.choice.close.focus(), 50);
    },

    close() {
        DOM.choice.overlay.classList.remove('active');
        DOM.choice.overlay.setAttribute('aria-hidden', 'true');
        
        // Só libera o scroll se o outro modal não estiver aberto
        if(!AppState.isModalOpen) document.body.style.overflow = '';
        
        if(this.previousActiveElement) {
            this.previousActiveElement.focus();
            this.previousActiveElement = null;
        }
    },

    handleTab(e) {
        const focusable = DOM.choice.overlay.querySelectorAll('button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])');
        const first = focusable[0];
        const last = focusable[focusable.length - 1];

        if (e.shiftKey) {
            if (document.activeElement === first) {
                e.preventDefault();
                last.focus();
            }
        } else {
            if (document.activeElement === last) {
                e.preventDefault();
                first.focus();
            }
        }
    }
};

/* --- SYSTEM: PRODUCT MODAL --- */
const ModalSystem = {
    currentItem: null,
    previousActiveElement: null,

    init() {
        DOM.modal.close.addEventListener('click', () => this.close());
        DOM.modal.overlay.addEventListener('click', (e) => {
            if(e.target === DOM.modal.overlay) this.close();
        });
        document.addEventListener('keydown', (e) => {
            if(AppState.isModalOpen && e.key === 'Escape') this.close();
            if(AppState.isModalOpen && e.key === 'Tab') this.handleTab(e);
        });

        // Botão "Fazer Pedido" dentro do modal abre a escolha
        DOM.modal.btn.addEventListener('click', (e) => {
            e.preventDefault();
            if(this.currentItem) {
                ChoiceSystem.open(this.currentItem);
            }
        });
    },

    open(id) {
        const item = menuItems.find(i => i.id === id);
        if(!item) return;

        this.previousActiveElement = document.activeElement;
        this.currentItem = item;
        AppState.isModalOpen = true;

        DOM.modal.img.src = item.img;
        DOM.modal.img.alt = item.name;
        // Use textContent instead of innerHTML
        DOM.modal.cat.textContent = item.cat;
        DOM.modal.title.textContent = item.name;
        DOM.modal.desc.textContent = item.desc;
        DOM.modal.price.textContent = Utils.formatPrice(item.price);
        
        // Badges ainda precisam ser gerados como HTML para estrutura visual correta
        DOM.modal.badges.innerHTML = Utils.renderBadges(item.badges);

        DOM.modal.overlay.classList.add('active');
        DOM.modal.overlay.setAttribute('aria-hidden', 'false');
        document.body.style.overflow = 'hidden';

        // Focus Trap Initial
        setTimeout(() => DOM.modal.close.focus(), 50);
    },

    close() {
        if (!AppState.isModalOpen) return;
        
        AppState.isModalOpen = false;
        this.currentItem = null;
        DOM.modal.overlay.classList.remove('active');
        DOM.modal.overlay.setAttribute('aria-hidden', 'true');
        document.body.style.overflow = '';

        if(this.previousActiveElement) {
            this.previousActiveElement.focus();
            this.previousActiveElement = null;
        }
    },

    handleTab(e) {
        const focusable = DOM.modal.overlay.querySelectorAll('button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])');
        if (focusable.length === 0) return;

        const first = focusable[0];
        const last = focusable[focusable.length - 1];

        if (e.shiftKey) {
            if (document.activeElement === first) {
                e.preventDefault();
                last.focus();
            }
        } else {
            if (document.activeElement === last) {
                e.preventDefault();
                first.focus();
            }
        }
    }
};

/* --- VISUALS --- */
const VisualController = {
    init() {
        this.setupLenis();
        this.setupHeroAnimations();
        this.removePreloader();
    },

    removePreloader() {
        const loader = document.querySelector('.preloader');
        if(window.gsap && loader) {
            gsap.to(loader, { opacity: 0, duration: 0.5, onComplete: () => loader.style.display = 'none' });
        } else if (loader) {
            loader.style.display = 'none';
        }
    },

    setupLenis() {
        if(typeof Lenis !== 'undefined') {
            const lenis = new Lenis({ duration: 1.2, easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)) });
            function raf(time) { lenis.raf(time); requestAnimationFrame(raf); }
            requestAnimationFrame(raf);
        }
        
        const navbar = document.querySelector('.navbar');
        window.addEventListener('scroll', () => {
            window.scrollY > 50 ? navbar.classList.add('scrolled') : navbar.classList.remove('scrolled');
        }, { passive: true });
    },

    setupHeroAnimations() {
        if(typeof gsap === 'undefined') return;
        const tl = gsap.timeline();
        tl.from(".reveal-hero", { y: 30, opacity: 0, duration: 0.8, stagger: 0.1, ease: "power2.out", delay: 0.2 });
        if(DOM.hero.img) {
            tl.fromTo(DOM.hero.img, 
                { scale: 1.1, opacity: 0, filter: 'blur(10px)' }, 
                { scale: 1, opacity: 1, filter: 'blur(0px)', duration: 1.2, ease: "power3.out" }, "-=0.4"
            );
        }
        setTimeout(() => { AppState.allowParallax = true; }, CONFIG.heroParallaxDelay);
        
        if(window.matchMedia("(hover: hover)").matches && DOM.hero.section) {
            DOM.hero.section.addEventListener('mousemove', (e) => {
                if(!AppState.allowParallax || !AppState.heroVisible) return;
                const x = (e.clientX / window.innerWidth - 0.5);
                const y = (e.clientY / window.innerHeight - 0.5);
                gsap.to('.hero-img-floating', { x: x * 20, y: y * 20, duration: 0.8, ease: "power1.out" });
                gsap.to('.rotating-stamp', { x: x * -10, y: y * -10, duration: 0.8, ease: "power1.out" });
            });
        }
        if(DOM.hero.section && typeof IntersectionObserver !== 'undefined') {
            const observer = new IntersectionObserver((entries) => { AppState.heroVisible = entries[0].isIntersecting; }, { threshold: 0.1 });
            observer.observe(DOM.hero.section);
        }
    }
};

document.addEventListener("DOMContentLoaded", () => {
    MenuSystem.init();
    ModalSystem.init();
    ChoiceSystem.init(); 
    VisualController.init();

    /* --- MOBILE MENU LOGIC --- */
    const mobileToggle = document.querySelector('.mobile-toggle');
    const mobileMenu = document.querySelector('.mobile-menu');
    const navLinks = document.querySelectorAll('.mobile-links a');
    const mobileOrderBtn = document.getElementById('mobileOrderBtn');

    if (mobileToggle && mobileMenu) {
        
        // Listener otimizado: só ativo quando o menu está aberto
        const closeMenuOnClickOutside = (e) => {
            if (mobileMenu.classList.contains('active') && 
                !mobileMenu.contains(e.target) && 
                !mobileToggle.contains(e.target)) {
                toggleMenu(true);
            }
        };

        function toggleMenu(forceClose = false) {
            const isActive = mobileMenu.classList.contains('active');
            
            if (forceClose || isActive) {
                mobileToggle.classList.remove('active');
                mobileMenu.classList.remove('active');
                mobileToggle.setAttribute('aria-expanded', 'false');
                document.body.style.overflow = '';
                document.removeEventListener('click', closeMenuOnClickOutside);
            } else {
                mobileToggle.classList.add('active');
                mobileMenu.classList.add('active');
                mobileToggle.setAttribute('aria-expanded', 'true');
                document.body.style.overflow = 'hidden';
                // Adiciona o listener apenas quando abre
                setTimeout(() => document.addEventListener('click', closeMenuOnClickOutside), 100);
            }
        }

        mobileToggle.addEventListener('click', (e) => {
            e.stopPropagation();
            toggleMenu();
        });

        // Fechar ao clicar nos links
        navLinks.forEach(link => {
            link.addEventListener('click', () => toggleMenu(true));
        });

        // Fechar ao clicar no botão "Fazer Pedido"
        if(mobileOrderBtn) {
            mobileOrderBtn.addEventListener('click', () => toggleMenu(true));
        }
    }
});