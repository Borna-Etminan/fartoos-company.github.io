/*  FARTOOS MAIN JAVASCRIPT  */
document.addEventListener("DOMContentLoaded", () => {


    /*  PAGE LOADER  */
    const loader =
        document.getElementById("pageLoader");
    window.addEventListener("load", () => {
        setTimeout(() => {
            if (loader) {
                loader.classList.add("loaded");
            }
        }, 450);
    });


    /*  CURRENT YEAR  */
    const currentYear =
        document.getElementById("currentYear");
    if (currentYear) {
        currentYear.textContent =
            new Date().getFullYear();
    }

   
    /*  THEME  */
    const themeToggle =
        document.getElementById("themeToggle");
    const themeIcon =
        document.querySelector(".theme-icon");
    function setTheme(theme) {
        if (theme === "dark") {
            document.documentElement.classList.add("dark");
            if (themeIcon) {
                themeIcon.textContent = "☾";
            }
            localStorage.setItem(
                "fartoos-theme",
                "dark"
            );
        } else {
            document.documentElement.classList.remove("dark");
            if (themeIcon) {
                themeIcon.textContent = "☼";
            }
            localStorage.setItem(
                "fartoos-theme",
                "light"
            );
        }
    }
    function initializeTheme() {
        const savedTheme =
            localStorage.getItem("fartoos-theme");
        if (savedTheme) {
            setTheme(savedTheme);
            return;
        }
        const prefersDark =
            window.matchMedia &&
            window.matchMedia(
                "(prefers-color-scheme: dark)"
            ).matches;
        setTheme(
            prefersDark
                ? "dark"
                : "light"
        );
    }
    initializeTheme();
    if (themeToggle) {
        themeToggle.addEventListener(
            "click",
            () => {
                const isDark =
                    document.documentElement
                        .classList.contains("dark");
                setTheme(
                    isDark
                        ? "light"
                        : "dark"
                );
            }
        );
    }

   
    /*  SMOOTH SCROLL  */
    const navLinks =
        document.querySelectorAll(
            '.nav-square[href^="#"]'
        );
    navLinks.forEach(link => {
        link.addEventListener(
            "click",
            event => {
                const targetId =
                    link.getAttribute("href");
                if (!targetId || targetId === "#") {
                    return;
                }
                const target =
                    document.querySelector(targetId);
                if (!target) {
                    return;
                }
                event.preventDefault();
                target.scrollIntoView({
                    behavior: "smooth",
                    block: "start"
                });
            }
        );
    });


    /*  ACTIVE NAVIGATION  */
    const sections =
        document.querySelectorAll(
            "main section[id]"
        );
    const sectionLinks =
        document.querySelectorAll(
            '.nav-square[href^="#"]'
        );
    const observer =
        new IntersectionObserver(
            entries => {
                entries.forEach(entry => {
                    if (!entry.isIntersecting) {
                        return;
                    }
                    const id =
                        entry.target.getAttribute("id");
                    sectionLinks.forEach(link => {
                        link.classList.remove(
                            "active"
                        );
                        if (
                            link.getAttribute("href") ===
                            `#${id}`
                        ) {
                            link.classList.add(
                                "active"
                            );
                        }
                    });
                });
            },
            {
                threshold: 0.25,
                rootMargin: "-15% 0px -55% 0px"
            }
        );
    sections.forEach(section => {
        observer.observe(section);
    });


    /*  SCROLL REVEAL  */
    const revealElements =
        document.querySelectorAll(
            ".section-heading, .about-card, .map-wrapper, .barrier-card, .product-image, .coming-soon-card, .contact-card"
        );
    revealElements.forEach(element => {
        element.classList.add("reveal");
    });
    const revealObserver =
        new IntersectionObserver(
            entries => {
                entries.forEach(entry => {
                    if (
                        entry.isIntersecting
                    ) {
                        entry.target.classList.add(
                            "visible"
                        );
                        revealObserver.unobserve(
                            entry.target
                        );
                    }
                });
            },
            {
                threshold: 0.08
            }
        );
    revealElements.forEach(element => {
        revealObserver.observe(element);
    });


    /*
       GALLERY IMAGE PREPARATION
       Later you can replace the placeholders with images.
    */
    const imageSlots =
        document.querySelectorAll(
            ".product-image"
        );
    imageSlots.forEach((slot, index) => {
        slot.dataset.imageNumber =
            String(index + 1).padStart(2, "0");
    });


    /*  KEYBOARD ACCESSIBILITY  */
    document.addEventListener(
        "keydown",
        event => {
            if (
                event.key === "Escape"
            ) {
                document.activeElement?.blur();
            }
        }
    );
});

/* FARTOOS INSTALLATION MAP */
document.addEventListener("DOMContentLoaded", () => {
    const mapElement = document.getElementById("installationMap");
    const loadingElement = document.getElementById("mapLoading");
    const errorElement = document.getElementById("mapError");

    if (!mapElement || typeof L === "undefined") {
        if (errorElement) {
            errorElement.hidden = false;
            errorElement.textContent =
                "نقشه بارگذاری نشد. اتصال اینترنت و فایل Leaflet را بررسی کنید.";
        }
        return;
    }

    const map = L.map("installationMap", {
        scrollWheelZoom: false,
        preferCanvas: true
    }).setView([32.0, 53.0], 5);

    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        maxZoom: 18,
        attribution:
            '&copy; <a href="https://www.openstreetmap.org/copyright" target="_blank" rel="noopener noreferrer">OpenStreetMap</a>'
    }).addTo(map);

    function escapeHTML(value) {
        return String(value ?? "").replace(/[&<>"']/g, character => ({
            "&": "&amp;",
            "<": "&lt;",
            ">": "&gt;",
            '"': "&quot;",
            "'": "&#39;"
        })[character]);
    }

    function getValue(item, persianKey, englishKey) {
        const isEnglish =
            document.body.dataset.language === "en";

        const preferred = isEnglish ? englishKey : persianKey;
        const fallback = isEnglish ? persianKey : englishKey;

        return item[preferred] ?? item[fallback] ?? "";
    }

    function createLocationInfo(item) {
        const isEnglish =
            document.body.dataset.language === "en";

        const name = getValue(
            item,
            "نام مکان به فارسی",
            "نام مکان به انگلیسی"
        ) || (isEnglish ? "Installation location" : "محل نصب");

        const province = getValue(
            item,
            "استان به فارسی",
            "Provice"
        );

        const city = getValue(
            item,
            "شهر به فارسی",
            "City"
        );

        const address = getValue(
            item,
            "آدرس به فارسی",
            "آدرس به انگلیسی"
        );

        const count = item["تعداد"];

        const labels = isEnglish
            ? {
                province: "Province",
                city: "City",
                address: "Address",
                count: "Barrier count"
            }
            : {
                province: "استان",
                city: "شهر",
                address: "آدرس",
                count: "تعداد راهبند"
            };

        let html = `
            <div class="map-popup-title">${escapeHTML(name)}</div>
        `;

        if (province) {
            html += `
                <div class="map-popup-row">
                    <span class="map-popup-label">${labels.province}:</span>
                    ${escapeHTML(province)}
                </div>
            `;
        }

        if (city) {
            html += `
                <div class="map-popup-row">
                    <span class="map-popup-label">${labels.city}:</span>
                    ${escapeHTML(city)}
                </div>
            `;
        }

        if (address) {
            html += `
                <div class="map-popup-row">
                    <span class="map-popup-label">${labels.address}:</span>
                    ${escapeHTML(address)}
                </div>
            `;
        }

        if (count !== undefined && count !== null && count !== "") {
            html += `
                <div class="map-popup-count">
                    ${labels.count}: ${escapeHTML(count)}
                </div>
            `;
        }

        return { name, html };
    }

    async function loadInstallationPoints() {
        try {
            const response = await fetch(
                "assets/data/barrier-data.json",
                { cache: "no-cache" }
            );

            if (!response.ok) {
                throw new Error(`HTTP ${response.status}`);
            }

            const data = await response.json();

            if (!Array.isArray(data)) {
                throw new Error("JSON root must be an array");
            }

            const validPoints = data.filter(item => {
                const lat = Number(item.lat);
                const lng = Number(item.lng);

                return (
                    item.lat !== null &&
                    item.lng !== null &&
                    item.lat !== "" &&
                    item.lng !== "" &&
                    Number.isFinite(lat) &&
                    Number.isFinite(lng) &&
                    lat >= 24 &&
                    lat <= 40 &&
                    lng >= 44 &&
                    lng <= 64
                );
            });

            const bounds = [];

            validPoints.forEach(item => {
                const lat = Number(item.lat);
                const lng = Number(item.lng);
                const info = createLocationInfo(item);

                const marker = L.circleMarker([lat, lng], {
                    radius: 7,
                    color: "#ffffff",
                    weight: 2,
                    opacity: 1,
                    fillColor: "#1b69ce",
                    fillOpacity: 0.95
                }).addTo(map);

                marker.bindTooltip(info.html, {
                    direction: "top",
                    sticky: true,
                    opacity: 0.98
                });

                marker.bindPopup(info.html, {
                    maxWidth: 320,
                    minWidth: 190
                });

                marker.on("mouseover", () => {
                    marker.setStyle({
                        radius: 10,
                        fillColor: "#41b8fa"
                    });
                });

                marker.on("mouseout", () => {
                    marker.setStyle({
                        radius: 7,
                        fillColor: "#1b69ce"
                    });
                });

                bounds.push([lat, lng]);
            });

            if (bounds.length > 0) {
                map.fitBounds(bounds, {
                    padding: [25, 25],
                    maxZoom: 7
                });
            }

            if (loadingElement) {
                loadingElement.remove();
            }

            requestAnimationFrame(() => map.invalidateSize());

            if (validPoints.length === 0) {
                throw new Error("No valid coordinates found in JSON");
            }

            console.info(
                `Fartoos map: ${validPoints.length} points displayed out of ${data.length} records.`
            );

        } catch (error) {
            console.error("Fartoos map loading error:", error);

            if (loadingElement) {
                loadingElement.remove();
            }

            if (errorElement) {
                errorElement.hidden = false;
                errorElement.textContent =
                    document.body.dataset.language === "en"
                        ? "The map data could not be loaded. Check the JSON file path and its format."
                        : "اطلاعات نقشه بارگذاری نشد. مسیر فایل JSON و ساختار آن را بررسی کنید.";
            }
        }
    }

    loadInstallationPoints();
});
