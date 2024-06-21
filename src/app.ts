import express, { Request, Response } from 'express';
import bodyParser from 'body-parser';
import fs from 'fs';

const app = express();
const port = 3000;

// Middleware to parse JSON body
app.use(bodyParser.json());






// Ping endpoint
app.get('/ping', (req: Request, res: Response) => {
  res.json({ success: true });
});





// Submit endpoint
app.post('/submit', (req: Request, res: Response) => {
  const { name, email, phone, github, stopwatch_time } = req.body;
  if (!name || !email || !phone || !github || !stopwatch_time) 
  {
      return res.status(400).json({ error: 'All fields are required.' });
  }

  const formattedStopwatchTime = stopwatch_time.split('.')[0];

  let submissions = [];
  try {
    const data = fs.readFileSync('db.json', 'utf8');
    submissions = JSON.parse(data);
  } catch (err) {
    console.error('Error reading db.json:', err);
  }

  const newSubmission = { name, email, phone, github, stopwatch_time: formattedStopwatchTime };
  submissions.push(newSubmission);
  fs.writeFile('db.json', JSON.stringify(submissions), 'utf8', (err) => {
    if (err) {
      console.error('Error writing to db.json:', err);
      return res.status(500).json({ error: 'Internal server error.' });
    }
    res.json({ success: true });
  });
});









// Read endpoint
app.get('/read', (req: Request, res: Response) => {
  const { index } = req.query;
  if (!index || isNaN(Number(index))) {
    return res.status(400).json({ error: 'Invalid index.' });
  }

  
  let submissions = [];
  try {
    const data = fs.readFileSync('db.json', 'utf8');
    submissions = JSON.parse(data);
  } catch (err) {
    console.error('Error reading db.json:', err);
  }

   
  const submissionIndex = Number(index);
  if (submissionIndex < 0 || submissionIndex >= submissions.length) {
    return res.status(404).json({ error: 'Submission not found.' });
  }

  const submission = submissions[submissionIndex];
  console.log("Returning submission:", JSON.stringify(submission)); // Log the JSON data
  res.json(submission);
});









// Delete endpoint
app.delete('/delete', (req: Request, res: Response) => {
  const { index } = req.query;
  if (!index || isNaN(Number(index))) {
    return res.status(400).json({ error: 'Invalid index.' });
  }

  
  let submissions = [];
  try {
    const data = fs.readFileSync('db.json', 'utf8');
    submissions = JSON.parse(data);
  } catch (err) {
    console.error('Error reading db.json:', err);
  }

  
  const submissionIndex = Number(index);
  if (submissionIndex < 0 || submissionIndex >= submissions.length) {
    return res.status(404).json({ error: 'Submission not found.' });
  }

  submissions.splice(submissionIndex, 1);

   
  fs.writeFile('db.json', JSON.stringify(submissions), 'utf8', (err) => {
    if (err) {
      console.error('Error writing to db.json:', err);
      return res.status(500).json({ error: 'Internal server error.' });
    }
    res.json({ success: true });
  });
});






// Edit endpoint
app.put('/edit', (req: Request, res: Response) => {
  const { index } = req.query;
  const { name, email, phone, github, stopwatch_time } = req.body;

  if (!index || isNaN(Number(index))) {
    return res.status(400).json({ error: 'Invalid index.' });
  }

   
  if (!name || !email || !phone || !github || !stopwatch_time) {
    return res.status(400).json({ error: 'All fields are required.' });
  }

   
  const formattedStopwatchTime = stopwatch_time.split('.')[0];

   
  let submissions = [];
  try {
    const data = fs.readFileSync('db.json', 'utf8');
    submissions = JSON.parse(data);
  } catch (err) {
    console.error('Error reading db.json:', err);
  }

   
  const submissionIndex = Number(index);
  if (submissionIndex < 0 || submissionIndex >= submissions.length) {
    return res.status(404).json({ error: 'Submission not found.' });
  }

  submissions[submissionIndex] = { name, email, phone, github, stopwatch_time: formattedStopwatchTime };

  
  fs.writeFile('db.json', JSON.stringify(submissions), 'utf8', (err) => {
    if (err) {
      console.error('Error writing to db.json:', err);
      return res.status(500).json({ error: 'Internal server error.' });
    }
    res.json({ success: true });
  });
});






// Search endpoint
app.get('/search', (req: Request, res: Response) => {
  const { email } = req.query;
  if (!email) {
    return res.status(400).json({ error: 'Email is required.' });
  }

   
  let submissions = [];
  try {
    const data = fs.readFileSync('db.json', 'utf8');
    submissions = JSON.parse(data);
  } catch (err) {
    console.error('Error reading db.json:', err);
  }

  
  const results = submissions.filter((submission: any) => submission.email === email);
  res.json(results);
});





// Start the server
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
