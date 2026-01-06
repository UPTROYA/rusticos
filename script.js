/**
 * RUSTICOS CORE
 */

const CONFIG = {
    defaultCategory: 'burger',
    currency: 'BRL',
    locale: 'pt-BR',
    heroParallaxDelay: 1200,
    heroTextSwapInterval: 8000
};

// DADOS (Preços convertidos para Number)
const menuItems = [
    { id: 1, type: "burger", price: 32.90, name: "Clássico", cat: "Signature", desc: "O clássico pão brioche, hambúrguer 180g, queijo, bacon de respeito e maionese da casa.", img: "img/clássico.png", badges: ["Clássico"], isBestSeller: false },
    { id: 2, type: "burger", price: 36.90, name: "Rústico", cat: "Best Seller", desc: "Pão brioche, Hambúrguer artesanal 180g, coberto com American Cheese, cebola caramelizada, farofa de bacon e Doritos.", img: "img/Rustico.png", badges: ["Mais Vendido", "Crocante"], isBestSeller: true },
    { id: 3, type: "burger", price: 38.90, name: "Sistemático", cat: "Concept", desc: "Pão brioche, carne artesanal 180g, cheddar, bacon no melaço de cana e molho picante.", img: "img/sistematico.png", badges: ["Picante"], isBestSeller: false },
    { id: 4, type: "burger", price: 42.90, name: "Sertanejo", cat: "Special", desc: "Pão brioche, blend 250g, 4 queijos, ovo, bacon e molhos da casa.", img: "img/sertanejo.png", badges: ["Exclusivo"], isBestSeller: false },
    { id: 5, type: "burger", price: 45.90, name: "Bruto", cat: "Monster", desc: "Pão com gergelim, dois burgers 180g, cheddar, tiras de bacon e cebola crispy.", img: "img/bruto.png", badges: ["Para Fome Grande"], isBestSeller: false },
    { id: 6, type: "burger", price: 28.90, name: "Doce Burger", cat: "Sweet", desc: "Pão brioche, burger 180g, queijo prato, doce de leite cremoso e farofa de bacon.", img: "img/doce.png", badges: ["Sobremesa"], isBestSeller: false },
    { id: 7, type: "burger", price: 26.90, name: "Pit", cat: "Local", desc: "Abacaxi selado, carne 100g, mussarela, ovo, alface, tomate, bacon, milho e batata palha.", img: "img/pit.png", badges: [], isBestSeller: false },
    { id: 8, type: "burger", price: 30.90, name: "Salada Bacon", cat: "Fresh", desc: "Pão brioche, alface, tomate, blend 180g, mussarela derretida e bacon crocante.", img: "img/salada.png", badges: ["Leve"], isBestSeller: false },
    { id: 9, type: "burger", price: 34.90, name: "Galo Bravo", cat: "Chicken", desc: "Pão brioche, 180g de frango empanado com queijo, bacon e maionese.", img: "img/galo.png", badges: ["Frango"], isBestSeller: false },
    { id: 10, type: "portion", price: 18.90, name: "Batata 500g", cat: "Acompanhamento", desc: "500g de batata in natura frita rústica.", img: "img/batata500.jpg", badges: ["Compartilhar"], isBestSeller: true },
    { id: 11, type: "portion", price: 10.90, name: "Batata 150g", cat: "Acompanhamento", desc: "150g Batata In natura, porção individual.", img: "img/batata150.jpg", badges: [], isBestSeller: false },
    { id: 12, type: "portion", price: 22.90, name: "Discos", cat: "Entrada", desc: "100g de carne recheada com queijo e empanada.", img: "img/discos.jpg", badges: ["Entrada"], isBestSeller: false },
];

/* --- UTILS --- */
const Utils = {
    formatPrice: (value) => {
        return value.toLocaleString(CONFIG.locale, {
            style: 'currency',
            currency: CONFIG.currency
        });
    },

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
        close: document.querySelector('.modal-close'),
        content: document.getElementById('modalContent'),
        img: document.getElementById('modalImg'),
        title: document.getElementById('modalTitle'),
        desc: document.getElementById('modalDesc'),
        price: document.getElementById('modalPrice'),
        cat: document.getElementById('modalCat'),
        btn: document.getElementById('modalBtn'),
        badges: document.getElementById('modalBadges')
    },
    hero: {
        section: document.getElementById('hero'),
        img: document.querySelector('.hero-img-floating'),
        // Atualizado para o novo seletor da tag flutuante
        tagText: document.querySelector('.float-tag span')
    }
};

/* --- COMPONENT: MENU --- */
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
            { id: 'all', label: 'Todos', icon: 'fa-border-all' }
        ];

        DOM.filters.innerHTML = categories.map(cat => `
            <button class="filter-btn ${cat.id === CONFIG.defaultCategory ? 'active' : ''}" 
                    data-id="${cat.id}" type="button">
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

            document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');

            AppState.currentCategory = btn.dataset.id;
            this.renderGrid(AppState.currentCategory);
        });

        DOM.grid.addEventListener('click', (e) => {
            const card = e.target.closest('.menu-card');
            if(card) ModalSystem.open(Number(card.dataset.id));
        });
    }
};

/* --- COMPONENT: MODAL --- */
const ModalSystem = {
    init() {
        DOM.modal.close.addEventListener('click', () => this.close());
        DOM.modal.overlay.addEventListener('click', (e) => {
            if(e.target === DOM.modal.overlay) this.close();
        });
        document.addEventListener('keydown', (e) => {
            if(AppState.isModalOpen && e.key === 'Escape') this.close();
        });
    },

    open(id) {
        const item = menuItems.find(i => i.id === id);
        if(!item) return;

        AppState.isModalOpen = true;

        DOM.modal.img.src = item.img;
        DOM.modal.cat.textContent = item.cat;
        DOM.modal.title.textContent = item.name;
        DOM.modal.desc.textContent = item.desc;
        DOM.modal.price.textContent = Utils.formatPrice(item.price);
        DOM.modal.badges.innerHTML = Utils.renderBadges(item.badges);

        DOM.modal.overlay.classList.add('active');
        DOM.modal.overlay.setAttribute('aria-hidden', 'false');
        document.body.style.overflow = 'hidden';
    },

    close() {
        AppState.isModalOpen = false;
        DOM.modal.overlay.classList.remove('active');
        DOM.modal.overlay.setAttribute('aria-hidden', 'true');
        document.body.style.overflow = '';
    }
};

/* --- COMPONENT: HERO & VISUALS --- */
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

        // Animação de entrada dos elementos (Título e Info)
        tl.from(".reveal-hero", { 
            y: 30, opacity: 0, duration: 0.8, stagger: 0.1, ease: "power2.out", delay: 0.2 
        });

        // Entrada da Imagem Principal
        if(DOM.hero.img) {
            tl.fromTo(DOM.hero.img, 
                { scale: 1.1, opacity: 0, filter: 'blur(10px)' }, 
                { scale: 1, opacity: 1, filter: 'blur(0px)', duration: 1.2, ease: "power3.out" }, 
                "-=0.4"
            );
        }

        setTimeout(() => { AppState.allowParallax = true; }, CONFIG.heroParallaxDelay);

        // Parallax do Mouse
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
            const observer = new IntersectionObserver((entries) => {
                AppState.heroVisible = entries[0].isIntersecting;
            }, { threshold: 0.1 });
            observer.observe(DOM.hero.section);
        }
    }
};

document.addEventListener("DOMContentLoaded", () => {
    MenuSystem.init();
    ModalSystem.init();
    VisualController.init();
});