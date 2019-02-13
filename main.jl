module ControlUtils

function wrapTo2Pi(a)
    neg = a < 0;
    a = mod(a, 2 * pi)
    if (neg) a += 2 * pi end
    a
end

function wrapToPi(a)
    wrapTo2Pi(a + pi) - pi
end

end


#module CoreControl

function Pd(ζ,wn,T)
    wd = wn*sqrt(1-ζ^2)
    s = -ζ*wn + 1im*wd
    z = exp(T*s)
    z
end

function Ts(ζ,wn)
    4 / (ζ * wn)
end

function zeta(Mp)
    sqrt( log(Mp)^2/(pi^2 + log(Mp)^2) )
end

#include("utils.jl")
using Base.Math
import  ..ControlUtils
using ControlSystems


function main(GpText, zeta, wn, Ts, Ctype)
   # Gp = run(GpText, TransferFunction{ControlSystems.SisoZpk{Int64,Int64}})
    #Gp = GpText #TODO: parse
    Gp = zpk([],[0,-2],1) #TODO: input
    logic(Gp,zeta,wn,Ts,Ctype)
end

export main
function logic(Gp,ζ,wn,Ts,Ctype)

    #Ts = 1 #TODO: input o cálculo automatico segun 8 a 10 muestras
  
    Gz = c2d(Gp,Ts)
    #println(Gz)
    z = Pd(ζ,wn,Ts)
    a = begin
        pole = Gz(z)[1,1]
        rad = angle(pole)
        rad
    end
    defθ = - ControlUtils.wrapToPi(a + pi)
    println("deficiencia: ", defθ*180/pi)

    contSet = begin
        a = ["PID", "Comp"]
        Set([((defθ > 0) ? ["PD"] : ["PI"]); a])
    end
    
    if (!in(Ctype, contSet))
        println("no existe el controlador o no puede generar el ángulo solicitado")
        return
    end

    aa, bb = angController(Ctype, z, defθ, Gz)
    tpmCz = controllersTF(Ctype,1,aa,bb,Ts) 
    K = 1/abs(Gz(z)[1,1]*tpmCz(z)[1,1])

    Cz = controllersTF(Ctype,K,aa,bb, Ts)

    Gdz = Gz * Cz
    z, Gdz, rlocusData(Gdz, K=range(1e-6,stop=200,length=1000))
    #z, Gdz
end
#TODO: lista de funciones de trans para los controladores


function controllersTF(Ctype,K,a,b, Ts)
    if Ctype == "PID"
        zpk([a,b],[0,1],K, Ts)
    elseif Ctype == "PI" 
        zpk([a],[1],K, Ts)
    elseif Ctype == "PD"
        zpk([a],[0],K, Ts)
    elseif Ctype == "Comp"
        zpk([a],[b],K, Ts)
    else
        0
    end
end 

function angController(Ctype, Pd, θ, Gz)
    a, b = 0, 0
    
    if Ctype == "PID"
        poles = pole(Gz)
        a = min(poles...) #TODO: hallar un criterio mas "robusto" para el primer cero
        b = calcTrig(Pd, θ - angle(Pd - a) + angle(Pd) + angle(Pd - 1))
    elseif Ctype == "PI" 
        a = calcTrig(Pd, θ + angle(Pd - 1))
    elseif Ctype == "PD"
        a = calcTrig(Pd, θ + angle(Pd))
    elseif Ctype == "Comp"
        poles = pole(Gz)
        a = min(poles...) #TODO: hallar un criterio mas "robusto" para el primer cero
        b = calcTrig(Pd, angle(Pd - a) - θ)
    else
        0,0
    end
    
    a, b
end

function calcTrig(Pd, θ)
        Pd.re - Pd.im/tan(θ)
end

#TODO: opciones de error en estado estacionario (sistemas para el error)
#TODO: calculo de ángulos por LGR


#TODO: interfaz gráfica con inputs y gráficos
function rlocusData(P::LTISystem; K=Float64[])
    K = isempty(K) ? range(1e-6,stop=500,length=10000) : K
    Z = tzero(P)
    poles, K = getpoles(P,K)
    redata = real.(poles)
    imdata = imag.(poles)

    redata, imdata
end

using OrdinaryDiffEq
using Polynomials
function getpoles(G, K) # If OrdinaryDiffEq is installed, we override getpoles with an adaptive method
    P          = numpoly(G)[1]
    Q          = denpoly(G)[1]
    f          = (y,_,k) -> ComplexF64.(Polynomials.roots(k[1]*P+Q))
    prob       = OrdinaryDiffEq.ODEProblem(f,f(0.,0.,0.),(0.,K[end]))
    integrator = OrdinaryDiffEq.init(prob,OrdinaryDiffEq.Tsit5(),reltol=1e-8,abstol=1e-8)
    ts         = Vector{Float64}()
    poleout    = Vector{Vector{ComplexF64}}()
    for i in integrator
       push!(poleout,integrator.k[1])
       push!(ts,integrator.t[1])
    end
    poleout = hcat(poleout...)'
    poleout, ts
end


function sum(a,b)
    #println(a,b)
    a+b
end

#end


