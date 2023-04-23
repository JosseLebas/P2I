# P2I
Projet P2I de Josselin Lebas

Ceci est mon projet de P2I en 2ème année d'école d'ingénieur à l'ENSC. C'est un jeu mobile basé sur les paris de formule 1, utilisant les données en temps réel.

GUIDE D'UTILISATION : 

Pour utiliser l’application, il faut réaliser les quelques étapes qui vont être listées ci-dessous. 

Créer un dossier qui contiendra le projet, donnez lui le nom de votre choix

Ouvrir ce dossier depuis Visual Studio Code 

Si vous ne possédez pas Git, il faut l’installer. Pour cela, utilisez ce lien si vous êtes sur Windows : https://gitforwindows.org/ et celui-ci si vous êtes sur Mac : https://sourceforge.net/projects/git-osx-installer/files/ . Ouvrez un terminal sur votre ordinateur et entrez ces deux lignes de commandes : 
git config --global user.name "Mon Nom" 
git config --global user.email "votreemail@votreemail.com" 
Remplacez le contenu des guillemets par le contenu de votre choix

Ouvrez un terminal dans Visual Studio Code

Ecrivez git clone https://github.com/JosseLebas/P2I.git dans le terminal afin de récupérer le projet 

Faites cd P2I pour se placer dans le bon dossier

Ecrivez git checkout master pour se placer sur la bonne branche

Si vous ne possédez pas node.js, il faut l’installer. Pour cela, téléchargez le fichier de ce lien : https://nodejs.org/en/

Effectuez maintenant les deux commandes suivantes dans le terminal :  
npm i -g expo-cli
npm install

 Remplacer dans le code, tous les import { ViewPropTypes } from ‘react-native’ par import { ViewPropTypes } from 'deprecated-react-native-prop-types' des fichiers .js dans le dossier node_modules\react-native-snap-carousel.
Il y a en tout 4 fichiers à modifier : 
node_modules\react-native-snap-carousel\src\parallaximage\ParallaxImage.js
node_modules\react-native-snap-carousel\src\pagination\PaginationDot.js
node_modules\react-native-snap-carousel\src\pagination\Pagination.js
node_modules\react-native-snap-carousel\src\carousel\Carousel.js
	Pensez à enregistrer les modifications ! 
Exemple : 
Ancien code : 
import { Animated, Easing, FlatList, I18nManager, Platform, ScrollView, View, ViewPropTypes } from 'react-native';
Nouveau code : 
import { Animated, Easing, FlatList, I18nManager, Platform, ScrollView, View } from 'react-native';
import { ViewPropTypes } from 'deprecated-react-native-prop-types';

Pour lancer l’application, faites maintenant npx expo start, puis flashez le QR code avec votre smartphone si vous possédez expo go, ou lancez l’application sur un émulateur. Vous pouvez maintenant jouer ! 

