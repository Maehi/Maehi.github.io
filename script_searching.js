document.addEventListener("DOMContentLoaded", function() {
    const spellForm = document.getElementById("spellForm");
    const spellResults = document.getElementById("spellResults");
    const spellAccordion = document.getElementById("spellAccordion");
    const spellNameInput = document.getElementById("spellName");
    const spellNameError = document.getElementById("spellNameError");

    // Event listener für das Formular
    spellForm.addEventListener("submit", function(event) {
        event.preventDefault();

        // Hole den Namen des Zaubers
        const spellName = spellNameInput.value.trim();

        // Validierung der Eingabe
        if (!validateInput(spellName)) {
            return; // Bei ungültiger Eingabe wird der Submit-Vorgang gestoppt
        }

        // Anfrage an die API, um Zaubersprüche zu suchen
        searchSpells(spellName.toLowerCase());
    });

    // Funktion zur Eingabevalidierung
    function validateInput(input) {
        const containsOnlyLetters = /^[a-zA-Z\s]+$/.test(input); // Prüft, ob nur Buchstaben und Leerzeichen enthalten sind
        if (!input || input.length < 3) {
            spellNameError.textContent = "Please enter at least 3 letters.";
            spellNameInput.classList.add("is-invalid");
            return false;
        }
        if (!containsOnlyLetters) {
            spellNameError.textContent = "No numbers or special characters are allowed.";
            spellNameInput.classList.add("is-invalid");
            return false;
        }

        // Falls keine Fehler
        spellNameError.textContent = "";
        spellNameInput.classList.remove("is-invalid");
        spellNameInput.classList.add("is-valid");
        return true;
    }

    function showError(message) {
        const errorMessage = document.getElementById("errorMessage");
        errorMessage.textContent = message; // Fehlernachricht einfügen
        errorMessage.style.display = "block"; // Fehleranzeige sichtbar machen
        spellResults.style.display = "none"; // Ergebnisse verbergen, wenn ein Fehler auftritt
    }

    // Funktion zum Abrufen der Zaubersprüche anhand des Namens
    function searchSpells(query) {
        const xhr = new XMLHttpRequest();
        xhr.open("GET", `https://wizard-world-api.herokuapp.com/Spells`, true);
        xhr.setRequestHeader("Content-Type", "application/json");

        xhr.onload = function() {
            if (xhr.status >= 200 && xhr.status < 300) {
                try {
                    const data = JSON.parse(xhr.responseText);

                    // Filtern der Zaubersprüche nach dem eingegebenen Namen
                    const filteredSpells = data.filter(spell => spell.name.toLowerCase().includes(query));

                    // Sortieren der Zaubersprüche nach Name (alphabetisch)
                    const sortedSpells = filteredSpells.sort((a, b) => a.name.localeCompare(b.name));

                    // Zaubersprüche anzeigen
                    displaySpells(sortedSpells);
                } catch (e) {
                    console.error("Fehler beim Parsen der Antwort:", e);
                    showError("Die Antwort der API konnte nicht verarbeitet werden.");
                }
            } else {
                console.error("Fehler bei der Anfrage:", xhr.statusText);
                showError("Die API hat einen Fehler zurückgegeben. Bitte versuchen Sie es später erneut.");
            }
        };

        xhr.onerror = function() {
            console.error("Anfrage fehlgeschlagen.");
            showError("There was an issue fetching the desired spell(s). Please check your internet connection or try again later.");
        };

        xhr.send();
    }

    // Funktion zum Anzeigen der Zaubersprüche im Akkordeon
    function displaySpells(spells) {
        const errorMessage = document.getElementById("errorMessage");
        errorMessage.style.display = "none"; // Vorherige Fehlermeldungen ausblenden
        spellAccordion.innerHTML = ""; // Vorherige Ergebnisse löschen

        if (spells.length === 0) {
            spellAccordion.innerHTML = `<div class="alert alert-warning">No spells found.</div>`;
            spellResults.style.display = "block";
            return;
        }

        spells.forEach((spell, index) => {
            const card = document.createElement("div");
            card.classList.add("card");
            card.innerHTML = `
                <div class="card-header" id="heading${index}">
                    <h5 class="mb-0">
                        <button class="btn btn-link collapsed" data-toggle="collapse" data-target="#collapse${index}" aria-expanded="false" aria-controls="collapse${index}">
                            ${spell.name} - ${spell.type}
                        </button>
                    </h5>
                </div>
                <div id="collapse${index}" class="collapse" aria-labelledby="heading${index}" data-parent="#spellAccordion">
                    <div class="card-body">
                        <strong>Incantation:</strong> ${spell.incantation || "No incantation"}<br>
                        <strong>Effect:</strong> ${spell.effect || "No description"}<br>
                        <strong>Can be verbal:</strong> ${spell.canBeVerbal ? "Yes" : "No"}<br>
                        <strong>Light:</strong> ${spell.light || "No light"}<br>
                        <strong>Creator:</strong> ${spell.creator || "Unknown"}
                    </div>
                </div>
            `;
            spellAccordion.appendChild(card);
        });

        spellResults.style.display = "block";

        // Bootstrap Collapse initialisieren
        $('#spellAccordion').collapse();
    }
});
