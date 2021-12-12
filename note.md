---
id: "custom"
---

<!-- @import "note-style.less" -->

<!-- https://detexify.kirelabs.org/classify.html -->
<!-- https://shd101wyy.github.io/markdown-preview-enhanced/#/ -->

<link href="https://fonts.googleapis.com/css2?family=Handlee&display=swap" rel="stylesheet">

<!--

<table>
  <tr>
    <th></th>
    <th></th>
  </tr>
  <tr>
    <td></td>
    <td></td>
  </tr>
  <tr>
    <td></td>
    <td></td>
  </tr>
</table>

<table>
  <td></td>
  <td></td>
</table>

brute force + list leak

firewall

mettre devant un vpn

art

-->

# Home Server

Étienne Gauvin-Clermont (18 094 321)
Michael Labrecque (18 135 643)

<br>

## Mise en situation

De nos jour, il devient de plus en plus intéressant de vouloir ce confectionner un server maison (home server), et ce, pour plusieur raisons. Pour en cité quelques une :


* Centralise et fournit un control absolue sur les données et traitements 
* Hybride : peut faire d'autre tâche que son objectif premier

<block-text> **Exemple** 
Prenons un home server dont son principale objectif est le stockage d'informations. On peut lui demandé parallèlement d'exécuter d'autres tâches. En effet, nous pouvons lui demander par exemple d'encoder des vidéo avec ffmpeg, mettre en place un server pour un jeu, faire de l'interpolation de vidéo avec [RIFE](https://github.com/hzwer/arXiv2020-RIFE).
</block-text>

* Pleine gestion sur la disponibilité du server
* Gestion des sauvegardes
* **Potentiel** maintient de la privacité des données

<br>

Dans la situation où un server est utilisé uniquement à des fins personnel et de façon local, il est tout à fait acceptable de limiter son implication dans le but de sécurer pleinement celui-ci. Toutefois, mettre de l'avant l'idée d'une  il peut être assez intéressant de rendre accessible notre serveur de l'extérieur (remote access). Ainsi, il serait désormais possible de consulter et intéragir avec notre server de n'importe qu'elle endroit. Pour ce faire, il suffit de port forward le server. Une telle configuration est très triviale, mais elle nous rend plus propice aux attaques. Effectivement, rendre notre système interrogable de l'extérieure pour nous le rend aussi pour les autres. Pour cette raison, nous devons mettres certaines concept en place pour limiter le plus possible une future tentative d'intrusion.

> Il y a plusieurs façon de sécurisé un home server. Nous couvrirons uniquement ceux que nous jugeons pertinante et intéressante dans le cadre du cours. Aussi, les pratiques mises de l'avant diminue le risque d'intrusion sans pour autant les éliminer à 100%.

<br>

## Modèle de sécurité

Sachant que notre server peut être accessible ou interrogé par n'importe qui sur internet, nous avons l'obligation de mettre en place certaines mesures de sécurité afin de protéger nos donnés.

<br>

### Activer firewall

Contrary to popular belief, Lorem Ipsum is not simply random text. It has roots in a piece of classical Latin literature from 45 BC, making it over 2000 years old. Richard McClintock, a Latin professor at Hampden-Sydney College in Virginia, looked up one of the more obscure Latin words, consectetur, from a Lorem Ipsum passage, and going through the cites of the word in classical literature, discovered the undoubtable source. Lorem Ipsum comes from sections 1.10.32 and 1.10.33 of "de Finibus Bonorum et Malorum" (The Extremes of Good and Evil) by Cicero, written in 45 BC. This book is a treatise on the theory of ethics, very popular during the Renaissance. The first line of Lorem Ipsum, "Lorem ipsum dolor sit amet..", comes from a line in section 1.10.32.

<br>

### Désactiver le root login

L'une des premières étapes dans la sécurisation d'un serveur est de désactivé l'accès a celui-ci de l'extérieur avec le compte de super utilisateur. Comme l'une des méthodes d'accès via un terminal est SSH, nous devons d'abort désactivé la connection à la machine depuis l'utilisateur root.

<br>

Quelques raisons pour lesquelles il est préférable de désactivé cet utlisateur :
* Il possède énormément trop de droit sur la machine. (Il possède tous les droit)
* Même avec un mot de passe relativement fort il reste vulnérable à une attaque par force brute.

<br>

<block-title>Étapes </block-title>

1. Ouvrir le fichier de configuration sshd_config
  
  ```bash
  nano /etc/ssh/sshd_config
  ```

2. Chercher la ligne **`PermitRootLogin yes`** et remplacer la valeur `yes` par `no`
3. Sauvegarder le fichier
4. Redémarer le service SSH
  
  ```bash
    service ssh restart
  ```

<br>

### Utiliser clef SSH plutôt qu'un mot de passe

Comme nous allons nous connecter à notre serveur exposé depuis un réseaux qui n'est pas sécurisé l'utilisation d'une clé Sécure shell nous permettera de créer une connection sécurisé. La clé SSH utilise de la cryptographie à clé publique. C'est un algorithme composé de deux clés. Une publique mise à la disponibilité de tous et une privé bien garder sur la machine du client qui sert à déchiffrer les messages chiffrés à l'aide de la clé publique correspondante.

<br>

Il existe plusieurs algorithmes permettant de créer une paire de clé SSH :
<table>
  <tr>
    <th></th>
    <th></th>
  </tr>
  <tr>
    <td>DSA</td>
    <td>RSA</td>
    <td>Ed25519</td>
  </tr>
  <tr>
    <td>Dangereux et plus utiliser depuis la version 7.0 de OpenSSH</td>
    <td>Offrant une sécurité acceptable si la longeur de la clé est de 3072 ou 4096 bits</td>
    <td>L'algorithme à prévilégier de nos jours, car actuellement le plus sûr.</td>
  </tr>
</table>

<br>
<br>

L'utilisation d'une phrase secrète pour protéger la clé privé est une excellente façons de s'assuré que nous sommes la seule personne qui puisse l'utiliser principalement si nous ne sommes pas le seul utilisateur de la machine. De plus, cela ajoute une étape supplémentaire à un attaquant qui réussirait à prendre possession de la clé privé puisqu'il devra faire une attaque par force brute afin de trouvé cette phrase avant d'utiliser la clé privé.

<br>

Afin de s'authentifier au serveur avec sa clé ssh, le client procède comme suit:

1. Le client initialise la connection ssh
2. Le serveur génère un message aléatoire
3. Le client encrypte le message aléatoire avec sa clé privé
4. Le serveur décrypte le message encrypté avec la clé publique du client
5. Dans le cas ou le message décrypté est le même que celui initialement envoyé au client, le serveur envoie une réponse afirmative au client
6. Le client et le serveur s'entende sur l'utilisation d'une clé de session
7. Échange de donné encrypté avec un algorithme symétrique et la clé de session

![authentiufication par clé ssh](images/SSHkeydiagram.png)

<br>

<block-text> **Étapes** 
Créer clef client
</block-title>

Afin de générer une clé il suffit de procédé comme suit :

1. Ouvrir un terminal
2. Générer la clé avec la commande 
   * Pour Ed25519
    `ssh-keygen -t ed25519`
   * Pour RSA
    `ssh-keygen -t rsa -b 4096`
3. Laisser l'emplacement par défaut
4. Entrez une phrase secrète pour protéger la clé privé


<br>

Cela peut être intéressant d'avoir plusieurs clef ssh, car on peut plus facilement gérer les restrictions et l'utilisation de ceux-ci. En effet, il pourrait arriver la situation où nous voulons désactiver/invalider une certaine clef en plus de savoir exactement quelle clef à été utilisé à quelle moment.

<br>

Pour créer une clef RSA de 4096 bit portant le nom de client, exécuter:
```shell
ssh-keygen -t rsa -b 4096 -f ~/.ssh/client-key
```

> Le nom *client* aurait pu être remplacé par n'importe quoi.

Il sera proposé lors de la création de la clef de fournir un passphrase. Il est fortement conseiller dans fournir un sans quoi seul la possession de la clef privé (client-key) sera nécessaire pour l'authentification.

<br>

Après, le dossier */home/username/.ssh* contient les fichiers suivants :
* client-key
* client-key.pub

<br>

**Résultat**
![](images/1.png)

<br>

<block-text> **Étapes** 
Transférer clef client au server
</block-title>

Pour copier la clef public du client vers le server, exécuter:
```shell
cat ~/.ssh/client-key.pub | ssh server_username@server_ip "mkdir -p ~/.ssh && cat >> ~/.ssh/authorized_keys"
```

> Remplacer *server_username* avec le nom du server et remplacer *server_ip* par l'ip du server.

Maintenant, le dossier du server */home/username/.ssh* contient le fichier <po>authorized_keys</po>

![](images/2.png)

<br>

<block-text> **Étapes** 
Connection au server
</block-title>

Pour ce connecter au server, exécuter:
```shell
ssh -i ~/.ssh/client-key server_username@server_ip
ssh -i ~/.ssh/client-key etienne@10.0.0.33
```

> Remplacer *server_username* avec le nom du server et remplacer *server_ip* par l'ip du server.

Ensuite, il faudra saisir le passphrase entré dans les étapes précédentes.
![](images/4.png)

<br>

Toutefois, nous sommes toujours en mesure de ce connecter au server par le biais des informations d'un utilisateurs. En effet, l'ajout d'une clef public au server n'empêche pas automatiquement l'authentification par mot de passe.

![](images/3.png)


<br>

### Authentification uniquement par la clef SSH </block-title>

Il est maintenant primordiale de vouloir empêcher toute authentification avec le mot de passe de l'utilisateur. Pour refuser une connection ssh utilisant ce principe, il suffit de modifier le fichier <po>/etc/ssh/sshd_config</po> pour y ajouter cette ligne :

```shell
PasswordAuthentication no
```

Ensuite, il sera impossible de ce connecter avec un mot de passe d'utilisateur.

![](images/5.png)

<br>

### Ajouter un système MFA à la connexion SSH


L'utilisation d'un mot de passe ou la clé SSH sont 2 facteur d'authentification différent. Un facteur d'authentification est une information utiliser afin de prouvé que l'utilisateur à le droit d'effectuer des actions sur un système tel que de s'y connecter. Ces facteurs utilisent différent canaux d'authentification tel qu'un ordinateur, un téléphone cellulaire ou une clé physique d'authentification. C'est le média qui sert a transmettre un facteur d'authentification à l'utilisateur. Afin de renforcer la connexion ssh à notre serveur il est une excellente pratique d'appliquer une sécurité supplémentaire par l'utilisation de MFA (Multi-factor authentification). De cet facons, un attaquant qui réussit à compromettre votre ordinateur de bureau doit aussi obtenir le controle d'un ou plusieurs autres appareils vous appartient afin de pouvoir effectuer ses actions malicieuses. 

<br>

Les types de facteurs se catégorise en 3 groupes:

* Quelque chose que vous connaissez: un mot de passe ou une question de sécurité
* Quelque chose que vous possédez: une application d'authentification ou un token de sécurité.
* Quelque chose que vous êtes: une empreinte digitale, ou la reconnaissance vocale

<br>

L'un des facteur fréquemment utilisé par les différents systèmes est une application OATH_TOTP. OATH_TOTP (Open Authentication Time-Based One-Time Password)  est un protocole utilisant un mot de passe généralement composé de 6 à 8 caractère utilisable une seul fois qui se rafraichie àprès une période de temps d'environ 30 secondes. Un exemple de ces applications serait Google authenticator ou Microsoft authenticator. 

<br>

Un tel système peut être configuré de la facons suivante.

1. Installer Google PAM
2. Configurer OpenSSH
3. Rendre SSh attentif au MFA
4. (optionel) Ajouter un 3e facteur d'authentification


<block-text> **Étapes** </block-text>



<div style="page-break-after: always;"></div>

<br>

## Brute force SSH

**Prérequis**

```shell
sudo apt install ipcalc
sudo apt install nmap
sudo apt-get install -y hydra
```

> Les packets précédants doivent être installer pour réaliser la totalité du brute force.

Comme nous avons mentionner, il est tout à fait réaliste d'imaginer une situation où des tentative de connections seront faite sur notre server pour causer préjudice. Cette section va tenter de mettre en évidence l'importance des précaution proposé dans les sections précédantes.

> Nous allons faire abstractions sur les moyen utilisé par un individu pour ce connecter avec succès au network qui occupe notre machine qui sera brute force.

Sachant qu'une personne mal intentionner réussi à ce connecter au network, celui-ci peut tenter de brute force les machines ayant un service ssh. Pour réussir ce tour de force, il va falloir qu'il trouve l'ip de toute les machine ayant un service ssh activer en effectuant un *network map scan*. Pour effectué un *network map scan*, il faut d'abord avoir l'intervalle du network. 

<br>

### Obtenir network informations

Pour obtenir cette intervalle, il faut d'abord connaitre l'ip courrant de la machine en exécutant:

```shell
ifconfig | grep inet
```

**Résultat**

![](images/6.png)

<br>

**Données recueillis**

<table>
  <tr>
    <th></th>
    <th></th>
  </tr>
  <tr>
    <td>IP courrant</td>
  </tr>
  <tr>
    <td>10.0.0.243</td>
  </tr>
</table>

<br>
<br>

Maintenant, nous pouvons obtenir à partir de l'adresse ip l'intervalle du network en exécutant:


```shell
ipcalc 10.0.0.243
```

**Résultat**

![](images/7.png)

<br>

**Données recueillis**

<table>
  <tr>
    <th></th>
    <th></th>
  </tr>
  <tr>
    <td>IP courrant</td>
    <td>Intervalle network</td>
  </tr>
  <tr>
    <td>10.0.0.243</td>
    <td>10.0.0.0/24</td>
  </tr>
</table>

<br>
<br>


### Scan le network

Il est désormais possible de scanner tout les appareils ce retrouvant dans le network ayant le port ssh utilisé (22) et ouvert.

```shell
sudo nmap 10.0.0.0/24 -p 22 --open
```

**Résultat**
![](images/8.png)


<br>
<br>


**Données recueillis**

<table>
  <tr>
    <th></th>
    <th></th>
  </tr>
  <tr>
    <td>IP courrant</td>
    <td>Intervalle network</td>
    <td>IP machines</td>
  </tr>
  <tr>
    <td>10.0.0.243</td>
    <td>10.0.0.0/24</td>
    <td>10.0.0.33</td>
  </tr>
    <tr>
    <td></td>
    <td></td>
    <td>10.0.0.243</td>
  </tr>
</table>

<br>
<br>

L'adresse qui nous intéresse ici est le <po>10.0.0.33</po>, car c'est sur cette adresse que nous effecturons une attack de type brute force.

<br>

### Attaque brute force

Pour effectué une attaque brute force, nous devons d'abord construire deux fichiers. Un sera en charge de contenir une énumération de mot de passe et l'autre celles des noms d'utilisateurs. Elles seront ensuite combiner pour accomplire le brute force sur toute les combinaisons possibles. Ainsi, un fichiers plus gros aura pour effet de prendre plus de temps à brute force. 

> Une liste de mot de passe assez garnis serait d'utilisé [Rockyou.txt](https://github.com/brannondorsey/naive-hashcat/releases/download/data/rockyou.txt). Cependant, avoir recours à cette liste viendrait ajouter un temps considérable au test. Ainsi, nous allons nous limiter à quelques. options.

<br>

**users.txt**
#### Contient une liste de nom d'utilisateur potentiel.
Contenu
```txt
wow
root
toor
sudo
who
etienne
gandalf
```

**passwords.txt**
#### Contient une liste de mot de passe potentiel.
Contenu
```txt
po
allo
123
allopo
bella
```

Pour effectué une attaque brute force, nous devons exécuter:

```shell
sudo nmap 10.0.0.33 -p 22 --script ssh-brute --script-args userdb=users.txt,passdb=passwords.txt
```

**Résultat**

![](images/10.png)

<br>

![](images/12.png)

<br>

La photo précédante illustre que nous avons belle et bien trouver une correspondance entre le nom d'utilisateur **gandalf** et le mot de passe **bella**.  D'ailleurs, il est possible d'effectuer une attaque brute force d'une autre façon. En effet, il est possible d'utilisé <po>hydra</po> qui ce voit être plus rapide.
 
<br>

Pour utilisé hydra, exécuter:

```shell
sudo hydra -L users.txt -P passwords.txt ssh://10.0.0.33 -t 8
```

**Résultat**

![](images/11.png)

<br>

![](images/13.png)

<br>

Dans cette situation, nous conservons la même conclusion. C'est à dire, que le nom d'utilisateur **gandalf** et le mot de passe **bella** concorde ensemble.

<br>

Nous venons d'avoir la confirmation qu'avoir recours à l'authentification par utilisateur plutôt que par clef ssh est hautement risqué. Certes, les mots de passe étaient cours dans l'exemple. Toutefois, nous avons opté pour ce choix dans un contexte de démonstration. Un mot de passe plus compliqué peut éventuellement être brute forcé dépendamment du temps, des ressources et de l'intérêt que dispose l'attaquant. 

<br>

Le modèle de sécurité que nous avons présenté permet de contré ce type d'attaque en bloquant toutes demandes de connections sans clef ssh.

##### Conséquences de l'utilisation du brute force après notre modèle appliqué
![](images/9.png)

<br>

Le brute force n'en reste pas moins impossible. Toutefois, il est vraiment plus difficle dans tiré profit dans un contexte ou le server accept uniquement les connection par clef ssh en plus d'un passphrase. En effet, brute force une clef rsa de 4096 bit n'est pas impossible, mais il devient extrêmement non trivial de réussir un tel exploit. D'autant plus que dans un contexte de home server, il n'est pas **commun** de voir ce genre de tentative.


<br>

<block-title>Référence</block-title>
[Désactivé la connexion root SSH](https://www.ionos.fr/assistance/serveurs-et-cloud/premiers-pas/informations-importantes-sur-la-securite-de-votre-serveur/desactiver-la-connexion-root-ssh/)
[Qu'est-ce qu'une clé SSH](https://help.gnome.org/users/seahorse/stable/about-ssh.html.fr#:~:text=L'avantage%20d'utiliser%20une,et%20un%20mot%20de%20passe.)
[schéma d'authentification SSH](https://spectralops.io/blog/guide-to-ssh-keys-in-gitlab/)