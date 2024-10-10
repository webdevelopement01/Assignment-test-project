// Navbar Toggle for Mobile View
const toggleNavbar = () => {
    const nav = document.getElementById('navbar');
    nav.classList.toggle('hidden');
  };
  
  // Fetch all categories
  const loadCategories = () => {
    fetch('https://openapi.programming-hero.com/api/peddy/categories')
      .then(res => res.json())
      .then(data => displayCategories(data.categories))
      .catch(error => console.log(error));
  };
  
  // Fetch all pets
  const loadAllPets = () => {
    fetch('https://openapi.programming-hero.com/api/peddy/pets')
      .then(res => res.json())
      .then(data => displayPets(data.pets))
      .catch(error => console.log(error));
  };
  
  // Fetch pets by category
  const loadPetsByCategory = (categoryName) => {
    fetch(`https://openapi.programming-hero.com/api/peddy/category/${categoryName}`)
      .then(res => res.json())
      .then(data => displayPets(data.data))  // Assuming 'data.data' holds the pet array
      .catch(error => console.log(error));
  };
  
  // Display categories in the UI
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
      button.appendChild(document.createTextNode(item.category));
  
      // Set click event to load pets by category
      button.onclick = () => {
        loadPetsByCategory(item.category);
  
        if (activeButton) {
          activeButton.classList.remove('active');
        }
        button.classList.add('active');
        activeButton = button;
      };
  
      categoryContainer.append(button);
    });
  };
  
  // Display pets in the UI
  const displayPets = (pets) => {
    const petsContainer = document.getElementById('pets');
    petsContainer.innerHTML = '';  // Clear previous pets
  
    if (pets.length === 0) {
      petsContainer.classList.remove('grid');
      petsContainer.innerHTML = `
        <div class="min-h-[300px] flex flex-col gap-5 justify-center items-center text-center">
            <img src="images/error.webp"/>
            <h2 class="text-center text-xl font-bold"> No Information Available</h2>
            <p>No pets are available in this category.</p>
        </div>
      `;
      return;
    } else {
      petsContainer.classList.add('grid');
    }
  
    pets.forEach(pet => {
      const card = document.createElement('div');
      card.classList = "card card-compact";
      card.innerHTML = `
        <img class="h-full rounded-lg" src="${pet.image}" alt="${pet.pet_name}" />
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
            <button class="btn" onclick="likePet('${pet.image}')"><i class="fas fa-heart icon"></i>Like</button>
            <button class="btn"><i class="fas fa-heart icon"></i>Adopt</button>
            <button class="btn" onclick="showPetDetails(${pet.petId})"><i class="fas fa-info icon"></i>Details</button>
          </div>
        </div>
      `;
      petsContainer.append(card);
    });
  };
  
  // Show pet details in the modal
  const showPetDetails = (petId) => {
    fetch(`https://openapi.programming-hero.com/api/peddy/pet/${petId}`)
      .then(res => res.json())
      .then(data => {
        const pet = data.pet;
        const modalContent = document.getElementById('modal-content');
  
        modalContent.innerHTML = `
          <h2 class="text-lg font-bold">${pet.pet_name}</h2>
          <img class="rounded-lg" src="${pet.image}" alt="${pet.pet_name}" />
          <p><strong>Breed:</strong> ${pet.breed || 'Not specified'}</p>
          <p><strong>Date of Birth:</strong> ${pet.date_of_birth || 'Unknown'}</p>
          <p><strong>Gender:</strong> ${pet.gender || 'Unknown'}</p>
          <p><strong>Price:</strong> ${pet.price ? '$' + pet.price : 'Not Available'}</p>
          <p><strong>Description:</strong> ${pet.pet_details || 'No description available.'}</p>
        `;
  
        document.getElementById('customModal').showModal();
      })
      .catch(error => console.log(error));
  };
  
  // Handle the "Like" button click
  const likePet = (petImage) => {
    const likedPetsContainer = document.getElementById('likedPets');
    const petThumb = document.createElement('img');
    petThumb.src = petImage;
    petThumb.classList = "w-24 h-24 rounded-lg";
  
    likedPetsContainer.append(petThumb);
  };
  
  // Initialize page with categories and all pets
  loadCategories();
  loadAllPets();
  