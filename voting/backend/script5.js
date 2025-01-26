document.getElementById('grievanceForm').addEventListener('submit', function(event) {
    event.preventDefault();

    let name = document.getElementById('name').value;
    let phone = document.getElementById('phone').value;
    let address = document.getElementById('address').value;
    let description = document.getElementById('description').value;
    let errorMessage = document.getElementById('errorMessage');
    
    // Basic validation
    if (!name || !phone || !address || !description) {
        errorMessage.textContent = 'All fields are required.';
        return;
    }
    
    if (!/^\d{10}$/.test(phone)) {
        errorMessage.textContent = 'Please enter a valid 10-digit phone number.';
        return;
    }

    // Simulate form submission (Replace with your back-end code or API)
    alert("Grievance submitted successfully!\nName: " + name + "\nPhone: " + phone + "\nAddress: " + address + "\nDescription: " + description);

    // Clear the form
    document.getElementById('grievanceForm').reset();
});