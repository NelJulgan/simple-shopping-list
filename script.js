// ^Shopping List Project
const itemForm = document.getElementById('item-form');
const itemInput = document.getElementById('item-input');
const itemList = document.getElementById('item-list');
const clearBtn = document.getElementById('clear');
const itemFilter = document.getElementById('filter');
const formBtn = itemForm.querySelector('button');
let isEditMode = false;

function displayItems() {
  const itemsFromStorage = getItemsFromStorage();
  itemsFromStorage.forEach((item) => addItemToDOM(item));
  checkUI();
}

function onAddItemSubbmit(e) {
  e.preventDefault();

  const newItem = itemInput.value;

  // ^Validate Input
  if (newItem === '') {
    alert('Please add an item');
    return;
  }

  // ^check for edit mode
  if (isEditMode) {
    const itemToEdit = itemList.querySelector('.edit-mode');
    removeItemFromStorage(itemToEdit.textContent);
    itemToEdit.classList.remove('edit-mode');
    itemToEdit.remove();
    isEditMode = false;
  } else {
    if (checkListItemExist(newItem)) {
      alert('That item already exist!');
      return;
    }
  }

  // ^Create item DOM element
  addItemToDOM(newItem);

  // Add item to local storage
  addItemToStorage(newItem);
  checkUI();

  itemInput.value = '';
}

// ^Add item to the DOM
function addItemToDOM(item) {
  // Create list item
  const li = document.createElement('li');
  li.appendChild(document.createTextNode(item));

  const button = createButton('remove-item btn-link text-red');
  li.appendChild(button);

  // ^Add li to the DOM
  itemList.appendChild(li);
}

function createButton(classes) {
  const button = document.createElement('button');
  button.className = classes;
  const icon = createIcon('fa-solid fa-xmark');
  button.appendChild(icon);
  return button;
}

function createIcon(classes) {
  const icon = document.createElement('i');
  icon.className = classes;
  return icon;
}

// ^Ading Items to the Storage
function addItemToStorage(item) {
  const itemsFromStorage = getItemsFromStorage();

  // ^Add new item to array
  itemsFromStorage.push(item);

  // Convert to JSON string and set to local storage
  localStorage.setItem('items', JSON.stringify(itemsFromStorage));
}

function getItemsFromStorage() {
  let itemsFromStorage;

  if (localStorage.getItem('items') === null) {
    itemsFromStorage = [];
  } else {
    itemsFromStorage = JSON.parse(localStorage.getItem('items'));
  }
  return itemsFromStorage;
}

function onClickItem(e) {
  if (e.target.parentElement.classList.contains('remove-item')) {
    removeItem(e.target.parentElement.parentElement);
  } else {
    SetItemToEdit(e.target);
  }
}

// ^Check if item exist
function checkListItemExist(items) {
  const itemsFromStorage = getItemsFromStorage();
  return itemsFromStorage.includes(items);
}

// ^edit
function SetItemToEdit(items) {
  isEditMode = true;
  itemList
    .querySelectorAll('li')
    .forEach((i) => i.classList.remove('edit-mode'));
  items.classList.add('edit-mode');
  formBtn.innerHTML = '<i class="fa-solid fa-pen"></i>   Update Item';
  formBtn.style.background = '#22a699';
  itemInput.value = items.textContent;
}

function removeItem(items) {
  if (confirm('Are you sure?')) {
    // Remove item from DOM
    items.remove();

    // Remove item from storage
    removeItemFromStorage(items.textContent);

    checkUI();
  }
}

function removeItemFromStorage(items) {
  let itemsFromStorage = getItemsFromStorage();

  // ^Filter out item to be removed
  itemsFromStorage = itemsFromStorage.filter((i) => i !== items);

  // ^Re-set to localstorage
  localStorage.setItem('items', JSON.stringify(itemsFromStorage));
}

function clearItems() {
  while (itemList.firstChild) {
    itemList.removeChild(itemList.firstChild);
  }

  // ^Clear from localStorage
  localStorage.removeItem('items');

  checkUI();
}

// ^Filter items
function filterItems(e) {
  const item = document.querySelectorAll('li');
  const text = e.target.value.toLowerCase();

  item.forEach((item) => {
    const itemName = item.firstChild.textContent.toLowerCase();

    if (itemName.indexOf(text) != -1) {
      item.style.display = 'flex';
    } else {
      item.style.display = 'none';
    }

    console.log(itemName);
  });
}

// ^function check UI

function checkUI() {
  itemInput.value = '';
  const items = document.querySelectorAll('li');
  if (items.length === 0) {
    clearBtn.style.display = 'none';
    itemFilter.style.display = 'none';
  } else {
    clearBtn.style.display = 'block';
    itemFilter.style.display = 'block';
  }
  formBtn.innerHTML = '<i class="fa-solid fa-plus"></i> Add Item';
  formBtn.style.background = '#333';
}

// ^Initialize app

function init() {
  // Event Listener
  itemForm.addEventListener('submit', onAddItemSubbmit);
  itemList.addEventListener('click', onClickItem);
  clearBtn.addEventListener('click', clearItems);
  itemFilter.addEventListener('input', filterItems);
  document.addEventListener('DOMContentLoaded', displayItems);

  checkUI();
}

init();
