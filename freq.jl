using ControlSystems
using SymPy

export freqDesignLogic

function freqDesignLogic(sys::TransferFunction, T::Real, Mf::Real, Mg::Real)
    sysz = c2d(sys, T)
    println("G(z) = $sysz")
    z, w, M, A = Sym("z, w, M, A")
    factorForm = arr::Array->reduce(*, [(1 - a * z) for a = arr])
    polyForm = arr::Array->reduce(+, [a * z^(i - 1) for (i, a) = enumerate(arr)])

    zeros, poles, k = zpkdata(sysz)
    syz = k[1] * factorForm(zeros[1]) / factorForm(poles[1])
    println("sysz = $syz")
    syw = subs(syz, z => (1 + T / 2 * w) / (1 - T / 2 * w))
    factor(syw)

end


# T = 0.2;
# sys = zpk ([], [-10], [1]);
# sysz = c2d (sys, T);

# sysw = d2c(sysz, 'tustin');

# Integrador = zpk([], [0], 20)
# figure, margin(sysw * Integrador);

# Mf = 70
# mf = Mf - 180 + 6 + 360

# a = 10^(-5.64 / 20)

# wg = 1.1
# T1 = 10 / (wg * a)

# Gd = zpk([a * T1 1], [T1 1], 1)

# figure, margin(sysw * Gd * Integrador)

# sysdz = c2d(sysw * Integrador, T, 'tustin')

# figure, step(feedback(sysdz * sysz, 1))

# pole(feedback(sysdz * sysz, 1))
