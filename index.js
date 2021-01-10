
// Entities
class Book {
    constructor(title, author, editor, id) {
        this.title = title;
        this.author = author;
        this.editor = editor
    }
}


class UI {

    static displayABook(title, author, editor, id) {
        let sampleBookItem = document.querySelector('#sampleBook').cloneNode(true)
        sampleBookItem.style.display = "block"
        sampleBookItem.setAttribute("data-id", `${id}`)

        sampleBookItem.querySelector('#titleDisp').innerHTML = `${title}`
        sampleBookItem.querySelector('#authorDisp').innerHTML = `${author}`
        sampleBookItem.querySelector('#editorDisp').innerHTML = `${editor}`

        document.querySelector('#unorderedList').append(sampleBookItem)
    }


    static displayAll() {
        {
            let arrBooks = Storage.getBooks()

            for (let key in arrBooks) {
                let book = arrBooks[key]
                UI.displayABook(book.title, book.author, book.editor, key)
            }
        }
    }



    static clearOutput() {
        document.querySelector("#titleField").value = ""
        document.querySelector('#authorField').value = ""
        document.querySelector('#editorField').value = ""

    }


    static searchAndList(e) {
        let val = e.target.value.toLowerCase()
        console.log(val)

        let arrBooks = Storage.getBooks()

        for (let key in arrBooks) {
            let book = arrBooks[key]

            let title = book.title.toLowerCase()
            let author = book.author.toLowerCase()
            let editor = book.editor.toLowerCase()
            let itemBook = document.querySelector("[data-id=" + CSS.escape(key) + "]")

            if (!(title.includes(val) || author.includes(val) || editor.includes(val))) {
                itemBook.style.display = "none"
            } else {
                itemBook.style.display = "block"
            }
        }
    }
}


class Storage {

    static getBooks() {
        return JSON.parse(localStorage.getItem('arrBooks'))
    }

    static addBook(book) {
        let arrBooks = Storage.getBooks()



        // Getting the id for pushing
        let keys = []

        for (let key in arrBooks) {
            keys.push(key)
        }


        let id;

        if (keys.length == 0) {
            id = 0
        } else {
            id = Math.max(...keys) + 1
        }

        // Pushing
        arrBooks[id] = book

        // Inserting in localStorage
        localStorage.setItem('arrBooks', JSON.stringify(arrBooks))

        console.log('id is', id)
        return id
    }


    static deleteBook(id) {
        let arrBooks = Storage.getBooks()
        delete arrBooks[id]
        localStorage.setItem('arrBooks', JSON.stringify(arrBooks))
    }
}




function deleteAllBooks() {
    localStorage.setItem('arrBooks', JSON.stringify({}))
}




/////////////////////
// EVENT LISTENERS
/////////////////////
function getFieldsAndAdd(e) {

    e.preventDefault()
    // Grabbing the fields
    let title = document.querySelector("#titleField");
    let author = document.querySelector('#authorField');
    let editor = document.querySelector('#editorField');
    // Create the book object and inserting into the array and local storage.
    let book = new Book(title.value, author.value, editor.value)


    // Adding Book to the Storage and getting the ID for displaying in the UI
    let id = Storage.addBook(book)

    // Adding Book to the UI (ID needed)
    UI.displayABook(book.title, book.author, book.editor, id)

    // Cleaning fields
    UI.clearOutput()
}


function deletingBooks(e) {

    if (e.target.classList.contains('delete')) {
        let parentLi = e.target.parentElement
        console.log(parentLi)
        let bookId = parentLi.getAttribute('data-id')

        // Removing from the Storage.
        Storage.deleteBook(bookId)

        // Removng in the UI
        parentLi.remove()
    }
}








// Display at reload
document.addEventListener('DOMContentLoaded', UI.displayAll)

// Adding books.
document.querySelector('#submitButton').addEventListener('click', getFieldsAndAdd)

// Deleting books.
document.querySelector('#unorderedList').addEventListener('click', deletingBooks)

// Searching.
document.querySelector('#searchField').addEventListener('keyup', UI.searchAndList)