document.addEventListener("DOMContentLoaded", function () {
  // === Mobile Navigation Menu Toggle ===
  const navToggle =
    document.querySelector(".nav-toggle") ||
    document.getElementById("hamburger-menu");
  const navLinks = document.querySelector(".nav-links");

  if (navToggle && navLinks) {
    navToggle.addEventListener("click", function () {
      navLinks.classList.toggle("active");
      navToggle.classList.toggle("active");
    });

    // Close mobile menu when clicking on a link
    document.querySelectorAll(".nav-links li a").forEach((link) => {
      link.addEventListener("click", function () {
        navLinks.classList.remove("active");
        navToggle.classList.remove("active");
      });
    });
  }

  // === Initialize the Leaflet Map ===
  const mapContainer = document.getElementById("map");
  let map;
  if (mapContainer) {
    map = L.map("map").setView([-1.286389, 36.817223], 7);

    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution:
        '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    }).addTo(map);

    const waterSources = [
      {
        lat: -1.286389,
        lng: 36.817223,
        status: "safe",
        description: "Nairobi - Safe Water Source",
      },
      {
        lat: -0.091702,
        lng: 34.767956,
        status: "moderately safe",
        description: "Kisumu - Moderately Safe Water Source",
      },
      {
        lat: -3.386925,
        lng: 37.530125,
        status: "unsafe",
        description: "Arusha - Unsafe Water Source",
      },
      {
        lat: 0.514277,
        lng: 35.269779,
        status: "safe",
        description: "Eldoret - Safe Water Source",
      },
      {
        lat: -1.292066,
        lng: 36.821946,
        status: "moderately safe",
        description: "Nairobi (Westlands) - Moderately Safe Water Source",
      },
      {
        lat: -4.043477,
        lng: 39.668206,
        status: "safe",
        description: "Mombasa - Safe Water Source",
      },
      {
        lat: -0.425,
        lng: 36.951,
        status: "unsafe",
        description: "Nyeri - Unsafe Water Source",
      },
      {
        lat: -0.514277,
        lng: 37.269779,
        status: "moderately safe",
        description: "Meru - Moderately Safe Water Source",
      },
      {
        lat: -0.28333,
        lng: 36.06667,
        status: "safe",
        description: "Nakuru - Safe Water Source",
      },
      {
        lat: -1.356,
        lng: 36.677,
        status: "unsafe",
        description: "Machakos - Unsafe Water Source",
      },
      {
        lat: -0.716667,
        lng: 36.433333,
        status: "moderately safe",
        description: "Naivasha - Moderately Safe Water Source",
      },
      {
        lat: -1.2921,
        lng: 36.8219,
        status: "safe",
        description: "Karen (Nairobi) - Safe Water Source",
      },
    ];

    waterSources.forEach((source) => {
      let color =
        source.status === "safe"
          ? "blue"
          : source.status === "moderately safe"
          ? "lightblue"
          : "red";

      L.circleMarker([source.lat, source.lng], {
        color: color,
        fillColor: color,
        radius: 8,
        fillOpacity: 0.8,
      })
        .bindPopup(
          `<b>${source.description}</b><br>Status: ${
            source.status.charAt(0).toUpperCase() + source.status.slice(1)
          }`
        )
        .addTo(map);
    });

    window.addEventListener("resize", function () {
      map.invalidateSize();
    });
  }

  // === Testimonial Slider with Autoplay ===
  const testimonialSlider = document.querySelector(".testimonial-slider");
  if (testimonialSlider) {
    const slides = testimonialSlider.querySelectorAll(".testimonial-slide");
    const prevButton = testimonialSlider.querySelector(".prev-testimonial");
    const nextButton = testimonialSlider.querySelector(".next-testimonial");
    const indicators = testimonialSlider.querySelectorAll(".indicator");
    let currentIndex = 0;
    let autoplayInterval;

    function showSlide(index) {
      slides.forEach((slide, i) => {
        slide.classList.toggle("active", i === index);
        if (i === index) {
          slide.style.opacity = 0;
          setTimeout(() => {
            slide.style.opacity = 1;
          }, 10);
        }
      });
      indicators.forEach((ind, i) => {
        ind.classList.toggle("active", i === index);
      });
    }

    function nextSlide() {
      currentIndex = (currentIndex + 1) % slides.length;
      showSlide(currentIndex);
    }

    function prevSlide() {
      currentIndex = (currentIndex - 1 + slides.length) % slides.length;
      showSlide(currentIndex);
    }

    function startAutoplay() {
      stopAutoplay();
      autoplayInterval = setInterval(nextSlide, 5000);
    }

    function stopAutoplay() {
      if (autoplayInterval) clearInterval(autoplayInterval);
    }

    indicators.forEach((indicator, index) => {
      indicator.addEventListener("click", () => {
        currentIndex = index;
        showSlide(currentIndex);
        startAutoplay();
      });
    });

    nextButton.addEventListener("click", () => {
      nextSlide();
      startAutoplay();
    });
    prevButton.addEventListener("click", () => {
      prevSlide();
      startAutoplay();
    });

    testimonialSlider.addEventListener("mouseenter", stopAutoplay);
    testimonialSlider.addEventListener("mouseleave", startAutoplay);

    // Touch swipe support
    let touchStartX = 0,
      touchEndX = 0;
    testimonialSlider.addEventListener(
      "touchstart",
      (e) => {
        touchStartX = e.changedTouches[0].screenX;
      },
      false
    );
    testimonialSlider.addEventListener(
      "touchend",
      (e) => {
        touchEndX = e.changedTouches[0].screenX;
        if (touchEndX < touchStartX - 50) {
          nextSlide();
          startAutoplay();
        } else if (touchEndX > touchStartX + 50) {
          prevSlide();
          startAutoplay();
        }
      },
      false
    );

    showSlide(currentIndex);
    startAutoplay();
  }

  // === Content Toggle Functions ===
  function showRestrictedContent() {
    const publicContent = document.getElementById("public-content");
    const restrictedContent = document.getElementById("restricted-content");
    if (publicContent) publicContent.classList.add("hide");
    if (restrictedContent) {
      restrictedContent.classList.remove("hide");
      restrictedContent.style.display = "block";
      restrictedContent.setAttribute("data-signed-in", "true");
      if (typeof map !== "undefined" && map) {
        setTimeout(() => {
          map.invalidateSize();
        }, 300);
      }
    }
  }
  function showPublicContent() {
    const publicContent = document.getElementById("public-content");
    const restrictedContent = document.getElementById("restricted-content");
    if (publicContent) publicContent.classList.remove("hide");
    if (restrictedContent) {
      restrictedContent.classList.add("hide");
      restrictedContent.style.display = "none";
      restrictedContent.setAttribute("data-signed-in", "false");
    }
  }

  // === Form Validation with Better UX ===
  const forms = document.querySelectorAll("form");
  forms.forEach((form) => {
    form.addEventListener("submit", function (event) {
      let isValid = true;
      const requiredFields = this.querySelectorAll("[required]");
      form.querySelectorAll(".error-message").forEach((m) => m.remove());
      requiredFields.forEach((field) => {
        if (!field.value.trim()) {
          isValid = false;
          addErrorMessage(field, `Please fill out this field`);
          field.classList.add("error");
          event.preventDefault();
        } else {
          field.classList.remove("error");
        }
      });
      const emailField = this.querySelector('input[type="email"][required]');
      if (emailField && !isValidEmail(emailField.value.trim())) {
        isValid = false;
        addErrorMessage(emailField, "Please enter a valid email address");
        emailField.classList.add("error");
        event.preventDefault();
      }
      const password = this.querySelector("#password");
      const confirmPass = this.querySelector("#confirm-password");
      if (password && confirmPass && password.value !== confirmPass.value) {
        isValid = false;
        addErrorMessage(confirmPass, "Passwords do not match");
        confirmPass.classList.add("error");
        event.preventDefault();
      }
    });
    const requiredFields = form.querySelectorAll("[required]");
    requiredFields.forEach((field) => {
      field.addEventListener("blur", function () {
        validateField(field);
      });
      field.addEventListener("input", function () {
        field.classList.remove("error");
        const errorMessage = field.nextElementSibling;
        if (errorMessage && errorMessage.classList.contains("error-message")) {
          errorMessage.remove();
        }
      });
    });
  });

  function validateField(field) {
    const nextElem = field.nextElementSibling;
    if (nextElem && nextElem.classList.contains("error-message"))
      nextElem.remove();
    if (!field.value.trim()) {
      field.classList.add("error");
      addErrorMessage(field, `Please fill out this field`);
      return false;
    } else if (field.type === "email" && !isValidEmail(field.value.trim())) {
      field.classList.add("error");
      addErrorMessage(field, "Please enter a valid email address");
      return false;
    } else {
      field.classList.remove("error");
      return true;
    }
  }
  function addErrorMessage(field, message) {
    const errorMessage = document.createElement("div");
    errorMessage.className = "error-message";
    errorMessage.textContent = message;
    field.parentNode.insertBefore(errorMessage, field.nextSibling);
  }
  function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  // === Auth Handlers ===
  const loginForm = document.getElementById("login-form");
  if (loginForm) {
    loginForm.addEventListener("submit", function (e) {
      e.preventDefault();
      showRestrictedContent();
      showNotification(
        "You are now signed in! Restricted content is now visible.",
        "success"
      );
    });
  }
  const registerForm = document.getElementById("register-form");
  if (registerForm) {
    registerForm.addEventListener("submit", function (e) {
      e.preventDefault();
      const password = this.querySelector("#password");
      const confirmPass = this.querySelector("#confirm-password");
      if (password.value !== confirmPass.value) {
        addErrorMessage(confirmPass, "Passwords do not match");
        confirmPass.classList.add("error");
        return;
      }
      showRestrictedContent();
      showNotification(
        "Registration successful! Welcome to Aqua Zuri.",
        "success"
      );
    });
  }
  function signOut() {
    showPublicContent();
    showNotification("You have been signed out.", "info");
  }
  function showNotification(message, type) {
    const notification = document.createElement("div");
    notification.className = `notification ${type}`;
    notification.textContent = message;
    document.body.appendChild(notification);
    setTimeout(() => {
      notification.classList.add("show");
    }, 10);
    setTimeout(() => {
      notification.classList.remove("show");
      setTimeout(() => {
        notification.remove();
      }, 500);
    }, 3000);
  }
  // Show/hide register form logic
  document.addEventListener("DOMContentLoaded", function () {
    const showRegisterBtn = document.getElementById("show-register-btn");
    const registerForm = document.getElementById("register-form");
    const loginForm = document.getElementById("login-form");
    const hideRegisterBtn = document.getElementById("hide-register-btn");

    if (showRegisterBtn && registerForm && loginForm) {
      showRegisterBtn.addEventListener("click", function () {
        registerForm.style.display = "block";
        loginForm.style.display = "none";
        showRegisterBtn.style.display = "none";
      });
    }
    if (hideRegisterBtn && registerForm && loginForm && showRegisterBtn) {
      hideRegisterBtn.addEventListener("click", function () {
        registerForm.style.display = "none";
        loginForm.style.display = "block";
        showRegisterBtn.style.display = "inline-block";
      });
    }
  });
  const toggleRegisterButton = document.getElementById("show-register-btn");

  toggleRegisterButton.addEventListener("click", function () {
    registerForm.style.display = "flex";
    loginForm.style.display = "none";
    toggleRegisterButton.style.display = "none";
  });

  const hideRegisterBtn = document.getElementById("hide-register-btn");
  hideRegisterBtn.addEventListener("click", function () {
    loginForm.style.display = "flex";
    registerForm.style.display = "none";
    hideRegisterBtn.style.display = "none";
  });

  // === Smooth Section Navigation ===
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener("click", function (e) {
      const targetId = this.getAttribute("href");
      const targetElement = document.querySelector(targetId);
      if (targetElement) {
        e.preventDefault();
        if (navLinks && navLinks.classList.contains("active")) {
          navLinks.classList.remove("active");
          if (navToggle) navToggle.classList.remove("active");
        }
        window.scrollTo({
          top: targetElement.offsetTop - 80,
          behavior: "smooth",
        });
      }
    });
  });
});

// function toggleRegister(){

// }

// function toggleSignIn(){

// }
