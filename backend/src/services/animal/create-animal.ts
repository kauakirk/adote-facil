import { Animal } from '@prisma/client'
import { Either, Failure, Success } from '../../utils/either.js'
import {
  AnimalRepository,
  animalRepositoryInstance,
} from '../../repositories/animal.js'
import {
  AnimalImageRepository,
  animalImageRepositoryInstance,
} from '../../repositories/animal-image.js'

// Refatorado: Apenas exporte o tipo diretamente
  export type CreateAnimalDTO = {
    name: string;
    type: string;
    gender: 'Macho' | 'Fêmea';
    race?: string;
    description?: string;
    userId: string;
    pictures: Buffer[];
  };

  export type Failure = { message: string }

  export type Success = { animal: Animal }

  export type Result = Either<Failure, Success>
}

export class CreateAnimalService {
  constructor(
    private readonly animalRepository: AnimalRepository,
    private readonly animalImageRepository: AnimalImageRepository,
  ) {}

  async execute(
    params: CreateAnimalDTO.Params,
  ): Promise<CreateAnimalDTO.Result> {
    const { name, type, gender, race, description, userId, pictures } = params

    const animal = await this.animalRepository.create({
      name,
      type,
      gender,
      race,
      description,
      userId,
    })

    if (!animal) {
      return Failure.create({ message: 'Erro ao criar o animal.' })
    }

    await Promise.all(
      pictures.map((picture) =>
        this.animalImageRepository.create({
          animalId: animal.id,
          imageData: picture,
        }),
      ),
    )

    return Success.create({ animal })
  }
}

export const createAnimalServiceInstance = new CreateAnimalService(
  animalRepositoryInstance,
  animalImageRepositoryInstance,
)
