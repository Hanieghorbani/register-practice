const inputName = document.querySelector(".inputName")
const inputPass = document.querySelector(".inputPass")
const inputEmail = document.querySelector(".inputEmail")
const createBtn = document.querySelector(".createBtn")
const usersList = document.querySelector(".userList")

let db = null
let objectStore = null
window.addEventListener("load", () => {
  let createIndexDB = indexedDB.open("registery", 19)
  createIndexDB.addEventListener("success", (e) => {
    db = e.target.result
  })
  createIndexDB.addEventListener("upgradeneeded", (e) => {
    db = e.target.result

    if (!db.objectStoreNames.contains("users")) {
      objectStore = db.createObjectStore("users", {
        keyPath: "id",
      })
    }
    console.log(objectStore)
  })
})

createBtn.addEventListener("click", () => {
  if (
    inputEmail.value.trim() &&
    inputName.value.trim() &&
    inputPass.value.trim()
  ) {
    let newUser = {
      id: Math.floor(Math.random() * 1000),
      name: inputName.value,
      password: inputPass.value,
      email: inputEmail.value,
    }
    let tx = createTX("users", "readwrite")
    let store = tx.objectStore("users")
    let request = store.add(newUser)
    clearAll()
    request.addEventListener("success", (e) => {
      getUsers()
    })
  }
})

function clearAll() {
  inputName.value = ""
  inputEmail.value = ""
  inputPass.value = ""
}

function getUsers() {
  usersList.innerHTML = ""
  let tx = createTX("users", "readonly")
  let store = tx.objectStore("users")
  let request = store.getAll()

  request.addEventListener("success", (e) => {
    let allUsers = e.target.result
    let htmlUser
    allUsers.forEach((user) => {
      htmlUser = `
      <div class="usersInfo">
      <span>${user.id}</span>
        <span>${user.name}</span>
        <span>${user.password}</span>
        <span>${user.email}</span>
        <span class="remove" onclick="removeUser(${user.id})">Remove</span>
        </div>`

      usersList.insertAdjacentHTML("beforeend", htmlUser)
    })
  })
}

function createTX(storeName, mode) {
  let tx = db.transaction(storeName, mode)
  return tx
}

function removeUser(id) {
  let tx = createTX("users", "readwrite")
  let store = tx.objectStore("users")
  let request = store.delete(id)
  request.addEventListener("success", (e) => {
    getUsers()
  })
}
