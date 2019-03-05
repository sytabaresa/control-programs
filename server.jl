using Joseki, JSON, HTTP

include("./CoreControl.jl")
import .CoreControl

### Create some endpoints

# This function takes two numbers x and y from the query string and returns x^y
# In this case they need to be identified by name and it should be called with
# something like 'http://localhost:8000/pow/?x=2&y=3'
function pow(req::HTTP.Request)
    j = HTTP.queryparams(HTTP.URI(req.target))
    has_all_required_keys(["x", "y"], j) || return error_responder(req, "You need to specify values for x and y!")
    # Try to parse the values as numbers.  If there's an error here the generic
    # error handler will deal with it.
    x = parse(Float32, j["x"])
    y = parse(Float32, j["y"])
    json_responder(req, x^y)
end

# This function takes two numbers n and k from a JSON-encoded request
# body and returns LGR data
function lgr(req::HTTP.Request)
    j = Dict();
    try
        j = body_as_dict(req)
    catch err
        j = HTTP.queryparams(HTTP.URI(req.target))
        #return error_responder(req, "expecting a json request body!")
    end

    has_all_required_keys(["Gp", "cond", "cond1", "cond2", "ess", "ess1", "ctype", "Ts"], j) ||
        return error_responder(req, "You need to specify all required fields")
    try
        json_responder(req, main(j))
    catch err
        return error_responder(req, err)
    end
end

function main(data::Dict)

    Gp = String(data["Gp"])
    cond = String(data["cond"])
    ess = String(data["ess"])

    zeta = 0
    wn = 0
    if(cond == "1")
        zeta = parse(Float32, data["cond1"])
        wn = parse(Float32, data["cond2"])
    end

    Ts = parse(Float32, data["Ts"])
    if(Ts == 0)
        Ts = CoreControl.calcularTs(wn)
    end

    if (ess == "1")
        print("sin error ess")
    end
    
    ctype = String(data["ctype"])
   # Gp = run(GpText, TransferFunction{ControlSystems.SisoZpk{Int64,Int64}})
    #Gp = GpText #TODO: parse
    println(Gp, zeta, wn, Ts, ctype)
    CoreControl.lgr(Gp, zeta, wn, Ts, ctype)
end

### Create and run the server

# Make a router and add routes for our endpoints.
endpoints = [
    (pow, "GET", "/pow"),
    (lgr, "GET", "/lgr")
]
s = Joseki.server(endpoints)

# Fire up the server
HTTP.serve(s, "127.0.0.1", 8000; verbose = true)