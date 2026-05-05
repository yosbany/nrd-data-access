// Authentication management for NRD Data Access Admin

// Global nrd instance - shared across all modules
window.nrd = null;

// Initialize NRD Data Access
function initAuth() {
  if (typeof NRDDataAccess === 'undefined') {
    console.error('NRDDataAccess no está disponible. Verifica que la librería se haya cargado correctamente.');
    document.body.innerHTML = '<div class="min-h-screen flex items-center justify-center bg-red-50"><div class="text-center"><h1 class="text-2xl font-bold text-red-600 mb-2">Error</h1><p class="text-gray-700">No se pudo cargar la librería NRD Data Access</p></div></div>';
    return null;
  }
  
  window.nrd = new NRDDataAccess();
  return window.nrd;
}

// Sign in
async function signIn(email, password) {
  if (!window.nrd) {
    throw new Error('NRD Data Access no está inicializado');
  }
  return await window.nrd.auth.signIn(email, password);
}

// Sign out
async function signOut() {
  if (!window.nrd) {
    throw new Error('NRD Data Access no está inicializado');
  }
  return await window.nrd.auth.signOut();
}

// Get current user
function getCurrentUser() {
  if (!window.nrd) {
    return null;
  }
  return window.nrd.auth.getCurrentUser();
}

// On auth state changed
function onAuthStateChanged(callback) {
  if (!window.nrd) {
    return () => {};
  }
  return window.nrd.auth.onAuthStateChanged(callback);
}

// Escape HTML to prevent XSS
function escapeHtml(text) {
  if (!text) return '';
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
}

// Show profile modal
function showProfileModal() {
  const modal = document.getElementById('profile-modal');
  const content = document.getElementById('profile-modal-content');
  
  if (!modal || !content) return;
  
  const user = getCurrentUser();
  if (!user) return;
  
  let userDataHtml = `
    <div class="space-y-3 sm:space-y-4">
      <div class="flex justify-between py-2 sm:py-3 border-b border-gray-200">
        <span class="text-gray-600 font-light text-sm sm:text-base">Email:</span>
        <span class="font-light text-sm sm:text-base">${escapeHtml(user.email || 'N/A')}</span>
      </div>
      ${user.displayName ? `
      <div class="flex justify-between py-2 sm:py-3 border-b border-gray-200">
        <span class="text-gray-600 font-light text-sm sm:text-base">Nombre:</span>
        <span class="font-light text-sm sm:text-base">${escapeHtml(user.displayName)}</span>
      </div>
      ` : ''}
    </div>
  `;
  
  content.innerHTML = userDataHtml;
  modal.classList.remove('hidden');
}

// Close profile modal
function closeProfileModal() {
  const modal = document.getElementById('profile-modal');
  if (modal) {
    modal.classList.add('hidden');
  }
}

// Profile button handler
document.addEventListener('DOMContentLoaded', () => {
  const profileBtn = document.getElementById('profile-btn');
  if (profileBtn) {
    profileBtn.addEventListener('click', () => {
      showProfileModal();
    });
  }

  const closeProfileModalBtn = document.getElementById('close-profile-modal');
  if (closeProfileModalBtn) {
    closeProfileModalBtn.addEventListener('click', () => {
      closeProfileModal();
    });
  }

  const profileLogoutBtn = document.getElementById('profile-logout-btn');
  if (profileLogoutBtn) {
    profileLogoutBtn.addEventListener('click', async () => {
      try {
        closeProfileModal();
        await signOut();
      } catch (error) {
        console.error('Error al cerrar sesión:', error);
        alert('Error al cerrar sesión: ' + error.message);
      }
    });
  }
});

