let data; // Assuming this is declared somewhere in your script

function updateDataAndDOM(url) {
    fetch(url)
        .then(response => response.json())
        .then(fetchedData => {
            if (JSON.stringify(data) !== JSON.stringify(fetchedData)) {
                data = fetchedData;
                updateDOM(data);
                updateDashboardSummary(data);
            }
            setTimeout(() => updateDataAndDOM(url), 5 * 60 * 1000); // Update data again after 5 minutes (5 * 60 * 1000 milliseconds)
        })
        .catch(error => {
            console.error('Error fetching data:', error);
        });
}

function updateDOM(data) {
    document.title = 'Order Status'; // Set document title

    const tableBody = document.querySelector('.table tbody');
    const table = document.querySelector('.table');

    // Clear existing rows
    tableBody.innerHTML = '';

    // Generate <thead> based on keys in the first data entry
    const firstOrder = data[0];
    const tableHeadRow = document.createElement('thead');

    const headerRow = `
        <tr>
            <th>#</th>
            <th>Booking Id</th>
            <th>User Id</th>
            <th>Coolie Id</th>
            <th>Amount</th>
            <th>Baggage</th>
            <th>Contact Number</th>
            <th>SERVING TIME</th>
            <th>SERVING DATE</th>
            <th>STATION NAME</th>
            <th>STATION CODE</th>
            <th>PICKUP POINT</th>
            <th>DROP POINT</th>
            <th>OTP</th>
            <th>Train Number</th>
            <th>Train Name</th>
            <th>PNR</th>
            <th>Coach Position</th>
            <th>Arrival Time (Scheduled)</th>
            <th>Arrival Time (ACTUAL)</th>
            <th>Payment Mode</th>
        </tr>
    `;
    tableHeadRow.innerHTML = headerRow;
    table.appendChild(tableHeadRow);

    // Generate table rows
    data.forEach((order, index) => {
        const coolieid = order.coolieid || 'NA';
        const orderid = order.orderid || 'NA';
        const passengerid = order.passengerid || 'NA';
        const amountQuoted = order.amount_quoted !== undefined ? parseFloat(order.amount_quoted) : 0;
        const luggage = order.luggage ? JSON.stringify(order.luggage) : 'NA';
        const selectedDate = order.selected_date || 'NA';
        const selectedTime = order.selected_time || 'NA';
        const selectedStationName = order.selected_station_name || 'NA';
        const selectedStationCode = order.selected_station_code || 'NA';
        const pickupPoint = order.pickup_point || 'NA';
        const dropPoint = order.drop_point || 'NA';
        const OTP = order.OTP || 'NA';
        const trainNumber = order.train_number || 'NA';
        const trainName = order.train_name || 'NA';
        const PNR = order.PNR || 'NA';
        const coachPosition = order.coach_position || 'NA';
        const arrivalTimeScheduled = order.arrival_time_scheduled || 'NA';
        const arrivalTimeActual = order.arrival_time_actual || 'NA';
        const paymentMode = order.payment_mode || 'NA';

        // Determine row class based on current_status
        const currentStatus = order.current_status && order.current_status.status ? order.current_status.status : 'Unknown';
        const rowClass = getRowClass(currentStatus);

        const tableRow = `
            <tr class="${rowClass}">
                <td>${index + 1}</td>
                <td>${orderid}</td>
                <td>${passengerid}</td>
                <td>${coolieid}</td>
                <td>${amountQuoted}</td>
                <td>${luggage}</td>
                <td>${order.contact_number || 'NA'}</td>
                <td>${selectedTime}</td>
                <td>${selectedDate}</td>
                <td>${selectedStationName}</td>
                <td>${selectedStationCode}</td>
                <td>${pickupPoint}</td>
                <td>${dropPoint}</td>
                <td>${OTP}</td>
                <td>${trainNumber}</td>
                <td>${trainName}</td>
                <td>${PNR}</td>
                <td>${coachPosition}</td>
                <td>${arrivalTimeScheduled}</td>
                <td>${arrivalTimeActual}</td>
                <td>${paymentMode}</td>
            </tr>
        `;
        tableBody.insertAdjacentHTML('beforeend', tableRow);
    });
}

function getRowClass(status) {
    let rowClass;

    if (status.includes('is not serviceable') || status.includes('Failure') || status.includes('Dispute')) {
        rowClass = 'table-danger'; // Order is not serviceable, failed, or disputed
    } else if (status.includes('Accepted')) {
        rowClass = 'table-primary'; // Order is accepted
    } else if (status.includes('Completed')) {
        rowClass = 'table-success'; // Order is completed
    } else if (status.includes('Modified')) {
        rowClass = 'table-warning'; // Order is modified
    } else if (status.includes('In Progress')) {
        rowClass = 'table-info'; // Order is in progress
    } else {
        rowClass = 'table-light'; // Default class for unknown status
    }

    return rowClass;
}

function updateDashboardSummary(data) {
    let inProgressCount = 0;
    let completedCount = 0;
    let cancelledCount = 0;
    let revenue = 0;

    data.forEach(order => {
        const currentStatus = order.current_status && order.current_status.status ? order.current_status.status : 'Unknown';

        if (currentStatus.includes('Accepted')) {
            inProgressCount++;
        } else if (currentStatus.includes('Completed')) {
            completedCount++;
            revenue += order.amount_quoted || 0;
        } else if (currentStatus.includes('is not serviceable') || currentStatus.includes('Failure') || currentStatus.includes('Dispute')) {
            cancelledCount++;
        }
    });

    // Update dashboard elements
    document.getElementById('ordersInProgress').querySelector('h2.mb-5').textContent = inProgressCount;
    document.getElementById('ordersInProgress').querySelector('h6.card-text').textContent = `${inProgressCount} orders in progress`;

    document.getElementById('ordersCompleted').querySelector('h2.mb-5').textContent = completedCount;
    document.getElementById('ordersCompleted').querySelector('h6.card-text').textContent = `Revenue : ₹ ${revenue.toFixed(2)}`;

    document.getElementById('ordersCancelled').querySelector('h2.mb-5').textContent = cancelledCount;
    document.getElementById('ordersCancelled').querySelector('h6.card-text').textContent = `${cancelledCount}`;
}


const BASE_URL = 'https://orderbackend.cooliewale.in/api/v1/orders/';

function url_status() {
    updateDataAndDOM(BASE_URL);
}

// Call the function to initiate data fetching (e.g., on page load)
url_status();
