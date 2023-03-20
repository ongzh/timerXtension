chrome.alarms.create("pomodoroTimer", {
    periodInMinutes: 1 / 60,
})

chrome.storage.local.get(["timer", "isRunning", "timeOption", "restOption"], (res)=>{
    chrome.storage.local.set({
        timer:"timer" in res ? res.timer:0,
        isRunning: "isRunning" in res ? res.isRunning: false,
        isResting: "isResting" in res ? res.isResting: false,
        timeOption: "timeOption" in res ? res.timeOption : 25,
        restOption: "restOption" in res ? res.restOption: 5

    })
})


chrome.alarms.onAlarm.addListener((alarm)=>{
    if (alarm.name === "pomodoroTimer"){
        chrome.storage.local.get(["timer", "isRunning", "isResting", "restOption","timeOption"], (res)=>{
            
            if (res.isResting){
                let timer = res.timer + 1 
                let isResting = true 
                if (timer == 60 * res.restOption){
                    this.registration.showNotification("Pomodoro Timer",
                    {
                        body: `${res.restOption} minutes has passed! Get back to work!`,
                        icon: "icon.png"
                    })
                    timer = 0
                    isRunning = false
                    isResting = false 
                }
                chrome.storage.local.set({
                    timer,
                    isResting,
                })
            }
            
            if (res.isRunning) {
                let timer = res.timer + 1
                let isRunning = true
                let isResting = false
                if (timer == 60 * res.timeOption){
                    this.registration.showNotification("Pomodoro Timer",
                    {
                        body: `${res.timeOption} minutes has passed! Rest time starts now!`,
                        icon: "icon.png"
                    })
                    timer = 0
                    isRunning = false
                    if (res.restOption != 0){
                        isResting = true 
                    }
                }
                chrome.storage.local.set({
                    timer,
                    isRunning,
                    isResting,
                })
                const minutes = `${res.timeOption - Math.ceil(res.timer / 60)}`.padStart(2,"0")
                let seconds = "00"
                if (res.timer % 60 != 0){
                    seconds = `${60 - res.timer % 60}`.padStart(2,"0")
                }
                chrome.action.setBadgeText({
                    text: `${minutes}:${seconds}`
                })
            }
            else {
            chrome.action.setBadgeText({
                text: "REST"
                })
            return 
            }
        
        })
    }
    
})

console.log(this)



