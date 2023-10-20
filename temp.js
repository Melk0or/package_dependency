#!/usr/bin/env node

const fs = require('fs');
const { Command } = require('commander');

const program = new Command();
program.version('1.0.0');

program
    .command('graph')
    .description('Generate a graph of changes in the local git repository')
    .action(generateGitGraph);

program.parse(process.argv);

function generateGitGraph() {
    const gitPath = '.git'; // Путь к папке .git
    const dotOutput = 'git-graph.dot'; // Имя файла для вывода графа в формате DOT

    try {
        const gitData = fs.readFileSync(`${gitPath}/logs/HEAD`, 'utf8'); // Считываем лог HEAD
        const commits = gitData.split('\n').filter(line => line.trim() !== ''); // Разделяем лог на коммиты

        const dotGraph = generateDotGraph(commits); // Генерируем граф в формате DOT
        fs.writeFileSync(dotOutput, dotGraph); // Записываем граф в файл

        console.log(`Graph has been generated and saved to ${dotOutput}`);
    } catch (error) {
        console.error('An error occurred:', error);
    }
}

function generateDotGraph(commits) {
    const lines = ['digraph GitGraph {', 'rankdir=LR;'];

    for (const commit of commits) {
        const [sha, author, date, message] = commit.split('\t');
        lines.push(`"${sha}" [label="${sha.substring(0, 7)}\\n${author}\\n${date}\\n${message}"];`);
    }

    lines.push('}');
    return lines.join('\n');
}
