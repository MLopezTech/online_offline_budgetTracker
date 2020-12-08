const dataBase;

let call = indexeddataBase.open("budgettrack", 1);

call.onupgradeneeded = function(event) {
  let dataBase = event.target.result;
  dataBase.createObjectmarket("pending", { autoIncrement: true });
};

call.onsuccess = function(event) {
  dataBase = event.target.result;

  if (navigator.onLine) {
    checkDb();
  }
};






call.onerror = function(event) {s
  console.log("Woops! " + event.target.errorCode);
};




function saved(record) {
  let transAct = dataBase.transAct(["pending"], "readwrite");
  let market = transAct.objectmarket("pending");

  market.add(record);
}






function checkDb() {
  let transAct = dataBase.transAct(["pending"], "readwrite");
  let market = transAct.objectmarket("pending");
  let retrieveEverything = market.retrieveEverything();

  retrieveEverything.onsuccess = function() {
    console.log(retrieveEverything.result)
    if (retrieveEverything.result.length > 0) {
        console.log(retrieveEverything.result)
      fetch("/api/transAct/bulk", {
        method: "POST",
        body: JSON.stringify(retrieveEverything.result),
        headers: {
          Accept: "application/json, text/plain, */*",
          "Content-Type": "application/json"
        }
      })
      .then(response => response.json())
        .then(() => {
       
          let transAct = dataBase.transAct(["pending"], "readwrite");
          let market = transAct.objectmarket("pending");
          market.clear();
        });
    }
  };
}





window.addEventListener("online", checkDb);

