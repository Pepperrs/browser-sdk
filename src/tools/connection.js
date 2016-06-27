export
default

function connection() {
    let self = this;
    this.buffer = [];
    this.event = function(data) {
        if (self._dataSubscriber) {
            self._dataSubscriber(data);
        } else {
            self.buffer.push(data);
        }
    }

    this._flush = () => {
        if (self._dataSubscriber) {
            for (var i = self.buffer.length - 1; i >= 0; i--) {
                self._dataSubscriber(self.buffer[i]) && self.buffer.splice(i, 1);
            }
        }
        return;
    }

    this.on = function(event, _dataSubscriber) {
        switch (event) {
            case "data":
                self._dataSubscriber = _dataSubscriber;
                this._flush();
                break;
            case "error":
                break;
            case "connectionLost":
                break;
            case "reconnecting":
                break;
        }
    }

}
