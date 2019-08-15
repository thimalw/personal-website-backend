// make standard json response
const makeRes = (status, message = null, data = null) => {
    return { status, message, data };
};

// return promise
const to = (promise) => {
    return promise.then(data => {
        return [null, data];
    }, (err => [err]));
};

module.exports = {
    makeRes,
    to
};
