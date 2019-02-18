import julia
import matplotlib.pyplot as plt
import control
j = julia.Julia()
j.include("main.jl")


data = j.main("", 0.5, 4,0.2,"PD")

redata, imdata = data["rlocus"]

tmp = data["Gdz"][0,0]
n, d = scipy.zpk2tf(tmp.z,tmp.p,tmp,k)
sys = control.tf(n,d)
y,t,x = control.step(feedback(sys,1))
print(y,t,x )
for i in range(0,len(redata[0])):
    plt.plot(redata[:,i],imdata[:,i])

plt.show()
