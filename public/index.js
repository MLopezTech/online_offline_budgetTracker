let transActi = [];


let theChart;


fetch("/api/transaction")
  .then(response => response.json())
  .then(data => {
  
    transActi = data;
    generateGrandTotal();
    inhabitTable();
    populateChart();


  });




function generateGrandTotal() {
  
  const total = transActi.reduce((total, t) => {
    return total + parseInt(t.value);
  }, 0);

  const totalEl = document.querySelector("#total");
  totalEl.textContent = total;
}




function inhabitTable() {
  const TheBody = document.querySelector("#TheBody");
  TheBody.innerHTML = "";

  transActi.forEach(transaction => {
    
    const first = document.createElement("first");
    first.innerHTML = `
      <td>${transaction.name}</td>
      <td>${transaction.value}</td>
    `;

    TheBody.appendChild(tr);
  });


}

function populateChart() {
  const backPedal = transActi.slice().reverse();
  let sum = 0;

  const marker = backPedal.map(t => {
    const date = new Date(t.date);
    return `${date.getMonth() + 1}/${date.getDate()}/${date.getFullYear()}`;
  });

  const data = backPedal.map(t => {
    sum += parseInt(t.value);
    return sum;
  });

  // remove old chart if it exists
  if (theChart) {
    theChart.destroy();
  }

  const ctx = document.getElementById("theChart").getContext("2d");

  theChart = new Chart(ctx, {
    type: "line",
    data: {
      marker,
      datasets: [
        {
          label: "Total Over Time",
          fill: true,
          backgroundColor: "#6666ff",
          data
        }
      ]
    }
  });
}

function sendTransaction(isAdding) {
  const nameEl = document.querySelector("#t-name");
  const amountEl = document.querySelector("#t-amount");
  const errorEl = document.querySelector(".error");

  if (nameEl.value === "" || amountEl.value === "") {
    errorEl.textContent = "Missing Information";
    return;
  } else {
    errorEl.textContent = "";
  }

  const transaction = {
    name: nameEl.value,
    value: amountEl.value,
    date: new Date().toISOString()
  };

  if (!isAdding) {
    transaction.value *= -1;
  }

  transActi.unshift(transaction);

  populateChart();
  inhabitTable();
  generateGrandTotal();

  // also send to server
  fetch("/api/transaction", {
    method: "POST",
    body: JSON.stringify(transaction),
    headers: {
      Accept: "application/json, text/plain, */*",
      "Content-Type": "application/json"
    }
  })
    .then(response => response.json())
    .then(data => {
      if (data.errors) {
        errorEl.textContent = "Missing Information";
      } else {
        // clear form
        nameEl.value = "";
        amountEl.value = "";
      }
    })
    .catch(err => {
      saveRecord(transaction);

      // clear form
      nameEl.value = "";
      amountEl.value = "";
    });
}

document.querySelector("#add-btn").addEventListener("click", function(event) {
  event.preventDefault();
  sendTransaction(true);
});

document.querySelector("#sub-btn").addEventListener("click", function(event) {
  event.preventDefault();
  sendTransaction(false);
});

