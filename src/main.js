import "./styles.css";

const header = document.querySelector("[data-header]");
const menuButton = document.querySelector("[data-menu-button]");
const mobileMenu = document.querySelector("[data-mobile-menu]");

window.addEventListener("scroll", () => {
  header?.classList.toggle("is-scrolled", window.scrollY > 20);
}, { passive: true });

menuButton?.addEventListener("click", () => {
  const open = menuButton.getAttribute("aria-expanded") === "true";
  menuButton.setAttribute("aria-expanded", String(!open));
  mobileMenu?.classList.toggle("is-open", !open);
});

mobileMenu?.querySelectorAll("a").forEach((link) => {
  link.addEventListener("click", () => {
    menuButton?.setAttribute("aria-expanded", "false");
    mobileMenu.classList.remove("is-open");
  });
});

const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.classList.add("is-visible");
      observer.unobserve(entry.target);
    }
  });
}, { threshold: 0.14 });

document.querySelectorAll(".reveal").forEach((element) => observer.observe(element));

const filterButtons = document.querySelectorAll("[data-filter]");
const projectGrid = document.querySelector("[data-project-grid]");
const loadingState = document.querySelector("[data-loading-state]");

filterButtons.forEach((button) => {
  button.addEventListener("click", () => {
    const selected = button.dataset.filter;
    filterButtons.forEach((item) => item.classList.toggle("is-active", item === button));

    projectGrid.style.opacity = "0";
    window.setTimeout(() => {
      projectGrid.hidden = true;
      loadingState.hidden = false;
    }, 160);

    window.setTimeout(() => {
      document.querySelectorAll("[data-category]").forEach((project) => {
        const visible = selected === "all" || project.dataset.category === selected;
        project.classList.toggle("is-hidden", !visible);
      });
      loadingState.hidden = true;
      projectGrid.hidden = false;
      requestAnimationFrame(() => { projectGrid.style.opacity = "1"; });
    }, 620);
  });
});

const projectDialog = document.querySelector("[data-project-dialog]");
const dialogTitle = document.querySelector("[data-dialog-title]");

document.querySelectorAll("[data-project-open]").forEach((button) => {
  button.addEventListener("click", () => {
    dialogTitle.textContent = button.dataset.projectOpen;
    projectDialog.showModal();
  });
});

document.querySelectorAll("[data-dialog-close]").forEach((button) => {
  button.addEventListener("click", () => projectDialog.close());
});

document.querySelector("[data-dialog-contact]")?.addEventListener("click", () => projectDialog.close());

projectDialog?.addEventListener("click", (event) => {
  const rect = projectDialog.getBoundingClientRect();
  const outside = event.clientX < rect.left || event.clientX > rect.right || event.clientY < rect.top || event.clientY > rect.bottom;
  if (outside) projectDialog.close();
});

const form = document.querySelector("[data-contact-form]");
const errorBanner = document.querySelector("[data-error-banner]");
const errorCopy = document.querySelector("[data-error-copy]");
const connectionStatus = document.querySelector("[data-connection-status]");
const submitButton = form?.querySelector("button[type='submit']");
const toast = document.querySelector("[data-toast]");

function updateConnectionStatus() {
  const online = navigator.onLine;
  connectionStatus?.classList.toggle("is-offline", !online);
  if (connectionStatus) {
    connectionStatus.querySelector("span:nth-child(2)").textContent = online ? "Secure note line is ready" : "Your note is safe here for now";
    connectionStatus.querySelector("small").textContent = online ? "Connected" : "Offline";
  }
}

window.addEventListener("online", updateConnectionStatus);
window.addEventListener("offline", updateConnectionStatus);
updateConnectionStatus();

form?.querySelectorAll("input, select, textarea").forEach((field) => {
  field.addEventListener("input", () => field.classList.remove("is-invalid"));
  field.addEventListener("change", () => field.classList.remove("is-invalid"));
});

document.querySelector("[data-dismiss-error]")?.addEventListener("click", () => {
  errorBanner.hidden = true;
});

form?.addEventListener("submit", (event) => {
  event.preventDefault();
  errorBanner.hidden = true;

  const invalidFields = [...form.querySelectorAll("[required]")].filter((field) => !field.checkValidity());
  if (invalidFields.length) {
    invalidFields.forEach((field) => field.classList.add("is-invalid"));
    errorCopy.textContent = "A few details are still missing. Please check the highlighted fields.";
    errorBanner.hidden = false;
    invalidFields[0].focus();
    return;
  }

  if (!navigator.onLine) {
    errorCopy.textContent = "You appear to be offline. Copy your note somewhere safe and try again when you’re connected.";
    errorBanner.hidden = false;
    return;
  }

  submitButton.disabled = true;
  submitButton.classList.add("is-loading");

  window.setTimeout(() => {
    submitButton.disabled = false;
    submitButton.classList.remove("is-loading");
    form.reset();
    toast.classList.add("is-visible");
    window.setTimeout(() => toast.classList.remove("is-visible"), 5000);
  }, 1100);
});

document.querySelector("[data-year]").textContent = new Date().getFullYear();
