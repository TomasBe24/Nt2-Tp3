new Vue({
    el: '#app',
    data: {
        saludJugador: 100,
        saludMonstruo: 100,
        hayUnaPartidaEnJuego: false,
        turnos: [], //es para registrar los eventos de la partida
        esJugador: false,
        rangoAtaque: [3, 10],
        rangoAtaqueEspecial: [10, 20],
        rangoAtaqueDelMonstruo: [5, 12],
    },

    methods: {
        getSalud(salud) {
            return `${salud}%`
        },
        empezarPartida: function () {
            this.hayUnaPartidaEnJuego = true
            this.saludJugador = 100
            this.saludMonstruo = 100
            this.turnos = []

        },
        atacar: function () {
            var danio = this.calcularHeridas(this.rangoAtaque)
            this.saludMonstruo -= danio
            this.registrarEvento({
                isPlayer : true,
                texto : 'El jugador ataca por ' + danio
            })
            if(this.verificarGanador()){
                return
            }
            this.ataqueDelMonstruo() 
        },

        ataqueEspecial: function () {
            var danio = this.calcularHeridas(this.rangoAtaqueEspecial)
            this.saludMonstruo -= danio
            this.registrarEvento({
                isPlayer : true,
                texto : 'El jugador usa un ataque especial por ' + danio
            })
            if(this.verificarGanador()){
                return
            }
            this.ataqueDelMonstruo()
        },

        curar: function () {
            this.registrarEvento({
            isPlayer : true,
            texto : 'El jugador se cura 10 puntos de vida'
        })
            if(this.saludJugador <= 90){
                this.saludJugador += 10
            }else{
                this.saludJugador = 100
            }
            this.ataqueDelMonstruo()
        },

        registrarEvento(evento) {
            if(this.turnos.length >= 10 ){
                this.turnos.pop()
            }
            this.turnos.unshift(evento)

        },
        terminarPartida: function () {
            this.hayUnaPartidaEnJuego = false
        },

        ataqueDelMonstruo: function () {
            var danio = this.calcularHeridas(this.rangoAtaqueDelMonstruo)
            this.saludJugador -= danio
            this.registrarEvento({
                isPlayer : false,
                texto : 'El monstruo ataca por ' + danio
            })
            this.verificarGanador()
        },

        calcularHeridas: function (rango) {
            return Math.max(Math.floor(Math.random() * rango[0]) + 1, rango[1])

        },
        verificarGanador: function () {
            if(this.saludMonstruo <= 0){
                if(confirm('Ganaste! Jugar de nuevo?')){
                    this.empezarPartida()
                }else{
                    this.terminarPartida()
                }
                return true
            }else if(this.saludJugador <= 0){
                if(confirm('Perdiste! Jugar de nuevo?')){
                    this.empezarPartida()
                }else{
                    this.terminarPartida()
                }
                return true
            }
            return false;
        },

        cssEvento(turno) {
            //Este return de un objeto es prque vue asi lo requiere, pero ponerlo acá queda mucho mas entendible en el codigo HTML.
            return {
                'player-turno': turno.esJugador,
                'monster-turno': !turno.esJugador
            }
        }
    
    }
});