import { create } from "zustand";

interface StoreState {
	tiles: TilesProps[];
	preview: PreviewProps[];
	availableTiles: TilesProps[];

	remainingTiles: number;

	increaseTiles: (newTile: TilesProps) => void;
	increasePreview: (newPreview: PreviewProps) => void;
}

const useStoreMain = create<StoreState>((set) => ({
	tiles: [
		{
			id: "0_0",
			siblings: { top: true, bottom: true, left: true, right: true },
			position: { x: 0, y: 0, z: 0 },
			rotation: 0,
		},
	],
	preview: [
		{
			id: "preview_1_0",
			connection: "0_0",
			position: { x: 1, y: 0, z: 0 },
			rotation: 0,
		},
		/*{
      id: "preview_0_1",
      connection: "0_0",
      position: { x: 0, y: 1, z: 0 },
      rotation: 0,
    },
    {
      id: "preview_-1_0",
      connection: "0_0",
      position: { x: -1, y: 0, z: 0 },
      rotation: 0,
    },
    {
      id: "preview_0_-1",
      connection: "0_0",
      position: { x: 0, y: -1, z: 0 },
      rotation: 0,
    },*/
	],

	availableTiles: [
		{
			id: "tile_1",
			siblings: { top: true, right: false, bottom: true, left: false },
			position: { x: 0, y: 0, z: 0 },
			rotation: 0,
		},
		{
			id: "tile_2",
			siblings: { top: false, right: true, bottom: false, left: true },
			position: { x: 0, y: 0, z: 0 },
			rotation: 0,
		},
		{
			id: "tile_3",
			siblings: { top: false, right: true, bottom: false, left: true },
			position: { x: 0, y: 0, z: 0 },
			rotation: 0,
		},
		// Adicione mais tiles conforme necessário
	],

	remainingTiles: 3,

	increaseTiles: (newTile: TilesProps) => {
		set((state) => ({
			tiles: [...state.tiles, newTile],
			preview: state.preview.filter(
				(p) => p.id !== `preview_${newTile.position.x}_${newTile.position.y}`,
			),
			availableTiles: state.availableTiles.slice(1),
			remainingTiles: state.remainingTiles - 1,
		}));
	},

	increasePreview: (newPreview: PreviewProps) => {
		set((state) => {
			const tileExists = state.tiles.some(
				(tile) =>
					tile.position.x === newPreview.position.x &&
					tile.position.y === newPreview.position.y,
			);

			const previewExists = state.preview.some(
				(preview) =>
					preview.position.x === newPreview.position.x &&
					preview.position.y === newPreview.position.y,
			);

			if (!tileExists && !previewExists) {
				return {
					preview: [...state.preview, newPreview],
				};
			}
			return {};
		});
	},
}));

export default useStoreMain;
