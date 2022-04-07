import setText, {appendText, showWaiting, hideWaiting} from './results.mjs';

export function get(){
    axios.get("http://localhost:3000/orders/1")
    .then(({data}) => {
        setText(JSON.stringify(data));
    });
    // npm run dev to run server
    // localhost 3000 is server
    // localhost 3000/home is landing page
}

export function getCatch(){
    axios.get("http://localhost:3000/orders/123")
    .then(({result}) => {
            setText(JSON.stringify(result.data));
        }
    )
    .catch(err => setText(err));
    //we force it to change by adding an order we know doesn't exist
}

export function chain(){
    axios.get("http://localhost:3000/orders/1")
    .then(({data}) => {
        return axios.get(`http://localhost:3000/addresses/${data.shippingAddress}`);
    })
    .then(({data}) => {
        setText(`City: ${data.city}`);
    });
}

export function chainCatch(){
    // also, we can have more fine-grained control of errors by throwing a specific 
    // error after a specific then
    axios.get("http://localhost:3000/orders/1")
    .then(({data}) => {
        // purposefully forgeting return value on first then to set off error
        axios.get(`http://localhost:3000/addresses/${data.shippingAddress}`);
    })
    .then(({data}) => {
        setText(`City: ${data.city}`);
    })
    .catch((err) => {
        setText(err);
    });
}

export function final(){
    showWaiting();
    axios.get("http://localhost:3000/orders/1")
    .then(({data}) => {
        return axios.get(`http://localhost:3000/addresses/${data.shippingAddress}`);
    })
    .then(({data}) => {
        setText(`City: ${data.city}`);
    })
    .catch((err) => {
        setText(err);
    })
    .finally(() => {
        // this isn't how we would normally control the indicator but for
        // demonstration purposes, this is how we would perform a last operation
        // after a resolved or rejected promises
        setTimeout(() => {
            hideWaiting();
        }, 1500);

        appendText(" -- Completely Done.")
    });
}
