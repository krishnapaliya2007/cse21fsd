import express from 'express';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = 3000;
const DATA_FILE = path.join(__dirname, 'requests.json');

app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// Helper function to read from requests.json
function getRequests() {
  if (!fs.existsSync(DATA_FILE)) {
    fs.writeFileSync(DATA_FILE, JSON.stringify([]));
  }
  const data = fs.readFileSync(DATA_FILE, 'utf-8');
  return JSON.parse(data || '[]');
}

// Helper function to save to requests.json
function saveRequests(requests) {
  fs.writeFileSync(DATA_FILE, JSON.stringify(requests, null, 2));
}

// GET /api/requests - Get all requests
app.get('/api/requests', (req, res) => {
  try {
    const requests = getRequests();
    res.json(requests);
  } catch (error) {
    res.status(500).json({ error: 'Failed to read requests' });
  }
});

// GET /api/requests/:id - Get a single request by id
app.get('/api/requests/:id', (req, res) => {
  try {
    const requests = getRequests();
    const request = requests.find((r) => r.id === req.params.id);
    if (!request) {
      return res.status(404).json({ error: 'Request not found' });
    }
    res.json(request);
  } catch (error) {
    res.status(500).json({ error: 'Failed to read request' });
  }
});

// POST /api/requests - Create a new request
app.post('/api/requests', (req, res) => {
  try {
    const { studentName, email, category, problemDescription, priority } = req.body;
    
    if (!studentName || !email || !category || !problemDescription || !priority) {
      return res.status(400).json({ error: 'All fields are required' });
    }

    const requests = getRequests();
    const newRequest = {
      id: Date.now().toString(),
      studentName,
      email,
      category,
      problemDescription,
      priority
    };

    requests.push(newRequest);
    saveRequests(requests);
    res.status(201).json(newRequest);
  } catch (error) {
    res.status(500).json({ error: 'Failed to save request' });
  }
});

// PUT /api/requests/:id - Update an existing request
app.put('/api/requests/:id', (req, res) => {
  try {
    const requests = getRequests();
    const index = requests.findIndex((r) => r.id === req.params.id);

    if (index === -1) {
      return res.status(404).json({ error: 'Request not found' });
    }

    const { studentName, email, category, problemDescription, priority } = req.body;

    requests[index] = {
      ...requests[index],
      studentName: studentName || requests[index].studentName,
      email: email || requests[index].email,
      category: category || requests[index].category,
      problemDescription: problemDescription || requests[index].problemDescription,
      priority: priority || requests[index].priority
    };

    saveRequests(requests);
    res.json(requests[index]);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update request' });
  }
});

// DELETE /api/requests/:id - Delete a request
app.delete('/api/requests/:id', (req, res) => {
  try {
    const requests = getRequests();
    const updatedRequests = requests.filter((r) => r.id !== req.params.id);

    if (requests.length === updatedRequests.length) {
      return res.status(404).json({ error: 'Request not found' });
    }

    saveRequests(updatedRequests);
    res.json({ message: 'Request deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete request' });
  }
});

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
