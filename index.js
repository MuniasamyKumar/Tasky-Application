// var state = {
//   tasklist: [
//     {
//       imageUrl: "",
//       title: "",
//       taskType: "",
//       taskDescription: "",
//     },
//     {
//       imageUrl: "",
//       title: "",
//       taskType: "",
//       taskDescription: "",
//     },
//     {
//       imageUrl: "",
//       title: "",
//       taskType: "",
//       taskDescription: "",
//     },
//     {
//       imageUrl: "",
//       title: "",
//       taskType: "",
//       taskDescription: "",
//     },
//     {
//       imageUrl: "",
//       title: "",
//       taskType: "",
//       taskDescription: "",
//     },
//   ],
// };

const state = {
  taskList: [],
};

// DOM Operations

const taskContents = document.querySelector(".task__contents");
const taskModal = document.querySelector(".task__modal__body");

console.log(taskContents);
console.log(taskModal);
// element key key ={id} is missingon 49 th line
const htmlTaskContent = ({ id, title, description, type, url }) =>
  `<div class="col-md-6 col-lg-4 mt-3" id=${id}>
    <div class="card shadow-sm task__card">
      <div class="card-header d-flex justify-content-end task__card__header gap-2">
        <button class="btn btn-outline-primary " name=${id} onClick ='editTask.apply(this, arguments)'>
          <i class="fas fa-pencil-alt" name=${id}></i>
        </button>
        <button class="btn btn-outline-danger " name=${id} onClick ='deleteTask.apply(this, arguments)'>
          <i class="fas fa-trash-alt" name=${id} ></i>
        </button>
      </div>
      <div class="card-body">
       ${
         url
           ? `<img
             width="100%"
             src=${url}
             alt="Card Image "
             class="card-img-top md-3 rounded-lg"
           />`
           : `<img
             width="100%"
             src="https://ralfvanveen.com/wp-content/uploads/2021/06/Placeholder-_-Glossary.svg"
             alt="Card Image "
             class="card-img-top md-3 rounded-lg"
           />`
       }
        <h4 class="card-title task__task__title">${title}</h4>
        <p class="description trim-3-lines text-muted">${description}</p>
        <div class="tags text-white">
          <span class="badge bg-primary m-1">
          ${type}</span>
        </div>
      </div>
      <div class="card-footer">
        <button
          type="button"
          class=" btn btn-outline-primary float-right"
          data-bs-toggle="modal"
           data-bs-target="#showTask"
          onClick = 'openTask.apply(this,arguments)'
          id =${id}
        >
          Open Task
        </button>
      </div>
    </div>
  </div>`;

// Model Body on >> Clk of Open Task
const htmlModalContent = ({ id, title, description, url }) => {
  const date = new Date(parseInt(id));
  return `
    <div id=${id}>
       ${
         url
           ? `<img width="100%" src=${url} alt='card image class='img-fluid rounded place__holder__image mb-3 '  />`
           : `<img width="100%" src="https://ralfvanveen.com/wp-content/uploads/2021/06/Placeholder-_-Glossary.svg" alt='card image class='card-img-top md-3 rounded-lg' />`
       }
      <strong class="text-muted text-sm">
        Created on : ${date.toDateString()}
      </strong>
      <h2 class="my-3">${title}</h2>
      <p class="text-muted">${description}</p>
    </div>
  `;
};

const updateLocalStorage = () => {
  localStorage.setItem(
    "task",
    JSON.stringify({
      tasks: state.taskList,
    })
  );
};

//local initial Data

const loadInitialData = () => {
  const localStorageCopy = JSON.parse(localStorage.task);
  if (localStorageCopy) state.taskList = localStorageCopy.tasks;

  state.taskList.map((cardDate) => {
    taskContents.insertAdjacentHTML("beforeend", htmlTaskContent(cardDate));
  });
};

const handleSubmit = (event) => {
  // console.log("Data");
  event.preventDefault();
  const id = `${Date.now()}`;
  const input = {
    url: document.getElementById("imageUrl").value,
    title: document.getElementById("taskTitle").value,
    type: document.getElementById("tags").value,
    description: document.getElementById("taskDescription").value,
  };

  if (input.title === "" || input.type === "" || input.description === "") {
    return alert("Please fill out the all the necessary fileds!");
  }
  taskContents.insertAdjacentHTML(
    "beforeend",
    htmlTaskContent({ ...input, id })
  );

  state.taskList.push({ ...input, id });
  updateLocalStorage();
};

// open task
const openTask = (e) => {
  // if (!e) e = window.event;

  const getTask = state.taskList.find(({ id }) => id === e.target.id);
  taskModal.innerHTML = htmlModalContent(getTask);
};
// delete task
const deleteTask = (e) => {
  if (!e) e = window.event;

  const targetId = e.target.getAttribute("name");
  // console.log(targetId);
  const type = e.target.tagName;
  // console.log(type);
  const removeTask = state.taskList.filter(({ id }) => id !== targetId);
  // console.log(removeTask);
  state.taskList = removeTask;
  updateLocalStorage();

  if (type === "BUTTON") {
    console.log(e.target.parentNode.parentNode.parentNode.parentNode);
    return e.target.parentNode.parentNode.parentNode.parentNode.removeChild(
      e.target.parentNode.parentNode.parentNode
    );
  }
  return e.target.parentNode.parentNode.parentNode.parentNode.parentNode.removeChild(
    e.target.parentNode.parentNode.parentNode.parentNode
  );
};

// edit task
const editTask = (e) => {
  if (!e) e = window.event;

  const targetId = e.target.id;
  const type = e.target.tagName;

  let parentNode;
  let taskTitle;
  let taskDescription;
  let taskType;
  let submitButton;

  if (type === "BUTTON") {
    parentNode = e.target.parentNode.parentNode;
  } else {
    parentNode = e.parentNode.parentNode.parentNode;
  }

  taskTitle = parentNode.childNodes[3].childNodes[3];
  taskDescription = parentNode.childNodes[3].childNodes[5];
  taskType = parentNode.childNodes[3].childNodes[7].childNodes[1];
  submitButton = parentNode.childNodes[5].childNodes[1];

  // console.log(submitButton);
  taskTitle.setAttribute("contenteditable", "true");
  taskDescription.setAttribute("contenteditable", "true");
  taskType.setAttribute("contenteditable", "true");

  submitButton.setAttribute("onClick", "saveEdit.apply(this,arguments)");
  submitButton.removeAttribute("data-bs-toggle");
  submitButton.removeAttribute("data-bs-target");
  submitButton.innerHTML = "Save Changes";
};
// save edit
const saveEdit = (e) => {
  if (!e) e = window.event;

  const targetId = e.target.id;
  const parentNode = e.target.parentNode.parentNode;
  // console.log(parentNode);
  const taskTitle = parentNode.childNodes[3].childNodes[3];
  const taskDescription = parentNode.childNodes[3].childNodes[5];
  const taskType = parentNode.childNodes[3].childNodes[7].childNodes[1];
  const submitButton = parentNode.childNodes[5].childNodes[1];

  const updateData = {
    taskTitle: taskTitle.innerHTML,
    taskDescription: taskDescription.innerHTML,
    taskType: taskType.innerHTML,
  };

  let stateCopy = state.taskList;

  stateCopy = stateCopy.map((task) =>
    task.id === targetId
      ? {
          id: task.id,
          title: updateData.taskTitle,
          description: updateData.taskDescription,
          type: updateData.taskType,
          url: task.url,
        }
      : task
  );
  state.taskList = stateCopy;
  updateLocalStorage();
  taskTitle.setAttribute("contenteditable", "false");
  taskDescription.setAttribute("contenteditable", "false");
  taskType.setAttribute("contenteditable", "false");

  submitButton.setAttribute("onClick", "openTask.apply(this,arguments)");
  submitButton.setAttribute("data-bs-toggle", "modal");
  submitButton.setAttribute("data-bs-target", "#showTask");
  submitButton.innerHTML = "Open Task";
};
// search
// const searchTask = (e) => {
//   if (!e) e = window.event;

//   while (taskContents.firstChild) {
//     taskContents.removeChild(taskContents.firstChild);
//   }

//   // const resultData = state.taskList.filter(({ title }) =>
//   //   // title.toLowerCase().includes(e.target.value.toLowerCase())
//   // );
//   const query = e.target.value.toLowerCase();
//   const resultData = query
//     ? state.taskList.filter(({ title }) => title.toLowerCase().includes(query))
//     : state.taskList;

//   console.log(resultData);
//   resultData.map((cardData) =>
//     taskContents.insertAdjacentHTML("beforeend", htmlModalContent(cardData))
//   );

const searchTask = (e) => {
  if (!e) e = window.event;

  // Clear the current contents
  while (taskContents.firstChild) {
    taskContents.removeChild(taskContents.firstChild);
  }

  // Get the search query
  const query = e.target.value.toLowerCase();

  // Filter the task list based on the search query
  const resultData = query
    ? state.taskList.filter(({ title }) => title.toLowerCase().includes(query))
    : state.taskList; // If the query is empty, display all tasks

  console.log(resultData);

  // Insert the filtered results into the DOM
  resultData.map((cardData) =>
    taskContents.insertAdjacentHTML("beforeend", htmlTaskContent(cardData))
  );
};
