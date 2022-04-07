import setText, { appendText } from "./results.mjs";

export function timeout() {
    const wait = new Promise((resolve) => {
        setTimeout(() => {
            resolve('Timeout!');
        }, 1500)
    })

    wait.then(text => setText(text));
}

export function interval() {
    let counter = 0;
    const wait = new Promise((resolve) => {
        setInterval(() => {
            console.log('setInterval fired')
            resolve(`Timeout ${++counter}`);
        }, 1500)
    })

    wait.then(text => setText(text))
        .finally (() => appendText(` --Done ${counter}`));
        // TODO: update the UI each time setInterval is fired
}

export function clearIntervalChain() {
    let counter = 0;
    let intervalID;
    const wait = new Promise((resolve) => {
        intervalID = setInterval(() => {
            console.log('setInterval fired')
            resolve(`Timeout ${++counter}`);
        }, 1500)
    })

    wait.then(text => setText(text))
        .finally(() => clearInterval(intervalID));
}

export function xhr() {
    let request = new Promise((resolve,reject) => {
        let xhr = new XMLHttpRequest();
        xhr.open('GET', 'http://localhost:3000/users/7');
        xhr.onload = () => {
            if (xhr.status === 200) {
                resolve(xhr.responseText);
            }
            reject(xhr.statusText);
        } 
        xhr.onerror = () => reject('Request Failed'); // only runs on network error
        xhr.send();
    });

    request.then(result => setText(result))
           .catch(reason => setText(reason));
}

export function allPromises() {
    // use in case data returned from promises is related
    let categories = axios.get('http://localhost:3000/itemCategories');
    let statuses = axios.get('http://localhost:3000/orderStatuses');
    let userTypes = axios.get('http://localhost:3000/userTypes');
    let addressTypes = axios.get('http://localhost:3000/addressTypes');

    Promise.all([categories, statuses, userTypes, addressTypes])
           .then(([cat, stat, type, address]) => {
             setText('');
             
             appendText(JSON.stringify(cat.data));
             appendText(JSON.stringify(stat.data));
             appendText(JSON.stringify(type.data));
             appendText(JSON.stringify(address.data));
           })
           .catch((err) => {
                setText(err);
           });
}

export function allSettled() {
    let categories = axios.get('http://localhost:3000/itemCategories');
    let statuses = axios.get('http://localhost:3000/orderStatuses');
    let userTypes = axios.get('http://localhost:3000/userTypes');
    let addressTypes = axios.get('http://localhost:3000/addressTypes');

    Promise.allSettled([categories, statuses, userTypes, addressTypes])
    // use in case data returned from promises is independent
           .then((values) => {
                let results = values.map((v) => {
                    if (v.status === 'fulfilled') { 
                        return `fulfilled: ${JSON.stringify(v.value.data[0])} `;
                    }
                    
                    return `rejected ${v.reason.message} `;
                });

                setText(results);
            })
           .catch((err) => {
                setText(err);
           });
}

export function race() {
    // will only wait until the fastest promise is settled
    // our example here also needs secondary port 3001 to be running
    let users = axios.get('http://localhost:3000/users');
    let backupUsers = axios.get('http://localhost:3001/users');

    Promise.race([users, backupUsers])
        .then((users) => {
            setText(JSON.stringify(users.data))
        })
        .catch((err) => {
            setText(err);
        });
}