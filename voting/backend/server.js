const express = require('express');
const nodemailer = require('nodemailer');
const bodyParser = require('body-parser');
const cors = require('cors');  // Allow frontend to connect

const app = express();
const port = 3000;

// Middleware
app.use(cors());  // Enable CORS
app.use(bodyParser.json());

// In-memory voter database
let voterDatabase = {
  'ABC9876987': { hasVoted: false, vote: null }
};

const candidates = [
  { name: 'John Doe', symbol: '🗳️' },
  { name: 'Jane Smith', symbol: '⚖️' },
  { name: 'Bob Johnson', symbol: '🌟' }
];

// Nodemailer transporter setup (change with your email provider details)
const transporter = nodemailer.createTransport({
    service: 'gmail', // Or any other service like Outlook, etc.
    auth: {
        user: 'strangesathan@gmail.com',   // Replace with your email
        pass: 'sathan@2006'     // Replace with your email password
    }
});

// Authentication endpoint
app.post('/authenticate', (req, res) => {
  const { voterId } = req.body;

  if (voterDatabase[voterId]) {
    if (voterDatabase[voterId].hasVoted) {
      return res.status(400).json({ message: 'You have already voted.' });
    } else {
      return res.status(200).json({ message: 'Authenticated successfully.' });
    }
  } else {
    return res.status(400).json({ message: 'Invalid Voter ID. Please try again.' });
  }
});

// Vote submission endpoint
app.post('/submit-vote', (req, res) => {
  const { voterId, candidateIndex } = req.body;

  if (!voterDatabase[voterId]) {
    return res.status(400).json({ message: 'Invalid Voter ID.' });
  }

  if (voterDatabase[voterId].hasVoted) {
    return res.status(400).json({ message: 'You have already voted.' });
  }

  if (candidateIndex < 0 || candidateIndex >= candidates.length) {
    return res.status(400).json({ message: 'Invalid candidate selection.' });
  }

  voterDatabase[voterId].hasVoted = true;
  voterDatabase[voterId].vote = candidates[candidateIndex];

  return res.status(200).json({ message: `You voted for: ${candidates[candidateIndex].name} ${candidates[candidateIndex].symbol}` });
});

// Handle POST request for grievance submission
app.post('/submit-grievance', (req, res) => {
    const { name, phone, address, description } = req.body;

    // Construct the email content
    const mailOptions = {
        from: 'strangesathan@gmail.com',  // sender address
        to: 'vighnesh730@gmail.com', // Change to the email you want to receive the grievances
        subject: 'New Grievance Ticket Submission',
        text: `
        New grievance ticket received:

        Name: ${name}
        Phone: ${phone}
        Address: ${address}
        Grievance Description:
        ${description}
        `
    };

    // Send email with the form data
    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            console.log(error);
            return res.status(500).send('Error sending email');
        }
        console.log('Email sent: ' + info.response);
        res.status(200).send('Grievance submitted successfully!');
    });
});

// Start the server
app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
