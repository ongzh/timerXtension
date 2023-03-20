const curTimeElement = document.getElementById("cur-time")


function updateTimeElements(){
    chrome.storage.local.get(["timer", "timeOption", "restOption", "isResting"], (res)=>{
        const timerElement = document.getElementById("timer")
        const resterElement = document.getElementById("rest-timer")
        
        let option = res.isResting ? res.restOption : res.timeOption

        const minutes = `${option - Math.ceil(res.timer / 60)}`.padStart(2,"0")
        let seconds = "00"
        if (res.timer % 60 != 0){
            seconds = `${60 - res.timer % 60}`.padStart(2,"0")
        }
        
        if (res.isResting){
            console.log(res.isResting)
            console.log(option)
            console.log(res.timer)
            resterElement.textContent = `${minutes}:${seconds}`
        }
        else{
            console.log("not resting")
            timerElement.textContent = `${minutes}:${seconds}`
            resterElement.textContent = `${res.restOption}`.padStart(2,"0") +":00"
        }
    })
    const currentTime = new Date().toLocaleTimeString()
    curTimeElement.textContent = `Current Time: ${currentTime}`
}

updateTimeElements()
setInterval(updateTimeElements, 1000)


const currentTime = new Date().toLocaleTimeString()
curTimeElement.textContent = `Current Time: ${currentTime}`;


const startBtn = document.getElementById("start-btn")
const resetBtn = document.getElementById("reset-btn")

startBtn.addEventListener("click", ()=>{
    chrome.storage.local.get(["isRunning"], (res)=>{
        chrome.storage.local.set({
            isRunning: !res.isRunning,
        },()=>{
            startBtn.textContent = !res.isRunning ? "Pause Timer" : "Start Timer"
        })

    }) 
}) 


resetBtn.addEventListener("click", ()=>{
    chrome.storage.local.set({
        timer: 0,
        isRunning:false,
        isResting: false,   
    }, ()=>{
        startBtn.textContent = "Start Timer"
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
    text.className = "task-input-text"
    text.addEventListener("change", ()=>{
        tasks[taskNum] = text.value
        saveTasks()
    
    })

    const deleteBtn = document.createElement("input")
    deleteBtn.type = "button"
    deleteBtn.value = "X"
    deleteBtn.className = "task-delete-btn"
    deleteBtn.addEventListener("click", ()=>{
        deleteTask(taskNum)
    })

    const completeBtn = document.createElement("input")
    completeBtn.type = "button"
    completeBtn.value = "O"
    completeBtn.className = "task-complete-btn"
    completeBtn.addEventListener("click", ()=>{
        completeTask(taskNum)
    })

    taskRow.appendChild(text)
    taskRow.appendChild(deleteBtn)
    taskRow.append(completeBtn)

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

function completeTask(taskNum){
    tasks.splice(taskNum,1 )
    renderTasks()
    saveTasks()
    addCompletedTask()

}

function renderTasks(){
    const taskContainer = document.getElementById("task-container")
    taskContainer.textContent = ""
    tasks.forEach((taskText, taskNum) => {
        renderTask(taskNum)
    })
}



let taskCount = 0
const taskCompleted = document.getElementById("cur-task-completed")
chrome.storage.sync.get(["taskCount"], (res)=>{
    taskCount = res.taskCount ? res.taskCount : 0
    renderCompletedTaskCount(taskCount)
})

function renderCompletedTaskCount(taskCount){
    taskCompleted.textContent = `${taskCount}` 

}

function addCompletedTask(){
    chrome.storage.sync.get(["taskCount"], (res)=>{
        const taskCount = res.taskCount ? res.taskCount +1 : 1
        chrome.storage.sync.set({
            taskCount: taskCount ,
        },()=>{
            console.log(taskCount)
            renderCompletedTaskCount(taskCount)
        })

    }) 
}

const resetTaskBtn = document.getElementById("reset-task-btn")
resetTaskBtn.addEventListener("click", ()=>{
    chrome.storage.sync.set({
        taskCount: 0,
    },()=>{
        renderCompletedTaskCount(0)
    })
}
)

