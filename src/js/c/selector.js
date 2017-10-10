import React from 'react';
import ReactDOM from 'react-dom';
import $ from "jquery";

class Selector extends React.Component {
  constructor(props) {
    super(props);
    this.state = {value: this.props.selected, devices: this.props.devices};
    this.handleChange = this.handleChange.bind(this);
    this.redraw = this.props.cb;
  }

  handleChange(event) {
    this.setState({value: event.target.value});
    this.redraw(event.target.value);
  }

  render() {
    return <div id="selector" >
      <form>
        <label>Select a Device</label>
        <select value={this.state.value} onChange={this.handleChange}>
          {this.state.devices.map(function(value, index){
            return <option value={index}> {value.name} </option>;
          })
        }</select>
      </form>
    </div>;
  }
}

export default Selector;
