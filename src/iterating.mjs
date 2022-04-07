import setText , {appendText} from './results.mjs';

export async function get(){
    const { data } = await axios.get('/orders/1');
    setText(JSON.stringify(data));
}

export async function getCatch(){
    try {
        const { data } = await axios.get('/orders/123');
        setText(JSON.stringify(data));
    } catch (error) {
        setText(error);
    }
}

export async function chain(){
    const { data } = await axios.get('/orders/1');
    const { data: address } = await axios.get(
        `addresses/${data.shippingAddress}`);

    setText(`City: ${JSON.stringify(address.city)}`);
}

export async function concurrent(){
    // this will allow both calls to run independently
    // and return the fastest one first
    const orderStatus = axios.get('http://localhost:3000/orderStatuses');
    const orders = axios.get('http://localhost:3000/orders');

    setText('');

    // even though we are telling the code to await for the slower call
    // since both we made simultaneously, by the time orderStatus is complete
    // orders was completed first
    const { data: statuses } = await orderStatus;
    const { data: order } = await orders;

    appendText(JSON.stringify(statuses));
    appendText(JSON.stringify(order[0]));
}

export async function parallel(){
    // if we want both of them to run simultaneously but
    // display them in the actual order they come back
    setText('');

    await Promise.all([
        (async () => {
            const { data } = await axios.get('http://localhost:3000/orderStatuses');
            appendText(JSON.stringify(data));
        })(),
        (async () => {
            const { data } = await axios.get('http://localhost:3000/orders');
            appendText(JSON.stringify(data));
        })(),
    ])
}