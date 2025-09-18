import type { GameSize } from "../enums/game_size";

type MenuProps = {
  onStart: (size: GameSize) => void;
};

function Menu({ onStart }: MenuProps) {
  return (
    <section className="game-menu">
      <h2 className="p-4">TAILLE DU PLATEAU</h2>
      <div className="gap-3 p-4 flex flex-row justify-center items-center">
        <div className="menu-btn" onClick={() => onStart("Small")}>PETIT</div>
        <div className="menu-btn" onClick={() => onStart("Medium")}>INTERMÉDIAIRE</div>
        <div className="menu-btn" onClick={() => onStart("Large")}>GRAND</div>
      </div>
    </section>
  );
}

export default Menu;
