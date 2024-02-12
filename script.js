let turnos_restantes = 25;

let numeros_jugados = new Set();
let jugadores = [];

class Jugador {
	constructor(user, carton, victorias = 0) {
		this.user = user;
		this.carton = carton;
		this.puntos = 0;
		this.victorias = victorias;
	}
	contar_puntos() {
		this.filas_completadas();
		this.columnas_completadas();
		this.diagonales_completadas();
	}
	filas_completadas() {
		for (let fila = 0; fila < this.carton[1].length; fila++) {
			let fila_completada = true;
			for (let colum = 0; colum < this.carton[1].length; colum++) {
				if (!this.carton[1][fila][colum]) {
					fila_completada = false;
					break;
				}
			}
			if (fila_completada) {
				this.puntos++;
			}
		}
	}
	columnas_completadas() {
		for (let colum = 0; colum < this.carton[1].length; colum++) {
			let colum_completada = true;
			for (let fila = 0; fila < this.carton[1].length; fila++) {
				if (!this.carton[1][fila][colum]) {
					colum_completada = false;
					break;
				}
			}
			if (colum_completada) {
				this.puntos++;
			}
		}
	}
	diagonales_completadas() {
		let diagonal_completada = true;
		for (let index = 0; index < this.carton[1].length; index++) {
			if (!this.carton[1][index][index]) {
				diagonal_completada = false;
				break;
			}
		}
		if (diagonal_completada) {
			this.puntos += 3;
		} else {
			if (this.carton % 2 != 0) {
				const index_central = Math.floor(this.carton[1].length / 2);
				this.carton[1][index_central][index_central]
					? (diagonal_completada = true)
					: (diagonal_completada = false);
			} else {
				diagonal_completada = true;
			}
		}
		if (diagonal_completada) {
			for (let index = 0; index < this.carton[1].length; index++) {
				if (!this.carton[1][index][this.carton[1].length - 1 - index]) {
					diagonal_completada = false;
					break;
				}
			}
			if (diagonal_completada) {
				this.puntos += 3;
			}
		}
	}

	carton_completo() {
		let carton_completado = true;
		for (let fila = 0; fila < this.carton[1].length; fila++) {
			for (let colum = 0; colum < this.carton[1].length; colum++) {
				if (!this.carton[1][fila][colum]) {
					carton_completado = false;
					break;
				}
			}
			if (!carton_completado) {
				break;
			}
		}
		if (carton_completado) {
			this.puntos += 5;
			return true;
		}
		return false;
	}
	verificar_numero(num) {
		for (let j = 0; j < this.carton[0].length; j++) {
			for (let i = 0; i < this.carton[0].length; i++) {
				if (this.carton[0][j][i] == num) {
					this.carton[1][j][i] = true;
					break;
				}
			}
		}
	}
}

function Empezar_partida(tamano) {
	jugadores = new Set([
		document.getElementById('user1').value,
		document.getElementById('user2').value,
		document.getElementById('user3').value,
		document.getElementById('user4').value,
	]);
	if (jugadores.has('')) {
		alert('Por favor, completa todos los campos.');
		return;
	}

	if (jugadores.size < 4) {
		alert('Por favor, asegúrate de que no haya inputs repetidos.');
		return;
	}
	jugadores = [...jugadores];
	jugadores = Asignar_cartones(tamano, jugadores);
	localStorage.setItem('jugadores_actuales', JSON.stringify(jugadores));
	window.location.href = 'playroom.html';
}

function Crear_carton(tamano) {
	let carton = [[], []];
	let fila = 0;
	let numeros_carton = new Set();
	while (numeros_carton.size < tamano * tamano) {
		let num = Math.floor(Math.random() * 50 + 1);
		if (!numeros_carton.has(num)) {
			numeros_carton.add(num);
			if (carton[0].length == 0) {
				carton[0].push([]);
				carton[1].push([]);
			} else {
				if (carton[0][fila].length == tamano) {
					fila += 1;
					carton[0].push([]);
					carton[1].push([]);
				}
			}
			carton[0][fila].push(num);
			carton[1][fila].push(false);
		}
	}
	return carton;
}
function Asignar_cartones(tamano, jugadores) {
	for (let index = 0; index < jugadores.length; index++) {
		if (jugadores[index] in localStorage) {
			jugadores[index] = new Jugador(
				jugadores[index],
				Crear_carton(tamano),
				parseInt(localStorage.getItem(jugadores[index]), 10)
			);
		} else {
			jugadores[index] = new Jugador(jugadores[index], Crear_carton(tamano));
		}
	}
	return jugadores;
}

function Sacar_numero() {
	while (true) {
		let terminar = false;
		let num = Math.floor(Math.random() * 50) + 1;
		if (!numeros_jugados.has(num)) {
			numeros_jugados.add(num);
			var titulo_numero = document.getElementById('Numero_jugado');
			titulo_numero.innerText = 'Numero: ' + num;
			for (let index = 0; index < jugadores.length; index++) {
				jugadores[index].verificar_numero(num);
				if (jugadores[index].carton_completo()) {
					terminar = true;
				}
			}
			if (terminar) {
				var titulo_turnos = document.getElementById('turnos');
				titulo_turnos.innerText = 'Turnos Restantes: ' + turnos_restantes - 1;
				var boton = document.getElementById('jugar_numero');
				boton.innerText = 'Terminar Partida';
				turnos_restantes = 0;
			}
			break;
		}
	}
	turnos_restantes--;
}

function Jugar_turno() {
	if (turnos_restantes > 0) {
		Sacar_numero();
		var titulo_turnos = document.getElementById('turnos');
		titulo_turnos.innerText = 'Turnos Restantes: ' + turnos_restantes;
		if (turnos_restantes == 0) {
			var boton = document.getElementById('jugar_numero');
			boton.innerText = 'Terminar Partida';
		}
	} else {
		Terminar_juego();
	}
	Mostrar_carton();
}
function Terminar_juego() {
	for (let index = 0; index < jugadores.length; index++) {
		const jugador = jugadores[index];
		jugador.contar_puntos();
	}
	jugadores = Quicksort(jugadores);
	localStorage.setItem('resultados', JSON.stringify(jugadores));
	window.location.href = 'resultados.html';
}

function Quicksort(jugadores) {
	if (jugadores.length <= 1) {
		return jugadores;
	}
	const pivot = jugadores[Math.floor(jugadores.length / 2)];
	const left = jugadores.filter((element) => element.puntos < pivot.puntos);
	const middle = jugadores.filter((element) => element.puntos === pivot.puntos);
	const right = jugadores.filter((element) => element.puntos > pivot.puntos);

	return [...Quicksort(left), ...middle, ...Quicksort(right)];
}

function Mostrar_carton() {
	var usuario = document.getElementById('usuario');
	var select = document.getElementById('opciones');
	var indiceSeleccionado = select.selectedIndex;
	const container = document.getElementById('carton');
	container.innerHTML = '';
	var carton_jugador = jugadores[indiceSeleccionado].carton;
	usuario.textContent = 'Jugador: ' + jugadores[indiceSeleccionado].user;
	for (let i = 0; i < carton_jugador[0].length; i++) {
		for (let j = 0; j < carton_jugador[0].length; j++) {
			const cell = document.createElement('div');
			cell.textContent = carton_jugador[0][i][j];
			if (carton_jugador[1][i][j]) {
				cell.classList.add('marked');
			}
			container.appendChild(cell);
		}
	}
}

function Iniciar_partida() {
	jugadores = JSON.parse(localStorage.getItem('jugadores_actuales'));
	localStorage.removeItem('jugadores_actuales');
	var carton = document.getElementById('carton');
	carton.className = 'player-card' + jugadores[0].carton[0][0].length;
	for (let index = 0; index < jugadores.length; index++) {
		jugadores[index] = new Jugador(
			jugadores[index].user,
			jugadores[index].carton,
			parseInt(jugadores[index].victorias, 10)
		);
	}
	document.getElementById('opciones').disabled = false;
	document.getElementById('jugar_numero').disabled = false;
	Mostrar_carton();
}
function Mostrar_resultados() {
	jugadores = JSON.parse(localStorage.getItem('resultados'));
	localStorage.removeItem('resultados');
	let posicion = 1;
	for (let index = jugadores.length - 1; index >= 0; index--) {
		if (index == jugadores.length - 1) {
			jugadores[index].victorias += 1;
		} else {
			if (jugadores[index].puntos < jugadores[index + 1].puntos) {
				posicion++;
			} else {
				if (jugadores[index].puntos == jugadores[jugadores.length - 1].puntos) {
					jugadores[index].victorias += 1;
				}
			}
		}
		let id_fila = 'fila' + (4 - index);
		var fila_resultados = document.getElementById(id_fila);
		fila_resultados.cells[0].textContent = posicion;

		fila_resultados.cells[1].textContent = jugadores[index].user;

		fila_resultados.cells[2].textContent = jugadores[index].puntos;
	}
}

function Regresar_inicio() {
	for (let index = 0; index < jugadores.length; index++) {
		const jugador = jugadores[index];
		localStorage.setItem(jugador.user, jugador.victorias);
	}

	window.location.href = 'index.html';
}
function Leaderboard() {
	if (localStorage.length >= 4) {
		let lead = [];
		for (let i = 0; i < localStorage.length; i++) {
			const key = localStorage.key(i);
			const value = localStorage.getItem(key);
			lead.push({ key, value });
		}
		lead.sort((a, b) => b.value - a.value);
		lead.splice(lead.length - 5, lead.length - 1);
		let posicion = 1;
		for (let index = 0; index < lead.length; index++) {
			if (index != 0) {
				if (lead[index].value < lead[index - 1].value) {
					posicion++;
				}
			}
			let id_fila = 'fila' + (index + 1);
			var fila_leaderboard = document.getElementById(id_fila);
			fila_leaderboard.cells[0].textContent = posicion;

			fila_leaderboard.cells[1].textContent = lead[index].key;

			fila_leaderboard.cells[2].textContent = lead[index].value;
		}
	}
}
