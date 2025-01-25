document.getElementById('adminLoginForm').addEventListener('submit', function(event) {
    event.preventDefault(); // Prevent the form from submitting the traditional way
    
    // Get values entered in the input fields
    const username = document.getElementById('adminUsername').value.trim();
    const password = document.getElementById('adminPassword').value.trim();
    
    // Define hardcoded admin credentials (you can replace this with a server-side check)
    const validAdminUsername = "admin";
    const validAdminPassword = "admin123";
    
    // Validate the credentials
    if (username === validAdminUsername && password === validAdminPassword) {
        // If credentials are valid, redirect to the admin dashboard or another page
        window.location.href = "discussion/admin-dashboard.html"; // Redirect to admin dashboard
    } else {
        // If credentials are invalid, show an error message
        alert("Invalid admin credentials. Please try again.");
    }
});
