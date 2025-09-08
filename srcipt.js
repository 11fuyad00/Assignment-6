
    const catagoryContainer = document.getElementById('catagoryContainer');
    const cardContainer = document.getElementById('cardContainer');
    const cartList = document.getElementById('cartList');
    const totalPriceEl = document.getElementById('totalPrice');
    const spinner = document.getElementById('spinner');
    let total = 0;

    // load categories
    const loadCategories = () => {
      fetch("https://openapi.programming-hero.com/api/categories")
        .then((res) => res.json())
        .then((data) => {
          const categories = data.categories;
          categories.forEach(cata => {
            const li = document.createElement("li");
            li.innerHTML = `
              <button onclick="loadCategory('${cata.category_name}', this)"
              class="block w-full text-left mb-2 px-3 py-2 rounded-md hover:bg-green-600 hover:text-white">
              ${cata.category_name}
              </button>`;
            catagoryContainer.appendChild(li);
          });
        });
    }

    // load all plants (initial 6)
    const loadInitialPlants = () => {
      showSpinner(true);
      fetch("https://openapi.programming-hero.com/api/plants")
        .then(res => res.json())
        .then(data => {
          const plants = data.plants.slice(0, 6);
          displayCards(plants);
        })
        .finally(() => showSpinner(false));
    }

    // load plants by category
    const loadCategory = (category, btn) => {
      setActiveCategory(btn);
      showSpinner(true);
      fetch("https://openapi.programming-hero.com/api/plants")
        .then(res => res.json())
        .then(data => {
          const filtered = data.plants.filter(p => p.category === category);
          displayCards(filtered);
        })
        .finally(() => showSpinner(false));
    }

    // display cards
    const displayCards = (plants) => {
      cardContainer.innerHTML = "";
      plants.forEach(plant => {
        const div = document.createElement("div");
        div.className = "bg-white rounded-lg shadow p-4 flex flex-col";
        div.innerHTML = `
          <div class="h-40 bg-gray-200 flex items-center justify-center rounded-md">
            <img src="${plant.image}" alt="${plant.name}" class="max-h-36 w-[180px]">
          </div>
          <h3 onclick="showDetails('${plant.plant_id}')" class="font-semibold text-lg mt-2 cursor-pointer text-green-700 hover:underline">${plant.name}</h3>
          <p class="text-gray-600 text-sm mt-1">${plant.description.slice(0, 70)}...</p>
          <div class="flex justify-between items-center mt-2">
            <span class="bg-green-100 text-green-700 text-xs px-2 py-1 rounded-full">${plant.category}</span>
            <span class="font-semibold text-gray-800">৳${plant.price}</span>
          </div>
          <button onclick="addToCart('${plant.name}', ${plant.price})"
            class="w-full mt-3 bg-green-700 text-white py-2 rounded-lg hover:bg-green-800 transition">Add to Cart</button>
        `;
        cardContainer.appendChild(div);
      });
    }

    // add to cart
    const addToCart = (name, price) => {
      const li = document.createElement("li");
      li.className = "flex justify-between items-center bg-green-50 p-2 rounded-md";
      li.innerHTML = `
        <span>${name}</span>
        <span>
          ৳${price}
          <button onclick="removeFromCart(this, ${price})" class="ml-2 text-red-500 font-bold">✕</button>
        </span>
      `;
      cartList.appendChild(li);
      total += price;
      updateTotal();
    }

    // remove from cart
    const removeFromCart = (btn, price) => {
      btn.parentElement.parentElement.remove();
      total -= price;
      updateTotal();
    }

    // update total
    const updateTotal = () => {
      totalPriceEl.innerText = total;
    }

    // show modal details
    const showDetails = (id) => {
      fetch(`https://openapi.programming-hero.com/api/plant/${id}`)
        .then(res => res.json())
        .then(data => {
          const plant = data.plant;
          document.getElementById("modalTitle").innerText = plant.name;
          document.getElementById("modalImage").src = plant.image;
          document.getElementById("modalDesc").innerText = plant.description;
          document.getElementById("detailsModal").showModal();
        });
    }

    // spinner toggle
    const showSpinner = (show) => {
      spinner.classList.toggle("hidden", !show);
    }

    // active category
    const setActiveCategory = (btn) => {
      document.querySelectorAll("#catagoryContainer button").forEach(b => b.classList.remove("bg-green-600", "text-white"));
      btn.classList.add("bg-green-600", "text-white");
    }

    // init
    loadCategories();
    loadInitialPlants();
