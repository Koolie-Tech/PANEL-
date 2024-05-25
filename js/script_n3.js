let data;

function updateDataAndDOM(url) {
    fetch(url)
        .then(response => response.json())
        .then(fetchedData => {
            if (JSON.stringify(data) !== JSON.stringify(fetchedData)) {
                data = fetchedData;
                updateDOM(data);
            }
            setTimeout(() => updateDataAndDOM(url), 5000); // Update data again after 5 seconds
        })
        .catch(error => {
            console.error('Error fetching data:', error);
        });
}

function updateDOM(data) {
    document.title = 'Order Status'; // Set document title

    const tableBody = document.querySelector('.table tbody');
    tableBody.innerHTML = ''; // Clear existing rows (optional)

    data.data.forEach((order, index) => {
        const coolieId = order.coolie_id || 'NA';
        let currentStatus = 'Unknown'; // Default status

        if (order.current_status && Array.isArray(order.current_status.status)) {
            currentStatus = order.current_status.status[order.current_status.status.length - 1]; // Get the last element of the array
        } else if (order.current_status && order.current_status.status) {
            currentStatus = order.current_status.status;
        }

        const rowClass = getRowClass(currentStatus);
        const tableRow = `
            <tr class="${rowClass}">
                <td>${index + 1}</td>
                <td>${order.booking_id}</td>
                <td>${order.user_id}</td>
                <td>${coolieId}</td>
                <td> ₹ ${order.quoted_amount || ''}</td>
                <td>${order.luggage ? JSON.stringify(order.luggage) : ''}</td>
                <td>${order.booking_recieved_at}</td>
                <td>${order.selected_time || ''}</td>
                <td>${JSON.stringify(order.current_status) || ''}</td>
                <td>${order.payment_mode || ''}</td>
            </tr>
        `;
        tableBody.insertAdjacentHTML('beforeend', tableRow);
    });
}

function getRowClass(status) {
    let rowClass;

    switch (status) {
        case 'Modified':
            rowClass = 'table-warning'; // Modify color as needed
            break;
        case 'Failure':
            rowClass = 'table-danger';
            break;
        case 'Awaiting':
            rowClass = 'table-primary';
            break;
        case 'Dispute':
            rowClass = 'table-warning'; // Modify color as needed
            break;
        case 'In Progress':
            rowClass = 'table-info';
            break;
        case 'Completed':
            rowClass = 'table-success';
            break;
        default:
            rowClass = 'table-light'; // Default class for unknown status
    }

    return rowClass;
}

// Replace with your actual base URL for API requests
const BASE_URL = 'http://127.0.0.1:4500/api/v1/orders/';

function url_status() {
    updateDataAndDOM(BASE_URL);
}

// Call the function to initiate data fetching (e.g., on page load)
url_status();

