const form = document.getElementById('requestForm');
const formTitle = document.getElementById('formTitle');
const submitBtn = document.getElementById('submitBtn');
const cancelEditBtn = document.getElementById('cancelEditBtn');
const requestsList = document.getElementById('requestsList');

const requestIdInput = document.getElementById('requestId');
const studentNameInput = document.getElementById('studentName');
const emailInput = document.getElementById('email');
const categoryInput = document.getElementById('category');
const priorityInput = document.getElementById('priority');
const problemDescriptionInput = document.getElementById('problemDescription');

let isEditing = false;

// 1. Get all requests using fetch()
async function getRequests() {
  try {
    const response = await fetch('/api/requests');
    const data = await response.json();
    displayRequests(data);
  } catch (error) {
    console.error('Error fetching requests:', error);
  }
}

// Display requests below the form
function displayRequests(requests) {
  requestsList.innerHTML = '';

  if (requests.length === 0) {
    requestsList.innerHTML = '<p>No requests submitted yet.</p>';
    return;
  }

  requests.forEach((req) => {
    const card = document.createElement('div');
    card.className = 'request-card';

    card.innerHTML = `
      <div class="request-details">
        <h3>${escapeHtml(req.studentName)}</h3>
        <p><strong>Email:</strong> ${escapeHtml(req.email)}</p>
        <p><strong>Category:</strong> ${escapeHtml(req.category)}</p>
        <p><strong>Priority:</strong> ${escapeHtml(req.priority)}</p>
        <p><strong>Problem Description:</strong> ${escapeHtml(req.problemDescription)}</p>
      </div>
      <div class="request-actions">
        <button class="btn-edit" onclick="editRequest('${req.id}')">Edit</button>
        <button class="btn-delete" onclick="deleteRequest('${req.id}')">Delete</button>
      </div>
    `;

    requestsList.appendChild(card);
  });
}

// 2. Submit a new request or update an existing request
form.addEventListener('submit', async (e) => {
  e.preventDefault();

  const requestData = {
    studentName: studentNameInput.value,
    email: emailInput.value,
    category: categoryInput.value,
    priority: priorityInput.value,
    problemDescription: problemDescriptionInput.value
  };

  try {
    if (isEditing) {
      // 3. Update request using fetch()
      const id = requestIdInput.value;
      const response = await fetch(`/api/requests/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(requestData)
      });

      if (response.ok) {
        resetForm();
        getRequests();
      }
    } else {
      // 2. Submit new request using fetch()
      const response = await fetch('/api/requests', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(requestData)
      });

      if (response.ok) {
        resetForm();
        getRequests();
      }
    }
  } catch (error) {
    console.error('Error submitting request:', error);
  }
});

// Populate form for editing (GET single request using fetch)
async function editRequest(id) {
  try {
    const response = await fetch(`/api/requests/${id}`);
    const req = await response.json();

    requestIdInput.value = req.id;
    studentNameInput.value = req.studentName;
    emailInput.value = req.email;
    categoryInput.value = req.category;
    priorityInput.value = req.priority;
    problemDescriptionInput.value = req.problemDescription;

    isEditing = true;
    formTitle.textContent = 'Edit Request';
    submitBtn.textContent = 'Update Request';
    cancelEditBtn.style.display = 'inline-block';
    
    window.scrollTo({ top: 0, behavior: 'smooth' });
  } catch (error) {
    console.error('Error fetching request for edit:', error);
  }
}

// 4. Delete a request using fetch()
async function deleteRequest(id) {
  if (!confirm('Are you sure you want to delete this request?')) return;

  try {
    const response = await fetch(`/api/requests/${id}`, {
      method: 'DELETE'
    });

    if (response.ok) {
      if (isEditing && requestIdInput.value === id) {
        resetForm();
      }
      getRequests();
    }
  } catch (error) {
    console.error('Error deleting request:', error);
  }
}

// Reset form
function resetForm() {
  form.reset();
  requestIdInput.value = '';
  isEditing = false;
  formTitle.textContent = 'Submit a Request';
  submitBtn.textContent = 'Submit Request';
  cancelEditBtn.style.display = 'none';
}

cancelEditBtn.addEventListener('click', resetForm);

// Helper for XSS safety
function escapeHtml(text) {
  if (!text) return '';
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
}

// Expose functions for inline onclick handlers
window.editRequest = editRequest;
window.deleteRequest = deleteRequest;

// Load all requests when page loads
getRequests();
