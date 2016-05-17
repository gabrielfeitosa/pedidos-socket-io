'use strict';

var express = require('express'),
    app = express(),
    http = require('http').Server(app),
    io = require('socket.io')(http),
    port = process.env.PORT || 5000;

app.use(express.static('public'));

var pedidos = [];
var id = 0;

io.on('connection', function(socket){
  io.to(socket.id).emit('loja pedidos', pedidos);

  socket.on('loja enviar', function(pedido){
    pedido.id = id++;
    pedido.data = new Date();
    pedido.status = 'Solicitado';
    pedidos[pedido.id] = pedido;
    io.emit('loja pedido', pedido);
    filaSolicitado(pedido.id);
  });

  function filaSolicitado(id){
    var pedido = pedidos[id]; 
    if(verificaSePodeExecutar(pedido.data,3000)){
      pedido.status = 'Em atendimento';  
      io.emit('loja pedido', {id: pedido.id, status: pedido.status});
      filaEmAtendimento(id); 
    }else{
      setTimeout(filaSolicitado,1000, id);  
    }
  }

  function filaEmAtendimento(id){
    var pedido = pedidos[id]; 
    if(verificaSePodeExecutar(pedido.data,7000)){
      pedido.status = 'Atendido';  
      io.emit('loja pedido', {id: pedido.id, status: pedido.status});
    }else{
      setTimeout(filaEmAtendimento,1000, id);  
    }
  }

  function verificaSePodeExecutar(date,time){
    var agora = new Date();
    var diff = (agora - date);
    return diff > time;
  }

});

http.listen(port, function(){
  console.log('Servidor rodando na porta:'+port);
});