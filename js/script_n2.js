let data;

function updateDataAndDOM(url) {
    fetch(url)
        .then(response => response.json())
        .then(fetchedData => {
            if (JSON.stringify(data) !== JSON.stringify(fetchedData)) {
                data = fetchedData;
                updateDOM(data);
            }
            setTimeout(updateDataAndDOM, 5000);
        })
        .catch(error => {
            console.error('Error fetching data:', error);

        });
}

function updateDOM(data) {
    document.title = `Order Status `;
//  create the initial table with its class 
    const container = document.querySelector('.status');
    let elementsString = `  <table class="table table-bordered table-hover"> 
   <thead>        
                                            <tr>
                                                <th> # </th>
                                                <th> Booking Id </th>
                                                <th> User Id </th>
                                                  <th>Coolie Id </th>
                                                <th> Amount </th>
                                                <th> Baggage</th>
                                                <th> Booking Receieved At </th>
                                                <th> Requested Time </th>
                                                <th> Completed Time </th>
                                                <th> Payment Mode </th>
                                            </tr>
                                      </thead>
                                       <tbody>`;

for (const aData in data.data) {
  const order = data.data[aData];
  const coolie = order.coolie_asigned && order.coolie_asigned.length > 0 ? order.coolie_asigned[0] : null;
  const coolieId = coolie ? coolie.coolie_id : '';

  elementsString += `
    <tr>
      <td> ${aData} </td>  <td> ${order.booking_id}</td>
      <td> ${order.user_id}</td>
      <td> ${coolieId}  </td>
      <td> ₹ ${order.quoted_amount || ''}</td>
      <td> ${order.luggage ? JSON.stringify(order.luggage) : ''}</td>
      <td> ${order.booking_recieved_at} </td>
      <td> ${order.selected_time || ''}</td>
      <td> ${JSON.stringify(order.current_status) || ''}</td>
    </tr>
  `;
}

//  last part of the table 
    elementsString += `      </tbody> 
    </table>
     </div>`;

    container.innerHTML = elementsString;
}




function url_status() {
    BASE_URL = 'http://127.0.0.1:4500/api/v1/orders/';
    updateDataAndDOM(BASE_URL);
}
url_status()
