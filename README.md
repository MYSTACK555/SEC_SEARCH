# INF808_Home_Server

## Description
Terminal Secure SSH Server.
Program to make ssh more secure on ubuntu/pop-os/debian server.

## Installation
```shell
sudo apt install nodejs npm
sudo npm i -g typescript ts-node
```

## Pre-Utilisation
* Ouvrir un terminal dans le répertoire **Code/src**
* Exécuter `npm install`

## Utilisation
* Ouvrir un terminal dans le répertoire **Code/src**
* Exécuter `sudo ts-node main.ts `

<br>

> Un sudo est peut être nécessaire pour exécuter certaines des commandes

## Instruction
Les modifications émises par le script ce font dans le répertoire **Code/virtual_linux** par défaut pour facilité la démo et les tests. Il est possible de changer le répertoire pour pointer sur le vrai noyau du système. Pour ce faire, aller modifier la variable `linuxSystemPath` dans le fichier `Code/src/config.json`.

**Exemple**
```json
{
    "linuxSystemPath": ""
}
```

## Demo
![](/Demo/1.png)
![](/Demo/2.png)
![](/Demo/3.png)
![](/Demo/4.png)