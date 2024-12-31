// Check if user is logged in
function checkAuth() {
    const token = localStorage.getItem('token');
    if (!token && window.location.pathname !== '/index.html') {
        window.location.href = '/index.html';
    } else if (token && window.location.pathname === '/index.html') {
        window.location.href = '/home.html';
    }
}

// Logout function
function logout() {
    localStorage.removeItem('token');
    window.location.href = '/index.html';
}

// Panel display functions
function showPanel(panelType) {
    const addPanel = document.getElementById('addPanel');
    const viewPanel = document.getElementById('viewPanel');
    
    if (panelType === 'add') {
        addPanel.style.display = 'block';
        viewPanel.style.display = 'none';
    } else if (panelType === 'view') {
        addPanel.style.display = 'none';
        viewPanel.style.display = 'block';
        loadEvents();
    }
}

// Modal handling
const modal = document.getElementById('updateModal');
const span = document.getElementsByClassName('close')[0];

// Close modal when clicking (X)
if(span) {
    span.onclick = function() {
        modal.style.display = "none";
    }
}

// Close modal when clicking outside
window.onclick = function(event) {
    if (event.target == modal) {
        modal.style.display = "none";
    }
}

// Login form handler
if (document.getElementById('loginForm')) {
    document.getElementById('loginForm').addEventListener('submit', async (e) => {
        e.preventDefault();
        // For demo purposes, using simple authentication
        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;
        
        if (email === 'admin@gmail.com' && password === 'Password') {
            localStorage.setItem('token', 'demo-token');
            window.location.href = '/home.html';
        } else {
            alert('Invalid credentials');
        }
    });
}

// Event form handler
if (document.getElementById('eventForm')) {
    document.getElementById('eventForm').addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const eventData = {
            name: document.getElementById('eventName').value,
            location: document.getElementById('location').value,
            time: document.getElementById('time').value,
            organizer: document.getElementById('organizer').value
        };

        try {
            const response = await fetch('/api/events', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(eventData)
            });

            if (response.ok) {
                alert('Event added successfully');
                loadEvents();
                e.target.reset();
            } else {
                throw new Error('Failed to add event');
            }
        } catch (error) {
            alert(error.message);
        }
    });
}

// Function to open update modal and populate with event data
function showUpdateModal(event) {
    const modal = document.getElementById('updateModal');
    const updateEventId = document.getElementById('updateEventId');
    const updateEventName = document.getElementById('updateEventName');
    const updateLocation = document.getElementById('updateLocation');
    const updateTime = document.getElementById('updateTime');
    const updateOrganizer = document.getElementById('updateOrganizer');

    // Format the date-time for the input
    const eventTime = new Date(event.time);
    const formattedDateTime = eventTime.toISOString().slice(0, 16);

    // Populate the form
    updateEventId.value = event._id;
    updateEventName.value = event.name;
    updateLocation.value = event.location;
    updateTime.value = formattedDateTime;
    updateOrganizer.value = event.organizer;

    modal.style.display = "block";
}

// Update event form handler
if (document.getElementById('updateEventForm')) {
    document.getElementById('updateEventForm').addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const eventId = document.getElementById('updateEventId').value;
        const eventData = {
            name: document.getElementById('updateEventName').value,
            location: document.getElementById('updateLocation').value,
            time: document.getElementById('updateTime').value,
            organizer: document.getElementById('updateOrganizer').value
        };

        try {
            const response = await fetch(`/api/events/${eventId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(eventData)
            });

            if (response.ok) {
                alert('Event updated successfully');
                modal.style.display = "none";
                loadEvents();
            } else {
                throw new Error('Failed to update event');
            }
        } catch (error) {
            alert(error.message);
        }
    });
}
async function deleteEvent(eventId) {
    if (!confirm('Are you sure you want to delete this event?')) return;

    try {
        const response = await fetch(`/api/events/${eventId}`, {
            method: 'DELETE',
        });

        if (response.ok) {
            alert('Event deleted successfully');
            loadEvents(); // Refresh the list of events
        } else {
            throw new Error('Failed to delete the event');
        }
    } catch (error) {
        console.error('Error deleting event:', error);
        alert(error.message);
    }
}

// Load events
async function loadEvents() {
    if (!document.getElementById('eventsList')) return;

    try {
        const response = await fetch('/api/events');
        const events = await response.json();
        
        const eventsContainer = document.getElementById('eventsList');
        eventsContainer.innerHTML = '';

        events.forEach(event => {
            const eventElement = document.createElement('div');
            eventElement.className = 'event-card';
            eventElement.innerHTML = `
                <h3>${event.name}</h3>
                <p><strong>Location:</strong> ${event.location}</p>
                <p><strong>Time:</strong> ${new Date(event.time).toLocaleString()}</p>
                <p><strong>Organizer:</strong> ${event.organizer}</p>
                <div class="button-group">
                    <button onclick='showUpdateModal(${JSON.stringify(event)})' class="update-btn">Update</button>
                    <button onclick="deleteEvent('${event._id}')" class="delete-btn">Delete</button>
                </div>
            `;
            eventsContainer.appendChild(eventElement);
        });
    } catch (error) {
        console.error('Error loading events:', error);
    }
}