const monthYearElement = document.getElementById('monthYear');
const datesElement = document.getElementById('dates');
const prevBtn = document.getElementById('prevBtn');
const nextBtn = document.getElementById('nextBtn');
const notepad = document.getElementById('notepad');
const notepadTextarea = notepad.querySelector('textarea');
const markPeriodBtn = document.getElementById('markPeriodBtn'); // New button element

let currentDate = new Date();
let selectedDate = null;

// Update the calendar display
const updateCalendar = () => {
    const currentYear = currentDate.getFullYear();
    const currentMonth = currentDate.getMonth();

    const firstDay = new Date(currentYear, currentMonth, 1);
    const lastDay = new Date(currentYear, currentMonth + 1, 0);
    const totalDays = lastDay.getDate();
    const firstDayIndex = firstDay.getDay();
    const lastDayIndex = lastDay.getDay();

    const monthYearString = currentDate.toLocaleDateString('default', {month: 'long', year: 'numeric'});
    monthYearElement.textContent = monthYearString;

    let datesHTML = '';

    // Generate the previous month's inactive days
    for (let i = firstDayIndex; i > 0; i--) {
        const prevDate = new Date(currentYear, currentMonth, 0 - i + 1);
        datesHTML += `<div class="date inactive" data-date="${prevDate.toISOString()}">${prevDate.getDate()}</div>`;
    }

    // Generate the current month's dates
    for (let i = 1; i <= totalDays; i++) {
        const date = new Date(currentYear, currentMonth, i);
        const activeClass = date.toDateString() === new Date().toDateString() ? 'active' : '';
        const periodClass = isPeriodStartDate(date) ? 'period' : ''; // Check if period is marked
        const periodIcon = isPeriodStartDate(date) ? '<i class="fa-solid fa-droplet period-icon"></i>' : ''; // Show blood icon
        datesHTML += `<div class="date ${activeClass} ${periodClass}" data-date="${date.toISOString()}">${i}${periodIcon}</div>`;
    }

    // Generate the next month's inactive days
    for (let i = 1; i <= 6 - lastDayIndex; i++) {
        const nextDate = new Date(currentYear, currentMonth + 1, i);
        datesHTML += `<div class="date inactive" data-date="${nextDate.toISOString()}">${nextDate.getDate()}</div>`;
    }

    // Update the calendar with the generated dates
    datesElement.innerHTML = datesHTML;
};

// Check if a date is the marked period start
const isPeriodStartDate = (date) => {
    const periodStartDate = localStorage.getItem('periodStartDate');
    return periodStartDate && new Date(periodStartDate).toDateString() === date.toDateString();
};

// Format date as a string (e.g., "January 16")
const formatDate = (date) => {
    return new Date(date).toLocaleDateString('default', { month: 'long', day: 'numeric' });
};

// Open notepad for the clicked date
const openNotepadForDate = (date) => {
    selectedDate = date;
    const formattedDate = formatDate(date);
    notepad.classList.remove('hidden');
    notepad.classList.add('visible');
    notepadTextarea.placeholder = `Notes for ${formattedDate}`;
    notepadTextarea.value = getNotesForDate(date);
    notepadTextarea.focus();
};

// Get notes for a specific date from localStorage
const getNotesForDate = (date) => {
    const dateKey = date.toISOString().split('T')[0]; // Use only the date part as key
    return localStorage.getItem(dateKey) || ''; // Default to empty string if no notes
};

// Save notes for a specific date to localStorage
const saveNotesForDate = () => {
    if (selectedDate) {
        const dateKey = selectedDate.toISOString().split('T')[0]; // Use only the date part as key
        const notes = notepadTextarea.value;
        localStorage.setItem(dateKey, notes);
    }
};

// Mark the selected date as the start of a period and save it
const markPeriodStart = () => {
    if (selectedDate) {
        localStorage.setItem('periodStartDate', selectedDate.toISOString());
        updateCalendar(); // Re-render the calendar to show the marked date
    }
};

// Close notepad when clicking outside
document.addEventListener('click', (event) => {
    if (!notepad.contains(event.target) && !event.target.closest('.date')) {
        notepad.classList.remove('visible');
        notepad.classList.add('hidden');
        saveNotesForDate();
    }
});

// Add event listeners to the previous and next buttons
prevBtn.addEventListener('click', () => {
    currentDate.setMonth(currentDate.getMonth() - 1);
    updateCalendar();
});

nextBtn.addEventListener('click', () => {
    currentDate.setMonth(currentDate.getMonth() + 1);
    updateCalendar();
});

// Add event listener to the date elements
datesElement.addEventListener('click', (event) => {
    const target = event.target;
    if (target.classList.contains('date') && target.dataset.date) {
        const date = new Date(target.dataset.date);
        openNotepadForDate(date);
    }
});

// Save notes when typing
notepadTextarea.addEventListener('input', saveNotesForDate);

// Add event listener to the "Mark Period" button
markPeriodBtn.addEventListener('click', markPeriodStart);

// Initialize the calendar
updateCalendar();
