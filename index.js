const fs = require('fs');
const { spawnSync } = require('child_process');

const packageName = process.argv[2];

if (!packageName) {
    console.error('Укажите имя пакета в качестве аргумента командной строки.');
    process.exit(1);
}

function generateDependencyGraph(packageName) {
    // Генерируем команду для выполнения 'npm ls' и сохранения результатов в JSON.
    const npmLsCommand = `npm ls --json --prod --parseable --depth=100 ${packageName}`;

    // Запускаем 'npm ls' и получаем результат в виде JSON.
    const result = spawnSync(npmLsCommand, { shell: true, encoding: 'utf-8' });
    console.log(result);
    if (result.error) {
        console.error(`Ошибка при выполнении 'npm ls': ${result.error.message}`);
        process.exit(1);
    }

    const dependencyTree = JSON.parse(result.stdout);
    const dotGraph = generateDotGraph(dependencyTree, packageName);

    return dotGraph;
}

function generateDotGraph(dependencyTree, packageName) {
    const graph = [];
    graph.push(`digraph "${packageName} Dependency Graph" {`);
    graph.push('  node [shape=box];');

    function traverse(node) {
        if (node.dependencies) {
            for (const [depName, depData] of Object.entries(node.dependencies)) {
                const label = `${depName}@${depData.version}`;
                graph.push(`  "${packageName}" -> "${label}";`);
                traverse(depData);
            }
        }
    }

    traverse(dependencyTree);
    graph.push('}');

    return graph.join('\n');
}

function saveDotGraph(dotGraph) {
    fs.writeFileSync('dependency-graph.dot', dotGraph);
    console.log('Граф зависимостей успешно сохранен в файле dependency-graph.dot');
}

const dotGraph = generateDependencyGraph(packageName);
saveDotGraph(dotGraph);
