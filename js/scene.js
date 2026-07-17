function createHotspot(hotSpotDiv, args) {
    hotSpotDiv.classList.add("tour-hotspot");

    const arrow = document.createElement("div");
    arrow.className = "tour-hotspot-arrow";
    // Ikon panah ala Google Maps (Double Chevron Tebal)
    arrow.innerHTML = `
        <svg width="80" height="80" viewBox="0 0 100 100">
            <!-- Chevron Atas (Solid) -->
            <path d="M 50 15 L 100 45 L 85 60 L 50 38 L 15 60 L 0 45 Z" fill="rgba(255, 255, 255, 1)"/>
            <!-- Chevron Bawah (Transparan) -->
            <path d="M 50 48 L 100 78 L 85 93 L 50 71 L 15 93 L 0 78 Z" fill="rgba(255, 255, 255, 0.4)"/>
        </svg>
    `;

    const label = document.createElement("span");
    label.className = "tour-hotspot-label";
    label.textContent = args.label;

    hotSpotDiv.appendChild(arrow);
    hotSpotDiv.appendChild(label);

    const stopViewerDrag = (event) => {
        event.stopPropagation();
    };

    hotSpotDiv.addEventListener("pointerdown", stopViewerDrag);
    hotSpotDiv.addEventListener("mousedown", stopViewerDrag);
    hotSpotDiv.addEventListener("touchstart", stopViewerDrag);
}

function createInfoHotspot(hotSpotDiv, args) {
    hotSpotDiv.classList.add("info-hotspot");
    hotSpotDiv.title = args.label;
    hotSpotDiv.setAttribute("role", "button");
    hotSpotDiv.setAttribute("aria-label", args.label);
    hotSpotDiv.tabIndex = 0;

    const icon = document.createElement("span");
    icon.className = "info-hotspot-icon";
    icon.textContent = "i";

    hotSpotDiv.appendChild(icon);

    const stopViewerDrag = (event) => {
        event.stopPropagation();
    };

    const openInfo = (event) => {
        event.stopPropagation();
        event.preventDefault();
        if (typeof showInfoPanel === "function") {
            showInfoPanel(args.info);
        }
    };

    hotSpotDiv.addEventListener("pointerdown", stopViewerDrag);
    hotSpotDiv.addEventListener("mousedown", stopViewerDrag);
    hotSpotDiv.addEventListener("touchstart", stopViewerDrag);
    hotSpotDiv.addEventListener("click", openInfo);
    hotSpotDiv.addEventListener("keydown", (event) => {
        if (event.key === "Enter" || event.key === " ") {
            openInfo(event);
        }
    });
}

const sceneList = [
    {
        id: "panorama1",
        title: "Area Pintu Masuk Pura",
        panorama: "panoramas_optimized/panorama1.jpg"
    },
    {
        id: "panorama2",
        title: "Jaba Tengah",
        panorama: "panoramas_optimized/panorama2.jpg"
    },
    {
        id: "panorama3",
        title: "Jaba Tengah",
        panorama: "panoramas_optimized/panorama3.jpg"
    },
    {
        id: "panorama4",
        title: "Area Bale Daje dan Pesamuan",
        panorama: "panoramas_optimized/panorama4.jpg"
    },
    {
        id: "panorama5",
        title: "Area Pura 1",
        panorama: "panoramas_optimized/panorama5.jpg"
    },
    {
        id: "panorama6",
        title: "Area Pura 2",
        panorama: "panoramas_optimized/panorama6.jpg"
    },
    {
        id: "panorama7",
        title: "Area Pura 3",
        panorama: "panoramas_optimized/panorama7.jpg"
    },
    {
        id: "panorama8",
        title: "Area Bale Gong",
        panorama: "panoramas_optimized/panorama8.jpg"
    },
    {
        id: "panorama9",
        title: "Area Bale Pawedan",
        panorama: "panoramas_optimized/panorama9.jpg"
    },
    {
        id: "panorama10",
        title: "Area Pandmasana",
        panorama: "panoramas_optimized/panorama10.jpg"
    },
    {
        id: "panorama11",
        title: "Area Pura 4",
        panorama: "panoramas_optimized/panorama11.jpg"
    },
    {
        id: "panorama12",
        title: "Area Pelinggih Taksu",
        panorama: "panoramas_optimized/panorama12.jpg"
    },
    {
        id: "panorama13",
        title: "Area Belakang Padmasana",
        panorama: "panoramas_optimized/panorama13.jpg"
    }
];

const hotspotPositions = {
    panorama1: {
        next: { yaw: 0.65, pitch: -25 }
    },
    panorama2: {
        previous: { yaw: -179.69, pitch: -20 },
        next: { yaw: -0.47, pitch: -20 }
    },
    panorama3: {
        previous: { yaw: -0.25, pitch: -20 },
        next: { yaw: 178.82, pitch: -20 }
    },
    panorama4: {
        previous: { yaw: 2.87, pitch: -12.18 },
        next: { yaw: -179.15, pitch: -12.42 }
    },
    panorama5: {
        previous: { yaw: 6.01, pitch: -12.67 },
        next: { yaw: -88.28, pitch: -12.35 }
    },
    panorama6: {
        previous: { yaw: 81.56, pitch: -12.32 },
        next: { yaw: -49.72, pitch: -12.99 }
    },
    panorama7: {
        previous: { yaw: 102.42, pitch: -12.25 },
        next: { yaw: 0, pitch: -12.44 }
    },
    panorama8: {
        previous: { yaw: -84.54, pitch: -12.33 }
    },
    panorama9: {
        next: { yaw: -0.93, pitch: -12.57 }
    },
    panorama10: {
        previous: { yaw: 179.20, pitch: -12.35 },
        next: { yaw: -88.11, pitch: -12.08 }
    },
    panorama11: {
        previous: { yaw: 96.79, pitch: -12.42 },
        next: { yaw: 0.95, pitch: -12.25 }
    },
    panorama12: {
        previous: { yaw: 178.15, pitch: -12.02 },
        next: { yaw: -2.56, pitch: -12.23 }
    },
    panorama13: {
        previous: { yaw: 0, pitch: -5 }
    }
};

// Hotspot tambahan untuk berpindah ke panorama yang tidak berurutan.
// `next` dan `previous` di atas tetap dibuat otomatis seperti biasa.
const additionalSceneHotspots = {
    panorama7: [
        {
            sceneId: "panorama9",
            yaw: -179.97,
            pitch: -12.44
        }
    ],
    panorama9: [
        {
            sceneId: "panorama7",
            yaw: 176.68,
            pitch: -12.14
        }
    ]
};

const infoHotspots = {
    panorama1: [
        {
            pitch: 9.73,
            yaw: -46.71,
            label: "Info Toilet",
            title: "Toilet",
            // image: "",
            description: "Toilet adalah fasilitas umum yang tersedia untuk pengunjung pura. Area ini dapat digunakan sebelum atau sesudah mengikuti kegiatan persembahyangan dan kunjungan."
        }
    ],
    panorama2: [
        {
            pitch: 8,
            yaw: 120,
            label: "Info Bale Kulkul",
            title: "Bale Kulkul",
            image: "panoramas_optimized/balekulkul.jpg",
            description: "Bale Kulkul adalah bangunan tempat menggantung kulkul atau kentongan tradisional Bali. Di lingkungan pura, kulkul digunakan sebagai sarana komunikasi untuk memberi tanda kepada masyarakat atau pemedek saat ada kegiatan keagamaan dan upacara."
        }
    ],
    panorama4: [
        {
            pitch: -7.43,
            yaw: 78.12,
            label: "Info Bale Daje",
            title: "Bale Daje",
            image: "panoramas_optimized/baledaje.jpg",
            description: "Bale Daje adalah bangunan bale yang berada pada sisi utara area pura. Bale ini digunakan sebagai tempat pendukung kegiatan keagamaan, seperti persiapan upacara dan tempat berkumpul saat pelaksanaan persembahyangan."
        },
        {
            pitch: 2,
            yaw: -89,
            label: "Info Bale Pesamuan",
            title: "Bale Pesamuan",
            image: "panoramas_optimized/balepesamuan.jpg",
            description: "Bale Pesamuan merupakan bale yang berfungsi sebagai tempat pertemuan atau berkumpulnya pengurus pura, pemangku, dan masyarakat. Tempat ini digunakan untuk mendukung koordinasi kegiatan adat dan keagamaan di lingkungan pura."
        }
    ],
    panorama8: [
        {
            pitch: 8,
            yaw: 30,
            label: "Info Bale Gong",
            title: "Bale Gong",
            image: "panoramas_optimized/balegong.jpg",
            description: "Bale Gong adalah bangunan tempat meletakkan dan memainkan gamelan Bali. Dalam kegiatan upacara, gamelan berfungsi mengiringi prosesi keagamaan dan menciptakan suasana sakral di area pura."
        }
    ],
    panorama9: [
        {
            pitch: 13.88,
            yaw: -27.74,
            label: "Info Bale Pawedan",
            title: "Bale Pawedan",
            image: "panoramas_optimized/balepawedan.jpg",
            description: "Bale Pawedan adalah tempat yang digunakan oleh sulinggih atau pemangku saat memimpin rangkaian upacara. Bale ini menjadi area penting dalam pelaksanaan persembahyangan dan pemujaan di pura."
        }
    ],
    panorama10: [
        {
            pitch: 17.5,
            yaw: 2.5,
            label: "Info Padmasana",
            title: "Padmasana",
            image: "panoramas_optimized/padmasana.jpg",
            description: "Padmasana adalah bangunan suci utama sebagai tempat pemujaan Ida Sang Hyang Widhi Wasa. Bentuknya yang menjulang melambangkan kemuliaan dan menjadi salah satu titik utama dalam area persembahyangan pura."
        }
    ],
    panorama12: [
        {
            pitch: 10.23,
            yaw: 36.62,
            label: "Info Pelinggih Taksu",
            title: "Pelinggih Taksu",
            image: "panoramas_optimized/pelinggih_taksu.jpg",
            description: "Pelinggih Taksu adalah bangunan suci yang berkaitan dengan pemujaan kekuatan spiritual atau taksu. Dalam kepercayaan Hindu Bali, taksu dimaknai sebagai daya suci yang memberi kewibawaan, kemampuan, dan kekuatan batin."
        },
        {
            pitch: 25,
            yaw: -10,
            label: "Info Pohon Beringin",
            title: "Pohon Beringin",
            // image: "panoramas_optimized/pohonberingin.jpg",
            description: "Pohon Beringin di area pura menjadi peneduh sekaligus bagian dari suasana sakral lingkungan pura. Keberadaannya sering dikaitkan dengan keseimbangan alam, keteduhan, dan keharmonisan ruang suci."
        }
    ]
};

function buildHotspot(position, targetScene, label) {
    const direction = position.direction || getHotspotDirection(position.yaw);
    const rotation = Number.isFinite(position.rotation)
        ? position.rotation
        : getHotspotRotation(direction);

    return {
        pitch: position.pitch,
        yaw: position.yaw,
        type: "scene",
        text: label,
        sceneId: targetScene.id,
        cssClass: "tour-hotspot-wrapper",
        createTooltipFunc: createHotspot,
        createTooltipArgs: {
            label: label,
            direction: direction,
            rotation: rotation
        }
    };
}

function getHotspotDirection(yaw) {
    return "forward";
}

function getHotspotRotation(direction) {
    return -90; // Selalu menghadap ke atas (depan)
}

function buildInfoHotspot(info) {
    return {
        pitch: info.pitch,
        yaw: info.yaw,
        type: "info",
        text: info.label,
        cssClass: "info-hotspot-wrapper",
        createTooltipFunc: createInfoHotspot,
        createTooltipArgs: {
            label: info.label,
            info: info
        }
    };
}

const scenes = sceneList.reduce((sceneConfig, scene, index) => {
    const hotSpots = [];
    const positions = hotspotPositions[scene.id];
    const previousScene = sceneList[index - 1];
    const nextScene = sceneList[index + 1];

    if (previousScene && positions.previous) {
        hotSpots.push(
            buildHotspot(
                positions.previous,
                previousScene,
                `Ke ${previousScene.title}`
            )
        );
    }

    if (nextScene && positions.next) {
        hotSpots.push(
            buildHotspot(
                positions.next,
                nextScene,
                `Ke ${nextScene.title}`
            )
        );
    }

    if (additionalSceneHotspots[scene.id]) {
        additionalSceneHotspots[scene.id].forEach((hotspot) => {
            const targetScene = sceneList.find((item) => item.id === hotspot.sceneId);

            if (targetScene) {
                hotSpots.push(
                    buildHotspot(hotspot, targetScene, `Ke ${targetScene.title}`)
                );
            }
        });
    }

    if (infoHotspots[scene.id]) {
        infoHotspots[scene.id].forEach((info) => {
            hotSpots.push(buildInfoHotspot(info));
        });
    }

    sceneConfig[scene.id] = {
        title: scene.title,
        type: "equirectangular",
        panorama: scene.panorama,
        hotSpots: hotSpots
    };

    return sceneConfig;
}, {});
