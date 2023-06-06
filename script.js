const inputName = document.querySelector(".inputName")
const inputPass = document.querySelector(".inputPass")
const inputEmail = document.querySelector(".inputEmail")
const createBtn = document.querySelector(".createBtn")

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
        keyPath: "userID",
      })
    }
    console.log(objectStore)
  })
})

createBtn.addEventListener("click", () => {
  let newUser = {
    userID: Math.floor(Math.random() * 1000),
    name: inputName.value,
    password: inputPass.value,
    email: inputEmail.value,
  }
  let tx = db.transaction("users", "readwrite")
  tx.addEventListener("error", (err) => console.warn("tx error:", err))
  tx.addEventListener("success", (e) => console.log("tx succ:", e))

  let store = tx.objectStore("users")
  let request = store.add(newUser)
  clearAll()
  request.addEventListener("error", (err) => console.warn("requ error:", err))
  request.addEventListener("success", (e) => console.log("requ succ:", e))
})

function clearAll() {
  inputName.value = ""
  inputEmail.value = ""
  inputPass.value = ""
}
