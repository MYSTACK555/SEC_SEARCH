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


-->


# Home Server

Étienne Gauvin-Clermont (18 094 321)
Michael Labrecque (18 135 643)

<br>

## Mise en situation

De nos jour, il devient de plus en plus intéressant de vouloir ce confectionner un server maison (home server), et ce, pour plusieur raisons.

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

* Expliquer pourquoi sécurisé un server (port foward ou non), les risques.

* Dans notre situation on a recours a du ssh.

* Pas utilisé par dautre comme dans une compagnie. On a un user.

<br>

## Phase 1

Sachant que notre server peut être accessible ou interrogé par n'importe qui sur internet, nous avons l'obligation de mettre en place certaines mesures de sécurité afin de protéger nos donnés.

<br>

<block-title> Désactiver le root login[^1] </block-title>
L'une des premières étapes dans la sécurisation d'un serveur est de désactivé l'accès a celui-ci de l'extérieur avec le compte de super utilisateur. Comme l'une des méthodes d'accès via un terminal est SSH, nous devons d'abort désactivé la connection à la machine depuis l'utilisateur root.
Pour se faire il faut:

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

Les raisons pour lesquelles il est préférable de désactivé cet utlisateur sont:

1. Il possède énormément trop de droit sur la machine. (Il possède tous les droit)
2. Même avec un mot de passe relativment fort il reste vulnérable à une attaque par force brute.

<br>

<block-title> Activer firewall</block-title>

Contrary to popular belief, Lorem Ipsum is not simply random text. It has roots in a piece of classical Latin literature from 45 BC, making it over 2000 years old. Richard McClintock, a Latin professor at Hampden-Sydney College in Virginia, looked up one of the more obscure Latin words, consectetur, from a Lorem Ipsum passage, and going through the cites of the word in classical literature, discovered the undoubtable source. Lorem Ipsum comes from sections 1.10.32 and 1.10.33 of "de Finibus Bonorum et Malorum" (The Extremes of Good and Evil) by Cicero, written in 45 BC. This book is a treatise on the theory of ethics, very popular during the Renaissance. The first line of Lorem Ipsum, "Lorem ipsum dolor sit amet..", comes from a line in section 1.10.32.

<br>

### Rendre SSH plus sécuritaire

<block-title> Utiliser clef SSH plutôt qu'un mot de passe [^2]</block-title>

Comme nous allons nous connecter à notre serveur exposé depuis un réseaux qui n'est pas sécurisé, l'utilisation d'une clé Sécure shell nous permettera de créer une connection sécurisé. La clé SSH utilise de la cryptographie à clé publique. C'est un algorithme composé de deux clés. Une publique mise à la disponibilité de tous et une privé bien garder sur la machine du client qui sert à déchiffrer les messages chiffrés à l'aide de la clé publique correspondante.

<br>

Il existe plusieurs algorithmes permettant de créer une paire de clé SSH.

* **DSA**: Dangereux et plus utiliser depuis la version 7.0 de OpenSSH

* **RSA**: Offrant une sécurité acceptable si la longeur de la clé est de 3072 ou 4096 bits

* **Ed25519**: L'algorithme à prévilégier de nos jours, car actuellement le plus sûr.

<br>

Afin de générer une clé il suffit de procédé comme suit:

1. Ouvrir un terminal
2. générer la clé avec la commande 
   * pour Ed25519
    `ssh-keygen -t ed25519`
   * pour RSA
    `ssh-keygen -t rsa -b 4096`
3. Laisser l'emplacement par défaut
4. Entrez une phrase secrète pour protéger la clé privé

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

### Initialisation d'une connection

![authentiufication par clé ssh](images/SSHkeydiagram.png)[^3]

<br>

### Créer clef client
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

### Transférer clef client au server

Pour copier la clef public du client vers le server, exécuter:
```shell
cat ~/.ssh/client-key.pub | ssh server_username@server_ip "mkdir -p ~/.ssh && cat >> ~/.ssh/authorized_keys"
```

> Remplacer *server_username* avec le nom du server et remplacer *server_ip* par l'ip du server.

Maintenant, le dossier du server */home/username/.ssh* contient le fichier <po>authorized_keys</po>

![](images/2.png)

<br>

### Connection au server

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

<block-title> Authentification uniquement par la clef SSH </block-title>

Contrary to popular belief, Lorem Ipsum is not simply random text. It has roots in a piece of classical Latin literature from 45 BC, making it over 2000 years old. Richard McClintock, a Latin professor at Hampden-Sydney College in Virginia, looked up one of the more obscure Latin words, consectetur, from a Lorem Ipsum passage, and going through the cites of the word in classical literature, discovered the undoubtable source. Lorem Ipsum comes from sections 1.10.32 and 1.10.33 of "de Finibus Bonorum et Malorum" (The Extremes of Good and Evil) by Cicero, written in 45 BC. This book is a treatise on the theory of ethics, very popular during the Renaissance. The first line of Lorem Ipsum, "Lorem ipsum dolor sit amet..", comes from a line in section 1.10.32.

<br>

<block-title> Ajouter un système MFA à la connexion SSH [^4]</block-title>

L'utilisation d'un mot de passe ou la clé SSH sont 2 facteur d'authentification différent. Un facteur d'authentification est une information utiliser afin de prouvé que l'utilisateur à le droit d'effectuer des actions sur un système tel que de s'y connecter. Ces facteurs utilisent différent canaux d'authentification tel qu'un ordinateur, un téléphone cellulaire ou une clé physique d'authentification. C'est le média qui sert a transmettre un facteur d'authentification à l'utilisateur. Afin de renforcer la connexion ssh à notre serveur il est une excellente pratique d'appliquer une sécurité supplémentaire par l'utilisation de MFA (Multi-factor authentification). De cet facons, un attaquant qui réussit à compromettre votre ordinateur de bureau doit aussi obtenir le controle d'un ou plusieurs autres appareils vous appartient afin de pouvoir effectuer ses actions malicieuses. Les types de facteurs se catégorise en 3 groupes:

* Quelque chose que vous connaissez: un mot de passe ou une question de sécurité
* Quelque chose que vous possédez: une application d'authentification ou un token de sécurité.
* Quelque chose que vous êtes: une empreinte digitale, ou la reconnaissance vocale

L'un des facteur fréquemment utilisé par les différents systèmes est une application OATH_TOTP. OATH_TOTP (Open Authentication Time-Based One-Time Password)  est un protocole utilisant un mot de passe généralement composé de 6 à 8 caractère utilisable une seul fois qui se rafraichie àprès une période de temps d'environ 30 secondes. Un exemple de ces applications serait Google authenticator ou Microsoft authenticator. Un tel système peut être configuré de la facons suivante.

1. Installer Google PAM
   * Installer l'application
  `sudo apt install libpam-google-authenticator`
   * Lancer l'application
  `google-authenticator`
   * Répondre 'y' à la question `Do you want authentication tokens to be time-based (y/n)`
   * Répondre 'y' à la question 
   `Do you want to disallow multiple uses of the same authentication
token? This restricts you to one login about every 30s, but it increases
your chances to notice or even prevent man-in-the-middle attacks (y/n)`
   * Répondre 'n' à la question
   `By default, tokens are good for 30 seconds and in order to compensate for
possible time-skew between the client and the server, we allow an extra
token before and after the current time. If you experience problems with poor
time synchronization, you can increase the window from its default
size of 1:30min to about 4min. Do you want to do so (y/n)`
   * Répondre 'y' à la question
  `If the computer that you are logging into isn't hardened against brute-force
login attempts, you can enable rate-limiting for the authentication module.
By default, this limits attackers to no more than 3 login attempts every 30s.
Do you want to enable rate-limiting (y/n)`

2. Configurer Pam pour OpenSSH
   * Ouvrir la configuration sshd avec votre éditeur préférer
  `sudo nano /etc/pam.d/sshd`
   * Commenter la ligne `include common-auth` au début du fichier avec le caractère **#**
      > Cela informe PAM de ne pas demander pour un mot de passe, mais seulement pour la vérification du second facteur. Laisser la ligne non commenté utilise 3 facteurs (la clé ssh, le mot de passe du compte, la vérification du TOTP)
   * Ajouter la ligne `auth required pam_google_authenticator.so nullok` à la toute fin du fichier
     > nullok signifi que la méthode d'authentification PAM est optionnel. cela permet à un utilisateur sans jeton OATH-TOTP de se tout de même se connecter via ssh.
     **Important**: Retirer la valeur nullok lorsque tout les utilisateurs on configurer leur jeton OATH-TOTP
   * Sauvegarder et fermer
3. Configurer ssh pour qu'il gère l'authentification PAM
    * ouvrir le fichier `/etc/ssh/sshd_config` dans votre éditeur préférer
 `sudo nano /etc/ssh/sshd_config`
    * Trouver le paramètre `ChallengeResponseAuthentication` et assigner la valeur yes
    * Ajouter la ligne suivante
  `AuthenticationMethods publickey,password publickey,keyboard-interactive`
    * Sauvegarder et fermer le fichier
    * Redémarer le service sshd
  `sudo systemctl restart sshd.service`

<block-title> Configuré un interval de délais d'innactivité[^9]</block-title>
Cela permet de fermer une connexion ssh qui n'est plus utilisé. Cela évite de consommé inutilement des ressources systèmes tout en évitant qu'une personne tierce puisse accédé à la connexion en accédant à l'ordinateur de l'utilisateur connecté. Pour cela, il suffit de :

1. Ouvrir le fichier sshd_config avec votre éditeur préférer
`sudo nano /etc/ssh/sshd_config`
2. Décommenter et attribué la valeur désirer en seconde `300` (5min) à la variable **ClientAliveInterval**
3. Sauvegarder et fermer
4. relancer le service
`sudo systemctl restart sshd.service`

<block-title> Changer le port SSH par un personnalisé[^9]</block-title>
Le port utiliser par défaut est le 22. Cette valeur est largement connu au sein des attaquant. Les différents outil de sécurité et d'intrusion utilise donc principalement ce port. Même si le modifier reviens à faire de la sécurité par l'ignorance qui est très faible comme sécurité, cela permettera néanmoins de réduire considérablement les attaques automatisés sur le port SSH

1. Ouvrir le fichier sshd_config avec votre éditeur préférer
`sudo nano /etc/ssh/sshd_config`
2. Décommenter et attribué la valeur désirer ex. 500 à la variable **Port**
3. Sauvegarder et fermer
4. relancer le service
`sudo systemctl restart sshd.service`
> Ne pas oublier de modifier le transfert des port sur le routeur pour la même valeur.

<block-title> Désactivé le transfer X11[^8][^9]</block-title>
En plus d'être inutile pour un serveur qui est dans 99.9% des cas utiliser avec un terminal, cela empêchera certain vecteur d'attaque qui exploite le transfert X11 qui n'a pas été concu en ayant la sécurité comme point fort lors du développement. Le fait qu'il soit activé n'est pas mauvais dans le cas ou le serveur n'est pas compromis. Le transfert X11 amène une plus grande confiance du coté serveur qu'à celui du client. S'il a été comprimis il peut servir à effectuer une multitude d'action sur la machine du client tel qu'ouvrir ou fermer des fenêtre et espionné les touches saisie et injecté des événement clavier ou sourie. En le désactivant, nous évitons un potentiel vecteur de propagation d'un malware sur la machine client depuis notre serveur.
Pour cela, il suffit de :

1. Ouvrir le fichier sshd_config avec votre éditeur préférer
`sudo nano /etc/ssh/sshd_config`
2. Changer la valeur pour **no** à la variable **X11Forwarding**
3. Sauvegarder et fermer
4. relancer le service
`sudo systemctl restart sshd.service`


<div style="page-break-after: always;"></div>

<br>

## Attaque pouvant être mené sur un home server
Tous serveurs peut être la cible d'attaque pricpipalement lorsque les services sont exposer sur le web. 
parmis celle-ci on peut retrouver les attaques Man-in-the-Middle, le deni de service, brute force des identifiants du port ssh. Certaines sont plus facile à contrer que d'autres.

### Man-in-the-Middle [^5]
Cette attaque où comme son nom l'indique un acteur malveillant se place entre nous et la machine ou le service que l'on veux joindre a pour but d'intercepter les communications échanger entre les deux entités sans que sa présence ne soit remarquer. dans ce type d'attaque l'homme du milieux peut lire, mais aussi modifier les messages échangés. Le protocole de la connexion SSH avec une clé ssh permet de se prémunir contre cet attaque. En effet, dans le cas ou un utilisateur nommé Ève tenterait de s'imissé entre l'utilisateur Alice et le server de Bob, ève pourrait tenter d'initier la connexion avec Bob à la place d'alice et se faire passer pour le serveur de bob auprès d'alice. Cependant, ève ne réussirait pas a joindre le serveur de bob puisqu'elle ne réusirais pas a passé l'étape de l'encryption du mot générer aléatoirement [à l'étape 2](#initialisation-dune-connection) puisque sa clé ssh publique n'est pas sauvegarder dans le serveur de bob et donc quand bob tenterais de décoder le message recus par ève, celui-ci ne corresponderait pas au mot qu'il a initialement envoyer et la connection serait abandonné.

### Attaque par déni de service (DOS)[^6][^7]
Cette attaque qui vise a rendre un système indisponible peut prendre différentes formes. La saturation de la bande passante qui rend ainsi le serveur injoignable et même l'épuisement des ressources système de la machine qui l'empêche de répondre au traffic légitime. Le déni de service opère donc par l'envoie d'une multitude de requêtes rapidement sur la machine visé afin de rendre le service instable voir indisponible. Cette attque est la plus difficile à mitiger pour un home serveur puisque même si des règle de parefeu sont appliquer et bloque les connexions malicieuses. Les demandes de connexion elles peuvent tout de même arriver en quantité énorme et saturé la bande passante. La solution la plus probable dans ce cas est que le fournisseur d'accès internet bloque les requêtes faites vers le home server. Cela dit plusieurs service existe afin de mitiger au maximum ce type d'attaque. Parmis eux on trouve SSHGuard, Fail2ban and DenyHosts. Aucun d'eux n'as été tester ici.

## Pour aller plus loin
- [ ] mettre en place une attaque dos
- [ ] créer un script regrouppant les différentes configuration mentionné afin d'automatiser la sécurisation du serveur
- [ ] tester SSHGuard, Fail2ban and DenyHosts pour contrer les attaque par force brute

<block-title>Référence</block-title>
[^1]: [Désactivé la connexion root SSH](https://www.ionos.fr/assistance/serveurs-et-cloud/premiers-pas/informations-importantes-sur-la-securite-de-votre-serveur/desactiver-la-connexion-root-ssh/)
[^2]: [Qu'est-ce qu'une clé SSH](https://help.gnome.org/users/seahorse/stable/about-ssh.html.fr#:~:text=L'avantage%20d'utiliser%20une,et%20un%20mot%20de%20passe.)
[^3]: [schéma d'authentification SSH](https://spectralops.io/blog/guide-to-ssh-keys-in-gitlab/)
[^4]: [Configuration MFA](https://www.digitalocean.com/community/tutorials/how-to-set-up-multi-factor-authentication-for-ssh-on-ubuntu-16-04)
[^5]: [Man in the middle](https://fr.wikipedia.org/wiki/Attaque_de_l%27homme_du_milieu)
[^6]: [Secure a home server from a dos attack](https://serverfault.com/questions/1041907/how-to-secure-a-home-server-from-a-dos-attack-questions-about-research)
[^7]: [préserver l'accessibilité de votre serveur](https://www.ovh.com/ca/fr/anti-ddos/principe-anti-ddos.xml)
[^8]: [security concern with X11 forwarding](https://security.stackexchange.com/questions/14815/security-concerns-with-x11-forwarding)
[^9]: [best practice](https://securitytrails.com/blog/mitigating-ssh-based-attacks-top-15-best-security-practices)