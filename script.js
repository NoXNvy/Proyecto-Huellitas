// ========== CARGAR DATOS DESDE JSON ==========
let petsData = [];

// Cargar datos de mascotas desde JSON
fetch("pets-data.json")
  .then((response) => {
    if (!response.ok) throw new Error("Error cargando JSON");
    return response.json();
  })
  .then((data) => {
    petsData = data.pets;
    renderPets(); // Renderizar mascotas dinámicamente
  })
  .catch((error) => console.error("Error:", error));

// Función para renderizar mascotas dinámicamente desde JSON
function renderPets() {
  const petsGrid = document.getElementById("petsGrid");
  if (!petsGrid) return;

  petsGrid.innerHTML = ""; // Limpiar HTML anterior

  petsData.forEach((pet, index) => {
    const card = document.createElement("div");
    card.className = `pet-card ${pet.type}`;
    card.setAttribute("data-type", pet.type);
    card.style.animationDelay = `${index * 0.1}s`; // Retraso cascada

    card.innerHTML = `
                <img src="${pet.image}" alt="${pet.name}">
                <h3>${pet.name}</h3>
                <p class="pet-type">Mascota • ${pet.breed}</p>
                <p class="pet-age">${pet.age}</p>
                <p class="pet-description">${pet.description}</p>
                <button class="btn-small">Ver más</button>
            `;

    petsGrid.appendChild(card);
  });

  // Re-attached event listener después de renderizar
  attachPetGridDelegation();
}

// ========== CARRUSEL ==========
let currentSlide = 0;
const slides = document.querySelectorAll(".carousel-item");
const totalSlides = slides.length;

function showSlide(n) {
  if (n >= totalSlides) currentSlide = 0;
  if (n < 0) currentSlide = totalSlides - 1;

  const offset = -currentSlide * 100;
  document.getElementById(
    "carouselInner"
  ).style.transform = `translateX(${offset}%)`;
}

function nextSlide() {
  currentSlide++;
  showSlide(currentSlide);
}

function prevSlide() {
  currentSlide--;
  showSlide(currentSlide);
}

// Auto-advance carousel
setInterval(nextSlide, 5000);

function showSection(sectionId) {
  // Ocultar todas las secciones con clase .section
  const sections = document.querySelectorAll(".section");
  sections.forEach((section) => section.classList.remove("active"));

  // Mostrar la sección solicitada (si existe)
  const targetSection = document.getElementById(sectionId);
  if (targetSection) {
    targetSection.classList.add("active");
    window.scrollTo(0, 0);
  } else {
    // Si no existe sección con .section, buscar el elemento por ID y hacer scroll
    const targetElement = document.getElementById(sectionId);
    if (targetElement) {
      targetElement.scrollIntoView({ behavior: "smooth" });
    }
  }
}

// Manejar hash de URL al cargar y cuando cambia
function handleHashNavigation() {
  const hash = window.location.hash.substring(1); // Quitar el #
  if (hash) {
    showSection(hash);
  } else {
    // Si no hay hash, mostrar la primera sección .section (excepto si es la index)
    const sections = document.querySelectorAll(".section");
    if (sections.length > 1) {
      sections.forEach((s) => s.classList.remove("active"));
      sections[0].classList.add("active");
    }
  }
}

// Ejecutar al cargar la página
document.addEventListener("DOMContentLoaded", handleHashNavigation);

// Escuchar cambios en el hash
window.addEventListener("hashchange", handleHashNavigation);

function submitRescatista(e) {
  e.preventDefault();
  document.getElementById("rescatistaSuccess").style.display = "block";
  e.target.reset();
  setTimeout(() => {
    document.getElementById("rescatistaSuccess").style.display = "none";
  }, 3000);
}

function submitAdopcion(e) {
  e.preventDefault();
  document.getElementById("adoptarSuccess").style.display = "block";
  e.target.reset();
  setTimeout(() => {
    document.getElementById("adoptarSuccess").style.display = "none";
  }, 3000);
}

function submitDonacionTarjeta(e) {
  e.preventDefault();
  alert("¡Gracias por tu donación! Procesando pago...");
  e.target.reset();
}

function submitDonacionPaypal(e) {
  e.preventDefault();
  alert("¡Gracias por tu donación! Redirigiendo a PayPal...");
  e.target.reset();
}

// Función para filtrar mascotas en el catálogo (recibe el botón que llamó la acción)
function filterPets(type, btn) {
  const petCards = document.querySelectorAll(".pet-card");
  const filterButtons = document.querySelectorAll(".filter-btn");

  // Actualizar botones activos
  filterButtons.forEach((b) => b.classList.remove("active"));
  if (btn) btn.classList.add("active");

  // Mostrar/ocultar tarjetas
  petCards.forEach((card) => {
    if (type === "todos" || card.dataset.type === type) {
      card.classList.remove("hidden");
    } else {
      card.classList.add("hidden");
    }
  });
}

// Delegación de eventos: manejar clicks en botones "Ver más" dentro del grid
function attachPetGridDelegation() {
  const petsGrid = document.getElementById("petsGrid");
  if (!petsGrid) return;

  petsGrid.addEventListener("click", (e) => {
    if (e.target.matches(".btn-small")) {
      const card = e.target.closest(".pet-card");
      if (!card) return;
      const img = card.querySelector("img")
        ? card.querySelector("img").src
        : "";
      const name = card.querySelector("h3")
        ? card.querySelector("h3").textContent
        : "";
      const type = card.querySelector(".pet-type")
        ? card.querySelector(".pet-type").textContent
        : "";
      const age = card.querySelector(".pet-age")
        ? card.querySelector(".pet-age").textContent
        : "";
      const desc = card.querySelector(".pet-description")
        ? card.querySelector(".pet-description").textContent
        : "";
      openPetModal({ img, name, type, age, desc });
    }
  });
}

// Modal: abrir y cerrar
function openPetModal(pet) {
  const modal = document.getElementById("petModal");
  if (!modal) return;
  const imgEl = modal.querySelector(".modal-img");
  const nameEl = modal.querySelector(".modal-name");
  const typeEl = modal.querySelector(".modal-type");
  const ageEl = modal.querySelector(".modal-age");
  const descEl = modal.querySelector(".modal-desc");

  if (imgEl) imgEl.src = pet.img || "";
  if (nameEl) nameEl.textContent = pet.name || "";
  if (typeEl) typeEl.textContent = pet.type || "";
  if (ageEl) ageEl.textContent = pet.age || "";
  if (descEl) descEl.textContent = pet.desc || "";

  modal.classList.add("open");
  modal.setAttribute("aria-hidden", "false");
  document.body.style.overflow = "hidden";
}

function closePetModal() {
  const modal = document.getElementById("petModal");
  if (!modal) return;
  modal.classList.remove("open");
  modal.setAttribute("aria-hidden", "true");
  document.body.style.overflow = "";
}
