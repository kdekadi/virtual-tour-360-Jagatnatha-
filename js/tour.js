let viewer;
let isAutoRotating = false;
let isMuted = false;
let hasStartedBackgroundAudio = false;

const landingPage = document.getElementById("landingPage");
const tourContainer = document.getElementById("tourContainer");
const sceneMenu = document.getElementById("sceneMenu");
const sceneListContainer = document.getElementById("sceneListContainer");
const currentSceneName = document.getElementById("currentSceneName");
const backgroundAudio = document.getElementById("backgroundAudio");
const infoPointsPanel = document.getElementById("infoPointsPanel");

// Modals
const infoModal = document.getElementById("infoModal");
const imageLightbox = document.getElementById("imageLightbox");
const infoTitle = document.getElementById("infoTitle");
const infoDescription = document.getElementById("infoDescription");
const infoImage = document.getElementById("infoImage");
const lightboxImage = document.getElementById("lightboxImage");

// Buttons
const btnStartTour = document.getElementById("btnStartTour");
const btnHome = document.getElementById("btnHome");
const btnMap = document.getElementById("btnMap");
const btnCloseMap = document.getElementById("btnCloseMap");
const btnSound = document.getElementById("btnSound");
const btnAutoRotate = document.getElementById("btnAutoRotate");
const btnZoomIn = document.getElementById("btnZoomIn");
const btnZoomOut = document.getElementById("btnZoomOut");
const btnFullscreen = document.getElementById("btnFullscreen");
const btnCloseInfo = document.getElementById("btnCloseInfo");
const btnCloseLightbox = document.getElementById("btnCloseLightbox");

// Init background audio
function playAudio() {
    if(!isMuted && backgroundAudio) {
        backgroundAudio.volume = 0.4;
        const promise = backgroundAudio.play();
        if(promise !== undefined) {
            promise.catch(err => console.log("Autoplay prevented"));
        }
        hasStartedBackgroundAudio = true;
    }
}

function stopAudio() {
    if(backgroundAudio) {
        backgroundAudio.pause();
        backgroundAudio.currentTime = 0;
        hasStartedBackgroundAudio = false;
    }
}

// Map Menu
function toggleMap() {
    sceneMenu.classList.toggle("is-open");
}

function buildMapMenu() {
    sceneListContainer.innerHTML = '';
    sceneList.forEach(scene => {
        const btn = document.createElement("button");
        btn.className = "scene-btn";
        btn.textContent = scene.title;
        btn.onclick = () => {
            if(viewer) viewer.loadScene(scene.id);
            sceneMenu.classList.remove("is-open");
        };
        sceneListContainer.appendChild(btn);
    });
}

function updateActiveMapBtn(sceneId) {
    const btns = sceneListContainer.querySelectorAll(".scene-btn");
    btns.forEach(btn => btn.classList.remove("active"));
    
    const activeScene = sceneList.find(s => s.id === sceneId);
    if(activeScene) {
        currentSceneName.textContent = activeScene.title;
        const index = sceneList.indexOf(activeScene);
        if(btns[index]) btns[index].classList.add("active");
    }
}

// Info Panel
window.showInfoPanel = function(info) {
    infoTitle.textContent = info.title;
    infoDescription.textContent = info.description;
    if(info.image) {
        infoImage.src = info.image;
        infoImage.style.display = "block";
    } else {
        infoImage.style.display = "none";
        infoImage.src = "";
    }
    infoModal.classList.add("is-active");
}

btnCloseInfo.onclick = () => infoModal.classList.remove("is-active");
infoModal.onclick = (e) => { if(e.target === infoModal) infoModal.classList.remove("is-active"); }

infoImage.onclick = () => {
    if(infoImage.src) {
        lightboxImage.src = infoImage.src;
        imageLightbox.classList.add("is-active");
    }
}

btnCloseLightbox.onclick = () => imageLightbox.classList.remove("is-active");
imageLightbox.onclick = (e) => { if(e.target === imageLightbox) imageLightbox.classList.remove("is-active"); }


// Controls
btnMap.onclick = toggleMap;
btnCloseMap.onclick = () => sceneMenu.classList.remove("is-open");

btnSound.onclick = () => {
    isMuted = !isMuted;
    if(isMuted) {
        btnSound.classList.remove("active");
        if(backgroundAudio) backgroundAudio.pause();
    } else {
        btnSound.classList.add("active");
        if(hasStartedBackgroundAudio) {
            backgroundAudio.play();
        } else {
            playAudio();
        }
    }
}

btnAutoRotate.onclick = () => {
    if(!viewer) return;
    isAutoRotating = !isAutoRotating;
    if(isAutoRotating) {
        viewer.startAutoRotate(-3);
        btnAutoRotate.classList.add("active");
    } else {
        viewer.stopAutoRotate();
        btnAutoRotate.classList.remove("active");
    }
}

btnZoomIn.onclick = () => {
    if(viewer) viewer.setHfov(viewer.getHfov() - 15);
}

btnZoomOut.onclick = () => {
    if(viewer) viewer.setHfov(viewer.getHfov() + 15);
}

btnFullscreen.onclick = () => {
    if (!document.fullscreenElement) {
        tourContainer.requestFullscreen?.();
    } else {
        document.exitFullscreen?.();
    }
}

// Flow
btnStartTour.onclick = () => {
    landingPage.style.display = "none";
    tourContainer.style.display = "block";
    
    // Show loading overlay temporarily
    const loadingScreen = document.getElementById("loadingScreen");
    loadingScreen.style.visibility = "visible";
    loadingScreen.style.opacity = "1";
    
    buildMapMenu();
    
    setTimeout(() => {
        viewer = pannellum.viewer('panorama', {
            default: {
                firstScene: "panorama1",
                sceneFadeDuration: 1000,
                hfov: 90
            },
            autoLoad: true,
            showControls: false,
            scenes: scenes
        });
        
        viewer.on("scenechange", (sceneId) => {
            updateActiveMapBtn(sceneId);
            if (isAutoRotating) {
                setTimeout(() => viewer.startAutoRotate(-3), 1000);
            }
        });
        
        viewer.on("mousedown", () => {
            if (isAutoRotating) {
                isAutoRotating = false;
                viewer.stopAutoRotate();
                btnAutoRotate.classList.remove("active");
            }
        });

        // Hide loading
        loadingScreen.style.opacity = "0";
        setTimeout(() => loadingScreen.style.visibility = "hidden", 500);
        
        updateActiveMapBtn("panorama1");
        playAudio();
    }, 500);
}

btnHome.onclick = () => {
    if(viewer) {
        viewer.destroy();
        viewer = null;
    }
    stopAudio();
    sceneMenu.classList.remove("is-open");
    tourContainer.style.display = "none";
    landingPage.style.display = "flex";
}

// Initial Loading Screen fadeout
window.onload = () => {
    const loadingScreen = document.getElementById("loadingScreen");
    loadingScreen.style.opacity = "0";
    setTimeout(() => loadingScreen.style.visibility = "hidden", 500);
}
