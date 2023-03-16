const timeElement = document.getElementById("time")
const nameElement = document.getElementById("name")
const timerElement = document.getElementById("timer")


function updateTimeElements(){
    chrome.storage.local.get(["timer"], (res)=>{
        const time = res.timer ?? 0
        timerElement.textContent = `The timer is at: ${time} seconds`
    })
    const currentTime = new Date().toLocaleTimeString()
timeElement.textContent = `The time is: ${currentTime}`;
}

updateTimeElements()
setInterval(updateTimeElements, 1000)


const currentTime = new Date().toLocaleTimeString()
timeElement.textContent = `The time is: ${currentTime}`;
/*
chrome.action.setBadgeText({
    text: "TIME",
}, ()=>{console.log("Finished setting bade text.")})
*/
chrome.storage.sync.get(["name"], (res)=>{
    const name = res.name ?? "???"
    nameElement.textContent = `Your name is ${name}`
})

const startBtn = document.getElementById("start-btn")
const stopBtn = document.getElementById("stop-btn")
const resetBtn = document.getElementById("reset-btn")

startBtn.addEventListener("click", ()=>{
    chrome.storage.local.set({
        isRunning:true,   
    })
})

stopBtn.addEventListener("click", ()=>{
    chrome.storage.local.set({
        isRunning:false,   
    })
})

resetBtn.addEventListener("click", ()=>{
    chrome.storage.local.set({
        timer: 0,
        isRunning:false,   
    })
})


let tasks = []

const addTaskBtn = document.getElementById("add-task-btn")
addTaskBtn.addEventListener("click", ()=>addTask())

chrome.storage.sync.get(["tasks"], (res)=>{
    tasks = res.tasks ? res.tasks : []
    renderTasks()
})

function saveTasks(){
    chrome.storage.sync.set({
        tasks:tasks
    })
}

function renderTask(taskNum){
    const taskRow = document.createElement("div")

    const text = document.createElement("input")
    text.type = "text"
    text.placeholder = "Enter a task..."
    text.value = tasks[taskNum]
    text.addEventListener("change", ()=>{
        tasks[taskNum] = text.value
        saveTasks()
    
    })

    const deleteBtn = document.createElement("input")
    deleteBtn.type = "button"
    deleteBtn.value = "X"
    deleteBtn.addEventListener("click", ()=>{
        deleteTask(taskNum)
    })

    taskRow.appendChild(text)
    taskRow.appendChild(deleteBtn)

    const taskContainer = document.getElementById("task-container")
    taskContainer.appendChild(taskRow)

}


function addTask(){
    const taskNum = tasks.length
    tasks.push("")
    renderTask(taskNum)
    saveTasks()
  
}

function deleteTask(taskNum){
    tasks.splice(taskNum, 1)
    renderTasks()
    saveTasks()
}

function renderTasks(){
    const taskContainer = document.getElementById("task-container")
    taskContainer.textContent = ""
    tasks.forEach((taskText, taskNum) => {
        renderTask(taskNum)
    })
}