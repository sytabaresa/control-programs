
using ControlSystems
using SymPy

export sum

export GpRef
export tiempoMinimoLogic
const GpRef = zpk([-.5], [1.618, -0.618], 1, 1)
function tiempoMinimo(GzText::String, T::Float32, rtype::String)
    
end

function tiempoMinimoLogic(Gpz::TransferFunction, R::TransferFunction)

    gzeros = tzero(Gpz)
    gpoles = pole(Gpz)
    order = length(gzeros) - length(gpoles)
    delay = -order

    z, M, A = Sym("z1, M, A")
    factorForm = arr::Array->reduce(*, [(1 - a * z) for a = arr])
    polyForm = arr::Array->reduce(+, [a * z^(i - 1) for (i, a) = enumerate(arr)])
    onePoles = sys::TransferFunction->length(filter(x->abs(x - 1) < 0.001, pole(sys)))

    Fzexp = z^delay * factorForm(gzeros) * M

    inestablePoles = filter(x->abs(x) >= 1, gpoles)
    Fz1exp = (1 - z)^max(onePoles(Gpz), onePoles(R)) * factorForm(inestablePoles) * A

    println("F(z) = $Fzexp, 1 - F(z) = $Fz1exp")

    dFz = SymPy.degree(Fzexp; gen = z)
    dFz1 = SymPy.degree(Fz1exp; gen = z)
    diffDegree = N(abs(dFz - dFz1))
    FexpCond = dFz == min(dFz, dFz1)

    n = 10 # max variables
    n1, n2 = FexpCond ? (n + diffDegree, n) :  (n, n + diffDegree) 
    mvars = [x for x = symbols("m0:$n1")]
    avars = [x for x = symbols("a0:$n2")]
    avars[1] = 1
    println(mvars)
    println(avars)

    sols = []
    for i = 0:n
        i1, i2 = FexpCond ? (i + diffDegree, i) : (i, i + diffDegree)
        println("grado M(z) = $i1, grado A(z) = $i2")
        mv = mvars[1:i1 + 1]
        av = avars[1:i2 + 1]
        eq1 = subs(Fzexp, M => polyForm(mv))
        eq2 = subs(Fz1exp, A => polyForm(av))

        numUnknows = i1 + i2 + 1
        println(" F(z) = $(eq1), 1 - F(z) = $(eq2)")
        println("orden F(z) = $(SymPy.degree(eq1; gen = z)), orden 1 - F(z) = $(SymPy.degree(eq1; gen = z)), # incognitas = $(numUnknows)")
        if SymPy.degree(eq1; gen = z) != numUnknows
            continue
        end
        println("# incognitas = grado F(z) y 1 - F(z) ($numUnknows)")

        Fz = collect(expand(eq1), z)
        Fz1 = collect(expand(1 - eq2), z)
        println("eq1 = $Fz\neq2 = $Fz1")

        sysEq1 = SymPy.coeffs(SymPy.poly(Fz), z)
        sysEq2 = SymPy.coeffs(SymPy.poly(Fz1), z)
        sysEq = sysEq1 - sysEq2

        println("sistema de ecuaciones: $sysEq")
        sols = SymPy.solve(sysEq, [mv; av[2:end]])
        println("soluciones: $sols")
        F = subs(Fz, sols)
        dF = SymPy.degree(F; gen = z) |> N
        #Fsys = subs(F, z => 1/z)
        Fsys = reduce(+, [a/tf("z",Gpz.Ts)^(dF - i + 1) for (i,a) = enumerate(SymPy.poly(F) |> all_coeffs |> N) if a != 0])
        println("F(z) = $Fsys")
        D = Fsys / (Gpz * (1 - Fsys))
        println("D(z)  = $D")

        return Dict(
            "F" => Fsys, 
            "response" => impulse(Fsys*R),
            "D" => D
        )
    end
end