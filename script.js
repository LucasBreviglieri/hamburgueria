document.addEventListener("DOMContentLoaded", () => {
    // Seleciona os elementos do DOM
    const menu = document.getElementById("menu");
    const cartBtn = document.getElementById("cart-btn");
    const cartModal = document.getElementById("cart-modal");
    const cartItemsContainer = document.getElementById("cart-items");
    const cartTotal = document.getElementById("cart-total");
    const checkoutBtn = document.getElementById("checkout-btn");
    const closeModalBtn = document.getElementById("close-modal-btn");
    const cartCounter = document.getElementById("cart-count");
    const addressInput = document.getElementById("address");
    const addressWarn = document.getElementById("address-warn");
    const closeModalBtnMain = document.getElementById("close-modal-btn-main");

    let cart = [];

    if (cartBtn) {
        // Abrir modal
        cartBtn.addEventListener("click", () => {
            updateCartModal();
            cartModal.classList.remove("hidden");
        });
    }

    if (cartModal) {
        // Fechar modal
        cartModal.addEventListener("click", (event) => {
            if (event.target === cartModal) {
                cartModal.classList.add("hidden");
            }
        });
    }

    if (closeModalBtnMain) {
        closeModalBtnMain.addEventListener("click", () => cartModal.classList.add("hidden"));
    }

    if (closeModalBtn) {
        closeModalBtn.addEventListener("click", () => cartModal.classList.add("hidden"));
    }

    if (menu) {
        // Adicionar no carrinho
        menu.addEventListener("click", (event) => {
            const parentButton = event.target.closest(".add-to-cart-btn");

            if (parentButton) {
                const name = parentButton.getAttribute("data-name");
                const price = parseFloat(parentButton.getAttribute("data-price"));
                const imageUrl = parentButton.getAttribute("data-image-url");

                addToCart(name, price, imageUrl);
                animateAddToCart(parentButton);
            }
        });
    }

    function addToCart(name, price, imageUrl) {
        const existingItem = cart.find(item => item.name === name);

        if (existingItem) {
            existingItem.quantity += 1;
        } else {
            cart.push({ name, price, quantity: 1, imageUrl });
        }

        updateCartModal();
    }

    // Atualiza o carrinho
    function updateCartModal() {
        cartItemsContainer.innerHTML = "";
        let total = 0;

        cart.forEach(item => {
            const itemTotal = item.price * item.quantity;

            const cartItemElement = document.createElement("div");
            cartItemElement.classList.add("flex", "justify-between", "mb-4", "flex-col");

            cartItemElement.innerHTML = `
                <div class="flex items-center justify-between bg-gray-100 p-4 rounded-md shadow-md mb-4">
                    <div class="flex items-center space-x-4">
                        <img src="${item.imageUrl}" alt="${item.name}" class="w-16 h-16 object-cover rounded-md border border-gray-300">
                        <div>
                            <p class="font-semibold text-lg text-gray-800">${item.name}</p>
                            <p class="text-sm text-gray-600">Quantidade: ${item.quantity}</p>
                            <p class="font-semibold text-lg mt-2 text-gray-800">R$ ${itemTotal.toFixed(2)}</p>
                        </div>
                    </div>
                    <button class="remove-from-cart-btn bg-red-500 text-white px-3 py-1 rounded-md hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-opacity-50" data-name="${item.name}">
                        <i class="fa fa-trash-alt"></i>
                    </button>
                </div>
            `;

            total += itemTotal;
            cartItemsContainer.appendChild(cartItemElement);
        });

        cartTotal.textContent = total.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
        cartCounter.textContent = cart.length;
    }

    // Função para remover item do carrinho
    if (cartItemsContainer) {
        cartItemsContainer.addEventListener("click", (event) => {
            const removeButton = event.target.closest(".remove-from-cart-btn");
            if (removeButton) {
                const name = removeButton.getAttribute("data-name");
                removeItemCart(name);
            }
        });
    }

    function removeItemCart(name) {
        const index = cart.findIndex(item => item.name === name);

        if (index !== -1) {
            const item = cart[index];

            if (item.quantity > 1) {
                item.quantity -= 1;
            } else {
                cart.splice(index, 1);
            }

            updateCartModal();
        }
    }

    // Função para verificar se o restaurante está aberto
    function checkIfOpen(startHour, endHour) {
        const now = new Date();
        const currentHour = now.getHours();
        return currentHour >= startHour && currentHour < endHour;
    }

    function checkRestaurantOpen() {
        const now = new Date();
        const dayOfWeek = now.getDay(); // 0 (Domingo) a 6 (Sábado)

        const openWeekdaysStart = 16;
        const openWeekdaysEnd = 22;
        const openSaturdaysStart = 10;
        const openSaturdaysEnd = 16;

        if (dayOfWeek >= 1 && dayOfWeek <= 5) {
            return checkIfOpen(openWeekdaysStart, openWeekdaysEnd);
        } else if (dayOfWeek === 6 || dayOfWeek === 0) {
            return checkIfOpen(openSaturdaysStart, openSaturdaysEnd);
        } else {
            return false;
        }
    }

    // Atualiza o status dos horários
    function updateHoursStatus() {
        const now = new Date();
        const dayOfWeek = now.getDay(); // 0 (Domingo) a 6 (Sábado)

        const hoursWeekdays = document.getElementById("hours-weekdays");
        const hoursSaturdays = document.getElementById("hours-saturdays");

        const openWeekdaysStart = 16;
        const openWeekdaysEnd = 22;
        const openSaturdaysStart = 10;
        const openSaturdaysEnd = 16;

        const isWeekdaysOpen = checkIfOpen(openWeekdaysStart, openWeekdaysEnd);
        const isSaturdaysOpen = (dayOfWeek === 6 || dayOfWeek === 0) ? checkIfOpen(openSaturdaysStart, openSaturdaysEnd) : false;

        if (isWeekdaysOpen) {
            hoursWeekdays.classList.add("open");
            hoursWeekdays.classList.remove("closed");
        } else {
            hoursWeekdays.classList.add("closed");
            hoursWeekdays.classList.remove("open");
        }

        if (isSaturdaysOpen) {
            hoursSaturdays.classList.add("open");
            hoursSaturdays.classList.remove("closed");
        } else {
            hoursSaturdays.classList.add("closed");
            hoursSaturdays.classList.remove("open");
        }
    }

    updateHoursStatus(); // Atualiza o status dos horários quando a página é carregada

    // Configurando o evento de entrada no campo de endereço
    if (addressInput) {
        addressInput.addEventListener("input", () => {
            const inputValue = addressInput.value.trim();

            if (inputValue === "") {
                addressInput.classList.add("border-red-500");
                addressWarn.classList.remove("hidden");
            } else {
                addressInput.classList.remove("border-red-500");
                addressWarn.classList.add("hidden");
            }
        });
    }

    // Evento de clique no botão de checkout
    if (checkoutBtn) {
        checkoutBtn.addEventListener("click", () => {
            if (!checkRestaurantOpen()) {
                Toastify({
                    text: "Ops, o restaurante está fechado!",
                    duration: 3000,
                    close: true,
                    gravity: "top",
                    position: "right",
                    stopOnFocus: true,
                    style: { background: "#ef4444" }
                }).showToast();
                return;
            }

            if (cart.length === 0) return;

            if (addressInput.value.trim() === "") {
                addressWarn.classList.remove("hidden");
                addressInput.classList.add("border-red-500");
                return;
            }

            // API do WPP
            const cartItems = cart.map(item => `${item.name} Quantidade: (${item.quantity}) Preço: R$${item.price.toFixed(2)}`).join("\n");
            const message = encodeURIComponent(`Olá, gostaria de fazer o seguinte pedido:\n\n${cartItems}\n\nEndereço: ${addressInput.value}`);
            const phone = "19994185359";

            window.open(`https://wa.me/${phone}?text=${message}`, "_blank");

            cart = [];
            updateCartModal();
        });
    }

    // Função de animação para adicionar ao carrinho
    function animateAddToCart(button) {
        const productElement = button.closest(".flex");
        if (!productElement) return;

        const productClone = productElement.cloneNode(true);
        productClone.style.position = "absolute";
        productClone.style.zIndex = "1000";
        document.body.appendChild(productClone);

        const rect = productElement.getBoundingClientRect();
        const scrollTop = window.pageYOffset;
        const scrollLeft = window.pageXOffset;

        productClone.style.top = `${rect.top + scrollTop}px`;
        productClone.style.left = `${rect.left + scrollLeft}px`;
        productClone.style.width = `${productElement.offsetWidth}px`;
        productClone.style.height = `${productElement.offsetHeight}px`;

        const cartPosition = cartBtn.getBoundingClientRect();
        const cartTop = cartPosition.top + scrollTop;
        const cartLeft = cartPosition.left + scrollLeft;

        productClone.style.transition = "all 0.5s ease-in-out";
        productClone.style.transform = `translate(${cartLeft - (rect.left + scrollLeft)}px, ${cartTop - (rect.top + scrollTop)}px) scale(0.1)`;
        productClone.style.opacity = "0";

        setTimeout(() => document.body.removeChild(productClone), 500);
    }
});
