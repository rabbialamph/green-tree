const categoryContainer = document.getElementById("categoryContainer");
const treesContainer = document.getElementById("treesContainer");
const loadSpinner = document.getElementById("loadSpinner");
const allTreesbtn = document.getElementById("allTreesbtn");
const treeDetailsModal = document.getElementById("treeDetailsModal");
const modalTitle = document.getElementById("modalTitle");
const modalImage = document.getElementById("modalImage");
const modalCategory = document.getElementById("modalCategory");
const modalDescription = document.getElementById("modalDescription");
const modalPrice = document.getElementById("modalPrice");




const loadCategory = async () =>{
    const res = await fetch(
        "https://openapi.programming-hero.com/api/categories"
    );
    const data = await res.json()

    data.categories.forEach((category) => {
        const btn =  document.createElement("button");
        btn.className = "btn btn-outline w-full";
        btn.textContent = category.category_name;
        btn.onclick = () => selectCategory(category.id, btn);
        categoryContainer.appendChild(btn);
    });

};



const selectCategory = async (categoryId, btn) =>{
     console.log(categoryId, btn);
     const allbtn = document.querySelectorAll(
        "#categoryContainer button, #allTreesbtn"
    );
    allbtn.forEach(btn => {
        btn.classList.remove("btn-primary");
        btn.classList.add("btn-outline");
    });

        btn.classList.add("btn-primary");
        btn.classList.remove("btn-outline");

        const res = await fetch(
            `https://openapi.programming-hero.com/api/category/${categoryId}`
        )
        const data = await res.json();
        console.log(data);
        displayTrees(data.plants);

};

allTreesbtn.addEventListener("click", () =>{

    const allbtn = document.querySelectorAll(
        "#categoryContainer button, #allTreesbtn"
    );
    allbtn.forEach(btn => {
        btn.classList.remove("btn-primary");
        btn.classList.add("btn-outline");
    });

    allTreesbtn.classList.add("btn-primary");
    allTreesbtn.classList.remove("btn-outline");

  loadTrees();

});



const loadTrees = async () =>{
    // showSpinner();
    const res = await fetch(
        "https://openapi.programming-hero.com/api/plants"
    );
    const data = await res.json()
    
    displayTrees(data.plants);
    // hideSpinner();
};

const displayTrees = (plants) =>{
    treesContainer.innerHTML = "";
    plants.forEach(element => {
        const card = document.createElement("div");
          card.innerHTML = `<div class="card bg-white shadow-sm border-b-2 border-b-green-400"> 
            <figure>
                <img onclick="openModal(${element.id})"
                src="${element.image}" 
                alt="${element.name}" 
                class="h-32 w-full object-cover cursor-pointer" />
            </figure>
            <div class="space-y-3 p-4 text-left">
                <h2 class="card-title font-medium text-[16px]">${element.name}</h2>
                <p class="line-clamp-2 text-[12px]">${element.description}</p>
                <span class="border border-green-400 rounded-[8px] px-3 py-[1px] text-[12px] text-green-400">${element.category}</span>
                <div class="card-actions justify-between items-center mt-5">
                    <h2 class="text-green-400 font-bold text-[18px]">$${element.price}</h2>
                    <button class="btn btn-success">Cart</button>
                </div>
            </div>
        </div>`;
    

        treesContainer.append(card);
    });
    
};



const openModal = async (treeId) =>{
   const res = await fetch(
    `https://openapi.programming-hero.com/api/plant/${treeId}`,
   )

   const data = await res.json()

   const plantDetails = data.plants;
   modalTitle.textContent = plantDetails.name;
   modalImage.src = plantDetails.image;
   modalCategory.textContent = plantDetails.category;
   modalDescription.textContent = plantDetails.description;
   modalPrice.textContent  = plantDetails.price;
   treeDetailsModal.showModal();
}
loadCategory();
loadTrees();



// load spinner function
const showSpinner = () => {
    loadSpinner.classList.remove("hidden");
    loadSpinner.classList.add("flex");
     treesContainer.classList.add("hidden")
};
const hideSpinner = () => {
    loadSpinner.classList.add("hidden");
    loadSpinner.classList.remove("flex");
    treesContainer.classList.remove("hidden")
};