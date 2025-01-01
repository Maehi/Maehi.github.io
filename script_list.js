document.addEventListener("DOMContentLoaded", function () {
    const spellsAccordion = document.getElementById("spellsAccordion");
    const errorMessage = document.getElementById("errorMessage");

    fetch("https://wizard-world-api.herokuapp.com/Spells")
        .then(response => {
            if (!response.ok) {
                throw new Error("Network response was not ok");
            }
            return response.json();
        })
        .then(data => {
            displaySpells(data);
        })
        .catch(error => {
            console.error("Failed to fetch spells:", error);
            errorMessage.style.display = "block";
        });

    function displaySpells(spells) {
        spells.sort((a, b) => a.name.localeCompare(b.name));

        spells.forEach((spell, index) => {
            const card = document.createElement("div");
            card.classList.add("card");
            card.innerHTML = `
                <div class="card-header" id="heading${index}" data-toggle="collapse" data-target="#collapse${index}" 
                    aria-expanded="false" aria-controls="collapse${index}" tabindex="0">
                    <h5 class="mb-0">
                        ${spell.name} - ${spell.type}
                    </h5>
                </div>
                <div id="collapse${index}" class="collapse" aria-labelledby="heading${index}" data-parent="#spellsAccordion">
                    <div class="card-body">
                        <strong>Incantation:</strong> ${spell.incantation || "Unknown"}<br>
                        <strong>Effect:</strong> ${spell.effect || "No description available"}<br>
                        <strong>Can be verbal:</strong> ${spell.canBeVerbal ? "Yes" : "No"}<br>
                        <strong>Light:</strong> ${spell.light || "None"}<br>
                        <strong>Creator:</strong> ${spell.creator || "Unknown"}
                    </div>
                </div>
            `;
            spellsAccordion.appendChild(card);
        });

        // Optional: Scroll to the opened section for better user experience
        spellsAccordion.addEventListener("shown.bs.collapse", (event) => {
            event.target.scrollIntoView({ behavior: "smooth", block: "start" });
        });

        // Ensure Enter key opens the accordion if it is focused
        document.querySelectorAll('.card-header').forEach(header => {
            header.addEventListener('keydown', function (event) {
                if (event.key === 'Enter') {
                    const targetCollapse = header.getAttribute('data-target');
                    $(targetCollapse).collapse('toggle');
                }
            });
        });
    }
});