const saveBtn = document.getElementById("save-btn")
const timeOption = document.getElementById("focus-input")
const restOption = document.getElementById("rest-input")


restOption.addEventListener("change", (event)=>{
  const val = event.target.value
  if (val<0 || val>60){
    timeOption.value = 5
  }
})

timeOption.addEventListener("change", (event)=>{
  const val = event.target.value
  if (val<1 || val>60){
    timeOption.value = 25
  }
})

saveBtn.addEventListener("click", () => {
    chrome.storage.local.set({
      timer: 0,
      timeOption: timeOption.value,
      isRunning: false,
      isResting: false,
      restOption: restOption.value,
    })
  })

chrome.storage.local.get(["timeOption", "restOption"], (res)=>{
  timeOption.value = res.timeOption
  restOption.value = res.restOption
})