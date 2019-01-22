let ALLMEMES = []
const API_END = "http://localhost:3000/api/v1/memes"


document.addEventListener('DOMContentLoaded', () => {
  let addMeme = false
  const memeContainer = document.querySelector('#memes-list')
  const addBtn = document.querySelector('#new-meme-btn')
  const memeForm = document.querySelector('.container')
  const memeTitleInput = document.querySelector('#meme-title-input')
  const memeTextInput = document.querySelector('#meme-text-input')
  const memeImageInput = document.querySelector('#meme-image-input')

  fetch(API_END)
  .then(r => r.json())
  .then(memesObj => {
    ALLMEMES = memesObj.data
    memeContainer.innerHTML = renderAllMemes()
  })

  // EVENT LISTENERS
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
    let inputTitle = document.querySelector('#meme-title-input').innerHTML
    let inputText = memeTextInput.innerHTML
    let inputImage = memeImageInput.innerHTML
    let memeId = e.target.dataset.id

    console.log(memeTitleInput)

    return memeContainer.innerHTML += `
    <form class="edit-meme-form" style="">
      <h3>Create a Meme!</h3>
   <input id="meme-title-input"type="text" name="name" value="${inputTitle}">
   <br>
   <input id="meme-text-input"type="text" name="name" value="${inputText}">
   <br>
   <input id="meme-image-input"type="text" name="image" value="${inputImage}">
   <br>
   <input type="submit" name="submit" value="Create New Meme" class="submit">
  </form>`
    // fetch(`${API_END}/${memeId}`, {method: "GET"})
    // .then(r => r.json())
    // .then(objToEdit => {
    //   editForm.dataset.id = objToEdit.data.id
    //   inputTitle.value = objToEdit.dataset
    //   inputText.value =
    //   inputImage.value =
    // })
  }
})

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

// HELPER FUNCTIONS
const renderAllMemes = () => {
  return ALLMEMES.map(meme => memeHTML(meme)).join('')
}

const memeHTML = (meme) => {
  return `<li>${meme.attributes.title}</li>
    <h3>${meme.attributes["meme-text"]}</h3>
    <img src="${meme.attributes.image}">
    <button data-id="${meme.id}" data-action="edit"type="button">Edit Meme</button>
    <button data-id="${meme.id}" data-action="delete"type="button">Delete Meme</button>`
}
