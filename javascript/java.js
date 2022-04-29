//all required tags or elements

const wrapper = document.querySelector(".wrapper"),
musicImg = wrapper.querySelector(".background img"),
musicName = wrapper.querySelector(".song-details .name"),
musicArtist = wrapper.querySelector(".song-details .artist"),
mainAudio = wrapper.querySelector("#main-audio"),
playPauseBtn = wrapper.querySelector(".play-pause"),
prevBtn = wrapper.querySelector("#prev"),
nextBtn = wrapper.querySelector("#next"),
repeatBtn = wrapper.querySelector("#repeat"),
progress = wrapper.querySelector(".progress"),
progressBar = wrapper.querySelector(".progress-bar"),
musicList = wrapper.querySelector(".music-list");
showMoreBtn = wrapper.querySelector("#more-music"),
hideMusicBtn = musicList.querySelector("#close");

//======================change the music and its information
let musicIndex = 2;

window.addEventListener("load", () => {
  loadMusic(musicIndex);
  playingNow();
})

// load music 
function loadMusic(indexNumb){
  musicName.innerText = allMusic[indexNumb - 1].name;
  musicArtist.innerText = allMusic[indexNumb - 1].artist;
  musicImg.src = `images/${allMusic[indexNumb - 1].img}.jpg`;
  mainAudio.src = `music/${allMusic[indexNumb - 1].src}.mp3`
}
//==================change the music and its information FINALIZED

//===========functionality to the start/next song/previous song button 

//play music
function playMusic(){
  wrapper.classList.add("paused");
  playPauseBtn.querySelector("i").innerText = "pause";
  mainAudio.play();
}

//pause music
function pauseMusic(){
  wrapper.classList.remove("paused");
  playPauseBtn.querySelector("i").innerText = "play_arrow";
  mainAudio.pause();
}

//btn play-pause music
playPauseBtn.addEventListener("click", () => {
  const isMusicPaused = wrapper.classList.contains("paused");
  isMusicPaused ? pauseMusic() : playMusic();
});

//next music
function nextMusic(){
  musicIndex++;
  musicIndex > allMusic.length ? musicIndex = 1 : musicIndex = musicIndex; //loop musical
  loadMusic(musicIndex);
  playMusic();
}
//next btn
nextBtn.addEventListener("click", () => {
  nextMusic(); 
});

//prev music
function prevMusic(){
  musicIndex--;
  musicIndex < 1 ? musicIndex = allMusic.length : musicIndex = musicIndex; //loop music reverse
  loadMusic(musicIndex);
  playMusic();
}

//prev btn
prevBtn.addEventListener("click", () => {
  prevMusic(); 
});

//repeat btn
repeatBtn.addEventListener("click", () => {
  //we get the innertext of the icon then we´ll change according
  let getText = repeatBtn.innerText;//getting innertext of icon
  //different changes on different icon click using switch
  switch(getText){
    case "repeat": //if this icon repeat
     repeatBtn.innerText = "repeat_one";
     repeatBtn.setAttribute("title", "song looped")
    break;
    case "repeat_one": //if this icon repeat
     repeatBtn.innerText = "shuffle"
     repeatBtn.setAttribute("title", "playback shuffle")
    break;
    case "shuffle": //if this icon repeat
     repeatBtn.innerText = "repeat"
     repeatBtn.setAttribute("title", "playlist looped")
    break;
  }
});
//we  change the icon, now what to do after the song ended
mainAudio.addEventListener("ended", () => {
  let getText = repeatBtn.innerText;

  switch(getText){
    case "repeat": //if this icon repeat
     nextMusic();
    break;
    case "repeat_one": //if this icon repeat
     mainAudio.currentTime = 0;
     loadMusic(musicIndex);
     playMusic();
    break;
    case "shuffle": //if this icon repeat
     let randIndex = Math.floor((Math.random() * allMusic.length) + 1);
     do{
       randIndex = Math.floor((Math.random() * allMusic.length) + 1);
     }while(musicIndex == randIndex);
     musicIndex = randIndex; 
     loadMusic(musicIndex)
     playMusic();
    break;
  }
})
//==================functionality to the start/next song/previous song button. FINALIZED

//==========================functionality for progress bar
mainAudio.addEventListener("timeupdate", (e) => {
  const currentTime = e.target.currentTime;//start of music time count
  const duration = e.target.duration;//song duration
  let progressWidth = (currentTime / duration) * 100;
  progressBar.style.width = `${progressWidth}%`;

  let musicCurrentTime = wrapper.querySelector(".current"),
  musicDuration = wrapper.querySelector(".duration");

  mainAudio.addEventListener("loadeddata", () => {
    //upadate song total duration
    let audioDuration = mainAudio.duration;
    let totalMin = Math.floor(audioDuration / 60);
    let totalSec = Math.floor(audioDuration % 60);
    if(totalSec < 10){
      totalSec = `0${totalSec}`
    }
    musicDuration.innerText = `${totalMin}:${totalSec}`; 
  });
  //upadate playing song current time
  let currentMin = Math.floor(currentTime / 60);
  let currentSec = Math.floor(currentTime % 60);
  if(currentSec < 10){
    currentSec = `0${currentSec}`
  }
  musicCurrentTime.innerText = `${currentMin}:${currentSec}`;
});

//let´s update playing song current time according to the progress bar width=====
progress.addEventListener("click", (e) => {
  let progressWidthVal = progress.clientWidth;//getting width of progress bar
  let clickedOffSetX = e.offsetX; //getting offset x value
  let songDuration = mainAudio.duration;//getting song total duration

  mainAudio.currentTime = (clickedOffSetX / progressWidthVal) * songDuration;
  playMusic();
});
//================functionality for progress bar FINALIZED

//=========================functions music-list
//open music-list
showMoreBtn.addEventListener("click", () => {
  musicList.classList.toggle("show");
})

//close music-list
hideMusicBtn.addEventListener("click", () => {
  showMoreBtn.click();
})

//organization for list
const ulTag = wrapper.querySelector("ul");

for (let i = 0; i < allMusic.length; i++) {
  let liTag = `<li li-index="${i + 1}">
                <div class="row">
                  <span>${allMusic[i].name}</span>
                  <p>${allMusic[i].artist}</p>
                </div>
                <audio class"${allMusic[i].src}" src="music/${allMusic[i].src}.mp3"></audio>
                <span id="${allMusic[i].src}" class="audio-duration"></span>
               </li>`
  ulTag.insertAdjacentHTML("beforeend", liTag);
}
//=========================functions music-list FINALIZED

//===========================selected song for list
const allLiTags = ulTag.querySelectorAll("li");
function playingNow(){
  for(let j = 0; j < allLiTags.length; j++) {

    if(allLiTags[j].classList.contains("playing")){
      allLiTags[j].classList.remove("playing");
    }

    if(allLiTags[j].getAttribute("li-index") == musicIndex ) {
      allLiTags[j].classList.add("playing")
    }
  
    allLiTags[j].setAttribute("onclick", "clicked(this)");
  }
}

function clicked(element){
  let getLiIndex = element.getAttribute("li-index");
  musicIndex = getLiIndex;
  loadMusic(musicIndex);
  playMusic();
  playingNow();
}
//===========================selected song for list FINALIZED