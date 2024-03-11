const bookshelfs = [];
const RENDER_EVENT ='render-book';
const STORAGE_KEY = 'BOOK_STORAGE';
const SAVED_EVENT = 'saved-book';

document.addEventListener('DOMContentLoaded', function () {
    const submitForm = document.getElementById('add-book');
    submitForm.addEventListener('submit', function (event) {
    event.preventDefault();
    addBook();
    });
});


function isStorageExist() /* boolean */ {
    if (typeof (Storage) === undefined) {
    alert('Browser kamu tidak mendukung local storage');
    return false;
    }
    return true;
}


function addBook(){
    const title = document.getElementById('addBooksTitle').value;
    const author = document.getElementById('addBooksAuthor').value;
    const year = document.getElementById('addBooksYear').value;
    const completedCheckbox = document.getElementById('addBooksComplate');

    const generateID = generateId();
    let isComplete = completedCheckbox.checked;
    const bookObject = generateBookObject(title, author,year ,isComplete)
    bookshelfs.push(bookObject)
    document.dispatchEvent(new Event(RENDER_EVENT));
    saveData();//
}

function generateId(){
    return +new Date();
}
function generateBookObject(title,author,year,isComplete){
return{
    id: +new Date(),
    title,
    author,
    year: parseInt(year),
    isComplete
}
}


document.addEventListener(RENDER_EVENT, function(){
    const noComplateBookList = document.getElementById('noComplateBook');
    noComplateBookList.innerHTML = '';
    const complateBookList = document.getElementById('complateBook');
    complateBookList.innerHTML = '';
    for(const bookItem of bookshelfs){
        const bookElement = makeBook(bookItem);
        if(!bookItem.isComplete){
            noComplateBookList.append(bookElement);
        }
        else{
            complateBookList.append(bookElement);
        }
    }
})

function makeBook(bookObject){
    const title = document.createElement('h3');
    title.innerText = bookObject.title;
    const author = document.createElement('p');
    author.innerText = 'Author: ' + bookObject.author;
    const year = document.createElement('p');
    year.innerText = 'Year: ' + bookObject.year;
    const container = document.createElement('div');
    container.classList.add('action');
    const bookContainer = document.createElement('article');
    bookContainer.classList.add('book-item');
    bookContainer.append(title, author, year, container);
    bookContainer.setAttribute('id', `todo-${bookObject.id}`);
    
    if (bookObject.isComplete){
        const unfinishedButton = document.createElement('button');
        unfinishedButton.classList.add('done');
        unfinishedButton.innerText = 'Not Finished Yet';
        unfinishedButton.addEventListener('click', function(){
            completeToUnfinishedBook(bookObject.id);
        });
        const deleteButton = document.createElement('button');
        deleteButton.classList.add('remove');
        deleteButton.innerText = 'Remove';
        deleteButton.addEventListener('click', function (){
            removeBook(bookObject.id);
        });
        container.append(unfinishedButton, deleteButton);
    }
    else{
        const finishedButton = document.createElement('button');
        finishedButton.classList.add('done');
        finishedButton.innerText = 'Done';
        finishedButton.addEventListener('click', function(){
            unfinishedToCompleteBook(bookObject.id);
        });
        const deleteButton = document.createElement('button');
        deleteButton.classList.add('remove');
        deleteButton.innerText = 'Remove';
        deleteButton.addEventListener('click', function (){
            removeBook(bookObject.id);
        });
        container.append(finishedButton, deleteButton);
    }
    return bookContainer;
}

function unfinishedToCompleteBook (bookId){
    const bookTarget = findBook(bookId);
    if(bookTarget == null) return;
    bookTarget.isComplete = true;
    document.dispatchEvent(new Event(RENDER_EVENT));
    saveData(); //
}


function completeToUnfinishedBook (bookId){
    const bookTarget = findBook(bookId);
    if(bookTarget == null) return;
    bookTarget.isComplete = false;
    document.dispatchEvent(new Event(RENDER_EVENT));
    saveData();
}
function findBook(bookId){
    for (const bookItem of bookshelfs){
        if (bookItem.id === bookId){
            return bookItem;
        }
    }
    return null;
}
function removeBook (bookId){
    const bookTarget = findBook(bookId);
    if (bookTarget === -1) return;
    bookshelfs.splice(bookTarget, 1);
    document.dispatchEvent(new Event(RENDER_EVENT));
    saveData();
}


function saveData() {
    if (isStorageExist()) {
    const parsed = JSON.stringify(bookshelfs);
    localStorage.setItem(STORAGE_KEY, parsed);
    document.dispatchEvent(new Event(SAVED_EVENT));
    }
}

document.addEventListener(SAVED_EVENT, function () {
    console.log(localStorage.getItem(STORAGE_KEY));
});

function loadDataFromStorage() {
    const serializedData = localStorage.getItem(STORAGE_KEY);
    let data = JSON.parse(serializedData);

    if (data !== null) {
    for (const form of data) {
        bookshelfs.push(form);
    }
    }

    document.dispatchEvent(new Event(RENDER_EVENT));
}


document.addEventListener('DOMContentLoaded', function () {
    // ...
    if (isStorageExist()) {
    loadDataFromStorage();
    }
});

document.addEventListener(RENDER_EVENT, function () {
    console.log(bookshelfs);
});