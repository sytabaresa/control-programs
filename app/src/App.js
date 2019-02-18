import React, { Component } from 'react';
import Plot from 'react-plotly.js';
import nj from 'numjs';
import axios from 'axios';

import './App.css';
import './plotly.css';


const style = 'https://codepen.io/chriddyp/pen/bWLwgP.css';


//const server_url = 'http://control.tabares.me';
const server_url = 'http://localhost:8000';

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      rlocus: {
        redata: [],
        imdata: [],
      },
      step: {
        ystep: [],
        tstep: [],
        xstep: [],
      },
      Gp: '1/(s*(s+2))',
      Ts: '0.2',
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
      console.log(response)

      let data = response.data.result
      let redata = data["rlocus"][0]
      let imdata = data["rlocus"][1]
      redata = nj.array(redata)
      imdata = nj.array(imdata)

      let { ystep, tstep, xstep } = data["step"]

      this.setState({
        rlocus: {
          redata: redata,
          imdata: imdata,
        },
        step: {
          ystep: ystep,
          tstep: tstep,
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
                  x: this.state.redata.slice(null, [i, i + 1]).tolist().flatMap(x => x),
                  y: this.state.imdata.slice(null, [i, i + 1]).tolist().flatMap(x => x),
                  type: 'scatter',
                  mode: 'lines',
                })
              )
            }
            layout={{
              title: 'Lugar Geométrico de las Raices',
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
              },
              // {
              //   x: this.state.step.tstep,
              //   y: np.ones(len(tstep)),
              //   type: 'scatter',
              //   name: 'entrada'
              // },
            ]}
            layout={{
              title: 'Respuesta en el tiempo del sistema con controlador',
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
