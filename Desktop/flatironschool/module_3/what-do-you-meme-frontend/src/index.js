let ALLMEMES = []
const API_END = "http://localhost:3000/api/v1/memes"


document.addEventListener('DOMContentLoaded', () => {

  /*****************************************************************************
  * Variables and Data
  *****************************************************************************/
  let addMeme = false
  const memeContainer = document.querySelector('#memes-list')
  const addBtn = document.querySelector('#new-meme-btn')
  const memeForm = document.querySelector('.container')
  const memeTitleInput = document.querySelector('#meme-title-input')
  const memeTextInput = document.querySelector('#meme-text-input')
  const memeImageInput = document.querySelector('#meme-image-input')

  /*****************************************************************************
  * Fetch Onload
  *****************************************************************************/

  fetch(API_END)
  .then(r => r.json())
  .then(memesObj => {
    ALLMEMES = memesObj.data
    memeContainer.innerHTML = renderAllMemes()
  })

  /*****************************************************************************
  * Event Listeners
  *****************************************************************************/

  addBtn.addEventListener('click', () => {
    addMeme = !addMeme
    if (addMeme) {
      memeForm.style.display = 'block'
    } else {
      memeForm.style.display = 'none'
    }
  })

  memeContainer.addEventListener('click', (e) => {
    if (e.target.dataset.action === 'edit') {
      let foundMeme = ALLMEMES.find(meme => {
        return e.target.dataset.id == meme.id
      })
      let inputTitle = foundMeme.attributes.title
      let inputText = foundMeme.attributes["meme-text"]
      let inputImage = foundMeme.attributes.image
      let memeId = e.target.dataset.id
      const meme = document.querySelector('#meme')
      return e.target.parentElement.innerHTML += `
      <form class="edit-meme-form" data-id="${memeId}">
        <h3>Edit a Meme!</h3>
        <label for="edit-meme">Title</label>
       <input id="edit-title-input"type="text" name="name" value="${inputTitle}">
       <br>
       <label for="edit-meme">Text</label>
       <input id="edit-text-input"type="text" name="name" value="${inputText}">
       <br>
       <label for="edit-meme">Image</label>
       <input id="edit-image-input"type="text" name="image" value="${inputImage}">
       <br>
       <input type="submit" name="submit" value="Submit" class="submit">
      </form>`
    }
  })

  memeContainer.addEventListener('submit', (e) => {
    e.preventDefault()
    let editTitleInput = document.querySelector('#edit-title-input')
    let editTextInput = document.querySelector('#edit-text-input')
    let editImageInput = document.querySelector('#edit-image-input')
    let memeId = e.target.dataset.id
    fetch(`${API_END}/${memeId}`,{
      method: "PATCH",
      headers:{
        "Content-Type": "application/json",
        Accept: "application/json"
      },
      body: JSON.stringify({
        title: editTitleInput.value,
        meme_text: editTextInput.value,
        image: editImageInput.value
      })
    })
    .then(r => r.json())
    .then((updatedData)=>{
      let foundMeme = ALLMEMES.find(meme => {
        return updatedData.data.id == meme.id
      })
      const indexOfFoundMeme = ALLMEMES.indexOf(foundMeme)
      ALLMEMES[indexOfFoundMeme] = updatedData.data
      document.querySelector('#meme').innerHTML = memeHTML(updatedData.data)
    })
  }) //End of Event Listener

  memeForm.addEventListener('submit',(e)=>{
    e.preventDefault()
    let inputTitle = memeTitleInput.value
    let inputText = memeTextInput.value
    let inputImage = memeImageInput.value
    fetch(API_END, {
      method:"POST",
      headers:{
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body:JSON.stringify({
        title: inputTitle,
        image: inputImage,
        meme_text: inputText,
        user_id: 1
      })
    })
    .then(r => r.json())
    .then(newObj => {
      ALLMEMES.push(newObj.data)
      memeContainer.innerHTML = renderAllMemes()
      window.scrollTo(0,document.body.scrollHeight)
    })
    e.target.reset()
  })

}) //END OF DOM CONTENT LOADED

/*******************************************************************************
* Helper Functions
*******************************************************************************/

const renderAllMemes = () => {
  return ALLMEMES.map(meme => memeHTML(meme)).join('')
}

const memeHTML = (meme) => {
  return `<div id="meme">
    <li id="meme-title">${meme.attributes.title}</li>
    <h3 id="meme-text">${meme.attributes["meme-text"]}</h3>
    <img id="meme-image"src="${meme.attributes.image}">
    <button data-id="${meme.id}" data-action="edit"type="button">Edit Meme</button>
    <button data-id="${meme.id}" data-action="delete"type="button">Delete Meme</button>
  </div>`
}
