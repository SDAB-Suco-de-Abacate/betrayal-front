import { OrbitControls } from "@react-three/drei";
import { Canvas } from "@react-three/fiber";
import { useEffect } from "react";

import Preview from "./components/tiles/preview.tsx";
import Tile from "./components/tiles/tiles.tsx";
import useStoreMain from "./store/storeTiles.tsx";

const App = () => {
	const tiles = useStoreMain((state) => state.tiles);
	const preview = useStoreMain((state) => state.preview);
	const remainingTiles = useStoreMain((state) => state.remainingTiles);

	useEffect(() => {
		console.log("Tiles: ", tiles);
	}, [tiles]);

	useEffect(() => {
		console.log("Preview: ", preview);
	}, [preview]);

	return (
		<>
			<div
				style={{
					position: "absolute",
					top: 10,
					left: 10,
					color: "white",
					fontSize: "20px",
					backgroundColor: "rgba(0, 0, 0, 0.5)",
					padding: "10px",
					borderRadius: "5px",
				}}
			>
				Tiles restantes: {remainingTiles}
			</div>

			<Canvas
				style={{ height: "100%", width: "100%" }}
				camera={{ position: [0, 20, 20], fov: 10 }}
			>
				<mesh rotation={[-Math.PI / 2, 0, 0]}>
					{tiles.map((t) => (
						<Tile key={t.id} data={t} />
					))}

					{remainingTiles &&
						preview.map((t) => <Preview key={t.id} data={t} />)}
				</mesh>

				<OrbitControls />
			</Canvas>
		</>
	);
};

export default App;
