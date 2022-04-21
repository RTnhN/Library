const booksContainer = document.getElementById("booksContainer");
const form = document.getElementById("newBookEntry");
const submitButton = document.getElementById("submitNewBookForm");
const newBookButton = document.getElementById("addNewBookButton");
form.onsubmit = addBookToLibrary;
newBookButton.onclick = toggleNewBookForm;

function Book(title, author, pages, read) {
  this.title = title;
  this.author = author;
  this.pages = pages;
  this.read = read;
}

Book.prototype.toggleReadStatus = function(){ this.read =  !this.read}

let myLibrary = JSON.parse(localStorage.getItem("library"))
if (myLibrary === null) {
  myLibrary = [];
} else {
  myLibrary = myLibrary.map((value)=>Object.assign(new Book(), value))
  updateDOM();
}

function addBookToLibrary(e) {
  e.preventDefault();
  const formData = new FormData(form);
  const title = formData.get("title");
  const author = formData.get("author");
  const pages = formData.get("pages");
  const read = formData!==null; 
  myLibrary.push(new Book(title, author, pages, read));
  localStorage.setItem("library", JSON.stringify(myLibrary));
  updateDOM();
  form.reset()
}

function makeCard(book, index) {
  let CardContent = [["Title:", "titleLabel"], [book.title, "title"], ["buttons", ""], ["Author:", "authorLabel"], [book.author, "author"], ["Pages:", "pagesLabel"], [book.pages, "pages"], ["Read: ", "readLabel"], [book.read ? "yes" : "no", "read"]];
  const card = document.createElement("div");
  card.className = "card";
  card.id = index;
  for (const content of CardContent) {
    if (content[0] === "buttons") {
      const buttonsContainer = document.createElement("div");
      buttonsContainer.className = "buttons";
      buttonsContainer.appendChild(document.createElement("button"));
      buttonsContainer.lastChild.className = "material-symbols-outlined readButton";
      buttonsContainer.lastChild.textContent = "check_box";
      buttonsContainer.lastChild.setAttribute("title", "Toggle Read Status");
      buttonsContainer.lastChild.addEventListener("click", updateReadStatus);
      buttonsContainer.appendChild(document.createElement("button"));
      buttonsContainer.lastChild.className = "material-symbols-outlined deleteButton";
      buttonsContainer.lastChild.textContent = "delete";
      buttonsContainer.lastChild.setAttribute("title", "Delete Book from Library");
      buttonsContainer.lastChild.addEventListener("click", deleteCard);
      card.appendChild(buttonsContainer);

    } else {
      card.appendChild(document.createElement("div"));
      card.lastChild.textContent = content[0];
      card.lastChild.className = content[1];
    }
  }
  booksContainer.appendChild(card);
}

function deleteCard(e) {
  if (confirm("Are you sure that you want to delete that book?")) {
    index = +e.target.parentElement.parentElement.id;
    myLibrary = myLibrary.slice(0, index).concat(myLibrary.slice(+index + 1));
    localStorage.setItem("library", JSON.stringify(myLibrary))
    updateDOM()
  }
}

function updateReadStatus(e){
  myLibrary[+e.target.parentElement.parentElement.id].toggleReadStatus();
  updateDOM();
}

function updateDOM() {
  removeAllChildNodes(booksContainer);
  myLibrary.forEach(makeCard);
}

function toggleNewBookForm(e) {
  if (newBookButton.firstElementChild.textContent === "add"){
    form.className = "formVisible";
    newBookButton.firstElementChild.textContent = "remove";
    newBookButton.lastChild.textContent = "Collapse New Book Form";
  } else {
    form.className = "formHidden";
    newBookButton.firstElementChild.textContent = "add";
    newBookButton.lastChild.textContent = "Add New Book";
  }
}

function removeAllChildNodes(parent) {
  while (parent.firstChild) {
    parent.removeChild(parent.firstChild);
  }
}
