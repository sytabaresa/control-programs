using ControlSystems

module CoreControl

include("./lgr.jl")
include("./minimalTime.jl")
include("./freq.jl")

s = tf("s")
z = tf("z",1)

export parseTransferFunction
# TODO: sanitize inputs!

function parseTransferFunction(sys::String)
    expr = Meta.parse(sys)
    @eval $expr
end

end

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