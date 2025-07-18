import express from 'express';
import fileRoutes from './routes/fileRoutes.mjs';
import generateRoutes from './routes/generateRoutes.mjs'

const router = express.Router();

router.use("/file",fileRoutes);
router.use("/generate",generateRoutes)


export default router;