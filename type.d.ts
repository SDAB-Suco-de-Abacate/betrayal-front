type Siblings = {
	top: boolean;
	bottom: boolean;
	left: boolean;
	right: boolean;
};

type TilesProps = {
	id: string;
	siblings: Siblings;
	position: {
		x: number;
		y: number;
		z: number;
	};
	rotation: number;
};

type PreviewProps = {
	id: string;
	connection: string;
	position: {
		x: number;
		y: number;
		z: number;
	};
	rotation: number;
};
