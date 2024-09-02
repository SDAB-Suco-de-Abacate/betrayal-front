import { useTexture } from "@react-three/drei";

export default function Tile({ data }: { data: TilesProps }) {
	const { x, y, z } = data.position;
	const { id, rotation, siblings } = data;
	const texture = useTexture("/assets/servants_quarters.jpg");

	const connectionHeight = 0.05;
	const connectionWidth = 0.2;

	return (
		<>
			<mesh position={[x, y, z]} rotation={[0, 0, rotation]}>
				<boxGeometry args={[1, 1, 0.05]} />
				<meshStandardMaterial key={id} map={texture} />

				<pointLight position={[0, 0, 0.5]} intensity={0.5} />
			</mesh>

			{/*{siblings.top && (
				<mesh position={[x, y + 0.5, connectionHeight]}>
					<boxGeometry args={[connectionWidth, 0.1, 0.05]} />
					<meshStandardMaterial color="white" />
				</mesh>
			)}

			{siblings.bottom && (
				<mesh position={[x, y - 0.5, connectionHeight]}>
					<boxGeometry args={[connectionWidth, 0.1, 0.05]} />
					<meshStandardMaterial color="white" />
				</mesh>
			)}

			{siblings.left && (
				<mesh position={[x - 0.5, y, connectionHeight]}>
					<boxGeometry args={[0.1, connectionWidth, 0.05]} />
					<meshStandardMaterial color="white" />
				</mesh>
			)}

			{siblings.right && (
				<mesh position={[x + 0.5, y, connectionHeight]}>
					<boxGeometry args={[0.1, connectionWidth, 0.05]} />
					<meshStandardMaterial color="white" />
				</mesh>
			)}*/}
		</>
	);
}
