export class CreateTrainDto {
  name: string;
  departure: Date;
  arrival: Date;
  origin: string;
  destination: string;

  userId: number;
}
