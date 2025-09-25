// 📅 Appointment Calendar with Google Sheets + Booking Form + Google Calendar
class AppointmentCalendar {
    constructor() {
        this.currentDate = new Date();
        this.selectedDate = null;
        this.selectedTime = null;
        this.availableSlots = {
            default: ['09:00', '10:00', '11:00', '14:00', '15:00', '16:00'],
            '2025-08-20': ['09:00', '10:00', '14:00', '15:00'],
            '2025-08-21': ['10:00', '11:00', '15:00', '16:00']
        };

        // ⚠️ Replace with your Google Apps Script Web App URL
        this.googleSheetsURL = 'https://script.google.com/macros/s/AKfycbx75jz2WOQvRs_V5TeQY8g2C8XUWQhLhsNJIbT9Exrbs1KVNaDHmGSkg_OzMSFTNOGB/exec';

        this.init();
    }

    init() {
        this.renderCalendar();
        this.bindEvents();
    }

    bindEvents() {
        const prevBtn = document.getElementById('prev-month');
        const nextBtn = document.getElementById('next-month');
        const googleCalendarBtn = document.getElementById('google-calendar-btn');

        prevBtn.addEventListener('click', () => {
            this.currentDate.setMonth(this.currentDate.getMonth() - 1);
            this.renderCalendar();
        });

        nextBtn.addEventListener('click', () => {
            this.currentDate.setMonth(this.currentDate.getMonth() + 1);
            this.renderCalendar();
        });

        googleCalendarBtn.addEventListener('click', () => {
            this.addToGoogleCalendar();
        });
    }

    renderCalendar() {
        const monthNames = [
            'January', 'February', 'March', 'April', 'May', 'June',
            'July', 'August', 'September', 'October', 'November', 'December'
        ];

        const currentMonth = document.getElementById('current-month');
        currentMonth.textContent = `${monthNames[this.currentDate.getMonth()]} ${this.currentDate.getFullYear()}`;

        const calendarGrid = document.getElementById('calendar-grid');
        calendarGrid.innerHTML = '';

        // Day headers
        const dayHeaders = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
        dayHeaders.forEach(day => {
            const dayHeader = document.createElement('div');
            dayHeader.className = 'calendar-header-day';
            dayHeader.textContent = day;
            calendarGrid.appendChild(dayHeader);
        });

        const firstDay = new Date(this.currentDate.getFullYear(), this.currentDate.getMonth(), 1);
        const lastDay = new Date(this.currentDate.getFullYear(), this.currentDate.getMonth() + 1, 0);
        const firstDayOfWeek = firstDay.getDay();
        const daysInMonth = lastDay.getDate();

        // Empty cells before first day
        for (let i = 0; i < firstDayOfWeek; i++) {
            const emptyDay = document.createElement('div');
            emptyDay.className = 'calendar-day disabled';
            calendarGrid.appendChild(emptyDay);
        }

        // Add days
        for (let day = 1; day <= daysInMonth; day++) {
            const dayElement = document.createElement('div');
            dayElement.className = 'calendar-day';
            dayElement.textContent = day;

            const currentDateObj = new Date(this.currentDate.getFullYear(), this.currentDate.getMonth(), day);
            const today = new Date();

            if (currentDateObj < today.setHours(0, 0, 0, 0)) {
                dayElement.classList.add('disabled');
            } else {
                dayElement.classList.add('available');
                dayElement.addEventListener('click', (event) => {
                    this.selectDate(currentDateObj, event);
                });
            }
            calendarGrid.appendChild(dayElement);
        }
    }

    selectDate(date, event) {
        document.querySelectorAll('.calendar-day.selected').forEach(day => {
            day.classList.remove('selected');
        });

        event.target.classList.add('selected');
        this.selectedDate = date;
        this.renderTimeSlots();
    }

    renderTimeSlots() {
        const timeSlots = document.getElementById('time-slots');
        const slotsContainer = document.getElementById('slots-container');

        timeSlots.style.display = 'block';
        slotsContainer.innerHTML = '';

        const dateKey = this.selectedDate.toISOString().split('T')[0];
        const slots = this.availableSlots[dateKey] || this.availableSlots.default;

        slots.forEach(time => {
            const slotElement = document.createElement('div');
            slotElement.className = 'time-slot';
            slotElement.textContent = this.formatTime(time);

            slotElement.addEventListener('click', () => {
                document.querySelectorAll('.time-slot.selected').forEach(slot => {
                    slot.classList.remove('selected');
                });

                slotElement.classList.add('selected');
                this.selectedTime = time;

                document.getElementById('google-calendar-btn').style.display = 'block';
            });

            slotsContainer.appendChild(slotElement);
        });
    }

    formatTime(time24) {
        const [hours, minutes] = time24.split(':');
        const hour12 = hours % 12 || 12;
        const ampm = hours >= 12 ? 'PM' : 'AM';
        return `${hour12}:${minutes} ${ampm}`;
    }

    // 🔹 Enhanced booking flow
    addToGoogleCalendar() {
        if (!this.selectedDate || !this.selectedTime) {
            window.AIAgency.showNotification('Please select both date and time', 'error');
            return;
        }
        this.showBookingForm();
    }

    showBookingForm() {
        const modal = document.createElement('div');
        modal.className = 'booking-modal';
        modal.innerHTML = `
            <div class="modal-content">
                <div class="modal-header">
                    <h3>Complete Your Booking</h3>
                    <span class="close-modal">&times;</span>
                </div>
                <form id="booking-form">
                    <div class="form-group">
                        <label>Full Name *</label>
                        <input type="text" name="name" required>
                    </div>
                    <div class="form-group">
                        <label>Email *</label>
                        <input type="email" name="email" required>
                    </div>
                    <div class="form-group">
                        <label>Phone Number *</label>
                        <input type="tel" name="phone" required>
                    </div>
                    <div class="form-group">
                        <label>Service Type *</label>
                        <select name="service" required>
                            <option value="">Select a service</option>
                            <option value="AI Consultation">AI Consultation</option>
                            <option value="Workshop Registration">Workshop Registration</option>
                            <option value="1-on-1 Coaching">1-on-1 Coaching</option>
                            <option value="AI Development">AI Development Project</option>
                        </select>
                    </div>
                    <div class="form-group">
                        <label>Message (Optional)</label>
                        <textarea name="message" rows="3" placeholder="Tell us about your needs..."></textarea>
                    </div>
                    <div class="booking-summary">
                        <strong>📅 Selected Date:</strong> ${this.selectedDate.toLocaleDateString()}<br>
                        <strong>🕐 Selected Time:</strong> ${this.formatTime(this.selectedTime)}
                    </div>
                    <div class="form-buttons">
                        <button type="button" class="btn btn-secondary cancel-booking">Cancel</button>
                        <button type="submit" class="btn btn-primary">
                            <i class="fas fa-calendar-check"></i> Confirm Booking
                        </button>
                    </div>
                </form>
            </div>
        `;

        document.body.appendChild(modal);
        this.addModalStyles();

        modal.querySelector('.close-modal').onclick = () => this.closeModal(modal);
        modal.querySelector('.cancel-booking').onclick = () => this.closeModal(modal);
        modal.onclick = (e) => {
            if (e.target === modal) this.closeModal(modal);
        };

        modal.querySelector('#booking-form').onsubmit = (e) => {
            e.preventDefault();
            this.submitBooking(modal, new FormData(e.target));
        };
    }

    async submitBooking(modal, formData) {
        const submitBtn = modal.querySelector('button[type="submit"]');
        const originalText = submitBtn.innerHTML;
        submitBtn.innerHTML = '<span class="loading"></span> Sending...';
        submitBtn.disabled = true;

        const bookingData = {
            name: formData.get('name'),
            email: formData.get('email'),
            phone: formData.get('phone'),
            service: formData.get('service'),
            message: formData.get('message'),
            date: this.selectedDate.toLocaleDateString(),
            time: this.formatTime(this.selectedTime)
        };

        try {
            // Send to Google Sheets
            await fetch(this.googleSheetsURL, {
                method: 'POST',
                mode: 'no-cors',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                },
                body: new URLSearchParams(bookingData)
            });

            // Create Google Calendar event
            this.createGoogleCalendarEvent(bookingData);

            window.AIAgency.showNotification(
                '✅ Booking submitted! Check your email for confirmation.',
                'success'
            );

            this.closeModal(modal);
            this.resetSelection();

        } catch (error) {
            console.error('Booking error:', error);
            window.AIAgency.showNotification(
                '❌ Booking failed. Please try again or contact us directly.',
                'error'
            );
            submitBtn.innerHTML = originalText;
            submitBtn.disabled = false;
        }
    }

    createGoogleCalendarEvent(bookingData) {
        const [hours, minutes] = this.selectedTime.split(':');
        const startDate = new Date(this.selectedDate);
        startDate.setHours(parseInt(hours), parseInt(minutes), 0, 0);

        const endDate = new Date(startDate);
        endDate.setHours(startDate.getHours() + 1);

        const startISO = startDate.toISOString().replace(/[-:]/g, '').replace(/\.\d{3}/, '');
        const endISO = endDate.toISOString().replace(/[-:]/g, '').replace(/\.\d{3}/, '');

        const eventDetails = {
            text: `${bookingData.service} - AImpress`,
            dates: `${startISO}/${endISO}`,
            details: `AImpress Appointment

Service: ${bookingData.service}
Your Details: ${bookingData.name} (${bookingData.email})

Note: This appointment is pending confirmation.

${bookingData.message ? 'Your Message: ' + bookingData.message : ''}`,
            location: 'AImpress, Gruentalerstraße 4, 4020 Linz',
            ctz: 'Europe/Vienna'
        };

        const googleCalendarUrl = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(eventDetails.text)}&dates=${eventDetails.dates}&details=${encodeURIComponent(eventDetails.details)}&location=${encodeURIComponent(eventDetails.location)}&ctz=${eventDetails.ctz}`;
        window.open(googleCalendarUrl, '_blank');
    }

    addModalStyles() {
        if (document.getElementById('modal-styles')) return;

        const styles = document.createElement('style');
        styles.id = 'modal-styles';
        styles.textContent = `
            .booking-modal {
                position: fixed;
                top: 0; left: 0;
                width: 100%; height: 100%;
                background: rgba(0,0,0,0.5);
                display: flex;
                justify-content: center;
                align-items: center;
                z-index: 10000;
                animation: fadeIn 0.3s ease;
            }
            .modal-content {
                background: white;
                border-radius: 15px;
                padding: 2rem;
                max-width: 500px;
                width: 90%;
                max-height: 90vh;
                overflow-y: auto;
                animation: slideIn 0.3s ease;
                box-shadow: 0 20px 60px rgba(0,0,0,0.3);
            }
            .modal-header {
                display: flex;
                justify-content: space-between;
                align-items: center;
                margin-bottom: 1.5rem;
                padding-bottom: 1rem;
                border-bottom: 1px solid #eee;
            }
            .modal-header h3 { color: #667eea; margin: 0; }
            .close-modal { font-size: 1.5rem; cursor: pointer; color: #666; }
            .close-modal:hover { color: #333; }
            .form-group { margin-bottom: 1.5rem; }
            .form-group label { display: block; margin-bottom: .5rem; font-weight: 600; color: #333; }
            .form-group input, .form-group select, .form-group textarea {
                width: 100%; padding: .75rem; border: 2px solid #e0e0e0; border-radius: 8px;
                font-size: 1rem; transition: border-color .3s ease;
            }
            .form-group input:focus, .form-group select:focus, .form-group textarea:focus {
                outline: none; border-color: #667eea;
            }
            .booking-summary {
                background: linear-gradient(135deg, #f0f4ff 0%, #e8f2ff 100%);
                padding: 1.5rem; border-radius: 10px; margin: 1.5rem 0;
                color: #667eea; font-weight: 500; border-left: 4px solid #667eea;
            }
            .form-buttons { display: flex; gap: 1rem; justify-content: flex-end; margin-top: 2rem; }
            .btn { padding: 12px 30px; border-radius: 8px; font-weight: 600; cursor: pointer;
                border: none; transition: all .3s ease; display: flex; align-items: center; gap: .5rem; }
            .btn-primary { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; }
            .btn-primary:hover:not(:disabled) { transform: translateY(-2px); box-shadow: 0 10px 25px rgba(102,126,234,.3); }
            .btn-secondary { background: #f5f5f5; color: #666; }
            .btn-secondary:hover { background: #e0e0e0; }
            .btn:disabled { opacity: .7; cursor: not-allowed; }
            .loading {
                width: 20px; height: 20px; border: 2px solid rgba(255,255,255,0.3);
                border-radius: 50%; border-top-color: #fff; animation: spin 1s linear infinite;
            }
            @keyframes fadeIn { from {opacity:0;} to {opacity:1;} }
            @keyframes slideIn { from {transform:translateY(-50px);opacity:0;} to {transform:translateY(0);opacity:1;} }
            @keyframes spin { to { transform: rotate(360deg); } }
        `;
        document.head.appendChild(styles);
    }

    closeModal(modal) {
        modal.style.animation = 'fadeOut 0.3s ease';
        setTimeout(() => {
            if (document.body.contains(modal)) {
                document.body.removeChild(modal);
            }
        }, 300);
    }

    resetSelection() {
        this.selectedDate = null;
        this.selectedTime = null;

        document.querySelectorAll('.calendar-day.selected, .time-slot.selected').forEach(el => {
            el.classList.remove('selected');
        });

        document.getElementById('time-slots').style.display = 'none';
        document.getElementById('google-calendar-btn').style.display = 'none';
    }
}

// Init when DOM ready
document.addEventListener('DOMContentLoaded', () => {
    new AppointmentCalendar();
});
