function waitForElement(els, func, timeout = 100) {
  const queries = els.map((el) => document.querySelector(el));
  if (queries.every((a) => a)) {
    func(queries);
  } else if (timeout > 0) {
    setTimeout(waitForElement, 300, els, func, --timeout);
  }
}

function random(min, max) {
  // min inclusive max exclusive
  return Math.random() * (max - min) + min;
}


waitForElement(['.Root__top-container'], ([topContainer]) => {
  const r = document.documentElement;
  const rs = window.getComputedStyle(r);

  const backgroundContainer = document.createElement('div');
  backgroundContainer.className = 'moonbloom-bg-container';
  topContainer.appendChild(backgroundContainer);

  // to position stars and shooting stars between the background and everything else
  const rootElement = document.querySelector('.Root__top-container');
  rootElement.style.zIndex = '0';

  // create the stars
  const canvasSize =
    backgroundContainer.clientWidth * backgroundContainer.clientHeight;
  const starsFraction = canvasSize / 4000;
  for (let i = 0; i < starsFraction; i++) {
    const size = Math.random() < 0.5 ? 1 : 2;

    const star = document.createElement('div');
    star.style.position = 'absolute';
    star.style.left = `${random(0, 99)}%`;
    star.style.top = `${random(0, 99)}%`;
    star.style.opacity = random(0.5, 1);
    star.style.width = `${size}px`;
    star.style.height = `${size}px`;
    star.style.backgroundColor = rs.getPropertyValue('--spice-star');
    star.style.zIndex = '-1';
    star.style.borderRadius = '50%';

    if (Math.random() < 1 / 5) {
      star.style.setProperty("animation", `twinkle${Math.floor(Math.random() * 4) + 1} 5s infinite`, "important");
    }

    backgroundContainer.appendChild(star);
  }

  const DEFAULT_WALLPAPER =
    "https://i.pinimg.com/originals/ee/9b/4b/ee9b4b981d036cadb84c548f5b4a61e5.jpg";

  const COLOR_GROUPS = [

    {
      title: "General",
      colors: [
        ["Main", "main"],
        ["Main Elevated", "main-elevated"],
        ["Card", "card"],
        ["Player", "player"]
      ]
    },

    {
      title: "Sidebar",
      colors: [
        ["Sidebar", "sidebar"],
        ["Sidebar Alt", "sidebar-alt"]
      ]
    },

    {
      title: "Buttons",
      colors: [
        ["Button", "button"],
        ["Button Active", "button-active"],
        ["Button Disabled", "button-disabled"]
      ]
    },

    {
      title: "Text",
      colors: [
        ["Text", "text"],
        ["Subtext", "subtext"]
      ]
    },

    {
      title: "Effects",
      colors: [
        ["Highlight", "highlight"],
        ["Highlight Elevated", "highlight-elevated"],
        ["Shadow", "shadow"],
        ["Selected Row", "selected-row"],
        ["Misc", "misc"]
      ]
    },

    {
      title: "Notifications",
      colors: [
        ["Notification", "notification"],
        ["Notification Error", "notification-error"]
      ]
    },

    {
      title: "Stars",
      colors: [
        ["Star", "star"],
        ["Star Glow", "star-glow"],
        ["Shooting Star", "shooting-star"],
        ["Shooting Star Glow", "shooting-star-glow"]
      ]
    },

    {
      title: "Topbar",
      colors: [
        ["Top Bar", "sn-topbar"],
      ]
    }

  ];

  const Moonbloom = {

    storageKey: "moonbloom-settings",

    settings: {

      wallpaper: "",

      topBarColor: "#081623",
      topBarOverlay: "rgba(0,0,0,0.55)",

      colors: {

        star: "#FFFFFF",
        "star-glow": "#FFFFFF",

        "shooting-star": "#FFFFFF",
        "shooting-star-glow": "#FFFFFF",

        main: "#000000",
        "main-elevated": "#e093bdcb",

        card: "#e093bdcb",

        sidebar: "#efbde0",
        "sidebar-alt": "#e086bb",

        text: "#FFFFFF",
        subtext: "#ad628f",

        button: "#eda6d2",
        "button-active": "#eda6d2",
        "button-disabled": "#000000",

        highlight: "#fab9d6",
        "highlight-elevated": "#fab9d6",

        shadow: "#000000",

        "selected-row": "#FFFFFF",

        misc: "#7F7F7F",

        notification: "#4687D6",
        "notification-error": "#E22134",

        "tab-active": "#333333",

        player: "#181818",

        "sn-topbar": "#da94b5",

      }

    },

    wallpaper: {

      load() {

        const saved = localStorage.getItem(Moonbloom.storageKey);

        if (!saved) return;

        try {

          Object.assign(
            Moonbloom.settings,
            JSON.parse(saved)
          );

        } catch (error) {

          console.error(
            "Failed to load Moonbloom settings.",
            error
          );

        }

      },

      save() {

        localStorage.setItem(
          Moonbloom.storageKey,
          JSON.stringify(Moonbloom.settings)
        );

      },


      apply() {

        const wallpaper =
          Moonbloom.settings.wallpaper || DEFAULT_WALLPAPER;

        document.documentElement.style.setProperty(
          "--sn-wallpaper",
          `url("${wallpaper}")`
        );

        document.documentElement.style.setProperty(
          "--sn-topbar-color",
          Moonbloom.settings.colors["sn-topbar"]
        );

      },


      set(url) {

        Moonbloom.settings.wallpaper = url;

        this.save();

        this.apply();

      },

      clear() {

        Moonbloom.settings.wallpaper = "";

        this.save();

        this.apply();

      }

    },

    colors: {

      load() {

        const saved = localStorage.getItem(Moonbloom.storageKey);

        if (!saved) return;

        try {

          const data = JSON.parse(saved);

          if (data.colors) {
            Object.assign(
              Moonbloom.settings.colors,
              data.colors
            );
          }

        } catch (error) {

          console.error(
            "Failed to load Moonbloom colors.",
            error
          );

        }

      },

      save() {

        localStorage.setItem(
          Moonbloom.storageKey,
          JSON.stringify(Moonbloom.settings)
        );

      },

      apply() {

        Object.entries(
          Moonbloom.settings.colors
        ).forEach(([key, value]) => {

          document.documentElement.style.setProperty(
            `--spice-${key}`,
            value
          );

        });

      },

      set(key, value) {

        Moonbloom.settings.colors[key] = value;

        this.save();

        this.apply();

      }

    },

    ui: {

      createTopbarButton() {

        if (!Spicetify?.Topbar) {
          setTimeout(() => this.createTopbarButton(), 500);
          return;
        }

        if (this.button) return;

        this.button = new Spicetify.Topbar.Button(
          "Moonbloom",
          "settings",
          () => this.openSettings()
        );

      },

      createColorRow(label, key) {

        const row = document.createElement("div");
        row.className = "sn-color-row";

        const title = document.createElement("span");
        title.className = "sn-color-label";
        title.textContent = label;

        const controls = document.createElement("div");
        controls.className = "sn-color-controls";

        const hex = document.createElement("input");
        hex.type = "text";
        hex.className = "sn-color-hex";
        hex.maxLength = 7;
        hex.value = Moonbloom.settings.colors[key];

        const picker = document.createElement("input");
        picker.type = "color";
        picker.className = "sn-color-picker";
        picker.value = Moonbloom.settings.colors[key];

        picker.oninput = () => {

          hex.value = picker.value;

          Moonbloom.colors.set(
            key,
            picker.value
          );

        };

        hex.onchange = () => {

          let value = hex.value.trim();

          if (!value.startsWith("#")) {
            value = "#" + value;
          }

          if (/^#[0-9A-Fa-f]{6}$/.test(value)) {

            picker.value = value;

            Moonbloom.colors.set(
              key,
              value
            );

            hex.value = value.toUpperCase();

          } else {

            hex.value =
              Moonbloom.settings.colors[key];

          }

        };

        controls.append(
          hex,
          picker
        );

        row.append(
          title,
          controls
        );

        return row;

      },

      openSettings() {

        const content = document.createElement("div");
        content.id = "sn-settings";

        const tabs = document.createElement("div");
        tabs.id = "sn-tabs";

        const pages = document.createElement("div");
        pages.id = "sn-pages";

        const wallpaperPage = document.createElement("div");
        wallpaperPage.className = "sn-page active";

        const colorsPage = document.createElement("div");
        colorsPage.className = "sn-page";

        const effectsPage = document.createElement("div");
        effectsPage.className = "sn-page";

        const placeholder = document.createElement("div");
        placeholder.className = "sn-empty-page";
        placeholder.textContent = "Effects coming soon.";

        effectsPage.append(placeholder);

        content.append(
          tabs,
          pages
        );

        pages.append(
          wallpaperPage,
          colorsPage,
          effectsPage
        );

        const wallpaperTab = document.createElement("button");
        wallpaperTab.textContent = "Wallpaper";

        const colorsTab = document.createElement("button");
        colorsTab.textContent = "Colors";

        const effectsTab = document.createElement("button");
        effectsTab.textContent = "Effects";

        wallpaperTab.className = "sn-tab active";
        colorsTab.className = "sn-tab";
        effectsTab.className = "sn-tab";

        tabs.append(
          wallpaperTab,
          colorsTab,
          effectsTab
        );

        wallpaperTab.onclick = () =>
          switchTab(
            wallpaperTab,
            wallpaperPage
          );

        colorsTab.onclick = () =>
          switchTab(
            colorsTab,
            colorsPage
          );

        effectsTab.onclick = () =>
          switchTab(
            effectsTab,
            effectsPage
          );

        function switchTab(tab, page) {

          // Turn off tabs
          tabs.querySelectorAll(".sn-tab").forEach(t =>
            t.classList.remove("active")
          );

          // Hide pages
          pages.querySelectorAll(".sn-page").forEach(p =>
            p.classList.remove("active")
          );

          // Activate new tab 
          tab.classList.add("active");
          page.classList.add("active");
        }



        // Preview

        const preview = document.createElement("div");
        preview.id = "home-select";

        const img = document.createElement("img");
        img.id = "sn-preview";

        img.src =
          Moonbloom.settings.wallpaper ||
          "https://i.pinimg.com/originals/ee/9b/4b/ee9b4b981d036cadb84c548f5b4a61e5.jpg";

        preview.append(img);

        // Label

        const label = document.createElement("label");
        label.className = "sn-label";
        label.textContent = "Wallpaper URL";

        // Input

        const input = document.createElement("input");
        input.id = "src-input";

        input.placeholder = "https://example.com/image.jpg";
        input.value = Moonbloom.settings.wallpaper ?? "";

        input.oninput = () => {
          img.src =
            input.value ||
            "https://i.pinimg.com/originals/ee/9b/4b/ee9b4b981d036cadb84c548f5b4a61e5.jpg";
        };

        // Buttons

        const footer = document.createElement("div");
        footer.id = "home-save";

        const reset = document.createElement("button");
        reset.className = "sn-secondary";
        reset.textContent = "Reset";

        reset.onclick = () => {

          Moonbloom.wallpaper.clear();

          input.value = "";

          img.src =
            "https://i.pinimg.com/originals/ee/9b/4b/ee9b4b981d036cadb84c548f5b4a61e5.jpg";

        };

        const apply = document.createElement("button");
        apply.className = "sn-primary";
        apply.textContent = "Apply";

        apply.onclick = () => {

          Moonbloom.wallpaper.set(input.value.trim());

        };

        footer.append(reset, apply);

        wallpaperPage.append(
          preview,
          label,
          input,
          footer
        );


        COLOR_GROUPS.forEach(group => {

          const title = document.createElement("h3");

          title.className = "sn-section-title";

          title.textContent = group.title;

          colorsPage.append(title);

          group.colors.forEach(([label, key]) => {

            colorsPage.append(
              this.createColorRow(label, key)
            );

          });

        });

        Spicetify.PopupModal.display({
          title: "Moonbloom Settings",
          content
        });

        switchTab(
          wallpaperTab,
          wallpaperPage
        );

      }
    },
  };

  // handles resizing of playbar panel to match right sidebar below it
  const playbar = document.querySelector('.Root__now-playing-bar');
  waitForElement(['.Root__right-sidebar'], ([rightbar]) => {
    const resizeObserver = new ResizeObserver((entries) => {
      for (const entry of entries) {
        if (entry.target === rightbar) {
          let newWidth = entry.contentRect.width;
          if (newWidth === 0) {
            const localStorageWidth = localStorage.getItem(
              '223ni6f2epqcidhx5etjafeai:panel-width-saved'
            );
            if (localStorageWidth) {
              newWidth = localStorageWidth;
            } else {
              newWidth = 420;
            }
          }
          playbar.style.width = `${newWidth}px`;
          break;
        }
      }
    });

    resizeObserver.observe(rightbar);
  });

  waitForElement(['[data-encore-id="buttonPrimary"]'], ([targetElement]) => {
    // start or stop spinning animation based on whether something is playing
    const playObserver = new MutationObserver((mutationsList) => {
      for (const mutation of mutationsList) {
        if (
          mutation.type === 'attributes' &&
          mutation.attributeName === 'aria-label'
        ) {
          updateDiscAnimation();
        }
      }
    });

    const playConfig = { attributes: true, attributeFilter: ['aria-label'] };
    playObserver.observe(targetElement, playConfig);
  });

  function updateDiscAnimation() {

    const img = document.querySelector(
      ".main-nowPlayingWidget-coverArt .cover-art img"
    );

    const playButton = document.querySelector(
      '[data-encore-id="buttonPrimary"]'
    );

    if (!img || !playButton) return;

    const shouldSpin =
      playButton.getAttribute("aria-label") === "Pause";

    img.classList.toggle(
      "running-animation",
      shouldSpin
    );

  }

  for (let i = 0; i < 4; i++) {
    const shootingstar = document.createElement('span');
    shootingstar.className = 'shootingstar';
    if (Math.random() < 0.75) {
      shootingstar.style.top = '-4px'; // hidden off screen when animation is delayed
      shootingstar.style.right = `${random(0, 90)}%`;
    } else {
      shootingstar.style.top = `${random(0, 50)}%`;
      shootingstar.style.right = '-4px'; // hidden when animation is delayed
    }

    const shootingStarGlowColor = `rgba(${rs.getPropertyValue(
      '--spice-rgb-shooting-star-glow'
    )},${0.1})`;
    shootingstar.style.boxShadow = `0 0 0 4px ${shootingStarGlowColor}, 0 0 0 8px ${shootingStarGlowColor}, 0 0 20px ${shootingStarGlowColor}`;

    shootingstar.style.animationDuration = `${Math.floor(Math.random() * 3) + 3
      }s`;
    shootingstar.style.animationDelay = `${Math.floor(Math.random() * 7)}s`;

    backgroundContainer.appendChild(shootingstar);

    shootingstar.addEventListener('animationend', () => {
      if (Math.random() < 0.75) {
        shootingstar.style.top = '-4px'; // hidden off screen when animation is delayed
        shootingstar.style.right = `${random(0, 90)}%`;
      } else {
        shootingstar.style.top = `${random(0, 50)}%`;
        shootingstar.style.right = '-4px'; // hidden when animation is delayed
      }

      shootingstar.style.animation = 'none'; // Remove animation

      void shootingstar.offsetWidth;

      shootingstar.style.animation = '';
      shootingstar.style.setProperty("animation-duration", `${Math.floor(Math.random() * 4) + 3}s`, "important");
    });
  }

  Moonbloom.wallpaper.load();
  Moonbloom.colors.load();

  Moonbloom.wallpaper.apply();
  Moonbloom.colors.apply();

  Moonbloom.ui.createTopbarButton();

  // Keep disc animation alive if Spotify replaces the DOM.
  setInterval(updateDiscAnimation, 1000);

  // ========================================
  // Move Canvas above album artwork
  // ========================================

  function moveCanvas() {

    const portal = document.getElementById(
      "VideoPlayerNpb_ReactPortal"
    );

    const left = document.querySelector(
      ".main-nowPlayingBar-left"
    );

    if (!portal || !left) return;

    if (left.firstElementChild !== portal) {
      left.prepend(portal);
    }

  }

  moveCanvas();

  const canvasObserver = new MutationObserver(() => {

    moveCanvas();

  });

  canvasObserver.observe(document.body, {

    childList: true,
    subtree: true

  });
});

