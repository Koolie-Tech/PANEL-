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

function getRowClass(verified) {
    let rowClass;

    switch (verified) {
        case -1:
            rowClass = 'table-danger'; // Blacklisted
            break;
        case 5:

            rowClass = 'table-info'; // Not verified
            break;
        case 1:
        case true:
            rowClass = 'table-primary'; // Verified by team
            break;
        case 2:
            rowClass = 'table-success'; // Verified by both official & team
            break;
        case 0:
        case false:
            rowClass = 'table-warning'; // Data missing
            break;
        default:
            rowClass = 'table-light'; // Default class for unknown status
            break;
    }

    return rowClass;
}

function updateDOM(data) {
    console.log(data);
    document.title = 'Coolie Status'; // Set document title

    const tableBody = document.querySelector('.table tbody');
    const table = document.querySelector('.table');
    const tableHead = table.querySelector('thead');

    // Clear existing rows and head
    tableBody.innerHTML = '';
    tableHead.innerHTML = '';

    // Generate <thead> based on predefined headers
    const tableHeadRow = document.createElement('thead');
    const headerRow = `
        <tr>
            <th>#</th>
            <th>coolieid</th>
            <th>first name</th>
            <th>last name</th>
            <th>Coolie Pics</th>
            <th>Badge id</th>
            <th>Badge Pic</th>
            <th>DOB</th>
            <th>AGE</th>
            <th>GENDER</th>
            <th>CONTACT NUMBER</th>
            <th>ADDRESS</th>
            <th>UIDAI AADHAR</th>
            <th>Alternate Number</th>
            <th>STATION SERVING</th>
            <th>BANK ACCOUNT</th>
            <th>IFSC</th>
            <th>lat</th>
            <th>lon</th>
            <th>firebaseid</th>
            <th>userid</th>
            <th>DEVICE ID</th>
            <th>REGISTERED</th>
            <th>VERIFIED</th>
            <th>created Date</th>
            <th>created Time</th>
            <th>UPDATED AT</th>
        </tr>
    `;
    tableHeadRow.innerHTML = headerRow;
    table.appendChild(tableHeadRow);

    // Generate table rows
    data.data.coolies.forEach((coolie, index) => {
        // Ensure verified is set to 0 if undefined
        const verified = coolie.verified !== undefined ? coolie.verified : 0;
        const rowClass = getRowClass(verified);

        const tableRow = `
            <tr class="${rowClass}">
                <td>${index + 1}</td>
                <td>${coolie.coolieid || 'NA'}</td>
                <td>${coolie.firstname || 'NA'}</td>
                <td>${coolie.lastname || 'NA'}</td>
                <td>${coolie.personimage ? `<img src="${coolie.personimage}" alt="Coolie Image" style="width: 100px; height: 100px;">` : 'NA'}</td>
                <td>${coolie.badgeid || 'NA'}</td>
                <td>${coolie.badgePic ? `<img src="${coolie.badgePic}" alt="Badge Image" style="width: 100px; height: 100px;">` : 'NA'}</td>
                <td>${coolie.dob || 'NA'}</td>
                <td>${coolie.age || 'NA'}</td>
                <td>${coolie.gender || 'NA'}</td>
                <td>${coolie.contactNumber || 'NA'}</td>
                <td>${coolie.address || 'NA'}</td>
                <td>${coolie.uidaiAadhar || 'NA'}</td>
                <td>${coolie.alternateNumber || 'NA'}</td>
                <td>${coolie.stationServing || 'NA'}</td>
                <td>${coolie.bankAccount || 'NA'}</td>
                <td>${coolie.ifsc || 'NA'}</td>
                <td>${coolie.lat || 'NA'}</td>
                <td>${coolie.lon || 'NA'}</td>
                <td>${coolie.firebaseid || 'NA'}</td>
                <td>${coolie.userid || 'NA'}</td>
                <td>${coolie.deviceId || 'NA'}</td>
                <td>${coolie.registered || 'NA'}</td>
                <td>${coolie.verified ? 'Yes' : 'No'}</td>
                <td>${coolie.createdDate || 'NA'}</td>
                <td>${coolie.createdTime || 'NA'}</td>
                <td>${coolie.updatedAt || 'NA'}</td>
            </tr>
        `;
        tableBody.insertAdjacentHTML('beforeend', tableRow);
    });
}

const BASE_URL = 'https://cooliebackend.cooliewale.in/api/v1/coolies';

// Call the function to initiate data fetching (e.g., on page load)
updateDataAndDOM(BASE_URL);