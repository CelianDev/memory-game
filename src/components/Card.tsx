import cardBackSide from "../assets/card_0.png";
import { type GameSize } from "../enums/game_size";

type CardProps = {
  cardFrontSide: string;
  index: number;
  isFlipped: boolean;
  gameSize: GameSize;
  onClick: () => void;
};

const WIDTH_2XL: Record<GameSize, string> = {
  Small: "2xl:w-10/12",
  Medium: "2xl:w-9/12",
  Large: "2xl:w-8/12",
};

function Card({ cardFrontSide, index, isFlipped, gameSize, onClick }: CardProps) {
  const base = "w-full md:w-4/5 aspect-[2/3] overflow-hidden rounded-xl shadow";
  const className = `${base} ${WIDTH_2XL[gameSize]}`;

  function revealCard() {
    onClick();
  }

  return (
    <div
      onClick={revealCard}
      className={className}
    >
      <img
        src={isFlipped ? cardFrontSide : cardBackSide}
        alt={`Carte ${index}`}
        className="h-full w-full object-cover block"
      />
    </div>
  );
}

export default Card;
