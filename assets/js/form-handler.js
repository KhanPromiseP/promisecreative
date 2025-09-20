// Contact form submission handling
document.getElementById('contactForm').addEventListener('submit', async function(e) {
    e.preventDefault(); // This prevents the page refresh
    
    const submitBtn = document.getElementById('submitBtn');
    const submitText = document.getElementById('submitText');
    const loadingSpinner = document.getElementById('loadingSpinner');
    const messageContainer = document.getElementById('messageContainer');
    
    // Show loading state
    submitText.style.display = 'none';
    loadingSpinner.style.display = 'inline-block';
    submitBtn.disabled = true;
    messageContainer.innerHTML = '';

    // Get form data
    const formData = new FormData(this);
    const data = {
        name: formData.get('name'),
        email: formData.get('email'),
        message: formData.get('message')
    };

    try {
        const response = await fetch('/.netlify/functions/send-email', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data)
        });

        // First, check if we got a successful response
        if (!response.ok) {
            // If we got a 404, the function doesn't exist
            if (response.status === 404) {
                throw new Error('Contact form is temporarily unavailable. Please email us directly.');
            }
            throw new Error(`Server returned ${response.status} error`);
        }

        // Try to parse as JSON
        const result = await response.json();

        // Success message
        messageContainer.innerHTML = `
            <div class="alert alert-success">
                <i class="bi bi-check-circle"></i>
                Thank you for your message! I'll get back to you soon.
            </div>
        `;
        this.reset();
        
    } catch (error) {
        console.error('Error:', error);
        messageContainer.innerHTML = `
            <div class="alert alert-danger">
                <i class="bi bi-exclamation-circle"></i>
                ${error.message || 'Something went wrong. Please try emailing us directly.'}
            </div>
        `;
    } finally {
        // Reset loading state
        submitText.style.display = 'inline-block';
        loadingSpinner.style.display = 'none';
        submitBtn.disabled = false;
    }
});