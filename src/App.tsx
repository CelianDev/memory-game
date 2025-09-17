// Librairies
import { shuffle } from "lodash";
// Composants
import Card from "./components/Card.tsx";
// Assets
import boardImage from "./assets/board.jpg";
import redCard from "./assets/card_1.png";
import greenCard from "./assets/card_2.png";
import blueCard from "./assets/card_3.png";
import orangeCard from "./assets/card_4.png";
import purpleCard from "./assets/card_5.png";

const numberOfPairs = 1;
const baseCards = [redCard, greenCard, blueCard, orangeCard, purpleCard];

/* 
Transforme le paquet de cartes uniques en un paquet de paires de cartes avec un nombre numberOfPairs de paires
avant de le mélanger à l'aide de shuffle de la librairie lodash
puis créer un composant Card pour chaque cartes du paquet avec index et valeur en props.
*/
const shuffledCards = shuffle(
  baseCards.flatMap((card) => Array(2 * numberOfPairs).fill(card))
).map((card: string, index: number) => (
  <Card key={index} index={index} card={card} />
));

function App() {
  return (
    <div
      className="min-h-screen max-h-screen min-w-screen bg-cover bg-center flex content-center justify-center"
      style={{ backgroundImage: `url(${boardImage})` }}
    >
      <div className="grid h-full  gap-3 p-4 grid-cols-5 place-items-center-stretch">
        {shuffledCards}
      </div>
    </div>
  );
}

export default App;
