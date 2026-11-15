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

  /* entrance motion: elements are always visible; when one approaches the
     viewport it plays a short fade-up. Nothing is ever hidden by default,
     so the page renders complete even with scripts off or blocked. */
  var revealEls = Array.prototype.slice.call(document.querySelectorAll(".reveal"));
  if ("IntersectionObserver" in window && revealEls.length) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add("in");
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0, rootMargin: "0px 0px 220px 0px" });
    revealEls.forEach(function (el) { io.observe(el); });
  }

  /* gallery lightbox: click a photo to view it large; arrow keys move,
     Escape closes. */
  var gallery = document.getElementById("gallery-grid");
  var lightbox = document.getElementById("lightbox");
  if (gallery && lightbox) {
    var figs = Array.prototype.slice.call(gallery.querySelectorAll("figure"));
    var lbImg = lightbox.querySelector("img");
    var lbCap = lightbox.querySelector(".lb-cap");
    var current = 0;

    function show(i) {
      current = (i + figs.length) % figs.length;
      var fig = figs[current];
      var img = fig.querySelector("img");
      if (lbImg) {
        lbImg.src = img.getAttribute("src");
        lbImg.alt = img.getAttribute("alt") || "";
      }
      if (lbCap) lbCap.textContent = fig.getAttribute("data-cap") || "";
    }
    function openLb(i) {
      show(i);
      lightbox.classList.add("open");
      document.body.style.overflow = "hidden";
      var close = lightbox.querySelector(".lb-close");
      if (close) close.focus();
    }
    function closeLb() {
      lightbox.classList.remove("open");
      document.body.style.overflow = "";
    }
    function stepLb(d) { show(current + d); }

    figs.forEach(function (fig, i) {
      fig.setAttribute("tabindex", "0");
      fig.setAttribute("role", "button");
      fig.setAttribute("aria-label", "Open photo: " + (fig.getAttribute("data-cap") || ""));
      fig.addEventListener("click", function () { openLb(i); });
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
