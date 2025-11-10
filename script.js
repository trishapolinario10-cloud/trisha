 AOS.init({
            duration: 800,
            once: true,
            offset: 100
        });

        // Product data with Philippine Peso prices
        const products = [
            {
                id: 1,
                name: "Samsung Galaxy A14 128GB",
                price: 8999,
                image: "Samsung Galaxy A14 128GB.jpg",
                rating: 4,
                category: "electronics",
                description: "6.6-inch display, 50MP triple camera, 5000mAh battery"
            },
            {
                id: 2,
                name: "Realme 10 5G 128GB",
                price: 11999,
                image: "Realme 10 5G 128GB.webp",
                rating: 5,
                category: "electronics",
                description: "5G connectivity, 48MP camera, 33W fast charging"
            },
            {
                id: 3,
                name: "Barong Tagalog for Men",
                price: 2499,
                image: "Barong Tagalog for Men.jpg",
                rating: 4,
                category: "fashion",
                description: "Traditional Filipino formal wear, jusi fabric"
            },
            {
                id: 4,
                name: "Uniqlo Airism Shirt",
                price: 590,
                image: "Uniqloe.avif",
                rating: 5,
                category: "fashion",
                description: "Lightweight and breathable, perfect for Philippine weather"
            },
            {
                id: 5,
                name: "Hanabishi Air Fryer 3.5L",
                price: 2495,
                image: "Hanabishi Air Fryer 3.5L.jpg",
                rating: 4,
                category: "home",
                description: "Digital air fryer, 3.5L capacity, 7 cooking presets"
            },
            {
                id: 6,
                name: "Human Nature Sunflower Oil",
                price: 299,
                image: "Human Nature Sunflower Oil.jpg",
                rating: 4,
                category: "beauty",
                description: "100% natural, cold-pressed, rich in antioxidants"
            },
            {
                id: 7,
                name: "Nike Revolution 6 Running Shoes",
                price: 3595,
                image: "Nike Revolution 6 Running Shoes.jpg",
                rating: 4,
                category: "sports",
                description: "Cushioned running shoes, breathable mesh upper"
            },
            {
                id: 8,
                name: "Xiaomi Redmi 12C 64GB",
                price: 5499,
                image: "Xiaomi Redmi 12C 64GB.jpg",
                rating: 4,
                category: "electronics",
                description: "6.71-inch display, 50MP camera, 5000mAh battery"
            },
            {
                id: 9,
                name: "Bench Basic T-Shirt",
                price: 399,
                image: "Bench Basic T-Shirt.webp",
                rating: 4,
                category: "fashion",
                description: "100% cotton, comfortable fit, various colors available"
            },
            {
                id: 10,
                name: "Herschel Backpack",
                price: 2895,
                image: "Herschel Backpack.webp",
                rating: 5,
                category: "fashion",
                description: "Classic backpack, laptop compartment, durable construction"
            },
            {
                id: 11,
                name: "Kojic San Soap",
                price: 99,
                image: "Kojic San Soap.webp",
                rating: 4,
                category: "beauty",
                description: "Skin lightening soap, helps reduce dark spots and acne marks"
            },
            {
                id: 12,
                name: "Adidas Football",
                price: 1295,
                image: "Adidas Football.webp",
                rating: 4,
                category: "sports",
                description: "Official size 5 football, durable construction for training"
            }
        ];

        // Cart and user data
        let cart = [];
        let currentUser = {
            id: 1,
            name: "Trisha Ang Apolinario",
            email: "trisha.ang@gmail.com",
            phone: "+63 912 345 6789",
            address: "123 Main Street, Quezon City, Metro Manila"
        };

        // DOM elements
        const productsContainer = $('#productsContainer');
        const cartItems = $('#cartItems');
        const cartTotal = $('#cartTotal');
        const cartCount = $('.cart-count');
        const emptyCart = $('#emptyCart');
        const checkoutBtn = $('#checkoutBtn');
        const searchForm = $('#searchForm');
        const searchInput = $('#searchInput');
        const searchResults = $('#searchResults');
        const resultsContainer = $('#resultsContainer');
        const loadMoreBtn = $('#loadMore');
        const loadingOverlay = $('#loadingOverlay');
        const paymentOrderSummary = $('#paymentOrderSummary');
        const paymentTotal = $('#paymentTotal');
        const paymentMethodCards = $('.payment-method-card');
        const paymentForms = $('.payment-form');
        const confirmPaymentBtn = $('#confirmPayment');

        // Initialize the page
        $(document).ready(function() {
            // Show loading screen for 2 seconds
            setTimeout(function() {
                loadingOverlay.fadeOut(500);
            }, 2000);

            renderProducts();
            updateCartUI();
            
            // Event listeners
            searchForm.on('submit', function(e) {
                e.preventDefault();
                performSearch();
            });
            
            $('.dropdown-item[data-category]').on('click', function(e) {
                e.preventDefault();
                const category = $(this).data('category');
                filterProducts(category);
            });
            
            loadMoreBtn.on('click', function() {
                loadMoreProducts();
            });
            
            checkoutBtn.on('click', function() {
                if (cart.length > 0) {
                    updatePaymentSummary();
                }
            });
            
            // Payment method selection
            paymentMethodCards.on('click', function() {
                const method = $(this).data('method');
                
                // Update active state
                paymentMethodCards.removeClass('active');
                $(this).addClass('active');
                
                // Show corresponding form
                paymentForms.addClass('d-none');
                $(`#${method}Form`).removeClass('d-none');
            });
            
            // Confirm payment
            confirmPaymentBtn.on('click', function() {
                processPayment();
            });
        });

        // Render products to the page
        function renderProducts(productsToRender = products.slice(0, 8)) {
            productsContainer.empty();
            
            if (productsToRender.length === 0) {
                productsContainer.html('<div class="col-12 text-center py-5"><h4>No products found</h4></div>');
                return;
            }
            
            productsToRender.forEach(product => {
                const productElement = `
                    <div class="col-md-6 col-lg-3" data-aos="fade-up">
                        <div class="card product-card h-100">
                            <div class="product-image p-3">
                                <img src="${product.image}" class="card-img-top" alt="${product.name}">
                            </div>
                            <div class="card-body d-flex flex-column">
                                <span class="category-badge">${product.category}</span>
                                <h5 class="card-title">${product.name}</h5>
                                <p class="card-text text-muted small flex-grow-1">${product.description}</p>
                                <div class="d-flex justify-content-between align-items-center mt-auto">
                                    <div class="price">₱${product.price.toLocaleString()}</div>
                                    <button class="btn btn-primary btn-sm add-to-cart" data-id="${product.id}">
                                        <i class="fas fa-cart-plus"></i>
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                `;
                
                productsContainer.append(productElement);
            });
            
            // Add event listeners to "Add to Cart" buttons
            $('.add-to-cart').on('click', function() {
                const productId = parseInt($(this).data('id'));
                addToCart(productId);
            });
        }

        // Add product to cart
        function addToCart(productId) {
            const product = products.find(p => p.id === productId);
            
            if (product) {
                const existingItem = cart.find(item => item.id === productId);
                
                if (existingItem) {
                    existingItem.quantity += 1;
                } else {
                    cart.push({
                        id: product.id,
                        name: product.name,
                        price: product.price,
                        image: product.image,
                        quantity: 1
                    });
                }
                
                updateCartUI();
                showNotification(`${product.name} added to cart!`, 'success');
            }
        }

        // Remove item from cart
        function removeFromCart(productId) {
            cart = cart.filter(item => item.id !== productId);
            updateCartUI();
            showNotification('Item removed from cart', 'info');
        }

        // Update cart quantity
        function updateCartQuantity(productId, newQuantity) {
            if (newQuantity < 1) {
                removeFromCart(productId);
                return;
            }
            
            const item = cart.find(item => item.id === productId);
            if (item) {
                item.quantity = newQuantity;
                updateCartUI();
            }
        }

        // Update cart UI
        function updateCartUI() {
            // Update cart count
            cartCount.text(cart.reduce((total, item) => total + item.quantity, 0));
            
            // Update cart total
            const total = cart.reduce((total, item) => total + (item.price * item.quantity), 0);
            cartTotal.text(`₱${total.toLocaleString()}`);
            
            // Update cart items
            cartItems.empty();
            
            if (cart.length === 0) {
                cartItems.append(emptyCart.clone().show());
                checkoutBtn.prop('disabled', true);
                return;
            }
            
            checkoutBtn.prop('disabled', false);
            
            cart.forEach(item => {
                const cartItemElement = `
                    <div class="card mb-3">
                        <div class="card-body">
                            <div class="d-flex">
                                <div class="flex-shrink-0">
                                    <img src="${item.image}" alt="${item.name}" width="60" height="60" class="rounded">
                                </div>
                                <div class="flex-grow-1 ms-3">
                                    <h6 class="card-title">${item.name}</h6>
                                    <div class="d-flex justify-content-between align-items-center">
                                        <div class="price">₱${item.price.toLocaleString()}</div>
                                        <div class="d-flex align-items-center">
                                            <button class="btn btn-sm btn-outline-secondary quantity-minus" data-id="${item.id}">-</button>
                                            <span class="mx-2">${item.quantity}</span>
                                            <button class="btn btn-sm btn-outline-secondary quantity-plus" data-id="${item.id}">+</button>
                                        </div>
                                    </div>
                                    <button class="btn btn-sm btn-outline-danger mt-2 remove-item" data-id="${item.id}">
                                        <i class="fas fa-trash"></i> Remove
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                `;
                
                cartItems.append(cartItemElement);
            });
            
            // Add event listeners to cart buttons
            $('.quantity-minus').on('click', function() {
                const productId = parseInt($(this).data('id'));
                const item = cart.find(item => item.id === productId);
                if (item) {
                    updateCartQuantity(productId, item.quantity - 1);
                }
            });
            
            $('.quantity-plus').on('click', function() {
                const productId = parseInt($(this).data('id'));
                const item = cart.find(item => item.id === productId);
                if (item) {
                    updateCartQuantity(productId, item.quantity + 1);
                }
            });
            
            $('.remove-item').on('click', function() {
                const productId = parseInt($(this).data('id'));
                removeFromCart(productId);
            });
        }

        // Update payment summary
        function updatePaymentSummary() {
            paymentOrderSummary.empty();
            
            cart.forEach(item => {
                const itemElement = `
                    <div class="d-flex justify-content-between mb-2">
                        <span>${item.name} x${item.quantity}</span>
                        <span>₱${(item.price * item.quantity).toLocaleString()}</span>
                    </div>
                `;
                
                paymentOrderSummary.append(itemElement);
            });
            
            const total = cart.reduce((total, item) => total + (item.price * item.quantity), 0);
            paymentTotal.text(`₱${total.toLocaleString()}`);
        }

        // Perform search
        function performSearch() {
            const searchTerm = searchInput.val().trim().toLowerCase();
            
            if (searchTerm === '') {
                searchResults.hide();
                renderProducts();
                return;
            }
            
            const filteredProducts = products.filter(product => 
                product.name.toLowerCase().includes(searchTerm) || 
                product.description.toLowerCase().includes(searchTerm) ||
                product.category.toLowerCase().includes(searchTerm)
            );
            
            // Show search results
            searchResults.show();
            resultsContainer.empty();
            
            if (filteredProducts.length === 0) {
                resultsContainer.html('<div class="col-12 text-center py-4"><h5>No products found for "' + searchTerm + '"</h5></div>');
                return;
            }
            
            // Render search results
            filteredProducts.forEach(product => {
                const productElement = `
                    <div class="col-md-6 col-lg-3">
                        <div class="card product-card h-100">
                            <div class="product-image p-3">
                                <img src="${product.image}" class="card-img-top" alt="${product.name}">
                            </div>
                            <div class="card-body d-flex flex-column">
                                <span class="category-badge">${product.category}</span>
                                <h5 class="card-title">${product.name}</h5>
                                <p class="card-text text-muted small flex-grow-1">${product.description}</p>
                                <div class="d-flex justify-content-between align-items-center mt-auto">
                                    <div class="price">₱${product.price.toLocaleString()}</div>
                                    <button class="btn btn-primary btn-sm add-to-cart" data-id="${product.id}">
                                        <i class="fas fa-cart-plus"></i>
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                `;
                
                resultsContainer.append(productElement);
            });
            
            // Add event listeners to "Add to Cart" buttons in search results
            resultsContainer.find('.add-to-cart').on('click', function() {
                const productId = parseInt($(this).data('id'));
                addToCart(productId);
            });
        }

        // Filter products by category
        function filterProducts(category) {
            if (category === 'all') {
                renderProducts();
                searchResults.hide();
                return;
            }
            
            const filteredProducts = products.filter(product => product.category === category);
            renderProducts(filteredProducts);
            searchResults.hide();
        }

        // Load more products
        function loadMoreProducts() {
            // Show loading animation
            loadMoreBtn.html('<span class="spinner-border spinner-border-sm me-2"></span>Loading...');
            
            // Simulate API call delay
            setTimeout(() => {
                const currentCount = productsContainer.children().length;
                const nextProducts = products.slice(currentCount, currentCount + 4);
                
                if (nextProducts.length === 0) {
                    loadMoreBtn.prop('disabled', true).text('No More Products');
                    return;
                }
                
                nextProducts.forEach(product => {
                    const productElement = `
                        <div class="col-md-6 col-lg-3" data-aos="fade-up">
                            <div class="card product-card h-100">
                                <div class="product-image p-3">
                                    <img src="${product.image}" class="card-img-top" alt="${product.name}">
                                </div>
                                <div class="card-body d-flex flex-column">
                                    <span class="category-badge">${product.category}</span>
                                    <h5 class="card-title">${product.name}</h5>
                                    <p class="card-text text-muted small flex-grow-1">${product.description}</p>
                                    <div class="d-flex justify-content-between align-items-center mt-auto">
                                        <div class="price">₱${product.price.toLocaleString()}</div>
                                        <button class="btn btn-primary btn-sm add-to-cart" data-id="${product.id}">
                                            <i class="fas fa-cart-plus"></i>
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    `;
                    
                    productsContainer.append(productElement);
                });
                
                // Add event listeners to new "Add to Cart" buttons
                productsContainer.find('.add-to-cart').off('click').on('click', function() {
                    const productId = parseInt($(this).data('id'));
                    addToCart(productId);
                });
                
                // Reset button text
                loadMoreBtn.html('Load More Products');
                
                // Re-initialize AOS for new elements
                AOS.refresh();
            }, 1000);
        }

        // Process payment
        function processPayment() {
            // Show loading state
            confirmPaymentBtn.html('<span class="spinner-border spinner-border-sm me-2"></span>Processing...');
            confirmPaymentBtn.prop('disabled', true);
            
            // Simulate payment processing
            setTimeout(() => {
                const total = cart.reduce((total, item) => total + (item.price * item.quantity), 0);
                
                showNotification(`Payment processed successfully! Total: ₱${total.toLocaleString()}`, 'success');
                
                // Clear cart after successful payment
                cart = [];
                updateCartUI();
                
                // Close modals
                bootstrap.Modal.getInstance($('#paymentModal')).hide();
                bootstrap.Offcanvas.getInstance($('#cartOffcanvas')).hide();
                
                // Reset payment button
                confirmPaymentBtn.html('<i class="fas fa-lock me-2"></i>Confirm Payment');
                confirmPaymentBtn.prop('disabled', false);
            }, 2000);
        }

        // Show notification
        function showNotification(message, type = 'info') {
            const alertClass = type === 'success' ? 'alert-success' : 
                              type === 'danger' ? 'alert-danger' : 
                              type === 'warning' ? 'alert-warning' : 'alert-info';
            
            const notification = $(`
                <div class="alert ${alertClass} alert-dismissible fade show notification" role="alert" data-aos="fade-left">
                    ${message}
                    <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
                </div>
            `);
            
            $('body').append(notification);
            
            // Auto remove after 3 seconds
            setTimeout(() => {
                notification.alert('close');
            }, 3000);
        }
