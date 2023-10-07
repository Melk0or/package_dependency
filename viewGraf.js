const fs = require('fs');

const dotFileName = 'dependency-graph.dot';

fs.readFile(dotFileName, 'utf8', (err, data) => {
    if (err) {
        console.error(`Ошибка при чтении файла: ${err.message}`);
        process.exit(1);
    }

    const lines = data.split('\n');
    const dependencies = [];

    // Начинайте анализировать файл DOT с той строки, где начинаются данные о зависимостях.
    let parsing = true;
    for (const line of lines) {
        //console.log(line);
        if (line.trim() === '}') {
            //console.log(line);
            parsing = false;
            break;
        }
        if (line === '{') {
            //console.log(line);
            parsing = true;
        }
        if (parsing) {
            //console.log(line);
            // Извлекаем имена зависимостей из строк вида: "  "A" -> "B";"
            const match = line.match(/"([^"]+)" -> "([^"]+)";/);
            if (match) {
                const from = match[1];
                const to = match[2];
                dependencies.push({ from, to });
            }
        }
    }

    if (dependencies.length === 0) {
        console.log('Граф зависимостей пуст или не удалось обнаружить зависимости.');
    } else {
        console.log('Список зависимостей:');
        for (const dep of dependencies) {
            console.log(`${dep.from} -> ${dep.to}`);
        }
    }
});
