import React, { Component } from 'react';
import Plot from 'react-plotly.js';
import axios from 'axios';

import './App.css';
import './plotly.css';


//const server_url = 'http://control.tabares.me';
const server_url = 'http://localhost:8000';

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      rlocus: {
        redata: [],
        imdata: [],
        poles: [],
        zeros: [],
      },
      step: {
        ystep: [],
        tstep: [],
        xstep: [],
      },
      Gp: '0.5(150s+1)',
      Ts: '20',
      cond: '1',
      cond1: '0.5',
      cond2: '4',
      ess: '1',
      ess1: '0',
      ctype: 'Comp',
    }
  }

  calculate_system(params) {
    console.log(params)

    axios.get(server_url + '/lgr', {
      params: params
    }).then((response) => {

      let data = response.data.result
      console.log(data)

      let lgr = data["rlocus"][0]
      let redata = lgr[0]
      let imdata = lgr[1]

      let zeros = data["rlocus"][1]
      let poles = data["rlocus"][2]

      let [ystep, tstep, xstep] = data["step"]


      console.log(ystep[0])
      this.setState({
        rlocus: {
          redata: redata,
          imdata: imdata,
          poles: poles,
          zeros: zeros,
        },
        step: {
          tstep: tstep,
          ystep: ystep[0],
          xstep: xstep,
        }
      })

    })
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

    const sizePZ = 10
    const sizeLGR = 1000
    const sizeStep = 1000
    const circleColor = "rgba(178, 216, 189, 0.1)"
    const annotationColor = "rgba(178, 216, 189, 1)"
    const lineColor = "rgba(178, 216, 189, 1)"

    return (
      <div className="App">
        <form className="input" onSubmit={this.onSubmitForm.bind(this)}>
          <label htmlFor="">Función de transferencia</label>
          <input id='Gp' name='Gp' type="text" value={this.state.Gp} onChange={this.onChangeForm.bind(this)} />

          <label htmlFor="">Tiempo de Muestreo</label>
          <input id='Ts' name='Ts' type="text" value={this.state.Ts} onChange={this.onChangeForm.bind(this)} />

          <label htmlFor="">Condiciones de Diseño</label>
          <select id='id' name="cond" value={this.state.cond} onChange={this.onChangeForm.bind(this)}>
            <option value='1'>\zeta y wn</option>
            <option value='2'>\zeta y n</option>
            <option value='3'>ts y Mp</option>
            <option value='4'>ts y \zeta</option>
            <option value='5'>ts y n</option>
            <option value='6'>n y Mp</option>
          </select>
          <input id="cond1" name='cond1' type="text" value={this.state.cond1} onChange={this.onChangeForm.bind(this)} />
          <input id="cond2" name='cond2' type="text" value={this.state.cond2} onChange={this.onChangeForm.bind(this)} />

          <label htmlFor="">Error en estado estacionario</label>
          <select name="ess" id="ess" value={this.state.ess} onChange={this.onChangeForm.bind(this)} >
            <option value='1' default>sin condición</option>
            <option value='2'>ep constante</option>
            <option value='3'>ep = 0</option>
            <option value='4'>ep = 0, kv constante</option>
            <option value='5'>ev = 0</option>
            <option value='6'>ev = 0, ka constante</option>
            <option value='7'>ea  = 0</option>
          </select>
          <input id="ess1" name='ess1' type="text" value={this.state.ess1} onChange={this.onChangeForm.bind(this)} />

          <label htmlFor="">Tipo de controlador</label>
          <select id="ctype" name="ctype" value={this.state.ctype} onChange={this.onChangeForm.bind(this)}>
            <option value='PD'>PD</option>
            <option value='PID'>PID</option>
            <option value='PI'>PI</option>
            <option value='Comp' default>Compensador</option>
          </select>

          <label htmlFor="">Gráficas</label>
          <button id="calc" type='submit' >Calcular</button>
        </form>
        <div className="graphs">
          <Plot
            id='LGR'
            data={
              this.state.rlocus.redata.map((d, i) => (
                {
                  x: this.state.rlocus.redata[i],
                  y: this.state.rlocus.imdata[i],
                  type: 'scatter',
                  mode: 'lines',
                  showlegend: false,
                })
              ).concat([
                {
                  x: this.state.rlocus.zeros[0],
                  y: this.state.rlocus.zeros[1],
                  type: 'scatter',
                  mode: 'markers',
                  name: "zeros",
                  marker: {
                    symbol: "circle-open",
                    size: sizePZ,
                  }
                },
                {
                  x: this.state.rlocus.poles[0],
                  y: this.state.rlocus.poles[1],
                  type: 'scatter',
                  mode: 'markers',
                  name: "polos",
                  marker: {
                    symbol: "x-thin-open",
                    size: sizePZ,
                  }
                }
              ])

            }
            layout={{
              title: 'Lugar Geométrico de las Raices',
              width: sizeLGR,
              height: sizeLGR,
              xaxis: {
                title: 'real',
              },
              yaxis: {
                title: 'imaginario',
                scaleanchor: "x",
                scaleratio: 1,
              },
              annotations: [
                {
                  x: 1 / Math.sqrt(2),
                  y: 1 / Math.sqrt(2),
                  xref: 'x',
                  yref: 'y',
                  text: 'estabilidad',
                  showarrow: true,
                  arrowhead: 0,
                  ax: 40,
                  ay: -40,
                  font: {
                    color: annotationColor,
                    // size: 12
                  },
                  arrowcolor: annotationColor,
                }
              ],
              shapes: [
                {
                  type: 'circle',
                  xref: 'x',
                  yref: 'y',
                  x0: -1,
                  y0: 1,
                  x1: 1,
                  y1: -1,
                  fillcolor: circleColor,
                  line: {
                    color: lineColor,
                    dash: 'dot',
                  }
                },
              ]
            }}
          />
          <option value=""></option>
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
    );
  }
}

export default App;
