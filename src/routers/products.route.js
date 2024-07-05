import { Router } from "express";

const router = Router();

router.get('/', (req, res) => {
    res.send('Hello World');
});

router.get('/:pid', (req, res) => {
    res.send('Hello World pid');
});

export default router;