//convert an hour into milliseconds
var oneHourMs = 1000 * 3600;

//figure out the days in the current month
var daysInMonth = function() {
    var d = new Date();
    d.setDate(0);
    return d.getDate();
};


function calculateTimeframe(timeframeStr) {
    var obj = {
        end: new Date()
    };
    var startDate = new Date();
    var sampleSize = null;
    switch (timeframeStr) {
        case '1h':
            //if you want to get history for an hour, the start time will be the current time minus an hour (of milliseconds)
            startDate = new Date(obj.end.getTime() - oneHourMs);
            sampleSize = '1m';
            break;
        case '5h':
            startDate = new Date(obj.end.getTime() - oneHourMs * 5);
            sampleSize = '1m';
            break;
        case '1d':
            startDate = new Date(obj.end.getTime() - oneHourMs * 24);
            sampleSize = '1m';
            break;
        case '1w':
            startDate = new Date(obj.end.getTime() - oneHourMs * 24 * 7);
            sampleSize = '1h';
            break;
        case '1m':
            startDate = new Date(obj.end.getTime() - oneHourMs * 24 * daysInMonth());
            sampleSize = '1h';
            break;
        case '1y':
            startDate.setFullYear(obj.end.getFullYear() - 1);
            sampleSize = '1h';
            break;
    };
    //now that the start time is calculated based on how much history you want, you can set it in the object
    obj.start = startDate;
    //the sampleSize scales based on how big an interval you want to look at
    obj.sampleSize = sampleSize;

    return obj;
};

export
default calculateTimeframe;