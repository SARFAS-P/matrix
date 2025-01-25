document.getElementById('authenticate-btn').addEventListener('click', function () {
    const voterId = document.getElementById('voter-id').value.trim();
  
    if (!voterId) {
        document.getElementById('auth-error').textContent = 'Please enter a valid Voter ID.';
        return;
    }
  
    fetch('http://localhost:3000/authenticate', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ voterId }),
    })
    .then(response => response.json())
    .then(data => {
        if (data.message === 'Authenticated successfully.') {
            document.getElementById('voter-id-section').style.display = 'none';
            document.getElementById('vote-section').style.display = 'block';
            populateCandidates();
            document.getElementById('auth-error').textContent = '';
        } else {
            document.getElementById('auth-error').textContent = data.message;
        }
    })
    .catch(error => {
        document.getElementById('auth-error').textContent = 'Error: ' + error.message;
    });
  });
  
  function populateCandidates() {
    const candidates = [
        { name: 'John Doe', symbol: '🗳️' },
        { name: 'Jane Smith', symbol: '⚖️' },
        { name: 'Bob Johnson', symbol: '🌟' }
    ];
  
    const candidateSelect = document.getElementById('candidate-select');
    candidateSelect.innerHTML = '<option value="" disabled selected>Select a candidate</option>';
  
    candidates.forEach((candidate, index) => {
        const option = document.createElement('option');
        option.value = index;
        option.textContent = `${candidate.name} ${candidate.symbol}`;
        candidateSelect.appendChild(option);
    });
  }
  
  document.getElementById('submit-vote-btn').addEventListener('click', function () {
    const candidateIndex = parseInt(document.getElementById('candidate-select').value);
    const voterId = document.getElementById('voter-id').value.trim();
  
    if (!voterId) {
        alert('Please authenticate first!');
        return;
    }
  
    if (isNaN(candidateIndex) || candidateIndex < 0 || candidateIndex >= 3) {
        alert('Please select a valid candidate.');
        return;
    }
  
    fetch('http://localhost:3000/submit-vote', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ voterId, candidateIndex }),
    })
    .then(response => response.json())
    .then(data => {
        if (data.message) {
            document.getElementById('vote-section').style.display = 'none';
            document.getElementById('confirmation-message').textContent = data.message;
            document.getElementById('confirmation-message').style.display = 'block';
            document.getElementById('back-to-id-btn').style.display = 'block'; // Show the back button
        } else {
            alert('Something went wrong. Please try again.');
        }
    })
    .catch(error => {
        alert('Error: ' + error.message);
    });
  });
  
  // Function to handle redirect to Voter ID page
  document.getElementById('back-to-id-btn').addEventListener('click', function () {
    // Hide the confirmation message and the back button
    document.getElementById('confirmation-message').style.display = 'none';
    document.getElementById('back-to-id-btn').style.display = 'none';
    
    // Show the Voter ID section again
    document.getElementById('voter-id-section').style.display = 'block';
    
    // Clear the Voter ID input and candidate selection
    document.getElementById('voter-id').value = '';
    document.getElementById('candidate-select').selectedIndex = 0;  // Reset candidate selection
  });
  