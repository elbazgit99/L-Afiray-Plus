import express from 'express';
import {
    getAllCarParts,
    getCarPartById,
    createCarPart,
    updateCarPart,
    deleteCarPart,
    getCarPartsByCarModel,
    getCarPartsByProducer
} from '../Controllers/CarParts.controller.js';

const CarPartsRouter = express.Router();

CarPartsRouter.get('/', getAllCarParts);
CarPartsRouter.get('/:id', getCarPartById);
CarPartsRouter.post('/', createCarPart);
CarPartsRouter.put('/:id', updateCarPart);
CarPartsRouter.delete('/:id', deleteCarPart);
CarPartsRouter.get('/carModel/:carModelId', getCarPartsByCarModel);
CarPartsRouter.get('/producer/:producerId', getCarPartsByProducer);

export default CarPartsRouter;