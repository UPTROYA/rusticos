document.addEventListener('DOMContentLoaded', () => {
    
    // --- DADOS DO MENU (Placeholder Profissional) ---
    const menuData = [
        {
            id: 1,
            category: 'burger',
            title: 'THE RUSTIC',
            desc: 'Blend Angus 180g, queijo cheddar inglês, cebola caramelizada no bourbon, bacon crocante e maionese defumada no pão brioche.',
            price: 42,
            img: 'img/menu-1.webp',
            badges: ['Signature', 'Bestseller']
        },
        {
            id: 2,
            category: 'burger',
            title: 'TRUFFLE KING',
            desc: 'Blend Angus 180g, queijo brie maçaricado, maionese de trufas negras, rúcula selvagem e mel picante.',
            price: 48,
            img: 'img/menu-2.webp',
            badges: ['Premium']
        },
        {
            id: 3,
            category: 'burger',
            title: 'CLASSIC SMASH',
            desc: 'Dois smashes de 90g ultra prensados, crosta perfeita, duplo cheddar, picles artesanal, cebola roxa e mostarda dijon.',
            price: 36,
            img: 'img/menu-3.webp',
            badges: []
        },
        {
            id: 4,
            category: 'burger',
            title: 'BLUE VELVET',
            desc: 'Blend 180g, creme de gorgonzola, farofa de bacon, cebola crispy e geleia de pimenta.',
            price: 44,
            img: 'img/menu-4.webp',
            badges: []
        },
        {
            id: 5,
            category: 'fries',
            title: 'RUSTIC FRIES',
            desc: 'Batatas rústicas com alho e alecrim, servidas com maionese da casa.',
            price: 22,
            img: 'img/side-1.webp',
            badges: ['Shareable']
        },
        {
            id: 6,
            category: 'drinks',
            title: 'CRAFT IPA',
            desc: 'Cerveja artesanal IPA da casa, notas cítricas e amargor equilibrado. 500ml.',
            price: 28,
            img: 'img/drink-1.webp',
            badges: []
        }
    ];

    const categories = [
        { id: 'all', label: 'Todos', icon: 'fa-layer-group' },
        { id: 'burger', label: 'Burgers', icon: 'fa-burger' },
        { id: 'fries', label: 'Acompanhamentos', icon: 'fa-utensils' },
        { id: 'drinks', label: 'Bebidas', icon: 'fa-beer-mug-empty' }
    ];

    // --- ELEMENTOS DO DOM ---
    const dom = {
        grid: document.getElementById('menuGrid'),
        filterContainer: document.getElementById('filterContainer'),
        navbar: document.getElementById('navbar'),
        mobileToggle: document.querySelector('.mobile-toggle'),
        mobileMenu: document.getElementById('mobileMenu'),
        preloader: document.getElementById('preloader'),
        modals: {
            product: document.getElementById('productModal'),
            choice: document.getElementById('choiceModal')
        },
        productDetails: {
            img: document.getElementById('modalImg'),
            cat: document.getElementById('modalCat'),
            title: document.getElementById('modalTitleText'),
            desc: document.getElementById('modalDesc'),
            price: document.getElementById('modalPrice'),
            badges: document.getElementById('modalBadges')
        }
    };

    let activeCategory = 'all';

    // --- FUNÇÕES UTILITÁRIAS ---
    const formatCurrency = (val) => new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(val);

    // Cria elemento HTML de forma segura (sem innerHTML)
    const createElement = (tag, classes = [], text = '') => {
        const el = document.createElement(tag);
        if (classes.length) el.classList.add(...classes);
        if (text) el.textContent = text;
        return el;
    };

    // --- RENDERIZAÇÃO ---
    const renderFilters = () => {
        dom.filterContainer.innerHTML = ''; // Limpa container
        
        categories.forEach(cat => {
            const btn = createElement('button', ['filter-btn']);
            if (cat.id === activeCategory) btn.classList.add('active');
            btn.dataset.id = cat.id;
            
            const icon = createElement('i', ['fa-solid', cat.icon]);
            const span = createElement('span', [], cat.label);
            
            btn.appendChild(icon);
            btn.appendChild(span);
            dom.filterContainer.appendChild(btn);
        });
    };

    const renderMenu = (filter = 'all') => {
        dom.grid.innerHTML = '';
        
        const filtered = filter === 'all' ? menuData : menuData.filter(item => item.category === filter);
        
        if (filtered.length === 0) {
            dom.grid.appendChild(createElement('p', ['no-items'], 'Nenhum item encontrado nesta categoria.'));
            return;
        }

        filtered.forEach(item => {
            // Estrutura do Card
            const card = createElement('div', ['menu-card']);
            card.dataset.id = item.id;
            card.setAttribute('role', 'button');
            card.setAttribute('tabindex', '0');
            card.setAttribute('aria-label', `Ver detalhes de ${item.title}`);

            // Imagem
            const imgBox = createElement('div', ['card-img']);
            const img = document.createElement('img');
            img.src = item.img;
            img.alt = item.title;
            img.loading = 'lazy';
            // Placeholder para caso a imagem não exista (erro comum em demos)
            img.onerror = () => { img.src = 'data:image/svg+xml;charset=UTF-8,%3Csvg%20width%3D%22200%22%20height%3D%22200%22%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%3E%3Crect%20width%3D%22200%22%20height%3D%22200%22%20fill%3D%22%23eee%22%2F%3E%3Ctext%20x%3D%2250%25%22%20y%3D%2250%25%22%20dominant-baseline%3D%22middle%22%20text-anchor%3D%22middle%22%20fill%3D%22%23aaa%22%3EIMG%3C%2Ftext%3E%3C%2Fsvg%3E'; };
            
            imgBox.appendChild(img);

            // Badges
            if (item.badges.length) {
                const badgeContainer = createElement('div', ['card-badges']);
                item.badges.forEach((b, index) => {
                    const bClass = index === 0 ? 'bg-red' : 'bg-black';
                    badgeContainer.appendChild(createElement('span', ['badge-item', bClass], b));
                });
                imgBox.appendChild(badgeContainer);
            }

            // Conteúdo
            const content = createElement('div', ['card-content']);
            content.appendChild(createElement('span', ['card-cat'], categories.find(c => c.id === item.category)?.label || 'Item'));
            content.appendChild(createElement('h3', ['card-title'], item.title));
            content.appendChild(createElement('p', ['card-desc'], item.desc));

            // Footer
            const footer = createElement('div', ['card-footer']);
            footer.appendChild(createElement('span', ['card-price'], formatCurrency(item.price)));
            
            const btnAdd = createElement('button', ['btn-card-add']);
            btnAdd.setAttribute('aria-hidden', 'true');
            btnAdd.innerHTML = '<i class="fa-solid fa-plus"></i>'; // Icon is safe
            footer.appendChild(btnAdd);

            content.appendChild(footer);
            card.appendChild(imgBox);
            card.appendChild(content);
            
            dom.grid.appendChild(card);
        });

        // Re-acionar animações do ScrollTrigger se necessário
        if (typeof ScrollTrigger !== 'undefined') ScrollTrigger.refresh();
    };

    // --- LÓGICA DE MODAIS & ACESSIBILIDADE ---
    const toggleModal = (modalId, show = true) => {
        const modal = document.getElementById(modalId);
        if (!modal) return;

        if (show) {
            modal.classList.add('active');
            modal.setAttribute('aria-hidden', 'false');
            document.body.style.overflow = 'hidden';
            
            // Foco no botão de fechar
            const closeBtn = modal.querySelector('.modal-close, .choice-close');
            if (closeBtn) setTimeout(() => closeBtn.focus(), 100);
            
            // Focus Trap
            modal.addEventListener('keydown', trapFocus);
        } else {
            modal.classList.remove('active');
            modal.setAttribute('aria-hidden', 'true');
            document.body.style.overflow = '';
            modal.removeEventListener('keydown', trapFocus);
        }
    };

    const trapFocus = (e) => {
        const modal = document.querySelector('.modal-overlay.active, .choice-overlay.active');
        if (!modal) return;

        const focusableElements = modal.querySelectorAll('button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])');
        const firstElement = focusableElements[0];
        const lastElement = focusableElements[focusableElements.length - 1];

        if (e.key === 'Tab') {
            if (e.shiftKey) { 
                if (document.activeElement === firstElement) {
                    e.preventDefault();
                    lastElement.focus();
                }
            } else { 
                if (document.activeElement === lastElement) {
                    e.preventDefault();
                    firstElement.focus();
                }
            }
        } else if (e.key === 'Escape') {
            toggleModal(modal.id, false);
        }
    };

    const openProductModal = (id) => {
        const item = menuData.find(i => i.id == id);
        if (!item) return;

        const { productDetails } = dom;
        productDetails.img.src = item.img;
        productDetails.img.alt = item.title;
        // Handler de erro para imagem do modal também
        productDetails.img.onerror = () => { productDetails.img.src = 'data:image/svg+xml;charset=UTF-8,%3Csvg%20width%3D%22200%22%20height%3D%22200%22%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%3E%3Crect%20width%3D%22200%22%20height%3D%22200%22%20fill%3D%22%23eee%22%2F%3E%3Ctext%20x%3D%2250%25%22%20y%3D%2250%25%22%20dominant-baseline%3D%22middle%22%20text-anchor%3D%22middle%22%20fill%3D%22%23aaa%22%3EIMG%3C%2Ftext%3E%3C%2Fsvg%3E'; };

        productDetails.cat.textContent = categories.find(c => c.id === item.category)?.label;
        productDetails.title.textContent = item.title;
        productDetails.desc.textContent = item.desc;
        productDetails.price.textContent = formatCurrency(item.price);
        
        productDetails.badges.innerHTML = '';
        item.badges.forEach(b => {
            const span = document.createElement('span');
            span.className = 'badge-item bg-red';
            span.textContent = b;
            productDetails.badges.appendChild(span);
        });

        toggleModal('productModal', true);
    };

    // --- EVENT LISTENERS (Delegation & Setup) ---

    // Inicialização
    renderFilters();
    renderMenu();

    // Filtros
    dom.filterContainer.addEventListener('click', (e) => {
        const btn = e.target.closest('.filter-btn');
        if (!btn) return;

        document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        activeCategory = btn.dataset.id;
        
        // Animação simples de fade out/in
        gsap.to(dom.grid, { opacity: 0, duration: 0.2, onComplete: () => {
            renderMenu(activeCategory);
            gsap.to(dom.grid, { opacity: 1, duration: 0.3 });
        }});
    });

    // Clique no Produto
    dom.grid.addEventListener('click', (e) => {
        const card = e.target.closest('.menu-card');
        if (card) openProductModal(card.dataset.id);
    });
    
    // Acessibilidade: Enter no card
    dom.grid.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
            const card = e.target.closest('.menu-card');
            if (card) openProductModal(card.dataset.id);
        }
    });

    // Fechar Modais (Botão X ou Fundo)
    document.addEventListener('click', (e) => {
        if (e.target.matches('.modal-close, .choice-close') || e.target.closest('.modal-close, .choice-close')) {
            const modal = e.target.closest('.modal-overlay, .choice-overlay');
            if (modal) toggleModal(modal.id, false);
        }
        if (e.target.classList.contains('modal-overlay') || e.target.classList.contains('choice-overlay')) {
            toggleModal(e.target.id, false);
        }
    });

    // Botões de Pedido (Abre Modal Choice)
    const openChoiceModal = () => toggleModal('choiceModal', true);
    
    const orderBtns = [document.getElementById('navOrderBtn'), document.getElementById('mobileOrderBtn'), document.getElementById('modalBtnAction')];
    orderBtns.forEach(btn => {
        if (btn) btn.addEventListener('click', openChoiceModal);
    });

    // Menu Mobile
    dom.mobileToggle.addEventListener('click', () => {
        const isOpen = dom.mobileMenu.classList.contains('active');
        dom.mobileMenu.classList.toggle('active');
        dom.mobileToggle.classList.toggle('active');
        dom.mobileToggle.setAttribute('aria-expanded', !isOpen);
    });

    // Fechar menu mobile ao clicar em link
    dom.mobileMenu.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', () => {
            dom.mobileMenu.classList.remove('active');
            dom.mobileToggle.classList.remove('active');
            dom.mobileToggle.setAttribute('aria-expanded', 'false');
        });
    });

    // Scroll Navbar Effect
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            dom.navbar.classList.add('scrolled');
        } else {
            dom.navbar.classList.remove('scrolled');
        }
    }, { passive: true });

    // --- GSAP ANIMATIONS & LENIS (Smooth Scroll) ---
    // Verificar se as bibliotecas carregaram
    const initAnimations = () => {
        if (typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined') {
            gsap.registerPlugin(ScrollTrigger);

            // Hero Animations
            gsap.from('.reveal-hero', {
                y: 50, opacity: 0, duration: 1.2, stagger: 0.2, ease: 'power3.out', delay: 0.5
            });

            gsap.from('.hero-visual', {
                scale: 0.9, opacity: 0, duration: 1.5, ease: 'power2.out', delay: 0.2
            });

            // Filosofia Cards
            gsap.from('.philosophy-card', {
                scrollTrigger: { trigger: '.philosophy-grid', start: 'top 80%' },
                y: 50, opacity: 0, duration: 0.8, stagger: 0.2
            });
        }

        if (typeof Lenis !== 'undefined') {
            const lenis = new Lenis({ duration: 1.2, easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)) });
            function raf(time) {
                lenis.raf(time);
                requestAnimationFrame(raf);
            }
            requestAnimationFrame(raf);
        }
        
        // Remove Preloader
        setTimeout(() => {
            dom.preloader.classList.add('hidden');
        }, 800);
    };

    // Aguardar load completo para animações pesadas
    // --- FUNÇÃO PARA REMOVER PRELOADER ---
    const removePreloader = () => {
        if (!dom.preloader.classList.contains('hidden')) {
            dom.preloader.classList.add('hidden');
            // Reativa o scroll do body caso esteja travado
            document.body.style.overflow = ''; 
        }
    };

    // --- GSAP ANIMATIONS & LENIS ---
    const initAnimations = () => {
        if (typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined') {
            gsap.registerPlugin(ScrollTrigger);
            
            // Hero Animations
            gsap.from('.reveal-hero', {
                y: 50, opacity: 0, duration: 1.2, stagger: 0.2, ease: 'power3.out', delay: 0.5
            });

            gsap.from('.hero-visual', {
                scale: 0.9, opacity: 0, duration: 1.5, ease: 'power2.out', delay: 0.2
            });

            gsap.from('.philosophy-card', {
                scrollTrigger: { trigger: '.philosophy-grid', start: 'top 80%' },
                y: 50, opacity: 0, duration: 0.8, stagger: 0.2
            });
        }

        if (typeof Lenis !== 'undefined') {
            const lenis = new Lenis({ duration: 1.2, easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)) });
            function raf(time) {
                lenis.raf(time);
                requestAnimationFrame(raf);
            }
            requestAnimationFrame(raf);
        }
        
        // Remove Preloader (Via Load normal)
        setTimeout(removePreloader, 800);
    };

    // 1. Tenta iniciar quando tudo carregar (Cenário Ideal)
    window.addEventListener('load', initAnimations);

    // 2. FAILSAFE: Se o 'load' demorar mais que 4 segundos, abre o site na marra
    setTimeout(() => {
        removePreloader();
        // Tenta rodar animações mesmo que capenga, se o GSAP tiver carregado
        if (typeof gsap !== 'undefined') initAnimations(); 
    }, 4000);
});
