# Firebase Integration Guide for MercadoChat

## Prerequisites
1. Firebase account at [firebase.google.com](https://firebase.google.com)
2. Basic understanding of Firebase Console

## Step 1: Create Firebase Project
1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Click "Add project"
3. Name it (e.g., `mercadocchat`)
4. Disable Google Analytics (optional for simplicity)
5. Click "Create project"

## Step 2: Configure Authentication
1. In Firebase Console, go to **Authentication** > **Sign-in method**
2. Enable **Phone** provider
3. Under "Phone numbers for testing", add:
   - Test phone number: `+584140000000`
   - Test verification code: `123456`
   (This allows testing without real SMS)

## Step 3: Create Firestore Database
1. Go to **Firestore Database** > **Create database**
2. Start in **test mode** (we'll lock down rules later)
3. Choose location closest to your users

## Step 4: Get Firebase Config
1. Go to **Project Settings** (gear icon)
2. Under "Your apps", click the web icon (`</>`)
3. Register app nickname (e.g., `mercadocchat-web`)
4. Skip Firebase Hosting setup for now
5. Copy the config object - you'll need it for step 5

## Step 5: Update index.html
Add these scripts inside the `<head>` tag (after existing scripts):

```html
<!-- Firebase SDKs -->
<script src="https://www.gstatic.com/firebasejs/10.12.2/firebase-app-compat.js"></script>
<script src="https://www.gstatic.com/firebasejs/10.12.2/firebase-auth-compat.js"></script>
<script src="https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore-compat.js"></script>

<script>
  // REPLACE WITH YOUR ACTUAL CONFIG FROM STEP 4
  const firebaseConfig = {
    apiKey: "YOUR_API_KEY",
    authDomain: "YOUR_PROJECT_ID.firebaseapp.com",
    projectId: "YOUR_PROJECT_ID",
    storageBucket: "YOUR_PROJECT_ID.appspot.com",
    messagingSenderId: "YOUR_SENDER_ID",
    appId: "YOUR_APP_ID"
  };

  // Initialize Firebase
  firebase.initializeApp(firebaseConfig);
  window.auth = firebase.auth();
  window.db = firebase.firestore();
</script>
```

## Step 6: Replace script.js Sections
Below are the exact code blocks to replace in your script.js. 
**IMPORTANT**: Backup your original script.js first!

### A. Replace the entire `loadState()` function (around line 6-20)
```javascript
// REPLACE THIS SECTION:
// const loadState = () => {
//     try {
//         window.buyerOrders = JSON.parse(localStorage.getItem('buyerOrders')) || [];
//         window.favorites = JSON.parse(localStorage.getItem('favorites')) || [];
//         
//         // Seller Data
//         let store = JSON.parse(localStorage.getItem('myStoreData'));
//         if (!store || !store.phone || store.phone === "") {
//             store = { name: "Tienda de Prueba", phone: "04140000000", password: "1234", paymentMethods: [] };
//             localStorage.setItem('myStoreData', JSON.stringify(store));
//         }
//         window.myStoreData = store;
//         window.myStorePaymentMethods = store.paymentMethods || [];
//         window.myStorePaymentMethods = store.paymentMethods || [];
// 
//         window.currentStoreExcelItems = JSON.parse(localStorage.getItem('currentStoreExcelItems')) || [];
//         window.sellerOrders = JSON.parse(localStorage.getItem('sellerOrders')) || [];
//         window.sellerLoggedIn = localStorage.getItem('sellerLoggedIn') === 'true';
//         window.allGlobalOrders = JSON.parse(localStorage.getItem('allGlobalOrders')) || [];
//         window.allRatings = JSON.parse(localStorage.getItem('allRatings')) || [];
//         window.currentBuyer = JSON.parse(localStorage.getItem('currentBuyer')) || null;
//         window.allRegisteredStores = JSON.parse(localStorage.getItem('allRegisteredStores')) || [
//             { name: 'iTech Store', category: 'Tecnología', description: 'Expertos en Apple y accesorios.', phone: '584140000000', logo: 'https://images.unsplash.com/photo-1695048133142-1a20484d256e?auto=format&fit=crop&w=150&q=80', verified: true, paymentMethods: [] },
//             { name: 'SportCenter', category: 'Moda', description: 'Ropa deportiva de alta calidad.', phone: '584140000000', logo: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=150&q=80', verified: true, paymentMethods: [] }
//         ];
// 
//         // Buyer Data
//         let buyers = JSON.parse(localStorage.getItem('registeredBuyers')) || [];
//         if (buyers.length === 0) {
//             buyers = [{ name: "Usuario Prueba", phone: "04141112233", password: "1234" }];
////                 localStorage.setItem('registeredBuyers', JSON.stringify(buyers));
//             }
//         window.registeredBuyers = buyers;
// 
//         window.currentBuyer = JSON.parse(localStorage.getItem('currentBuyer')) || null;
//         window.exchangeRate = parseFloat(localStorage.getItem('exchangeRate')) || 36.50;
//         window.mediationRequests = JSON.parse(localStorage.getItem('mediationRequests')) || [];
//         window.supportRatings = JSON.parse(localStorage.getItem('supportRatings')) || [];
//         window.supportAdmins = JSON.parse(localStorage.getItem('supportAdmins')) || [
//             { user: 'Master', pass: 'M@t302414**', role: 'master' }
//         ];
//         window.currentSupportAdmin = null;
//         window.supportLoggedIn = false;
//         window.cart = [];
// 
//         // --- 2. Helper Functions ---
//         window.getEl = function(id) { return document.getElementById(id); };
//         window.showToast = function(title, message) {
//             const toast = getEl('toast-notification');
//             getEl('toast-title').textContent = title;
//             getEl('toast-text').textContent = message;
//             toast.style.top = '20px';
//             setTimeout(() => { toast.style.top = '-100px'; }, 3000);
//         };
// 
//         // --- 3. Initialization ---
//         console.log('MercadoChat script.js: Initializing Complete System...');
//     } catch (e) {
//         console.error('Error loading state:', e);
//         // Fallback to minimal state
//         window.buyerOrders = [];
//         window.favorites = [];
//         window.myStoreData = { name: "Tienda de Prueba", phone: "04140000000", paymentMethods: [] };
//         window.myStorePaymentMethods = [];
//         window.currentStoreExcelItems = [];
//         window.sellerOrders = [];
//         window.sellerLoggedIn = false;
//         window.allGlobalOrders = [];
//         window.allRatings = [];
//         window.currentBuyer = null;
//         window.allRegisteredStores = [];
//         window.currentBuyer = null;
//         window.exchangeRate = 36.50;
//         window.mediationRequests = [];
//         window.supportRatings = [];
//         window.supportAdmins = [{ user: 'Master', pass: 'M@t302414**', role: 'master' }];
//         window.currentSupportAdmin = null;
//         window.supportLoggedIn = false;
//         window.cart = [];
//         
//         window.getEl = function(id) { return document.getElementById(id); };
//         window.showToast = function(title, message) {
//             const toast = getEl('toast-notification');
//             getEl('toast-title').textContent = title;
//             getEl('toast-text').textContent = message;
//             toast.style.top = '20px';
//             setTimeout(() => { toast.style.top = '-100px'; }, 3000);
//         };
//         
//         console.log('MercadoChat script.js: Initializing with fallback state...');
//     }
// };

// WITH THIS FIREBASE VERSION:
const initializeFirebaseState = async () => {
    try {
        // Initialize empty state objects (will be populated by listeners)
        window.buyerOrders = [];
        window.favorites = [];
        window.myStoreData = null;
        window.myStorePaymentMethods = [];
        window.currentStoreExcelItems = [];
        window.sellerOrders = [];
        window.allGlobalOrders = [];
        window.allRatings = [];
        window.registeredBuyers = [];
        window.exchangeRate = 36.50;
        window.mediationRequests = [];
        window.supportRatings = [];
        window.supportAdmins = [
            { uid: 'admin-master', email: 'master@mercadocchat.com', role: 'master', displayName: 'Master Admin' }
        ];
        window.cart = [];

        // Helper functions (keep existing or replace with these)
        window.getEl = function(id) { return document.getElementById(id); };
        window.showToast = function(title, message) {
            const toast = getEl('toast-notification');
            if (!toast) return;
            getEl('toast-title').textContent = title;
            getEl('toast-text').textContent = message;
            toast.style.top = '20px';
            setTimeout(() => { toast.style.top = '-100px'; }, 3000);
        };

        // Set up authentication state listener
        window.auth.onAuthStateChanged(async (user) => {
            if (user) {
                console.log('User signed in:', user.uid);
                window.currentUser = user;
                
                // Initialize Firestore listeners based on user role
                await initializeUserListeners(user);
                
                // Update UI based on current view
                await updateUIForAuthState();
            } else {
                console.log('User signed out');
                window.currentUser = null;
                // Clear listeners to prevent memory leaks
                cleanupFirestoreListeners();
                // Reset state to logged-out versions
                window.myStoreData = null;
                window.currentBuyer = null;
                // Optionally redirect to home/login
                if (getEl('login-modal') && getEl('login-modal').style.display !== 'none') {
                    // Already in login modal, do nothing
                } else if (getEl('buyer-login-modal') && getEl('buyer-login-modal').style.display !== 'none') {
                    // Already in buyer login modal
                } else {
                    switchMainView('home-view');
                    closeLoginModal();
                    closeBuyerLogin();
                }
            }
        });

        // Trigger initial auth check
        await new Promise(resolve => {
            const unsubscribe = window.auth.onAuthStateChanged(() => {
                unsubscribe();
                resolve();
            });
        });

        console.log('MercadoChat script.js: Firebase initialization complete');
    } catch (e) {
        console.error('Firebase initialization error:', e);
        showToast('Error', 'Failed to initialize app. Please check connection.');
        // Fallback to localStorage version if Firebase fails
        window.loadState = loadStateFallback; // Define this if you want localStorage fallback
        loadStateFallback();
    }
};

// Fallback localStorage function (optional)
const loadStateFallback = () => {
    try {
        window.buyerOrders = JSON.parse(localStorage.getItem('buyerOrders')) || [];
        window.favorites = JSON.parse(localStorage.getItem('favorites')) || [];
        
        let store = JSON.parse(localStorage.getItem('myStoreData'));
        if (!store || !store.phone || store.phone === "") {
            store = { name: "Tienda de Prueba", phone: "04140000000", password: "1234", paymentMethods: [] };
            localStorage.setItem('myStoreData', JSON.stringify(store));
        }
        window.myStoreData = store;
        window.myStorePaymentMethods = store.paymentMethods || [];
        
        window.currentStoreExcelItems = JSON.parse(localStorage.getItem('currentStoreExcelItems')) || [];
        window.sellerOrders = JSON.parse(localStorage.getItem('sellerOrders')) || [];
        window.sellerLoggedIn = localStorage.getItem('sellerLoggedIn') === 'true';
        window.allGlobalOrders = JSON.parse(localStorage.getItem('allGlobalOrders')) || [];
        window.allRatings = JSON.parse(localStorage.getItem('allRatings')) || [];
        window.currentBuyer = JSON.parse(localStorage.getItem('currentBuyer')) || null;
        window.allRegisteredStores = JSON.parse(localStorage.getItem('allRegisteredStores')) || [
            { name: 'iTech Store', category: 'Tecnología', description: 'Expertos en Apple y accesorios.', phone: '584140000000', logo: 'https://images.unsplash.com/photo-1695048133142-1a20484d256e?auto=format&fit=crop&w=150&q=80', verified: true, paymentMethods: [] },
            { name: 'SportCenter', category: 'Moda', description: 'Ropa deportiva de alta calidad.', phone: '584140000000', logo: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=150&q=80', verified: true, paymentMethods: [] }
        ];
        
        let buyers = JSON.parse(localStorage.getItem('registeredBuyers')) || [];
        if (buyers.length === 0) {
            buyers = [{ name: "Usuario Prueba", phone: "04141112233", password: "1234" }];
            localStorage.setItem('registeredBuyers', JSON.stringify(buyers));
        }
        window.registeredBuyers = buyers;
        
        window.currentBuyer = JSON.parse(localStorage.getItem('currentBuyer')) || null;
        window.exchangeRate = parseFloat(localStorage.getItem('exchangeRate')) || 36.50;
        window.mediationRequests = JSON.parse(localStorage.getItem('mediationRequests')) || [];
        window.supportRatings = JSON.parse(localStorage.getItem('supportRatings')) || [];
        window.supportAdmins = JSON.parse(localStorage.getItem('supportAdmins')) || [
            { user: 'Master', pass: 'M@t302414**', role: 'master' }
        ];
        window.currentSupportAdmin = null;
        window.supportLoggedIn = false;
        window.cart = [];
        
        window.getEl = function(id) { return document.getElementById(id); };
        window.showToast = function(title, message) {
            const toast = getEl('toast-notification');
            getEl('toast-title').textContent = title;
            getEl('toast-text').textContent = message;
            toast.style.top = '20px';
            setTimeout(() => { toast.style.top = '-100px'; }, 3000);
        };
        
        console.log('MercadoChat script.js: Using localStorage fallback');
    } catch (e) {
        console.error('Error in fallback state:', e);
        // Minimal viable state
        window.buyerOrders = [];
        window.favorites = [];
        window.myStoreData = { name: "Tienda de Prueba", phone: "04140000000", paymentMethods: [] };
        window.myStorePaymentMethods = [];
        window.currentStoreExcelItems = [];
        window.sellerOrders = [];
        window.allGlobalOrders = [];
        window.allRatings = [];
        window.currentBuyer = null;
        window.allRegisteredStores = [];
        window.currentBuyer = null;
        window.exchangeRate = 36.50;
        window.mediationRequests = [];
        window.supportRatings = [];
        window.supportAdmins = [{ user: 'Master', pass: 'M@t302414**', role: 'master' }];
        window.currentSupportAdmin = null;
        window.supportLoggedIn = false;
        window.cart = [];
        
        window.getEl = function(id) { return document.getElementById(id); };
        window.showToast = function(title, message) {
            const toast = getEl('toast-notification');
            getEl('toast-title').textContent = title;
            getEl('toast-text').textContent = message;
            toast.style.top = '20px';
            setTimeout(() => { toast.style.top = '-100px'; }, 3000);
        };
    }
};

// Initialize Firestore listeners for current user
async function initializeUserListeners(user) {
    cleanupFirestoreListeners(); // Clean previous listeners
    
    try {
        // Determine user role from custom claims or database
        const userDoc = await window.db.collection('users').doc(user.uid).get();
        let userRole = 'comprador'; // default
        
        if (userDoc.exists) {
            userRole = userDoc.data().role || 'comprador';
        } else {
            // Create user document if doesn't exist (first time login)
            await window.db.collection('users').doc(user.uid).set({
                uid: user.uid,
                phone: user.phoneNumber,
                displayName: user.displayName || null,
                role: 'comprador', // default role
                createdAt: firebase.firestore.FieldValue.serverTimestamp()
            });
            userRole = 'comprador';
        }
        
        // Set up listeners based on role
        if (userRole === 'vendedor' || userRole === 'ambos') {
            setupStoreListeners(user.uid);
        }
        
        // All users can have buyer-related data
        setupBuyerListeners(user.uid);
        
        // Global data (orders, ratings, etc.) - listen for all
        setupGlobalListeners();
        
    } catch (error) {
        console.error('Error initializing user listeners:', error);
    }
}

function cleanupFirestoreListeners() {
    // Call these functions to unsubscribe (defined below)
    if (window.unsubscribeStore) { window.unsubscribeStore(); window.unsubscribeStore = null; }
    if (window.unsubscribeProducts) { window.unsubscribeProducts(); window.unsubscribeProducts = null; }
    if (window.unsubscribeSellerOrders) { window.unsubscribeSellerOrders(); window.unsubscribeSellerOrders = null; }
    if (window.unsubscribeBuyerOrders) { window.unsubscribeBuyerOrders(); window.unsubscribeBuyerOrders = null; }
    if (window.unsubscribeAllOrders) { window.unsubscribeAllOrders(); window.unsubscribeAllOrders = null; }
    if (window.unsubscribeRatings) { window.unsubscribeRatings(); window.unsubscribeRatings = null; }
    if (window.unsubscribeStores) { window.unsubscribeStores(); window.unsubscribeStores = null; }
}

// Store-specific listeners
function setupStoreListeners(storeId) {
    // Store profile
    window.unsubscribeStore = window.db.collection('stores').doc(storeId)
        .onSnapshot(doc => {
            if (doc.exists) {
                window.myStoreData = { id: doc.id, ...doc.data() };
                // Update UI elements if store view is visible
                if (getEl('store-view') && getEl('store-view').style.display !== 'none') {
                    renderStoreProfile();
                }
                if (getEl('edit-store-modal') && getEl('edit-store-modal').style.display !== 'none') {
                    // Pre-fill edit form
                }
            } else {
                // Store document doesn't exist - user needs to create profile
                if (getEl('create-profile-view') && getEl('create-profile-view').style.display === 'none') {
                    // Only show if not already in create view
                    switchMainView('create-profile-view');
                }
            }
        });
    
    // Store products (subcollection)
    window.unsubscribeProducts = window.db.collection('stores').doc(storeId)
        .collection('products')
        .orderBy('createdAt', 'desc')
        .onSnapshot(snapshot => {
            window.currentStoreProducts = [];
            snapshot.forEach(doc => {
                window.currentStoreProducts.push({ id: doc.id, ...doc.data() });
            });
            // Update inventory views
            if (getEl('dashboard-inventory-container') && 
                getEl('dashboard-inventory-container').parentElement.style.display !== 'none') {
                renderSellerInventory();
            }
            if (getEl('store-products-grid') && 
                getEl('store-view').style.display !== 'none') {
                renderStoreProductsGrid();
            }
        });
}

// Buyer-specific listeners
function setupBuyerListeners(buyerId) {
    // Buyer orders
    window.unsubscribeBuyerOrders = window.db.collection('orders')
        .where('buyerId', '==', buyerId)
        .orderBy('createdAt', 'desc')
        .onSnapshot(snapshot => {
            window.buyerOrders = [];
            snapshot.forEach(doc => {
                window.buyerOrders.push({ id: doc.id, ...doc.data() });
            });
            renderBuyerOrders();
        });
    
    // Favorites
    window.unsubscribeFavorites = window.db.collection('users').doc(buyerId)
        .collection('favorites')
        .onSnapshot(snapshot => {
            window.favorites = [];
            snapshot.forEach(doc => {
                window.favorites.push({ id: doc.id, ...doc.data() });
            });
            renderFavorites();
        });
}

// Global listeners (visible to all authenticated users)
function setupGlobalListeners() {
    // All orders (for admin/support views)
    window.unsubscribeAllOrders = window.db.collection('orders')
        .orderBy('createdAt', 'desc')
        .onSnapshot(snapshot => {
            window.allGlobalOrders = [];
            snapshot.forEach(doc => {
                window.allGlobalOrders.push({ id: doc.id, ...doc.data() });
            });
            // Update admin/seller orders views if visible
            if (getEl('seller-orders-container') && 
                getEl('dash-orders') && getEl('dash-orders').style.display !== 'none') {
                renderSellerOrders();
            }
        });
    
    // All ratings
    window.unsubscribeRatings = window.db.collection('ratings')
        .orderBy('createdAt', 'desc')
        .onSnapshot(snapshot => {
            window.allRatings = [];
            snapshot.forEach(doc => {
                window.allRatings.push({ id: doc.id, ...doc.data() });
            });
            // Update rating displays if needed
        });
    
    // All stores (for discovery)
    window.unsubscribeStores = window.db.collection('stores')
        .where('verified', '==', true)
        .onSnapshot(snapshot => {
            window.allRegisteredStores = [];
            snapshot.forEach(doc => {
                window.allRegisteredStores.push({ id: doc.id, ...doc.data() });
            });
            // Update store discovery views
            if (getEl('stores-container') && 
                getEl('stores-view') && getEl('stores-view').style.display !== 'none') {
                renderStoresGrid();
            }
        });
}

// Update UI based on auth state (call after auth change)
async function updateUIForAuthState() {
    // Close any open modals
    closeLoginModal();
    closeBuyerLogin();
    closeSupportLogin();
    closeCreateProfile();
    closeEditStoreModal();
    closeEditProductModal();
    closePaymentModal();
    closeViewReceiptModal();
    closeMediationModal();
    closeDisputeDetailsModal();
    closeRatingModal();
    closeCheckoutForm();
    
    // If no user, show home view
    if (!window.currentUser) {
        switchMainView('home-view');
        return;
    }
    
    // If we have user data, determine appropriate view
    const userDoc = await window.db.collection('users').doc(window.currentUser.uid).get();
    const userRole = userDoc.exists ? userDoc.data().role : 'comprador';
    
    // Default to home view - specific views will be shown by navigation functions
    switchMainView('home-view');
    
    // Update header names if elements exist
    updateHeaderNames();
}

// Initialize the app when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    initializeFirebaseState();
});

// --- REPLACE THESE AUTH FUNCTIONS ---

// REPLACE processLogin() with Firebase phone auth
window.processLogin = async () => {
    const phoneInput = getEl('login-phone');
    const passwordInput = getEl('login-password'); // We'll use this for verification code in phone auth flow
    
    let phoneNumber = phoneInput.value.trim();
    if (!phoneNumber) {
        showToast('Error', 'Please enter your phone number');
        return;
    }
    
    // Format phone number (add +58 if missing and assuming Venezuela)
    if (!phoneNumber.startsWith('+')) {
        phoneNumber = '+58' + phoneNumber.replace(/\D/g, '');
    }
    
    // For development with test numbers:
    // Use Firebase test phone numbers configured in console
    // Format: +1XXXXXXXXXX for US test numbers, or your country's test format
    
    try {
        showToast('Info', 'Sending verification code...');
        
        // Initialize reCAPTCHA verifier (required for production)
        // For simplicity in this example, we'll assume test environment
        // In production, you need to set up reCAPTCHA:
        // window.recaptchaVerifier = new firebase.auth.RecaptchaVerifier('recaptcha-container');
        // const confirmationResult = await firebase.auth().signInWithPhoneNumber(phoneNumber, window.recaptchaVerifier);
        
        // For immediate testing without reCAPTCHA setup:
        // Use Firebase test numbers - replace with your actual test number from console
        const testNumber = '+584140000000'; // Example test number
        if (phoneNumber === testNumber) {
            // Simulate sending code - in real app this would send SMS
            showToast('Info', 'Verification code sent (test mode)');
            // Store verification ID for later confirmation
            window.currentVerificationId = firebase.auth().applyActionCode(
                // This is simplified - actual flow is more complex
                // For demo purposes, we'll proceed to confirmation
            );
            
            // Change UI to ask for code
            getEl('login-phone').disabled = true;
            getEl('login-password').placeholder = 'Enter verification code';
            getEl('login-password').type = 'text';
            getEl('login-password').value = '';
            const loginBtn = document.querySelector('#login-modal .btn-primary');
            loginBtn.textContent = 'Verify';
            loginBtn.onasyncclick = verifyLoginCode; // We'll define this below
            return;
        }
        
        // Real production flow would go here
        showToast('Error', 'Please configure reCAPTCHA for production phone auth');
    } catch (error) {
        console.error('Login error:', error);
        showToast('Error', 'Failed to send verification code: ' + error.message);
    }
};

// REPLACE processBuyerLogin() with similar Firebase logic
window.processBuyerLogin = async () => {
    // Same as processLogin but for buyer view
    await processLogin(); // Reuse same logic
};

// NEW: Verify login code function
window.verifyLoginCode = async () => {
    const code = getEl('login-password').value.trim();
    if (!code || code.length < 6) {
        showToast('Error', 'Please enter a valid 6+ digit code');
        return;
    }
    
    try {
        // In real implementation:
        // const credential = firebase.auth.PhoneAuthProvider.credential(
        //     window.currentVerificationId, 
        //     code
        // );
        // await firebase.auth().signInWithCredential(credential);
        
        // For test mode simulation:
        if (code === '123456' && getEl('login-phone').value.includes('4140000000')) {
            showToast('Success', 'Welcome back!');
            closeLoginModal();
            // Auth state change will handle redirect
            return;
        }
        
        showToast('Error', 'Invalid verification code');
    } catch (error) {
        console.error('Verification error:', error);
        showToast('Error', 'Invalid verification code: ' + error.message);
    }
};

// Keep your existing closeLoginModal etc. functions - they still work
// But now they'll trigger auth state changes when user signs out

// REPLACE logout functions
window.logoutSeller = async () => {
    try {
        await window.auth.signOut();
        showToast('Info', 'You have been signed out');
    } catch (error) {
        console.error('Logout error:', error);
        showToast('Error', 'Failed to sign out');
    }
};

window.logoutBuyer = async () => {
    try {
        await window.auth.signOut();
        showToast('Info', 'You have been signed out');
    } catch (error) {
        console.error('Logout error:', error);
        showToast('Error', 'Failed to sign out');
    }
};

window.logoutSupport = async () => {
    try {
        await window.auth.signOut();
        showToast('Info', 'You have been signed out');
    } catch (error) {
        console.error('Logout error:', error);
        showToast('Error', 'Failed to sign out');
    }
};

// --- REPLACE DATA FUNCTIONS WITH FIREBASE VERSIONS ---

// REPLACE saveProductData() - this is where you add/edit products
window.saveProductData = async () => {
    if (!window.currentUser) {
        showToast('Error', 'Please log in first');
        return;
    }
    
    try {
        const productData = {
            name: getEl('edit-product-name').value.trim(),
            detail: getEl('edit-product-detail').value.trim(),
            price_bs: parseFloat(getEl('edit-product-price-bs').value) || 0,
            price_usd: parseFloat(getEl('edit-product-price-usd').value) || 0,
            imageUrl: getEl('edit-product-image').value.trim(),
            storeId: window.currentUser.uid, // Owned by current user
            createdAt: firebase.firestore.FieldValue.serverTimestamp(),
            updatedAt: firebase.firestore.FieldValue.serverTimestamp()
        };
        
        // Validate
        if (!productData.name) {
            showToast('Error', 'Product name is required');
            return;
        }
        
        const productId = getEl('edit-product-index').value;
        let docRef;
        
        if (productId && productId !== '-1' && productId !== '') {
            // Update existing product
            docRef = window.db.collection('stores').window.currentUser.uid
                .collection('products').doc(productId);
            await docRef.update(productData);
            showToast('Success', 'Product updated');
        } else {
            // Add new product
            docRef = await window.db.collection('stores').window.currentUser.uid
                .collection('products')
                .add(productData);
            showToast('Success', 'Product added');
        }
        
        // Reset form
        getEl('edit-product-name').value = '';
        getEl('edit-product-detail').value = '';
        getEl('edit-product-price-bs').value = '';
        getEl('edit-product-price-usd').value = '';
        getEl('edit-product-image').value = '';
        getEl('edit-product-index').value = '-1';
        getEl('edit-product-modal-title').textContent = 'Add Product';
        
        // Close modal
        getEl('edit-product-modal').style.display = 'none';
        
    } catch (error) {
        console.error('Error saving product:', error);
        showToast('Error', 'Failed to save product: ' + error.message);
    }
};

// REPLACE submitPaymentReport() - for reporting payments
window.submitPaymentReport = async () => {
    if (!window.currentUser) {
        showToast('Error', 'Please log in first');
        return;
    }
    
    try {
        // Get form data
        const orderId = getEl('pm-summary-id').textContent.replace('Order #', '').trim();
        const method = getEl('pm-method-val').value;
        const reference = getEl('pm-ref').value.trim();
        
        if (!orderId || !method || !reference) {
            showToast('Error', 'Please fill in all payment fields');
            return;
        }
        
        // Create payment report document
        await window.db.collection('paymentReports').add({
            orderId: orderId,
            reportedBy: window.currentUser.uid,
            paymentMethod: method,
            transactionReference: reference,
            status: 'pending', // pending, verified, rejected
            reportedAt: firebase.firestore.FieldValue.serverTimestamp(),
            updatedAt: firebase.firestore.FieldValue.serverTimestamp()
        });
        
        showToast('Success', 'Payment report submitted');
        // Close modal and reset form
        getEl('payment-modal').style.display = 'none';
        getEl('report-payment-fields').style.display = 'none';
        getEl('pm-method-val').value = '';
        getEl('pm-ref').value = '';
        
    } catch (error) {
        console.error('Error submitting payment report:', error);
        showToast('Error', 'Failed to submit payment report: ' + error.message);
    }
};

// REPLACE other data functions similarly:
// - updateStoreProfile()
// - addPaymentMethod()
// - generateBankPDF()
// - submitMediationRequest()
// - submitUserRating()
// etc.

// KEY POINT: All data operations now go to Firestore instead of localStorage
// The listeners we set up earlier will automatically update the UI when data changes

// --- ADD THESE HELPER FUNCTIONS FOR COMMON OPERATIONS ---

// Helper to create a new store profile (for first-time sellers)
window.createStoreProfile = async (storeData) => {
    if (!window.currentUser) return;
    
    try {
        await window.db.collection('stores').doc(window.currentUser.uid).set({
            ...storeData,
            uid: window.currentUser.uid,
            phone: window.currentUser.phoneNumber,
            verified: false,
            createdAt: firebase.firestore.FieldValue.serverTimestamp(),
            updatedAt: firebase.firestore.FieldValue.serverTimestamp()
        });
        
        // Also update user role
        await window.db.collection('users').doc(window.currentUser.uid).update({
            role: 'vendedor'
        });
        
        showToast('Success', 'Store created successfully');
        switchMainView('dashboard-view');
    } catch (error) {
        console.error('Error creating store:', error);
        showToast('Error', 'Failed to create store: ' + error.message);
    }
};

// Helper to add product to cart (client-side only, then sync on checkout)
window.addToCart = (product) => {
    // Find if product already in cart
    const existingIndex = window.cart.findIndex(item => 
        item.id === product.id && 
        item.storeId === product.storeId
    );
    
    if (existingIndex >= 0) {
        // Increase quantity
        window.cart[existingIndex].quantity += 1;
    } else {
        // Add new item
        window.cart.push({
            ...product,
            quantity: 1
        });
    }
    
    updateCartUI();
    showToast('Added', `${product.name} added to cart`);
};

// Helper to create order from cart
window.createOrderFromCart = async (deliveryInfo) => {
    if (!window.currentUser) {
        showToast('Error', 'Please log in first');
        return null;
    }
    
    if (window.cart.length === 0) {
        showToast('Error', 'Your cart is empty');
        return null;
    }
    
    try {
        // Group cart items by storeId (assuming cart items have storeId)
        const itemsByStore = {};
        window.cart.forEach(item => {
            if (!itemsByStore[item.storeId]) {
                itemsByStore[item.storeId] = [];
            }
            itemsByStore[item.storeId].push(item);
        });
        
        // For simplicity, we'll handle one store per order
        // In reality, you might split cart by store
        const firstStoreId = Object.keys(itemsByStore)[0];
        const storeItems = itemsByStore[firstStoreId];
        
        // Calculate totals
        const totals_bs = storeItems.reduce((sum, item) => 
            sum + (item.price_bs * item.quantity), 0);
        const totals_usd = storeItems.reduce((sum, item) => 
            sum + (item.price_usd * item.quantity), 0);
        
        // Create order
        const orderData = {
            buyerId: window.currentUser.uid,
            storeId: firstStoreId,
            items: storeItems.map(item => ({
                productId: item.id,
                name: item.name,
                detail: item.detail || '',
                quantity: item.quantity,
                price_bs: item.price_bs,
                price_usd: item.price_usd,
                imageUrl: item.imageUrl || ''
            })),
            total_bs: totals_bs,
            total_usd: totals_usd,
            status: 'pendiente',
            deliveryMethod: deliveryInfo.method,
            deliveryAddress: deliveryInfo.address || '',
            createdAt: firebase.firestore.FieldValue.serverTimestamp(),
            updatedAt: firebase.firestore.FieldValue.serverTimestamp()
        };
        
        const docRef = await window.db.collection('orders').add(orderData);
        
        // Clear cart
        window.cart = [];
        updateCartUI();
        
        showToast('Success', `Order placed! Your order #${docRef.id} is pending`);
        return docRef.id;
        
    } catch (error) {
        console.error('Error creating order:', error);
        showToast('Error', 'Failed to create order: ' + error.message);
        return null;
    }
};

// --- REPLACE UI RENDER FUNCTIONS TO USE FIREBASE DATA ---

// These functions now read from Firebase-populated state instead of localStorage
// Example: renderSellerInventory() now uses window.currentStoreProducts
// Example: renderBuyerOrders() now uses window.buyerOrders
// etc.

// Keep your existing render functions but ensure they use:
// - window.myStoreData instead of localStorage.myStoreData
// - window.currentStoreProducts instead of localStorage.currentStoreItems
// - window.buyerOrders instead of localStorage.buyerOrders
// etc.

// The listeners we set up earlier will keep these arrays updated in real-time

console.log('MercadoChat Firebase integration code loaded');