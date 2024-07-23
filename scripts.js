document.addEventListener('DOMContentLoaded', (event) => {
    const apiUrl = 'https://1ivrg6ayg1.execute-api.us-east-1.amazonaws.com/prod/apod';
    const earliestDate = '1995-06-16';
    const latestDate = new Date().toISOString().split('T')[0]; // Today's date in YYYY-MM-DD format

    function formatDateToMMDDYYYY(date) {
        const [year, month, day] = date.split('-');
        return `${month}/${day}/${year}`;
    }

    function fetchAPOD(date = '') {
        if (!date) {
            // Clear any previous content if no date is provided
            document.getElementById('title').textContent = '';
            document.getElementById('date').textContent = '';
            document.getElementById('description').textContent = 'Embark on a Journey Through Space! Select a Date to Reveal the Cosmos.';
            document.getElementById('image').style.display = 'none';
            return;
        }

        let url = apiUrl + `?date=${date}`;
        
        fetch(url)
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok ' + response.statusText);
                }
                return response.json();
            })
            .then(data => {
                document.getElementById('title').textContent = data.title || 'Title not available';
                document.getElementById('date').textContent = formatDateToMMDDYYYY(data.date) || 'Date not available';
                document.getElementById('description').textContent = data.explanation || 'Description not available';
                if (data.url) {
                    document.getElementById('image').src = data.url;
                    document.getElementById('image').alt = data.title || 'Image not available';
                    document.getElementById('image').style.display = 'block';
                } else {
                    document.getElementById('image').style.display = 'none';
                }
            })
            .catch(error => {
                console.error('Error fetching APOD:', error);
                document.getElementById('title').textContent = 'Error fetching data';
                document.getElementById('date').textContent = '';
                document.getElementById('description').textContent = 'Please try again later.';
                document.getElementById('image').style.display = 'none';
            });
    }

    document.getElementById('explore-button').addEventListener('click', () => {
        const date = document.getElementById('date-input').value;
        if (!date) {
            alert(`Please select a date.`);
            return;
        }
        
        const isoDate = new Date(date).toISOString().split('T')[0];
        if (isoDate < earliestDate || isoDate > latestDate) {
            alert(`Please select a date between ${formatDateToMMDDYYYY(earliestDate)} and ${formatDateToMMDDYYYY(latestDate)}.`);
        } else {
            fetchAPOD(isoDate);
        }
    });

    // Initial state: clear content and hide image
    document.getElementById('title').textContent = '';
    document.getElementById('date').textContent = '';
    document.getElementById('description').textContent = 'Embark on a Journey Through Space! Select a Date to Reveal the Cosmos.';
    document.getElementById('image').src = '';
    document.getElementById('image').alt = '';
    document.getElementById('image').style.display = 'none';

    // Set date input attributes
    document.getElementById('date-input').setAttribute('min', earliestDate);
    document.getElementById('date-input').setAttribute('max', latestDate);

    // Update the date range message
    document.getElementById('date-range').textContent = `Please select a date between ${formatDateToMMDDYYYY(earliestDate)} and ${formatDateToMMDDYYYY(latestDate)}.`;
});