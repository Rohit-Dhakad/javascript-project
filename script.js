const createBtn = document.getElementById("create-btn");
const notesContainer = document.querySelector(".notes-container");


const editSvg = `<svg class="action-btn edit-btn" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="20" height="20" fill="currentColor"><path d="M15.7279 9.57627L14.3137 8.16206L5 17.4758V18.89H6.41421L15.7279 9.57627ZM17.1421 8.16206L18.5563 6.74785L17.1421 5.33364L15.7279 6.74785L17.1421 8.16206ZM7.24264 20.89H3V16.6474L16.435 3.21231C16.8256 2.82179 17.4587 2.82179 17.8492 3.21231L20.6777 6.04074C21.0682 6.43126 21.0682 7.06443 20.6777 7.45495L7.24264 20.89Z"></path></svg>`;

const saveSvg = `<svg class="action-btn edit-btn" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="20" height="20" fill="currentColor"><path d="M7 19C6.4 19 5.9 18.5 5.9 17.9V6.1C5.9 5.5 6.4 5 7 5H15L19 9V17.9C19 18.5 18.5 19 17.9 19H7ZM9 7V10H14V7H9ZM7 17H17V12H7V17Z"></path><path d="M5 21C4.44772 21 4 20.5523 4 20V4C4 3.44772 4.44772 3 5 3H16.1716C16.702 3 17.2107 3.21071 17.5858 3.58579L20.4142 6.41421C20.7893 6.78929 21 7.29799 21 7.82843V20C21 20.5523 20.5523 21 20 21H5ZM6 5V19H18V8.24264L15.7574 6H15V11H8V5H6ZM10 13H14V17H10V13Z"></path></svg>`;

const deleteSvg = `<svg class="action-btn delete-btn" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="20" height="20" fill="currentColor"><path d="M17 6H22V8H20V21C20 21.5523 19.5523 22 19 22H5C4.44772 22 4 21.5523 4 21V8H2V6H7V3C7 2.44772 7.44772 2 8 2H16C16.5523 2 17 2.44772 17 3V6ZM9 11V17H11V11H9ZM13 11V17H15V11H13ZM9 4V6H15V4H9Z"></path></svg>`;


function saveNotesToStorage() {
  const notes = [];
  document.querySelectorAll(".note-content").forEach(note => {
    notes.push(note.innerHTML); 
  });
  localStorage.setItem("my_notes_app", JSON.stringify(notes));
}


function loadNotes() {
  notesContainer.innerHTML = "";
  const savedData = localStorage.getItem("my_notes_app");

  if (savedData) {
    try {
      const notesData = JSON.parse(savedData);
      notesData.forEach(content => {
        createNoteCard(content, false); 
      });
    } catch (e) {
      console.error("Local Storage data parse error:", e);
    }
  }
}


function createNoteCard(content = "", isEditing = true) {
  const card = document.createElement("div");
  card.className = `note-card ${isEditing ? 'editing' : ''}`;

  card.innerHTML = `
    <div class="note-toolbar">
      <span class="toggle-edit">${isEditing ? saveSvg : editSvg}</span>
      <span class="delete-icon">${deleteSvg}</span>
    </div>
    <div class="note-content" contenteditable="${isEditing}">${content}</div>
  `;

  notesContainer.appendChild(card);

  const noteContent = card.querySelector(".note-content");

  if (isEditing) {
    noteContent.focus();
  }

  saveNotesToStorage();
}


createBtn.addEventListener("click", () => {
  createNoteCard("", true);
});


notesContainer.addEventListener("input", (e) => {
  if (e.target.classList.contains("note-content")) {
    saveNotesToStorage();
  }
});


notesContainer.addEventListener("click", (e) => {
  const card = e.target.closest(".note-card");
  if (!card) return;

  const noteContent = card.querySelector(".note-content");
  const editToggleBtn = card.querySelector(".toggle-edit");


  if (e.target.closest(".delete-icon")) {
    card.remove();
    saveNotesToStorage();
    return;
  }

  
  if (e.target.closest(".toggle-edit")) {
    const isCurrentlyEditable = noteContent.getAttribute("contenteditable") === "true";

    if (isCurrentlyEditable) {
     
      noteContent.setAttribute("contenteditable", "false");
      card.classList.remove("editing");
      editToggleBtn.innerHTML = editSvg;
      saveNotesToStorage();
    } else {
      
      noteContent.setAttribute("contenteditable", "true");
      card.classList.add("editing");
      editToggleBtn.innerHTML = saveSvg;
      noteContent.focus();
    }
  }
});


notesContainer.addEventListener("keydown", (e) => {
  if (e.key === "Enter" && !e.shiftKey) {
    const noteContent = e.target;
    if (noteContent.classList.contains("note-content")) {
      e.preventDefault();
      
      const card = noteContent.closest(".note-card");
      const editToggleBtn = card.querySelector(".toggle-edit");

      noteContent.setAttribute("contenteditable", "false");
      card.classList.remove("editing");
      if (editToggleBtn) editToggleBtn.innerHTML = editSvg;

      saveNotesToStorage();
    }
  }
});


document.addEventListener("DOMContentLoaded", loadNotes);