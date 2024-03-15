const lightTheme = document.querySelector(".light-theme");
const listBody = document.querySelector(".top");
const moon = document.querySelector(".moon");
const backgroundImg = document.querySelector(".background");

const input = document.querySelector(".todo-input");
const checkbox = document.querySelector(".checkbox");
const list = document.querySelector(".tasks__list");
const deleteIcons = () => document.querySelectorAll(".close--icon");
const checkIcons = () => document.querySelectorAll(".checkbox--task");
const allTasks = () => document.querySelector(".all--items");
const activeTaks = () => document.querySelector(".active--items");
const completedTaks = () => document.querySelector(".completed--items");
const itemsList = () => document.querySelectorAll(".item");
const dragsentance = document.querySelector(".dragtext");
const clearCompletedTaks = () =>
  document.querySelector(".clearcompleted--items");
const summaryList = document.createElement("div");
summaryList.className = "summary__list";
summaryList.innerHTML = `
    <div class="summary--numbers">
        <p>0 items left</p>
    </div>
    <div class="summary--all">
        <p class="all--items">All</p>
        <p class="active--items">Active</p>
        <p class="completed--items">Completed</p>
    </div>
    <div class="summary--clear">
        <p class="clearcompleted--items">Clear Completed</p>
    </div>
  `;

const emptyState = () => {
  list.innerHTML = `<p class="empty-state">There is no tasks to show</p>`;
};
const initList = (tasks) => {
  if (tasks.length) {
    renderData(tasks);
    initListenersTasks();
    dragsentance.style.opacity = 1;
    summaryList.style.opacity = 1;
  } else {
    dragsentance.style.opacity = 0;
    summaryList.style.opacity = 0;
    emptyState();
  }
};
const toggleDarkMode = () => {
  listBody.classList.toggle("dark--theme");
  if (listBody.classList.contains("dark--theme")) {
    moon.src = "./images/icon-sun.svg";
    backgroundImg.src = "./images/bg-desktop-dark.jpg";
  } else {
    moon.src = "./images/icon-moon.svg";
    backgroundImg.src = "./images/bg-desktop-light.jpg";
  }
  saveData(
    "dark-theme",
    listBody.classList.contains("dark--theme") ? true : false
  );
};

lightTheme.addEventListener("click", () => {
  toggleDarkMode();
});
const fetchData = (key) => {
  const data = localStorage.getItem(key);
  return data ? JSON.parse(data) : false;
};
const saveData = (key, value) => {
  localStorage.setItem(key, JSON.stringify(value));
};

const renderData = (tasks) => {
  let listTasks = "";
  tasks.forEach((task) => {
    listTasks += `<li class="taskcontent item" draggable="true">
            <div class="task">
                <div class="checkbox--task ${
                  task.isChecked ? " checkbox--task--Active" : ""
                } ${
      task.isClear ? " checkbox--task--through" : ""
    }" role="button" tabindex="0"></div>
                <div class="taskvalue">
                    <p class="taskText">${task.value}</p>
                </div>
            </div>
            <img class="close--icon" src="images/icon-cross.svg" alt="cross-icon" />
        </li>`;
  });

  summaryList.querySelector(".summary--numbers ").textContent = `${
    tasks.filter((task) => !task.isChecked && !task.isClear).length
  } items left`;
  list.innerHTML = listTasks;
  list.insertAdjacentElement("afterend", summaryList);
  input.value = "";
};

const deletTasks = (e, index) => {
  const tasks = fetchData("tasks");
  tasks.splice(index, 1);
  saveData("tasks", tasks);
  initList(tasks);
};

const toggleCheckeed = (e, index) => {
  const tasks = fetchData("tasks");
  e.currentTarget.classList.toggle("checkbox--task--Active");
  tasks[index].isChecked = !tasks[index].isChecked;
  saveData("tasks", tasks);
};
const completed = () => {
  const CheckedItems = fetchData("tasks");

  const checked = CheckedItems.filter((item) => {
    if (item.isClear) {
    }
    return item.isChecked;
  });
  initList(checked);
};
const all = () => {
  const tasks = fetchData("tasks");
  initList(tasks);
};
const active = () => {
  const unfinishedTasks = fetchData("tasks");
  const notChecked = unfinishedTasks.filter((item) => {
    return !item.isChecked;
  });
  initList(notChecked);
};
const clearcompleted = () => {
  const tasks = fetchData("tasks");
  tasks.forEach((task) => {
    if (task.isChecked && task.isChecked) {
      task.isClear = true;
    }
  });
  saveData("tasks", tasks);
  initList(tasks);
};
const initListenersTasks = () => {
  deleteIcons().forEach((task, index) => {
    task.addEventListener("click", (e) => {
      deletTasks(e, index);
      console.log(e, index);
    });
  });
  checkIcons().forEach((task, index) => {
    task.addEventListener("click", (e) => {
      toggleCheckeed(e, index);
    });
  });
  completedTaks().addEventListener("click", completed);
  allTasks().addEventListener("click", all);
  activeTaks().addEventListener("click", active);
  clearCompletedTaks().addEventListener("click", clearcompleted);
};

const addTask = (e) => {
  e.preventDefault();
  const inputVlue = input.value;
  if (!inputVlue) return;
  const task = {
    value: input.value,
    isChecked: false,
    isClear: false,
  };
  const tasks = fetchData("tasks") || [];
  if (task.isClear) return;
  tasks.push(task);
  saveData("tasks", tasks);
  initList(tasks);
};
const initDataOnStartup = () => {
  fetchData("dark-theme") && toggleDarkMode();
  initList(fetchData("tasks"));
};
initDataOnStartup();

// addeventlistener
checkbox.addEventListener("click", (e) => addTask(e));

// drag and drop
let draggedItem;

const startDragging = (e) => {
  draggedItem = e.target.closest(".item");
  draggedItem.classList.add("dragging");
};

const moveDragging = (e) => {
  if (!draggedItem) return;
  e.preventDefault();
  let positionY;
  if (e.touches) {
    positionY = e.touches[0].clientY;
  } else {
    positionY = e.clientY;
  }
  const siblings = [...document.querySelectorAll(".item")];
  const nextSibling = siblings.find((sibling) => {
    return positionY <= sibling.offsetTop + sibling.offsetHeight * 2;
  });

  if (nextSibling) {
    list.insertBefore(draggedItem, nextSibling);
  }
};

const endDragging = () => {
  draggedItem.classList.remove("dragging");
  draggedItem = null;
};

// Mouse events
document.addEventListener("mousedown", startDragging);
document.addEventListener("mousemove", moveDragging);
document.addEventListener("mouseup", endDragging);

// Touch events
document.addEventListener("touchstart", startDragging);
document.addEventListener("touchmove", moveDragging);
document.addEventListener("touchend", endDragging);
