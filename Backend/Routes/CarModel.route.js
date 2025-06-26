import express from 'express';
import {
     getAllModels,
     getModelById,
     createModel,
     updateModel,
     deleteModel,
} from '../Controllers/CarModel.controller.js';

const CarModelRouter = express.Router();

CarModelRouter.get('/', getAllModels);
CarModelRouter.get('/:id', getModelById);
CarModelRouter.post('/', createModel);
CarModelRouter.put('/:id', updateModel);
CarModelRouter.delete('/:id', deleteModel);

export default CarModelRouter;