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
// Función para inicializar el cuestionario
function initializeQuiz() {
    console.log('Inicializando cuestionario...');
    
    // Configurar información inicial
    if (document.getElementById('totalQuestions')) {
        document.getElementById('totalQuestions').textContent = totalQuestions;
        document.getElementById('totalQuestionsDisplay').textContent = totalQuestions;
        document.getElementById('currentQuestion').textContent = currentQuestion;
        
        // Mostrar la primera pregunta
        showQuestion(currentQuestion);
        
        // Actualizar progreso
        updateProgress();
    }
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
    console.log('Mostrando pregunta:', questionNumber);
    
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
    const prevBtn = document.getElementById('prevBtn');
    const nextBtn = document.getElementById('nextBtn');
    const finishBtn = document.getElementById('finishBtn');
    
    if (prevBtn) {
        prevBtn.disabled = currentQuestion === 1;
    }
    
    if (nextBtn && finishBtn) {
        const isAnswered = userAnswers.hasOwnProperty(currentQuestion);
        const isLastQuestion = currentQuestion === totalQuestions;
        
        nextBtn.disabled = !isAnswered || isLastQuestion;
        finishBtn.style.display = isLastQuestion && isAnswered ? 'inline-block' : 'none';
        nextBtn.style.display = isLastQuestion ? 'none' : 'inline-block';
    }
}

// Actualizar barra de progreso
function updateProgress() {
    const progress = (currentQuestion / totalQuestions) * 100;
    const progressBar = document.getElementById('quizProgress');
    const currentQuestionElement = document.getElementById('currentQuestion');
    
    if (progressBar) {
        progressBar.style.width = progress + '%';
    }
    
    if (currentQuestionElement) {
        currentQuestionElement.textContent = currentQuestion;
    }
}

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
    
    // Mostrar modal
    const modal = document.getElementById('resultsModal');
    modal.style.display = 'flex'; // Cambiado a flex para centrado
    
    // BLOQUEAR SCROLL TEMPORALMENTE - solo cuando se abre el modal
    document.body.style.overflow = 'hidden';
    document.body.style.position = 'fixed';
    document.body.style.width = '100%';
    document.body.style.height = '100%';
    
    // Agregar animación de pulso al score
    const scoreCircle = document.querySelector('.score-circle');
    scoreCircle.classList.add('pulse');
    
    setTimeout(() => {
        scoreCircle.classList.remove('pulse');
    }, 500);
}

// Generar desglose de resultados
function generateBreakdown() {
    const breakdownList = document.getElementById('breakdownList');
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

function closeModal() {
    console.log('Cerrando modal y restaurando scroll...');
    const modal = document.getElementById('resultsModal');
    if (modal) {
        modal.style.display = 'none';
    }
    
    // RESTAURAR EL SCROLL DEL BODY - ESTA ES LA CLAVE
    document.body.style.overflow = 'auto';
    document.body.style.position = 'static';
    document.body.style.height = 'auto';
    
    // También remover cualquier clase que pueda estar bloqueando
    document.body.classList.remove('modal-open');
    
    console.log('Scroll restaurado correctamente');
}


// Función para restablecer la interfaz del cuestionario
function resetQuizInterface() {
    // Reiniciar todas las preguntas
    document.querySelectorAll('.question-card').forEach(card => {
        // Ocultar retroalimentación
        const feedback = card.querySelector('.question-feedback');
        if (feedback) {
            feedback.style.display = 'none';
            feedback.innerHTML = ''; // Limpiar contenido anterior
        }
        
        // Desmarcar todas las opciones
        const inputs = card.querySelectorAll('input[type="radio"], input[type="checkbox"]');
        inputs.forEach(input => {
            input.checked = false;
        });
        
        // Habilitar botones de verificación
        const submitBtn = card.querySelector('.submit-btn');
        if (submitBtn) {
            submitBtn.disabled = false;
            submitBtn.textContent = 'Verificar Respuesta'; // Asegurar texto correcto
        }
    });
    
    // Restablecer información de progreso
    if (document.getElementById('currentQuestion')) {
        document.getElementById('currentQuestion').textContent = '1';
    }
}

// Función para restablecer botones de navegación
function resetNavigationButtons() {
    const nextBtn = document.getElementById('nextBtn');
    const finishBtn = document.getElementById('finishBtn');
    const prevBtn = document.getElementById('prevBtn');
    
    if (nextBtn) {
        nextBtn.style.display = 'inline-block';
        nextBtn.disabled = true;
        nextBtn.textContent = 'Siguiente →';
    }
    
    if (finishBtn) {
        finishBtn.style.display = 'none';
    }
    
    if (prevBtn) {
        prevBtn.disabled = true;
    }
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
// === FUNCIONALIDAD DE REVISIÓN DE RESPUESTAS ===

let currentReviewQuestion = 1;
const totalReviewQuestions = 5;

// Mostrar modo de revisión
function showReviewMode() {
    document.getElementById('resultsView').style.display = 'none';
    document.getElementById('reviewView').style.display = 'block';
    currentReviewQuestion = 1;
    showReviewQuestion(currentReviewQuestion);
    updateReviewNavigation();
    
    // Asegurar que el scroll esté habilitado dentro del modal
    const modalBody = document.querySelector('.modal-body');
    if (modalBody) {
        modalBody.style.overflowY = 'auto';
        modalBody.style.maxHeight = '70vh';
    }
}

function showResultsView() {
    document.getElementById('reviewView').style.display = 'none';
    document.getElementById('resultsView').style.display = 'block';
    
    // Scroll al top del modal
    const modalBody = document.querySelector('.modal-body');
    if (modalBody) {
        modalBody.scrollTop = 0;
    }
}
// Mostrar pregunta específica en modo revisión
function showReviewQuestion(questionNumber) {
    const container = document.getElementById('reviewQuestionContainer');
    const questionData = getReviewQuestionData(questionNumber);
    
    container.innerHTML = `
        <div class="review-question">
            <h4>Pregunta ${questionNumber}</h4>
            <p><strong>${getQuestionText(questionNumber)}</strong></p>
            
            <div class="review-answer ${questionData.isCorrect ? 'answer-correct' : 'answer-incorrect'}">
                <div class="answer-user">
                    <strong>Tu respuesta:</strong> ${questionData.userAnswer}
                </div>
                <div class="answer-status">
                    ${questionData.isCorrect ? 
                        '<span class="status-correct-text">✓ Correcta</span>' : 
                        '<span class="status-incorrect-text">✗ Incorrecta</span>'}
                </div>
            </div>
            
            ${!questionData.isCorrect ? `
                <div class="review-answer answer-correct">
                    <div class="answer-user">
                        <strong>Respuesta correcta:</strong> ${questionData.correctAnswer}
                    </div>
                </div>
            ` : ''}
            
            <div class="review-explanation">
                <strong>Explicación:</strong><br>
                ${getQuestionExplanation(questionNumber)}
            </div>
        </div>
    `;
    
    document.getElementById('currentReviewQuestion').textContent = questionNumber;
    updateReviewNavigation();
}

// Obtener datos de la pregunta para revisión
function getReviewQuestionData(questionNumber) {
    const userAnswer = formatUserAnswerForReview(questionNumber, userAnswers[questionNumber]);
    const correctAnswer = formatCorrectAnswerForReview(questionNumber);
    const isCorrect = checkIfCorrect(questionNumber, userAnswers[questionNumber]);
    
    return {
        userAnswer: userAnswer,
        correctAnswer: correctAnswer,
        isCorrect: isCorrect
    };
}

// Formatear respuesta del usuario para mostrar en revisión
function formatUserAnswerForReview(questionNumber, userAnswer) {
    if (!userAnswer) return "No respondida";
    
    if (Array.isArray(userAnswer)) {
        return userAnswer.map(ans => getAnswerText(questionNumber, ans)).join(', ');
    }
    
    return getAnswerText(questionNumber, userAnswer);
}

// Formatear respuesta correcta para mostrar en revisión
function formatCorrectAnswerForReview(questionNumber) {
    const correct = correctAnswers[questionNumber];
    
    if (Array.isArray(correct)) {
        return correct.map(ans => getAnswerText(questionNumber, ans)).join(', ');
    }
    
    return getAnswerText(questionNumber, correct);
}

// Obtener texto de la respuesta
function getAnswerText(questionNumber, answerValue) {
    const answerTexts = {
        1: {
            'true': 'Verdadero',
            'false': 'Falso'
        },
        2: {
            'a': 'Energía solar fotovoltaica',
            'b': 'Energía solar térmica', 
            'c': 'Energía eólica',
            'd': 'Energía solar de concentración'
        },
        3: {
            'a': 'Es la fuente de energía más barata',
            'b': 'Es renovable y no contaminante',
            'c': 'Funciona durante la noche', 
            'd': 'No requiere mantenimiento'
        },
        4: {
            'true': 'Verdadero',
            'false': 'Falso'
        },
        5: {
            'a': 'Región Andina',
            'b': 'Región Caribe',
            'c': 'Región Amazónica',
            'd': 'Región Pacífica'
        }
    };
    
    return answerTexts[questionNumber]?.[answerValue] || answerValue;
}

// Obtener texto de la pregunta
function getQuestionText(questionNumber) {
    const questions = {
        1: "La energía solar fotovoltaica convierte directamente la luz del sol en electricidad.",
        2: "¿Cuáles de las siguientes son tecnologías solares?",
        3: "¿Cuál es el principal beneficio de la energía solar?",
        4: "Los paneles solares no funcionan en días nublados.",
        5: "¿Qué región de Colombia tiene mayor potencial para energía solar?"
    };
    
    return questions[questionNumber] || `Pregunta ${questionNumber}`;
}

// Obtener explicación de la pregunta
function getQuestionExplanation(questionNumber) {
    const explanations = {
        1: "La energía solar fotovoltaica sí convierte directamente la luz solar en electricidad mediante el efecto fotovoltaico en las celdas solares. Esta es su principal característica.",
        2: "Las tecnologías solares incluyen la energía solar fotovoltaica, térmica y de concentración. La energía eólica no es una tecnología solar ya que utiliza el viento, no el sol.",
        3: "El principal beneficio de la energía solar es que es renovable y no contaminante, lo que ayuda a combatir el cambio climático. Aunque tiene otros beneficios, esta es su ventaja más significativa.",
        4: "Los paneles solares sí funcionan en días nublados, aunque con menor eficiencia. Pueden generar electricidad con luz difusa, pero producen menos energía que en días soleados.",
        5: "La región Caribe tiene mayor potencial solar debido a sus altos niveles de radiación solar durante todo el año. Esta región recibe más horas de sol directo que otras regiones de Colombia."
    };
    
    return explanations[questionNumber] || "Explicación no disponible.";
}

// Navegación en modo revisión
function nextReviewQuestion() {
    if (currentReviewQuestion < totalReviewQuestions) {
        currentReviewQuestion++;
        showReviewQuestion(currentReviewQuestion);
    }
}

function previousReviewQuestion() {
    if (currentReviewQuestion > 1) {
        currentReviewQuestion--;
        showReviewQuestion(currentReviewQuestion);
    }
}

// Actualizar estado de navegación en revisión
function updateReviewNavigation() {
    document.getElementById('prevReview').disabled = currentReviewQuestion === 1;
    document.getElementById('nextReview').disabled = currentReviewQuestion === totalReviewQuestions;
    
    // Cambiar texto del último botón "Siguiente" a "Finalizar"
    const nextButton = document.getElementById('nextReview');
    if (currentReviewQuestion === totalReviewQuestions) {
        nextButton.textContent = 'Finalizar →';
    } else {
        nextButton.textContent = 'Siguiente →';
    }
}

// También actualiza la función retakeQuiz para resetear la revisión
function retakeQuiz() {
    console.log('=== INICIANDO RETAREQUIZ ===');
    
    // 1. CERRAR MODAL Y RESTAURAR SCROLL (IMPORTANTE)
    closeModal(); // Esta función ya restaura el scroll
    
    // 2. Reiniciar todas las variables del cuestionario
    currentQuestion = 1;
    userAnswers = {};
    score = 0;
    currentReviewQuestion = 1;
    
    // 3. Limpiar todas las respuestas seleccionadas
    document.querySelectorAll('input[type="radio"], input[type="checkbox"]').forEach(input => {
        input.checked = false;
    });
    
    // 4. Restablecer toda la retroalimentación
    document.querySelectorAll('.question-feedback').forEach(feedback => {
        feedback.style.display = 'none';
        feedback.innerHTML = '';
    });
    
    // 5. Habilitar todos los botones de verificación
    document.querySelectorAll('.submit-btn').forEach(btn => {
        btn.disabled = false;
        btn.textContent = 'Verificar Respuesta';
    });
    
    // 6. Restablecer navegación
    const nextBtn = document.getElementById('nextBtn');
    const finishBtn = document.getElementById('finishBtn');
    const prevBtn = document.getElementById('prevBtn');
    
    if (nextBtn) {
        nextBtn.style.display = 'inline-block';
        nextBtn.disabled = true;
    }
    
    if (finishBtn) {
        finishBtn.style.display = 'none';
    }
    
    if (prevBtn) {
        prevBtn.disabled = true;
    }
    
    // 7. Restablecer barra de progreso
    const progressBar = document.getElementById('quizProgress');
    const currentQuestionElement = document.getElementById('currentQuestion');
    
    if (progressBar) {
        progressBar.style.width = '0%';
    }
    
    if (currentQuestionElement) {
        currentQuestionElement.textContent = '1';
    }
    
    // 8. Mostrar la primera pregunta
    document.querySelectorAll('.question-card').forEach(card => {
        card.classList.remove('active');
    });
    
    const firstQuestion = document.getElementById('question1');
    if (firstQuestion) {
        firstQuestion.classList.add('active');
    }
    
    // 9. Scroll al inicio del cuestionario (IMPORTANTE)
    setTimeout(() => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    }, 100);
    
    console.log('=== RETAREQUIZ COMPLETADO ===');
}