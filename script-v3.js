let step = 0;
let connectionType = '';
let deviceType = '';
let mediaType = '';

const questions = {
    connection: "Comment votre appareil est-il connecté à Internet ?",
    wifiAvailable: "Une connexion WiFi/Ethernet est-elle disponible ?",
    deviceType: "Quel type d'appareil utilisez-vous ?",
    mediaType: "Quel type de média souhaitez-vous utiliser ?"
};

function startQuestions() {
    document.getElementById('general-advice').style.display = 'none';
    document.getElementById('question-container').style.display = 'block';
    showConnectionQuestion();
}

function showConnectionQuestion() {
    updateQuestion(questions.connection, [
        { text: "WiFi/Ethernet", value: 'wifi' },
        { text: "Réseau Mobile", value: 'mobile' }
    ]);
}

function updateQuestion(questionText, options) {
    const container = document.getElementById('question-container');
    const questionElement = document.getElementById('question');
    const buttonsContainer = document.getElementById('buttons-container');
    
    questionElement.textContent = questionText;
    buttonsContainer.innerHTML = '';
    
    options.forEach(option => {
        const button = document.createElement('button');
        button.textContent = option.text;
        button.onclick = () => nextQuestion(option.value);
        buttonsContainer.appendChild(button);
    });
}

function nextQuestion(choice) {
    if (step === 0) {
        handleConnectionType(choice);
    } else if (step === 1) {
        handleSecondStep(choice);
    } else if (step === 2) {
        handleDeviceType(choice);
    } else if (step === 3) {
        handleMediaType(choice);
    }
}

function handleConnectionType(choice) {
    connectionType = choice;
    step++;
    
    if (connectionType === 'mobile') {
        updateQuestion(questions.wifiAvailable, [
            { text: "Oui", value: 'yes' },
            { text: "Non", value: 'no' }
        ]);
    } else {
        showDeviceQuestion();
    }
}

function handleSecondStep(choice) {
    if (connectionType === 'mobile') {
        if (choice === 'yes') {
            const recommendations = [{
                title: "Connexion Recommandée",
                content: "Privilégiez une connexion WiFi/Ethernet car les réseaux mobiles consomment 3 à 4 fois plus d'électricité.",
                sources: [
                    {text: "Site de l'Arcom: Impact environnemental des usages audiovisuels", url: "https://www.arcom.fr/nos-ressources/etudes-et-donnees/etudes-bilans-et-rapports-de-larcom/etude-de-limpact-environnemental-des-usages-audiovisuels-en-france#chapitre-ancre3"}
                ]
            }];
            
            const sources = [
                {text: "Site de l'Arcom: Impact environnemental des usages audiovisuels", url: "https://www.arcom.fr/nos-ressources/etudes-et-donnees/etudes-bilans-et-rapports-de-larcom/etude-de-limpact-environnemental-des-usages-audiovisuels-en-france#chapitre-ancre3"}
            ];
            
            showRecommendations(recommendations, sources);
            return;
        }
        showDeviceQuestion();
    }
}

function showDeviceQuestion() {
    step = 2;
    updateQuestion(questions.deviceType, [
        { text: "TV", value: 'tv' },
        { text: "PC", value: 'pc' },
        { text: "Ordinateur portable/tablette", value: 'laptop' },
        { text: "Téléphone", value: 'phone' }
    ]);
}

function handleDeviceType(choice) {
    deviceType = choice;
    step++;
    updateQuestion(questions.mediaType, [
        { text: "Audio", value: 'audio' },
        { text: "Vidéo", value: 'video' }
    ]);
}

function handleMediaType(choice) {
    mediaType = choice;
    const recommendations = [];
    const sources = new Set(); //Use a set to avoid duplicate

    // Resolution recommendations based on device
    const resolutions = getResolutionsForDevice(deviceType);
    recommendations.push({
        title: "Résolutions Recommandées",
        content: `Résolution économique: ${resolutions.eco}, Limitée: ${resolutions.limited}, Maximale: ${resolutions.max}`,
        sources: [
            {text: "Site de l'Arcom: Impact environnemental des usages audiovisuels", url: "https://www.arcom.fr/nos-ressources/etudes-et-donnees/etudes-bilans-et-rapports-de-larcom/etude-de-limpact-environnemental-des-usages-audiovisuels-en-france#chapitre-ancre3"},
            {text: "Publication IEA sur l'empreinte carbone du streaming video" , url: "https://www.iea.org/commentaries/the-carbon-footprint-of-streaming-video-fact-checking-the-headlines"}
        ]
    });

    // General recommendation for all cases
    recommendations.push({
        title: "Téléchargement vs Streaming",
        content: mediaType === 'audio' 
            ? "Pour la musique que vous écoutez régulièrement, privilégiez le téléchargement au streaming pour réduire l'impact."
            : "Pour les vidéos que vous regardez plusieurs fois, privilégiez le téléchargement au streaming.",
            sources: [{text: "Enovateurs: Some simple actions to adopt", url: "https://les-enovateurs.com/streaming-understanding-reducing-environmental-impact"}]
    });

    if (mediaType === 'audio') {
        recommendations.push({
            title: "Recommandations Audio",
            content: "Utilisez une plateforme audio, évitez les clips vidéo de musique, privilégiez les téléchargements pour limiter le streaming.",
            sources: [  {text: "Site de l'Arcom: Impact environnemental des usages audiovisuels", url: "https://www.arcom.fr/nos-ressources/etudes-et-donnees/etudes-bilans-et-rapports-de-larcom/etude-de-limpact-environnemental-des-usages-audiovisuels-en-france#chapitre-ancre3"}]
        });
    } else {
        // Add peak hours recommendation for video
        recommendations.push({
            title: "Heures de Visionnage",
            content: "Privilégiez le streaming en dehors des heures de pointe (évitez 18h-23h) pour réduire la consommation d'énergie et la bande passante.",
            sources: [{text: "Reducing the footprint of video streaming", url: "https://broadpeak.tv/blog/world-energy-saving-day-in-streaming/"}
            ]
        });

        // Screen size recommendation
        recommendations.push({
            title: "Taille d'Écran",
            content: "Pour le contenu non-cinématographique, privilégiez les petits écrans (téléphone ou tablette) plutôt que les grands écrans (TV) pour économiser de l'énergie.",
            sources: [{text: "Arcep: la taille des écrans", url: "https://www.arcep.fr/mes-demarches-et-services/consommateurs/fiches-pratiques/equipements-et-usages-numeriques-comment-limiter-mon-impact-environnemental-au-quotidien.html"}]
        });

        
    }
    // Compile sources
    recommendations.forEach(rec => {
        rec.sources.forEach(source => sources.add(source));
    });

    showRecommendations(recommendations, Array.from(sources));
}


function getResolutionsForDevice(device) {
    const resolutions = {
        'tv': { eco: '720p', limited: '1080p', max: '4K' },
        'pc': { eco: '720p', limited: '1080p', max: '4K' },
        'laptop': { eco: '480p', limited: '720p', max: '1080p' },
        'phone': { eco: '360p', limited: '480p', max: '720p' }
    };
    return resolutions[device];
}

function showRecommendations(recommendations, sources) {
    const container = document.getElementById('recommendations-container');
    const recommendationsDiv = document.getElementById('recommendations');
    document.getElementById('question-container').style.display = 'none';
    container.style.display = 'block';

    // Highlight and prioritize "Recommandations Audio" if media type is audio
    if (mediaType === 'audio') {
        const audioRecommendationIndex = recommendations.findIndex(rec =>
            rec.title === "Recommandations Audio"
        );

        if (audioRecommendationIndex !== -1) {
            // Extract and modify the audio recommendation to make it bold and striking
            const [audioRecommendation] = recommendations.splice(audioRecommendationIndex, 1);
            audioRecommendation.content = `<strong>${audioRecommendation.content}</strong>`;
            recommendations.unshift(audioRecommendation);
        }
    }
    
    recommendationsDiv.innerHTML = recommendations.map(rec => `
        <div class="recommendation-section">
            <div class="recommendation-title">${rec.title}</div>
            <p>${rec.content}</p>
        </div>
    `).join('');

    // Add CO2 emissions and fun fact
    const emissionsContainer = document.createElement('div');
    emissionsContainer.id = "co2-emissions-section";

    const emissions = {
        'tv': { eco: 23, max: 93 },
        'pc': { eco: 23, max: 93 },
        'laptop': { eco: 15, max: 39 },
        'phone': { eco: 6, max: 23 }
    };

    const emissionData = emissions[deviceType];
    const mobileWarning = connectionType === 'mobile'
        ? "<p><strong>Note :</strong> Les émissions de CO2e ci-dessous sont valables pour une connexion WiFi. Les réseaux mobiles consomment 3 à 4 fois plus d'énergie.</p>"
        : "";

    const emissionsHTML = `
        <h3>Impact Carbone (Connexion WiFi)</h3>
        <p>Pour ~5 heures de visionnage :</p>
        <ul>
            <li><strong>Mode économique :</strong> ${emissionData.eco} g CO2e</li>
            <li><strong>Mode maximal :</strong> ${emissionData.max} g CO2e</li>
        </ul>
        ${mobileWarning}
    `;

    const funFactHTML = `
        <h3>Le Saviez-Vous ?</h3>
        <p>Un aller-retour Londres - Cologne émet environ <strong>100 kg CO2e par passager</strong>, soit l'équivalent d'environ ${Math.round(100000 / emissionData.eco)} heures de visionnage en mode économique sur une TV via WiFi !</p>
        <p><a href="https://www.eurostar.com/rw-en/sustainability" target="_blank">Source : Eurostar</a></p>
    `;

    emissionsContainer.innerHTML = `
        <div class="emissions-info">${emissionsHTML}</div>
        <div class="fun-fact">${funFactHTML}</div>
    `;

    recommendationsDiv.appendChild(emissionsContainer);

    // Add sources section
    if (sources.length > 0) {
        const sourcesHTML = `
            <div id="sources-section" class="sources-section">
                <h3>Sources</h3>
                <ul>
                    ${sources.map(src => `
                        <li><a href="${src.url}" target="_blank">${src.text}</a></li>
                    `).join('')}
                </ul>
            </div>
        `;
        recommendationsDiv.innerHTML += sourcesHTML; // Append sources to recommendations
    }
}

function restart() {
    step = 0;
    connectionType = '';
    deviceType = '';
    mediaType = '';
    
    document.getElementById('recommendations-container').style.display = 'none';
    document.getElementById('general-advice').style.display = 'block';
}