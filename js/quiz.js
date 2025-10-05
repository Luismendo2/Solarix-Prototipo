// Variables globales para el cuestionario
let currentQuestion = 1;
const totalQuestions = 5;
let userAnswers = {};
let score = 0;

// Respuestas correctas
const correctAnswers = {
    1: "true",
    2: ["a", "b", "d"], // Respuestas correctas para pregunta de selección múltiple
    3: "b",
    4: "false",
    5: "b"
};

// Inicializar el cuestionario
function initializeQuiz() {
    // Configurar información inicial
    document.getElementById('totalQuestions').textContent = totalQuestions;
    document.getElementById('totalQuestionsDisplay').textContent = totalQuestions;
    document.getElementById('currentQuestion').textContent = currentQuestion;
    
    // Mostrar la primera pregunta
    showQuestion(currentQuestion);
    
    // Actualizar progreso
    updateProgress();


    
    // Configurar event listeners para opciones
    setupEventListeners();
}
// Inicializar cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', function() {
    initializeQuiz();
});

// Configurar event listeners para las opciones
function setupEventListeners() {
    // Event listeners para radios
    document.querySelectorAll('input[type="radio"]').forEach(radio => {
        radio.addEventListener('change', function() {
            const questionNumber = getQuestionNumberFromInput(this);
            enableSubmitButton(questionNumber);
        });
    });
    
    // Event listeners para checkboxes
    document.querySelectorAll('input[type="checkbox"]').forEach(checkbox => {
        checkbox.addEventListener('change', function() {
            const questionNumber = getQuestionNumberFromInput(this);
            enableSubmitButton(questionNumber);
        });
    });
}

function getQuestionNumberFromInput(input) {
    const questionCard = input.closest('.question-card');
    const id = questionCard.id;
    return parseInt(id.replace('question', ''));
}

function enableSubmitButton(questionNumber) {
    const questionElement = document.getElementById('question' + questionNumber);
    const submitButton = questionElement.querySelector('.submit-btn');
    submitButton.disabled = false;
}

// Mostrar pregunta específica
function showQuestion(questionNumber) {
    // Ocultar todas las preguntas
    document.querySelectorAll('.question-card').forEach(card => {
        card.classList.remove('active');
    });
    
    // Mostrar la pregunta actual
    const currentCard = document.getElementById('question' + questionNumber);
    if (currentCard) {
        currentCard.classList.add('active');
    }
    
    // Actualizar botones de navegación
    updateNavigationButtons();
    
    // Actualizar progreso
    updateProgress();
}

// Verificar respuesta
function checkAnswer(questionNumber) {
    const questionElement = document.getElementById('question' + questionNumber);
    const feedbackElement = document.getElementById('feedback' + questionNumber);
    const submitButton = questionElement.querySelector('.submit-btn');
    
    // Deshabilitar el botón de verificación
    submitButton.disabled = true;
    
    // Obtener respuesta del usuario
    const userAnswer = getUserAnswer(questionNumber);
    userAnswers[questionNumber] = userAnswer;
    
    // Verificar si la respuesta es correcta
    const isCorrect = checkIfCorrect(questionNumber, userAnswer);
    
    // Mostrar retroalimentación
    if (feedbackElement) {
        if (isCorrect) {
            feedbackElement.innerHTML = `
                <div class="feedback-correct">
                    <h4>¡Correcto!</h4>
                    <p>${getFeedbackMessage(questionNumber, true)}</p>
                </div>
            `;
            score++;
        } else {
            feedbackElement.innerHTML = `
                <div class="feedback-incorrect">
                    <h4>Incorrecto</h4>
                    <p>${getFeedbackMessage(questionNumber, false)}</p>
                </div>
            `;
        }
        feedbackElement.style.display = 'block';
    }
    
    // Habilitar botón de siguiente
    document.getElementById('nextBtn').disabled = false;
    
    // Si es la última pregunta, mostrar botón de finalizar
    if (questionNumber === totalQuestions) {
        document.getElementById('finishBtn').style.display = 'inline-block';
        document.getElementById('nextBtn').style.display = 'none';
    }
}

// Obtener respuesta del usuario
function getUserAnswer(questionNumber) {
    const questionElement = document.getElementById('question' + questionNumber);
    
    // Para preguntas de selección única (radio buttons)
    const radioInputs = questionElement.querySelectorAll('input[type="radio"]:checked');
    if (radioInputs.length > 0) {
        return radioInputs[0].value;
    }
    
    // Para preguntas de selección múltiple (checkboxes)
    const checkboxInputs = questionElement.querySelectorAll('input[type="checkbox"]:checked');
    if (checkboxInputs.length > 0) {
        const selectedValues = [];
        checkboxInputs.forEach(input => {
            selectedValues.push(input.value);
        });
        return selectedValues;
    }
    
    return null;
}

// Verificar si la respuesta es correcta
function checkIfCorrect(questionNumber, userAnswer) {
    const correctAnswer = correctAnswers[questionNumber];
    
    // Para preguntas de selección múltiple
    if (Array.isArray(correctAnswer)) {
        if (!Array.isArray(userAnswer) || userAnswer.length !== correctAnswer.length) {
            return false;
        }
        
        // Verificar que todas las respuestas seleccionadas sean correctas
        return userAnswer.every(answer => correctAnswer.includes(answer)) && 
               correctAnswer.every(answer => userAnswer.includes(answer));
    }
    
    // Para preguntas de selección única
    return userAnswer === correctAnswer;
}

// Obtener mensaje de retroalimentación
function getFeedbackMessage(questionNumber, isCorrect) {
    const messages = {
        1: {
            correct: "La energía solar fotovoltaica sí convierte directamente la luz solar en electricidad mediante el efecto fotovoltaico en las celdas solares.",
            incorrect: "En realidad, la energía solar fotovoltaica sí convierte directamente la luz solar en electricidad. Esta es su principal característica."
        },
        2: {
            correct: "Las tecnologías solares incluyen la energía solar fotovoltaica, térmica y de concentración. La energía eólica no es una tecnología solar.",
            incorrect: "Las tecnologías solares correctas son: fotovoltaica, térmica y de concentración. La energía eólica utiliza el viento, no el sol."
        },
        3: {
            correct: "El principal beneficio de la energía solar es que es renovable y no contaminante, lo que ayuda a combatir el cambio climático.",
            incorrect: "Aunque la energía solar tiene muchos beneficios, su principal ventaja es que es renovable y no contaminante, a diferencia de los combustibles fósiles."
        },
        4: {
            correct: "Los paneles solares sí funcionan en días nublados, aunque con menor eficiencia. Pueden generar electricidad con luz difusa.",
            incorrect: "En realidad, los paneles solares sí funcionan en días nublados, aunque producen menos energía que en días soleados."
        },
        5: {
            correct: "La región Caribe tiene mayor potencial solar debido a sus altos niveles de radiación solar durante todo el año.",
            incorrect: "La región con mayor potencial solar en Colombia es la región Caribe, debido a su alta radiación solar anual."
        }
    };
    
    return isCorrect ? messages[questionNumber].correct : messages[questionNumber].incorrect;
}

// Navegación entre preguntas
function nextQuestion() {
    if (currentQuestion < totalQuestions) {
        currentQuestion++;
        showQuestion(currentQuestion);
        updateProgress();
        
        // Deshabilitar botón de siguiente hasta que se responda la pregunta
        document.getElementById('nextBtn').disabled = true;
    }
}

function previousQuestion() {
    if (currentQuestion > 1) {
        currentQuestion--;
        showQuestion(currentQuestion);
        updateProgress();
        
        // Habilitar/deshabilitar botones según si ya se respondió
        updateNavigationButtons();
    }
}

// Actualizar botones de navegación
function updateNavigationButtons() {
    document.getElementById('prevBtn').disabled = currentQuestion === 1;
    
    // Solo habilitar siguiente si ya se respondió la pregunta actual
    const isAnswered = userAnswers.hasOwnProperty(currentQuestion);
    document.getElementById('nextBtn').disabled = !isAnswered && currentQuestion < totalQuestions;
}

// Actualizar barra de progreso
function updateProgress() {
    const progress = (currentQuestion / totalQuestions) * 100;
    document.getElementById('quizProgress').style.width = progress + '%';
    document.getElementById('currentQuestion').textContent = currentQuestion;
}

// Finalizar cuestionario - CORREGIDO
function finishQuiz() {
    // Calcular puntaje final
    const finalScore = score;
    const percentage = (finalScore / totalQuestions) * 100;
    
    // Actualizar modal de resultados
    document.getElementById('finalScore').textContent = finalScore;
    
    // Determinar mensaje según puntaje
    let message, description;
    if (percentage >= 80) {
        message = "¡Excelente trabajo! 🌟";
        description = "Tienes un conocimiento sólido sobre energía solar. ¡Sigue así!";
    } else if (percentage >= 60) {
        message = "¡Buen trabajo! 👍";
        description = "Tienes un buen conocimiento, pero hay áreas que puedes mejorar.";
    } else {
        message = "Sigue aprendiendo 📚";
        description = "Te recomendamos revisar los módulos nuevamente para fortalecer tus conocimientos.";
    }
    
    document.getElementById('scoreMessage').textContent = message;
    document.getElementById('scoreDescription').textContent = description;
    
    // Generar desglose de resultados
    generateBreakdown();
    
    // Mostrar modal - CORRECCIÓN PRINCIPAL
    const modal = document.getElementById('resultsModal');
    if (modal) {
        modal.style.display = 'flex';
        modal.style.justifyContent = 'center';
        modal.style.alignItems = 'center';
        
        // Prevenir scroll del body cuando el modal está abierto
        document.body.style.overflow = 'hidden';
        
        // Agregar animación de pulso al score
        const scoreCircle = document.querySelector('.score-circle');
        if (scoreCircle) {
            scoreCircle.classList.add('pulse');
            
            // Remover la clase después de la animación para poder reutilizarla
            setTimeout(() => {
                scoreCircle.classList.remove('pulse');
            }, 500);
        }
    } else {
        console.error('Modal no encontrado');
    }
}

// Generar desglose de resultados
function generateBreakdown() {
    const breakdownList = document.getElementById('breakdownList');
    if (!breakdownList) return;
    
    breakdownList.innerHTML = '';
    
    for (let i = 1; i <= totalQuestions; i++) {
        const isCorrect = checkIfCorrect(i, userAnswers[i]);
        const statusClass = isCorrect ? 'status-correct' : 'status-incorrect';
        const statusText = isCorrect ? 'Correcta' : 'Incorrecta';
        
        const breakdownItem = document.createElement('div');
        breakdownItem.className = 'breakdown-item';
        breakdownItem.innerHTML = `
            <div class="breakdown-question">Pregunta ${i}</div>
            <div class="breakdown-status ${statusClass}">${statusText}</div>
        `;
        
        breakdownList.appendChild(breakdownItem);
    }
}

// Cerrar modal - CORREGIDO
function closeModal() {
    const modal = document.getElementById('resultsModal');
    if (modal) {
        modal.style.display = 'none';
    }
    // Restaurar scroll del body
    document.body.style.overflow = 'auto';
}

// Realizar otro intento - CORREGIDO
function retakeQuiz() {
    // Reiniciar variables
    currentQuestion = 1;
    userAnswers = {};
    score = 0;
    
    // Reiniciar interfaz
    document.querySelectorAll('.question-card').forEach(card => {
        const feedback = card.querySelector('.question-feedback');
        if (feedback) {
            feedback.style.display = 'none';
            feedback.innerHTML = '';
        }
        
        const inputs = card.querySelectorAll('input');
        inputs.forEach(input => {
            input.checked = false;
        });
        
        const submitBtn = card.querySelector('.submit-btn');
        if (submitBtn) submitBtn.disabled = false;
    });
    
    // Mostrar primera pregunta
    showQuestion(currentQuestion);
    updateProgress();
    
    // Restaurar botones de navegación
    document.getElementById('nextBtn').style.display = 'inline-block';
    document.getElementById('finishBtn').style.display = 'none';
    document.getElementById('nextBtn').disabled = true;
    document.getElementById('prevBtn').disabled = true;
    
    // Cerrar modal
    closeModal();
}

// Cerrar modal al hacer clic fuera de él - CORREGIDO
document.addEventListener('DOMContentLoaded', function() {
    const modal = document.getElementById('resultsModal');
    if (modal) {
        modal.addEventListener('click', function(event) {
            if (event.target === modal) {
                closeModal();
            }
        });
    }
});

// Función para revisar respuestas - CORREGIDA
function reviewAnswers() {
    closeModal();
    // Volver a la primera pregunta para revisar
    currentQuestion = 1;
    showQuestion(currentQuestion);
}