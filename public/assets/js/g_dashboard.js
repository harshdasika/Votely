
const anchorEl = document.querySelector('#profile-menu-button');
const menuEl = document.querySelector('#profile-menu');

anchorEl.addEventListener('click', () => { 
    // Toggle visibility of the menu
    menuEl.hidden = !menuEl.hidden;

    // Adjust the menu position dynamically based on the button position
    const rect = anchorEl.getBoundingClientRect();
    menuEl.style.top = `${rect.bottom + window.scrollY}px`;
    menuEl.style.left = `${rect.left}px`;
});

// Close the dropdown if clicking outside of it
window.addEventListener('click', (e) => {
    if (!menuEl.contains(e.target) && !anchorEl.contains(e.target)) {
        menuEl.hidden = true;
    }
});


