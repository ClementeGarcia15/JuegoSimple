// Elementos de la pagina web
const wordEl = document.getElementById('word');
const guessesEl = document.getElementById('guesses');
const messageEl = document.getElementById('message');
const formEl = document.getElementById('letterForm');
const canvasEl = document.getElementById('hangman');
const context = canvasEl.getContext('2d');
const inputEl = document.getElementById('letterForm').elements.letter;

//audios
const win = document.getElementById('Win');
const perdiste = document.getElementById('perdiste');
const enviar = document.getElementById('enviar');
const acert = document.getElementById('acert');
const noacert = document.getElementById('noacert');

// Array de palabras para adivinar
const words = [
  'ABANICO',
  'ABRAZO',
  'ABRIR',
  'BAILE',
  'BARCO',
  'CARRO',
  'CIEN',
  'DEDO',
  'DEPORTE',
  'DULCE',
  'ELEFANTE',
  'ESQUINA',
  'FUEGO',
  'FRUTAS',
  'FIESTA',
  'GATO',
  'GLOBO',
  'GRANO',
  'HIELO',
  'HOGAR',
  'IGLESIA',
  'ISLA',
  'JARDIN',
  'JIRAFA',
  'JUICIO',
  'KIWI',
  'KOALA',
  'KARATE',
  'LECHE',
  'MAIZ',
  'MANO',
  'MAR',
  'NARANJA',
  'NAVIDAD',
  'NUBE',
  'OJO',
  'OLA',
  'OSO',
  'PERRO',
  'PLATANO',
  'PODER',
  'QUESO',
  'QUITAR',
  'QUINCERATON',
  'ROJO',
  'ROSADO',
  'SUEÑO',
  'TIGRE',
  'TIEMPO',
  'UVA',
  'ÚNICO',
  'UNIVERSO',
  'VALLE',
  'VELA',
  'VERDE',
  'WAFFLES',
  'WHISKY',
  'WIMBLEDON',
  'XILÓFONO',
  'XEROX',
  'XILOGRAFIA',
  'YO-YO',
  'YOGA',
  'YEMA',
  'ZAPATO',
  'ZORRO',
  'ZUMBIDO',
  'PERFECCION',
  'INICIAR',
  'MANERA',
  'PERDIDO',
  'FAMILIA',
  'CASA',
  'FLOR',
  'CAJA',
  'FOCO',
  'NUEVO',
  'CELULAR',
  'VESTIDO',
  'MOMENTO',
  'JUGO',
  'BOLSA',
  'ESTRELLA',
  'TIJERA',
  'PAPEL',
  'PAJARO',
  'ARBOL',
  'CEPILLO',
  'RELOJ',
  'MUEBLE',
  'SELLO',
  'HUESO',
  'LEON',
  'CANGREJO',
  'SOPA',
  'CARNE',
  'MARTILLO',
  'LAVADORA',
  'SUCIO',
  'LENTO',
  'ALIMENTOS',
  'DELGADO',
  'CUBO',
  'COMIDA',
  'CARACOL',
  'ABAJO',
  'ALUMNO',
  'BONITO',
  'CESTA',
  'SOL',
  'BEBER',
  'BOTELLA',
  'HAMBURGUESA',
  'INVIERNO',
  'INFIERNO',
  'LUNA'
];
console.log(words.length);

// variables de almacenamiento
let word;
let guesses;
let correctGuesses;
let wrongGuesses;
const MAX_INTENTOS = 6;

// funcion de iniciar el juego
function init() {
    // obtener la palabra al azar
    word = words[Math.floor(Math.random() * words.length)]; 
    guesses = [];
    correctGuesses = [];
    wrongGuesses = [];

    // Agrega la palabra a la pagina web
    wordEl.textContent = word.split('').map(letter => (correctGuesses.includes(letter) ? letter : ' _ ')).join('');
    guessesEl.textContent = `Intentos: ${wrongGuesses.length}/` + MAX_INTENTOS;
    messageEl.textContent = '';
    
    // al hacer click envia llama al funcion handleGues
    formEl.addEventListener('submit', handleGuess);
    inputEl.focus();
}

// Funcion para validar letra
function handleGuess(e) {

    enviar.play(); // audio enviar se reproduce
    e.preventDefault();

    // crea una variable para almacenar la letra que se tecleo y se convierte a mayuscula
    const letter = e.target.letter.value.toUpperCase();

    // se comprueba que la letra que se tecleo sea una letra valida en a-z
    if (letter.length !== 1 || !letter.match(/[a-z]/i)) {
        noacert.play() // reproduce noacert 
        messageEl.textContent = 'Por favor ingresa una letra válida';
        return;
    }

    // se comprueba si la letra tecleada es igual 
    if (guesses.includes(letter)) {
         messageEl.textContent = 'Ya has intentado con esa letra';
         noacert.play()
         return;
        }

    // se manda la letra    
    guesses.push(letter);

    // comprueba si la letra tecleada es de la palabra 
    if (word.includes(letter)) {
        acert.play(); // reproduce acert
        correctGuesses.push(letter); //se coloca la letra en la pagina
        wordEl.textContent = word.split('').map(letter => (correctGuesses.includes(letter) ? letter : ' _ ')).join('');
        
        // verifica si el usuario a perdido o ganado
        checkwin();
    } else {
        wrongGuesses.push(letter);
        guessesEl.textContent = `Intentos: ${wrongGuesses.length}/` + MAX_INTENTOS;
        drawHangman();
        // verifica si el usuario a perdido o ganado
        checkwin();
    }
}



// Funcion para verificar si el usuario ha ganado o perdido
function checkwin(){

  // Si el usuario ha adivinado todas las letras de la palabra, gana
  let contador = 0;
  for (const letter of correctGuesses){
    contador += word.split('').filter(l => l === letter).length;
  }
  if (contador === word.length || !wordEl.textContent.includes(' _ ')) {
    win.play(); // reproduce win
    messageEl.textContent = '¡Felicidades, has adivinado la palabra!';
    formEl.removeEventListener('submit', handleGuess);
    return;
  }

  // Si el usuario ha hecho demasiados intentos, ha perdido
  if (wrongGuesses.length === MAX_INTENTOS) {
    perdiste.play(); // reproduce perdiste
    messageEl.textContent = 'Lo siento, has perdido. La palabra era: ' + word;
    formEl.removeEventListener('submit', handleGuess);
    return;
  }
}

function drawHangman() {
    context.beginPath();
    context.moveTo(50, 50);
    context.lineTo(50, 100);
    context.stroke();
  
    if (wrongGuesses.length > 0) {
      context.beginPath();
      context.arc(50, 70, 20, 0, 2 * Math.PI);
      context.stroke();
    }
  
    if (wrongGuesses.length > 1) {
      context.beginPath();
      context.moveTo(50, 90);
      context.lineTo(30, 120);
      context.stroke();
    }
  
    if (wrongGuesses.length > 2) {
      context.beginPath();
      context.moveTo(50, 90);
      context.lineTo(70, 120);
      context.stroke();
    }
  
    if (wrongGuesses.length > 3) {
      context.beginPath();
      context.moveTo(50, 100);
      context.lineTo(30, 150);
      context.stroke();
    }
  
    if (wrongGuesses.length > 4) {
      context.beginPath();
      context.moveTo(50, 100);
      context.lineTo(70, 150);
      context.stroke();
    }
  
    if (wrongGuesses.length > 5) {
      context.beginPath();
      context.moveTo(50, 50);
      context.lineTo(30, 60);
      context.stroke();
    }
  
    if (wrongGuesses.length > 6) {
      context.beginPath();
      context.moveTo(50, 50);
      context.lineTo(70, 60);
      context.stroke();
    }
  }
  
  init();