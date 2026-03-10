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
const cartContainer = document.getElementById("cartContainer");
const emptyCartMessage = document.getElementById("emptyCartMessage");

const cart = [];




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
     loadSpinner.classList.remove("hidden");
    // showSpinner();
    const res = await fetch(
        "https://openapi.programming-hero.com/api/plants"
    );
    const data = await res.json()
    
    displayTrees(data.plants);
    // hideSpinner();
    loadSpinner.classList.add("hidden");

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
                    <button class="btn btn-success" onclick="addToCart(${element.id}, '${element.name}', ${element.price})">Cart</button>
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



const addToCart = (id, name, price) =>{
    // console.log(id, name, price, "add to cart")
    const existingItem = cart.find(item => item.id === id);
    if(existingItem){
        existingItem.quantity += 1;
    }else{
    cart.push({
       id,
       name,
       price,
       quantity: 1,
    });
    }
   

    updateCart();

    };

   const cartRemove = (id) =>{
    const index = cart.findIndex(item => item.id === id);
    if (index !== -1){
        cart.splice(index, 1);
    }
    updateCart();

   };

    const updateCart = () =>{
       cartContainer.innerHTML = "";
       if(cart.length === 0){
        emptyCartMessage.classList.remove("hidden");
       }else{
         emptyCartMessage.classList.add("hidden");
       }

       cart.forEach(item => {
        const cartItem = document.createElement("div");
        cartItem.innerHTML = `<div class="bg-slate-100 rounded-[5px] p-6 flex justify-between">
                            <div class="space-y-1.5">
                                <h2 class="font-semibold">${item.name}</h2>
                                <p class="font-semibold">$${item.price} × ${item.quantity}</p>
                            </div>
                            <div class="space-y-4">
                                <button class="btn btn-ghost" onclick="cartRemove(${item.id})">X</button>
                                <p class="text-right font-semibold text-xl">$${item.price * item.quantity}</p>
                            </div> 
                        </div>`;

        cartContainer.appendChild(cartItem);

       });

       const totalPrice = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
    document.getElementById("totalPrice").innerText = `$${totalPrice}`;
    };
