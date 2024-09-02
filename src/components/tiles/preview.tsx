import { useTexture } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import { useEffect, useState } from "react";
import useStoreMain from "../../store/storeTiles.tsx";

const ROTATIONS = [0, Math.PI / 2, Math.PI, (3 * Math.PI) / 2];

const rotateSiblings = (siblings: Siblings, rotation: number) => {
	const rotationsMap = {
		[Math.PI / 2]: {
			top: Boolean(siblings.left),
			right: Boolean(siblings.top),
			bottom: Boolean(siblings.right),
			left: Boolean(siblings.bottom),
		},
		[Math.PI]: {
			top: Boolean(siblings.bottom),
			right: Boolean(siblings.left),
			bottom: Boolean(siblings.top),
			left: Boolean(siblings.right),
		},
		[(3 * Math.PI) / 2]: {
			top: Boolean(siblings.right),
			right: Boolean(siblings.bottom),
			bottom: Boolean(siblings.left),
			left: Boolean(siblings.top),
		},
	};
	return rotationsMap[rotation % (2 * Math.PI)] || siblings;
};

const findClosestRotationIndex = (rotation: number, rotations: number[]) =>
	rotations.reduce(
		(prev, curr, idx) =>
			Math.abs(curr - rotation) < Math.abs(rotations[prev] - rotation)
				? idx
				: prev,
		0,
	);

export default function Preview({
	data: { position, rotation },
}: { data: PreviewProps }) {
	const { x, y, z } = position;
	const { availableTile, tiles, increaseTiles, increasePreview } = useStoreMain(
		(state) => ({
			availableTile: state.availableTiles?.[0],
			tiles: state.tiles,
			increaseTiles: state.increaseTiles,
			increasePreview: state.increasePreview,
		}),
	);

	const texture = useTexture("/assets/servants_quarters.jpg");

	const [currentRotation, setCurrentRotation] = useState(ROTATIONS[0]);
	const [targetRotation, setTargetRotation] = useState(rotation);
	const [currentSiblings, setCurrentSiblings] = useState(
		availableTile?.siblings,
	);
	const [hovered, setHovered] = useState(false);

	useEffect(() => rotateTile(), []);

	const rotateTile = () => {
		const validRotations = getValidRotations();
		if (!validRotations.length) return;

		const currentIdx = findClosestRotationIndex(
			currentRotation,
			validRotations,
		);
		const nextRotation =
			validRotations[(currentIdx + 1) % validRotations.length];

		setTargetRotation(nextRotation);
		setCurrentSiblings(rotateSiblings(availableTile?.siblings, nextRotation));
	};

	useFrame(() => {
		if (currentRotation !== targetRotation) {
			const delta = 0.1;
			const newRotation =
				currentRotation + delta * (targetRotation > currentRotation ? 1 : -1);

			setCurrentRotation(
				Math.abs(newRotation - targetRotation) < delta
					? targetRotation
					: newRotation,
			);
		}
	});

	const getValidRotations = () =>
		ROTATIONS.filter((angle) =>
			validateRotation(rotateSiblings(availableTile?.siblings, angle)),
		);

	const validateRotation = (newSiblings: Siblings) => {
		const adjacentTiles = [
			tiles.find((tile) => tile.position.x === x + 1 && tile.position.y === y),
			tiles.find((tile) => tile.position.x === x - 1 && tile.position.y === y),
			tiles.find((tile) => tile.position.x === x && tile.position.y === y + 1),
			tiles.find((tile) => tile.position.x === x && tile.position.y === y - 1),
		];

		return adjacentTiles.every((tile) =>
			!tile
				? true
				: (tile.position.x === x + 1 &&
						newSiblings.right === tile.siblings.left) ||
					(tile.position.x === x - 1 &&
						newSiblings.left === tile.siblings.right) ||
					(tile.position.y === y + 1 &&
						newSiblings.top === tile.siblings.bottom) ||
					(tile.position.y === y - 1 &&
						newSiblings.bottom === tile.siblings.top),
		);
	};

	const offsets = [
		{ offset: [1, 0, 0], siblingKey: "right" },
		{ offset: [0, 1, 0], siblingKey: "top" },
		{ offset: [-1, 0, 0], siblingKey: "left" },
		{ offset: [0, -1, 0], siblingKey: "bottom" },
	];

	const handleClick = () => {
		increaseTiles({
			id: `${x}_${y}`,
			position: { x, y, z },
			siblings: currentSiblings,
			rotation: currentRotation,
		});

		for (const {
			offset: [xOffset, yOffset],
			siblingKey,
		} of offsets) {
			if (currentSiblings[siblingKey]) {
				increasePreview({
					id: `preview_${x + xOffset}_${y + yOffset}`,
					connection: `${x}_${y}`,
					position: { x: x + xOffset, y: y + yOffset, z },
					rotation: 0,
				});
			}
		}
	};

	if (!availableTile) return null;

	return (
		<>
			{/* biome-ignore lint/a11y/useKeyWithClickEvents: <explanation> */}
			<mesh
				position={[x, y, z + (hovered ? 0.1 : 0)]}
				rotation={[0, 0, currentRotation]}
				onPointerEnter={() => setHovered(true)}
				onPointerLeave={() => setHovered(false)}
				onContextMenu={rotateTile}
				onClick={handleClick}
			>
				<pointLight position={[0, 0, 0.5]} intensity={0.5} />
				<boxGeometry args={[1, 1, 0.05]} />
				<meshStandardMaterial
					map={hovered ? texture : null}
					color={!hovered ? "gray" : undefined}
					key={hovered ? "hovered" : "not-hovered"}
				/>
			</mesh>
		</>
	);
}
