const booksContainer = document.getElementById("booksContainer");
const form = document.getElementById("newBookEntry");
const submitButton = document.getElementById("submitNewBookForm");
form.onsubmit = addBookToLibrary;
let myLibrary = JSON.parse(localStorage.getItem("library"))
if (myLibrary === null){
  myLibrary = [];
} else {
  updateDOM()
}

function Book(title, author, pages, read) {
  this.title = title;
  this.author = author;
  this.pages = pages;
  this.read = read;
}

function addBookToLibrary(e) {
  e.preventDefault();
  const formData = new FormData(form);
  myLibrary.push(new Book(...formData.values()));
  localStorage.setItem("library", JSON.stringify(myLibrary));
  updateDOM();
  form.reset()
}

function makeCard(book, index) {
  let CardContent = [["Title:","titleLabel"], [book.title, "title"], ["delete","deleteButton"], ["Author:","authorLabel"], [book.author, "author"], ["Pages:", "pagesLabel"], [book.pages, "pages"], ["Read: ","readLabel"], [book.read ? "yes" : "no", "read"]];
  const card = document.createElement("div");
  card.className = "card";
  card.id = index;
  for (const content of CardContent) {
    if (content[0] === "delete") {
      card.appendChild(document.createElement("button"))
      card.lastChild.className = "material-symbols-outlined deleteButton";
      card.lastChild.textContent = "delete";
      card.lastChild.addEventListener("click", deleteCard);
    } else {
      card.appendChild(document.createElement("div"));
      card.lastChild.textContent = content[0];
      card.lastChild.className = content[1];
    }
  }
  booksContainer.appendChild(card);
}

function deleteCard(e){
  index = +e.target.parentElement.id;
  myLibrary = myLibrary.slice(0,index).concat(myLibrary.slice(+index+1));
  localStorage.setItem("library", JSON.stringify(myLibrary))
  updateDOM()
}

function updateDOM() {
  removeAllChildNodes(booksContainer);
  myLibrary.forEach(makeCard);
}

function removeAllChildNodes(parent) {
  while (parent.firstChild) {
    parent.removeChild(parent.firstChild);
  }
}

function removeIndex(array, index) {
  let arrayLength = array.length
  if (index < 0 || index > arrayLength || index === undefined){
    throw "Index does not exist for array";
  }
  return array.slice(0,+index).concat(array.slice(+index+1)) ;
}