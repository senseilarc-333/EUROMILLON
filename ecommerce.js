export class EcommerceSystem {
  constructor() {
    this.cart = [];
    this.cartOverlay = document.getElementById('cart-overlay');
    this.slideCart = document.getElementById('slide-cart');
    this.closeBtn = document.getElementById('close-cart');
    this.openBtn = document.getElementById('open-cart');
    this.cartItemsContainer = document.getElementById('cart-items');
    this.cartTotalEl = document.getElementById('cart-total');
    this.checkoutBtn = document.getElementById('checkout-btn');
    
    this.upsellContainer = document.getElementById('upsell-container');
    this.addUpsellBtn = document.getElementById('add-upsell');

    this.initEvents();
  }

  initEvents() {
    // Abrir carrito
    this.openBtn.addEventListener('click', (e) => {
      e.preventDefault();
      this.openCart();
    });

    // Cerrar carrito
    this.closeBtn.addEventListener('click', () => this.closeCart());
    this.cartOverlay.addEventListener('click', () => this.closeCart());

    // Añadir productos
    document.querySelectorAll('.add-to-cart').forEach(button => {
      button.addEventListener('click', (e) => {
        const id = e.target.getAttribute('data-id');
        const name = e.target.getAttribute('data-name');
        const price = parseInt(e.target.getAttribute('data-price'));
        
        this.addToCart({ id, name, price });
      });
    });

    // Añadir Upsell
    this.addUpsellBtn.addEventListener('click', () => {
      this.addToCart({ id: 'usoia-upsell', name: 'Curso Uso de IA (Oferta)', price: 499 });
      this.upsellContainer.classList.add('hidden');
    });

    // Delegación para eliminar items
    this.cartItemsContainer.addEventListener('click', (e) => {
      if (e.target.classList.contains('remove')) {
        const index = e.target.getAttribute('data-index');
        this.removeFromCart(index);
      }
    });

    // Checkout Dinámico con API de Stripe
    this.checkoutBtn.addEventListener('click', async () => {
      if (this.cart.length > 0) {
        this.checkoutBtn.innerText = "CONECTANDO...";
        
        try {
          const response = await fetch('/create-checkout-session', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ items: this.cart }),
          });

          const data = await response.json();

          if (data.url) {
            window.location.href = data.url;
          } else {
            alert("Error al conectar con la pasarela de pago: " + (data.error || "Desconocido"));
            this.checkoutBtn.innerText = "PROCEDER AL PAGO SEGURO";
          }
        } catch (error) {
          console.error("Error:", error);
          alert("Hubo un problema de red al intentar procesar el pago.");
          this.checkoutBtn.innerText = "PROCEDER AL PAGO SEGURO";
        }
      }
    });
  }

  addToCart(product) {
    // Evitar duplicados simples
    const exists = this.cart.find(item => item.id === product.id);
    if (!exists) {
      this.cart.push(product);
      this.renderCart();
      this.checkUpsellLogic();
      this.openCart();
    }
  }

  removeFromCart(index) {
    this.cart.splice(index, 1);
    this.renderCart();
    this.checkUpsellLogic();
  }

  checkUpsellLogic() {
    // Si tienen Forex o Modelos IA pero no Uso IA
    const hasMainProduct = this.cart.find(p => p.id === 'forex' || p.id === 'modelosia');
    const hasUsoIa = this.cart.find(p => p.id === 'usoia' || p.id === 'usoia-upsell');

    if (hasMainProduct && !hasUsoIa) {
      this.upsellContainer.classList.remove('hidden');
    } else {
      this.upsellContainer.classList.add('hidden');
    }

    // Si no hay producto principal pero el upsell está en el carrito, removerlo automáticamente
    if (!hasMainProduct) {
      const upsellIndex = this.cart.findIndex(p => p.id === 'usoia-upsell');
      if (upsellIndex !== -1) {
        this.cart.splice(upsellIndex, 1);
        this.renderCart(); // Volver a renderizar para actualizar
      }
    }
  }

  renderCart() {
    this.cartItemsContainer.innerHTML = '';
    let total = 0;

    if (this.cart.length === 0) {
      this.cartItemsContainer.innerHTML = '<p style="color:#888;">El sistema está vacío. Añade una terminal.</p>';
      this.checkoutBtn.classList.add('disabled');
    } else {
      this.checkoutBtn.classList.remove('disabled');
      this.cart.forEach((item, index) => {
        total += item.price;
        this.cartItemsContainer.innerHTML += `
          <div class="cart-item">
            <div>
              <strong>${item.name}</strong><br>
              <span style="color:var(--matrix-green);">$${item.price} MXN</span>
            </div>
            <button class="remove" data-index="${index}">[X]</button>
          </div>
        `;
      });
    }

    this.cartTotalEl.innerText = `$${total.toLocaleString()} MXN`;
  }

  openCart() {
    this.cartOverlay.classList.add('active');
    this.slideCart.classList.add('active');
  }

  closeCart() {
    this.cartOverlay.classList.remove('active');
    this.slideCart.classList.remove('active');
  }
}
