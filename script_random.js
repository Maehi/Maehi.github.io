document.addEventListener("DOMContentLoaded", function() {
    const generateButton = document.getElementById("generateSpellButton");
    const spellNameElement = document.getElementById("spellName");
    const spellDetailsElement = document.getElementById("spellDetails");

    generateButton.addEventListener("click", function() {
        // Request a random spell from the API
        fetch("https://wizard-world-api.herokuapp.com/Spells")
            .then(response => response.json())
            .then(data => {
                // Pick a random spell
                const randomSpell = data[Math.floor(Math.random() * data.length)];

                // Display the spell details
                spellNameElement.textContent = randomSpell.name;
                spellDetailsElement.innerHTML = `
                    <strong>Incantation:</strong> ${randomSpell.incantation || "No incantation"}<br>
                    <strong>Effect:</strong> ${randomSpell.effect || "No description"}<br>
                    <strong>Can be verbal:</strong> ${randomSpell.canBeVerbal ? "Yes" : "No"}<br>
                    <strong>Light:</strong> ${randomSpell.light || "No light"}<br>
                    <strong>Creator:</strong> ${randomSpell.creator || "Unknown"}
                `;
            })
            .catch(error => {
                spellNameElement.textContent = "Error";
                spellDetailsElement.textContent = "There was an issue fetching the random spell. Please check your internet connection or try again later.";
            });
    });
});
