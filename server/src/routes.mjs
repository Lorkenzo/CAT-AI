import express from 'express';
import fileRoutes from './routes/fileRoutes.mjs';

const router = express.Router();

router.use("/file",fileRoutes);


export default router;