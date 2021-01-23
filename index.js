// jsClock
const clockContainer = document.querySelector(".js-clock"),
    clockTitle = clockContainer.querySelector("h1");

function getTime(){
const date = new Date;
const minutes = date.getMinutes();
const hours = date.getHours();
const seconds = date.getSeconds();
clockTitle.innerText = `${hours < 10 ? `0${hours}` : hours}:${minutes < 10 ? `0${minutes}` : minutes}:${seconds < 10 ? `0${seconds}` : seconds}`;
}

const form = document.querySelector(".js-form"),
input = form.querySelector("input"),
greeting = document.querySelector(".js-greeting");

const USER_LS= "currentUser",
    SHOWING_CN= "showing"

function saveName(name){
    localStorage.setItem(USER_LS, name);
}

function handdleSubmit(event){
    event.preventDefault();
    const currentValue = input.value ;
    console.log(currentValue);
    paintGreeting(currentValue);
    saveName(currentValue);
}

function askForName(){
    form.classList.add(SHOWING_CN);
    form.addEventListener("submit",handdleSubmit)
}

function paintGreeting(text){
    form.classList.remove(SHOWING_CN);
    greeting.classList.add(SHOWING_CN);
    greeting.innerText = `hello ${text}`;
}

function loadName(){
    const currentUser = localStorage.getItem(USER_LS);
    if(currentUser === null){
        askForName();
    }else{
        paintGreeting(currentUser);
    }
}

//toDoList


const toDoform = document.querySelector(".js-toDoForm"),
    toDoInput =  toDoform.querySelector("input"),
    toDoList = document.querySelector(".js-toDoList");

const TODOS_LS = "toDos";
let toDos = [] ;



function deleteDoTo(event){
    console.dir(event.target.parentNode);
    const btn = event.target;
    const li = btn.parentNode;
    toDoList.removeChild(li);
    const cleanToDos = toDos.filter(function(toDo){
        console.log(toDo.id, li.id);
        return toDo.id !== parseInt(li.id);
    });
    console.log(cleanToDos);
    toDos = cleanToDos;
    saveToDos();
}



function saveToDos(){
    localStorage.setItem(TODOS_LS, JSON.stringify(toDos));
}


function loadToDos(){
    const loadedToDos = localStorage.getItem(TODOS_LS);
    if( loadedToDos !== null){
        const parsedToDos = JSON.parse(loadedToDos);
        parsedToDos.forEach(function(toDo){
            paintToDo(toDo.text);
        });
    }
}

function paintToDo(text){
    const li = document.createElement("li");
    const delBtn = document.createElement("button");
    delBtn.innerText = "❌";
    delBtn.addEventListener("click",deleteDoTo);
    const span = document.createElement("span");
    const newId = toDos.length + 1
    span.innerText = text;
    li.appendChild(span);
    li.appendChild(delBtn);
    li.id = newId;
    toDoList.appendChild(li);
    const toDosObj = {
        text: text,
        id: newId        
    };
    toDos.push(toDosObj);
}

function handleToDoSubmit(event){
    event.preventDefault();
    const currentToDoValue = toDoInput.value ;
    paintToDo(currentToDoValue);
    saveToDos()
    toDoInput.value = "";
}


//randomImage


const body = document.querySelector("body");
const IMG_NUMBER = 3;

function handleImgLoad(){
    console.log("finished Loading");
}

function paintImage(imgNumber){
    const imgNum = imgNumber + 1 ;
    const image = new Image();
    const srcOne = "https://static.vecteezy.com/system/resources/thumbnails/000/246/312/original/mountain-lake-sunset-landscape-first-person-view.jpg";
    const srcTwo = "https://iso.500px.com/wp-content/uploads/2014/07/big-one.jpg"
    const srcThr = "https://hips.hearstapps.com/hmg-prod.s3.amazonaws.com/images/hbx060116masterclass01-1550601705.jpg"
    
    if(imgNum === 1){        
        image.src = srcOne;
    }else if(imgNum === 2){        
        image.src = srcTwo;
    }else if(imgNum === 3){        
        image.src = srcThr;
    }
    // img.src = `/images/${imgNum + 1}.jpg`;
    image.classList.add("bgImage")  
    body.appendChild(image);
    image.addEventListener("loadend",handleImgLoad)
}

function genRandom(){
    const number = Math.floor(Math.random() * IMG_NUMBER);
    // number = 0 , 1 , 2 
    return number
}



// weather

const COORDS = "coords";
const API_KEY = "572e9a0e2b90b4e06d18b4fe43ad02e4";
const weather = document.querySelector(".js-weather");


function getWeather(lat, lon){    
    fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`
    ).then(function(response){
        return response.json()
    }).then(function(json){
        const temperature = json.main.temp;
        const place = json.name;
        const humid = json.main.humidity;        
        weather.innerText = `습도 : ${humid}%  온도 : ${temperature}°C @ ${place}`
    })
}


function saveCoords(coordsObj){
    localStorage.setItem(COORDS, JSON.stringify(coordsObj));
}

function handleGeoSuccess(position){
    const latitude = position.coords.latitude;
    const longitude = position.coords.longitude;
    const coordsObj = {
        latitude,
        longitude
    };
    saveCoords(coordsObj);
    getWeather(latitude,longitude);
}

function handleGeoError(){
    console.log("can't access geo location")
}

function askForCoords(){
    navigator.geolocation.getCurrentPosition(handleGeoSuccess, handleGeoError)
}

function loadCoords(){
    const leadedcoords = localStorage.getItem(COORDS);
    if(leadedcoords === null){
        askForCoords();
    } else {
        const parseCoords = JSON.parse(leadedcoords);        
        getWeather(parseCoords.latitude, parseCoords.longitude);
    }
}



function init(){
    getTime();
    loadName();
    setInterval(getTime, 1000);

    loadToDos();  
    toDoform.addEventListener("submit" , handleToDoSubmit)

    const randomNum = genRandom();
    paintImage(randomNum);
    loadCoords();
};

init()