import julia
import matplotlib.pyplot as plt

j = julia.Julia()
j.include("main.jl")


pd, data = j.main("", 0.5, 4,0.2,"PD")

redata, imdata = data

for i in range(0,len(redata[0])):
    plt.plot(redata[:,i],imdata[:,i])

plt.show()
