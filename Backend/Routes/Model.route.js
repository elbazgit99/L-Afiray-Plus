import express from 'express';
import {
     getAllModels,
     getModelById,
     createModel,
     updateModel,
     deleteModel,
} from '../Controllers/Model.controller.js';

const ModelRouter = express.Router();

ModelRouter.get('/', getAllModels);
ModelRouter.get('/:id', getModelById);
ModelRouter.post('/', createModel);
ModelRouter.put('/:id', updateModel);
ModelRouter.delete('/:id', deleteModel);

export default ModelRouter;