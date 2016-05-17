(function() {
'use strict';

angular.module('app')
	.controller('LojaController', function($scope) {
		var socket = io();
		var vm = this;
		vm.pedido = {};
		vm.pedidos = [];
		
		vm.enviar = enviar;
		
		init();

		function init(){
			socket.on('loja pedidos', function(pedidos){
				vm.pedidos = pedidos;
				$scope.$apply();
			});
			socket.on('loja pedido', function(pedido){
				var encontrou = false;
				for(var x = 0; x < vm.pedidos.length && !encontrou; x++){
					if(vm.pedidos[x].id === pedido.id){
						vm.pedidos[x].status = pedido.status;
						encontrou = true;
					}
				}
				if(!encontrou){
					vm.pedidos.push(pedido);
				}
				$scope.$apply();
			});

		}

		function enviar() {
		    socket.emit('loja enviar', vm.pedido);
		    vm.pedido.item = '';
		}

	});
})();