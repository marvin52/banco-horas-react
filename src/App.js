import React, { Component } from 'react';
import DatePicker from 'react-datepicker';
import moment from 'moment';

import logo from './logo.svg';
import './styles/index.sass';
import 'react-datepicker/dist/react-datepicker.css';

class App extends Component {



  constructor(props) {

    super(props);

    if(typeof localStorage["history"] == "undefined")
      localStorage['history'] = JSON.stringify({dateList:[]});

    this.state = {
      startTime : moment(),
      endTime: moment().add(9, 'h').add(48, 'm'),
      dateList: JSON.parse(localStorage['history']).dateList.map(e => ({
        startTime: moment(e.startTime),
        endTime: moment(e.endTime)
      }))
    }

  }


  saveState(obj){
    this.setState(obj)
    localStorage['history'] = JSON.stringify(obj)
  }


  handleChange(date, item) {

    this.setState({
      [item]: date
    });

    this.endFromStart(date, item)

  }



  setNow(e, item){
    this.setState({
      [item]: moment(),
    });

    this.endFromStart(moment(), item)
  }



  endFromStart(date, item){
    if(item == 'startTime'){
      let tt = date.clone()
      this.setState({
        endTime: tt.add(9, 'h').add(48, 'm')
      });
    }
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

    this.endFromStart(tempTime, item)

  }

  hhmmss(secs) {
    secs = secs > 0 ? secs : secs*-1
    let pad = n => ("0"+n).slice(-2);
    let minutes = Math.floor(secs / 60);
    secs = secs%60;
    let hours = Math.floor(minutes/60)
    minutes = minutes%60;
    let result = pad(hours)+":"+pad(minutes)+":"+pad(secs);
    return result
  }

  saveDate(){

    let { dateList } = this.state

    dateList.push({
      startTime : this.state.startTime,
      endTime : this.state.endTime
    });

    this.saveState({ dateList })
  }

  render() {
    const saldoTotal = this.state.dateList.reduce(
        (t,c) => t + ((31680 - ((c.startTime.diff(c.endTime, 'seconds') * -1) - 3600))*-1)
    ,0)
    return (
      <div className="banco__app">
        <div className="banco__sidebar">
          <header className="banco__app-header">
            <h2 className="banco__app-title">Banco de Horas</h2>
          </header>
          <h3 id="banco__title-start"> Hora de chegada </h3>
          <DatePicker
              selected={this.state.startTime}
              onChange={e => this.handleChange(e, 'startTime') }
              showTimeSelect
              timeFormat="HH:mm"
              timeIntervals={15}
              dateFormat="LLL"
              shouldCloseOnSelect={false}
          />
          <div className="banco__btn-wrapper">
            <button
              onClick={e=>this.changeTime('minus', 'startTime')}
              className="banco__btn-set-time">
              <i className="fa fa-minus"></i> 1
            </button>
            <button
              onClick={e=>this.setNow(e, 'startTime')}
              className="banco__btn-set-time">
              <i className="fa fa-clock-o"></i>
            </button>
            <button
              onClick={e=>this.changeTime('plus', 'startTime')}
              className="banco__btn-set-time">
              <i className="fa fa-plus"></i> 1
            </button>
          </div>
          <h3 id="banco__title-end"> Hora de saída </h3>
          <DatePicker
              selected={this.state.endTime}
              onChange={e => this.handleChange(e, 'endTime') }
              showTimeSelect
              timeFormat="HH:mm"
              timeIntervals={15}
              dateFormat="LLL"
              shouldCloseOnSelect={false}
          />
          <div className="banco__btn-wrapper">
            <button
              onClick={e=>this.changeTime('minus', 'endTime')}
              className="banco__btn-set-time">
              <i className="fa fa-minus"></i> 1
            </button>
            <button
              onClick={e=>this.setNow(e, 'endTime')}
              className="banco__btn-set-time">
              <i className="fa fa-clock-o"></i>
            </button>
            <button
              onClick={e=>this.changeTime('plus', 'endTime')}
              className="banco__btn-set-time">
              <i className="fa fa-plus"></i> 1
            </button>
          </div>
          <button
            onClick={e=>this.saveDate()}
            className="banco__btn-save">
            <i className="fa fa-save"></i> Salvar
          </button>
        </div>
        <div className="banco__container">
          <h2>Histórico de horários</h2>
          <table className="banco__hours-table">
            <thead>
              <tr>
                <td> Dia </td>
                <td> Hora chegada </td>
                <td> Hora saída </td>
                <td> Saldo </td>
                <td> Ações </td>
              </tr>
            </thead>
            <tbody>
            {this.state.dateList
            .sort((l, r) => l.startTime.diff(r.startTime))
            .map( (e, i) => {
              let saldo = (31680 - ( (e.startTime.diff(e.endTime, 'seconds') * -1) - 3600))*-1
              return (
                <tr key={i}>
                  <td>
                    {e.startTime.format('D/M')}
                  </td>
                  <td>
                    {e.startTime.format('h:mm a')}
                  </td>
                  <td>
                    {e.endTime.format('h:mm a')}
                  </td>
                  <td className={saldo >= 0 ? 'banco__saldo-positivo' : 'banco__saldo-negativo'}>
                    { this.hhmmss(saldo)}
                  </td>
                  <td>
                    <button
                      key-object={i}
                      onClick={e => {
                        let index = parseInt(e.target.getAttribute('key-object'))
                        this.setState({
                          dateList : this.state.dateList.filter((a,n)=>n!==index)
                        })
                      } }
                      className="banco__btn-trash">
                      <i key-object={i} className="fa fa-trash-o"></i>
                    </button>
                  </td>
                </tr>
              )}
            )}
            </tbody>
            <tfoot>
              <tr>
                <td colSpan="3">Total Horas</td>
                <td colSpan="2">
                  {
                    this.hhmmss(
                      this.state.dateList.reduce(
                          (t,c) => t + ((c.startTime.diff(c.endTime, 'seconds') * -1) - 3600)
                      ,0)
                    )
                  }
                </td>
              </tr>
              <tr>
                <td colSpan="3">Total Saldo</td>
                <td
                  colSpan="2"
                  className={saldoTotal >= 0 ? 'banco__saldo-positivo' : 'banco__saldo-negativo'}>
                  { this.hhmmss(saldoTotal) }
                </td>
              </tr>
            </tfoot>
          </table>
        </div>
      </div>
    );
  }
}

export default App;
