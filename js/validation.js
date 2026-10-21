/**
 * VELOURA PMU & BROW STUDIO - FORM VALIDATION ENGINE
 */

const PMUValidation = (function() {
  function validateEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(String(email).toLowerCase());
  }

  function validatePhone(phone) {
    const cleaned = String(phone).replace(/[^\d+]/g, '');
    return cleaned.length >= 7;
  }

  function validateName(name) {
    if (!name || typeof name !== 'string') return false;
    const trimmed = name.trim();
    if (trimmed.length < 2) return false;
    // Prevent numeric-only or entries without alphabetical letters
    if (/^\d+$/.test(trimmed)) return false;
    if (!/[a-zA-Z\u00C0-\u024F\u1E00-\u1EFF]/.test(trimmed)) return false;
    if (/^[0-9\W]+$/.test(trimmed)) return false;
    return true;
  }

  function validateForm(form) {
    let isValid = true;
    const inputs = form.querySelectorAll('input, select, textarea');

    inputs.forEach(input => {
      // Clear previous error
      input.classList.remove('is-invalid');
      const errEl = input.parentElement.querySelector('.invalid-feedback');
      if (errEl) errEl.style.display = 'none';

      // Check required
      if (input.hasAttribute('required')) {
        if (input.type === 'checkbox' && !input.checked) {
          showError(input, 'You must accept this field to proceed.');
          isValid = false;
        } else if (!input.value.trim()) {
          showError(input, 'This field is required.');
          isValid = false;
        }
      }

      // Check name fields
      const isNameField = input.type === 'text' && (
        (input.id && /name/i.test(input.id)) ||
        (input.name && /name/i.test(input.name)) ||
        (input.getAttribute('autocomplete') && /name/i.test(input.getAttribute('autocomplete')))
      );
      if (isNameField && input.value.trim()) {
        if (!validateName(input.value)) {
          showError(input, 'Please enter a valid full name (letters only, cannot be numbers only).');
          isValid = false;
        }
      }

      // Check email
      if (input.type === 'email' && input.value.trim()) {
        if (!validateEmail(input.value)) {
          showError(input, 'Please enter a valid email address.');
          isValid = false;
        }
      }

      // Check phone
      if (input.type === 'tel' && input.value.trim()) {
        if (!validatePhone(input.value)) {
          showError(input, 'Please enter a valid telephone number.');
          isValid = false;
        }
      }

      // Check password min length
      if ((input.type === 'password' || (input.id && input.id.toLowerCase().includes('password'))) && input.value && input.minLength) {
        if (input.value.length < input.minLength) {
          showError(input, `Password must be at least ${input.minLength} characters.`);
          isValid = false;
        }
      }
    });

    return isValid;
  }

  function showError(input, message) {
    input.classList.add('is-invalid');
    let errEl = input.parentElement.querySelector('.invalid-feedback');
    if (!errEl) {
      errEl = document.createElement('div');
      errEl.className = 'invalid-feedback text-danger';
      errEl.style.fontSize = '0.82rem';
      errEl.style.marginTop = '0.35rem';
      input.parentElement.appendChild(errEl);
    }
    errEl.textContent = message;
    errEl.style.display = 'block';
  }

  function clearErrors(form) {
    form.querySelectorAll('.is-invalid').forEach(el => el.classList.remove('is-invalid'));
    form.querySelectorAll('.invalid-feedback').forEach(el => el.style.display = 'none');
  }

  return {
    validateForm,
    validateName,
    validateEmail,
    validatePhone,
    showError,
    clearErrors
  };
})();

window.PMUValidation = PMUValidation;
