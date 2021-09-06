function removeArrayProperties(obj, array, model){
    let p = {};
    if (model) obj = obj.toJSON();
    Object.keys(obj).forEach(k => {
        if(!array.includes(k)) p[k] = obj[k];
    });
    return p;

}

function checkPassword(str){
    let re = /^(?=.*\d)(?=.*[!@#$%^'"&*])(?=.*[a-z])(?=.*[A-Z]).{8,}$/;
    return re.test(str);
}
function phoneNumberValidator(num){
    let re = /\+1?\d{9,15}$/;
    return re.test(num);
} 
function emailValidator(num){
    let re = /.*@.*\..*$/;
    return re.test(num);
} 


function returnOnlyArrayProperties(obj, array, model){
    let newObj = {};
    if (model) obj = obj.toJSON();
    Object.keys(obj).forEach(k => {
        if(array.includes(k)) newObj[k] = obj[k];
    });
    return newObj;

}

function sumArray(array, key){
    let total = 0;
    array.forEach( o => {
        total += key ? o[key] : o;
    });
    return total;

}

module.exports = {
    removeArrayProperties,
    returnOnlyArrayProperties,
    sumArray, checkPassword, phoneNumberValidator
};
