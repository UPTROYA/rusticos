// --- 1. DADOS DO CARDÁPIO (TRUE NAMES) ---
const menuItems = [
    {
        cat: "Burger Signature",
        name: "Clássico",
        desc: "Blend 180g selado no fogo alto, queijo prato derretido, alface romana orgânica, tomate e maionese verde da casa.",
        img: "img/classico.jpg"
    },
    {
        cat: "Best Seller",
        name: "Rústico",
        desc: "A essência da casa. Blend Angus, queijo cheddar inglês, cebola caramelizada no whisky bourbon e bacon crocante em tiras.",
        img: "img/Rustico.jpg"
    },
    {
        cat: "Concept",
        name: "Bruto",
        desc: "Para os fortes. Duplo smash burger, dobro de queijo, ovo caipira frito e molho barbecue defumado artesanalmente.",
        img: "img/Bruto.jpg"
    },
    {
        cat: "Side Dish",
        name: "Batata 500g",
        desc: "Meio quilo de batatas rústicas com casca, fritas com alecrim fresco e dentes de alho. Acompanha aioli.",
        img: "img/batata500.jpg"
    },
    {
        cat: "Appetizer",
        name: "Discos de Carne",
        desc: "Discos crocantes por fora e suculentos por dentro, recheados com provolone defumado.",
        img: "img/discos.jpg"
    }
];

document.addEventListener("DOMContentLoaded", () => {
    
    // --- 2. RENDERIZAR CARDÁPIO ---
    const grid = document.querySelector('.menu-grid');
    
    menuItems.forEach(item => {
        const html = `
            <div class="menu-item" data-tilt data-tilt-max="15" data-tilt-speed="400" data-tilt-glare data-tilt-max-glare="0.2">
                <div class="menu-card">
                    <div class="card-img-wrap">
                        <img src="${item.img}" alt="${item.name}" onerror="this.src='https://images.unsplash.com/photo-1550547660-d9450f859349?q=80&w=1000'">
                    </div>
                    <div class="card-info">
                        <span class="item-cat">${item.cat}</span>
                        <h3 class="item-title">${item.name}</h3>
                        <p class="item-desc">${item.desc}</p>
                    </div>
                </div>
            </div>
        `;
        grid.innerHTML += html;
    });

    // Re-inicializar Vanilla Tilt nos novos elementos
    VanillaTilt.init(document.querySelectorAll(".menu-item"));


    // --- 3. LENIS SMOOTH SCROLL (O segredo do site premium) ---
    const lenis = new Lenis({
        duration: 1.2,
        easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
        smooth: true
    });
    function raf(time) {
        lenis.raf(time);
        requestAnimationFrame(raf);
    }
    requestAnimationFrame(raf);


    // --- 4. PRELOADER ANIMATION ---
    const tl = gsap.timeline();

    tl.to(".loading-bar", { width: "100%", duration: 1.5, ease: "power2.inOut" })
      .to(".letter", { y: 0, stagger: 0.1, duration: 0.5, ease: "back.out(1.7)" }, "-=1")
      .to(".preloader", { y: "-100%", duration: 0.8, ease: "power4.inOut", delay: 0.5 })
      .from(".hero-title .line", { y: 100, opacity: 0, stagger: 0.2, duration: 1 }, "-=0.3")
      .from(".brand-fixed", { opacity: 0, duration: 1 }, "-=0.8");


    // --- 5. SCROLL TRIGGER ANIMATIONS ---
    gsap.registerPlugin(ScrollTrigger);

    // Parallax nas imagens
    gsap.utils.toArray(".parallax-img").forEach((img) => {
        gsap.to(img, {
            yPercent: 20,
            ease: "none",
            scrollTrigger: {
                trigger: img.parentElement,
                scrub: true
            }
        });
    });

    // Reveal Textos Sobre Nós
    gsap.from(".about-text > *", {
        y: 50, opacity: 0, duration: 1, stagger: 0.2,
        scrollTrigger: {
            trigger: ".about-section",
            start: "top 70%"
        }
    });


    // --- 6. MENU OVERLAY ---
    const toggle = document.querySelector('.menu-toggle');
    const navOverlay = document.querySelector('.nav-overlay');
    const navLinks = document.querySelectorAll('.nav-link');
    let isOpen = false;

    toggle.addEventListener('click', () => {
        isOpen = !isOpen;
        if(isOpen) {
            navOverlay.classList.add('active');
            gsap.to(navLinks, { y: 0, opacity: 1, stagger: 0.1, delay: 0.3 });
        } else {
            navOverlay.classList.remove('active');
            gsap.to(navLinks, { y: 50, opacity: 0 });
        }
    });
    
    // Fechar ao clicar
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            isOpen = false;
            navOverlay.classList.remove('active');
        });
    });


    // --- 7. CUSTOM CURSOR ---
    const cursorDot = document.querySelector('.cursor-dot');
    const cursorCircle = document.querySelector('.cursor-circle');
    
    if (window.matchMedia("(pointer: fine)").matches) {
        window.addEventListener('mousemove', (e) => {
            const x = e.clientX;
            const y = e.clientY;
            
            cursorDot.style.left = `${x}px`;
            cursorDot.style.top = `${y}px`;
            
            cursorCircle.style.transform = `translate(${x - 20}px, ${y - 20}px)`; // Centraliza o circulo
        });

        // Efeito Magnetico nos botões
        document.querySelectorAll('.magnetic-wrap').forEach(wrap => {
            wrap.addEventListener('mousemove', (e) => {
                const item = wrap.querySelector('.magnetic-area');
                const rect = wrap.getBoundingClientRect();
                const x = e.clientX - rect.left - rect.width / 2;
                const y = e.clientY - rect.top - rect.height / 2;
                
                item.style.transform = `translate(${x * 0.4}px, ${y * 0.4}px)`;
            });
            wrap.addEventListener('mouseleave', (e) => {
                const item = wrap.querySelector('.magnetic-area');
                item.style.transform = 'translate(0, 0)';
            });
            // Hover states
            wrap.addEventListener('mouseenter', () => document.body.classList.add('hovering'));
            wrap.addEventListener('mouseleave', () => document.body.classList.remove('hovering'));
        });
    }
});