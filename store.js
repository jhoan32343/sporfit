document.addEventListener('DOMContentLoaded', () => {
    // Elementos del DOM
    const cartIcon = document.getElementById('cart-icon');
    const cartSidebar = document.getElementById('cart-sidebar');
    const closeCart = document.querySelector('.close-cart');
    const addToCartButtons = document.querySelectorAll('.add-to-cart');
    const cartItems = document.querySelector('.cart-items');
    const cartCount = document.querySelector('.cart-count');
    const totalAmount = document.querySelector('.total-amount');
    const checkoutBtn = document.querySelector('.checkout-btn');
    const logoutBtn = document.getElementById('logout-btn');

    // Estado del carrito
    let cart = JSON.parse(localStorage.getItem('cart')) || [];

    // Datos de productos
    const products = {
        // Productos para hombres
        h1: { name: 'Camiseta Deportiva', price: 35.000, image: './0001.jpg' },
        h2: { name: 'Shorts Deportivos', price: 40.000, image: './0002.jpg' },
        h3: { name: 'Sudadera con Capucha', price: 70.000, image: './0003.jpg' },
        h4: { name: 'Pantalón Deportivo', price: 45.000, image: './0004.jpg' },
        
        // Productos para mujeres
        m1: { name: 'Leggings Deportivos', price: 35.000, image: './01.jpg' },
        m2: { name: 'camisas oversize', price: 25.000, image: './02.jpg' },
        m3: { name: 'Conjunto Deportivo', price: 60.000, image: './03.jpg' },
        m4: { name: 'Leggins', price: 45.000, image: './04.jpg' },
        
        // Accesorios
        a1: { name: 'suerte hombres', price: 30.000, image: './mayor01.jpg' },
        a2: { name: 'bluzas damas', price: 20.000, image: './mayor02.jpg' },
        a3: { name: 'conjuntos', price: 50.000, image: './mayor03.jpg' },
        a4: { name: 'conjuntos completo', price: 55.000, image: './mayor04.jpg' }
    };

    // Función de cerrar sesión
    logoutBtn.addEventListener('click', (e) => {
        e.preventDefault();
        window.location.href = 'index.html';
    });

    // Abrir/cerrar carrito
    cartIcon.addEventListener('click', () => {
        cartSidebar.classList.add('active');
    });

    closeCart.addEventListener('click', () => {
        cartSidebar.classList.remove('active');
    });

    // Cerrar carrito al hacer clic fuera
    document.addEventListener('click', (e) => {
        if (!cartSidebar.contains(e.target) && !cartIcon.contains(e.target)) {
            cartSidebar.classList.remove('active');
        }
    });

    // Agregar al carrito
    addToCartButtons.forEach(button => {
        button.addEventListener('click', () => {
            const productId = button.dataset.id;
            const product = products[productId];
            
            // Verificar si el producto ya está en el carrito
            const existingItem = cart.find(item => item.id === productId);
            
            if (existingItem) {
                existingItem.quantity += 1;
            } else {
                cart.push({
                    id: productId,
                    name: product.name,
                    price: product.price,
                    image: product.image,
                    quantity: 1
                });
            }

            // Guardar carrito en localStorage
            localStorage.setItem('cart', JSON.stringify(cart));
            updateCart();
            showNotification('Producto agregado al carrito');
        });
    });

    // Actualizar carrito
    function updateCart() {
        // Actualizar contador
        const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
        cartCount.textContent = totalItems;

        // Actualizar lista de items
        cartItems.innerHTML = cart.map(item => `
            <div class="cart-item">
                <img src="${item.image}" alt="${item.name}">
                <div class="cart-item-info">
                    <div class="cart-item-title">${item.name}</div>
                    <div class="cart-item-price">$${item.price.toFixed(2)}</div>
                    <div class="cart-item-quantity">
                        <button onclick="updateQuantity('${item.id}', -1)">-</button>
                        <span>${item.quantity}</span>
                        <button onclick="updateQuantity('${item.id}', 1)">+</button>
                    </div>
                </div>
            </div>
        `).join('');

        // Actualizar total
        const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
        totalAmount.textContent = `$${total.toFixed(2)}`;
    }

    // Actualizar cantidad
    window.updateQuantity = (productId, change) => {
        const item = cart.find(item => item.id === productId);
        if (item) {
            item.quantity += change;
            if (item.quantity <= 0) {
                cart = cart.filter(item => item.id !== productId);
            }
            localStorage.setItem('cart', JSON.stringify(cart));
            updateCart();
        }
    };

    // Procesar pago
    checkoutBtn.addEventListener('click', () => {
        if (cart.length === 0) {
            showNotification('El carrito está vacío');
            return;
        }
        showNotification('¡Gracias por tu compra!');
        cart = [];
        localStorage.setItem('cart', JSON.stringify(cart));
        updateCart();
        cartSidebar.classList.remove('active');
    });

    // Notificaciones
    function showNotification(message) {
        const notification = document.createElement('div');
        notification.className = 'notification';
        notification.textContent = message;
        document.body.appendChild(notification);

        setTimeout(() => {
            notification.remove();
        }, 3000);
    }

    // Inicializar carrito
    updateCart();

    // Agregar estilos para las notificaciones
    const style = document.createElement('style');
    style.textContent = `
        .notification {
            position: fixed;
            bottom: 20px;
            right: 20px;
            background-color: #667eea;
            color: white;
            padding: 1rem 2rem;
            border-radius: 5px;
            box-shadow: 0 2px 5px rgba(0,0,0,0.2);
            animation: slideIn 0.3s ease-out;
        }

        @keyframes slideIn {
            from {
                transform: translateX(100%);
                opacity: 0;
            }
            to {
                transform: translateX(0);
                opacity: 1;
            }
        }

        .cart-item-quantity {
            display: flex;
            align-items: center;
            gap: 0.5rem;
            margin-top: 0.5rem;
        }

        .cart-item-quantity button {
            background-color: #667eea;
            color: white;
            border: none;
            width: 25px;
            height: 25px;
            border-radius: 50%;
            cursor: pointer;
            display: flex;
            align-items: center;
            justify-content: center;
        }

        .cart-item-quantity button:hover {
            background-color: #764ba2;
        }
    `;
    document.head.appendChild(style);
}); 