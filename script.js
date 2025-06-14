// --- 1. Get HTML Elements (DOM References) ---
const currentMonthYearHeader = document.getElementById('currentMonthYear');
const calendarDatesGrid = document.getElementById('calendarDates');
const prevMonthBtn = document.getElementById('prevMonthBtn');
const nextMonthBtn = document.getElementById('nextMonthBtn');

// --- 2. State Variables ---
// `currentDate` will keep track of the month/year currently displayed.
// It's initialized to the actual current date, so the calendar opens on today's month.
let currentDate = new Date();

// --- 3. Event Data (Simulated Static JSON Load) ---
// In a real web application, this data would typically be loaded from an external
// JSON file using the `fetch` API. For this basic example, we're hardcoding it
// directly into the JavaScript. Ensure dates match YYYY-MM-DD.
const events = [
    {
        "id": "e1",
        "title": "Daily Standup",
        "date": "2025-06-13", // Updated to today's date based on current time
        "startTime": "09:00",
        "endTime": "09:30",
        "color": "#f6be23",
        "duration": "30 mins"
    },
    {
        "id": "e2",
        "title": "Weekly Catchup",
        "date": "2025-06-13", // Updated to today's date
        "startTime": "09:15",
        "endTime": "10:00",
        "color": "#f6501e",
        "duration": "45 mins"
    },
    {
        "id": "e3",
        "title": "Project Meeting",
        "date": "2025-06-15",
        "startTime": "14:00",
        "endTime": "15:00",
        "color": "#60a5fa",
        "duration": "60 mins"
    },
    {
        "id": "e4",
        "title": "Client Demo",
        "date": "2025-06-20",
        "startTime": "10:30",
        "endTime": "11:30",
        "color": "#34d399",
        "duration": "60 mins"
    },
    {
        "id": "e5",
        "title": "Team Lunch",
        "date": "2025-06-13", // Updated to today's date
        "startTime": "12:00",
        "endTime": "13:00",
        "color": "#a78bfa",
        "duration": "60 mins"
    }
];

// --- 4. Helper Functions ---

/**
 * Formats a Date object into a "YYYY-MM-DD" string.
 * @param {Date} date The date object to format.
 * @returns {string} The formatted date string.
 */
function formatDateToYYYYMMDD(date) {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are 0-indexed
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
}

// --- 5. Core Calendar Rendering Function ---

/**
 * Renders the calendar grid for the `currentDate`.
 * This function clears the grid, calculates dates, adds cells,
 * highlights today, and displays events.
 */
function renderCalendar() {
    // Clear any existing dates in the grid to avoid duplication
    calendarDatesGrid.innerHTML = '';

    // Update the header to show the correct month and year
    currentMonthYearHeader.textContent = currentDate.toLocaleString('default', { month: 'long', year: 'numeric' });

    // Get today's actual date for highlighting
    const today = new Date();
    const todayFormatted = formatDateToYYYYMMDD(today); // Format today's date for comparison

    // Calculate the first day of the *current displayed month* (e.g., June 1, 2025)
    const firstDayOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);

    // Calculate the last day of the *current displayed month* (e.g., June 30, 2025)
    // By setting day to 0 of the *next* month, you get the last day of the current month.
    const lastDayOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0);

    // Determine the day of the week for the 1st of the month (0 = Sunday, 1 = Monday, ..., 6 = Saturday)
    // This tells us how many 'empty' cells to add at the beginning of the grid.
    const startWeekday = firstDayOfMonth.getDay();

    // Add "empty" cells for days from the previous month to align the 1st of the month correctly
    for (let i = 0; i < startWeekday; i++) {
        const emptyCell = document.createElement('div');
        emptyCell.classList.add('empty'); // Apply styling for empty cells
        calendarDatesGrid.appendChild(emptyCell);
    }

    // Loop through each day of the current month to create date cells
    for (let day = 1; day <= lastDayOfMonth.getDate(); day++) {
        const dateCell = document.createElement('div');
        dateCell.classList.add('current-month'); // Apply general styling for current month days
        dateCell.textContent = day; // Display the day number

        // Create a Date object for the current day being processed in the loop
        const currentIteratedDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), day);
        const currentIteratedDateFormatted = formatDateToYYYYMMDD(currentIteratedDate);

        // Check if this date cell is 'today' and add a special class for highlighting
        if (currentIteratedDateFormatted === todayFormatted) {
            dateCell.classList.add('today'); // Apply styling for today's date
        }

        // Find events scheduled for this specific day
        const dayEvents = events.filter(event => event.date === currentIteratedDateFormatted);

        // If there are events for this day, display them
        if (dayEvents.length > 0) {
            // --- Basic Conflict Detection & Indication ---
            // The image shows a red border and a tooltip.
            // This is a simple visual cue that multiple events exist.
            // More advanced time-overlap detection is complex without a date library's help.
            if (dayEvents.length > 1) {
                dateCell.style.border = '2px solid red'; // Visual cue for conflicts
                dateCell.title = "Multiple events on this day."; // Tooltip on hover
            }

            // Append each event to the date cell
            dayEvents.forEach(event => {
                const eventDiv = document.createElement('div');
                eventDiv.classList.add('event'); // Apply general event styling
                eventDiv.textContent = `${event.startTime} - ${event.title}`; // Display time and title
                eventDiv.setAttribute('data-color', event.color); // Use custom attribute for CSS color
                // Add a more detailed tooltip for each individual event
                eventDiv.title = `${event.title} (${event.startTime} - ${event.endTime})`;
                dateCell.appendChild(eventDiv);
            });
        }

        // Add the completed date cell to the calendar grid
        calendarDatesGrid.appendChild(dateCell);
    }
}

// --- 6. Event Listeners for Navigation Buttons ---

// Add event listener for the "Previous Month" button
prevMonthBtn.addEventListener('click', () => {
    // Decrement the month of `currentDate`

    currentDate.setMonth(currentDate.getMonth() - 1);
    renderCalendar(); // Re-render the calendar with the new month
});

// Add event listener for the "Next Month" button
nextMonthBtn.addEventListener('click', () => {
    // Increment the month of `currentDate`
    currentDate.setMonth(currentDate.getMonth() + 1);
    renderCalendar(); // Re-render the calendar with the new month
});

// --- 7. Initial Calendar Render ---
// Call `renderCalendar()` once when the script loads to display the initial calendar.
renderCalendar();
