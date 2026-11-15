/* All American's Tire & Auto Repair — interactions */
(function () {
  "use strict";

  /* footer year */
  var yearEl = document.getElementById("year");
  if (yearEl) yearEl.textContent = String(new Date().getFullYear());

  /* sticky header shadow */
  var head = document.querySelector(".site-head");
  var onScroll = function () {
    if (head) head.classList.toggle("scrolled", window.scrollY > 10);
  };
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  /* mobile nav */
  var toggle = document.querySelector(".nav-toggle");
  var nav = document.getElementById("main-nav");
  if (toggle && nav) {
    toggle.addEventListener("click", function () {
      var open = nav.classList.toggle("open");
      toggle.setAttribute("aria-expanded", open ? "true" : "false");
      toggle.textContent = open ? "Close" : "Menu";
    });
    nav.addEventListener("click", function (e) {
      if (e.target.tagName === "A") {
        nav.classList.remove("open");
        toggle.setAttribute("aria-expanded", "false");
        toggle.textContent = "Menu";
      }
    });
  }

  /* scroll reveal */
  var revealEls = document.querySelectorAll(".reveal");
  if ("IntersectionObserver" in window) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add("in");
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: "0px 0px -40px 0px" });
    revealEls.forEach(function (el) { io.observe(el); });
  } else {
    revealEls.forEach(function (el) { el.classList.add("in"); });
  }

  /* gallery lightbox */
  var gallery = document.getElementById("gallery-grid");
  var lightbox = document.getElementById("lightbox");
  var lbImg = lightbox ? lightbox.querySelector("img") : null;
  var lbCap = lightbox ? lightbox.querySelector(".lb-cap") : null;
  var figures = gallery ? Array.prototype.slice.call(gallery.querySelectorAll("figure")) : [];
  var current = -1;
  var lastFocus = null;

  function openLb(index) {
    if (!lightbox || !figures.length) return;
    lastFocus = document.activeElement;
    current = index;
    var fig = figures[index];
    var img = fig.querySelector("img");
    lbImg.src = img.src;
    lbImg.alt = img.alt;
    var cap = fig.getAttribute("data-cap") || "";
    var cred = fig.querySelector(".cred");
    lbCap.textContent = cred ? cap + " — " + cred.textContent : cap;
    lightbox.classList.add("open");
    document.body.style.overflow = "hidden";
    lightbox.querySelector(".lb-close").focus();
  }
  function closeLb() {
    if (!lightbox) return;
    lightbox.classList.remove("open");
    document.body.style.overflow = "";
    lbImg.src = "";
    if (lastFocus) lastFocus.focus();
  }
  function stepLb(delta) {
    if (current < 0) return;
    openLb((current + delta + figures.length) % figures.length);
  }

  if (gallery && lightbox) {
    figures.forEach(function (fig, i) {
      fig.addEventListener("click", function () { openLb(i); });
      fig.setAttribute("tabindex", "0");
      fig.setAttribute("role", "button");
      fig.setAttribute("aria-label", "Open photo: " + (fig.getAttribute("data-cap") || ""));
      fig.addEventListener("keydown", function (e) {
        if (e.key === "Enter" || e.key === " ") { e.preventDefault(); openLb(i); }
      });
    });
    lightbox.querySelector(".lb-close").addEventListener("click", closeLb);
    lightbox.querySelector(".lb-prev").addEventListener("click", function () { stepLb(-1); });
    lightbox.querySelector(".lb-next").addEventListener("click", function () { stepLb(1); });
    lightbox.addEventListener("click", function (e) {
      if (e.target === lightbox) closeLb();
    });
    document.addEventListener("keydown", function (e) {
      if (!lightbox.classList.contains("open")) return;
      if (e.key === "Escape") closeLb();
      if (e.key === "ArrowLeft") stepLb(-1);
      if (e.key === "ArrowRight") stepLb(1);
    });
  }
})();
