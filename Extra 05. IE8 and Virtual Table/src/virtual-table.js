var GridBody = React.createClass({
    getInitialState: function() {
        return {
            shouldUpdate: true,
            total: 0,
            displayStart: 0,
            displayEnd: 0
        };
    },

    componentWillReceiveProps: function(nextProps) {
        var shouldUpdate = !(
            nextProps.visibleStart >= this.state.displayStart &&
            nextProps.visibleEnd <= this.state.displayEnd
        ) || (nextProps.total !== this.state.total);

        if (shouldUpdate) {
            this.setState({
                shouldUpdate: shouldUpdate,
                total: nextProps.total,
                displayStart: nextProps.displayStart,
                displayEnd: nextProps.displayEnd
            });
        } else {
            this.setState({shouldUpdate: false});
        }
    },

    shouldComponentUpdate: function(nextProps, nextState) {
        return this.state.shouldUpdate;
    },
    
    render: function() {
        var rows = {};
        
        rows.top = (
            <tr id="gridgridrectop" line="top" style={{height: this.props.displayStart * this.props.recordHeight}}>
                <td colSpan="200"></td>
            </tr>
        );

        for (var i = this.props.displayStart; i <= this.props.displayEnd; ++i) {
            var record = this.props.records[i];
            rows['line' + i] = (
                <tr className={i % 2 === 0 ? 'w2ui-even' : 'w2ui-odd'} style={{height: this.props.recordHeight}}>
                    <td className="w2ui-grid-data" col="0">
                        <div title={i + 1}>{i + 1}</div>
                    </td>
                    <td className="w2ui-grid-data" col="1">
                        <div title={record.fname}>{record.fname}</div>
                    </td>
                    <td className="w2ui-grid-data" col="2">
                        <div title={record.lname}>{record.lname}</div>
                    </td>
                    <td className="w2ui-grid-data" col="3">
                        <div title={record.email}>{record.email}</div>
                    </td>
                    <td className="w2ui-grid-data-last"></td>
                </tr>
            );
        }
        rows.bottom = (
            <tr id="gridgridrecbottom" line="bottom" style={{height: (this.props.records.length - this.props.displayEnd) * this.props.recordHeight}}>
                <td colSpan="200"></td>
            </tr>
        );
        
        return (
            <table>
              <tbody>
                <tr line="0">
                  <td className="w2ui-grid-data" col="0" style={{height: 0, width: 50}}></td>
                  <td className="w2ui-grid-data" col="1" style={{height: 0, width: 150}}></td>
                  <td className="w2ui-grid-data" col="2" style={{height: 0, width: 150}}></td>
                  <td className="w2ui-grid-data" col="3" style={{height: 0, width: 150}}></td>
                  <td className="w2ui-grid-data-last" style={{height: 0, width: 81}}></td>
                </tr>
                {rows}
              </tbody>
            </table>
        );
    }
});

var Grid = React.createClass({
    getDefaultState: function(props) {
        var recordHeight = 25;
        var recordsPerBody = Math.floor((props.height - 2) / recordHeight);
        return {
            total: props.records.length,
            records: props.records,
            recordHeight: recordHeight,
            recordsPerBody: recordsPerBody,
            visibleStart: 0,
            visibleEnd: recordsPerBody,
            displayStart: 0,
            displayEnd: recordsPerBody * 2
        };
    },
    
    componentWillReceiveProps: function(nextProps) {
    	this.setState(this.getDefaultState(nextProps));
        if (this.state.scroll) {
            this.scrollState(this.state.scroll);
        }
    },

    componentDidMount: function (){
		// IE8
    	if (document.onscroll === undefined) {
	        var node = this.refs.scrollable.getDOMNode();
	        if (node.attachEvent) {
	            node.attachEvent('onscroll', this.onScroll);
	        }
	    }
    },

    componentWillUnmount: function (){
    	// IE8
    	if (document.onscroll === undefined) {
	        var node = this.refs.scrollable.getDOMNode();
    		if (node.detachEvent) {
    			node.detachEvent('onscroll', this.onScroll);
    		}
    	}
    },
    
    getInitialState: function() {
        return this.getDefaultState(this.props);
    },

    scrollState: function(scroll) {
        var visibleStart = Math.floor(scroll / this.state.recordHeight);
        var visibleEnd = Math.min(visibleStart + this.state.recordsPerBody, this.state.total - 1);

        var displayStart = Math.max(0, Math.floor(scroll / this.state.recordHeight) - this.state.recordsPerBody * 1.5);
        var displayEnd = Math.min(displayStart + 4 * this.state.recordsPerBody, this.state.total - 1);

        this.setState({
            visibleStart: visibleStart,
            visibleEnd: visibleEnd,
            displayStart: displayStart,
            displayEnd: displayEnd,
            scroll: scroll
        });
    },

    onScroll: function(event) {
        this.scrollState(this.refs.scrollable.getDOMNode().scrollTop);
    },
    
    formatNumber: function(number) {
        return (''+number).split('').reverse().join('').replace(/(...)/g, '$1,').split('').reverse().join('').replace(/^,/, '');
    },
    
    getCount: function() {
    	return (this.formatNumber(1 + this.state.visibleStart)) +
         '-' + (this.formatNumber(1 + this.state.visibleEnd)) +
         ' of ' + this.formatNumber(this.state.total);
    },

    render: function() {
        return (
    <div id="grid" style={{width: 600, height: 568}} name="grid" className="w2ui-reset w2ui-grid">
      <div style={{width: 598, height: 566}}>
        <div id="gridgridheader" className="w2ui-grid-header" style={{display: 'none'}}></div>
        <div id="gridgridbody" className="w2ui-grid-body" style={{top: 0, bottom: 24, left: 0, right: 0, height: 542}}>
          <div id="gridgridrecords" className="w2ui-grid-records" style={{top: 26, 'overflowX': 'hidden', 'overflowY': 'auto'}} ref="scrollable" onScroll={this.onScroll}>
              <GridBody
                  records={this.state.records}
                  total={this.state.records.length}
                  visibleStart={this.state.visibleStart}
                  visibleEnd={this.state.visibleEnd}
                  displayStart={this.state.displayStart}
                  displayEnd={this.state.displayEnd}
                  recordHeight={this.state.recordHeight}
              />
          </div>
          <div id="gridgridcolumns" className="w2ui-grid-columns">
            <table>
              <tbody>
                <tr>
                  <td col="0" className="w2ui-head" style={{width: 50}}>
                    <div className="w2ui-resizer" name="0" style={{height: 25, 'marginLeft': 46}}></div>
                    <div>ID</div>
                  </td>
                  <td col="1" className="w2ui-head" style={{width: 150}}>
                    <div className="w2ui-resizer" name="1" style={{height: 25, 'marginLeft': 146}}></div>
                    <div>First Name</div>
                  </td>
                  <td col="2" className="w2ui-head" style={{width: 150}}>
                    <div className="w2ui-resizer" name="2" style={{height: 25, 'marginLeft': 146}}></div>
                    <div>Last Name</div>
                  </td>
                  <td col="3" className="w2ui-head" style={{width: 150}}>
                    <div className="w2ui-resizer" name="3" style={{height: 25, 'marginLeft': 146}}></div>
                    <div>Email</div>
                  </td>
                  <td className="w2ui-head w2ui-head-last" style={{width: 98}}>
                    <div>{String.fromCharCode(160)}</div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
        <div id="gridgridsummary" className="w2ui-grid-body w2ui-grid-summary" style={{display: 'none'}}></div>
        <div id="gridgridfooter" className="w2ui-grid-footer" style={{bottom: 0, left: 0, right: 0}}>
          <div>
            <div className="w2ui-footer-left"></div>
            <div className="w2ui-footer-right">{this.getCount()}</div>
            <div className="w2ui-footer-center"></div>
          </div>
        </div>
      </div>
    </div>
    );
    }
});


window.generate = function generate(count) {	
    // generate
	var fname = ['Vitali', '~Katsia', 'John', 'Peter', '#Sue', '$Olivia', '<Thomas', '>Sergei', 'Snehal', 'Avinash', 'Divia'];
	var lname = ['Peterson', 'Rene', 'Johnson-Petrov-Sannikov-Ivanov-Smirnov', 'Cuban', 'Twist', 'Sidorov', 'Vasiliev', 'Yadav', 'Vaishnav'];
	// add records
    var records = [];
	for (var i = 0; i < count * 1000; i++) {
		records.push({ 
			recid : i+1,
			personid: i+1,
			fname: fname[Math.floor(Math.random() * fname.length)], 
			lname: lname[Math.floor(Math.random() * lname.length)],
			email: 'vm@gmail.com', sdate: '1/1/2013', manager: '--'
		});
	}

    React.render(
        <Grid
            width={600}
            height={568}
            name="grid"
            records={records}
        />,
        document.getElementById('grid')
    );
};

generate(25);
