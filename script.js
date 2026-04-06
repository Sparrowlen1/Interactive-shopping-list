let shoppingItems = [];    
let nextId = 1;

const itemNameInput = document.getElementById('itemNameInput');
const itemCostInput = document.getElementById('itemCostInput');
const addBtn = document.getElementById('addBtn');
const clearAllBtn = document.getElementById('clearAllBtn');
const shoppingListUl = document.getElementById('shoppingListUl');
const emptyPlaceholder = document.getElementById('emptyPlaceholder');
const itemCountSpan = document.getElementById('itemCount');
const totalCostDisplaySpan = document.getElementById('totalCostDisplay');

// we are now saving to local storage
function saveToLocalStorage() {
    localStorage.setItem('shoppingListApp', JSON.stringify(shoppingItems));
    localStorage.setItem('nextId', nextId);
}

// Loading /retrieving from local storage
function loadFromLocalStorage() {
    const stored = localStorage.getItem('shoppingListApp');
    if (stored) {
        shoppingItems = JSON.parse(stored);
        const storedNextId = localStorage.getItem('nextId');
        if (storedNextId) nextId = parseInt(storedNextId, 10);
        else nextId = shoppingItems.length ? Math.max(...shoppingItems.map(i => i.id), 0) + 1 : 1;
    } else {
        // default sample items for demonstration
        shoppingItems = [
            { id: nextId++, name: 'Fresh Organic Bananas', cost: 150, purchased: false },
            { id: nextId++, name: 'Whole Grain Bread', cost: 180, purchased: true },
            { id: nextId++, name: 'Almond Milk', cost: 100, purchased: false },
            { id: nextId++, name: 'Farm Fresh Eggs', cost: 360, purchased: false }
        ];
    }
    // ensure all items have purchased flag 
    shoppingItems = shoppingItems.map(item => ({ ...item, purchased: item.purchased || false }));
    renderShoppingList();
}

// calculate total cost of all items
function calculateTotalCost() {
    return shoppingItems.reduce((sum, item) => sum + (item.cost || 0), 0); //the sum takes the current total and adds the items cost to it, if cost is not defined it defaults to 0
} // this items.cost || 0  means if item.cost exists use it otherwise use 0

// update stats them item count and total cost
function updateStats() {
    const totalItems = shoppingItems.length;
    itemCountSpan.textContent = totalItems;
    const total = calculateTotalCost();
    totalCostDisplaySpan.textContent = `ksh ${total.toFixed(2)}`;
}

// toggle empty placeholder visibility
function toggleEmptyPlaceholder() {
    if (shoppingItems.length === 0) {
        emptyPlaceholder.style.display = 'block';
        shoppingListUl.style.display = 'none';
    } else {
        emptyPlaceholder.style.display = 'none';
        shoppingListUl.style.display = 'flex';
    }
}

// render full list from array
function renderShoppingList() {
    // clear current UL
    shoppingListUl.innerHTML = '';
    
    if (shoppingItems.length === 0) {
        toggleEmptyPlaceholder();
        updateStats();
        saveToLocalStorage();
        return;
    }
    
    // loop through items and create LI elements
    shoppingItems.forEach(item => {
        const li = document.createElement('li');
        li.className = 'list-item';
        if (item.purchased) li.classList.add('purchased');
        li.dataset.id = item.id;
        
        // inner structure them left clickable area + action buttons
        const itemContentDiv = document.createElement('div');
        itemContentDiv.className = 'item-content';
        
        // icon based on fontawesome 
        const iconSpan = document.createElement('span');
        iconSpan.className = 'item-icon';
        iconSpan.innerHTML = item.purchased ? '<i class="fas fa-check-circle"></i>' : '<i class="fas fa-shopping-basket"></i>';
        
        const detailsDiv = document.createElement('div');
        detailsDiv.className = 'item-details';
        
        const nameSpan = document.createElement('span');
        nameSpan.className = 'item-name';
        nameSpan.textContent = item.name;
        
        const costSpan = document.createElement('span');
        costSpan.className = 'item-cost';
        costSpan.innerHTML = `<i class="fas fa-tag"></i> ksh ${(item.cost || 0).toFixed(2)}`;
        
        detailsDiv.appendChild(nameSpan);
        detailsDiv.appendChild(costSpan);
        itemContentDiv.appendChild(iconSpan);
        itemContentDiv.appendChild(detailsDiv);
        
        // action buttons container
        const actionsDiv = document.createElement('div');
        actionsDiv.className = 'item-actions';
        
        const editBtn = document.createElement('button');
        editBtn.className = 'edit-btn';
        editBtn.innerHTML = '<i class="fas fa-pencil-alt"></i>';
        editBtn.title = 'Edit item';
        
        const deleteBtn = document.createElement('button');
        deleteBtn.className = 'delete-btn';
        deleteBtn.innerHTML = '<i class="fas fa-trash-can"></i>';
        deleteBtn.title = 'Remove item';
        
        actionsDiv.appendChild(editBtn);
        actionsDiv.appendChild(deleteBtn);
        
        li.appendChild(itemContentDiv);
        li.appendChild(actionsDiv);
        
        
        // Mark as purchased on clicking the content area
        itemContentDiv.addEventListener('click', (e) => {
            e.stopPropagation();
            togglePurchased(item.id);
        });
        
        // Edit button event
        editBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            editItem(item.id);
        });
        
        // Delete button event
        deleteBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            deleteItemById(item.id);
        });
        
        shoppingListUl.appendChild(li);
    });
    
    toggleEmptyPlaceholder();
    updateStats();
    saveToLocalStorage();
}

// Toggle purchased status
function togglePurchased(id) {
    const item = shoppingItems.find(i => i.id === id);
    if (item) {
        item.purchased = !item.purchased;
        renderShoppingList();
    }
}

// Add new item
function addNewItem() {
    let name = itemNameInput.value.trim();
    let cost = parseFloat(itemCostInput.value);
    
    if (name === '') {
        alert('Yooh enter an item name asap');
        return;
    }
    if (isNaN(cost) || cost < 0) {
        cost = 0;
    }
    
    // create new item object
    const newItem = {
        id: nextId++,
        name: name,
        cost: cost,
        purchased: false,
    };
    shoppingItems.push(newItem);
    // clear inputs
    itemNameInput.value = '';
    itemCostInput.value = '0.00';
    renderShoppingList();
    itemNameInput.focus();
}

// Delete item by id
function deleteItemById(id) {
    shoppingItems = shoppingItems.filter(item => item.id !== id);
    renderShoppingList();
}

// Edit existing item them prompt user to update name and cost
function editItem(id) {
    const item = shoppingItems.find(i => i.id === id);
    if (!item) return;
    
    const newName = prompt(' Edit item name:', item.name);
    if (newName !== null && newName.trim() !== '') {
        item.name = newName.trim();
    } else if (newName !== null && newName.trim() === '') {
        alert('Yooh item cant be empty. keep original name.');
    }
    
    let newCostInput = prompt(' Edit price (in ksh, numeric):', item.cost);
    if (newCostInput !== null) {
        let newCost = parseFloat(newCostInput);
        if (!isNaN(newCost) && newCost >= 0) {
            item.cost = newCost;
        } else if (newCostInput !== '') {
            alert('Yooh Invalid price. Keeping original cost.');
        }
    }
    renderShoppingList();
}

// Clear entire list
function clearWholeList() {
    if (shoppingItems.length > 0 && confirm('Yooh do you Want to clear entire shopping list? This action cannot be undone.')) {
        shoppingItems = [];
        nextId = 1;
        renderShoppingList();
    }
}

addBtn.addEventListener('click', addNewItem);
clearAllBtn.addEventListener('click', clearWholeList);

// Allow pressing "Enter" in the item name field to add quickly
itemNameInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        e.preventDefault();
        addNewItem();
    }
});
itemCostInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        e.preventDefault();
        addNewItem();
    }
});


loadFromLocalStorage();