const itemForm = document.getElementById('item-form');
const itemInput = document.getElementById('item-input');
const itemList = document.getElementById('item-list');
const clearButton = document.getElementById('clear');
const itemFilter = document.getElementById('filter');
const formBtn = itemForm.querySelector('button');
let isEditMode = false;

function displayItems(){
    const itemFromStroage = getItemFromSorage();
    itemFromStroage.forEach(item =>addItemToDOM(item));
    checkUI();
}
function onAddItemSubmit(e) {
    e.preventDefault();
    const newItem = itemInput.value
    //Validate Input
    if(newItem === ''){
        alert('Please add an item');
        return;
    }
    //Check for edit mode
    if(isEditMode){
        const itemToEdit = itemList.querySelector('.edit-mode');

        removeItemFromStorage(itemToEdit.textContent);
        itemToEdit.classList.remove('edit-mode');
        itemToEdit.remove();
        isEditMode = false;
    }else{
        if(checkIfItemExists(newItem)){
            alert('That item already exists!')
            return;
        }
    }
    // Create item DOM element
    addItemToDOM(newItem);

    //Add item to local stroage
    addItemToStroage(newItem);

    checkUI();
    itemInput.value = '';
}
function addItemToDOM(item){
    //Create list item
    const li = document.createElement('li');
    li.appendChild(document.createTextNode(item));
    const button =createButton('remove-item btn-link text-red');
    li.appendChild(button);
    // Add li to the DOM
    itemList.appendChild(li);

}
function addItemToStroage(item){
    const itemFromStroage = getItemFromSorage();

    // Add new item to array
    itemFromStroage.push(item);

    // Convert to JSON string and set to local stroage
    localStorage.setItem('item',JSON.stringify(itemFromStroage));
}
function createButton(classes){
    const button = document.createElement("button");
    button.className=classes;
    const icon = createIcon('fa-solid fa-xmark');
    button.appendChild(icon);
    return button;
}

function createIcon(classes){
    const icon = document.createElement('i');
    icon.className = classes;
    return icon;
}
function getItemFromSorage(){
    let itemFromStroage;
    if(localStorage.getItem('item') === null){
        itemFromStroage = [];
    }else{
        itemFromStroage = JSON.parse(localStorage.getItem('item'));
    }

    return itemFromStroage;
}
function onClickItem(e){
    if(e.target.parentElement.classList.contains('remove-item')){
        removeItem(e.target.parentElement.parentElement);
    }else{
        setItemToEdit(e.target);
    }
}
function checkIfItemExists(item){
    const itemFromStroage = getItemFromSorage();
    return itemFromStroage.includes(item);
}
function setItemToEdit(item){
    isEditMode = true;

    itemList.querySelectorAll('li').forEach((i) => i.classList.remove('edit-mode'));
    item.classList.add('edit-mode');
    formBtn.innerHTML = '<i class="fa-solid fa-pen"></i>    Update Item';
    formBtn.style.backgroundColor='#228B22'
    itemInput.value = item.textContent;
}
function removeItem(item){
   if (confirm('Are you ssure?')){
    // Remove item from DOM
    item.remove();
    // Remove item from stroage

    removeItemFromStorage(item.textContent);

    checkUI();
   }
}
function removeItemFromStorage(item){
    let itemFromStroage = getItemFromSorage();
    
    //Filter out item to be removed
    itemFromStroage = itemFromStroage.filter((i) => i !== item);

    //Re-set to localstorage
    localStorage.setItem('item',JSON.stringify(itemFromStroage));
}

function clearItems (){
    while(itemList.firstChild){
        itemList.removeChild(itemList.firstChild);
    }

    //Clear from localStroage
    localStorage.removeItem('item');

    checkUI();
}

function filteritems(e){
    const items = itemList.querySelectorAll('li');
    const text = e.target.value.toLowerCase();
    items.forEach(item =>{
        const itemName = item.firstChild.textContent.toLowerCase();

        if(itemName.indexOf(text) != -1){
            item.style.display='flex';
        }else{
            item.style.display='none';
        }

    });
}

function checkUI(){
    itemInput.value=''; 

    const items = itemList.querySelectorAll('li');
    if(items.length === 0){
        clearButton.style.display='none';
        itemFilter.style.display='none';
    }else{
        clearButton.style.display='block';
        itemFilter.style.display='block';
    }
    formBtn.innerHTML='<i class="fa-solid fa-plus"></i>Add Item';
    formBtn.style.backgroundColor='#333';

    isEditMode = false;
}

//Initialize app
function init(){
    //Event Listeners
    itemForm.addEventListener('submit',onAddItemSubmit );
    itemList.addEventListener('click', onClickItem);
    clearButton.addEventListener('click', clearItems);
    itemFilter.addEventListener('input',filteritems);
    document.addEventListener('DOMContentLoaded',displayItems);
    checkUI();
}

init();
