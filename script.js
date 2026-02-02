// Smooth scrolling for navigation links
document.addEventListener('DOMContentLoaded', function() {
  // Navigation active state
  const navLinks = document.querySelectorAll('nav a');
  const sections = document.querySelectorAll('section');

  // Update active nav link on scroll
  function updateActiveNav() {
    let current = '';
    sections.forEach(section => {
      const sectionTop = section.offsetTop;
      const sectionHeight = section.clientHeight;
      if (window.pageYOffset >= sectionTop - 200) {
        current = section.getAttribute('id');
      }
    });

    navLinks.forEach(link => {
      link.classList.remove('active');
      if (link.getAttribute('href') === `#${current}`) {
        link.classList.add('active');
      }
    });
  }

  window.addEventListener('scroll', updateActiveNav);
  updateActiveNav();

  // Smooth scroll for anchor links – keep navbar visible during nav
  let isNavigating = false;
  navLinks.forEach(link => {
    link.addEventListener('click', function(e) {
      const href = this.getAttribute('href');
      if (href.startsWith('#')) {
        e.preventDefault();
        isNavigating = true;
        nav.style.transform = 'translateY(0)';
        const targetId = href.substring(1);
        const targetSection = document.getElementById(targetId);
        if (targetSection) {
          const offsetTop = targetSection.offsetTop - 80;
          window.scrollTo({
            top: offsetTop,
            behavior: 'smooth'
          });
        }
        setTimeout(() => { isNavigating = false; }, 1000);
      }
    });
  });

  // Page-load entrance: hero & nav animate on reload
  const heroBadge = document.querySelector('.hero-badge');
  const heroTitle = document.querySelector('.portfolio-title');
  const heroRole = document.querySelector('.role-tag');
  const heroDesc = document.querySelector('.hero-description');
  const heroCta = document.querySelector('.hero-cta');
  const heroImgWrap = document.querySelector('.hero-image-wrapper');
  const navEl = document.querySelector('nav');
  const heroElements = [heroBadge, heroTitle, heroRole, heroDesc, heroCta, heroImgWrap].filter(Boolean);
  heroElements.forEach((el, i) => {
    if (el) {
      el.style.opacity = '0';
      el.style.animation = `fadeInUp 0.6s ease-out ${0.08 * i}s forwards`;
    }
  });
  if (navEl) {
    navEl.style.opacity = '0';
    navEl.style.animation = 'fadeIn 0.5s ease-out 0.05s forwards';
  }

  // Pick entrance by section & element – varied but not overdone
  function getEntranceClass(el) {
    const section = el.closest('section')?.id;
    if (section === 'about') {
      if (el.classList.contains('about-text-content')) return 'entrance-slide-left';
      if (el.classList.contains('about-image-placeholder')) return 'entrance-slide-right';
      return 'entrance-fade-up';
    }
    if (section === 'services') {
      if (el.classList.contains('services-header')) return 'entrance-fade-up';
      return 'entrance-fade-up'; // cards
    }
    if (section === 'projects') {
      if (el.classList.contains('projects-title') || el.classList.contains('subsection-header')) return 'entrance-fade';
      if (el.classList.contains('pubmats-pinboard')) return 'entrance-scale';
      return 'entrance-fade-up'; // cards, items
    }
    if (section === 'tools') return 'entrance-fade-up';
    if (section === 'contact') {
      if (el.classList.contains('contact-text-section')) return 'entrance-slide-left';
      if (el.classList.contains('contact-image-section')) return 'entrance-slide-right';
      return 'entrance-fade-up';
    }
    return 'entrance-fade-up';
  }

  const observerOptions = { threshold: 0.08, rootMargin: '0px 0px -30px 0px' };
  const observer = new IntersectionObserver(function(entries) {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const el = entry.target;
        const animClass = getEntranceClass(el);
        el.classList.add(animClass);
        const idx = Array.from(el.parentElement?.children || []).indexOf(el);
        if (idx >= 0 && idx <= 7 && (el.classList.contains('project-card') || el.classList.contains('data-viz-item') || el.classList.contains('pubmat-card') || el.classList.contains('promo-item') || el.classList.contains('flyer-item') || el.classList.contains('website-card'))) {
          el.classList.add(`delay-${Math.min(idx + 1, 8)}`);
        }
        observer.unobserve(el);
      }
    });
  }, observerOptions);

  const animatedSelectors = [
    '.about-header', '.about-text-content', '.about-image-placeholder',
    '.services-header', '.project-card',
    '.projects-title', '.subsection-header', '.data-viz-item', '.pubmat-card',
    '.flyer-item', '.promo-item', '.website-card', '.trifold-mockup',
    '.social-media-post-wrapper', '.pubmats-pinboard',
    '.contact-text-section', '.contact-image-section', '.contact-item',
    '.tool-category', '.section-title', '.flyer-item.large'
  ];
  document.querySelectorAll(animatedSelectors.join(', ')).forEach(el => {
    if (el && !el.closest('#home')) observer.observe(el);
  });

  // TikTok mockups: mute/unmute + caption "See more"
  const tiktokVideos = document.querySelectorAll('.tiktok-phone .tiktok-video');
  const tiktokMuteButtons = document.querySelectorAll('.tiktok-phone .tiktok-mute-btn');

  // Ensure TikTok videos start muted for autoplay
  tiktokVideos.forEach((v) => { v.muted = true; });

  tiktokMuteButtons.forEach((btn) => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();
      const container = btn.closest('.tiktok-phone');
      const video = container ? container.querySelector('.tiktok-video') : null;
      if (!video) return;

      const nextMuted = !video.muted;
      video.muted = nextMuted;
      btn.setAttribute('aria-pressed', String(!nextMuted));
      btn.setAttribute('aria-label', nextMuted ? 'Unmute video' : 'Mute video');
      btn.textContent = nextMuted ? '🔇' : '🔊';
    });
  });

  document.querySelectorAll('.tiktok-caption-overlay .caption-toggle').forEach((btn) => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();
      const overlay = btn.closest('.tiktok-caption-overlay');
      if (!overlay) return;
      const isExpanded = overlay.classList.toggle('is-expanded');
      btn.textContent = isExpanded ? 'See less' : 'See more';
      btn.setAttribute('aria-expanded', String(isExpanded));
    });
  });

  // Mobile menu toggle (if needed in future)
  const nav = document.querySelector('nav');
  let lastScroll = 0;

  window.addEventListener('scroll', function() {
    if (isNavigating) return;
    const currentScroll = window.pageYOffset;
    
    if (currentScroll <= 0) {
      nav.style.boxShadow = '0 2px 10px rgba(0, 0, 0, 0.1)';
      return;
    }
    
    if (currentScroll > lastScroll && currentScroll > 100) {
      // Scrolling down
      nav.style.transform = 'translateY(-100%)';
    } else {
      // Scrolling up
      nav.style.transform = 'translateY(0)';
    }
    
    lastScroll = currentScroll;
    nav.style.transition = 'transform 0.3s ease';
  });

  // Contact form handling (if form is added later)
  const contactForm = document.getElementById('contact-form');
  if (contactForm) {
    contactForm.addEventListener('submit', function(e) {
      e.preventDefault();
      // Form submission logic can be added here
      alert('Thank you for your message! I will get back to you soon.');
      contactForm.reset();
    });
  }

  // Tool items hover effect enhancement
  const toolItems = document.querySelectorAll('.tool-item');
  toolItems.forEach(item => {
    item.addEventListener('mouseenter', function() {
      this.style.transform = 'translateY(-5px) scale(1.05)';
    });
    
    item.addEventListener('mouseleave', function() {
      this.style.transform = 'translateY(0) scale(1)';
    });
  });

  // Service cards click effect
  const serviceCards = document.querySelectorAll('.service-card');
  serviceCards.forEach(card => {
    card.addEventListener('click', function() {
      this.style.transform = 'translateY(-8px) scale(1.02)';
      setTimeout(() => {
        this.style.transform = 'translateY(-8px)';
      }, 200);
    });
  });

  // Scroll to top functionality
  const scrollTopBtn = document.createElement('button');
  scrollTopBtn.innerHTML = '↑';
  scrollTopBtn.className = 'scroll-top';
  scrollTopBtn.style.cssText = `
    position: fixed;
    bottom: 30px;
    right: 30px;
    width: 50px;
    height: 50px;
    border-radius: 50%;
    background: var(--primary-purple);
    color: white;
    border: none;
    font-size: 24px;
    cursor: pointer;
    opacity: 0;
    transition: opacity 0.3s ease, transform 0.3s ease;
    z-index: 1000;
    box-shadow: 0 4px 15px rgba(212, 165, 196, 0.3);
  `;
  
  document.body.appendChild(scrollTopBtn);

  window.addEventListener('scroll', function() {
    if (window.pageYOffset > 300) {
      scrollTopBtn.style.opacity = '1';
    } else {
      scrollTopBtn.style.opacity = '0';
    }
  });

  scrollTopBtn.addEventListener('click', function() {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  });

  scrollTopBtn.addEventListener('mouseenter', function() {
    this.style.transform = 'scale(1.1)';
    this.style.background = 'var(--accent-purple)';
  });

  scrollTopBtn.addEventListener('mouseleave', function() {
    this.style.transform = 'scale(1)';
    this.style.background = 'var(--primary-purple)';
  });

  // Parallax Background Effect
  const parallaxBackground = document.querySelector('body::before');
  let lastScrollY = window.scrollY;

  window.addEventListener('scroll', function() {
    const scrollY = window.scrollY;
    const parallaxSpeed = 0.5;
    
    // Apply parallax to background
    const bodyBefore = document.querySelector('body');
    if (bodyBefore) {
      const yPos = -(scrollY * parallaxSpeed);
      bodyBefore.style.setProperty('--parallax-y', `${yPos}px`);
    }
    
    lastScrollY = scrollY;
  });

  // Add parallax to sections
  const parallaxSections = document.querySelectorAll('.parallax-section');
  parallaxSections.forEach(section => {
    window.addEventListener('scroll', function() {
      const rect = section.getBoundingClientRect();
      const scrolled = window.pageYOffset;
      const rate = scrolled * -0.3;
      
      if (rect.top < window.innerHeight && rect.bottom > 0) {
        section.style.transform = `translateY(${rate}px)`;
      }
    });
  });

  // Detect image orientation and apply classes
  function detectImageOrientation() {
    const pubmatImages = document.querySelectorAll('.pubmat-image');
    pubmatImages.forEach(img => {
      const item = img.closest('.pubmat-item');
      if (!item) return;
      
      // Remove existing orientation classes
      item.classList.remove('landscape', 'square', 'portrait');
      
      // Create a new image to check dimensions
      const testImg = new Image();
      testImg.onload = function() {
        const aspectRatio = this.width / this.height;
        
        if (aspectRatio > 1.2) {
          // Landscape
          item.classList.add('landscape');
        } else if (aspectRatio >= 0.8 && aspectRatio <= 1.2) {
          // Square
          item.classList.add('square');
        } else {
          // Portrait
          item.classList.add('portrait');
        }
      };
      testImg.src = img.src;
    });
  }

  // Run orientation detection after page load
  window.addEventListener('load', detectImageOrientation);
  
  // Also run when images are loaded
  const pubmatImages = document.querySelectorAll('.pubmat-image');
  pubmatImages.forEach(img => {
    if (img.complete) {
      detectImageOrientation();
    } else {
      img.addEventListener('load', detectImageOrientation);
    }
  });

  // Image Modal Functionality (for regular images: pubmats, data-viz, flyers, etc.)
  const imageModal = document.getElementById('imageModal');
  const modalImage = document.getElementById('modalImage');
  const modalClose = document.querySelector('.modal-close');
  // Select any image that provides a `data-modal` attribute (excludes trifold which now uses separate modal)
  const imagesForModal = document.querySelectorAll('img[data-modal]');

  // Open modal on image click (skip product dashboard images – they use their own gallery)
  imagesForModal.forEach(img => {
    img.addEventListener('click', function() {
      if (this.closest('.data-viz-multi-images')) return;
      const imageSrc = this.getAttribute('data-modal') || this.src;
      modalImage.src = imageSrc;
      modalImage.alt = this.alt || '';
      imageModal.classList.add('active');
      document.body.style.overflow = 'hidden';
    });
  });

  // Close modal
  function closeModal() {
    imageModal.classList.remove('active');
    document.body.style.overflow = '';
  }

  if (modalClose) {
    modalClose.addEventListener('click', closeModal);
  }

  if (imageModal) {
    imageModal.addEventListener('click', function(e) {
      if (e.target === imageModal) {
        closeModal();
      }
    });
  }

  // Close modal on Escape key
  document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape' && imageModal && imageModal.classList.contains('active')) {
      closeModal();
    }
  });

  // Product Dashboard Gallery (3 images – prev/next only for this dashboard)
  const dashboardGalleryModal = document.getElementById('dashboardGalleryModal');
  const dashboardGalleryImage = document.getElementById('dashboardGalleryImage');
  const dashboardGalleryClose = document.getElementById('dashboardGalleryClose');
  const dashboardGalleryPrev = document.getElementById('dashboardGalleryPrev');
  const dashboardGalleryNext = document.getElementById('dashboardGalleryNext');
  const dashboardGalleryCounter = document.getElementById('dashboardGalleryCounter');
  const productDashboardImages = document.querySelectorAll('.data-viz-multi-images img[data-modal]');
  const dashboardImageSrcs = Array.from(productDashboardImages).map(img => img.getAttribute('data-modal') || img.src);
  const dashboardTotal = dashboardImageSrcs.length;
  let currentDashboardIndex = 0;

  function showDashboardImage(index) {
    if (dashboardTotal === 0) return;
    if (index >= dashboardTotal) currentDashboardIndex = 0;
    else if (index < 0) currentDashboardIndex = dashboardTotal - 1;
    else currentDashboardIndex = index;
    dashboardGalleryImage.src = dashboardImageSrcs[currentDashboardIndex];
    dashboardGalleryImage.alt = productDashboardImages[currentDashboardIndex]?.alt || 'Dashboard view';
    if (dashboardGalleryCounter) dashboardGalleryCounter.textContent = currentDashboardIndex + 1;
  }

  function openDashboardGallery(startIndex) {
    showDashboardImage(startIndex);
    if (dashboardGalleryModal) {
      dashboardGalleryModal.classList.add('active');
      document.body.style.overflow = 'hidden';
    }
  }

  function closeDashboardGallery() {
    if (dashboardGalleryModal) dashboardGalleryModal.classList.remove('active');
    document.body.style.overflow = '';
  }

  productDashboardImages.forEach((img, index) => {
    img.addEventListener('click', () => openDashboardGallery(index));
  });

  if (dashboardGalleryPrev) dashboardGalleryPrev.addEventListener('click', () => showDashboardImage(currentDashboardIndex - 1));
  if (dashboardGalleryNext) dashboardGalleryNext.addEventListener('click', () => showDashboardImage(currentDashboardIndex + 1));
  if (dashboardGalleryClose) dashboardGalleryClose.addEventListener('click', closeDashboardGallery);

  if (dashboardGalleryModal) {
    dashboardGalleryModal.addEventListener('click', function(e) {
      if (e.target === dashboardGalleryModal) closeDashboardGallery();
    });
  }

  document.addEventListener('keydown', function(e) {
    if (!dashboardGalleryModal || !dashboardGalleryModal.classList.contains('active')) return;
    if (e.key === 'Escape') closeDashboardGallery();
    else if (e.key === 'ArrowLeft') showDashboardImage(currentDashboardIndex - 1);
    else if (e.key === 'ArrowRight') showDashboardImage(currentDashboardIndex + 1);
  });

  // Facebook-style image gallery modal for post mockup
  const galleryModal = document.getElementById('imageGalleryModal');
  const galleryModalImage = document.getElementById('galleryModalImage');
  const galleryModalClose = document.querySelector('.gallery-modal-close');
  const galleryPrevBtn = document.querySelector('.gallery-prev');
  const galleryNextBtn = document.querySelector('.gallery-next');
  const galleryImageCounter = document.getElementById('galleryImageCounter');
  const galleryImageTotal = document.getElementById('galleryImageTotal');
  
  const allPostImages = document.querySelectorAll('.post-grid-image[data-image-index]');
  const moreImagesOverlay = document.querySelector('.more-images-overlay');
  let currentGalleryIndex = 0;
  const totalImages = allPostImages.length;
  
  // Update gallery modal with image
  function showGalleryImage(index) {
    if (index >= totalImages) {
      currentGalleryIndex = 0;
    } else if (index < 0) {
      currentGalleryIndex = totalImages - 1;
    } else {
      currentGalleryIndex = index;
    }
    
    const imageElement = allPostImages[currentGalleryIndex];
    galleryModalImage.src = imageElement.src;
    galleryModalImage.alt = imageElement.alt;
    galleryImageCounter.textContent = currentGalleryIndex + 1;
  }
  
  // Open gallery modal
  function openGallery(startIndex = 0) {
    showGalleryImage(startIndex);
    galleryModal.classList.add('active');
    document.body.style.overflow = 'hidden';
  }
  
  // Close gallery modal
  function closeGallery() {
    galleryModal.classList.remove('active');
    document.body.style.overflow = '';
  }
  
  // Click on images to open gallery
  allPostImages.forEach((img, index) => {
    img.addEventListener('click', () => openGallery(index));
  });
  
  // Click on "+3" overlay to show remaining images
  if (moreImagesOverlay) {
    moreImagesOverlay.addEventListener('click', (e) => {
      e.stopPropagation();
      openGallery(3); // Start from the 4th image
    });
  }
  
  // Navigation buttons
  if (galleryPrevBtn) {
    galleryPrevBtn.addEventListener('click', () => showGalleryImage(currentGalleryIndex - 1));
  }
  
  if (galleryNextBtn) {
    galleryNextBtn.addEventListener('click', () => showGalleryImage(currentGalleryIndex + 1));
  }
  
  // Close button
  if (galleryModalClose) {
    galleryModalClose.addEventListener('click', closeGallery);
  }
  
  // Close on background click
  if (galleryModal) {
    galleryModal.addEventListener('click', (e) => {
      if (e.target === galleryModal) {
        closeGallery();
      }
    });
  }
  
  // Keyboard navigation
  document.addEventListener('keydown', (e) => {
    if (galleryModal.classList.contains('active')) {
      if (e.key === 'ArrowLeft') {
        showGalleryImage(currentGalleryIndex - 1);
      } else if (e.key === 'ArrowRight') {
        showGalleryImage(currentGalleryIndex + 1);
      }
    }
  });

  // Brochure / menu flip modal (trifold + pinboard menu open this; flip only inside modal)
  const brochureModal = document.getElementById('brochureModal');
  const brochureFlipCard = document.getElementById('brochureFlipCard');
  const brochureFrontImg = document.getElementById('brochureFrontImg');
  const brochureBackImg = document.getElementById('brochureBackImg');
  const brochureFlipBtn = document.getElementById('brochureFlipBtn');
  const brochureModalClose = document.getElementById('brochureModalClose');
  const trifoldOpenBtns = document.querySelectorAll('.trifold-open-btn');
  const trifoldSides = document.querySelectorAll('.trifold-mockup .trifold-side');
  const trifoldFlipBtn = document.querySelector('.trifold-flip-btn');

  function openBrochureModal(frontSrc, backSrc, isMenu) {
    if (!brochureModal) return;
    brochureModal.classList.toggle('is-menu', !!isMenu);
    brochureModal.classList.add('active');
    document.body.style.overflow = 'hidden';
    if (brochureFlipCard) brochureFlipCard.classList.remove('flipped');
    if (brochureFlipBtn) {
      brochureFlipBtn.textContent = 'Flip';
      brochureFlipBtn.setAttribute('aria-label', 'Flip to back');
    }

    if (!brochureFrontImg || !brochureBackImg) return;
    if (brochureFlipCard) brochureFlipCard.style.opacity = '0.6';
    if (brochureFlipBtn) {
      brochureFlipBtn.textContent = 'Loading...';
      brochureFlipBtn.disabled = true;
    }

    const loadTimeout = setTimeout(() => {
      if (brochureFlipCard) brochureFlipCard.style.opacity = '1';
      if (brochureFlipBtn) {
        brochureFlipBtn.textContent = 'Flip';
        brochureFlipBtn.disabled = false;
      }
    }, 5000);

    function showWhenReady() {
      if (brochureFrontImg.complete && brochureBackImg.complete) {
        clearTimeout(loadTimeout);
        if (brochureFlipCard) brochureFlipCard.style.opacity = '1';
        if (brochureFlipBtn) {
          brochureFlipBtn.textContent = 'Flip';
          brochureFlipBtn.disabled = false;
        }
      }
    }

    brochureFrontImg.onload = showWhenReady;
    brochureBackImg.onload = showWhenReady;
    brochureFrontImg.onerror = function() { showWhenReady(); if (brochureFlipBtn) brochureFlipBtn.textContent = 'Flip'; };
    brochureBackImg.onerror = showWhenReady;

    brochureFrontImg.src = frontSrc;
    brochureBackImg.src = backSrc;
  }

  function closeBrochureModal() {
    if (brochureModal) {
      brochureModal.classList.remove('active', 'is-menu');
      document.body.style.overflow = '';
    }
  }

  function getBrochureSrcFromTrifold(trifoldEl) {
    const trifold = trifoldEl && trifoldEl.closest ? trifoldEl.closest('.trifold-mockup') : document.querySelector('.trifold-mockup');
    if (!trifold) return { frontSrc: 'images/flyers/1.jpg', backSrc: 'images/flyers/2.jpg' };
    const frontImg = trifold.querySelector('[data-flip-front]');
    const backImg = trifold.querySelector('[data-flip-back]');
    const frontSrc = frontImg ? frontImg.getAttribute('data-flip-front') || frontImg.src : 'images/flyers/1.jpg';
    const backSrc = backImg ? backImg.getAttribute('data-flip-back') || backImg.src : 'images/flyers/2.jpg';
    return { frontSrc, backSrc };
  }

  if (trifoldOpenBtns.length) {
    trifoldOpenBtns.forEach(img => {
      img.addEventListener('click', function(e) {
        e.preventDefault();
        e.stopPropagation();
        const { frontSrc, backSrc } = getBrochureSrcFromTrifold(this);
        openBrochureModal(frontSrc, backSrc, false);
      });
    });
  }

  if (trifoldSides.length) {
    trifoldSides.forEach(side => {
      side.addEventListener('click', function(e) {
        if (e.target.classList.contains('trifold-open-btn')) return;
        e.preventDefault();
        e.stopPropagation();
        const { frontSrc, backSrc } = getBrochureSrcFromTrifold(this);
        openBrochureModal(frontSrc, backSrc, false);
      });
    });
  }

  if (trifoldFlipBtn) {
    trifoldFlipBtn.addEventListener('click', function(e) {
      e.preventDefault();
      openBrochureModal('images/flyers/1.jpg', 'images/flyers/2.jpg', false);
    });
  }

  const menuPinboardCard = document.getElementById('pastaPalaceMenuFlip');
  if (menuPinboardCard) {
    function openMenuModal() {
      openBrochureModal('images/pubmats/menu%20front.png', 'images/pubmats/menu%20back.png', true);
    }
    menuPinboardCard.addEventListener('click', function(e) {
      e.preventDefault();
      e.stopPropagation();
      openMenuModal();
    });
    menuPinboardCard.addEventListener('keydown', function(e) {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        openMenuModal();
      }
    });
  }

  if (brochureModalClose) {
    brochureModalClose.addEventListener('click', closeBrochureModal);
  }

  if (brochureModal) {
    brochureModal.addEventListener('click', function(e) {
      if (e.target === brochureModal) closeBrochureModal();
    });
  }

  if (brochureFlipBtn) {
    brochureFlipBtn.addEventListener('click', function(e) {
      e.preventDefault();
      e.stopPropagation();
      if (brochureFlipCard.classList.contains('flipped')) {
        brochureFlipCard.classList.remove('flipped');
        brochureFlipBtn.textContent = 'Flip';
        brochureFlipBtn.setAttribute('aria-label', 'Flip to back');
      } else {
        brochureFlipCard.classList.add('flipped');
        brochureFlipBtn.textContent = 'Back';
        brochureFlipBtn.setAttribute('aria-label', 'Flip to front');
      }
    });
  }

  document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape' && brochureModal && brochureModal.classList.contains('active')) {
      closeBrochureModal();
    }
  });
});

