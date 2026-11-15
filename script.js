const messages = document.getElementById("messages");
const userInput = document.getElementById("userInput");
const sendButton = document.getElementById("sendButton");
const suggestions = document.querySelectorAll(".suggestion");


// ==========================================
// MEMORIA DE LA CONVERSACIÓN
// ==========================================

let ultimoConocimiento = null;

let ultimoTema = null;

let historialConversacion = [];


// ==========================================
// PALABRAS QUE NO APORTAN AL TEMA
// ==========================================

const palabrasIgnoradas = [

    "que",
    "como",
    "cual",
    "cuales",

    "me",
    "mi",
    "mis",

    "de",
    "del",
    "la",
    "el",
    "los",
    "las",

    "un",
    "una",
    "unos",
    "unas",

    "por",
    "para",
    "con",
    "sin",

    "sobre",
    "acerca",

    "quiero",
    "queria",

    "contame",
    "contas",

    "decime",
    "dime",

    "necesito",
    "necesitaria",

    "puedo",
    "podria",

    "informacion",

    "saber",
    "conocer",

    "hola",
    "buenas",
    "gracias",
    "favor",

    "el",
    "la",
    "los",
    "las",

    "esto",
    "eso",
    "esta",
    "este",

    "tambien",
    "también",

    "mas",
    "más"
];


// ==========================================
// SINÓNIMOS
// ==========================================

const sinonimos = {

    precio: [
        "precio",
        "precios",
        "cuesta",
        "costo",
        "coste",
        "valor",
        "vale",
        "pagar",
        "pago",
        "gratis",
        "gratuito",
        "gratuita",
        "gratuita"
    ],


    informacion: [
        "informacion",
        "info",
        "contame",
        "contas",
        "saber",
        "conocer",
        "sobre"
    ],


    socio: [
        "socio",
        "socios",
        "asociarme",
        "asociarse",
        "asociado",
        "asociada",
        "miembro",
        "membresia"
    ],


    inscripcion: [
        "inscripcion",
        "inscribirme",
        "anotarme",
        "registrarme",
        "registro",
        "participar",
        "participacion"
    ],


    contacto: [
        "contacto",
        "contactar",
        "comunicarme",
        "hablar",
        "mensaje",
        "consultar",
        "consulta",
        "mail",
        "correo",
        "email",
        "gmail"
    ],


    acceso: [
        "entrar",
        "ingresar",
        "acceder",
        "acceso",
        "donde",
        "link",
        "enlace",
        "pagina",
        "web",
        "abrir"
    ],


    carnet: [
        "carnet",
        "carne",
        "credencial",
        "descargar",
        "descarga"
    ],


    codigo: [
        "codigo",
        "numero",
        "clave",
        "olvidar",
        "olvide",
        "perdi",
        "perdio",
        "recuerdo"
    ],


    problema: [
        "problema",
        "problemas",
        "error",
        "falla",
        "fallo",
        "funciona",
        "funcionar",
        "carga",
        "cargar",
        "puedo",
        "deja"
    ],


    ver: [
        "ver",
        "mirar",
        "television",
        "tv",
        "transmision"
    ],


    escuchar: [
        "escuchar",
        "oir",
        "radio",
        "sonido"
    ]

};


// ==========================================
// NORMALIZAR TEXTO
// ==========================================

function normalizarTexto(texto) {

    if (!texto) {
        return "";
    }

    return texto
        .toLowerCase()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .replace(/[¿?¡!.,;:()]/g, " ")
        .replace(/[-_/]/g, " ")
        .replace(/\s+/g, " ")
        .trim();

}


// ==========================================
// OBTENER TODAS LAS PALABRAS
// ==========================================

function obtenerPalabras(texto) {

    return normalizarTexto(texto)
        .split(" ")
        .filter(function(palabra) {

            return palabra.length > 0;

        });

}


// ==========================================
// OBTENER PALABRAS IMPORTANTES
// ==========================================

function obtenerPalabrasImportantes(texto) {

    return obtenerPalabras(texto)
        .filter(function(palabra) {

            return (
                palabra.length > 1 &&
                !palabrasIgnoradas.includes(palabra)
            );

        });

}


// ==========================================
// COMPROBAR SINÓNIMOS
// ==========================================

function sonSinonimos(palabra1, palabra2) {

    const palabraUno = normalizarTexto(palabra1);

    const palabraDos = normalizarTexto(palabra2);


    // Coincidencia exacta

    if (palabraUno === palabraDos) {

        return true;

    }


    // Buscar en los grupos de sinónimos

    for (const grupo of Object.values(sinonimos)) {

        const grupoNormalizado = grupo.map(function(palabra) {

            return normalizarTexto(palabra);

        });


        if (

            grupoNormalizado.includes(palabraUno) &&
            grupoNormalizado.includes(palabraDos)

        ) {

            return true;

        }

    }


    return false;

}


// ==========================================
// DETECTAR TEMA PRINCIPAL
// ==========================================

function detectarTema(pregunta) {

    const texto = normalizarTexto(pregunta);


    const temas = [

        {

            nombre: "Leza Fest",

            palabras: [

                "leza fest",
                "fest",
                "festival"

            ]

        },


        {

            nombre: "Leza Socios",

            palabras: [

                "leza socios",
                "socio",
                "socios",
                "asociarme",
                "asociarse",
                "asociado",
                "asociada",
                "membresia"

            ]

        },


        {

            nombre: "Leza TV",

            palabras: [

                "leza tv",
                "television",
                "tv",
                "transmision"

            ]

        },


        {

            nombre: "Leza Radio",

            palabras: [

                "leza radio",
                "radio",
                "emisora"

            ]

        },


        {

            nombre: "Sitio web",

            palabras: [

                "pagina web",
                "sitio web",
                "web de leza",
                "pagina oficial",
                "sitio oficial"

            ]

        },


        {

            nombre: "Descargas",

            palabras: [

                "descarga",
                "descargas",
                "descargar",
                "instalar",
                "instalador"

            ]

        },


        {

            nombre: "Contacto",

            palabras: [

                "contacto",
                "contactar",
                "correo",
                "email",
                "mail"

            ]

        },


        {

            nombre: "Leza Producciones",

            palabras: [

                "leza producciones",
                "producciones"

            ]

        }

    ];


    let mejorTema = null;

    let mejorPuntaje = 0;


    temas.forEach(function(tema) {

        let puntaje = 0;


        tema.palabras.forEach(function(palabra) {

            const palabraNormalizada =
                normalizarTexto(palabra);


            if (texto.includes(palabraNormalizada)) {


                // Frases específicas tienen prioridad

                if (palabraNormalizada.includes(" ")) {

                    puntaje += 100;

                } else {

                    puntaje += 15;

                }

            }

        });


        if (puntaje > mejorPuntaje) {

            mejorPuntaje = puntaje;

            mejorTema = tema.nombre;

        }

    });


    // Si detectamos un tema nuevo,
    // siempre tiene prioridad sobre el contexto anterior

    if (mejorTema) {

        return mejorTema;

    }


    // Si no aparece un tema nuevo,
    // usar el contexto de la conversación

    if (ultimoTema) {

        return ultimoTema;

    }


    if (ultimoConocimiento) {

        return ultimoConocimiento.categoria;

    }


    return null;

}


// ==========================================
// DETECTAR INTENCIÓN
// ==========================================

function detectarIntencion(pregunta) {

    const palabras =
        obtenerPalabrasImportantes(pregunta);


    let mejorIntencion = "informacion";

    let mejorPuntaje = 0;


    Object.entries(sinonimos).forEach(function([intencion, grupo]) {

        let puntaje = 0;


        palabras.forEach(function(palabra) {

            const palabraNormalizada =
                normalizarTexto(palabra);


            grupo.forEach(function(sinonimo) {

                if (

                    palabraNormalizada ===
                    normalizarTexto(sinonimo)

                ) {

                    puntaje++;

                }

            });

        });


        if (puntaje > mejorPuntaje) {

            mejorPuntaje = puntaje;

            mejorIntencion = intencion;

        }

    });


    return mejorIntencion;

}


// ==========================================
// DETECTAR CONSULTA DE CONTEXTO
// ==========================================

function esPreguntaContextual(pregunta) {

    const texto = normalizarTexto(pregunta);


    const preguntasContextuales = [

        "y donde",
        "y como",
        "y cuanto",
        "y cuanto cuesta",

        "donde",
        "como",
        "cuanto",

        "que necesito",

        "y eso",

        "mas informacion",

        "mas info",

        "contame mas",

        "decime mas",

        "y despues",

        "que mas",

        "como hago",

        "y que hago"

    ];


    return preguntasContextuales.includes(texto);

}


// ==========================================
// CALCULAR PUNTAJE DE CONOCIMIENTO
// ==========================================

function calcularPuntajeConocimiento(

    pregunta,
    conocimiento,
    tema

) {

    const preguntaNormalizada =
        normalizarTexto(pregunta);


    const palabrasPregunta =
        obtenerPalabrasImportantes(pregunta);


    let puntaje = 0;


    // ======================================
    // PRIORIDAD POR TEMA
    // ======================================

    if (

        tema &&
        normalizarTexto(conocimiento.categoria) ===
        normalizarTexto(tema)

    ) {

        puntaje += 10;

    }


    // ======================================
    // BUSCAR PALABRAS CLAVE
    // ======================================

    conocimiento.palabrasClave.forEach(function(clave) {

        const claveNormalizada =
            normalizarTexto(clave);


        if (!claveNormalizada) {

            return;

        }


        // ----------------------------------
        // FRASE COMPLETA
        // ----------------------------------

        if (

            claveNormalizada.includes(" ") &&
            preguntaNormalizada.includes(claveNormalizada)

        ) {

            puntaje += 80;

            return;

        }


        // ----------------------------------
        // COINCIDENCIA EXACTA
        // ----------------------------------

        palabrasPregunta.forEach(function(palabraPregunta) {

            if (

                normalizarTexto(palabraPregunta) ===
                claveNormalizada

            ) {

                puntaje += 12;

                return;

            }


            // ----------------------------------
            // SINÓNIMOS
            // ----------------------------------

            if (

                sonSinonimos(
                    palabraPregunta,
                    claveNormalizada
                )

            ) {

                puntaje += 6;

            }

        });

    });


    // ======================================
    // PALABRAS DEL ID
    // ======================================

    const palabrasId =
        normalizarTexto(
            conocimiento.id.replace(/-/g, " ")
        )
        .split(" ");


    palabrasPregunta.forEach(function(palabraPregunta) {

        palabrasId.forEach(function(palabraId) {

            if (

                palabraPregunta === palabraId

            ) {

                puntaje += 8;

            }


            if (

                sonSinonimos(
                    palabraPregunta,
                    palabraId
                )

            ) {

                puntaje += 4;

            }

        });

    });


    // ======================================
    // CASOS ESPECÍFICOS
    // ======================================

    const texto = preguntaNormalizada;


    // --------------------------------------
    // CARNET
    // --------------------------------------

    if (

        texto.includes("carnet") ||
        texto.includes("carne")

    ) {

        if (

            conocimiento.id.includes("carnet")

        ) {

            puntaje += 150;

        }

    }


    // --------------------------------------
    // CÓDIGO OLVIDADO
    // --------------------------------------

    if (

        (
            texto.includes("olvide") ||
            texto.includes("olvidar") ||
            texto.includes("perdi") ||
            texto.includes("no recuerdo")
        ) &&

        (
            texto.includes("codigo") ||
            texto.includes("numero") ||
            texto.includes("clave")
        )

    ) {

        if (

            conocimiento.id.includes("codigo")

        ) {

            puntaje += 200;

        }

    }


    // --------------------------------------
    // PROBLEMAS
    // --------------------------------------

    const palabrasProblema = [

        "problema",
        "problemas",
        "error",
        "no funciona",
        "no puedo",
        "no carga",
        "no me deja",
        "falla",
        "fallo"

    ];


    palabrasProblema.forEach(function(problema) {

        if (texto.includes(problema)) {

            if (

                conocimiento.id.includes("problema") ||
                conocimiento.id.includes("problemas")

            ) {

                puntaje += 100;

            }

        }

    });


    // --------------------------------------
    // INSCRIPCIÓN
    // --------------------------------------

    if (

        texto.includes("inscrib") ||
        texto.includes("anot") ||
        texto.includes("particip")

    ) {

        if (

            conocimiento.id.includes("inscripcion") ||
            conocimiento.id.includes("inscripción")

        ) {

            puntaje += 80;

        }

    }


    // --------------------------------------
    // ACCESO
    // --------------------------------------

    if (

        texto.includes("entrar") ||
        texto.includes("ingresar") ||
        texto.includes("acceder") ||
        texto.includes("donde")

    ) {

        if (

            conocimiento.id.includes("acceso")

        ) {

            puntaje += 40;

        }

    }


    return puntaje;

}


// ==========================================
// BUSCAR EL MEJOR CONOCIMIENTO
// ==========================================

function buscarMejorConocimiento(

    pregunta,
    tema

) {

    let mejorResultado = null;

    let mejorPuntaje = -1;


    conocimientosLeza.forEach(function(conocimiento) {

        const puntaje =
            calcularPuntajeConocimiento(

                pregunta,
                conocimiento,
                tema

            );


        if (puntaje > mejorPuntaje) {

            mejorPuntaje = puntaje;

            mejorResultado = conocimiento;

        }

    });


    // Si no encontró nada útil

    if (

        !mejorResultado ||
        mejorPuntaje <= 0

    ) {

        return null;

    }


    return mejorResultado;

}


// ==========================================
// RESPUESTA SOBRE PRECIOS
// ==========================================

function respuestaPrecio(conocimiento) {

    return `

        <p>
            💰 <strong>${conocimiento.categoria} es gratuito.</strong>
        </p>

        <p>
            No necesitás realizar un pago para acceder a las opciones públicas disponibles relacionadas con
            <strong>${conocimiento.categoria}</strong>.
        </p>

        <p>
            Si querés, también puedo darte información más específica sobre
            <strong>${conocimiento.categoria}</strong>.
        </p>

    `;

}


// ==========================================
// RESPUESTA NO ENCONTRADA
// ==========================================

function respuestaNoEncontrada() {

    return `

        <p>
            🤖 <strong>No encontré información específica sobre esa consulta dentro de mi base de conocimientos.</strong>
        </p>

        <p>
            Puedo ayudarte con información sobre:
        </p>

        <p>
            🏆 <strong>Leza Fest</strong><br>
            ⭐ <strong>Leza Socios</strong><br>
            📺 <strong>Leza TV</strong><br>
            📻 <strong>Leza Radio</strong><br>
            🌐 <strong>Leza Producciones</strong><br>
            📥 <strong>Descargas</strong><br>
            📩 <strong>Contacto con Leza Producciones</strong>
        </p>

        <p>
            También podés comunicarte directamente con Leza Producciones:
        </p>

        <p>
            📧
            <a href="mailto:leza.producciones.cine@gmail.com">
                leza.producciones.cine@gmail.com
            </a>
        </p>

    `;

}


// ==========================================
// BUSCAR RESPUESTA INTELIGENTE
// ==========================================

function buscarRespuesta(pregunta) {

    const preguntaNormalizada =
        normalizarTexto(pregunta);


    // ======================================
    // DETECTAR TEMA
    // ======================================

    const temaDetectado =
        detectarTema(pregunta);


    // ======================================
    // DETECTAR INTENCIÓN
    // ======================================

    const intencion =
        detectarIntencion(pregunta);


    // ======================================
    // BUSCAR EL MEJOR CONOCIMIENTO
    // ======================================

    let conocimiento =
        buscarMejorConocimiento(

            pregunta,
            temaDetectado

        );


    // ======================================
    // SI LA PREGUNTA ES MUY CORTA,
    // USAR EL CONTEXTO
    // ======================================

    if (

        esPreguntaContextual(pregunta) &&
        ultimoConocimiento

    ) {

        conocimiento =
            buscarMejorConocimiento(

                pregunta,
                ultimoTema

            );


        // Si no encontró algo mejor,
        // mantener el último conocimiento

        if (!conocimiento) {

            conocimiento =
                ultimoConocimiento;

        }

    }


    // ======================================
    // CONSULTAS DE PRECIO
    // ======================================

    if (

        intencion === "precio"

    ) {


        if (

            temaDetectado

        ) {

            const conocimientoTema =
                buscarMejorConocimiento(

                    pregunta,
                    temaDetectado

                );


            if (conocimientoTema) {

                ultimoConocimiento =
                    conocimientoTema;

                ultimoTema =
                    conocimientoTema.categoria;


                return respuestaPrecio(
                    conocimientoTema
                );

            }

        }


        // Si pregunta por precio sin especificar tema
        // pero existe contexto

        if (ultimoConocimiento) {

            return respuestaPrecio(
                ultimoConocimiento
            );

        }

    }


    // ======================================
    // SI ENCONTRAMOS CONOCIMIENTO
    // ======================================

    if (conocimiento) {


        ultimoConocimiento =
            conocimiento;


        ultimoTema =
            conocimiento.categoria;


        return conocimiento.respuesta;

    }


    // ======================================
    // RESPALDO:
    // BUSCAR EN TODA LA BASE
    // ======================================

    conocimiento =
        buscarMejorConocimiento(

            pregunta,
            null

        );


    if (conocimiento) {

        ultimoConocimiento =
            conocimiento;

        ultimoTema =
            conocimiento.categoria;


        return conocimiento.respuesta;

    }


    // ======================================
    // NO SE ENCONTRÓ INFORMACIÓN
    // ======================================

    return respuestaNoEncontrada();

}


// ==========================================
// AGREGAR MENSAJE DEL USUARIO
// ==========================================

function agregarMensajeUsuario(texto) {

    if (!texto.trim()) {

        return;

    }


    const mensaje =
        document.createElement("div");


    mensaje.className =
        "message user-message";


    const contenido =
        document.createElement("div");


    contenido.className =
        "message-content";


    contenido.textContent =
        texto;


    mensaje.appendChild(contenido);


    messages.appendChild(mensaje);


    bajarAlFinal();

}


// ==========================================
// AGREGAR MENSAJE DEL ASISTENTE
// ==========================================

function agregarMensajeAsistente(respuesta) {

    const mensaje =
        document.createElement("div");


    mensaje.className =
        "message assistant-message";


    mensaje.innerHTML = `

        <div class="message-avatar">

            <img
                src="assets/logo.png"
                alt="Leza Assistant"
            >

        </div>

        <div class="message-content">

            ${respuesta}

        </div>

    `;


    messages.appendChild(mensaje);


    bajarAlFinal();

}


// ==========================================
// BAJAR AL FINAL DEL CHAT
// ==========================================

function bajarAlFinal() {

    requestAnimationFrame(function() {

        messages.scrollTo({

            top: messages.scrollHeight,

            behavior: "smooth"

        });

    });

}


// ==========================================
// RESPONDER
// ==========================================

function responder(pregunta) {

    const respuesta =
        buscarRespuesta(pregunta);


    // Guardar en el historial

    historialConversacion.push({

        usuario: pregunta,

        respuesta: respuesta

    });


    // Pequeña pausa natural

    setTimeout(function() {

        agregarMensajeAsistente(
            respuesta
        );


        bajarAlFinal();

    }, 450);

}


// ==========================================
// ENVIAR MENSAJE
// ==========================================

function enviarMensaje() {

    const texto =
        userInput.value.trim();


    if (!texto) {

        return;

    }


    agregarMensajeUsuario(texto);


    userInput.value = "";


    userInput.focus();


    responder(texto);

}


// ==========================================
// BOTÓN ENVIAR
// ==========================================

sendButton.addEventListener(

    "click",

    enviarMensaje

);


// ==========================================
// TECLA ENTER
// ==========================================

userInput.addEventListener(

    "keydown",

    function(event) {

        if (

            event.key === "Enter" &&
            !event.shiftKey

        ) {

            event.preventDefault();


            enviarMensaje();

        }

    }

);


// ==========================================
// PREGUNTAS SUGERIDAS
// ==========================================

suggestions.forEach(function(boton) {

    boton.addEventListener(

        "click",

        function() {

            const pregunta =
                boton.textContent.trim();


            if (!pregunta) {

                return;

            }


            agregarMensajeUsuario(
                pregunta
            );


            responder(
                pregunta
            );

        }

    );

});