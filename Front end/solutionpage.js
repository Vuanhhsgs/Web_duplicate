const sideNav = document.querySelector('.side-nav');
const mainBtn = document.querySelector('.main-nav-btn');

// Add "active" class on first hover
mainBtn.addEventListener('mouseenter', () => {
    sideNav.classList.add('active');
});

// Optional: remove "active" when leaving the button + submenu area
sideNav.addEventListener('mouseleave', () => {
    sideNav.classList.remove('active');
});
