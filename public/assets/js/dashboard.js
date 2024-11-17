
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


document.addEventListener('DOMContentLoaded', function () {
    const dialog = document.querySelector('#group-dialog');
    const addGroupButton = document.querySelector('#add-group-button');
    const closeXButton = document.querySelector('#close-x-button');

    // Initialize Materialize Tabs
    const tabs = document.querySelectorAll('.tabs');
    M.Tabs.init(tabs);

    // Event listener to open the modal when the FAB button is clicked
    addGroupButton.addEventListener('click', () => {
        dialog.setAttribute('open', true); // Show the dialog
    });

    // Close the dialog when the Close button is clicked
    closeXButton.addEventListener('click', () => {
        dialog.removeAttribute('open'); // Hide the dialog
    });
});

