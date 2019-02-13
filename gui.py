import julia
import dash
import dash_core_components as dcc
import dash_html_components as html
import plotly.graph_objs as go
from dash.dependencies import Input, Output, State


# external_stylesheets = ['./plotly.css']
external_stylesheets = ['https://codepen.io/chriddyp/pen/bWLwgP.css']

app = dash.Dash(__name__, external_stylesheets=external_stylesheets)

x = [1, 2, 3]
y = [3, 4, 1]

app.layout = html.Div([

    # Gp(s)
    html.Label('Función de transferencia'),
    dcc.Input(id='Gp', value='1/(s*(s+2))', type='text'),

    # Ts
    html.Label('Tiempo de Muestreo'),
    dcc.Input(id='Ts', value=0.2, type='number'),

    # Conds
    html.Label('Condiciones de Diseño'),
    dcc.Dropdown(
        id='cond',
        options=[
            {'label': '\zeta y wn', 'value': '1'},
            {'label': '\zeta y n', 'value': '2'},
            {'label': 'ts y Mp', 'value': '3'},
            {'label': 'ts y \zeta', 'value': '4'},
            {'label': 'ts y n', 'value': '5'},
            {'label': 'n y Mp', 'value': '6'},
        ],
        value='1',
        multi=False
    ),
    dcc.Input(id='cond1', type='number', value=0.5),
    dcc.Input(id='cond2', type='number', value=4),


    # Kv Kp Ka
    html.Label('Error en estado estacionario'),
    dcc.Dropdown(
        id='ess',
        options=[
            {'label': 'sin condición', 'value': '1'},
            {'label': 'ep constante', 'value': '2'},
            {'label': 'ep = 0', 'value': '3'},
            {'label': 'ep = 0, kv constante', 'value': '4'},
            {'label': 'ev = 0', 'value': '5'},
            {'label': 'ev = 0, ka constante', 'value': '6'},
            {'label': 'ea  = 0', 'value': '7'},
        ],
        value='1',
        multi=False
    ),
    dcc.Input(id='ess1', type='number', value=0),


    # controlador
    html.Label('Tipo de controlador'),
    dcc.Dropdown(
        id='CzType',
        options=[
            {'label': 'PD', 'value': 'PD'},
            {'label': 'PID', 'value': 'PID'},
            {'label': 'PI', 'value': 'PI'},
            {'label': 'Compensador', 'value': 'Comp'},
        ],
        value='PD',
        multi=False
    ),

    # Buttons
    html.Button('Calcular', id='calc'),

    #########
    # Salida
    #########


    html.Div(
        children=[
            # C(z)
            html.Div(id='Cz'),
        ])

])


############
# Callbacks
############
j = julia.Julia()
j.include("main.jl")


@app.callback(
    Output('Cz', 'children'),
    [Input('calc', 'n_clicks')],
    [
        State('Gp', 'value'),
        State('Ts', 'value'),
        State('cond', 'value'),
        State('cond1', 'value'),
        State('cond2', 'value'),
        State('ess', 'value'),
        State('ess1', 'value'),
        State('CzType', 'value'),
    ]
)
def calculate_system(n_clicks, Gp, Ts, cond, cond1, cond2, ess, ess1, ctype):

    print(n_clicks, Gp, Ts, cond, cond1, cond2, ess, ess1, ctype)
    zeta = cond1
    wn = cond2
    Pd, data = j.main(Gp, float(zeta), float(wn), float(Ts), ctype)
    # print(j.sum(3,4))
    #Pd, data = j.main("", 0.5, 4,0.2,"PD")
    #data = ([1,2,3],[2,3,4])
    redata, imdata = data
    # print(redata,imdata)
    r = range(0, len(redata[0]))
    return [
        # LGR
        dcc.Graph(
            id='LGR',
            figure=go.Figure(
                data=list(map(lambda x: go.Scatter(
                    x=redata[:, x], y=imdata[:, x]), r)),

                layout=go.Layout(
                    title='Lugar Geométrico de las Raices',
                    showlegend=False,

                )
            ),
        ),

        # Escalón
        dcc.Graph(
            id='respuesta',
            figure=go.Figure(
                data=[
                    go.Scatter(
                        x=x,
                        y=y,
                        name="entrada",
                    ),
                    go.Scatter(
                        x=x,
                        y=y*2,
                        name="respuesta",
                    ),
                ],

                layout=go.Layout(
                    title='Respuesta en el tiempo del sistema con controlador',
                    xaxis=dict(title='tiempo s'),
                    yaxis=dict(title='voltaje (V)'),
                    showlegend=True,
                )
            ),
        )
    ]


if __name__ == '__main__':
    app.run_server()
    #calculate_system(0, "", .2, "", 0.5, 4, 0, 0, "PD")
