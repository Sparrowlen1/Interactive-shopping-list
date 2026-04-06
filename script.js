let shoppingItems = [];
let nextId = 1;

const itemInput = document.getElementById('itemInput');
const itemCostInput = document.getElementById('itemCostInput');
const addBtn = document.getElementById('addBtn');
const clearAllBtn = document.getElementById('clearAllBtn');
const shoppingListUl=document.getElementById('shoppingListUl');
const emptyPlaceholder=document.getElementById('emptyPlaceholder');
const itemCountSpan=document.getElementById('itemCount');
const totalCostDisplaySpan=document.getElementById('totalCostDisplay');

function saveToLocalStorage() {
    localStorage.setItem('shoppingItems', JSON.stringify(shoppingItems));
    localStorage.setItem('nextId', nextId.toString());
}

function loadFromLocalStorage() {
    const stored = localStorage.getItem('shoppingListApp');
    if (stored) {
        shoppingItems = JSON.parse(stored);
        const storedNextId = localStorage.getItem('nextId');
        if (storedNextId) nextId = parseInt(storedNextId, 10);
        else nextId = shoppingItems.length ? Math.max(...shoppingItems.map(i => i.id), 0) + 1 : 1;
    } else {
        shoppingItems = [
            { id: nextId++, name: 'Fresh Organic Bananas', cost: 3.49, purchased: false },
            { id: nextId++, name: 'Whole Grain Bread', cost: 4.29, purchased: true },
            { id: nextId++, name: 'Almond Milk', cost: 3.99, purchased: false },
            { id: nextId++, name: 'Farm Fresh Eggs', cost: 5.99, purchased: false }
        ];
    }
    shoppingItems = shoppingItems.map(item => ({ ...item, purchased: item.purchased || false }));
    renderShoppingList();
}
