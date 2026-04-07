# Задание «Перемещение элемента»

## Легенда

Вы решили развлечься и реализовать некое подобие игры, где гномы (или другие существа), выскакивают из "отверстий" и по ним нужно бить молотком:

![](https://github.com/danroman-github/ahj-dom/blob/main/src/img/GracefulMiniatureBustard-small.gif)

Copyright gfycat.com

### Описание

Собрать инфраструктуру проекта на базе Webpack, ESLint, Babel, Jest, Webpack Dev Server.

Нужно реализовать лишь первую часть этой игры - перемещение объекта в DOM Tree.

Для этого разработать игровое поле 4x4 и персонажа в виде картинки img (при загрузке страницы должен программно генерироваться и ставиться в рандомную позицию внутри игрового поля). С помощью функции setInterval запланируйте перемещение существующего объекта img в другое поле (алгоритм - рандомное перемещение, без перемещения в то же самое поле).

Для картинки персонажа использовать следующую:

![](https://github.com/danroman-github/ahj-dom/blob/main/src/img/goblin.png)

 Важно: не использовать removeChild!

Всё должно собираться через Webpack (включая картинки и стили) и выкладываться на Github Pages через CI.

[![NodeJS with Webpack](https://github.com/danroman-github/ahj-dom/actions/workflows/webpack.yml/badge.svg)](https://github.com/danroman-github/ahj-dom/actions/workflows/webpack.yml)
