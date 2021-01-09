
// Entities
class Book {
    constructor(title, author, editor, id) {
        this.title = title;
        this.author = author;
        this.editor = editor;
        this.id = id
    }
}


// Getting DOM elements
let submitBtn = document.querySelector('#submitButton')
let unorderedList = document.querySelector('#unorderedList')
let searchField = document.querySelector('#searchField')

// setting variables.
let arrBooks = {}
let id;
let keys = []


////////////////////////////////////////
///////////////////  DECLARING FUNCTIONS
////////////////////////////////////////

function initialization() {

    // Filling keys array and arrBooks, looking in the localStorage for those there yet
    for (let key in JSON.parse(localStorage.getItem('arrBooks'))) {
        keys.push(key)
        arrBooks[key] = JSON.parse(localStorage.getItem('arrBooks'))[key]
    }


    // Setting id to insert for new books. 
    if (keys.length == 0) {
        id = 0
    } else {
        id = Math.max(...keys) + 1
    }
}



// Takes as input title, value, editor. These are strings.
// id is a number.
function createUIBook(title, author, editor, id) {
    let sampleBookItem = document.querySelector('#sampleBook').cloneNode(true)
    sampleBookItem.style.display = "block"
    sampleBookItem.setAttribute("data-id", `${id}`)

    sampleBookItem.querySelector('#titleDisp').innerHTML = `${title}`
    sampleBookItem.querySelector('#authorDisp').innerHTML = `${author}`
    sampleBookItem.querySelector('#editorDisp').innerHTML = `${editor}`

    document.querySelector('#unorderedList').append(sampleBookItem)
}


function displayAtReload() {
    let arrBooks = JSON.parse(localStorage.getItem('arrBooks'))

    for (let key in arrBooks) {
        let book = arrBooks[key]
        createUIBook(book.title, book.author, book.editor, book.id)
    }
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
    let book = new Book(title.value, author.value, editor.value, id)
    arrBooks[id] = book
    localStorage.setItem('arrBooks', JSON.stringify(arrBooks))


    createUIBook(book.title, book.value, book.editor, book.id)
    id = id + 1



    // Cleaning fields
    title.value = ""
    author.value = ""
    editor.value = ""
}


function deletingBooks(e) {

    for (val of e.target.classList) {
        if (val === "delete") {

            let parentLi = e.target.parentElement
            let bookId = parentLi.getAttribute('data-id')

            delete arrBooks[bookId]
            localStorage.setItem('arrBooks', JSON.stringify(arrBooks))
            parentLi.remove()
        }
    }
}



function searchAndList(e) {
    let val = e.target.value.toLowerCase()
    console.log(val)


    for (let key in arrBooks) {
        let book = arrBooks[key]

        let title = book.title.toLowerCase()
        let author = book.author.toLowerCase()
        let editor = book.editor.toLowerCase()
        let itemBook = document.querySelector("[data-id=" + CSS.escape(book.id) + "]")

        if (!(title.includes(val) || author.includes(val) || editor.includes(val))) {
            itemBook.style.display = "none"

        } else {
            itemBook.style.display = "block"
        }
    }
}










// Reading the local storage
initialization()

// Display if there is some data in local storage
displayAtReload()


// Adding books.
submitBtn.addEventListener('click', getFieldsAndAdd)

// Deleting books.
unorderedList.addEventListener('click', deletingBooks)

// Searching.
searchField.addEventListener('keyup', searchAndList)