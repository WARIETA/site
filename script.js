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

    // Generování řádku tabulky
    var newRow = "<tr><td>" + pokoj + "</td><td>" + type + "</td><td>" + sirkaCm + "x" + vyskaCm + "</td><td class='count'>" + pocet + "x</td><td class='area'>" + obsah + "m2</td><td>(" + celkovyObsah + "m2)</td><td><button onclick='increaseCount(this)'>+</button> <button onclick='decreaseCount(this)'>-</button></td></tr>";

    // Přidání záznamu do odpovídající kategorie
    records[type].push(newRow);

    // Aktualizace tabulky
    updateTable();

    // Vyčištění vstupních polí po přidání záznamu
    document.getElementById('sirka').value = "";
    document.getElementById('vyska').value = "";

    // Aktualizace celkového obsahu po přidání řádku
    updateTotalArea();
}

// Funkce pro aktualizaci tabulky
function updateTable() {
    var tableBody = document.getElementById('table-body');
    tableBody.innerHTML = '';

    for (var type in records) {
        for (var i = 0; i < records[type].length; i++) {
            tableBody.innerHTML += records[type][i];
        }
    }
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
        // Volitelné: Potvrzení před smazáním řádku, pokud je počet 1
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

// Funkce pro kopírování hodnot tabulky jako hlavičky
function copyToClipboard() {
    var headerText = "Sítě do oken. Barva rámu - " + document.getElementById('barva-ramu').value + ". Šířka rámu - " + document.getElementById('sirka-ramu').value + "\n\n";

    // Kopírování hlavičky
    var copiedText = headerText;

    // Kopírování každého řádku z tabulky
    var tableRows = document.getElementById('table-body').getElementsByTagName('tr');
    for (var i = 0; i < tableRows.length; i++) {
        copiedText += tableRows[i].getElementsByTagName('td')[0].innerText.trim() + " ";
        copiedText += tableRows[i].getElementsByTagName('td')[1].innerText.trim() + " ";
        copiedText += tableRows[i].getElementsByTagName('td')[2].innerText.trim() + " ";
        copiedText += tableRows[i].getElementsByClassName('count')[0].innerText.trim() + " ";
        copiedText += tableRows[i].getElementsByClassName('area')[0].innerText.trim() + " ";
        copiedText += tableRows[i].getElementsByTagName('td')[5].innerText.trim() + "\n";
    }

    // Přidání mezery mezi rozměry a celkovým obsahem
    copiedText += "\n";

    // Zobrazení celkového obsahu a počtu sítí
    copiedText += "dohromady:\n";
    copiedText += "Fixní: " + calculateTotalArea('Fixní') + "m2 (" + calculateTotalCount('Fixní') + "x)\n";
    copiedText += "Dveřní: " + calculateTotalArea('Dveřní') + "m2 (" + calculateTotalCount('Dveřní') + "x)\n";
    copiedText += "Posuvná: " + calculateTotalArea('Posuvná') + "m2 (" + calculateTotalCount('Posuvná') + "x)\n";
    copiedText += "Rolovací: " + calculateTotalArea('Rolovací') + "m2 (" + calculateTotalCount('Rolovací') + "x)\n";

    // Kopírování do schránky
    navigator.clipboard.writeText(copiedText).then(function() {
        alert("Text zkopírován do schránky");
    }, function() {
        alert("Chyba při kopírování textu");
    });
}

// Funkce pro výpočet celkového obsahu
function calculateTotalArea(type) {
    var totalArea = 0;
    var tableRows = document.getElementById('table-body').getElementsByTagName('tr');
    for (var i = 0; i < tableRows.length; i++) {
        var rowType = tableRows[i].getElementsByTagName('td')[1].innerText.trim();
        if (rowType === type) {
            var areaCell = tableRows[i].getElementsByTagName('td')[5];
            var area = parseFloat(areaCell.innerText.replace(/[^\d.]/g, ''));
            totalArea += area;
        }
    }
    return totalArea.toFixed(2);
}

// Funkce pro výpočet celkového počtu
function calculateTotalCount(type) {
    var totalCount = 0;
    var tableRows = document.getElementById('table-body').getElementsByTagName('tr');
    for (var i = 0; i < tableRows.length; i++) {
        var rowType = tableRows[i].getElementsByTagName('td')[1].innerText.trim();
        if (rowType === type) {
            var countCell = tableRows[i].getElementsByClassName('count')[0];
            var count = parseInt(countCell.innerText.replace("x", ""));
            totalCount += count;
        }
    }
    return totalCount;
}

// Funkce pro aktualizaci celkového obsahu
function updateTotalArea() {
    var totalAreaFixni = calculateTotalArea('Fixní');
    var totalCountFixni = calculateTotalCount('Fixní');
    var totalAreaDverni = calculateTotalArea('Dveřní');
    var totalCountDverni = calculateTotalCount('Dveřní');
    var totalAreaPosuvna = calculateTotalArea('Posuvná');
    var totalCountPosuvna = calculateTotalCount('Posuvná');
    var totalAreaRolovaci = calculateTotalArea('Rolovací');
    var totalCountRolovaci = calculateTotalCount('Rolovací');

    document.getElementById('total-area').innerText = "dohromady:\nFixní: " + totalAreaFixni + "m2 (" + totalCountFixni + "x)\nDveřní: " + totalAreaDverni + "m2 (" + totalCountDverni + "x)\nPosuvná: " + totalAreaPosuvna + "m2 (" + totalCountPosuvna + "x)\nRolovací: " + totalAreaRolovaci + "m2 (" + totalCountRolovaci + "x)";
}

// Prevence pro náhodné aktualizování stránky
window.onbeforeunload = function() {
    return "Opravdu chcete opustit tuto stránku? Data budou ztracena.";
};
