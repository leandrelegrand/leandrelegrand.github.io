

const form = document.querySelector('.contact-form');
const statusEl = document.getElementById('status');

if (form) {
  form.addEventListener('submit', function(e) {
    const isFormspree = this.action.includes('formspree');
    
    if (isFormspree) {
      
      statusEl.textContent = 'Envoi en cours...';
      statusEl.classList.add('show');
    }
  });

  
  form.addEventListener('formSubmitted', function() {
    statusEl.textContent = '✓ Message envoyé avec succès ! Merci.';
    statusEl.classList.add('show', 'success');
    form.reset();
    setTimeout(() => statusEl.classList.remove('show'), 5000);
  });

  form.addEventListener('formError', function() {
    statusEl.textContent = '✗ Erreur lors de l\'envoi. Réessayez.';
    statusEl.classList.add('show', 'error');
  });
}