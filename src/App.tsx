// Librairies
import { useState, useEffect, useRef } from "react";
import { shuffle } from "lodash";
import { format } from "date-fns";
// Composants
import Menu from "./components/Menu.tsx";
import Card from "./components/Card.tsx";
import VictoryBanner from "./components/VictoryBanner.tsx";
// Enums
import { type GameSize, GAME_SIZE_VALUES } from "./enums/game_size.ts";
// Assets
import boardImage from "./assets/board.jpg";
import redCard from "./assets/card_1.png";
import greenCard from "./assets/card_2.png";
import blueCard from "./assets/card_3.png";
import orangeCard from "./assets/card_4.png";
import purpleCard from "./assets/card_5.png";

function App() {
  // Gère le lancement de la partie
  const [hasGameStarted, setHasGameStarted] = useState(false);

  // Gère le nombre d'essaies
  const [numberOfTries, setNumberOfTries] = useState<number>(0);

  // Gère le chronomètre
  const [chrono, setChrono] = useState<number>(0);
  const timerRef = useRef<number | null>(null);
  const formatTime = (s: number) => format(new Date(s * 1000), "mm:ss");

  // Deck de base et nombre de paires souhaité
  const baseCards = [redCard, greenCard, blueCard, orangeCard, purpleCard];
  const [gameSize, setGameSize] = useState<GameSize>("Small"); // Utilise un enum pour définir le nombre de paires

  /* 
  Fonction makeDeck qui transforme le paquet de cartes uniques en un paquet de paires de cartes avec un nombre gameSize de paires
  avant de le mélanger à l'aide de shuffle de la librairie lodash
  */
  const makeDeck = (size: GameSize) => {
    const pairs = GAME_SIZE_VALUES[size]; // map type -> nombre de paires par carte
    return shuffle(baseCards.flatMap((card) => Array(2 * pairs).fill(card)));
  };

  // Créer le deck mélangé à l'aide makeDeck avec un setter pour pouvoir relancer une partie
  const [shuffledDeck, setShuffledDeck] = useState<string[]>([]);

  // Tableau d'index des cartes face recto
  const [flippedCards, setFlippedCards] = useState<number[]>([]);
  // Valeurs et id des cartes choisis
  const [choiceOne, setChoiceOne] = useState<string | null>(null);
  const [choiceTwo, setChoiceTwo] = useState<string | null>(null);
  const [choiceOneId, setChoiceOneId] = useState<number | null>(null);
  const [choiceTwoId, setChoiceTwoId] = useState<number | null>(null);
  // Verrou pendant le repliage
  const [lock, setLock] = useState(false);
  // Gère la victoire
  const [hasWon, setHasWon] = useState(false);

  function selectCard(index: number) {
    if (lock) return; // Vérifie qu'on soit pas en train de replier
    if (flippedCards.includes(index)) return; // Vérifie que la carte est pas déjà face recto
    if (index === choiceOneId) return; // Vérifie que la carte n'est pas la même que la 1ère

    // On récupère la valeur de la carte dans le deck grâce à son index
    const cardType = shuffledDeck[index];
    // Retourne la carte
    setFlippedCards((prev) => (prev.includes(index) ? prev : [...prev, index]));

    // Si on a pas de choix n°1 on le mémorise
    if (choiceOne === null) {
      setChoiceOne(cardType);
      setChoiceOneId(index);
      setNumberOfTries((prev) => prev + 1);
      return;
    }

    // Sinon on mémorise le choix numéro 2 si null
    if (choiceTwo === null) {
      setChoiceTwo(cardType);
      setChoiceTwoId(index);
      return;
    }
  }

  // Gère les états pour démarrer la partie
  function startGame(size: GameSize) {
    setHasGameStarted(true);
    setChrono(0);
    setNumberOfTries(0);
    setHasWon(false);
    setLock(false);
    setChoiceOne(null);
    setChoiceTwo(null);
    setChoiceOneId(null);
    setChoiceTwoId(null);
    setFlippedCards([]);
    setGameSize(size);
    setShuffledDeck(makeDeck(size));
  }

  // Gère les états pour redémarrer la partie
  function resetGame() {
    setHasGameStarted(false);
    setChrono(0);
    setNumberOfTries(0);
    setFlippedCards([]);
    setChoiceOne(null);
    setChoiceTwo(null);
    setChoiceOneId(null);
    setChoiceTwoId(null);
    setLock(false);
    setHasWon(false);
    setShuffledDeck(makeDeck(gameSize));
  }

  /* 
  Action déclenché à chaque fois qu’une paire de cartes est sélectionnée.
  On gère les états des cartes en fonction du choix du joueur.
  */
  useEffect(() => {
    // Si une des deux sélections est absente, on ne fait rien pour l'instant.
    if (choiceOne == null || choiceTwo == null) return;

    // Paire trouvée :
    if (choiceOne === choiceTwo) {
      // On réinitialise les choix pour continuer le jeu
      setChoiceOne(null);
      setChoiceTwo(null);
      setChoiceOneId(null);
      setChoiceTwoId(null);
      return;
    }

    // Pas de paire :
    setLock(true); // On verrouille

    // "Animation" de 1s avant de remettre les cartes face verso
    const closeMismatchTimeoutId = setTimeout(() => {
      // On retire de la liste des cartes face recto les deux indices sélectionnés
      setFlippedCards((prev) =>
        prev.filter(
          (cardIndex) => cardIndex !== choiceOneId && cardIndex !== choiceTwoId
        )
      );

      // On réinitialise la sélection et on déverrouille
      setChoiceOne(null);
      setChoiceTwo(null);
      setChoiceOneId(null);
      setChoiceTwoId(null);
      setLock(false);
    }, 1000);

    // Nettoyage si l’effet est relancé/annulé avant la fin du timeout.
    return () => clearTimeout(closeMismatchTimeoutId);
  }, [choiceOne, choiceTwo, choiceOneId, choiceTwoId]);

  /* 
  Action déclenché à chaque fois qu’une paire de cartes est sélectionnée.
  On gère la victoire si toutes les cartes sont trouvées.
  */
  useEffect(() => {
    if (
      choiceOne === null &&
      choiceTwo === null &&
      shuffledDeck.length > 0 &&
      flippedCards.length === shuffledDeck.length
    ) {
      setHasWon(true);
    }
  }, [flippedCards, choiceOne, choiceTwo, shuffledDeck, setLock]);

  /* 
  Action déclenché à chaque fois qu’une partie commence ou se termine.
  On gère le timer.
  */
  useEffect(() => {
    if (!hasGameStarted || hasWon) return; // ne lance pas si pas de partie ou déjà gagné

    // On incrémente le timer toute les secondes
    timerRef.current = window.setInterval(() => {
      setChrono((t) => t + 1);
    }, 1000);

    // On nettoie l'effet en arrêtant le timer actif pour éviter qu'il continue en arrière-plan
    return () => {
      if (timerRef.current !== null) {
        window.clearInterval(timerRef.current);
        timerRef.current = null;
      }
    };
  }, [hasGameStarted, hasWon]);

  return (
    <section
      className="main-section"
      style={{ backgroundImage: `url(${boardImage})` }}
    >
      {!hasGameStarted && <Menu onStart={startGame} />}
      {hasWon && (
        <VictoryBanner
          onReplay={resetGame}
          triesScore={numberOfTries}
          timeScore={formatTime(chrono)}
        />
      )}
      {hasGameStarted && (
        <section className="card-grid">
          {shuffledDeck.map((card: string, index: number) => (
            <Card
              onClick={() => selectCard(index)}
              key={index}
              index={index}
              gameSize={gameSize}
              isFlipped={flippedCards.includes(index)}
              cardFrontSide={card}
            />
          ))}
          <div className="game-score">{numberOfTries}</div>
          <div className="game-score">{formatTime(chrono)}</div>
        </section>
      )}
    </section>
  );
}

export default App;
