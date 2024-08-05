console.log('Lets write JavaScript');
let currentSong = new Audio();
let songs;



function secondsToMinutesSeconds(seconds) {
    if (isNaN(seconds) || seconds < 0) {
        return "00:00";
    }

    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);

    const formattedMinutes = String(minutes).padStart(2, '0');
    const formattedSeconds = String(remainingSeconds).padStart(2, '0');

    return `${formattedMinutes}:${formattedSeconds}`;
}

async function getSongs(){

   //currFolder = folder;
     let a= await fetch("http://127.0.0.1:5500/songs/")
     let response = await a.text();
     let div = document.createElement("div")
     div.innerHTML= response;
     let as= div.getElementsByTagName("a")
     let songs = []
     for (let index = 0; index < as.length; index++) {
         const element = as[index];
         
         if (element.href.endsWith(".mp3")) {
             songs.push(element.href.split("/songs/")[1])
         }
     }
     return songs
}

const playMusic= (track, pause=false)=>{
    //let audio = new Audio("/songs/" + track)
    currentSong.src = "/songs/" + track
    if(!pause){
        currentSong.play()
         play.innerHTML=`<i class="fa-regular fa-circle-pause invert"></i>`
    }
    
    document.querySelector(".songinfo").innerHTML= decodeURI(track)
    document.querySelector(".songtime").innerHTML= "00:00 / 00:00"
     
}

async function main(){
    
    // Get the list of all the songs
     songs= await getSongs()
    playMusic(songs[0], true)
    //console.log(songs)

    //show all the songs in the playlist
    let songUL= document.querySelector(".songList").getElementsByTagName("ul")[0]
for (const song of songs) {
        songUL.innerHTML = songUL.innerHTML + `<li> <i class="fa-solid fa-music"></i>
                                <div class="info">
                                    <div> ${song.replaceAll("%20"," ")}</div>
                                    <div>Song Artist</div>
                                </div>
                                <div class="playnow">
                                    <span>Play Now</span>
                                    <i class="fa-regular fa-circle-play"></i>
                                </div></li>`;
    }
    //attach an event listener to each song
    Array.from(document.querySelector(".songList").getElementsByTagName("li")).forEach(e=>{
        e.addEventListener("click", element=>{
            console.log(e.querySelector(".info").firstElementChild.innerHTML)
            playMusic(e.querySelector(".info").firstElementChild.innerHTML.trim())
        })
        
    })

    //Attach an event listener to play next and previous
    play.addEventListener("click",()=>{
        if(currentSong.paused){
            currentSong.play()
             play.innerHTML=`<i class="fa-regular fa-circle-pause invert"></i>`
        }
        else{
            currentSong.pause()
         play.innerHTML=`<i class="fa-regular fa-circle-play invert"></i>`
        }
    })

    // Listen for timeupdate event
    currentSong.addEventListener("timeupdate", () => {
          document.querySelector(".songtime").innerHTML = `${secondsToMinutesSeconds(currentSong.currentTime)} / ${secondsToMinutesSeconds(currentSong.duration)}`
        document.querySelector(".circle").style.left = (currentSong.currentTime / currentSong.duration) * 100 + "%";
    })
    
    // Add an event listener to seekbar
    document.querySelector(".seekbar").addEventListener("click", e => {
        let percent = (e.offsetX / e.target.getBoundingClientRect().width) * 100;
        document.querySelector(".circle").style.left = percent + "%";
        currentSong.currentTime = ((currentSong.duration) * percent) / 100
    })

    

    
    // Add an event listener for hamburger
    document.querySelector(".hamburgercontainer").addEventListener("click", ()=>{
        document.querySelector(".left").style.left = "0"
    })

    //Add an event lisetener for close button
    document.querySelector(".close").addEventListener("click" , ()=>{
        document.querySelector(".left").style.left = "-100%"
    })

    // Add an event listener to previous
    previous.addEventListener("click", () => {
        currentSong.pause()
        console.log("Previous clicked")
        let index = songs.indexOf(currentSong.src.split("/").slice(-1)[0])
        if ((index - 1) >= 0) {
            playMusic(songs[index - 1])
        }
    })

    // Add an event listener to next
    next.addEventListener("click", () => {
        currentSong.pause()
        console.log("Next clicked")

        let index = songs.indexOf(currentSong.src.split("/").slice(-1)[0])
        if ((index + 1) < songs.length) {
            playMusic(songs[index + 1])
        }
    })

    // Add an event to volume
    document.querySelector(".range").getElementsByTagName("input")[0].addEventListener("change", (e) => {
        console.log("Setting volume to", e.target.value, "/ 100")
        currentSong.volume = parseInt(e.target.value) / 100
       
    })

     // Add event listener to mute the track
     document.querySelector(".volume>img").addEventListener("click", e=>{ 
        if(e.target.src.includes("volume.svg")){
            e.target.src = e.target.src.replace("volume.svg", "mute.svg")
            currentSong.volume = 0;
            document.querySelector(".range").getElementsByTagName("input")[0].value = 0;
        }
        else{
            e.target.src = e.target.src.replace("mute.svg", "volume.svg")
            currentSong.volume = .10;
            document.querySelector(".range").getElementsByTagName("input")[0].value = 10;
        }

    })


} 

main()