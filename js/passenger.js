let data = null; // Assuming this is declared somewhere in your script

function updateDataAndDOM(url) {
    fetch(url)
        .then(response => response.json())
        .then(fetchedData => {
            if (JSON.stringify(data) !== JSON.stringify(fetchedData)) {
                data = fetchedData;
                updateDOM(data);
            }
            setTimeout(() => updateDataAndDOM(url), 5 * 60 * 1000); // Update data again after 5 minutes (5 * 60 * 1000 milliseconds)
        })
        .catch(error => {
            console.error('Error fetching data:', error);
        });
}

function getRowClass(passenger) {
    // Set default verified to true if firebaseid is present
    const verified = passenger.firebaseid ? true : false;

    let rowClass;

    switch (verified) {
        case false:
            rowClass = 'table-warning'; // Not verified
            break;
        case true:
            rowClass = 'table-primary'; // Verified
            break;
        default:
            rowClass = 'table-light'; // Default class for unknown status
            break;
    }

    return rowClass;
}

function updateDOM(data) {
    console.log(data);
    document.title = 'Passenger Information'; // Set document title

    const tableBody = document.querySelector('.table tbody');
    const table = document.querySelector('.table');
    const tableHead = table.querySelector('thead');

    // Clear existing rows and head
    tableBody.innerHTML = '';
    tableHead.innerHTML = '';

    // Generate <thead> based on predefined headers
    const headerRow = `
        <tr>
            <th>#</th>
            <th>Passenger ID</th>
            <th>First Name</th>
            <th>Last Name</th>
            <th>Passenger Image</th>
            <th>Firebase ID</th>
            <th>DOB</th>
            <th>Age</th>
            <th>Gender</th>
            <th>Contact Number</th>
            <th>Alternate Number</th>
            <th>Latitude</th>
            <th>Longitude</th>
            <th>Created Date</th>
            <th>Created Time</th>
            <th>Updated At</th>
        </tr>
    `;
    tableHead.innerHTML = headerRow;

    // Generate table rows
    data.data.Passenger.forEach((passenger, index) => {
        const rowClass = getRowClass(passenger);

        const tableRow = `
            <tr class="${rowClass}">
                <td>${index + 1}</td>
                <td>${passenger.Passengerid || 'NA'}</td>
                <td>${passenger.firstname || 'NA'}</td>
                <td>${passenger.lastname || 'NA'}</td>
                <td>${passenger.personimage ? `<img src="${passenger.personimage}" alt="Passenger Image" style="width: 100px; height: 100px;">` : 'NA'}</td>
                <td>${passenger.firebaseid || 'NA'}</td>
                <td>${passenger.dob || 'NA'}</td>
                <td>${passenger.age || 'NA'}</td>
                <td>${passenger.gender || 'NA'}</td>
                <td>${passenger.phonenumber || 'NA'}</td>
                <td>${passenger.alternatenumber || 'NA'}</td>
                <td>${passenger.lat || 'NA'}</td>
                <td>${passenger.lon || 'NA'}</td>
                <td>${passenger.createdAtDate || 'NA'}</td>
                <td>${passenger.createdAtTime || 'NA'}</td>
                <td>${passenger.updatedAt || 'NA'}</td>
            </tr>
        `;
        tableBody.insertAdjacentHTML('beforeend', tableRow);
    });
}

const BASE_URL = 'https://passengerbackend.cooliewale.in/api/v1/passenger';

// Call the function to initiate data fetching (e.g., on page load)
updateDataAndDOM(BASE_URL);
