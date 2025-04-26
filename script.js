document.addEventListener('DOMContentLoaded', function() {
    // Carrito de compras
    let cart = [];
    const cartItemsContainer = document.querySelector('.cart-items');
    const cartTotalElement = document.getElementById('cartTotal');
    const cartCountElement = document.querySelector('.cart-count');
    const emptyCartMessage = document.querySelector('.empty-cart-message');
    
    // Agregar producto al carrito
    document.querySelectorAll('.add-to-cart').forEach(button => {
        button.addEventListener('click', function() {
            const product = this.getAttribute('data-product');
            // Obtener el precio del data-price y convertirlo a número
            const price = parseFloat(this.getAttribute('data-price'));
            
            // Verificar si el producto ya está en el carrito
            const existingItem = cart.find(item => item.product === product && item.price === price);
            
            if (existingItem) {
                existingItem.quantity += 1;
            } else {
                cart.push({
                    product: product,
                    price: price,
                    quantity: 1
                });
            }
            
            updateCart();
            
            // Animación de confirmación mejorada
            const confirmation = document.createElement('div');
            confirmation.innerHTML = `
                <div class="alert alert-success position-fixed bottom-0 end-0 m-3" role="alert" style="z-index: 1100;">
                    <i class="fas fa-check-circle me-2"></i> ¡Agregado al carrito!
                </div>
            `;
            document.body.appendChild(confirmation);
            
            setTimeout(() => {
                confirmation.classList.add('fade-out');
                setTimeout(() => confirmation.remove(), 300);
            }, 2000);
        });
    });
    
    // Actualizar carrito
    function updateCart() {
        // Actualizar contador
        const totalItems = cart.reduce((total, item) => total + item.quantity, 0);
        cartCountElement.textContent = totalItems;
        
        // Actualizar lista de productos
        cartItemsContainer.innerHTML = '';
        
        if (cart.length === 0) {
            emptyCartMessage.style.display = 'block';
        } else {
            emptyCartMessage.style.display = 'none';
            
            cart.forEach((item, index) => {
                const cartItemElement = document.createElement('div');
                cartItemElement.className = 'cart-item fade-in d-flex justify-content-between align-items-center py-2 border-bottom';
                cartItemElement.innerHTML = `
                    <div class="d-flex align-items-center">
                        <img src="https://via.placeholder.com/50x50?text=Producto" alt="${item.product}" 
                             class="img-thumbnail me-3" style="width: 50px; height: 50px; object-fit: cover;">
                        <div>
                            <h6 class="mb-0">${item.product}</h6>
                            <small class="text-muted">${item.quantity} × $${item.price.toFixed(2)}</small>
                        </div>
                    </div>
                    <div class="d-flex align-items-center">
                        <span class="me-3 fw-bold">$${(item.price * item.quantity).toFixed(2)}</span>
                        <button class="btn btn-sm btn-outline-danger remove-item" data-index="${index}">
                            <i class="fas fa-trash-alt"></i>
                        </button>
                    </div>
                `;
                cartItemsContainer.appendChild(cartItemElement);
            });
            
            // Agregar event listeners para eliminar items
            document.querySelectorAll('.remove-item').forEach(button => {
                button.addEventListener('click', function() {
                    const index = parseInt(this.getAttribute('data-index'));
                    cart.splice(index, 1);
                    updateCart();
                    
                    // Mostrar notificación de eliminación
                    const notification = document.createElement('div');
                    notification.innerHTML = `
                        <div class="alert alert-warning position-fixed bottom-0 end-0 m-3" role="alert" style="z-index: 1100;">
                            <i class="fas fa-trash-alt me-2"></i> Producto eliminado
                        </div>
                    `;
                    document.body.appendChild(notification);
                    
                    setTimeout(() => {
                        notification.classList.add('fade-out');
                        setTimeout(() => notification.remove(), 300);
                    }, 2000);
                });
            });
        }
        
        // Actualizar total con formato de moneda
        const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
        cartTotalElement.textContent = total.toFixed(2);
    }
    
    // Botón de pago mejorado
    document.querySelector('.checkout-btn').addEventListener('click', function() {
        if (cart.length === 0) {
            // Usar Toast de Bootstrap en lugar de alert
            const toastHTML = `
                <div class="position-fixed bottom-0 end-0 p-3" style="z-index: 1100">
                    <div class="toast show" role="alert" aria-live="assertive" aria-atomic="true">
                        <div class="toast-header bg-danger text-white">
                            <strong class="me-auto">Carrito vacío</strong>
                            <button type="button" class="btn-close btn-close-white" data-bs-dismiss="toast" aria-label="Close"></button>
                        </div>
                        <div class="toast-body">
                            Agrega productos al carrito antes de pagar.
                        </div>
                    </div>
                </div>
            `;
            
            const toastContainer = document.createElement('div');
            toastContainer.innerHTML = toastHTML;
            document.body.appendChild(toastContainer);
            
            setTimeout(() => {
                const toastEl = toastContainer.querySelector('.toast');
                const toast = new bootstrap.Toast(toastEl);
                toast.show();
                
                setTimeout(() => {
                    toastContainer.remove();
                }, 3000);
            }, 100);
        } else {
            // Mostrar modal de confirmación
            const modalHTML = `
                <div class="modal fade" id="checkoutModal" tabindex="-1" aria-hidden="true">
                    <div class="modal-dialog">
                        <div class="modal-content">
                            <div class="modal-header">
                                <h5 class="modal-title">Confirmar compra</h5>
                                <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                            </div>
                            <div class="modal-body">
                                <p>Total a pagar: <strong>$${cartTotalElement.textContent}</strong></p>
                                <p>¿Deseas proceder con el pago?</p>
                            </div>
                            <div class="modal-footer">
                                <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cancelar</button>
                                <button type="button" class="btn btn-primary" id="confirmCheckout">Confirmar</button>
                            </div>
                        </div>
                    </div>
                </div>
            `;
            
            const modalContainer = document.createElement('div');
            modalContainer.innerHTML = modalHTML;
            document.body.appendChild(modalContainer);
            
            const modal = new bootstrap.Modal(document.getElementById('checkoutModal'));
            modal.show();
            
            document.getElementById('confirmCheckout').addEventListener('click', function() {
                // Aquí iría la lógica real de pago
                const successHTML = `
                    <div class="position-fixed top-0 start-0 w-100 h-100 d-flex align-items-center justify-content-center" style="z-index: 1200; background-color: rgba(0,0,0,0.5)">
                        <div class="bg-white p-4 rounded text-center" style="max-width: 400px;">
                            <i class="fas fa-check-circle text-success mb-3" style="font-size: 3rem;"></i>
                            <h3>¡Gracias por tu compra!</h3>
                            <p class="mb-4">Tu pedido ha sido procesado correctamente.</p>
                            <p class="fw-bold">Total: $${cartTotalElement.textContent}</p>
                            <button class="btn btn-primary w-100" onclick="location.reload()">Aceptar</button>
                        </div>
                    </div>
                `;
                
                document.body.insertAdjacentHTML('beforeend', successHTML);
                
                // Vaciar carrito y cerrar modales
                cart = [];
                updateCart();
                modal.hide();
                setTimeout(() => modalContainer.remove(), 500);
                
                // Cerrar el offcanvas
                const offcanvas = bootstrap.Offcanvas.getInstance(document.getElementById('cartOffcanvas'));
                offcanvas.hide();
            });
            
            // Limpiar el modal después de cerrar
            modalContainer.querySelector('.modal').addEventListener('hidden.bs.modal', function() {
                setTimeout(() => modalContainer.remove(), 500);
            });
        }
    });
    
    // Formulario de contacto mejorado
    document.getElementById('contactForm').addEventListener('submit', function(e) {
        e.preventDefault();
        
        // Mostrar feedback al usuario
        const originalButton = this.querySelector('button[type="submit"]');
        const originalText = originalButton.innerHTML;
        
        originalButton.disabled = true;
        originalButton.innerHTML = `
            <span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
            Enviando...
        `;
        
        // Simular envío (en un caso real sería una petición AJAX)
        setTimeout(() => {
            originalButton.innerHTML = `
                <i class="fas fa-check-circle me-2"></i> Mensaje enviado
            `;
            
            // Mostrar alerta de éxito
            const alertHTML = `
                <div class="alert alert-success alert-dismissible fade show" role="alert">
                    <i class="fas fa-check-circle me-2"></i>
                    Gracias por tu mensaje. Nos pondremos en contacto contigo pronto.
                    <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
                </div>
            `;
            
            const formContainer = this.parentElement;
            formContainer.insertAdjacentHTML('afterbegin', alertHTML);
            
            // Resetear formulario después de 2 segundos
            setTimeout(() => {
                this.reset();
                originalButton.innerHTML = originalText;
                originalButton.disabled = false;
            }, 2000);
        }, 1500);
    });
    
    // Smooth scrolling para los enlaces
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            const targetElement = document.querySelector(targetId);
            
            if (targetElement) {
                window.scrollTo({
                    top: targetElement.offsetTop - 80,
                    behavior: 'smooth'
                });
                
                // Actualizar URL sin recargar
                history.pushState(null, null, targetId);
            }
        });
    });
    
    // Añadir estilos dinámicos para las notificaciones
    const styleElement = document.createElement('style');
    styleElement.textContent = `
        .fade-out {
            opacity: 0;
            transition: opacity 0.3s ease-out;
        }
        .cart-item {
            transition: all 0.3s ease;
        }
        .cart-item:hover {
            background-color: #f8f9fa;
        }
    `;
    document.head.appendChild(styleElement);
});