export type PouchFlavor = {
  name: string;
  layers: string[];
  foam?: string;
  garnish?: string;
};

export const FLAVORS: PouchFlavor[] = [
  {
    name: "Матча латте",
    layers: ["#3c5a2a", "#6f9a4a", "#a9c98a"],
    foam: "#f4f1e6",
    garnish: "#7fae52",
  },
  {
    name: "Карамельный фраппе",
    layers: ["#6b3d1a", "#a9702f", "#d9ac6c"],
    foam: "#f6ead2",
    garnish: "#c98a3d",
  },
  {
    name: "Velvety Delight",
    layers: ["#7a3347", "#b5647f", "#e6b7c4"],
    foam: "#faf1ee",
    garnish: "#c94f6f",
  },
  {
    name: "Классик латте",
    layers: ["#4a3324", "#8a6a48", "#d8c6a8"],
    foam: "#f7f0e1",
    garnish: "#a9835a",
  },
  {
    name: "Шоколад-мокко",
    layers: ["#2c1c14", "#5b3a26", "#8f6748"],
    foam: "#efe0cd",
    garnish: "#6b4327",
  },
  {
    name: "Малиновый крем",
    layers: ["#5c1c2e", "#a13355", "#e58fa6"],
    foam: "#fbeef1",
    garnish: "#d94f74",
  },
];

export function PouchVisual({ flavor }: { flavor: PouchFlavor }) {
  const n = flavor.layers.length;
  return (
    <div className="base-pouch">
      <div className="base-pouch-window">
        <div className="base-pouch-drink">
          {flavor.layers.map((color, i) => (
            <span
              key={i}
              className="base-pouch-layer"
              style={{
                background: color,
                bottom: `${(i * 100) / n}%`,
                height: `${100 / n + 1}%`,
              }}
            />
          ))}
          {flavor.foam && (
            <span className="base-pouch-foam" style={{ background: flavor.foam }} />
          )}
          {flavor.garnish && (
            <>
              <span
                className="base-pouch-garnish"
                style={{
                  background: flavor.garnish,
                  width: "10%",
                  height: "10%",
                  top: "14%",
                  left: "30%",
                }}
              />
              <span
                className="base-pouch-garnish"
                style={{
                  background: flavor.garnish,
                  width: "7%",
                  height: "7%",
                  top: "22%",
                  left: "52%",
                }}
              />
            </>
          )}
        </div>
      </div>
      <span className="base-pouch-badge">the BASE</span>
      <span className="base-pouch-name">{flavor.name}</span>
    </div>
  );
}
