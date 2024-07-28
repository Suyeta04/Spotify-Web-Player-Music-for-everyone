console.log('Lets write JavaScript');
let currentSong = new Audio();
let songs;
let currFolder;

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

const playMusic= (track)=>{
    //let audio = new Audio("/songs/" + track)
    currentSong.src = "/songs/" + track
    currentSong.play()
    play.innerHTML=`<i class="fa-regular fa-circle-pause"></i>`
    //document.querySelector(".songinfo").innerHTML= track
    //document.querySelector(".songtime").innerHTML= "00:00 / 00:00"
     
}

async function main(){
    
    // Get the list of all the songs
    let songs= await getSongs()
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
             play.innerHTML=`<i class="fa-regular fa-circle-pause"></i>`
        }
        else{
            currentSong.pause()
         play.innerHTML=`<i class="fa-regular fa-circle-play"></i>`
        }
    })

    // Listen for timeupdate event
    currentSong.addEventListener("timeupdate", () => {
          //document.querySelector(".songtime").innerHTML = `${secondsToMinutesSeconds(currentSong.currentTime)} / ${secondsToMinutesSeconds(currentSong.duration)}`
        document.querySelector(".circle").style.left = (currentSong.currentTime / currentSong.duration) * 100 + "%";
    })
    
    // Add an event listener to seekbar
    document.querySelector(".seekbar").addEventListener("click", e => {
        let percent = (e.offsetX / e.target.getBoundingClientRect().width) * 100;
        document.querySelector(".circle").style.left = percent + "%";
        currentSong.currentTime = ((currentSong.duration) * percent) / 100
    })
} 

main()