import express from 'express';
// Importing the controller functions from Producer.controller.js
import {
     createProducer,
     getAllProducers,
     getProducerById,
     updateProducer,
     deleteProducer,
} from "../Controllers/Producer.controller.js"

const ProducerRouter = express.Router();

ProducerRouter.post('/', createProducer);
ProducerRouter.get('/', getAllProducers);
ProducerRouter.get('/:id', getProducerById);
ProducerRouter.put('/:id', updateProducer);
ProducerRouter.delete('/:id', deleteProducer);

export default ProducerRouter;