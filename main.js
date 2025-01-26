const monthYearElement = document.getElementById('monthYear');
const datesElement = document.getElementById('dates');
const prevBtn = document.getElementById('prevBtn');
const nextBtn = document.getElementById('nextBtn');
const notepad = document.getElementById('notepad');
const notepadTextarea = notepad.querySelector('textarea');

let currentDate = new Date();

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
        datesHTML += `<div class="date inactive">${prevDate.getDate()}</div>`;
    }

    // Generate the current month's dates
    for (let i = 1; i <= totalDays; i++) {
        const date = new Date(currentYear, currentMonth, i);
        const activeClass = date.toDateString() === new Date().toDateString() ? 'active' : '';
        datesHTML += `<div class="date ${activeClass}" data-date="${date.toISOString()}">${i}</div>`;
    }

    // Generate the next month's inactive days
    for (let i = 1; i <= 7 - lastDayIndex; i++) {
        const nextDate = new Date(currentYear, currentMonth + 1, i);
        datesHTML += `<div class="date inactive">${nextDate.getDate()}</div>`;
    }

    // Update the calendar with the generated dates
    datesElement.innerHTML = datesHTML;
};

// Format date as a string (e.g., "January 16")
const formatDate = (date) => {
    return new Date(date).toLocaleDateString('default', { month: 'long', day: 'numeric' });
};

// Open notepad for the clicked date
const openNotepadForDate = (date) => {
    const formattedDate = formatDate(date);
    notepad.classList.remove('hidden');
    notepad.classList.add('visible');
    notepadTextarea.placeholder = `Notes for ${formattedDate}`;
    notepadTextarea.value = getNotesForDate(date);
    notepadTextarea.focus();
};

// Get notes for a specific date from localStorage
const getNotesForDate = (date) => {
    const dateKey = date.toISOString(); // Using full ISO date string as key
    return localStorage.getItem(dateKey) || ''; // Default to empty string if no notes
};

// Save notes for a specific date to localStorage
const saveNotesForDate = (date) => {
    const dateKey = date.toISOString(); // Using full ISO date string as key
    const notes = notepadTextarea.value;
    localStorage.setItem(dateKey, notes);
};

// Close notepad when clicking outside
document.addEventListener('click', (event) => {
    if (!notepad.contains(event.target) && !event.target.closest('.date')) {
        notepad.classList.remove('visible');
        notepad.classList.add('hidden');
        const selectedDate = new Date(notepadTextarea.placeholder.replace('Notes for ', ''));
        saveNotesForDate(selectedDate);
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

// Initialize the calendar
updateCalendar();
