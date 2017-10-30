import React, { Component } from 'react';
import DatePicker from 'react-datepicker';
import moment from 'moment';

import logo from './logo.svg';
import './styles/index.sass';
import 'react-datepicker/dist/react-datepicker.css';

class App extends Component {



  constructor(props) {
    super(props);
    this.state = {
      startTime : moment(),
      endTime: moment().add(9, 'h').add(48, 'm')
    }
  }



  handleChange(date, item) {

    this.setState({
      [item]: date
    });

    if(item == 'startTime'){
      let tempTime = date.clone()
      this.setState({
        endTime: tempTime.add(9, 'h').add(48, 'm')
      });
    }

  }



  setNow(e, item){
    this.setState({
      [item]: moment(),
    });
  }



  changeTime(operation, item){
    let tempTime = this.state[item].clone();
    switch(operation){
      case 'minus':
        tempTime.subtract(1, 'm')
      break;
      case 'plus':
        tempTime.add(1, 'm')
      break;
    }
    this.setState({
      [item]: tempTime,
    });
  }



  render() {
    return (
      <div className="App">
        <header className="App-header">
          <h1 className="App-title">Banco de Horas</h1>
        </header>
        <h3> Hora de chegada </h3>
        <DatePicker
            selected={this.state.startTime}
            onChange={e => this.handleChange(e, 'startTime') }
            showTimeSelect
            timeFormat="HH:mm"
            timeIntervals={15}
            dateFormat="LLL"
            shouldCloseOnSelect={false}
        />
        <button
          onClick={e=>this.changeTime('minus', 'startTime')}
          className="banco__btn-set-time">
          <i className="fa fa-minus"></i>
        </button>
        <button
          onClick={e=>this.changeTime('plus', 'startTime')}
          className="banco__btn-set-time">
          <i className="fa fa-plus"></i>
        </button>
        <button
          onClick={e=>this.setNow(e, 'startTime')}
          className="banco__btn-set-time">
          <i className="fa fa-clock-o"></i>
        </button>
        <h3> Hora de saída </h3>
        <DatePicker
            selected={this.state.endTime}
            onChange={e => this.handleChange(e, 'endTime') }
            showTimeSelect
            timeFormat="HH:mm"
            timeIntervals={15}
            dateFormat="LLL"
            shouldCloseOnSelect={false}
        />
        <button
          onClick={e=>this.changeTime('minus', 'endTime')}
          className="banco__btn-set-time">
          <i className="fa fa-minus"></i>
        </button>
        <button
          onClick={e=>this.changeTime('plus', 'endTime')}
          className="banco__btn-set-time">
          <i className="fa fa-plus"></i>
        </button>
        <button
          onClick={e=>this.setNow(e, 'endTime')}
          className="banco__btn-set-time">
          <i className="fa fa-clock-o"></i>
        </button>
      </div>
    );
  }
}

export default App;
