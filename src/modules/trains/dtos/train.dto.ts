export class TrainDto {
  id: number;
  name: string;
  departure: Date;
  arrival: Date;
  origin: string;
  destination: string;

  userId: number;
  createdAt: Date;
  updatedAt: Date;
}
