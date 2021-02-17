function removeArrayProperties(obj, array, model){
    let p = {};
    if (model) obj = obj.toJSON();
    Object.keys(obj).forEach(k => {
        if(!array.includes(k)) p[k] = obj[k];
    });
    return p;

}

function returnOnlyArrayProperties(obj, array, model){
    let newObj = {};
    if (model) obj = obj.toJSON();
    Object.keys(obj).forEach(k => {
        if(array.includes(k)) newObj[k] = obj[k];
    });
    return newObj;

}

module.exports = {
    removeArrayProperties,
    returnOnlyArrayProperties
};
