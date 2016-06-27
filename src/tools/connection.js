export
default

function connection() {
    //KM what's the point of the self=this ? why not just use "this" throughout?
    let self = this;
    this.buffer = [];
    this.event = function(data) {
        if (self._dataSubscriber) {
            //KM is there a definition of _dataSubscriber anywhere? what does it do with the data here?
            self._dataSubscriber(data);
        } else {
            self.buffer.push(data);
        }
    };

    this._flush = () => {
        if (self._dataSubscriber) {
            for (var i = self.buffer.length - 1; i >= 0; i--) {
                self._dataSubscriber(self.buffer[i]) && self.buffer.splice(i, 1);
            }
        }
        return;
    };

    //KM does this only happen once at the beginning, or all the time, or what does the break here do?
    this.on = function(event, _dataSubscriber) {
        switch (event) {
            case 'data':
                //KM so in case there is data, make a _dataSubscriber? 
                self._dataSubscriber = _dataSubscriber;
                //KM then assign it the contents of buffer as you delete them one by one?
                this._flush();
                break;
            case 'error':
                break;
            case 'connectionLost':
                break;
            case 'reconnecting':
                break;
        }
    };
}