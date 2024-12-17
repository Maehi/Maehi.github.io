document.addEventListener("DOMContentLoaded", () => {
    const spellForm = document.getElementById("spellForm");
    const spellResults = document.getElementById("spellResults");
    const spellAccordion = document.getElementById("spellAccordion");
    const spellListContainer = document.getElementById("spellListContainer");
    const generateButton = document.getElementById("generateButton");

    // Beispielzaubersprüche als Fallback
    const sampleSpells = [
        {
            "id": "1",
            "name": "Expelliarmus",
            "incantation": "Expelliarmus",
            "effect": "Entwaffnet den Gegner",
            "canBeVerbal": true,
            "type": "Verteidigungszauber",
            "light": "Rot",
            "creator": "Unbekannt"
        },
        {
            "id": "2",
            "name": "Lumos",
            "incantation": "Lumos",
            "effect": "Licht erzeugen",
            "canBeVerbal": true,
            "type": "Zauber",
            "light": "Weiß",
            "creator": "Unbekannt"
        }
    ];

    // Zauberspruch-Generator auf random.html
    if (generateButton) {
        generateButton.addEventListener("click", async () => {
            try {
                const spells = await fetchSpells();  // Abrufen der gesamten Liste
                const randomSpell = spells[Math.floor(Math.random() * spells.length)];
                document.getElementById("spellName").innerText = randomSpell.name;
            } catch (error) {
                console.error("Fehler beim Abrufen eines zufälligen Zauberspruchs:", error);
                alert("Ein Fehler ist aufgetreten. Zeige zufälligen Beispielzauberspruch an.");
                const randomSpell = sampleSpells[Math.floor(Math.random() * sampleSpells.length)];
                document.getElementById("spellName").innerText = randomSpell.name;
            }
        });
    }

    // Suchfunktion auf search.html
    if (spellForm) {
        spellForm.addEventListener("submit", async (event) => {
            event.preventDefault();
            try {
                const spells = await fetchSpells();  // Abrufen der gesamten Liste
                const filteredSpells = filterSpells(spells);
                displaySpells(filteredSpells);
            } catch (error) {
                console.error("Fehler beim Suchen von Zaubersprüchen:", error);
                alert("Ein Fehler ist aufgetreten. Zeige Beispielzaubersprüche an.");
                displaySpells(filterSpells(sampleSpells));
            }
        });
    }

    // Funktion zum Abrufen aller Zaubersprüche
    async function fetchSpells() {
        const response = await fetch(`https://wizard-world-api.herokuapp.com/Spells`);
        if (!response.ok) throw new Error("Netzwerkfehler");
        return await response.json();
    }

    // Filterfunktion für die Suche
    function filterSpells(spells) {
        const spellName = document.getElementById("spellName")?.value.trim().toLowerCase();
        return spells.filter(spell =>
            spell.name.toLowerCase().includes(spellName)
        );
    }

    // Anzeige der Zaubersprüche in list.html und search.html
    function displaySpells(spells) {
        spellAccordion.innerHTML = "";
        if (spells.length === 0) {
            spellAccordion.innerHTML = `<div class="alert alert-warning">Keine Zaubersprüche gefunden.</div>`;
            spellResults.style.display = "block";
            return;
        }

        spells.forEach((spell, index) => {
            const card = document.createElement("div");
            card.classList.add("card");
            card.innerHTML = `
                <div class="card-header" id="heading${index}">
                    <h5 class="mb-0">
                        <button class="btn btn-link" data-toggle="collapse" data-target="#collapse${index}" aria-expanded="true" aria-controls="collapse${index}">
                            ${spell.name} - ${spell.type}
                        </button>
                    </h5>
                </div>
                <div id="collapse${index}" class="collapse ${index === 0 ? "show" : ""}" aria-labelledby="heading${index}" data-parent="#spellAccordion">
                    <div class="card-body">
                        <strong>Beschwörung:</strong> ${spell.incantation || "Keine Beschwörung"}<br>
                        <strong>Effekt:</strong> ${spell.effect || "Keine Beschreibung"}<br>
                        <strong>Verbal ausführbar:</strong> ${spell.canBeVerbal ? "Ja" : "Nein"}<br>
                        <strong>Licht:</strong> ${spell.light || "Kein Licht"}<br>
                        <strong>Ersteller:</strong> ${spell.creator || "Unbekannt"}
                    </div>
                </div>
            `;
            spellAccordion.appendChild(card);
        });

        spellResults.style.display = "block";
    }

    // Automatische Anzeige aller Zaubersprüche in list.html
    if (spellListContainer) {
        (async () => {
            try {
                const spells = await fetchSpells();
                displaySpells(spells);
            } catch (error) {
                console.error("Fehler beim Laden aller Zaubersprüche:", error);
                alert("Ein Fehler ist aufgetreten. Zeige Beispielzaubersprüche an.");
                displaySpells(sampleSpells);
            }
        })();
    }
});
