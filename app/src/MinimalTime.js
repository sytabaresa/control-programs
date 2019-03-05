import React, { Component } from 'react';
import Plot from 'react-plotly.js';


class MinimalTime extends Component {
    constructor(props) {
        super(props)
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
    
              <button id="calc" type='submit' >Calcular</button>
            </form>
            <div className="graphs">
              <Plot
                id='LGR'
                data={1
    
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
        )
    }
}