import React, { Component } from 'react';
import Plot from 'react-plotly.js';


class MinimalTime extends Component {
  constructor(props) {
    super(props)

    this.state = {
      Gp: "",
      Ts: 0,
      step: {
        tstep: [],
        ystep: [],
      }
    }
  }

  onChangeForm(e) {
    this.setState({
      [e.target.name]: e.target.value
    })
  }


  onSubmitForm(e) {
    e.preventDefault();
    let data = {
      Gp: this.state.Gp,
      Ts: this.state.Ts,
      cond: this.state.cond,
      cond1: this.state.cond1,
      cond2: this.state.cond2,
      ess: this.state.ess,
      ess1: this.state.ess1,
      ctype: this.state.ctype,
    }

    this.calculate_system(data)
  }

  render() {

    const sizeStep = 1000

    return (
      <div className="App">
        <form className="input" onSubmit={this.onSubmitForm.bind(this)}>
          <label htmlFor="">Función de transferencia</label>
          <input id='Gp' name='Gp' type="text" value={this.state.Gp} onChange={this.onChangeForm.bind(this)} />

          <label htmlFor="">Tiempo de Muestreo</label>
          <input id='Ts' name='Ts' type="text" value={this.state.Ts} onChange={this.onChangeForm.bind(this)} />
          <label htmlFor="">Gráficas</label>
          <button id="calc" type='submit' >Calcular</button>
        </form>
        <div className="graphs">
          <Plot
            id='respuesta'
            data={[
              {
                x: this.state.step.tstep,
                y: this.state.step.ystep,
                type: 'scatter',
                mode: 'lines',
                name: 'respuesta',
                line: { shape: 'hv' },
              },
              // {
              //   x: this.state.step.tstep,
              //   y:  [1],
              //   type: 'scatter',
              //   mode: 'lines',
              //   name: 'entrada',
              // },
              // {
              //   x: this.state.step.tstep,
              //   y: this.state.step.xstep[0],
              //   type: 'scatter',
              //   name: 'entrada'
              // },
              // {
              //   x: this.state.step.tstep,
              //   y: this.state.step.xstep[1],
              //   type: 'scatter',
              //   name: 'entrada'
              // },
            ]}
            layout={{
              title: 'Respuesta en el tiempo del sistema con controlador',
              width: sizeStep,
              height: sizeStep * .6,
              xaxis: {
                title: 'tiempo (s)'
              },
              yaxis: {
                title: 'voltaje (V)'
              }
            }}
          />
        </div>
      </div>
    )
  }
}

export default MinimalTime;