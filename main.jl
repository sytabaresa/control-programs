module Core

function Pd(ζ,wn,T)
    wd = wn*sqrt(1-ζ^2)
    s = -ζ*wn + 1im*wd
    z = exp(T*s)
    z
end


using ControlSystems

Ts = 1 #TODO: input o cálculo automatico segun 8 a 10 muestras
Gp = zpk([0],[0,0,-2],1) #TODO: input
Gz = c2d(Gp,Ts)

#TODO: lista de funciones de trans para los controladores

#TODO: opciones de error en estado estacionario (sistemas para el error)
#TODO: calculo de ángulos por LGR


#TODO: interfaz gráfica con inputs y gráficos
end