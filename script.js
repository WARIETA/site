// Udržování záznamů podle typu sítě
const records = {
    'Fixní': [],
    'Dveřní': [],
    'Posuvná': [],
    'Rolovací': []
};

// Funkce pro přidání nového záznamu do tabulky
function addEntry(type) {
    var barvaRamu = document.getElementById('barva-ramu').value;
    var sirkaRamu = document.getElementById('sirka-ramu').value;
    var pokoj = document.getElementById('pokoj').value;
    var sirkaCm = document.getElementById('sirka').value; // Šířka v centimetrech
    var vyskaCm = document.getElementById('vyska').value; // Výška v centimetrech

    if (!barvaRamu || !sirkaRamu || !pokoj || !sirkaCm || !vyskaCm) {
        alert("Prosím vyplňte všechna pole.");
        return;
    }

    // Převod na metry
    var sirka = (parseFloat(sirkaCm) / 100).toFixed(2); // Převod na metry a zaokrouhlení na 2 desetinná místa
    var vyska = (parseFloat(vyskaCm) / 100).toFixed(2); // Převod na metry a zaokrouhlení na 2 desetinná místa

    var pocet = 1; // Výchozí počet sítí
    var obsah = (sirka * vyska).toFixed(2); // Výpočet obsahu sítě v m2
    var celkovyObsah = (obsah * pocet).toFixed(2); // Celkový obsah v m2

    var tableBody = document.getElementById('table-body');
    var rows = tableBody.getElementsByTagName('tr');
    var found = false;

    for (var i = 0; i < rows.length; i++) {
        var cells = rows[i].getElementsByTagName('td');
        var rowPokoj = cells[0].innerText.trim();
        var rowTyp = cells[1].innerText.trim();
        var rowRozmer = cells[2].innerText.trim();

        if (rowPokoj === pokoj && rowTyp === type && rowRozmer === sirkaCm + "x" + vyskaCm) {
            var countCell = cells[3];
            var count = parseInt(countCell.innerText);
            count++;
            countCell.innerText = count + "x";

            updateRowArea(rows[i]);
            updateTotalArea();
            found = true;
            break;
        }
    }

    if (!found) {
        var newRow = document.createElement("tr");
        newRow.innerHTML = "<td>" + pokoj + "</td><td>" + type + "</td><td>" + sirkaCm + "x" + vyskaCm + "</td><td class='count'>" + pocet + "x</td><td class='area'>" + obsah + "m2</td><td>(" + celkovyObsah + "m2)</td><td><button onclick='increaseCount(this)'>+</button> <button onclick='decreaseCount(this)'>-</button></td>";
        tableBody.appendChild(newRow);
    }

    document.getElementById('sirka').value = "";
    document.getElementById('vyska').value = "";
    updateTotalArea();
}

// Funkce pro zvýšení počtu sítí
function increaseCount(btn) {
    var row = btn.parentNode.parentNode;
    var countCell = row.getElementsByClassName('count')[0];
    var count = parseInt(countCell.innerText);
    count++;
    countCell.innerText = count + "x";

    // Aktualizace celkového obsahu
    updateRowArea(row);
    updateTotalArea();
}

// Funkce pro snížení počtu sítí
function decreaseCount(btn) {
    var row = btn.parentNode.parentNode;
    var countCell = row.getElementsByClassName('count')[0];
    var count = parseInt(countCell.innerText);
    if (count > 1) {
        count--;
        countCell.innerText = count + "x";
    } else {
        var confirmDelete = confirm("Opravdu chcete odstranit tento rozměr?");
        if (confirmDelete) {
            row.parentNode.removeChild(row);
            updateTotalArea();
            return;
        }
    }

    // Aktualizace celkového obsahu
    updateRowArea(row);
    updateTotalArea();
}

// Funkce pro aktualizaci oblasti řádku
function updateRowArea(row) {
    var count = parseInt(row.getElementsByClassName('count')[0].innerText);
    var areaCell = row.getElementsByClassName('area')[0];
    var area = parseFloat(areaCell.innerText.replace("m2", ""));
    var totalAreaCell = row.getElementsByTagName('td')[5];
    var totalArea = (area * count).toFixed(2);
    totalAreaCell.innerText = "(" + totalArea + "m2)";
}

// Funkce pro kopírování hodnot do schránky
function copyToClipboard() {
    var barvaRamu = document.getElementById('barva-ramu').value;
    var sirkaRamu = document.getElementById('sirka-ramu').value;
    var text = `Sítě do oken. Barva rámu - ${barvaRamu}. Šířka rámu - ${sirkaRamu}cm\n\n`;

    var tableBody = document.getElementById('table-body');
    var rows = tableBody.getElementsByTagName('tr');
    var totalAreas = {
        'Fixní': 0,
        'Dveřní': 0,
        'Posuvná': 0,
        'Rolovací': 0
    };
    var totalCounts = {
        'Fixní': 0,
        'Dveřní': 0,
        'Posuvná': 0,
        'Rolovací': 0
    };

    for (var i = 0; i < rows.length; i++) {
        var cells = rows[i].getElementsByTagName('td');
        var pokoj = cells[0].innerText;
        var typ = cells[1].innerText;
        var rozmer = cells[2].innerText;
        var pocet = parseInt(cells[3].innerText);
        var obsah = cells[4].innerText;
        var celkovyObsah = cells[5].innerText;

        text += `${pokoj} ${typ} ${rozmer} ${pocet}x ${obsah} ${celkovyObsah}\n`;

        totalAreas[typ] += parseFloat(obsah.replace("m2", "")) * pocet;
        totalCounts[typ] += pocet;
    }

    text += "\ndohromady:\n";
    text += `Fixní: ${totalAreas['Fixní'].toFixed(2)}m2 (${totalCounts['Fixní']}x)\n`;
    text += `Dveřní: ${totalAreas['Dveřní'].toFixed(2)}m2 (${totalCounts['Dveřní']}x)\n`;
    text += `Posuvná: ${totalAreas['Posuvná'].toFixed(2)}m2 (${totalCounts['Posuvná']}x)\n`;
    text += `Rolovací: ${totalAreas['Rolovací'].toFixed(2)}m2 (${totalCounts['Rolovací']}x)\n`;

    navigator.clipboard.writeText(text).then(() => {
        alert('Tabulka byla zkopírována do schránky.');
    }, () => {
        alert('Kopírování do schránky selhalo.');
    });
}

// Funkce pro aktualizaci celkové oblasti
function updateTotalArea() {
    var tableBody = document.getElementById('table-body');
    var rows = tableBody.getElementsByTagName('tr');
    var totalArea = 0;

    for (var i = 0; i < rows.length; i++) {
        var count = parseInt(rows[i].getElementsByClassName('count')[0].innerText);
        var area = parseFloat(rows[i].getElementsByClassName('area')[0].innerText.replace("m2", ""));
        totalArea += (area * count);
    }

    document.getElementById('total-area').innerText = "dohromady: " + totalArea.toFixed(2) + "m2";
}
