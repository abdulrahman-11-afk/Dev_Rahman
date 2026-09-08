/* =========================================================
   ABDULRAHMAN PORTFOLIO — INTERACTIONS
   ========================================================= */

document.addEventListener("DOMContentLoaded", () => {
    /* ---------- Cursor spotlight ---------- */
    const cursorGlow = document.querySelector(".cursor-glow");

    if (cursorGlow && window.matchMedia("(pointer: fine)").matches) {
        let rafId = null;
        let mouseX = 0;
        let mouseY = 0;

        document.addEventListener("mousemove", (event) => {
            mouseX = event.clientX;
            mouseY = event.clientY;

            if (!rafId) {
                rafId = requestAnimationFrame(() => {
                    cursorGlow.style.left = `${mouseX}px`;
                    cursorGlow.style.top = `${mouseY}px`;
                    cursorGlow.style.opacity = "1";
                    rafId = null;
                });
            }
        });

        document.addEventListener("mouseleave", () => {
            cursorGlow.style.opacity = "0";
        });
    }

    /* ---------- 3D cards ---------- */
    const cards = document.querySelectorAll(".info-card, .skill-card, .website-card");

    cards.forEach((card) => {
        card.addEventListener("mousemove", (event) => {
            if (!window.matchMedia("(pointer: fine)").matches) return;

            const rect = card.getBoundingClientRect();
            const x = event.clientX - rect.left;
            const y = event.clientY - rect.top;

            const rotateX = ((y - rect.height / 2) / (rect.height / 2)) * -4.5;
            const rotateY = ((x - rect.width / 2) / (rect.width / 2)) * 4.5;

            card.style.setProperty("--mouse-x", `${x}px`);
            card.style.setProperty("--mouse-y", `${y}px`);
            card.style.transform =
                `perspective(900px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.015, 1.015, 1.015)`;
        });

        card.addEventListener("mouseleave", () => {
            card.style.transform = "";
        });
    });

    /* ---------- Magnetic buttons ---------- */
    const magneticElements = document.querySelectorAll(".magnetic");

    magneticElements.forEach((element) => {
        element.addEventListener("mousemove", (event) => {
            if (!window.matchMedia("(pointer: fine)").matches) return;

            const rect = element.getBoundingClientRect();
            const x = event.clientX - rect.left - rect.width / 2;
            const y = event.clientY - rect.top - rect.height / 2;
            const strength = 0.18;

            element.style.transform =
                `translate(${x * strength}px, ${y * strength}px)`;
        });

        element.addEventListener("mouseleave", () => {
            element.style.transform = "";
        });
    });

    /* ---------- Scroll reveal ---------- */
    const revealElements = document.querySelectorAll(".reveal, .reveal-card");

    if ("IntersectionObserver" in window) {
        const revealObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach((entry) => {
                if (!entry.isIntersecting) return;

                entry.target.classList.add("show");
                observer.unobserve(entry.target);
            });
        }, {
            threshold: 0.12,
            rootMargin: "0px 0px -30px 0px"
        });

        revealElements.forEach((element, index) => {
            if (element.classList.contains("reveal-card")) {
                element.style.transitionDelay = `${Math.min(index % 4, 3) * 80}ms`;
            }

            revealObserver.observe(element);
        });
    } else {
        revealElements.forEach((element) => element.classList.add("show"));
    }

    /* ---------- Terminal typing ---------- */
    const terminalOutput = document.getElementById("terminal-output");
    const terminal = document.querySelector(".terminal");

    const terminalLines = [
        { command: "whoami", output: ["abdulrahman"] },
        {
            command: "cat skills.txt",
            output: ["html & css", "javascript", "react", "next.js"]
        },
        { command: "status", output: ["ONLINE ●"] }
    ];

    let terminalStarted = false;

    const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

    async function typeCommand(commandLine, command) {
        for (const character of command) {
            commandLine.append(document.createTextNode(character));
            await sleep(35);
        }
    }

    async function runTerminal() {
        if (terminalStarted || !terminalOutput) return;
        terminalStarted = true;

        for (const line of terminalLines) {
            const commandLine = document.createElement("p");
            const prompt = document.createElement("span");

            prompt.className = "terminal-green";
            prompt.textContent = "$ ";

            commandLine.append(prompt);
            terminalOutput.append(commandLine);

            await typeCommand(commandLine, line.command);
            await sleep(250);

            line.output.forEach((text) => {
                const outputLine = document.createElement("p");
                outputLine.className = "terminal-line";
                outputLine.textContent = text;
                terminalOutput.append(outputLine);
            });

            await sleep(400);
        }
    }

    if (terminal && terminalOutput && "IntersectionObserver" in window) {
        const terminalObserver = new IntersectionObserver((entries, observer) => {
            if (entries[0].isIntersecting) {
                runTerminal();
                observer.disconnect();
            }
        }, { threshold: 0.3 });

        terminalObserver.observe(terminal);
    } else if (terminalOutput) {
        runTerminal();
    }

    /* ---------- Mobile menu ---------- */
    const menuBtn = document.querySelector(".menu-btn");
    const navLinks = document.querySelector(".nav-links");

    if (menuBtn && navLinks) {
        const closeMenu = () => {
            navLinks.classList.remove("active");
            menuBtn.setAttribute("aria-expanded", "false");
            menuBtn.setAttribute("aria-label", "Open navigation menu");
        };

        menuBtn.addEventListener("click", () => {
            const isOpen = navLinks.classList.toggle("active");

            menuBtn.setAttribute("aria-expanded", String(isOpen));
            menuBtn.setAttribute(
                "aria-label",
                isOpen ? "Close navigation menu" : "Open navigation menu"
            );
        });

        navLinks.querySelectorAll("a").forEach((link) => {
            link.addEventListener("click", closeMenu);
        });

        document.addEventListener("click", (event) => {
            if (
                navLinks.classList.contains("active") &&
                !navLinks.contains(event.target) &&
                !menuBtn.contains(event.target)
            ) {
                closeMenu();
            }
        });
    }

    /* ---------- Dynamic year ---------- */
    const year = document.getElementById("year");
    if (year) year.textContent = new Date().getFullYear();
});
