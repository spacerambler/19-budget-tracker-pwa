// export function saveRecord(databaseName, storeName, method, object) {
//     return new Promise((resolve, reject) => {
      const request = window.indexedDB.open("budgetTracker", 1);
      let db,
        tx,
        store;
  
      request.onupgradeneeded = function(e) {
        const db = request.result;
        db.createObjectStore("pending", { autoIncrement: true });
      };
  
      request.onerror = function(e) {
        console.log("There was an error");
      };
  
      request.onsuccess = function(e) {
        db = request.result;

        if (navigator.onLine) { 
          addToDatabase()
        }
        // tx = db.transaction(budgetStore, "readwrite");
        // store = tx.objectStore(budgetStore);
  
        // db.onerror = function(e) {
        //   console.log("error");
        // };
        // if (method === "put") {
        //   store.put(object);
        // }
        // if (method === "get") {
        //   const all = store.getAll();
        //   all.onsuccess = function() {
        //     resolve(all.result);
        //   };
        // }
        // tx.oncomplete = function() {
        //   db.close();
        // };
      };

      function saveRecord(transaction) {
        let transactions = db.transaction(['pending'], 'readwrite')
        let store = transactions.objectStore('pending')
        store.add(transaction)
      }

      function addToDatabase(){
        let transactions = db.transaction(['pending'], 'readwrite')
        let store = transactions.objectStore('pending')
        let getAllTransactions = store.getAll()
        getAllTransactions.onsuccess = () => {
          if (getAllTransactions.result.length > 0) {
            fetch('/api/transaction/bulk', {
              method: 'POST',
              body: JSON.stringify(getAllTransactions.result),
              headers: {
                Accept: 'application/json, text/plain',
                'content/type': 'application/json'
              }
            })
            .then(data => {
              return data.json()
            })
            .then(()=>{
              let transaction = db.transaction(['pending'], 'readwrite')
              let store = transactions.objectStore('pending')
              store.clear()
            })
          }
        }
      }
window.addEventListener('online', addToDatabase)
  