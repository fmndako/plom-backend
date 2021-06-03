const moment = require('moment');

Date.prototype.monthDays= function(previous){
    let d= new Date(this.getFullYear(), this.getMonth()+ (previous ? 0: 1), 0);
    return d.getDate();
}

Date.prototype.startOf = function(period){
    return new Date(moment(this).startOf(period))
}

Date.prototype.endOf = function(period){
    return new Date(moment(this).endOf(period))
}

Date.prototype.yearsArray= function(str, desc){
    let years = [];
    for (let i=2017; i <= this.getFullYear(); i++) {
        years.push(str ? i.toString(): i);
    }
    return desc ? years.reverse() : years;
}

Date.prototype.addWorkDays = function (days) {
    if(isNaN(days)) {
        console.log("Value provided for \"days\" was not a number");
        return
    }
    // Get the day of the week as a number (0 = Sunday, 1 = Monday, .... 6 = Saturday)
    let dow = this.getDay();
    let daysToAdd = parseInt(days);
    // If the current day is Sunday add one day
    if (dow == 0) {
        daysToAdd++;
    }
    // If the start date plus the additional days falls on or after the closest Saturday calculate weekends
    if (dow + daysToAdd >= 6) {
        //Subtract days in current working week from work days
        let remainingWorkDays = daysToAdd - (5 - dow);
        //Add current working week's weekend
        daysToAdd += 2;
        if (remainingWorkDays > 5) {
            //Add two days for each working week by calculating how many weeks are included
            daysToAdd += 2 * Math.floor(remainingWorkDays / 5);
            //Exclude final weekend if the remainingWorkDays resolves to an exact number of weeks
            if (remainingWorkDays % 5 == 0)
                daysToAdd -= 2;
        }
    }
    this.setDate(this.getDate() + daysToAdd);
};
function add_weeks(dt, n, substract) {
    let date = new Date(dt);
    if(substract) return new Date(date.setDate(date.getDate() - (n * 7)));      
    return new Date(date.setDate(date.getDate() + (n * 7)));      
  }
  function add_days(dt, n, substract){
    let date = new Date(dt);
    if (substract) return new Date(date.setDate(date.getDate() - n));  
    return new Date(date.setDate(date.getDate() + n));  
  }
  
  function add_months(dt, n, substract){
    let date = new Date(dt);
    if (substract) return new Date(date.setMonth(date.getMonth() - n));
    return new Date(date.setMonth(date.getMonth() + n));
  }
  
  Date.prototype.addPeriod = function(type, period, substract){
    let dt = this;
    switch(type){
      case 'Days': 
        return add_days(dt, period, substract);
      case 'Months':
        return add_months(dt, period, substract);
      case 'Weeks':
        return add_weeks(dt, period, substract);
    }
  }
  
  console.log(new Date().addPeriod('Days', 7, true));