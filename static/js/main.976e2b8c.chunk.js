(window.webpackJsonp=window.webpackJsonp||[]).push([[0],{23:function(e,t,a){e.exports=a(56)},28:function(e,t,a){},54:function(e,t,a){},55:function(e,t,a){},56:function(e,t,a){"use strict";a.r(t);var n=a(0),s=a.n(n),o=a(20),l=a.n(o),i=(a(28),a(5)),r=a(6),c=a(8),m=a(7),u=a(9),h=a(2),p=(a(31),a(11)),d=a(22),y=a(10),v=a.n(y),E=a(21),b=a.n(E),g=(a(54),a(55),function(e){function t(e){var a;return Object(i.a)(this,t),(a=Object(c.a)(this,Object(m.a)(t).call(this,e))).state={rlocus:{redata:[],imdata:[],poles:[],zeros:[]},step:{ystep:[],tstep:[],xstep:[]},Gp:"0.5(150s+1)",Ts:"20",cond:"1",cond1:"0.5",cond2:"4",ess:"1",ess1:"0",ctype:"Comp"},a}return Object(u.a)(t,e),Object(r.a)(t,[{key:"calculate_system",value:function(e){var t=this;console.log(e),b.a.get(this.props.server_url+"/lgr",{params:e}).then(function(e){var a=e.data.result;console.log(a);var n=a.rlocus[0],s=n[0],o=n[1],l=a.rlocus[1],i=a.rlocus[2],r=Object(d.a)(a.step,3),c=r[0],m=r[1],u=r[2];console.log(c[0]),t.setState({rlocus:{redata:s,imdata:o,poles:i,zeros:l},step:{tstep:m,ystep:c[0],xstep:u}})})}},{key:"onChangeForm",value:function(e){this.setState(Object(p.a)({},e.target.name,e.target.value))}},{key:"onSubmitForm",value:function(e){e.preventDefault();var t={Gp:this.state.Gp,Ts:this.state.Ts,cond:this.state.cond,cond1:this.state.cond1,cond2:this.state.cond2,ess:this.state.ess,ess1:this.state.ess1,ctype:this.state.ctype};this.calculate_system(t)}},{key:"render",value:function(){var e=this;return s.a.createElement("div",{className:"App"},s.a.createElement("form",{className:"input",onSubmit:this.onSubmitForm.bind(this)},s.a.createElement("label",{htmlFor:""},"Funci\xf3n de transferencia"),s.a.createElement("input",{id:"Gp",name:"Gp",type:"text",value:this.state.Gp,onChange:this.onChangeForm.bind(this)}),s.a.createElement("label",{htmlFor:""},"Tiempo de Muestreo"),s.a.createElement("input",{id:"Ts",name:"Ts",type:"text",value:this.state.Ts,onChange:this.onChangeForm.bind(this)}),s.a.createElement("label",{htmlFor:""},"Condiciones de Dise\xf1o"),s.a.createElement("select",{id:"id",name:"cond",value:this.state.cond,onChange:this.onChangeForm.bind(this)},s.a.createElement("option",{value:"1"},"\\zeta y wn"),s.a.createElement("option",{value:"2"},"\\zeta y n"),s.a.createElement("option",{value:"3"},"ts y Mp"),s.a.createElement("option",{value:"4"},"ts y \\zeta"),s.a.createElement("option",{value:"5"},"ts y n"),s.a.createElement("option",{value:"6"},"n y Mp")),s.a.createElement("input",{id:"cond1",name:"cond1",type:"text",value:this.state.cond1,onChange:this.onChangeForm.bind(this)}),s.a.createElement("input",{id:"cond2",name:"cond2",type:"text",value:this.state.cond2,onChange:this.onChangeForm.bind(this)}),s.a.createElement("label",{htmlFor:""},"Error en estado estacionario"),s.a.createElement("select",{name:"ess",id:"ess",value:this.state.ess,onChange:this.onChangeForm.bind(this)},s.a.createElement("option",{value:"1",default:!0},"sin condici\xf3n"),s.a.createElement("option",{value:"2"},"ep constante"),s.a.createElement("option",{value:"3"},"ep = 0"),s.a.createElement("option",{value:"4"},"ep = 0, kv constante"),s.a.createElement("option",{value:"5"},"ev = 0"),s.a.createElement("option",{value:"6"},"ev = 0, ka constante"),s.a.createElement("option",{value:"7"},"ea  = 0")),s.a.createElement("input",{id:"ess1",name:"ess1",type:"text",value:this.state.ess1,onChange:this.onChangeForm.bind(this)}),s.a.createElement("label",{htmlFor:""},"Tipo de controlador"),s.a.createElement("select",{id:"ctype",name:"ctype",value:this.state.ctype,onChange:this.onChangeForm.bind(this)},s.a.createElement("option",{value:"PD"},"PD"),s.a.createElement("option",{value:"PID"},"PID"),s.a.createElement("option",{value:"PI"},"PI"),s.a.createElement("option",{value:"Comp",default:!0},"Compensador")),s.a.createElement("label",{htmlFor:""},"Gr\xe1ficas"),s.a.createElement("button",{id:"calc",type:"submit"},"Calcular")),s.a.createElement("div",{className:"graphs"},s.a.createElement(v.a,{id:"LGR",data:this.state.rlocus.redata.map(function(t,a){return{x:e.state.rlocus.redata[a],y:e.state.rlocus.imdata[a],type:"scatter",mode:"lines",showlegend:!1}}).concat([{x:this.state.rlocus.zeros[0],y:this.state.rlocus.zeros[1],type:"scatter",mode:"markers",name:"zeros",marker:{symbol:"circle-open",size:10}},{x:this.state.rlocus.poles[0],y:this.state.rlocus.poles[1],type:"scatter",mode:"markers",name:"polos",marker:{symbol:"x-thin-open",size:10}}]),layout:{title:"Lugar Geom\xe9trico de las Raices",width:1e3,height:1e3,xaxis:{title:"real"},yaxis:{title:"imaginario",scaleanchor:"x",scaleratio:1},annotations:[{x:1/Math.sqrt(2),y:1/Math.sqrt(2),xref:"x",yref:"y",text:"estabilidad",showarrow:!0,arrowhead:0,ax:40,ay:-40,font:{color:"rgba(178, 216, 189, 1)"},arrowcolor:"rgba(178, 216, 189, 1)"}],shapes:[{type:"circle",xref:"x",yref:"y",x0:-1,y0:1,x1:1,y1:-1,fillcolor:"rgba(178, 216, 189, 0.1)",line:{color:"rgba(178, 216, 189, 1)",dash:"dot"}}]}}),s.a.createElement("option",{value:""}),s.a.createElement(v.a,{id:"respuesta",data:[{x:this.state.step.tstep,y:this.state.step.ystep,type:"scatter",mode:"lines",name:"respuesta",line:{shape:"hv"}}],layout:{title:"Respuesta en el tiempo del sistema con controlador",width:1e3,height:600,xaxis:{title:"tiempo (s)"},yaxis:{title:"voltaje (V)"}}})))}}]),t}(n.Component)),f=function(e){function t(e){var a;return Object(i.a)(this,t),(a=Object(c.a)(this,Object(m.a)(t).call(this,e))).state={Gp:"",Ts:0,step:{tstep:[],ystep:[]}},a}return Object(u.a)(t,e),Object(r.a)(t,[{key:"onChangeForm",value:function(e){this.setState(Object(p.a)({},e.target.name,e.target.value))}},{key:"onSubmitForm",value:function(e){e.preventDefault();var t={Gp:this.state.Gp,Ts:this.state.Ts,cond:this.state.cond,cond1:this.state.cond1,cond2:this.state.cond2,ess:this.state.ess,ess1:this.state.ess1,ctype:this.state.ctype};this.calculate_system(t)}},{key:"render",value:function(){return s.a.createElement("div",{className:"App"},s.a.createElement("form",{className:"input",onSubmit:this.onSubmitForm.bind(this)},s.a.createElement("label",{htmlFor:""},"Funci\xf3n de transferencia"),s.a.createElement("input",{id:"Gp",name:"Gp",type:"text",value:this.state.Gp,onChange:this.onChangeForm.bind(this)}),s.a.createElement("label",{htmlFor:""},"Tiempo de Muestreo"),s.a.createElement("input",{id:"Ts",name:"Ts",type:"text",value:this.state.Ts,onChange:this.onChangeForm.bind(this)}),s.a.createElement("label",{htmlFor:""},"Gr\xe1ficas"),s.a.createElement("button",{id:"calc",type:"submit"},"Calcular")),s.a.createElement("div",{className:"graphs"},s.a.createElement(v.a,{id:"respuesta",data:[{x:this.state.step.tstep,y:this.state.step.ystep,type:"scatter",mode:"lines",name:"respuesta",line:{shape:"hv"}}],layout:{title:"Respuesta en el tiempo del sistema con controlador",width:1e3,height:600,xaxis:{title:"tiempo (s)"},yaxis:{title:"voltaje (V)"}}})))}}]),t}(n.Component),x=function(e){function t(){return Object(i.a)(this,t),Object(c.a)(this,Object(m.a)(t).apply(this,arguments))}return Object(u.a)(t,e),Object(r.a)(t,[{key:"render",value:function(){return s.a.createElement(h.d,null,s.a.createElement(h.b,null,s.a.createElement(h.a,null,"Dise\xf1o por LGR"),s.a.createElement(h.a,null,"Tiempo M\xednimo"),s.a.createElement(h.a,null,"Dise\xf1o por frecuencia")),s.a.createElement(h.c,null,s.a.createElement(g,{server_url:"http://localhost:8000"})),s.a.createElement(h.c,null,s.a.createElement(f,{server_url:"http://localhost:8000"})),s.a.createElement(h.c,null,"Construyendo"))}}]),t}(n.Component);Boolean("localhost"===window.location.hostname||"[::1]"===window.location.hostname||window.location.hostname.match(/^127(?:\.(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)){3}$/));l.a.render(s.a.createElement(x,null),document.getElementById("root")),"serviceWorker"in navigator&&navigator.serviceWorker.ready.then(function(e){e.unregister()})}},[[23,1,2]]]);
//# sourceMappingURL=main.976e2b8c.chunk.js.map