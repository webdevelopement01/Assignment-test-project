// Load categories from the API
const loadCategories = () => {
  fetch('https://openapi.programming-hero.com/api/peddy/categories')
    .then(res => res.json())
    .then(data => displayCategories(data.categories))
    .catch(error => console.log(error));
};

// Load all pets from the API
const loadAllPets = () => {
  fetch('https://openapi.programming-hero.com/api/peddy/pets')
    .then(res => res.json())
    .then(data => displayPets(data.pets))
    .catch(error => console.log(error));
};

// Load pets by category
const loadPetsByCategory = (categoryName) => {
  fetch(`https://openapi.programming-hero.com/api/peddy/category/${categoryName}`)
    .then(res => res.json())
    .then(data => displayPets(data.data))  // Assuming 'data.data' holds the pet array
    .catch(error => console.log(error));
};

// Function to display pets
const displayPets = (pets) => {
  const petsContainer = document.getElementById('pets');
  petsContainer.innerHTML = '';  // Clear previous pets

  if (pets.length == 0) {
    petsContainer.classList.remove('grid');
    petsContainer.innerHTML = `
      <div class="min-h-[300px] flex flex-col gap-5 justify-center items-center text-center border">
        <img src="images/error.webp"/>
        <h2 class="text-center text-xl font-bold"> No Information Available</h2>
        <p>It is a long established fact that a reader will be distracted by the readable content of a page when looking at <br> its layout. The point of using Lorem Ipsum is that it has a.</p>
      </div>`;
    return;
  } else {
    petsContainer.classList.add('grid');
  }

  pets.forEach(pet => {
    const card = document.createElement('div');
    card.classList = "card card-compact";
    card.innerHTML = `
      <img class="h-full rounded-lg mx-[10px]" src="${pet.image}" alt="${pet.pet_name}" />
      <div class="card-body">
        <h2 class="card-title">${pet.pet_name}</h2>
        <div class="flex items-center">
          <img class="w-3 h-3" src="https://img.icons8.com/?size=80&id=N9cJMoOnv009&format=png"/>
          <p class="ml-2">Breed: ${pet.breed || 'Not specified'}</p>
        </div>
        <div class="flex items-center">
          <img class="w-4 h-4" src="https://img.icons8.com/?size=32&id=QHEtypHttkOo&format=png"/>
          <p class="ml-2">Birth: ${pet.date_of_birth || 'Unknown'}</p>
        </div>
        <div class="flex items-center">
          <img class="w-4 h-4" src="https://img.icons8.com/?size=24&id=DN2eJOO2sKEe&format=png"/>
          <p class="ml-2">Gender: ${pet.gender || 'Unknown'}</p>
        </div>
        <div class="flex items-center">
          <img class="w-4 h-4" src="https://img.icons8.com/?size=24&id=85782&format=png"/>
          <p class="ml-2">Price: ${pet.price ? '$' + pet.price : 'Not Available'}</p>
        </div>
        <div class="card-actions">
          <button class="btn like-btn border border-[#0E7A81] "><i class="fas fa-heart icon"></i>Like</button>
          <button class="btn adopt-btn border border-[#0E7A81]">Adopt</button>
          <button class="btn border border-[#0E7A81]" onclick="showPetDetails(${pet.petId})"><i class="fas fa-info icon"></i>Details</button>
        </div>
      </div>`;
    petsContainer.append(card);

    // Like button functionality
    const likeButton = card.querySelector('.like-btn');
    likeButton.addEventListener('click', () => {
      const likeContainer = document.getElementById('likeContainer');
      const likedImage = document.createElement('img');
      likedImage.src = pet.image;
      likedImage.alt = pet.pet_name;
      likedImage.className = "w-full h-auto rounded-lg"; 
      likeContainer.appendChild(likedImage);
    });

    // Adopt button functionality 
    const adoptButton = card.querySelector('.adopt-btn');
    adoptButton.addEventListener('click', () => handleAdoptProcess(adoptButton));
  });
};

// Show pet details in the modal
const showPetDetails = (petId) => {
  fetch(`https://openapi.programming-hero.com/api/peddy/pet/${petId}`)
    .then(res => res.json())
    .then(data => {
      const pet = data.petData;
      const modalContent = document.getElementById('modal-content');
      modalContent.innerHTML = `
        <h2 class="text-lg font-bold ">${pet.pet_name}</h2>
        <img class="rounded-lg mt-1 w-full" src="${pet.image}" alt="${pet.pet_name}" />
        <p><strong>Breed:</strong> ${pet.breed}</p>
        <p><strong>Date of Birth:</strong> ${pet.date_of_birth}</p>
        <p><strong>Gender:</strong> ${pet.gender}</p>
        <p><strong>Price:</strong> $${pet.price}</p>
        <p><strong>Vaccination Status:</strong> ${pet.vaccinated_status}</p>
        <p><strong>Details:</strong> ${pet.pet_details}</p>`;
      document.getElementById('customModal').showModal();
    })
    .catch(error => console.log(error));
};

// Display categories
const displayCategories = (categories) => {
  const categoryContainer = document.getElementById("categories");
  let activeButton = null;

  categories.forEach(item => {
    const button = document.createElement("button");
    button.classList = "btn";
    button.style.borderRadius = "45px";

    const img = document.createElement("img");
    img.src = item.category_icon;
    img.alt = item.category;
    img.style.width = "20px"; 
    img.style.height = "20px";
    img.style.marginRight = "10px"; 

    button.appendChild(img);
    button.style.backgroundColor = "rgb(209 213 219)";
    button.appendChild(document.createTextNode(item.category));

    // Set click event to load pets by category
    button.onclick = () => {
      loadPetsByCategory(item.category);
      if (activeButton) activeButton.classList.remove('active');
      button.classList.add('active');
      activeButton = button;
    };
    categoryContainer.append(button);
  });
};


const handleAdoptProcess = (adoptButton) => {
  const modal = document.getElementById('adoptModal');
  const countdownEl = document.getElementById('countdown');
  let countdown = 3; 

  // Show the modal
  document.getElementById('showAdoptModal').click();

  // Countdown interval
  const interval = setInterval(() => {
    countdown -= 1;
    countdownEl.textContent = countdown;

    if (countdown <= 0) {
      clearInterval(interval);
      modal.close();
      adoptButton.disabled = true;
      adoptButton.classList.add('disabled');
    }
  }, 1000);
};

// Event listener for the Sort by Price button
document.getElementById('sortPriceBtn').addEventListener('click', () => {
  fetch('https://openapi.programming-hero.com/api/peddy/pets')
    .then(res => res.json())
    .then(data => {
      const sortedPets = data.pets.sort((a, b) => a.price - b.price); 
      displayPets(sortedPets); 
    })
    .catch(error => console.log(error));
});

// Scroll to the pets section when the 'View More' button is clicked
document.getElementById('viewMoreBtn').addEventListener('click', () => {
  const SortPriceSection = document.getElementById('SortPriceSection');
  SortPriceSection.scrollIntoView({ behavior: 'smooth' });
});

loadCategories();
loadAllPets();
