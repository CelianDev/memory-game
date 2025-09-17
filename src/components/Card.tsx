type CardProps = {
  card: string; // l’URL de l’image
  index: number; // si tu veux l'index
};

function Card({ card, index }: CardProps) {
  return (
    <>
      <div className="w-full aspect-[2/3] overflow-hidden rounded-xl shadow">
        <img
          src={card}
          alt={`Carte ${index}`}
          className="h-full w-full object-cover block"
        />
      </div>
    </>
  );
}

export default Card;
