const state = {
  taskList: [],
};

const taskContents = document.querySelector(".task__contents");
const taskModal = document.querySelector(".task__modal__body");

const addCardContent = ({
  id,
  title,
  description,
  type,
  url,
}) => ` <div class="col-md-6 col-lg-4 mt-3" id=${id} key=${id}>
  <div class="card task__card shadow-sm">
    <div
      class="card-header bg-warning d-flex justify-content-end task__card__header"
    > 
      <button type="button" class="btn btn-outline-info mr-2" name=${id} onclick="taskEdit.apply(this, arguments)">
        <i class="fas fa-pencil-alt"name=${id}></i>
      </button>
      <button type="button" class="btn btn-outline-danger" name=${id} onclick="deleteTask.apply(this, arguments)">
        <i class="fas fa-trash-alt" name=${id}></i>
      </button>
    </div>
    <div class="card-body">
    ${url &&
  `<img style="background-size: cover; height: 170px; width: 265px;" src=${url} alt="Card image cap" class="card-img-top mb-3 rounded-lg">`
  }
      <h4 class="task__card__title">${title}</h4>
      <p class="description trim-3-lines text-muted" data-gramm_editor="false">
       ${description}
      </p>
      <div class="tags text-white d-flex flex-wrap">
        <span class="badge bg-primary m-1">${type}</span>
      </div>
    </div>
    <div class="card-footer bg-warning">
      <button
        type="button"
        class="btn btn-outline-primary float-right"
        data-bs-toggle="modal"
        data-bs-target="#showTask"
        onclick="openTask.apply(this, arguments)"
        id=${id}
      >
        Open Task
      </button>
    </div>
  </div>
  </div>`;

const modalContent = ({ id, title, description, url }) => {
  const date = new Date(parseInt(id));
  return ` <div id=${id}>
    <img
    src=${url ||
    `https://images.unsplash.com/photo-1572214350916-571eac7bfced?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=755&q=80`
    }
    alt="bg image"
    class="img-fluid place__holder__image mb-3"
    />
    <h2 class="my-3">${title}</h2>
    <p class="lead">
    ${description}
    </p>
    <strong class="text-sm text-muted">Created on ${date.toDateString()}</strong></div>`;
};

const updateLocalStorage = () => {
  localStorage.setItem("notify", JSON.stringify({ tasks: state.taskList }));
};

const reloadDataInitial = () => {
  const localStorageCopy = JSON.parse(localStorage.notify);
  if (localStorageCopy) state.taskList = localStorageCopy.tasks;
  state.taskList.map((cardData) => {
    taskContents.insertAdjacentHTML("beforeend", addCardContent(cardData));
  });
};

const submission = (e) => {
  const id = `${Date.now()}`;
  const input = {
    url: document.getElementById("imageUrl").value,
    title: document.getElementById("taskTitle").value,
    description: document.getElementById("taskDescription").value,
    type: document.getElementById("Tags").value,
  };

  taskContents.insertAdjacentHTML(
    "beforeend",
    addCardContent({ ...input, id })
  );

  state.taskList.push({ ...input, id });
  updateLocalStorage();
};

const openTask = (e) => {
  if (!e) e = window.event;

  const getTask = state.taskList.filter(({ id }) => id === e.target.id);
  taskModal.innerHTML = modalContent(getTask[0]);
};

const deleteTask = (e) => {
  if (!e) e = window.event;
  const targetID = e.target.getAttribute("name");
  const type = e.target.tagName;
  const removeTask = state.taskList.filter(({ id }) => id !== targetID);
  state.taskList = removeTask;

  updateLocalStorage();
  if (type === "BUTTON")
    return e.target.parentNode.parentNode.parentNode.parentNode.removeChild(
      e.target.parentNode.parentNode.parentNode
    );
  return e.target.parentNode.parentNode.parentNode.parentNode.parentNode.removeChild(
    e.target.parentNode.parentNode.parentNode.parentNode
  );
};

const taskEdit = (e) => {
  if (!e) e = window.event;
  const targetID = e.target.id;
  const type = e.target.tagName;
  let parentNode;
  let taskTitle;
  let taskDescription;
  let taskType;
  let submitButton;
  if (type === "BUTTON") {
    parentNode = e.target.parentNode.parentNode;
  } else {
    parentNode = e.target.parentNode.parentNode.parentNode;
  }
  taskTitle = parentNode.childNodes[3].childNodes[3];
  taskDescription = parentNode.childNodes[3].childNodes[5];
  submitButton = parentNode.childNodes[5].childNodes[1];
  taskType = parentNode.childNodes[3].childNodes[7].childNodes[1];

  taskTitle.setAttribute("contenteditable", "true");
  taskDescription.setAttribute("contenteditable", "true");
  taskType.setAttribute("contenteditable", "true");
  submitButton.setAttribute("onclick", "saveEdit.apply(this, arguments)");
  submitButton.setAttribute("onclick", "saveEdit.apply(this, arguments)");
  submitButton.removeAttribute("data-bs-toggle");
  submitButton.removeAttribute("data-bs-target");
  submitButton.innerHTML = "Save Changes";
};


const saveEdit = (e) => {
  if (!e) e = window.event;
  const targetID = e.target.id;
  const parentNode = e.target.parentNode.parentNode;
  console.log(parentNode.childNodes);
  const taskTitle = parentNode.childNodes[3].childNodes[3];
  const taskDescription = parentNode.childNodes[3].childNodes[5];
  const submitButton = parentNode.childNodes[5].childNodes[1];
  const taskType = parentNode.childNodes[3].childNodes[7].childNodes[1];
  const updateData = {
    taskTitle: taskTitle.innerHTML,
    taskDescription: taskDescription.innerHTML,
    taskType: taskType.innerHTML,
  };

  let stateCopy = state.taskList;
  stateCopy = stateCopy.map((task) =>
    task.id === targetID
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
  submitButton.setAttribute("onclick", "openTask.apply(this, arguments)");
  submitButton.setAttribute("data-bs-toggle", "modal");
  submitButton.setAttribute("data-bs-target", "#showTask");
  submitButton.innerHTML = "Open Task";
};

// for searching tasks by task name 

const taskSearch = (e) => {
  if (!e) e = window.event;
  while (taskContents.firstChild) {
    taskContents.removeChild(taskContents.firstChild);
  }

  const resultData = state.taskList.filter(({ title }) =>
    title.includes(e.target.value)
  );

  resultData.map((cardData1) => {
    taskContents.insertAdjacentHTML("beforeend", addCardContent(cardData1));
  });
};


